"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Info } from "lucide-react";
import InfoModal from "./InfoModal";

export default function Navbar() {
  const pathname = usePathname();
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Enroll", href: "/enroll" },
    { label: "Scan", href: "/detect" },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#10151F] border-b border-[#C9C2B2]/20 text-[#EDE9DF]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-2.5 group transition-opacity hover:opacity-90"
            id="nav-logo"
          >
            {/* Caliper / Crop-mark glyph */}
            <div className="flex items-center text-[#C68E3F] font-mono text-base font-bold select-none tracking-tighter">
              <span>[</span>
              <span className="w-1.5 h-1.5 bg-[#C68E3F] mx-0.5 rounded-full inline-block"></span>
              <span>]</span>
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-sm tracking-[0.25em] font-semibold text-[#EDE9DF] uppercase">
                NEURAL VISION
              </span>
              <span className="font-mono text-[9px] text-[#5B6472] tracking-widest uppercase -mt-0.5">
                CASE-MATCHING OPERATIVE
              </span>
            </div>
          </Link>

          {/* Navigation links & Info trigger */}
          <nav className="flex items-center gap-6 sm:gap-8 font-sans">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  id={`nav-link-${item.label.toLowerCase()}`}
                  className={`relative py-1 text-sm transition-colors ${
                    isActive
                      ? "text-[#EDE9DF] font-medium"
                      : "text-[#5B6472] hover:text-[#EDE9DF]"
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span 
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C68E3F]" 
                    />
                  )}
                </Link>
              );
            })}

            {/* Info Trigger Button */}
            <button
              onClick={() => setIsInfoOpen(true)}
              id="nav-info-btn"
              className="p-1.5 text-[#5B6472] hover:text-[#C68E3F] hover:bg-[#1B2333] transition-colors rounded-xs border border-transparent hover:border-[#C9C2B2]/20"
              title="System Disclosure & Guidelines"
              aria-label="System Disclosure & Guidelines"
            >
              <Info className="w-4 h-4" />
            </button>
          </nav>
        </div>
      </header>

      {/* Info Modal */}
      <InfoModal isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} />
    </>
  );
}
