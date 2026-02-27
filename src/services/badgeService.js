// badgeService.js
// Badge definitions and logic for computing which badges a user has earned.
// Badges are based on review count and upvotes received.

// ── Badge catalogue ───────────────────────────────────────────────────────
// Each badge has:
//   id         — unique key stored in Firestore
//   label      — display name
//   icon       — emoji
//   description — shown in tooltip / profile
//   tier       — "bronze" | "silver" | "gold" | "legendary"
//   check(stats) → boolean  — pure fn, no side effects

export const BADGES = [
  // ── Review count badges ───────────────────────────────────────────────
  {
    id:          "first_bite",
    label:       "First Bite",
    icon:        "🍴",
    description: "Submitted your very first review.",
    tier:        "bronze",
    check:       s => s.reviewCount >= 1,
  },
  {
    id:          "regular",
    label:       "Regular",
    icon:        "🪑",
    description: "Written 5 or more reviews.",
    tier:        "bronze",
    check:       s => s.reviewCount >= 5,
  },
  {
    id:          "seasoned_critic",
    label:       "Seasoned Critic",
    icon:        "🧂",
    description: "Reached 10 reviews — the community trusts your palate.",
    tier:        "silver",
    check:       s => s.reviewCount >= 10,
  },
  {
    id:          "prolific",
    label:       "Prolific",
    icon:        "📋",
    description: "25 reviews and counting.",
    tier:        "silver",
    check:       s => s.reviewCount >= 25,
  },
  {
    id:          "top_critic",
    label:       "Top Critic",
    icon:        "🏆",
    description: "50 reviews. You've seen it all.",
    tier:        "gold",
    check:       s => s.reviewCount >= 50,
  },
  {
    id:          "legend",
    label:       "Legend",
    icon:        "⭐",
    description: "100 reviews. The community bows to your experience.",
    tier:        "legendary",
    check:       s => s.reviewCount >= 100,
  },

  // ── Upvote badges ─────────────────────────────────────────────────────
  {
    id:          "crowd_pleaser",
    label:       "Crowd Pleaser",
    icon:        "👍",
    description: "Your reviews have earned 10 upvotes.",
    tier:        "bronze",
    check:       s => s.totalUpvotesReceived >= 10,
  },
  {
    id:          "trusted_voice",
    label:       "Trusted Voice",
    icon:        "🎙️",
    description: "50 upvotes received — people listen to you.",
    tier:        "silver",
    check:       s => s.totalUpvotesReceived >= 50,
  },
  {
    id:          "community_pillar",
    label:       "Community Pillar",
    icon:        "🏛️",
    description: "200 upvotes received. You shape the conversation.",
    tier:        "gold",
    check:       s => s.totalUpvotesReceived >= 200,
  },
  {
    id:          "oracle",
    label:       "The Oracle",
    icon:        "🔮",
    description: "500 upvotes. Your word is gospel.",
    tier:        "legendary",
    check:       s => s.totalUpvotesReceived >= 500,
  },
];

// ── Tier styling ──────────────────────────────────────────────────────────
export const TIER_STYLES = {
  bronze: {
    color:  "#cd7f32",
    bg:     "#cd7f3215",
    border: "#cd7f3235",
    glow:   "#cd7f3230",
    label:  "Bronze",
  },
  silver: {
    color:  "#a8a8b8",
    bg:     "#a8a8b815",
    border: "#a8a8b835",
    glow:   "#a8a8b830",
    label:  "Silver",
  },
  gold: {
    color:  "#e6a535",
    bg:     "#e6a53518",
    border: "#e6a53540",
    glow:   "#e6a53535",
    label:  "Gold",
  },
  legendary: {
    color:  "#c084fc",
    bg:     "#c084fc15",
    border: "#c084fc40",
    glow:   "#c084fc35",
    label:  "Legendary",
  },
};

// ── Compute which badges a user has earned ────────────────────────────────
// stats: { reviewCount: number, totalUpvotesReceived: number }
// Returns array of badge objects (earned ones only)
export function computeEarnedBadges(stats) {
  if (!stats) return [];
  return BADGES.filter(b => b.check(stats));
}

// ── Compute newly unlocked badges (diff between old and new stats) ────────
// Returns badges that are in newEarned but not in alreadyEarned
export function computeNewBadges(stats, existingBadgeIds = []) {
  const earned = computeEarnedBadges(stats);
  return earned.filter(b => !existingBadgeIds.includes(b.id));
}

// ── Get the most prestigious badge a user holds (for display in ReviewCard)─
export function getPrimaryBadge(earnedBadges) {
  const tierOrder = ["legendary", "gold", "silver", "bronze"];
  for (const tier of tierOrder) {
    const match = earnedBadges.find(b => b.tier === tier);
    if (match) return match;
  }
  return null;
}