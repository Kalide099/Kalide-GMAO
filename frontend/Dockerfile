# Stage 1: Build the Vite app
FROM node:20-alpine AS builder
WORKDIR /app
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/. .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
# Optional: custom Nginx config can be added if needed
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
