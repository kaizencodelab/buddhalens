# Stage 1: Build
FROM node:18-alpine AS build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ .
RUN npm run build

# Stage 2: Serve
FROM nginx:alpine
WORKDIR /app
COPY --from=build /app/client/dist /usr/share/nginx/html
EXPOSE 80
# Command to run Nginx in the foreground
# This is crucial for Cloud Run, as it expects the main process to stay alive.
CMD ["nginx", "-g", "daemon off;"]
