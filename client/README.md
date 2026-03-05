# BuddhaLens FRONTEND

## Prerequisites

- Node.js (>= 18 recommended) and npm/yarn installed. You can check with:

```bash
node -v
npm -v
```

## Quick start — install dependencies

From the client directory run:

```bash
npm install
```

## Development server (hot-reload)

Start the dev server with Vite:

```bash
npm run dev
```

Once started, open your browser to the URL shown in the terminal (usually http://localhost:5173).

## Build for production

To create an optimized production build, run:

```bash
npm run build
```

Files will be generated into the `dist/` folder.

## Preview a production build locally

After building, you can preview the production build with Vite's preview server:

```bash
npm run preview
```

This serves `dist/` locally (default port may vary; the console will show the preview URL).

## Notes / project specifics

- This project uses Vite and the following high-level scripts (see `package.json`): `dev`, `build`, `preview`.
- Firebase configuration is at `src/config/firebase.js` — update credentials there if you need to connect to your Firebase project.
- Static/public assets are in the `public/` folder (for example `public/data/lineage.json`).
- There's an `nginx/default.conf` in the repo as an example if you want to serve the `dist/` assets with Nginx or in a container.

## Troubleshooting

- If the dev server port is already in use, Vite will prompt to switch ports — follow the terminal instructions.
- If build or preview fails, check the terminal error messages and ensure your Node.js/npm versions are up-to-date.

---
