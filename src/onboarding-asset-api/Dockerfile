FROM node:22.23.4-alpine

WORKDIR /app

# build tools for better-sqlite3 if needed
RUN apk add --no-cache python3 make g++

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]