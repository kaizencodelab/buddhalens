# Buddhalens

## Architecture Overview

This is a full-stack application designed for Cloud Run deployment.

### Structure
- **`client/`**: The Frontend (Single Page Application).
    - Built with **Vite**.
    - Uses `firebase` and `d3`.
- **`server/`**: The Backend (Node.js/Express).
    - Serves the compiled frontend assets (`client/dist`) in production.
    - Handles API requests.

### The Role of Vite
Vite is used as the build tool for the frontend. It is essential for:
1.  **Dependency Management**: Allows using `npm install` for browser libraries (e.g., Firebase, D3) instead of CDNs.
2.  **Development**: Provides a local dev server (`npm run dev`) with Hot Module Replacement (HMR) for instant feedback.
3.  **Production**: Bundles, minifies, and optimizes the code into static assets (`dist/`) that the Express server delivers.

### Deployment Flow
1.  **Build**: Docker uses Vite to build the client (`npm run build`).
2.  **Assemble**: The static assets (`client/dist`) are copied to the server directory.
3.  **Run**: The Express server starts, serving both the API and the static frontend files.

### Docker Build and Run Instructions (for local development)

1. Run Docker Build checks first:
```bash
docker build --check -t buddhalens .
```

2. Then, build the image:

```bash
docker build -t buddhalens .
```

3. Run the container (map host 8080 to container 8080):
```bash
docker run -p 8080:8080 buddhalens
```