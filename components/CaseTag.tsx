"use client";

import { useState } from "react";
import Image from "next/image";
import { MapPin, User, Calendar, Ruler, FileText, CheckCircle } from "lucide-react";
import ConfidenceDial from "./ConfidenceDial";

export interface CaseTagProps {
  id?: string;
  name: string;
  age?: number | string;
  height?: number | string;
  lastSeenLocation?: string;
  lastSeenDate?: string;
  description?: string;
  imageUrl?: string | null;
  status?: "missing" | "verified" | "candidate";
  similarity?: number; // optional score if used in search results
  enrolledAt?: string;
  isStampActive?: boolean;
  onViewDetails?: () => void;
  className?: string;
}

export default function CaseTag({
  id = "CN-000000",
  name,
  age,
  height,
  lastSeenLocation,
  lastSeenDate,
  description,
  imageUrl,
  status = "missing",
  similarity,
  enrolledAt,
  isStampActive = false,
  onViewDetails,
  className = "",
}: CaseTagProps) {
  const formattedId = id.length > 12 ? `CN-${id.slice(-6).toUpperCase()}` : id;
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div 
        className={`relative bg-[#F7F5F0] border border-[#C9C2B2] text-[#171A1F] p-4 shadow-sm transition-all duration-200 hover:shadow-md case-tag-notch ${className}`}
      >
        {/* Header Strip with perforation line */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-dashed border-[#C9C2B2]">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#5B6472]">
              CASE ID:
            </span>
            <span className="font-mono text-xs font-bold tracking-widest text-[#171A1F]">
              {formattedId}
            </span>
          </div>

          {/* Status Badge Pill */}
          <div className="flex items-center gap-2">
            {status === "missing" && (
              <span className="px-2 py-0.5 text-[10px] font-mono font-semibold tracking-wider uppercase border border-[#A63A2E] text-[#A63A2E] bg-[#A63A2E]/5 rounded-xs">
                MISSING CASE
              </span>
            )}
            {status === "verified" && (
              <span className="px-2 py-0.5 text-[10px] font-mono font-semibold tracking-wider uppercase border border-[#3F6B62] text-[#3F6B62] bg-[#3F6B62]/5 rounded-xs">
                MATCH CONFIRMED
              </span>
            )}
            {status === "candidate" && (
              <span className="px-2 py-0.5 text-[10px] font-mono font-semibold tracking-wider uppercase border border-[#C68E3F] text-[#C68E3F] bg-[#C68E3F]/5 rounded-xs">
                CANDIDATE
              </span>
            )}
          </div>
        </div>

        {/* Body content */}
        <div className="grid grid-cols-1 sm:grid-cols-[110px_1fr] gap-4 items-start">
          {/* Photo Frame */}
          <div className="relative aspect-square w-full sm:w-[110px] h-[110px] bg-[#EFEAE0] border border-[#C9C2B2] overflow-hidden flex items-center justify-center">
            {imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageUrl}
                alt={name || "Case Subject"}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-[#5B6472] p-2 text-center">
                <User className="w-8 h-8 opacity-40 mb-1" />
                <span className="font-mono text-[9px] uppercase tracking-wider">NO PHOTO</span>
              </div>
            )}
            
            {/* Small corner crop mark on photo */}
            <div className="absolute top-1 left-1 w-1.5 h-1.5 border-t border-l border-[#C68E3F]" />
            <div className="absolute bottom-1 right-1 w-1.5 h-1.5 border-b border-r border-[#C68E3F]" />
          </div>

          {/* Metadata Block */}
          <div className="flex flex-col justify-between h-full space-y-2">
            <div>
              <h3 className="font-serif font-semibold text-lg text-[#171A1F] leading-tight tracking-tight">
                {name || "— (Unspecified)"}
              </h3>

              <div className="grid grid-cols-2 gap-x-3 gap-y-1 mt-2 text-xs font-sans text-[#5B6472]">
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#C68E3F] shrink-0" />
                  <span>Age: <strong className="font-mono text-[#171A1F]">{age || "—"}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Ruler className="w-3.5 h-3.5 text-[#C68E3F] shrink-0" />
                  <span>Height: <strong className="font-mono text-[#171A1F]">{height ? `${height}cm` : "—"}</strong></span>
                </div>
                {lastSeenLocation && (
                  <div className="flex items-center gap-1.5 col-span-2 truncate">
                    <MapPin className="w-3.5 h-3.5 text-[#C68E3F] shrink-0" />
                    <span className="truncate">Last seen: <span className="text-[#171A1F] font-medium">{lastSeenLocation}</span></span>
                  </div>
                )}
                {lastSeenDate && (
                  <div className="flex items-center gap-1.5 col-span-2">
                    <Calendar className="w-3.5 h-3.5 text-[#C68E3F] shrink-0" />
                    <span>Date: <span className="font-mono text-[#171A1F]">{lastSeenDate}</span></span>
                  </div>
                )}
              </div>
            </div>

            {/* Description Snippet */}
            {description && (
              <p className="text-xs font-sans text-[#5B6472] line-clamp-2 italic pt-1 border-t border-[#C9C2B2]/40">
                "{description}"
              </p>
            )}
          </div>
        </div>

        {/* Confidence Dial Section (If score provided) */}
        {typeof similarity === "number" && (
          <div className="mt-4 pt-3 border-t border-[#C9C2B2] flex items-center justify-between bg-[#EFEAE0]/60 p-2.5 rounded-xs">
            <div className="text-xs font-mono text-[#5B6472]">
              <div className="text-[10px] uppercase tracking-wider text-[#5B6472]">MEASURED ACCURACY</div>
              <div className="font-semibold text-[#171A1F]">COSINE SIMILARITY</div>
            </div>
            <ConfidenceDial similarity={similarity} size="sm" />
          </div>
        )}

        {/* Card Footer Actions / Metadata */}
        <div className="mt-3 pt-2 border-t border-dashed border-[#C9C2B2] flex items-center justify-between text-[10px] font-mono text-[#5B6472]">
          <span>{enrolledAt ? `RECORDED: ${enrolledAt}` : "512-DIM VECTOR INDEXED"}</span>
          
          <button
            onClick={() => {
              if (onViewDetails) onViewDetails();
              else setModalOpen(true);
            }}
            className="text-[#C68E3F] hover:text-[#9C6B27] font-semibold tracking-wider uppercase hover:underline"
          >
            [ View Case File ]
          </button>
        </div>

        {/* Stamp Animation Overlay (on successful enrollment) */}
        {isStampActive && (
          <div className="absolute top-4 right-4 z-20 pointer-events-none transform rotate-[-12deg] animate-stamp">
            <div className="px-3 py-1 border-2 border-[#C68E3F] text-[#C68E3F] font-mono font-extrabold text-sm tracking-widest uppercase bg-[#F7F5F0]/90 shadow-md">
              ENROLLED
            </div>
          </div>
        )}
      </div>

      {/* Case File Details Modal */}
      {modalOpen && (
        <div 
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md transition-all duration-200 animate-fade-in"
          style={{ backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
          onClick={() => setModalOpen(false)}
        >
          <div 
            className="bg-[#F7F5F0] text-[#171A1F] border-2 border-[#C9C2B2] max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] rounded-sm relative font-sans space-y-6 my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-dashed border-[#C9C2B2] gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#C68E3F] font-bold">
                    OFFICIAL DOSSIER
                  </span>
                  <span className="font-mono text-xs text-[#5B6472]">
                    · {formattedId}
                  </span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#171A1F] leading-tight">
                  {name}
                </h2>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-[#5B6472] hover:text-[#171A1F] hover:bg-[#EFEAE0] rounded-xs font-mono text-base px-2 py-1 transition-colors border border-[#C9C2B2]/40"
                aria-label="Close Case File"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-4">
              {/* Photo Display Frame - Preserves original ratio without distortion */}
              {imageUrl ? (
                <div className="w-full h-64 sm:h-72 bg-[#10151F] border border-[#C9C2B2] rounded-xs overflow-hidden flex items-center justify-center p-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={imageUrl} 
                    alt={name} 
                    className="w-full h-full object-contain max-h-full rounded-xs shadow-md" 
                  />
                </div>
              ) : (
                <div className="w-full h-48 bg-[#10151F] border border-[#C9C2B2] rounded-xs flex flex-col items-center justify-center text-[#5B6472] p-4 text-center font-mono text-xs">
                  <User className="w-12 h-12 opacity-40 mb-2" />
                  <span>NO DOSSIER PHOTOGRAPH AVAILABLE</span>
                </div>
              )}

              {/* Metadata Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-[#EFEAE0] border border-[#C9C2B2] rounded-xs">
                  <span className="font-mono text-[10px] text-[#5B6472] uppercase tracking-wider block mb-0.5">CASE IDENTIFIER</span>
                  <span className="font-mono font-bold text-[#171A1F] text-sm tracking-wide">{formattedId}</span>
                </div>
                <div className="p-3 bg-[#EFEAE0] border border-[#C9C2B2] rounded-xs">
                  <span className="font-mono text-[10px] text-[#5B6472] uppercase tracking-wider block mb-0.5 font-sans">AGE / HEIGHT</span>
                  <span className="font-mono text-[#171A1F] font-semibold text-sm">{age || "N/A"} yrs / {height ? `${height} cm` : "N/A"}</span>
                </div>
                {lastSeenLocation && (
                  <div className="p-3 bg-[#EFEAE0] border border-[#C9C2B2] rounded-xs col-span-2">
                    <span className="font-mono text-[10px] text-[#5B6472] uppercase tracking-wider block mb-0.5">LAST SEEN LOCATION</span>
                    <span className="font-sans text-[#171A1F] font-medium text-sm flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#C68E3F]" />
                      <span>{lastSeenLocation}</span>
                    </span>
                  </div>
                )}
              </div>

              {/* Description Details */}
              {description && (
                <div className="p-3.5 bg-[#EFEAE0] border border-[#C9C2B2] rounded-xs text-xs space-y-1">
                  <span className="font-mono text-[10px] text-[#5B6472] uppercase tracking-wider block">DISTINGUISHING FEATURES & CASE NOTES</span>
                  <p className="text-[#171A1F] leading-relaxed font-sans italic">{description}</p>
                </div>
              )}

              {/* Confidence Dial Section */}
              {typeof similarity === "number" && (
                <div className="p-3.5 bg-[#EFEAE0] border border-[#C9C2B2] rounded-xs flex items-center justify-between">
                  <div>
                    <span className="font-mono text-[10px] text-[#5B6472] uppercase tracking-wider block">MATCH ACCURACY READOUT</span>
                    <span className="font-mono text-xs font-bold text-[#171A1F]">COSINE VECTOR DISTANCE</span>
                  </div>
                  <ConfidenceDial similarity={similarity} size="sm" />
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-[#C9C2B2] flex items-center justify-between">
              <span className="font-mono text-[10px] text-[#5B6472]">
                {enrolledAt ? `RECORDED: ${enrolledAt}` : "512-DIM VECTOR INDEXED"}
              </span>
              <button
                onClick={() => setModalOpen(false)}
                className="px-5 py-2 bg-[#C68E3F] hover:bg-[#9C6B27] text-[#10151F] font-mono text-xs font-bold tracking-wider uppercase transition-colors rounded-xs shadow-xs"
              >
                Close Case File
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes stampAnim {
          0% { opacity: 0; transform: scale(1.6) rotate(-25deg); }
          100% { opacity: 1; transform: scale(1) rotate(-12deg); }
        }
        .animate-stamp {
          animation: stampAnim 250ms cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
      `}</style>
    </>
  );
}
