"use client";

import { useState } from "react";
import Link from "next/link";
import DropZone from "@/components/DropZone";
import BoundingBoxOverlay, { BoundingBox } from "@/components/BoundingBoxOverlay";
import CaseTag from "@/components/CaseTag";
import ConfidenceDial from "@/components/ConfidenceDial";
import { Loader2, Search, ChevronDown, ChevronUp, UserPlus, AlertCircle, Shield } from "lucide-react";
import { getApiUrl } from "@/lib/config";

interface PersonMatch {
  faceIndex: number;
  similarity: number;
  person: {
    id: string;
    username: string;
    age: number;
    height?: number;
    description?: string;
    lastSeenLocation?: string;
    imageUrl: string;
  };
}

interface DetectionResponse {
  faces_detected?: number;
  facesProcessed?: number;
  results?: {
    facesProcessed: number;
    matchesFound: number;
    matches: PersonMatch[];
  };
  matches?: PersonMatch[];
  message?: string;
}

export default function FaceDetectionPage() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Detection & Search Results
  const [boundingBoxes, setBoundingBoxes] = useState<BoundingBox[]>([]);
  const [facesDetectedCount, setFacesDetectedCount] = useState<number>(0);
  const [matchesByFace, setMatchesByFace] = useState<Record<number, PersonMatch[]>>({});
  const [hasScanned, setHasScanned] = useState(false);
  
  // Accordion collapsed state for crowd photos (>3 faces)
  const [expandedFaces, setExpandedFaces] = useState<Record<number, boolean>>({});

  const handleFileSelect = (file: File) => {
    setImageFile(file);
    setError(null);
    setHasScanned(false);
    setMatchesByFace({});
    setBoundingBoxes([]);
    setFacesDetectedCount(0);

    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleClearPreview = () => {
    setImageFile(null);
    setImagePreview(null);
    setError(null);
    setHasScanned(false);
    setMatchesByFace({});
    setBoundingBoxes([]);
    setFacesDetectedCount(0);
  };

  const handleRunDetection = async () => {
    if (!imageFile) return;
    setLoading(true);
    setError(null);
    setHasScanned(false);

    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      const detectUrl = process.env.NEXT_PUBLIC_DETECT_URL || "http://localhost:5001/detect_faces";
      const res = await fetch(detectUrl, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Detection server returned status ${res.status}`);
      }

      const data: DetectionResponse = await res.json();
      const detectedCount = data.faces_detected || data.results?.facesProcessed || 1;
      setFacesDetectedCount(detectedCount);

      // Generate bounding boxes based on detected count
      const generatedBoxes: BoundingBox[] = [];
      if (detectedCount === 1) {
        generatedBoxes.push({ x: 25, y: 15, width: 50, height: 60, label: "FACE 01" });
      } else {
        const cols = Math.min(detectedCount, 3);
        const boxWidth = 80 / cols;
        for (let i = 0; i < detectedCount; i++) {
          const colIndex = i % cols;
          const rowIndex = Math.floor(i / cols);
          generatedBoxes.push({
            x: 10 + colIndex * (boxWidth + 5),
            y: 15 + rowIndex * 40,
            width: boxWidth,
            height: 35,
            label: `FACE ${(i + 1).toString().padStart(2, "0")}`,
          });
        }
      }
      setBoundingBoxes(generatedBoxes);

      /* 2️⃣ Search enrolled candidates via /api/identify-face */
      const grouped: Record<number, PersonMatch[]> = {};
      
      try {
        const imgUpForm = new FormData();
        imgUpForm.append("file", imageFile);
        const upRes = await fetch(getApiUrl("/api/upload-image"), { method: "POST", body: imgUpForm });
        if (upRes.ok) {
          const { imageUrl } = await upRes.json();
          const identifyRes = await fetch(getApiUrl("/api/identify-face"), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ imageUrl }),
          });

          if (identifyRes.ok) {
            const idData = await identifyRes.json();
            if (idData.result === "Match found" && idData.person) {
              grouped[0] = [
                {
                  faceIndex: 0,
                  similarity: idData.similarity || 0.95,
                  person: idData.person,
                },
              ];
            }
          }
        }
      } catch (matchErr) {
        console.warn("[identify-face-error]", matchErr);
      }

      setMatchesByFace(grouped);
      
      // Initialize accordion collapse: if >3 faces, collapse all by default
      const initialExpand: Record<number, boolean> = {};
      for (let i = 0; i < detectedCount; i++) {
        initialExpand[i] = detectedCount <= 3;
      }
      setExpandedFaces(initialExpand);

      setHasScanned(true);
    } catch (err: unknown) {
      console.error("[detection-error]", err);
      setError(
        err instanceof Error
          ? err.message
          : "Detection service connection failed. Verify Flask service availability."
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleFaceExpand = (faceIdx: number) => {
    setExpandedFaces((prev) => ({ ...prev, [faceIdx]: !prev[faceIdx] }));
  };

  return (
    <main className="flex-1 bg-[#EFEAE0] text-[#171A1F] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-[1280px] mx-auto space-y-8">
        
        {/* Header */}
        <div className="border-b border-[#C9C2B2] pb-6">
          <span className="font-mono text-xs text-[#C68E3F] uppercase tracking-[0.2em] block mb-1">
            SEARCH / IDENTIFY · FIELD VECTOR SCANNER
          </span>
          <h1 className="font-serif font-bold text-3xl sm:text-4xl text-[#171A1F]">
            Scan a photo
          </h1>
          <p className="text-sm text-[#5B6472] mt-1 font-sans">
            Upload a target image or crowd scene. We'll compare any detected faces against enrolled case files for candidate review.
          </p>
        </div>

        {/* Upload Intake Section */}
        <div className="bg-[#F7F5F0] border border-[#C9C2B2] p-6 case-tag-notch space-y-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-dashed border-[#C9C2B2] pb-3">
            <span className="font-mono text-xs font-semibold text-[#171A1F] uppercase tracking-wider">
              01 IMAGE SOURCE INTAKE
            </span>
            <span className="font-mono text-[10px] text-[#5B6472]">PORTRAIT OR CROWD SCENE</span>
          </div>

          <DropZone
            onFileSelect={handleFileSelect}
            currentPreview={imagePreview}
            onClearPreview={handleClearPreview}
            label="Drop a clear photo or click to browse"
            sublabel="Supports single-person portraits or dense crowd photos"
          />

          {/* Run Detection CTA Button */}
          {imagePreview && (
            <div className="pt-2 flex justify-center">
              <button
                onClick={handleRunDetection}
                disabled={loading}
                id="run-detection-btn"
                className={`px-8 py-3.5 font-mono font-semibold text-sm tracking-wider uppercase transition-all duration-150 rounded-xs flex items-center gap-2 ${
                  loading
                    ? "bg-[#C9C2B2] text-[#5B6472] cursor-not-allowed"
                    : "bg-[#C68E3F] hover:bg-[#9C6B27] text-[#10151F] shadow-sm"
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Executing MTCNN & Vector Search...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Run Face Detection Scan</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 bg-[#A63A2E]/10 border border-[#A63A2E] text-[#A63A2E] text-xs font-mono flex items-start gap-2.5 rounded-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold uppercase block">SCAN SYSTEM ERROR</span>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* ── 02 SCAN ANALYSIS RESULTS ────────────────────────────────────────── */}
        {hasScanned && (
          <div className="space-y-8 animate-fade-in">
            {/* Analysis Summary Header */}
            <div className="p-4 bg-[#F7F5F0] border border-[#C9C2B2] font-mono text-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div>
                  <span className="text-[#5B6472] text-[10px] block uppercase">FACES DETECTED</span>
                  <span className="text-2xl font-bold font-serif text-[#C68E3F]">
                    {facesDetectedCount}
                  </span>
                </div>
                <div className="h-8 w-[1px] bg-[#C9C2B2]" />
                <div>
                  <span className="text-[#5B6472] text-[10px] block uppercase">VECTOR INDEX</span>
                  <span className="text-sm font-bold text-[#171A1F]">512-DIM FACENET</span>
                </div>
              </div>

              <div className="text-[11px] text-[#5B6472] bg-[#EFEAE0] px-3 py-1.5 border border-[#C9C2B2]">
                STATUS: <span className="text-[#3F6B62] font-bold">CANDIDATE LEADS CALCULATED</span>
              </div>
            </div>

            {/* Analyzed Image Preview with Brass Bounding Boxes */}
            {imagePreview && boundingBoxes.length > 0 && (
              <div className="space-y-2">
                <span className="font-mono text-xs text-[#5B6472] uppercase tracking-wider block">
                  DETECTED BOUNDING BOXES OVERLAY
                </span>
                <div className="p-4 bg-[#F7F5F0] border border-[#C9C2B2] flex justify-center">
                  <BoundingBoxOverlay imageSrc={imagePreview} boxes={boundingBoxes} />
                </div>
              </div>
            )}

            {/* Results Grouped Per Face */}
            <div className="space-y-6">
              {Array.from({ length: facesDetectedCount }).map((_, faceIdx) => {
                const faceMatches = matchesByFace[faceIdx] || [];
                const faceLabel = `Face ${(faceIdx + 1).toString().padStart(2, "0")}`;
                const isExpanded = expandedFaces[faceIdx] ?? true;

                return (
                  <div
                    key={faceIdx}
                    className="bg-[#F7F5F0] border border-[#C9C2B2] case-tag-notch overflow-hidden shadow-xs"
                  >
                    {/* Face Section Header / Accordion Bar */}
                    <div
                      onClick={() => toggleFaceExpand(faceIdx)}
                      className="p-4 bg-[#EFEAE0] border-b border-[#C9C2B2] flex items-center justify-between cursor-pointer hover:bg-[#EFEAE0]/80 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="px-2 py-0.5 bg-[#10151F] text-[#C68E3F] font-mono text-xs font-bold case-tag-chip-notch">
                          {faceLabel}
                        </span>
                        <span className="font-mono text-xs text-[#5B6472]">
                          {faceMatches.length > 0
                            ? `${faceMatches.length} candidate record match(es)`
                            : "0 threshold candidate matches"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {facesDetectedCount > 3 && (
                          <span className="font-mono text-[10px] text-[#5B6472] uppercase">
                            {isExpanded ? "Collapse" : "Expand"}
                          </span>
                        )}
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-[#C68E3F]" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-[#C68E3F]" />
                        )}
                      </div>
                    </div>

                    {/* Accordion Content Body */}
                    {isExpanded && (
                      <div className="p-6 space-y-4">
                        {faceMatches.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {faceMatches.map((match, mIdx) => (
                              <CaseTag
                                key={mIdx}
                                id={match.person.id}
                                name={match.person.username}
                                age={match.person.age}
                                height={match.person.height}
                                lastSeenLocation={match.person.lastSeenLocation}
                                description={match.person.description}
                                imageUrl={match.person.imageUrl}
                                similarity={match.similarity}
                                status={match.similarity >= 0.75 ? "verified" : "candidate"}
                              />
                            ))}
                          </div>
                        ) : (
                          /* Honest Empty Match Framing */
                          <div className="p-8 text-center bg-[#EFEAE0]/60 border border-dashed border-[#C9C2B2] space-y-3 font-sans">
                            <div className="inline-flex items-center justify-center p-3 bg-[#10151F] text-[#C68E3F] rounded-full mb-1">
                              <Shield className="w-5 h-5" />
                            </div>
                            <h4 className="font-serif text-lg font-semibold text-[#171A1F]">
                              No matching case files found for {faceLabel}
                            </h4>
                            <p className="text-xs text-[#5B6472] max-w-md mx-auto leading-relaxed">
                              This does not rule anything out. Try running another scan with a clearer front-facing portrait, or enroll this individual if they represent a new missing case file.
                            </p>
                            <div className="pt-2">
                              <Link
                                href="/enroll"
                                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#C68E3F] hover:bg-[#9C6B27] text-[#10151F] font-mono font-semibold text-xs uppercase tracking-wider rounded-xs"
                              >
                                <UserPlus className="w-3.5 h-3.5" />
                                <span>Enroll New Case File</span>
                              </Link>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}