import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import MissingPerson from "@/app/models/missingPersonModel";
import { getLocalCases, recordScanActivity } from "@/lib/localStore";
import { getNeonCases, recordNeonScan, getNeonSql } from "@/lib/neonDb";

const MONGODB_URI = process.env.MongoURL as string;
const FLASK_URL   = process.env.FLASK_URL || "http://localhost:5000";

async function connectDB() {
  if (!MONGODB_URI) return false;
  if (mongoose.connection.readyState >= 1) return true;
  try {
    await mongoose.connect(MONGODB_URI);
    return true;
  } catch (err) {
    console.warn("[identify-face] MongoDB connection failed:", err);
    return false;
  }
}

function cosineSimilarity(a: number[], b: number[]) {
  let dot = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
  }
  return dot;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { imageUrl } = body;

    if (!imageUrl) {
      return NextResponse.json(
        { error: "imageUrl is required" },
        { status: 400 }
      );
    }

    // ── 1. Fetch image bytes (supports Data URIs & HTTP URLs) ────────────
    let imgBuffer: Buffer;
    if (imageUrl.startsWith("data:")) {
      const base64Data = imageUrl.split(",")[1];
      imgBuffer = Buffer.from(base64Data, "base64");
    } else {
      const imgRes = await fetch(imageUrl);
      if (!imgRes.ok) {
        return NextResponse.json({ error: "Failed to fetch image" }, { status: 400 });
      }
      imgBuffer = Buffer.from(await imgRes.arrayBuffer());
    }

    // ── 2. Get embedding from local/configured Flask service ─────────────
    const formData = new FormData();
    formData.append(
      "image",
      new Blob([new Uint8Array(imgBuffer)], { type: "image/jpeg" }),
      "face.jpg"
    );

    const flaskRes = await fetch(`${FLASK_URL}/get_embeddings`, {
      method: "POST",
      body: formData
    });

    if (!flaskRes.ok) {
      const errText = await flaskRes.text();
      return NextResponse.json(
        { error: `Embedding generation failed: ${errText}` },
        { status: 422 }
      );
    }

    const { embedding_vector } = await flaskRes.json();

    if (!embedding_vector || embedding_vector.length !== 512) {
      return NextResponse.json(
        { error: "Invalid embedding received" },
        { status: 422 }
      );
    }

    // ── 3. Load persons from Neon PostgreSQL if available, else DB, else local JSON store ─
    const hasNeon = Boolean(getNeonSql());
    let persons: any[] = [];
    if (hasNeon) {
      persons = await getNeonCases();
    } else {
      const isConnected = await connectDB();
      if (isConnected) {
        persons = await MissingPerson.find();
      } else {
        persons = getLocalCases();
      }
    }

    let bestMatch = null;
    let bestScore = -1;

    for (const person of persons) {
      if (!person.embeddingVector) continue;
      const score = cosineSimilarity(
        embedding_vector,
        person.embeddingVector
      );

      if (score > bestScore) {
        bestScore = score;
        bestMatch = person;
      }
    }

    const threshold = 0.40;
    const isMatch = Boolean(bestMatch && bestScore >= threshold);
    if (hasNeon) {
      await recordNeonScan(isMatch);
    } else {
      recordScanActivity(isMatch);
    }

    if (!isMatch || !bestMatch) {
      return NextResponse.json({
        result: "No match found",
        similarity: bestScore
      });
    }

    return NextResponse.json({
      result: "Match found",
      similarity: bestScore,
      person: {
        id: bestMatch._id,
        username: bestMatch.username,
        age: bestMatch.age,
        height: bestMatch.height,
        description: bestMatch.description,
        lastSeenLocation: bestMatch.lastSeenLocation,
        imageUrl: bestMatch.imageUrl
      }
    });

  } catch (err: unknown) {
    console.error("[identify-face]", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}