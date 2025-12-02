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
# Cloud run expects the application to listen on port 8080
# and run Nginx in the foreground
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
