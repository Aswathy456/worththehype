WorthTheHype

WorthTheHype is a credibility-first, city-based restaurant discovery platform built for Kochi, Kerala.

Instead of showing what’s popular, it compares online hype with real user experience and surfaces the gap — called the Delta.

🔍 How It Works

Hype Score – online buzz

Reality Score – first-hand community reviews

Delta – difference between perception and reality

Positive delta → worth visiting
Negative delta → likely overhyped

🧠 AI (No-BS)

Evaluates review text for specificity and tone

Tags reviews as Likely Genuine or Low Confidence

Generates a neutral community summary per restaurant

AI never removes reviews — it only affects influence
**Worth The Hype 🎯**

**Basic Details**

**Team Name:** BarelyRight\
**Team Members:**

- **Aleena Johny** – (College)
- **Aswathy K A** – (College)

**Hosted Project Link:**\
<https://worththehype001.vercel.app/>

**Project Description**

WorthTheHype is a city-based restaurant discovery platform that compares online hype with real user experiences. It helps users identify whether a restaurant is genuinely worth visiting or simply overhyped.

**The Problem Statement**

Food discovery platforms often prioritize popularity and promotions, leading users to visit overhyped restaurants with poor real-world experiences. Fake reviews, bots, and promotional content further reduce trust in existing systems.

**The Solution**

WorthTheHype introduces a credibility-first approach by separating hype from reality. It uses community-driven reviews, visible account credibility, and AI-assisted review analysis to surface honest dining experiences instead of promotional noise.

**Technical Details**

**Technologies / Components Used**

**For Software:**

- **Languages used:** JavaScript
- **Frameworks used:** React, Vite
- **Libraries used:** React Router DOM
- **Tools used:** VS Code, Git, GitHub, Vercel

**For Hardware:**

- Not applicable (Web-based project)
-----
**Features**

- Dual-score system: **Hype Score vs Reality Score**
- Delta-based verdict (Worth the Hype / Overhyped)
- City-based restaurant discovery (Kochi)
- AI-assisted review credibility tagging
- Reputation-aware user reviews
- Clean, responsive UI

**Implementation**

**For Software:**

**Installation**

npm install

**Run**

npm run dev

**Project Documentation**

![Home Feed](screenshots/home.png)

Kochi dashboard displaying restaurants ranked by Hype vs Reality scores with search, filters, and trending highlights.

![Restaurant Detail](screenshots/restaurant.png)

Restaurant detail page showing community reviews with reputation tiers, voting, AI confidence tags, and separate Hype/Reality ratings.

![Community Verdict](screenshots/verdict.png)

Final verdict section summarizing aggregated scores with delta classification and AI-weighted adjustment for review credibility.



**Diagrams**

**System Architecture:**
![System Architecture](screenshots/architecture.png)




**Application Workflow:**

User opens application

`        `↓

Selects city (Kochi)

`        `↓

Browses restaurant list (Hype vs Reality)

'        `↓

Searches / filters restaurants

`        `↓

Views restaurant details

`        `↓

Reads community reviews

`        `↓

AI evaluates review credibility

`        `↓

Community votes influence scores

`        `↓

User logs in (optional)

`        `↓

Submits review (Hype + Reality)

`        `↓

Scores update and verdict recalculates

**Additional Documentation**

**For Web Projects with Backend:**

**API Documentation**

**Base URLs**

**Overpass API (Restaurant Data)**

- <https://overpass.kumi.systems/api/interpreter>
- <https://maps.mail.ru/osm/tools/overpass/api/interpreter>
- <https://overpass-api.de/api/interpreter>

**Anthropic API (AI Review Analysis)**

- <https://api.anthropic.com/v1/messages>

**Endpoints Used**

**1️⃣ Overpass API**

**Endpoint:**\
POST /api/interpreter

**Description:**\
Fetches restaurant data within a predefined city bounding box (Kochi) using Overpass QL queries.

**Request Parameter:**

- query (string) — Overpass QL query containing geographic bounding box and amenity filters.

**Response:**\
Returns structured JSON containing:

- Restaurant name
- Latitude & longitude
- Tags (cuisine, locality, amenity type)

**2️⃣ Anthropic API**

**Endpoint:**\
POST /v1/messages

**Model Used:**\
claude-sonnet-4-20250514

**Description:**\
Analyzes review text to:

- Generate a neutral community summary
- Classify review credibility (Likely Genuine / Low Confidence / Promotional)

**Request Body Example:**

{\
`  `"model": "claude-sonnet-4-20250514",\
`  `"messages": [\
`    `{ "role": "user", "content": "Review text or aggregated reviews" }\
`  `]\
}

**Response (Simplified):**

{\
`  `"content": [\
`    `{\
`      `"text": "AI-generated summary or credibility label"\
`    `}\
`  `]\
}
