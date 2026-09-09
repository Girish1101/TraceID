// app/api/enroll-face/route.ts  (Next.js App Router)
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import MissingPerson from "@/app/models/missingPersonModel";
import { saveLocalCase } from "@/lib/localStore";
import { saveNeonCase, getNeonSql } from "@/lib/neonDb";
import { getOrFallbackEmbedding } from "@/lib/embeddingHelper";

export const dynamic = "force-static";

const MONGODB_URI = process.env.MongoURL as string;
const FLASK_URL   = process.env.FLASK_URL || "http://localhost:5000";

async function connectDB() {
  if (!MONGODB_URI) return false;
  if (mongoose.connection.readyState >= 1) return true;
  try {
    await mongoose.connect(MONGODB_URI);
    return true;
  } catch (err) {
    console.warn("[enroll-face] MongoDB connection failed:", err);
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, age, height, description, lastSeenLocation, imageUrl } = body;

    if (!username || age === undefined || !imageUrl) {
      return NextResponse.json(
        { error: "username, age, and imageUrl are required" },
        { status: 400 }
      );
    }

    // ── 1. Extract image Buffer (supports both Data URIs and HTTP URLs) ────
    let imgBuffer: Buffer;
    if (imageUrl.startsWith("data:")) {
      const base64Data = imageUrl.split(",")[1];
      imgBuffer = Buffer.from(base64Data, "base64");
    } else {
      const imgRes = await fetch(imageUrl);
      if (!imgRes.ok) {
        return NextResponse.json({ error: "Failed to fetch image from URL" }, { status: 400 });
      }
      imgBuffer = Buffer.from(await imgRes.arrayBuffer());
    }

    // ── 2. Get face embedding (Flask microservice or resilient standalone fallback) ──
    const embedding_vector = await getOrFallbackEmbedding(imgBuffer);

    // ── 3. Save to Neon PostgreSQL if available, else MongoDB, else local JSON store ──
    const hasNeon = Boolean(getNeonSql());
    let personId = "";

    if (hasNeon) {
      const neonPerson = await saveNeonCase({
        username,
        age: Number(age),
        height: height ? Number(height) : undefined,
        description,
        lastSeenLocation,
        imageUrl,
        embeddingVector: embedding_vector,
      });
      if (neonPerson) {
        personId = neonPerson._id;
      }
    }

    if (!personId) {
      const isConnected = await connectDB();
      if (isConnected) {
        const person = await MissingPerson.create({
          username,
          age: Number(age),
          height: height ? Number(height) : undefined,
          description,
          lastSeenLocation,
          imageUrl,
          embeddingVector: embedding_vector,
        });
        personId = person._id.toString();
      } else {
        const localPerson = saveLocalCase({
          username,
          age: Number(age),
          height: height ? Number(height) : undefined,
          description,
          lastSeenLocation,
          imageUrl,
          embeddingVector: embedding_vector,
        });
        personId = localPerson._id;
      }
    }

    return NextResponse.json(
      { message: "Person enrolled successfully", id: personId },
      { status: 201 }
    );
  } catch (err: unknown) {
    console.error("[enroll-face]", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}