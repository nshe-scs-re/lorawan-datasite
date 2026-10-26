FROM node:22.23.4-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# this nginx stuff needs to be removed, it will be in the docker compose file
# will keep this here until the nginx config is done
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80