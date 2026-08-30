import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import MissingPerson from "@/app/models/missingPersonModel";


const MONGODB_URI = process.env.MongoURL as string;
const FLASK_URL   = process.env.FLASK_URL || "http://localhost:5000";

async function connectDB() {
  if (!MONGODB_URI) return false;
  if (mongoose.connection.readyState >= 1) return true;
  try {
    await mongoose.connect(MONGODB_URI);
    return true;
  } catch (err) {
    console.warn("[crowd-face] MongoDB connection failed:", err);
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

async function getEmbedding(faceBlob: Blob) {
  const formData = new FormData();
  formData.append("image", faceBlob, "face.jpg");

  const res = await fetch(`${FLASK_URL}/get_embeddings`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) return null;

  const data = await res.json();
  return data.embedding_vector;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const faces = formData.getAll("faces") as Blob[];

    if (!faces || faces.length === 0) {
      return NextResponse.json(
        { error: "No faces received" },
        { status: 400 }
      );
    }

    await connectDB();

    const persons = await MissingPerson.find();

    const threshold = 0.40;
    const matches: any[] = [];

    for (let i = 0; i < faces.length; i++) {
      const embedding = await getEmbedding(faces[i]);

      if (!embedding) continue;

      let bestScore = -1;
      let bestPerson = null;

      for (const person of persons) {
        const score = cosineSimilarity(
          embedding,
          person.embeddingVector
        );

        if (score > bestScore) {
          bestScore = score;
          bestPerson = person;
        }
      }

      if (bestScore >= threshold && bestPerson) {
        matches.push({
          faceIndex: i,
          similarity: bestScore,
          person: {
            id: bestPerson._id,
            username: bestPerson.username,
            age: bestPerson.age,
            height: bestPerson.height,
            description: bestPerson.description,
            lastSeenLocation: bestPerson.lastSeenLocation,
            imageUrl: bestPerson.imageUrl,
          },
        });
      }
    }

    return NextResponse.json({
      facesProcessed: faces.length,
      matchesFound: matches.length,
      matches,
    });
  } catch (err: unknown) {
    console.error("[crowd-face]", err);
    const message =
      err instanceof Error ? err.message : "Internal server error";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}