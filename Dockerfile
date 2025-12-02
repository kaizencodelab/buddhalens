# Stage 1: Build
FROM node:18-alpine AS build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ .
RUN npm run build

# Stage 2: Serve
FROM node:18-alpine AS runtime
WORKDIR /app
COPY --from=build /app/client/dist ./client/dist
COPY server/package*.json ./server/
RUN cd server && npm install --production
COPY server/ ./server/
EXPOSE 8080
CMD ["node", "server/index.js"]
