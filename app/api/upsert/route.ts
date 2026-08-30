import { pineconeIndex } from "@/lib/pinecone";
import { v4 as uuidv4 } from "uuid";

export const dynamic = "force-static";

export async function POST(req: Request) {
  const {
    embedding,
  username,
  age,
  height,
  description,
  lastSeenLocation,
  imageUrl,
} = await req.json();


  const id = uuidv4();

await pineconeIndex.upsert([
  {
    id: uuidv4(),
    values: embedding,   // ✅ ONLY number[]
    metadata: {
      username,
      age,
      height,
      description,
      lastSeenLocation,
      imageUrl,
    },
  },
]);


  return Response.json({ success: true, id });
}
