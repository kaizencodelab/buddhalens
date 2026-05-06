# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BuddhaLens is a full-stack web application for exploring Buddhist lineage information. The frontend displays lineage data as a checkbox list using plain JavaScript, with user state persisted to Firebase/Firestore.

## Development Commands

### Frontend (`client/`)
```bash
npm install        # Install dependencies
npm run dev        # Dev server at http://localhost:5173
npm run build      # Production build → client/dist/
npm run preview    # Preview production build
```

### Backend (`server/`)
```bash
npm install        # Install dependencies
npm start          # Express server at http://localhost:8080
```

### Docker (full stack)
```bash
docker build -t buddhalens .        # Build image (2-stage: Vite build → Express serve)
docker run -p 8080:8080 buddhalens  # Run container
```

## Architecture

The app has a clear split: Vite bundles the frontend into `client/dist/`, and Express (`server/index.js`) serves those static files plus handles all routing (SPA catch-all to `index.html`).

**Key data flow:**
- `client/public/data/lineage.json` — static lineage data (`{nodes, links}`) rendered as a checkbox list on the dashboard; nodes have `id`, `name`, `dob`, `occupation`; links have `source`, `target`, `transmission`
- Firebase is used directly from the frontend for auth and user data (Firestore); config lives in `client/src/config/firebase.js`
- Firestore rules in `firestore.rules` restrict the `users` collection to authenticated users only

**Multi-page build:** `client/vite.config.js` defines five entry points — `index.html`, `login`, `dashboard`, `about`, and `support-us`. Each page has its own HTML in `client/src/pages/` and a corresponding JS file.

**Deployment target:** Google Cloud Run via Docker. The Dockerfile is a 2-stage build: stage 1 runs `vite build` in Node 18-alpine, stage 2 copies `dist/` into the Express server image.
