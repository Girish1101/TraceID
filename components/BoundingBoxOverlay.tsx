"use client";

export interface BoundingBox {
  x: number; // percentage or pixels
  y: number;
  width: number;
  height: number;
  label?: string;
}

interface BoundingBoxOverlayProps {
  imageSrc: string;
  boxes?: BoundingBox[];
  className?: string;
}

export default function BoundingBoxOverlay({
  imageSrc,
  boxes = [],
  className = "",
}: BoundingBoxOverlayProps) {
  return (
    <div className={`relative inline-block overflow-hidden border border-[#C9C2B2] bg-[#10151F] ${className}`}>
      {/* Target Image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageSrc}
        alt="Analyzed subject preview"
        className="block max-w-full h-auto object-contain mx-auto"
      />

      {/* Bounding Box Overlays */}
      {boxes.map((box, index) => {
        const indexStr = (index + 1).toString().padStart(2, "0");
        return (
          <div
            key={index}
            style={{
              left: `${box.x}%`,
              top: `${box.y}%`,
              width: `${box.width}%`,
              height: `${box.height}%`,
            }}
            className="absolute border border-[#C68E3F] pointer-events-none transition-all duration-300 z-10"
          >
            {/* Corner Caliper Brackets */}
            <div className="absolute -top-[2px] -left-[2px] w-2 h-2 border-t-2 border-l-2 border-[#C68E3F]" />
            <div className="absolute -top-[2px] -right-[2px] w-2 h-2 border-t-2 border-r-2 border-[#C68E3F]" />
            <div className="absolute -bottom-[2px] -left-[2px] w-2 h-2 border-b-2 border-l-2 border-[#C68E3F]" />
            <div className="absolute -bottom-[2px] -right-[2px] w-2 h-2 border-b-2 border-r-2 border-[#C68E3F]" />

            {/* Mono Face Index Tag */}
            <div className="absolute -top-5 left-0 bg-[#10151F] border border-[#C68E3F] text-[#C68E3F] font-mono text-[10px] px-1.5 py-0.5 leading-none font-bold uppercase tracking-widest shadow-xs">
              {box.label || `FACE ${indexStr}`}
            </div>
          </div>
        );
      })}
    </div>
  );
}
