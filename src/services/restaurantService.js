// restaurantService.js
// Supports Kochi, Trivandrum, and Kozhikode
// Each city has its own bounding box and its own cache key

const ENDPOINTS = [
  "https://overpass.kumi.systems/api/interpreter",
  "https://maps.mail.ru/osm/tools/overpass/api/interpreter",
  "https://overpass-api.de/api/interpreter",
];

export const CITIES = {
  Kochi: {
    label: "Kochi",
    bbox: "9.94,76.27,10.02,76.32",
    cacheKey: "wth_restaurants_kochi",
  },
  Trivandrum: {
    label: "Trivandrum",
    bbox: "8.46,76.91,8.56,77.01",
    cacheKey: "wth_restaurants_trivandrum",
  },
  Kozhikode: {
    label: "Kozhikode",
    bbox: "11.22,75.76,11.30,75.84",
    cacheKey: "wth_restaurants_kozhikode",
  },
};

// In-memory cache per city
const memoryCache = {};

function buildQuery(bbox) {
  return `[out:json][timeout:20];node["amenity"="restaurant"]["name"](${bbox});out body qt;`;
}

export async function fetchRestaurantsByCity(cityName = "Kochi") {
  const city = CITIES[cityName];
  if (!city) throw new Error(`Unknown city: ${cityName}`);

  // 1. Memory cache
  if (memoryCache[cityName]) {
    console.log(`✓ ${cityName}: from memory`);
    return memoryCache[cityName];
  }

  // 2. sessionStorage cache
  try {
    const stored = sessionStorage.getItem(city.cacheKey);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed?.length > 0) {
        memoryCache[cityName] = parsed;
        console.log(`✓ ${cityName}: from sessionStorage`);
        return parsed;
      }
    }
  } catch (_) {}

  // 3. Fetch from API
  console.log(`Fetching ${cityName} from Overpass...`);
  const places = await fetchFromOverpass(buildQuery(city.bbox), cityName);

  memoryCache[cityName] = places;
  try { sessionStorage.setItem(city.cacheKey, JSON.stringify(places)); } catch (_) {}

  return places;
}

async function fetchFromOverpass(query, cityName) {
  let lastError;
  for (const endpoint of ENDPOINTS) {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `data=${encodeURIComponent(query)}`,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const places = data.elements
        .filter(el => el.tags?.name)
        .map(el => normalizePlace(el, cityName))
        .slice(0, 40);
      if (places.length === 0) throw new Error("Empty results");
      return places;
    } catch (err) {
      console.warn(`✗ ${endpoint}: ${err.message}`);
      lastError = err;
      await new Promise(r => setTimeout(r, 500));
    }
  }
  throw new Error("Servers busy — please refresh in a moment.");
}

function normalizePlace(osm, cityName) {
  const t = osm.tags || {};
  return {
    id: osm.id,
    name: t.name || t["name:en"],
    city: cityName,
    neighborhood: t["addr:suburb"] || t["addr:neighbourhood"] || t["addr:quarter"] || cityName,
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

export function clearCityCache(cityName) {
  delete memoryCache[cityName];
  try { sessionStorage.removeItem(CITIES[cityName]?.cacheKey); } catch (_) {}
  console.log(`Cache cleared for ${cityName}`);
}