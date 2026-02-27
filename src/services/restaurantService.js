// restaurantService.js
// Strategy:
// 1. Return in-memory cache instantly if already fetched this session
// 2. Try sessionStorage for persistence across page refreshes
// 3. Only hit Overpass API if nothing is cached
// This means the slow API call happens ONCE per browser session max.

const CACHE_KEY = "wth_kochi_restaurants";
const ENDPOINTS = [
  "https://overpass.kumi.systems/api/interpreter",
  "https://maps.mail.ru/osm/tools/overpass/api/interpreter",
  "https://overpass-api.de/api/interpreter",
];

// Tighter bounding box = faster query (central Kochi only)
const QUERY = `[out:json][timeout:20];node["amenity"="restaurant"]["name"](9.94,76.27,10.02,76.32);out body qt;`;

// In-memory cache — survives re-renders, cleared on tab close
let memoryCache = null;

export async function fetchKochiRestaurants() {
  // 1. Return from memory instantly
  if (memoryCache) {
    console.log("✓ Serving from memory cache");
    return memoryCache;
  }

  // 2. Return from sessionStorage (survives refresh, clears on tab close)
  try {
    const stored = sessionStorage.getItem(CACHE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed?.length > 0) {
        memoryCache = parsed;
        console.log("✓ Serving from sessionStorage cache");
        return parsed;
      }
    }
  } catch (_) {}

  // 3. Fetch from API
  console.log("Fetching from Overpass API...");
  const places = await fetchFromOverpass();

  // Save to both caches
  memoryCache = places;
  try { sessionStorage.setItem(CACHE_KEY, JSON.stringify(places)); } catch (_) {}

  return places;
}

async function fetchFromOverpass() {
  let lastError;

  for (const endpoint of ENDPOINTS) {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `data=${encodeURIComponent(QUERY)}`,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const places = data.elements
        .filter(el => el.tags?.name)
        .map(normalizePlace)
        .slice(0, 40);
      if (places.length === 0) throw new Error("Empty results");
      console.log(`✓ Got ${places.length} restaurants`);
      return places;
    } catch (err) {
      console.warn(`✗ ${endpoint}: ${err.message}`);
      lastError = err;
      await new Promise(r => setTimeout(r, 500));
    }
  }

  throw new Error("Servers busy — please refresh in a moment.");
}

function normalizePlace(osm) {
  const t = osm.tags || {};
  return {
    id: osm.id,
    name: t.name || t["name:en"],
    city: "Kochi",
    neighborhood: t["addr:suburb"] || t["addr:neighbourhood"] || t["addr:quarter"] || "Kochi",
    cuisine: formatCuisine(t.cuisine || t.amenity),
    address: [t["addr:housenumber"], t["addr:street"], t["addr:suburb"]].filter(Boolean).join(", ") || null,
    lat: osm.lat, lon: osm.lon,
    phone: t.phone || t["contact:phone"] || null,
    website: t.website || t["contact:website"] || null,
    openingHours: t.opening_hours || null,
    hypeScore:    +(seededRandom(osm.id, 1) * 4 + 6).toFixed(1),
    realityScore: +(seededRandom(osm.id, 2) * 5 + 5).toFixed(1),
    reviews:       Math.floor(seededRandom(osm.id, 3) * 200) + 5,
    reviews_list: [],
  };
}

function formatCuisine(raw) {
  if (!raw) return "Restaurant";
  return raw.split(";")[0].replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

function seededRandom(id, salt) {
  const x = Math.sin(id * 9301 + salt * 49297 + 233) * 100003;
  return x - Math.floor(x);
}

// Call this from a dev console to force a fresh fetch: clearRestaurantCache()
export function clearRestaurantCache() {
  memoryCache = null;
  sessionStorage.removeItem(CACHE_KEY);
  console.log("Cache cleared — next load will re-fetch from API");
}