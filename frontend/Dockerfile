# Multi-stage: Node for build, Nginx for serving
# 
# npm ci (not install) for reproducible, fast builds
# Production build strips dev dependencies, minifies, tree-shakes
# Nginx alpine ~20MB vs full nginx ~100MB
# Custom nginx.conf proxies /api/* to backend (avoids CORS issues)

FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx ng build --configuration production

FROM nginx:alpine
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
