# Patriot Hacks 2025 — Flora-AI

Lightweight plant monitoring web app + ESP32 integration used during Patriot Hacks 2025.

This repository contains three main areas:
- `Flora-AI/` — React + Vite frontend (UI, components, Firebase integration)
- `backend/` — Node.js backend used for API endpoints (includes `geminiAPI.js`)
- `esp32/` — Arduino/ESP32 code and libraries for sensor data collection

**Quick overview**
- Frontend shows plant cards, details, and an AI health score (visualized as a number + progress bar).
- The AI health UI is rendered by `Flora-AI/src/components/PlantInfoCard.jsx`.
- Mock/demo data is provided in `Flora-AI/src/pages/PlantDetail.jsx` (look for `mockPlant`).
- Real data is stored in Firebase (see `Flora-AI/src/firebase.js`).

## Repository Layout

- `Flora-AI/` — React app
  - `src/` — app source (components, pages, assets)
  - `src/components/PlantInfoCard.jsx` — AI health number + progress bar
  - `src/pages/PlantDetail.jsx` — demo `mockPlant` data
- `backend/` — Node backend
  - `server.mjs` — entry point
  - `geminiAPI.js` — server-side API integration
- `esp32/` — device code & libraries
  - `plant/plant.ino` — main ESP32 sketch
  - `plant/secrets.h` — Wi‑Fi / Firebase keys (local/device-only secrets)

## Prerequisites
- Node.js (16+ recommended) and `npm` or `pnpm`
- For frontend dev: `npm` in `Flora-AI/` (Vite)
- For backend: `npm` in `backend/`
- For device: Arduino IDE or PlatformIO with ESP32 support
- Firebase project (for real-time data storage)

## Setup & Run (Frontend)

Open a PowerShell terminal and run:

```powershell
cd "c:\CS Projects\patriot-hacks-2025\Flora-AI"
npm install
npm run dev
```

This starts the Vite dev server and you can open the app at the printed localhost URL.

Notes:
- Firebase config is in `Flora-AI/src/firebase.js`. For local development update the file with your project's credentials.
- If you only want to view a demo, `PlantDetail.jsx` contains `mockPlant` data (includes `aiHealthScore: 87`).

## Setup & Run (Backend)

Open a PowerShell terminal and run:

```powershell
cd "c:\CS Projects\patriot-hacks-2025\backend"
npm install
npm start
```

The backend exposes simple endpoints used by the frontend. Check `server.mjs` and `geminiAPI.js` for details.

## ESP32 / Device

- Open `esp32/plant/plant.ino` in your Arduino IDE or PlatformIO.
- Update `esp32/plant/secrets.h` with Wi‑Fi SSID, password, and Firebase credentials before flashing.
- The device publishes sensor readings to Firebase (Realtime Database / Firestore depending on the sketch). The frontend reads these documents to display live metrics.

## Where AI health is produced

- UI: `Flora-AI/src/components/PlantInfoCard.jsx` renders the numeric AI health and the progress bar width.
- Demo value: `Flora-AI/src/pages/PlantDetail.jsx` contains `mockPlant` (example `aiHealthScore: 87`).
- Real value source: plants documents in Firebase (`plants` collection). The frontend reads those fields and passes them into components.

If you want to trace the value end-to-end:
1. Check `esp32/` device code (if device writes `aiHealthScore`).
2. Check backend or cloud functions that may compute AI health.
3. Confirm Firestore/Realtime DB document fields used by the frontend.

## Development notes
- Components are in `Flora-AI/src/components/` (e.g., `PlantCard.jsx`, `PlantInfoCard.jsx`).
- Routes/pages in `Flora-AI/src/pages/`.
- To add a new plant for manual testing, modify `PlantDetail.jsx` mock or add a document in Firebase.

## Contributing
- Create issues or PRs on feature branches.
- Keep changes small and target a single feature or fix per PR.

## License
This repository does not include a license file. Add one if you plan to open-source the code.

---

If you'd like, I can:
- add a `CONTRIBUTING.md`,
- wire up a demo Firebase config example file, or
- update `PlantInfoCard.jsx` to display a tooltip explaining how the AI score is calculated.

Happy to make any additional README changes — tell me which parts to expand.

