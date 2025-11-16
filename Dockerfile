FROM node:22-slim AS base
WORKDIR /app

# --- слой зависимостей (кэшируемый) ---
FROM node:22-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install

# --- слой сборки ---
FROM node:22-slim AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# --- финальный образ ---
FROM node:22-slim AS prod
WORKDIR /app
COPY --from=build /app ./

CMD ["npm", "run", "start"]