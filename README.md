# Worth The Hype 🎯

## Basic Details

**Team Name:** BarelyRight  

**Team Members:**  
- **Aleena Johny** – (College)  
- **Aswathy K A** – (College)  

**Hosted Project Link:**  
https://worththehype001.vercel.app/

---

## Project Description

WorthTheHype is a city-based restaurant discovery platform that compares online hype with real user experiences. It helps users identify whether a restaurant is genuinely worth visiting or simply overhyped.

---

## The Problem Statement

Food discovery platforms often prioritize popularity and promotions, leading users to visit overhyped restaurants with poor real-world experiences. Fake reviews, bots, and promotional content further reduce trust in existing systems.

---

## The Solution

WorthTheHype introduces a credibility-first approach by separating hype from reality. It uses community-driven reviews, visible account credibility, and AI-assisted review analysis to surface honest dining experiences instead of promotional noise.

---

## Technical Details

### Technologies / Components Used

#### For Software:
- Languages: JavaScript  
- Frameworks: React, Vite  
- Libraries: React Router DOM  
- Tools: VS Code, Git, GitHub, Vercel  

#### For Hardware:
- Not applicable (Web-based project)

---

## Features

- Dual-score system: Hype Score vs Reality Score
- Delta-based verdict (Worth the Hype / Overhyped)
- City-based restaurant discovery (Kochi)
- AI-assisted review credibility tagging
- Reputation-aware user reviews
- Clean, responsive UI

---

## Implementation

### Installation
```bash
npm install
Project Documentation
Screenshots

Home Feed
Kochi dashboard displaying restaurants ranked by Hype vs Reality scores with search, filters, and trending highlights.

<img width="940" height="486" alt="Home Feed" src="https://github.com/user-attachments/assets/16291da3-3e07-4d84-86b6-430f70f85897" />

Restaurant Detail & Reviews
Restaurant detail page showing community reviews with reputation tiers, voting, AI confidence tags, and separate Hype/Reality ratings.

<img width="940" height="605" alt="Restaurant Detail" src="https://github.com/user-attachments/assets/00fd7bd8-329a-4c26-8611-57483e45c23e" />

Community Verdict
Final verdict section summarizing aggregated scores with delta classification and AI-weighted adjustment for review credibility.

<img width="940" height="454" alt="Community Verdict" src="https://github.com/user-attachments/assets/70f14dc7-01c5-412d-884a-cf507c32e749" />
Diagrams
System Architecture
<img width="631" height="787" alt="System Architecture Diagram" src="https://github.com/user-attachments/assets/131e796a-24f5-4993-944c-18a413846adc" />
Application Workflow

User opens the application

Selects city (Kochi)

Browses restaurant list (Hype vs Reality)

Searches / filters restaurants

Views restaurant details

Reads community reviews

AI evaluates review credibility

Community votes influence scores

User logs in (optional)

Submits review (Hype + Reality)

Scores update and verdict recalculates

Additional Documentation
API Documentation
Base URLs

Overpass API (Restaurant Data)

https://overpass.kumi.systems/api/interpreter

https://maps.mail.ru/osm/tools/overpass/api/interpreter

https://overpass-api.de/api/interpreter

Anthropic API (AI Review Analysis)

https://api.anthropic.com/v1/messages

Endpoints Used
Overpass API

Endpoint: POST /api/interpreter

Description: Fetches restaurant data within a predefined city bounding box (Kochi) using Overpass QL queries.

Request Parameter:

query (string) — Overpass QL query containing geographic bounding box and amenity filters.

Response:

Restaurant name

Latitude & longitude

Tags (cuisine, locality, amenity type)

Anthropic API

Endpoint: POST /v1/messages

Model Used: claude-sonnet-4-20250514

Description:

Generates a neutral community summary

Classifies review credibility (Likely Genuine / Low Confidence / Promotional)

Request Body Example

{
  "model": "claude-sonnet-4-20250514",
  "messages": [
    { "role": "user", "content": "Review text or aggregated reviews" }
  ]
}

Response (Simplified)

{
  "content": [
    {
      "text": "AI-generated summary or credibility label"
    }
  ]
}
