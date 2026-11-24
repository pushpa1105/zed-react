# ---- Build stage -------------------------------------------------------------
FROM node:24-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

COPY . .
# Build-time env vars (Vite inlines them into the bundle).
ARG VITE_APP_API_URL=/api
ARG VITE_APP_ENABLE_API_MOCKING=false
ENV VITE_APP_API_URL=$VITE_APP_API_URL \
    VITE_APP_ENABLE_API_MOCKING=$VITE_APP_ENABLE_API_MOCKING
RUN npm run build

# ---- Runtime stage: static files served by nginx -----------------------------
FROM nginx:1.29-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK CMD wget -qO- http://localhost/ >/dev/null || exit 1
CMD ["nginx", "-g", "daemon off;"]
