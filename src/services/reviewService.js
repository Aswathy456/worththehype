// reviewService.js
// Uses Firebase Realtime Database (not Firestore) to match existing project setup.
// Paths:
//   reviews/{restaurantId}/{reviewId}         — review data
//   votes/{restaurantId}/{reviewId}/{userId}  — { value: 1 | -1 }
//   userStats/{userId}                        — { reviewCount, totalUpvotesReceived, badges[] }

import {
  ref, push, set, get, remove, update, runTransaction,
} from "firebase/database";
import { db } from "../firebase";

// ── Submit a new review ───────────────────────────────────────────────────
export async function submitReview(restaurantId, user, { hypeGiven, realityGiven, text }) {
  const reviewsRef = ref(db, `reviews/${restaurantId}`);
  await push(reviewsRef, {
    uid:            user.uid,
    displayName:    user.displayName || "Anonymous",
    accountCreated: user.metadata?.creationTime
      ? new Date(user.metadata.creationTime).getTime()
      : null,
    hypeGiven,
    realityGiven,
    text:      text.trim(),
    upvotes:   0,
    downvotes: 0,
    score:     0,
    createdAt: Date.now(),
  });

  // Increment review count in userStats
  const countRef = ref(db, `userStats/${user.uid}/reviewCount`);
  await runTransaction(countRef, current => (current || 0) + 1);
}

// ── Vote on a review ──────────────────────────────────────────────────────
// value: 1 (upvote) | -1 (downvote). Voting same again removes the vote.
export async function voteOnReview(restaurantId, reviewId, voterId, value) {
  const voteRef   = ref(db, `votes/${restaurantId}/${reviewId}/${voterId}`);
  const reviewRef = ref(db, `reviews/${restaurantId}/${reviewId}`);

  const voteSnap = await get(voteRef);
  const existing = voteSnap.exists() ? voteSnap.val().value : 0;

  // Get author uid to update their upvote count
  const reviewSnap = await get(reviewRef);
  if (!reviewSnap.exists()) return;
  const authorUid = reviewSnap.val().uid;

  if (existing === value) {
    // Toggle off — remove vote
    await remove(voteRef);
    const upvotesDelta   = value ===  1 ? -1 : 0;
    const downvotesDelta = value === -1 ? -1 : 0;
    const scoreDelta     = value ===  1 ? -1 : 1;
    await _applyVoteDeltas(reviewRef, upvotesDelta, downvotesDelta, scoreDelta);
    if (value === 1 && authorUid) await _adjustAuthorUpvotes(authorUid, -1);
  } else if (existing !== 0) {
    // Switch vote
    await set(voteRef, { value });
    const upvotesDelta   = value ===  1 ?  1 : -1;
    const downvotesDelta = value === -1 ?  1 : -1;
    const scoreDelta     = value ===  1 ?  2 : -2;
    await _applyVoteDeltas(reviewRef, upvotesDelta, downvotesDelta, scoreDelta);
    const authorDelta = value === 1 ? 1 : -1;
    if (authorUid) await _adjustAuthorUpvotes(authorUid, authorDelta);
  } else {
    // Fresh vote
    await set(voteRef, { value });
    const upvotesDelta   = value ===  1 ? 1 : 0;
    const downvotesDelta = value === -1 ? 1 : 0;
    const scoreDelta     = value ===  1 ? 1 : -1;
    await _applyVoteDeltas(reviewRef, upvotesDelta, downvotesDelta, scoreDelta);
    if (value === 1 && authorUid) await _adjustAuthorUpvotes(authorUid, 1);
  }
}

async function _applyVoteDeltas(reviewRef, upvotesDelta, downvotesDelta, scoreDelta) {
  await runTransaction(reviewRef, current => {
    if (!current) return current;
    return {
      ...current,
      upvotes:   (current.upvotes   || 0) + upvotesDelta,
      downvotes: (current.downvotes || 0) + downvotesDelta,
      score:     (current.score     || 0) + scoreDelta,
    };
  });
}

async function _adjustAuthorUpvotes(authorUid, delta) {
  const upRef = ref(db, `userStats/${authorUid}/totalUpvotesReceived`);
  await runTransaction(upRef, current => (current || 0) + delta);
}

// ── Get a user's vote on a specific review ────────────────────────────────
export async function getUserVote(restaurantId, reviewId, userId) {
  if (!userId) return 0;
  const snap = await get(ref(db, `votes/${restaurantId}/${reviewId}/${userId}`));
  return snap.exists() ? snap.val().value : 0;
}

// ── Get user stats ────────────────────────────────────────────────────────
export async function getUserStats(userId) {
  if (!userId) return null;
  const snap = await get(ref(db, `userStats/${userId}`));
  return snap.exists()
    ? snap.val()
    : { reviewCount: 0, totalUpvotesReceived: 0, badges: [] };
}

// ── Save earned badge IDs back to the database ────────────────────────────
export async function saveUserBadges(userId, badgeIds) {
  await set(ref(db, `userStats/${userId}/badges`), badgeIds);
}