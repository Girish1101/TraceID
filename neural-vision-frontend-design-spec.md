# Neural Vision (pdlab) — Frontend Design Spec

**Handoff document.** Give this whole file to whichever AI/dev builds the UI. It covers design direction, tokens, layout, and page-by-page specs for Home, Enrollment, and Face Detection (Scan).

---

## 0. Design direction & rationale

This is not a consumer app or a sci-fi face-scanner demo. It's a working tool used by investigators, NGOs, and families in an active search for a missing person. The UI has to earn trust in seconds: precise, calm, legible under stress, never gamified, never "cyberpunk facial recognition." No neon scan-lines, no glowing bounding boxes pulsing over stock photos, no dark-hacker-terminal cliché.

**Reference world:** missing-person bulletins, forensic case files, evidence tags, field-report clipboards, analog measurement instruments (dials, gauges, calipers). This is where the visual vocabulary comes from — not from generic "AI product" styling.

**Signature element — the Case Tag:** every profile (in enrollment, in search results, in the database) renders as a stamped case card: a squared-off card with a die-cut notch in the top-left corner (like a manila folder tab) and a small perforation line under the header, as if torn from a ledger. Match confidence is never shown as a progress bar or big percentage — it's shown as a **semicircular instrument dial** (like a analog meter needle), because "confidence" here should read as a measured, calibrated reading, not a marketing stat. This dial and the case-tag card are reused everywhere a result or profile appears, so the whole product feels like one instrument, not three different templates stitched together.

---

## 1. Design tokens

### Color (use CSS variables, not hardcoded hex in components)

| Token | Hex | Use |
|---|---|---|
| `--ink-900` | `#10151F` | Primary dark background (nav, hero, footer) |
| `--ink-700` | `#1B2333` | Elevated dark surfaces (cards on dark bg) |
| `--paper-100` | `#EFEAE0` | Light background for content-dense pages (enrollment form, results list) |
| `--paper-50` | `#F7F5F0` | Card surface on paper background |
| `--line` | `#C9C2B2` | Hairline rules, card borders on paper |
| `--ink-text` | `#171A1F` | Body text on paper |
| `--paper-text` | `#EDE9DF` | Body text on ink |
| `--brass-500` | `#C68E3F` | Primary accent — CTAs, active states, the dial needle |
| `--brass-700` | `#9C6B27` | Brass hover/pressed |
| `--signal-red` | `#A63A2E` | "Missing / unresolved" status, critical alerts, destructive actions |
| `--verified-teal` | `#3F6B62` | "Match confirmed / found" status, success states |
| `--muted-slate` | `#5B6472` | Secondary text, captions, disabled states |

Do not introduce a warm-cream-plus-terracotta combo, a pure-black-plus-neon combo, or a zero-radius broadsheet grid — the tokens above intentionally sit apart from those defaults. Corner radius is small and consistent (4px) except the Case Tag's die-cut notch, which is the one deliberate irregular shape in the system.

### Typography

- **Display serif** — `Source Serif 4` (or `Newsreader` as fallback), weight 600. Used for page headlines and case names only. Set tight (-1% letter spacing) at large sizes.
- **Body / UI sans** — `IBM Plex Sans`. Used for all interface copy, labels, buttons, nav.
- **Utility mono** — `IBM Plex Mono`. Used exclusively for anything that reads as *data*: case ID numbers, timestamps, coordinates, embedding dimensions, confidence percentages, file metadata. This mono/serif/sans split is a functional signal — if it's in mono, it's a machine-generated or measured value; if it's serif, it's a human name/title; sans is everything else.

Type scale (rem, base 16px): 3.5 / 2.25 / 1.5 / 1.125 / 1 / 0.875 / 0.75. Headlines use the serif at 3.5/2.25, everything else sans or mono at 1.125 and below.

### Layout

- 12-column grid, max content width 1280px, 24px gutters, 16px on mobile.
- Two background modes per page: **ink mode** (dark, for Home hero and global nav) and **paper mode** (light, for Enrollment and Scan — these are working/data-entry surfaces and read better light).
- Spacing scale: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96.

---

## 2. Global chrome (all pages)

```
┌──────────────────────────────────────────────────────────┐
│ NEURAL VISION [brass mark]      Home  Enroll  Scan   ⓘ    │  ← ink-900, sticky
└──────────────────────────────────────────────────────────┘
```

- Logo mark: a minimal caliper/bracket glyph (two small corner-brackets, like a crop mark) next to the wordmark "NEURAL VISION" set in the mono face, tracked wide, small caps. This crop-mark motif echoes the die-cut notch on Case Tags — same idea at two scales.
- Nav items are plain sans, no pill buttons. Active page gets a 2px brass underline, not a filled background.
- Footer (all pages): quiet, ink-900, single line — org name, a data-handling/privacy link, and a small note on responsible use. No large footer graphic.

---

## 3. Page 1 — Home

**Job of this page:** in one screen, tell a visitor what the tool does, who it's for, and give them exactly two doors: *Enroll a missing person* or *Scan a photo to search*. It is not a marketing page selling "AI face recognition" — it's an operations entry point.

```
┌──────────────────────────────────────────────────────────┐
│ [nav]                                                     │
├──────────────────────────────────────────────────────────┤
│  ink-900 hero                                             │
│  eyebrow (mono): CASE-MATCHING SYSTEM · 512-DIM VECTOR    │
│                                                            │
│  H1 (serif, large): "Every profile is a lead.             │
│  Every scan is a chance to close the case."               │
│                                                            │
│  sub (sans, muted-paper): one-line plain explanation of   │
│  what happens — embeddings compared, not "AI magic"       │
│                                                            │
│  [ Enroll a person ]  [ Scan a photo ]   ← brass primary, │
│                                             outline second │
├──────────────────────────────────────────────────────────┤
│  paper-100 band — "How a match is made" (3 steps)         │
│  01 Enroll   →   02 Detect faces   →   03 Compare & score │
│  (numbered here IS correct — it's a real sequential       │
│  pipeline, not decoration)                                │
├──────────────────────────────────────────────────────────┤
│  paper-50 band — live-feel stats strip, mono numerals:    │
│  PROFILES ENROLLED · SCANS RUN · MATCHES CONFIRMED         │
│  (pull real counts from the API; never fabricate live     │
│  numbers in the shipped UI — show a skeleton until loaded)│
├──────────────────────────────────────────────────────────┤
│  ink-900 band — trust / responsible-use note:              │
│  short paragraph on human review of every match,          │
│  data handling, and that results are leads, not proof     │
├──────────────────────────────────────────────────────────┤
│ [footer]                                                   │
└──────────────────────────────────────────────────────────┘
```

**Hero copy notes:** avoid "powered by AI," "revolutionary," "cutting-edge." Say what the system actually does in plain verbs: "compares a photo against enrolled profiles and returns the closest matches." This is a tool people's real cases run through — the copy should sound like a field manual, not a pitch deck.

**Motion:** one deliberate moment only — on load, the hero eyebrow line and headline fade/rise in over ~400ms, staggered by ~80ms. No scroll-triggered parallax, no floating particles, no animated face-mesh graphics. Respect `prefers-reduced-motion` (skip the stagger, just show content).

**Signature element on this page:** the 3-step pipeline band renders each step as a small Case-Tag-style chip (die-cut corner notch, mono step number) connected by a thin brass line — this is the first place the user sees the case-tag motif before it reappears as full profile cards later.

---

## 4. Page 2 — Enrollment

**Job of this page:** capture a missing person's photo + metadata, generate the embedding, and confirm the record was saved — in a form that feels like filling out a careful intake report, not a generic signup form.

Background: **paper mode**. This is a data-entry surface.

```
┌──────────────────────────────────────────────────────────┐
│ [nav]                                                      │
│ eyebrow (mono): NEW CASE FILE                              │
│ H1 (serif): Enroll a missing person                        │
├───────────────────────────┬────────────────────────────────┤
│ LEFT: photo intake         │ RIGHT: metadata form            │
│                             │                                │
│ ┌─────────────────────┐   │  Full name        [_________]  │
│ │  drop zone           │   │  Age              [___]         │
│ │  dashed border,       │   │  Height (cm)      [___]         │
│ │  camera/upload icon,  │   │  Last seen location [______]   │
│ │  "Drop a clear photo  │   │  Last seen date   [_________]  │
│ │  or click to browse"  │   │  Distinguishing    [textarea]  │
│ └─────────────────────┘   │   features/description          │
│                             │                                │
│ once uploaded → shows as   │  Contact / reporting agency     │
│ a live Case Tag preview     │   [_________]                  │
│ (die-cut card, photo, name │                                │
│ placeholder "—", ID: —)    │  [ Save case file ]  brass CTA  │
│                             │                                │
│ face-detect status line     │                                │
│ (mono, small): "1 face      │                                │
│ detected · confidence 0.98" │                                │
│ or a clear error if 0 or   │                                │
│ >1 faces found              │                                │
└───────────────────────────┴────────────────────────────────┘
```

**Behavior details:**

- The left preview is *live* — as soon as a photo is dropped, run detection client-side-triggered (calling the Flask MTCNN endpoint) and show a thin, precise single bounding rectangle (1px brass line, square corners — not a rounded glowing box) directly on the preview image. If MTCNN finds zero faces or more than one, block submission with a specific inline message ("No face detected — try a clearer, front-facing photo" / "Multiple faces detected — please crop to one person"), never a generic "error."
- As form fields are filled, the Case Tag preview on the left updates live (name, age, location) — so by the time the person clicks Save, they've effectively been looking at a preview of the finished record the whole time. This is the page's one signature interaction moment.
- Required vs optional fields are distinguished by weight, not by red asterisks scattered everywhere — only the field label goes to `--ink-text` full weight when required; optional fields are `--muted-slate`.
- On successful save: don't just toast "Success." Show the finished Case Tag with a small **stamp animation** — a brass-outlined "ENROLLED" stamp rotates/settles onto the corner of the card (short, ~250ms, respects reduced-motion by just appearing). This is the emotional beat of the page — a case file becoming official — so it's the one place worth a crafted animation.
- Below the form, a quiet strip: "Case ID: CN-000482 · Embedding generated (512-dim) · Stored [timestamp]" in mono — makes the underlying system legible without over-explaining it.

**Errors & empty states:** if the embedding service is unreachable, say so plainly in the interface's voice: "Couldn't reach the detection service. Your entry hasn't been saved — try again in a moment." No apology, no vague "something went wrong."

---

## 5. Page 3 — Face Detection / Scan

**Job of this page:** upload a single photo or a crowd photo, run detection + embedding, and return ranked candidate matches from the enrolled database with honest, calibrated confidence — including a clear state for "no match found," which must never be styled as a failure.

Background: **paper mode**.

```
┌──────────────────────────────────────────────────────────┐
│ [nav]                                                      │
│ eyebrow (mono): SEARCH / IDENTIFY                          │
│ H1 (serif): Scan a photo                                   │
│ sub: "Upload a photo. We'll compare any detected faces     │
│  against enrolled case files."                              │
├──────────────────────────────────────────────────────────┤
│  drop zone (same visual language as Enrollment's, for      │
│  consistency) — accepts single-person OR crowd photos      │
├──────────────────────────────────────────────────────────┤
│  once uploaded: image displayed at full width with thin    │
│  brass bounding boxes on every detected face, each box      │
│  numbered (01, 02, 03…) in mono — numbering here IS         │
│  meaningful, it maps directly to the result cards below     │
├──────────────────────────────────────────────────────────┤
│  RESULTS — one section per detected face                    │
│                                                              │
│  ── Face 01 ──────────────────────────────────────────      │
│  [thumbnail crop]   Top matches:                            │
│                                                              │
│   ┌───────────────┐  ┌───────────────┐  ┌───────────────┐  │
│   │ Case Tag       │  │ Case Tag       │  │ Case Tag       │  │
│   │ photo          │  │ photo          │  │ photo          │  │
│   │ Name           │  │ Name           │  │ Name           │  │
│   │ Case ID (mono) │  │ Case ID (mono) │  │ Case ID (mono) │  │
│   │  ◔ dial: 0.91   │  │  ◔ dial: 0.74   │  │  ◔ dial: 0.52   │  │
│   │ [View case file]│  │ [View case file]│  │ [View case file]│  │
│   └───────────────┘  └───────────────┘  └───────────────┘  │
│                                                              │
│  ── Face 02 ── (repeat) ──────────────────────────────      │
└──────────────────────────────────────────────────────────┘
```

**The confidence dial (signature component, reused from spec §0):** a small semicircular gauge, brass needle, three unlabeled bands rendered in `--verified-teal` (high), `--brass-500` (moderate), `--signal-red` (low) as the arc background — the needle position is the only precise value; the mono number underneath (`0.91`) is the actual figure. Never round dramatically or hide the number behind a vague label like "Strong match" alone — always show both the plain-language band and the number, e.g. "Likely match · 0.91."

**Threshold behavior:**
- Scores are always shown, but candidates below a configurable low-confidence threshold (e.g. <0.4) are visually deprioritized — smaller card, `--muted-slate` dial arc — not hidden, since a human reviewer may still want to see everything, but the UI shouldn't imply a weak candidate is a real match.
- If zero enrolled profiles clear any reasonable threshold, show a calm empty state, not a dead end: "No matching case files found for Face 01. This doesn't rule anything out — try a clearer photo, or enroll this person if they're a new case." with a secondary CTA into Enrollment.

**Crowd photo behavior:** if many faces are detected, results sections are collapsed by default (accordion, one row per face: thumbnail + top match name + score), expandable to the full 3-card layout — keeps a 15-face crowd photo scannable instead of a mile of cards.

**Critical framing note for copy throughout this page:** never say "identified" or "found" as a system claim — the system returns *candidate matches for human review*, it does not confirm identity. Microcopy should consistently use "possible match," "candidate," "for review" rather than declarative language, both for accuracy and because this is the ethically correct way to represent an automated system's output on something this consequential.

---

## 6. Shared components checklist

- **Case Tag card** — die-cut top-left notch, photo, serif name, mono case ID, status pill (Missing = signal-red outline, Verified/Found = verified-teal outline), used in Enrollment preview, Scan results, and any future "browse database" view.
- **Confidence dial** — semicircular gauge described above.
- **Drop zone** — identical component on Enrollment and Scan for consistency; dashed `--line` border, brass on drag-hover.
- **Bounding box overlay** — 1px brass square-cornered rectangle with small mono index label, used identically on both Enrollment (single face) and Scan (multi-face).
- **Buttons** — primary: solid brass, ink text, 4px radius, no gradient, no shadow beyond a 1px offset on hover. Secondary: outline in `--line`, fills brass on hover. Destructive actions (e.g., delete case file) use `--signal-red` outline only, never solid — a destructive action shouldn't visually shout louder than a primary action.

## 7. Accessibility & responsive floor

- All color pairings above meet WCAG AA for text (verify brass-on-ink and ink-text-on-paper contrast in implementation).
- Every bounding box and dial must have an equivalent text/aria label (e.g. "Face 1 of 3, match confidence 0.91") — the visual instrument is a supplement, not the only channel.
- Keyboard focus states: visible 2px brass outline, offset 2px, on every interactive element — no `outline: none` without a replacement.
- Mobile (< 640px): Enrollment's two-column layout stacks (photo intake above form); Scan's 3-across result cards become a horizontal-scroll row or single column; nav collapses to a simple menu, keep it plain text, not a hamburger hiding inside a heavy drawer animation.
- Respect `prefers-reduced-motion` everywhere motion is mentioned above.

## 8. Voice quick-reference

Plain verbs, sentence case, no filler. Name things by what the person is doing ("Enroll a person," "Scan a photo") not by system internals ("Run inference," "Upload to Cloudinary"). Errors state what happened and what to do next, in the interface's voice, no apologies. Results are always framed as candidates for review, never as confirmed identifications.
