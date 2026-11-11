# Stage 1: Build the frontend
FROM node:22.23.4-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Serve the frontend
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80