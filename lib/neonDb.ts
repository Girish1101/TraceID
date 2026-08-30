import { neon } from "@neondatabase/serverless";
import { LocalCase, SystemStats } from "./localStore";

const connectionString = process.env.NEON_DATABASE_URL || process.env.DATABASE_URL;

export function getNeonSql() {
  if (!connectionString) return null;
  return neon(connectionString);
}

let initialized = false;

export async function initNeonTables() {
  const sql = getNeonSql();
  if (!sql || initialized) return;
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS missing_persons (
        id TEXT PRIMARY KEY,
        username TEXT NOT NULL,
        age INT,
        height INT,
        description TEXT,
        last_seen_location TEXT,
        image_url TEXT,
        embedding_vector JSONB,
        enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS system_stats (
        id INT PRIMARY KEY DEFAULT 1,
        scans_run INT DEFAULT 12,
        matches_confirmed INT DEFAULT 3
      );
    `;

    await sql`
      INSERT INTO system_stats (id, scans_run, matches_confirmed)
      VALUES (1, 12, 3)
      ON CONFLICT (id) DO NOTHING;
    `;

    initialized = true;
  } catch (err) {
    console.error("[NeonDB] Table initialization error:", err);
  }
}

export async function getNeonCases(): Promise<LocalCase[]> {
  const sql = getNeonSql();
  if (!sql) return [];
  try {
    await initNeonTables();
    const rows = await sql`
      SELECT 
        id as _id,
        username,
        age,
        height,
        description,
        last_seen_location as "lastSeenLocation",
        image_url as "imageUrl",
        embedding_vector as "embeddingVector",
        enrolled_at as "enrolledAt",
        updated_at as "updatedAt"
      FROM missing_persons
      ORDER BY enrolled_at DESC;
    `;
    return rows.map((r: any) => ({
      _id: r._id,
      username: r.username,
      age: r.age,
      height: r.height,
      description: r.description,
      lastSeenLocation: r.lastSeenLocation,
      imageUrl: r.imageUrl,
      embeddingVector: typeof r.embeddingVector === "string" ? JSON.parse(r.embeddingVector) : r.embeddingVector,
      enrolledAt: new Date(r.enrolledAt).toISOString(),
      updatedAt: new Date(r.updatedAt).toISOString(),
    }));
  } catch (err) {
    console.error("[NeonDB] getNeonCases error:", err);
    return [];
  }
}

export async function saveNeonCase(caseData: Omit<LocalCase, "_id" | "enrolledAt" | "updatedAt">): Promise<LocalCase | null> {
  const sql = getNeonSql();
  if (!sql) return null;
  try {
    await initNeonTables();
    const newId = `neon-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const now = new Date().toISOString();

    await sql`
      INSERT INTO missing_persons (
        id, username, age, height, description, last_seen_location, image_url, embedding_vector, enrolled_at, updated_at
      ) VALUES (
        ${newId},
        ${caseData.username},
        ${caseData.age || null},
        ${caseData.height || null},
        ${caseData.description || ""},
        ${caseData.lastSeenLocation || ""},
        ${caseData.imageUrl},
        ${JSON.stringify(caseData.embeddingVector || [])},
        ${now},
        ${now}
      );
    `;

    return {
      _id: newId,
      ...caseData,
      enrolledAt: now,
      updatedAt: now,
    };
  } catch (err) {
    console.error("[NeonDB] saveNeonCase error:", err);
    return null;
  }
}

export async function getNeonStats(): Promise<SystemStats> {
  const sql = getNeonSql();
  if (!sql) return { scansRun: 12, matchesConfirmed: 3 };
  try {
    await initNeonTables();
    const rows = await sql`SELECT scans_run, matches_confirmed FROM system_stats WHERE id = 1;`;
    if (rows.length > 0) {
      return {
        scansRun: rows[0].scans_run,
        matchesConfirmed: rows[0].matches_confirmed,
      };
    }
    return { scansRun: 12, matchesConfirmed: 3 };
  } catch (err) {
    console.error("[NeonDB] getNeonStats error:", err);
    return { scansRun: 12, matchesConfirmed: 3 };
  }
}

export async function recordNeonScan(matchFound: boolean): Promise<SystemStats> {
  const sql = getNeonSql();
  if (!sql) return { scansRun: 12, matchesConfirmed: 3 };
  try {
    await initNeonTables();
    if (matchFound) {
      await sql`UPDATE system_stats SET scans_run = scans_run + 1, matches_confirmed = matches_confirmed + 1 WHERE id = 1;`;
    } else {
      await sql`UPDATE system_stats SET scans_run = scans_run + 1 WHERE id = 1;`;
    }
    return getNeonStats();
  } catch (err) {
    console.error("[NeonDB] recordNeonScan error:", err);
    return { scansRun: 12, matchesConfirmed: 3 };
  }
}
