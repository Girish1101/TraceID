"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#10151F] border-t border-[#C9C2B2]/20 text-[#5B6472] py-4 px-4 sm:px-6 lg:px-8 text-xs font-mono">
      <div className="max-w-[1280px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-[#EDE9DF]/80 font-semibold">NEURAL VISION FIELD LAB</span>
          <span>·</span>
          <span>OPERATIONAL CASE DATABASE</span>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <span className="hidden md:inline text-[#5B6472]/80">
            RESULTS CONSTITUTE INVESTIGATIVE LEADS, NOT ADJUDICATED PROOF
          </span>
          <span>·</span>
          <a
            href="#privacy-policy"
            onClick={(e) => {
              e.preventDefault();
              alert("Data Handling Policy: All facial embeddings and case metadata are processed under encrypted, audit-logged investigative protocols.");
            }}
            className="hover:text-[#C68E3F] underline underline-offset-2 transition-colors"
          >
            DATA HANDLING & PRIVACY
          </a>
        </div>
      </div>
    </footer>
  );
}
