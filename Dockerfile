# build
FROM node:18-alpine as builder

RUN apk update && apk add --no-cache git

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN [ ! -e ".env" ] && cp .env.example .env || true

RUN npm run build
