FROM node:22.23.4-alpine

WORKDIR /app

# Native build tools for better-sqlite3 if needed
RUN apk add --no-cache python3 make g++

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]