import { Pinecone } from "@pinecone-database/pinecone";

const apiKey = process.env.PINECONE_API_KEY || "dummy_key_for_build_time";
const indexName = process.env.PINECONE_INDEX_NAME || "dummy-index";

const pinecone = new Pinecone({
  apiKey,
});

export const pineconeIndex = pinecone.index(indexName);

