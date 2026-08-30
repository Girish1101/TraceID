"use client";

interface ConfidenceDialProps {
  similarity: number; // 0.0 to 1.0
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export default function ConfidenceDial({
  similarity,
  size = "md",
  showLabel = true,
}: ConfidenceDialProps) {
  // Clamp similarity between 0 and 1
  const score = Math.max(0, Math.min(1, similarity));
  
  // Angle in degrees: 0 score = -90deg (left), 1 score = +90deg (right)
  const angleDeg = -90 + score * 180;

  // Categorize level
  let matchStatus = "Low similarity";
  let statusColor = "text-[#A63A2E]"; // signal red
  let statusBorder = "border-[#A63A2E]/30 bg-[#A63A2E]/10";

  if (score >= 0.75) {
    matchStatus = "Likely match";
    statusColor = "text-[#3F6B62]"; // verified teal
    statusBorder = "border-[#3F6B62]/30 bg-[#3F6B62]/10";
  } else if (score >= 0.40) {
    matchStatus = "Possible candidate";
    statusColor = "text-[#C68E3F]"; // brass
    statusBorder = "border-[#C68E3F]/30 bg-[#C68E3F]/10";
  }

  // Dimensions based on size prop
  const dimensions = {
    sm: { width: 90, height: 50, radius: 36, stroke: 7, fontSize: "text-[10px]" },
    md: { width: 120, height: 66, radius: 48, stroke: 9, fontSize: "text-xs" },
    lg: { width: 150, height: 82, radius: 60, stroke: 11, fontSize: "text-sm" },
  }[size];

  const { width, height, radius, stroke } = dimensions;
  const cx = width / 2;
  const cy = height - stroke / 2 - 2;

  // Arc path generator helper for semicircle
  // 180 deg arc from left (-PI) to right (0)
  const describeArc = (startAngleDeg: number, endAngleDeg: number) => {
    const startRad = (startAngleDeg * Math.PI) / 180;
    const endRad = (endAngleDeg * Math.PI) / 180;
    const x1 = cx + radius * Math.cos(startRad);
    const y1 = cy + radius * Math.sin(startRad);
    const x2 = cx + radius * Math.cos(endRad);
    const y2 = cy + radius * Math.sin(endRad);

    return `M ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2}`;
  };

  // 3 segments: Low (180° to 234° i.e. 0.0 to 0.30), Med (234° to 306° i.e. 0.30 to 0.70), High (306° to 360° i.e. 0.70 to 1.0)
  const lowArcPath = describeArc(180, 234);
  const medArcPath = describeArc(234, 306);
  const highArcPath = describeArc(306, 360);

  // Needle length
  const needleLength = radius - stroke;

  return (
    <div className="flex flex-col items-center select-none font-mono">
      {/* Semicircular Analog Instrument Gauge */}
      <div className="relative inline-flex flex-col items-center">
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className="overflow-visible"
        >
          {/* Background arc tracks */}
          {/* Low Band: Signal Red */}
          <path
            d={lowArcPath}
            fill="none"
            stroke="#A63A2E"
            strokeWidth={stroke}
            strokeLinecap="butt"
            opacity={score < 0.40 ? 0.9 : 0.35}
          />
          {/* Med Band: Brass */}
          <path
            d={medArcPath}
            fill="none"
            stroke="#C68E3F"
            strokeWidth={stroke}
            strokeLinecap="butt"
            opacity={score >= 0.40 && score < 0.75 ? 0.95 : 0.35}
          />
          {/* High Band: Verified Teal */}
          <path
            d={highArcPath}
            fill="none"
            stroke="#3F6B62"
            strokeWidth={stroke}
            strokeLinecap="butt"
            opacity={score >= 0.75 ? 1 : 0.35}
          />

          {/* Scale Ticks */}
          {[0, 0.25, 0.5, 0.75, 1].map((val) => {
            const tickAngle = Math.PI + val * Math.PI;
            const xInner = cx + (radius - stroke / 2 - 4) * Math.cos(tickAngle);
            const yInner = cy + (radius - stroke / 2 - 4) * Math.sin(tickAngle);
            const xOuter = cx + (radius + stroke / 2 + 2) * Math.cos(tickAngle);
            const yOuter = cy + (radius + stroke / 2 + 2) * Math.sin(tickAngle);
            return (
              <line
                key={val}
                x1={xInner}
                y1={yInner}
                x2={xOuter}
                y2={yOuter}
                stroke="#171A1F"
                strokeWidth="1"
                opacity="0.4"
              />
            );
          })}

          {/* Pivot Center Pin */}
          <circle cx={cx} cy={cy} r={stroke / 1.8} fill="#C68E3F" stroke="#171A1F" strokeWidth="1.5" />

          {/* Needle Pointer */}
          <g transform={`rotate(${angleDeg}, ${cx}, ${cy})`}>
            {/* Needle Shaft */}
            <line
              x1={cx}
              y1={cy}
              x2={cx}
              y2={cy - needleLength}
              stroke="#171A1F"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <line
              x1={cx}
              y1={cy}
              x2={cx}
              y2={cy - needleLength}
              stroke="#C68E3F"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </g>
        </svg>

        {/* Numeric score display directly under dial */}
        <div className="mt-1 font-mono font-bold text-xs text-[#171A1F] tracking-wider">
          {score.toFixed(2)}
        </div>
      </div>

      {/* Classification Text Badge */}
      {showLabel && (
        <div className={`mt-1.5 px-2 py-0.5 border rounded-xs ${statusBorder} ${statusColor} text-[11px] font-medium tracking-tight flex items-center gap-1.5`}>
          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
          <span>{matchStatus}</span>
          <span className="opacity-70 font-mono">({score.toFixed(2)})</span>
        </div>
      )}
    </div>
  );
}
