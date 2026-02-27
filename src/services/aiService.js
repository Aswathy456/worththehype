// aiService.js
// Two AI features:
//   1. generateRestaurantSummary(reviews) → cached aggregate summary
//   2. analyzeReviewCredibility(reviewText) → { tag, confidence, signals }
//
// Summaries are cached in Firebase at ai_cache/{restaurantId}
// so the API is only called when reviews change, not on every page load.

import { ref, get, set } from "firebase/database";
import { db } from "../firebase";

const ANTHROPIC_API = "https://api.anthropic.com/v1/messages";
const MODEL         = "claude-sonnet-4-20250514";

// ── Internal fetch helper ─────────────────────────────────────────────────
async function callClaude(systemPrompt, userPrompt, maxTokens = 400) {
  const res = await fetch(ANTHROPIC_API, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model:      MODEL,
      max_tokens: maxTokens,
      system:     systemPrompt,
      messages:   [{ role: "user", content: userPrompt }],
    }),
  });
  if (!res.ok) throw new Error(`Claude API error: ${res.status}`);
  const data = await res.json();
  return data.content?.[0]?.text?.trim() ?? "";
}

// ── PART 1: Restaurant summary ────────────────────────────────────────────
// Returns { summary, generatedAt, reviewCount }
// Caches result in Firebase. Re-generates only if reviewCount has changed.

export async function getRestaurantSummary(restaurantId, reviews) {
  if (!reviews || reviews.length === 0) return null;

  const cacheRef  = ref(db, `ai_cache/${restaurantId}/summary`);
  const cacheSnap = await get(cacheRef);

  // Return cache if review count hasn't changed
  if (cacheSnap.exists()) {
    const cached = cacheSnap.val();
    if (cached.reviewCount === reviews.length) return cached;
  }

  // Build review corpus — anonymised, text only
  const corpus = reviews
    .slice(0, 20) // cap at 20 to stay within token budget
    .map((r, i) =>
      `Review ${i + 1} [Hype: ${r.hypeGiven}/10, Reality: ${r.realityGiven}/10]: "${r.text}"`
    )
    .join("\n");

  const system = `You are an impartial analyst summarising community restaurant reviews for a food discovery app.
Your output must follow these rules exactly:
- 2–3 sentences maximum
- No emojis, no bullet points, no headings
- No opinions of your own — only patterns from the reviews
- No hype language ("amazing", "fantastic", "must-visit")
- Focus on: what people praise, what they criticise, any recurring patterns
- Write in neutral, editorial English
- Never mention reviewer names or personal details
- If fewer than 3 reviews exist, note that the sample is small`;

  const prompt = `Summarise the following ${reviews.length} reviews for a restaurant:\n\n${corpus}`;

  const summary = await callClaude(system, prompt, 200);

  const result = {
    summary,
    reviewCount:  reviews.length,
    generatedAt:  Date.now(),
  };

  await set(cacheRef, result);
  return result;
}

// ── PART 2: Individual review credibility ─────────────────────────────────
// Returns { tag: "genuine" | "low_confidence" | "promotional", confidence: 0–100, signals: string[] }
// Cached per review at ai_cache/{restaurantId}/credibility/{reviewId}

export async function getReviewCredibility(restaurantId, reviewId, reviewText) {
  // Check cache first
  const cacheRef  = ref(db, `ai_cache/${restaurantId}/credibility/${reviewId}`);
  const cacheSnap = await get(cacheRef);
  if (cacheSnap.exists()) return cacheSnap.val();

  const system = `You are a review authenticity analyst for a restaurant discovery platform.
Analyse the review text and respond with ONLY valid JSON — no markdown, no explanation outside the JSON.
JSON shape:
{
  "tag": "genuine" | "low_confidence" | "promotional",
  "confidence": <integer 0-100>,
  "signals": [<up to 3 short strings explaining your reasoning>]
}

Definitions:
- "genuine": First-hand language, specific dishes/details/timing, balanced or nuanced tone. confidence 70–100.
- "low_confidence": Vague, very short, or lacks specific experience. Could be real but hard to verify. confidence 40–69.
- "promotional": Marketing tone, excessive superlatives without specifics, reads like advertising copy. confidence 0–39.

Be conservative — default to low_confidence when uncertain. Never call a review fake.`;

  const prompt = `Analyse this review:\n"${reviewText}"`;

  let result;
  try {
    const raw  = await callClaude(system, prompt, 150);
    const json = raw.replace(/```json|```/g, "").trim();
    result = JSON.parse(json);
    // Clamp and validate
    result.confidence = Math.max(0, Math.min(100, result.confidence ?? 50));
    if (!["genuine", "low_confidence", "promotional"].includes(result.tag)) {
      result.tag = "low_confidence";
    }
    if (!Array.isArray(result.signals)) result.signals = [];
  } catch {
    result = { tag: "low_confidence", confidence: 50, signals: ["Analysis unavailable"] };
  }

  await set(cacheRef, result);
  return result;
}

// ── PART 3: Weighted score calculation ────────────────────────────────────
// Takes reviews with credibility tags and returns an AI-weighted reality score.
// Genuine → 1.0 weight, low_confidence → 0.6, promotional → 0.2
export function computeWeightedRealityScore(reviews, credibilityMap) {
  const WEIGHTS = { genuine: 1.0, low_confidence: 0.6, promotional: 0.2 };

  let totalWeight = 0;
  let weightedSum = 0;

  reviews.forEach((r, i) => {
    const reviewId   = r._id ?? String(i);
    const credResult = credibilityMap[reviewId];
    const weight     = credResult ? (WEIGHTS[credResult.tag] ?? 0.6) : 0.6;
    weightedSum  += r.realityGiven * weight;
    totalWeight  += weight;
  });

  if (totalWeight === 0) return null;
  return parseFloat((weightedSum / totalWeight).toFixed(1));
}