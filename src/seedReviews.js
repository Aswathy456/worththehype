import { ref, set, get } from "firebase/database";
import { db } from "./firebase";

const DUMMY_USERS = [
  { uid: "dummy_1", displayName: "nair_eats",       accountCreated: Date.now() - 420 * 86400000 },
  { uid: "dummy_2", displayName: "fort_foodie",     accountCreated: Date.now() - 210 * 86400000 },
  { uid: "dummy_3", displayName: "realist_rajan",   accountCreated: Date.now() - 580 * 86400000 },
  { uid: "dummy_4", displayName: "hidden_gems_kl",  accountCreated: Date.now() - 730 * 86400000 },
  { uid: "dummy_5", displayName: "vibes_only_vinu", accountCreated: Date.now() - 95  * 86400000 },
  { uid: "dummy_6", displayName: "kochi_critic",    accountCreated: Date.now() - 300 * 86400000 },
  { uid: "dummy_7", displayName: "spice_hunter",    accountCreated: Date.now() - 45  * 86400000 },
];

const REVIEW_TEMPLATES = [
  { hypeGiven: 8,   realityGiven: 9,   userIndex: 0, daysAgo: 30, upvotes: 34,
    text: "The food here is the real deal. No tourist markup, honest cooking. Totally lives up to the hype." },
  { hypeGiven: 9,   realityGiven: 9.5, userIndex: 1, daysAgo: 15, upvotes: 21,
    text: "Came here after seeing it trending online. Expected disappointment. Got the best meal I've had in Kochi. Rare W." },
  { hypeGiven: 7,   realityGiven: 8,   userIndex: 6, daysAgo: 7,  upvotes: 12,
    text: "Solid place. Service was a bit slow on a busy weekend but the food quality makes up for it." },
  { hypeGiven: 9.5, realityGiven: 5,   userIndex: 2, daysAgo: 45, upvotes: 89,
    text: "Waited ages for something mediocre. The Instagram photos are doing a lot of heavy lifting here." },
  { hypeGiven: 8,   realityGiven: 7,   userIndex: 4, daysAgo: 20, upvotes: 45,
    text: "The vibe is nice. Food is average at best. Worth one visit, not for a second." },
  { hypeGiven: 5,   realityGiven: 9.5, userIndex: 3, daysAgo: 60, upvotes: 112,
    text: "This place has no business being this good and this unknown. My autorickshaw driver recommended it. Best tip I ever got." },
  { hypeGiven: 6,   realityGiven: 9,   userIndex: 0, daysAgo: 10, upvotes: 67,
    text: "Underrated doesn't cover it. If you know, you know. Go early before it gets crowded." },
  { hypeGiven: 7,   realityGiven: 8.5, userIndex: 5, daysAgo: 25, upvotes: 38,
    text: "Classic spot. Takes you back to how food used to be — no frills, all soul." },
  { hypeGiven: 8,   realityGiven: 6,   userIndex: 6, daysAgo: 14, upvotes: 19,
    text: "Honestly overhyped by locals. Decent food but nothing that justifies the wait or the reputation." },
  { hypeGiven: 7,   realityGiven: 9,   userIndex: 1, daysAgo: 5,  upvotes: 28,
    text: "Hidden gem. The kind of place you don't tell too many people about because you don't want it to get ruined." },
  { hypeGiven: 9,   realityGiven: 8.5, userIndex: 3, daysAgo: 18, upvotes: 55,
    text: "Lives up to the hype mostly. A couple of dishes were exceptional, one was just okay. Still recommend." },
  { hypeGiven: 6,   realityGiven: 7.5, userIndex: 5, daysAgo: 35, upvotes: 22,
    text: "Better than expected for a place with this little online presence. The staff are genuinely warm." },
];

export async function seedDummyReviews(restaurants) {
  if (!restaurants || restaurants.length === 0) return;

  // Check if already seeded
  const checkRef = ref(db, `seeded`);
  const snap = await get(checkRef);
  if (snap.exists()) {
    console.log("Already seeded, skipping.");
    return;
  }

  // Distribute reviews across the first 6 restaurants
  const targets = restaurants.slice(0, 6);
  let seeded = 0;

  for (let i = 0; i < targets.length; i++) {
    const restaurant = targets[i];
    // Give each restaurant 2 reviews from the template list
    const reviewsForThis = REVIEW_TEMPLATES.slice(i * 2, i * 2 + 2);

    for (const template of reviewsForThis) {
      const user = DUMMY_USERS[template.userIndex];
      const stableKey = `seed_${user.uid}_r${i}`;
      await set(ref(db, `reviews/${restaurant.id}/${stableKey}`), {
        uid: user.uid,
        displayName: user.displayName,
        accountCreated: user.accountCreated,
        hypeGiven: template.hypeGiven,
        realityGiven: template.realityGiven,
        text: template.text,
        upvotes: template.upvotes,
        createdAt: Date.now() - template.daysAgo * 86400000,
      });
      seeded++;
    }
  }

  // Mark as seeded so we never run again
  await set(ref(db, `seeded`), true);
  console.log(`✓ Seeded ${seeded} reviews across ${targets.length} restaurants`);
}