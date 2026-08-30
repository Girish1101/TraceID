import { NextResponse } from "next/server";
import mongoose from "mongoose";
import MissingPerson from "@/app/models/missingPersonModel";
import { getLocalCases, getLocalStats } from "@/lib/localStore";
import { getNeonCases, getNeonStats, getNeonSql } from "@/lib/neonDb";

const MONGODB_URI = process.env.MongoURL as string;

async function connectDB() {
  if (!MONGODB_URI) return false;
  if (mongoose.connection.readyState >= 1) return true;
  try {
    await mongoose.connect(MONGODB_URI);
    return true;
  } catch (err) {
    return false;
  }
}

export async function GET() {
  try {
    const hasNeon = Boolean(getNeonSql());
    if (hasNeon) {
      const neonStats = await getNeonStats();
      const neonCases = await getNeonCases();
      return NextResponse.json({
        profilesEnrolled: neonCases.length,
        scansRun: neonStats.scansRun,
        matchesConfirmed: neonStats.matchesConfirmed,
        recentCases: neonCases.slice(0, 6),
      });
    }

    const localStats = getLocalStats();
    let enrolledCount = 0;
    let recentCases: any[] = [];

    const isConnected = await connectDB();
    if (isConnected) {
      enrolledCount = await MissingPerson.countDocuments();
      recentCases = await MissingPerson.find().sort({ enrolledAt: -1 }).limit(6).lean();
    } else {
      const localCases = getLocalCases();
      enrolledCount = localCases.length;
      recentCases = localCases.slice(0, 6);
    }

    return NextResponse.json({
      profilesEnrolled: enrolledCount,
      scansRun: localStats.scansRun,
      matchesConfirmed: localStats.matchesConfirmed,
      recentCases,
    });
  } catch (err) {
    console.error("[stats-api]", err);
    const localCases = getLocalCases();
    const localStats = getLocalStats();
    return NextResponse.json({
      profilesEnrolled: localCases.length,
      scansRun: localStats.scansRun,
      matchesConfirmed: localStats.matchesConfirmed,
      recentCases: localCases.slice(0, 6),
    });
  }
}
