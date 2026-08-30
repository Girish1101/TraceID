"use client";

import { X, ShieldCheck, Scale, Cpu } from "lucide-react";

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InfoModal({ isOpen, onClose }: InfoModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div 
        className="bg-[#10151F] text-[#EDE9DF] border border-[#C9C2B2]/30 max-w-xl w-full rounded-sm shadow-2xl overflow-hidden case-tag-notch"
        role="dialog"
        aria-labelledby="info-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#C9C2B2]/20 bg-[#1B2333]">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-[#C68E3F] tracking-widest uppercase">
              [ ] SYSTEM DISCLOSURE
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-[#5B6472] hover:text-[#EDE9DF] transition-colors p-1"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto font-sans">
          <div>
            <h2 id="info-modal-title" className="text-2xl font-serif font-semibold text-[#EDE9DF] mb-2">
              Neural Vision Field Operations
            </h2>
            <p className="text-sm text-[#5B6472] leading-relaxed">
              Neural Vision is a calibrated case-matching platform engineered for investigators, law enforcement liaison teams, and non-profit search initiatives.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-[#1B2333] border border-[#C9C2B2]/15 rounded-sm">
              <Cpu className="w-5 h-5 text-[#C68E3F] mb-2" />
              <h3 className="text-sm font-semibold text-[#EDE9DF] mb-1 font-sans">512-Dim Vector Space</h3>
              <p className="text-xs text-[#5B6472] leading-normal">
                FaceNet deep learning models translate facial geometry into 512-dimensional vector embeddings compared using cosine similarity.
              </p>
            </div>

            <div className="p-4 bg-[#1B2333] border border-[#C9C2B2]/15 rounded-sm">
              <Scale className="w-5 h-5 text-[#C68E3F] mb-2" />
              <h3 className="text-sm font-semibold text-[#EDE9DF] mb-1 font-sans">Investigative Leads</h3>
              <p className="text-xs text-[#5B6472] leading-normal">
                System matches are preliminary statistical indicators designed to prioritize lead review, not autonomous confirmations of identity.
              </p>
            </div>
          </div>

          <div className="p-4 bg-[#1B2333]/60 border-l-2 border-[#C68E3F] space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-[#C68E3F] uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              Human-in-the-Loop Safeguard
            </div>
            <p className="text-xs text-[#EDE9DF]/80 leading-relaxed">
              Every identified potential candidate must be verified by a designated case officer prior to field verification or family notification.
            </p>
          </div>

          <div className="text-xs font-mono text-[#5B6472] pt-2 border-t border-[#C9C2B2]/15 flex items-center justify-between">
            <span>NEURAL VISION CORE v1.0</span>
            <span className="text-[#C68E3F]">RESPONSIBLE USE VERIFIED</span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#1B2333] border-t border-[#C9C2B2]/20 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#C68E3F] hover:bg-[#9C6B27] text-[#10151F] font-sans font-semibold text-xs tracking-wider uppercase transition-colors rounded-xs"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
}
