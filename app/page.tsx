"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, UserPlus, ScanFace, ShieldCheck, Cpu, Search, Database } from "lucide-react";
import { getApiUrl } from "@/lib/config";

interface RecentCase {
  _id: string;
  username: string;
  age: number;
  height?: number;
  description?: string;
  lastSeenLocation?: string;
  imageUrl: string;
  enrolledAt: string;
}

interface StatsData {
  profilesEnrolled: number;
  scansRun: number;
  matchesConfirmed: number;
  recentCases?: RecentCase[];
}

export default function Home() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch(getApiUrl("/api/stats"));
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error("Failed to load operational stats", err);
      } finally {
        setLoadingStats(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="flex-1 flex flex-col bg-[#10151F] text-[#EDE9DF]">
      {/* ── 1. Ink-900 Hero Section ─────────────────────────────────────────────── */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-20 sm:py-28 max-w-[1280px] mx-auto w-full flex flex-col items-start justify-center overflow-hidden">
        {/* Subtle grid background lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#C9C2B20a_1px,transparent_1px),linear-gradient(to_bottom,#C9C2B20a_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          {/* Mono Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1B2333] border border-[#C9C2B2]/20 rounded-xs text-xs font-mono text-[#C68E3F] tracking-widest uppercase animate-fade-in">
            <span className="w-1.5 h-1.5 bg-[#C68E3F] rounded-full inline-block"></span>
            <span>CASE-MATCHING SYSTEM · 512-DIM VECTOR</span>
          </div>

          {/* Large Serif H1 */}
          <h1 className="font-serif font-semibold text-4xl sm:text-6xl text-[#EDE9DF] leading-[1.1] tracking-tight animate-rise-in">
            Every profile is a lead. <br />
            <span className="text-[#C68E3F] italic font-normal">
              Every scan is a chance to close the case.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-[#5B6472] leading-relaxed max-w-2xl font-sans">
            Neural Vision compares input photography against enrolled missing-person dossiers using normalized 512-dimensional facial embeddings. Built to deliver reliable, calibrated candidate matches for field investigators.
          </p>

          {/* Actions */}
          <div className="pt-4 flex flex-wrap items-center gap-4 font-sans">
            <Link
              href="/enroll"
              id="hero-cta-enroll"
              className="px-6 py-3.5 bg-[#C68E3F] hover:bg-[#9C6B27] text-[#10151F] font-semibold text-sm tracking-wider uppercase transition-all duration-150 flex items-center gap-2 shadow-sm rounded-xs group"
            >
              <UserPlus className="w-4 h-4" />
              <span>Enroll a Person</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/detect"
              id="hero-cta-scan"
              className="px-6 py-3.5 bg-transparent hover:bg-[#1B2333] border border-[#C9C2B2]/40 hover:border-[#C68E3F] text-[#EDE9DF] font-semibold text-sm tracking-wider uppercase transition-all duration-150 flex items-center gap-2 rounded-xs"
            >
              <ScanFace className="w-4 h-4 text-[#C68E3F]" />
              <span>Scan a Photo</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── 2. Paper-100 Band — How a match is made ────────────────────────────── */}
      <section className="bg-[#EFEAE0] text-[#171A1F] py-16 px-4 sm:px-6 lg:px-8 border-t border-b border-[#C9C2B2]">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center mb-12">
            <span className="font-mono text-xs text-[#5B6472] uppercase tracking-[0.25em] block mb-2">
              OPERATIONAL PIPELINE
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#171A1F]">
              How a match is calibrated
            </h2>
          </div>

          {/* 3 Step Pipeline Cards connected by thin brass line */}
          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-[1px] bg-[#C68E3F]/40 -translate-y-6 z-0" />

            {/* Step 1 */}
            <div className="relative z-10 bg-[#F7F5F0] border border-[#C9C2B2] p-6 case-tag-notch flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-dashed border-[#C9C2B2]">
                  <span className="font-mono text-xs font-bold text-[#C68E3F] bg-[#10151F] text-[#EDE9DF] px-2 py-0.5 case-tag-chip-notch">
                    STEP 01
                  </span>
                  <span className="font-mono text-[10px] text-[#5B6472] uppercase">INTAKE</span>
                </div>
                <h3 className="font-serif text-xl font-bold text-[#171A1F] mb-2">
                  Enroll Case File
                </h3>
                <p className="text-xs text-[#5B6472] leading-relaxed font-sans">
                  Register photos and case metadata. System extracts facial landmarks and generates an immutable 512-dim embedding.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-[#C9C2B2]/40 font-mono text-[11px] text-[#C68E3F] flex items-center gap-1.5">
                <UserPlus className="w-3.5 h-3.5" />
                <span>Create dossier record</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative z-10 bg-[#F7F5F0] border border-[#C9C2B2] p-6 case-tag-notch flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-dashed border-[#C9C2B2]">
                  <span className="font-mono text-xs font-bold text-[#C68E3F] bg-[#10151F] text-[#EDE9DF] px-2 py-0.5 case-tag-chip-notch">
                    STEP 02
                  </span>
                  <span className="font-mono text-[10px] text-[#5B6472] uppercase">DETECTION</span>
                </div>
                <h3 className="font-serif text-xl font-bold text-[#171A1F] mb-2">
                  Detect Faces in Field Photos
                </h3>
                <p className="text-xs text-[#5B6472] leading-relaxed font-sans">
                  MTCNN models process single target portraits or dense crowd scenes, isolating individual face bounding rectangles.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-[#C9C2B2]/40 font-mono text-[11px] text-[#C68E3F] flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5" />
                <span>MTCNN Multi-box crop</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative z-10 bg-[#F7F5F0] border border-[#C9C2B2] p-6 case-tag-notch flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-dashed border-[#C9C2B2]">
                  <span className="font-mono text-xs font-bold text-[#C68E3F] bg-[#10151F] text-[#EDE9DF] px-2 py-0.5 case-tag-chip-notch">
                    STEP 03
                  </span>
                  <span className="font-mono text-[10px] text-[#5B6472] uppercase">SIMILARITY</span>
                </div>
                <h3 className="font-serif text-xl font-bold text-[#171A1F] mb-2">
                  Compare & Score
                </h3>
                <p className="text-xs text-[#5B6472] leading-relaxed font-sans">
                  Vectors are compared via cosine distance. Ranked candidates display with calibrated analog confidence gauges.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-[#C9C2B2]/40 font-mono text-[11px] text-[#C68E3F] flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5" />
                <span>Analog meter readout</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Paper-50 Band — Live-feel Stats Strip ───────────────────────────── */}
      <section className="bg-[#F7F5F0] text-[#171A1F] py-12 px-4 sm:px-6 lg:px-8 border-b border-[#C9C2B2]">
        <div className="max-w-[1280px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 font-mono text-center sm:text-left divide-y sm:divide-y-0 sm:divide-x divide-[#C9C2B2]">
            {/* Stat 1 */}
            <div className="pt-4 sm:pt-0 sm:pr-6">
              <span className="text-[11px] text-[#5B6472] tracking-widest uppercase block mb-1">
                PROFILES ENROLLED
              </span>
              {loadingStats ? (
                <div className="h-10 w-24 bg-[#EFEAE0] animate-pulse my-1" />
              ) : (
                <div className="text-3xl sm:text-4xl font-bold font-serif text-[#171A1F]">
                  {stats?.profilesEnrolled ?? 0}
                </div>
              )}
              <span className="text-[10px] text-[#5B6472]">ACTIVE SEARCH FILES IN DATABASE</span>
            </div>

            {/* Stat 2 */}
            <div className="pt-4 sm:pt-0 sm:px-6">
              <span className="text-[11px] text-[#5B6472] tracking-widest uppercase block mb-1">
                SCANS EXECUTED
              </span>
              {loadingStats ? (
                <div className="h-10 w-24 bg-[#EFEAE0] animate-pulse my-1" />
              ) : (
                <div className="text-3xl sm:text-4xl font-bold font-serif text-[#171A1F]">
                  {stats?.scansRun ?? 0}
                </div>
              )}
              <span className="text-[10px] text-[#5B6472]">FIELD IMAGE QUERIES PROCESSED</span>
            </div>

            {/* Stat 3 */}
            <div className="pt-4 sm:pt-0 sm:pl-6">
              <span className="text-[11px] text-[#5B6472] tracking-widest uppercase block mb-1">
                MATCHES CONFIRMED
              </span>
              {loadingStats ? (
                <div className="h-10 w-24 bg-[#EFEAE0] animate-pulse my-1" />
              ) : (
                <div className="text-3xl sm:text-4xl font-bold font-serif text-[#3F6B62]">
                  {stats?.matchesConfirmed ?? 0}
                </div>
              )}
              <span className="text-[10px] text-[#5B6472]">HIGH-CONFIDENCE LEADS FORWARDED</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3.5. Recently Enrolled Dossiers Section ───────────────────────────── */}
      {stats?.recentCases && stats.recentCases.length > 0 && (
        <section className="bg-[#171E2B] text-[#EDE9DF] py-16 px-4 sm:px-6 lg:px-8 border-b border-[#C9C2B2]/20">
          <div className="max-w-[1280px] mx-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-4 border-b border-[#C9C2B2]/20 gap-4">
              <div>
                <span className="font-mono text-xs text-[#C68E3F] uppercase tracking-widest block mb-1">
                  RECENT ENROLLMENTS
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#EDE9DF]">
                  Active Case Dossiers
                </h2>
              </div>
              <Link
                href="/enroll"
                className="font-mono text-xs text-[#C68E3F] hover:underline flex items-center gap-1"
              >
                <span>+ ENROLL NEW CASE</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {stats.recentCases.map((item) => (
                <div
                  key={item._id}
                  className="bg-[#10151F] border border-[#C9C2B2]/20 p-5 case-tag-notch flex flex-col justify-between space-y-4 hover:border-[#C68E3F]/50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-20 bg-[#1B2333] border border-[#C9C2B2]/20 overflow-hidden flex-shrink-0 relative">
                      <img
                        src={item.imageUrl}
                        alt={item.username}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="space-y-1 font-sans">
                      <h4 className="font-serif font-bold text-lg text-[#EDE9DF]">
                        {item.username}
                      </h4>
                      <p className="font-mono text-xs text-[#C68E3F]">
                        AGE: {item.age} {item.height ? `· ${item.height}cm` : ""}
                      </p>
                      {item.lastSeenLocation && (
                        <p className="text-xs text-[#5B6472] line-clamp-1">
                          📍 {item.lastSeenLocation}
                        </p>
                      )}
                    </div>
                  </div>

                  {item.description && (
                    <p className="text-xs text-[#5B6472] font-sans line-clamp-2 italic bg-[#1B2333]/50 p-2.5 rounded-xs border border-[#C9C2B2]/10">
                      "{item.description}"
                    </p>
                  )}

                  <div className="pt-3 border-t border-[#C9C2B2]/10 flex items-center justify-between font-mono text-[10px] text-[#5B6472]">
                    <span>DOSSIER #{item._id.slice(-6).toUpperCase()}</span>
                    <span>{new Date(item.enrolledAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 4. Ink-900 Band — Trust & Responsible Use Note ────────────────────── */}
      <section className="bg-[#10151F] text-[#EDE9DF] py-16 px-4 sm:px-6 lg:px-8 border-t border-[#C9C2B2]/20">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-8 space-y-4">
            <div className="flex items-center gap-2 font-mono text-xs text-[#C68E3F] uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>RESPONSIBLE USE & INVESTIGATIVE INTEGRITY</span>
            </div>
            <h3 className="font-serif text-2xl font-semibold text-[#EDE9DF]">
              Results are actionable leads — not automated verifications.
            </h3>
            <p className="text-sm text-[#5B6472] leading-relaxed font-sans">
              Neural Vision produces mathematical distance metrics between facial features to highlight potential candidates. All similarity readings require rigorous independent human review by qualified investigators before official actions or family outreach are initiated.
            </p>
          </div>

          <div className="md:col-span-4 bg-[#1B2333] border border-[#C9C2B2]/20 p-6 rounded-xs case-tag-notch font-mono text-xs space-y-3">
            <div className="text-[#C68E3F] font-semibold uppercase tracking-wider">
              [ ] AUDIT & GOVERNANCE
            </div>
            <ul className="space-y-2 text-[#5B6472] text-[11px]">
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 bg-[#C68E3F] rounded-full" />
                <span>Zero autonomous identity declarations</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 bg-[#C68E3F] rounded-full" />
                <span>Encrypted 512-dim vector index</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 bg-[#C68E3F] rounded-full" />
                <span>Full audit logging of search queries</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes riseIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 400ms ease-out forwards;
        }
        .animate-rise-in {
          animation: riseIn 400ms ease-out 80ms forwards;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-fade-in, .animate-rise-in {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>
    </div>
  );
}
