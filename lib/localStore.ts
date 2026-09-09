import fs from "fs";
import path from "path";

export interface LocalCase {
  _id: string;
  username: string;
  age: number;
  height?: number;
  description?: string;
  lastSeenLocation?: string;
  imageUrl: string;
  embeddingVector: number[];
  enrolledAt: string;
  updatedAt: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const FILE_PATH = path.join(DATA_DIR, "cases.json");
const STATS_FILE_PATH = path.join(DATA_DIR, "stats.json");

export interface SystemStats {
  scansRun: number;
  matchesConfirmed: number;
}

let inMemoryCases: LocalCase[] = [];
let inMemoryStats: SystemStats = { scansRun: 12, matchesConfirmed: 3 };

function ensureFilesExist() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(FILE_PATH)) {
      fs.writeFileSync(FILE_PATH, JSON.stringify([], null, 2), "utf-8");
    }
    if (!fs.existsSync(STATS_FILE_PATH)) {
      fs.writeFileSync(STATS_FILE_PATH, JSON.stringify({ scansRun: 12, matchesConfirmed: 3 }, null, 2), "utf-8");
    }
  } catch (err) {
    console.warn("[localStore] Filesystem initialization warning (read-only environment):", err);
  }
}

export function getLocalStats(): SystemStats {
  try {
    ensureFilesExist();
    if (fs.existsSync(STATS_FILE_PATH)) {
      const content = fs.readFileSync(STATS_FILE_PATH, "utf-8");
      return JSON.parse(content || '{"scansRun":12,"matchesConfirmed":3}');
    }
  } catch (err) {
    console.warn("[localStore] getLocalStats fallback:", err);
  }
  return inMemoryStats;
}

export function recordScanActivity(matchFound: boolean): SystemStats {
  ensureFilesExist();
  const stats = getLocalStats();
  stats.scansRun += 1;
  if (matchFound) {
    stats.matchesConfirmed += 1;
  }
  inMemoryStats = { ...stats };
  try {
    fs.writeFileSync(STATS_FILE_PATH, JSON.stringify(stats, null, 2), "utf-8");
  } catch (err) {
    console.warn("[localStore] recordScanActivity write warning:", err);
  }
  return stats;
}

export function getLocalCases(): LocalCase[] {
  try {
    ensureFilesExist();
    if (fs.existsSync(FILE_PATH)) {
      const content = fs.readFileSync(FILE_PATH, "utf-8");
      const cases = JSON.parse(content || "[]");
      if (cases.length > 0) return cases;
    }
  } catch (err) {
    console.warn("[localStore] getLocalCases error:", err);
  }
  return inMemoryCases;
}

export function saveLocalCase(caseData: Omit<LocalCase, "_id" | "enrolledAt" | "updatedAt">): LocalCase {
  ensureFilesExist();
  const cases = getLocalCases();
  const now = new Date().toISOString();
  const newCase: LocalCase = {
    _id: `local-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    ...caseData,
    enrolledAt: now,
    updatedAt: now,
  };
  cases.unshift(newCase);
  inMemoryCases = cases;
  try {
    fs.writeFileSync(FILE_PATH, JSON.stringify(cases, null, 2), "utf-8");
  } catch (err) {
    console.warn("[localStore] saveLocalCase write warning:", err);
  }
  return newCase;
}
