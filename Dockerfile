# Instalar dependencias solo cuando sea necesario
FROM node:20.15-alpine3.20 AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Construir la aplicación con dependencias en caché
FROM node:20.15-alpine3.20 AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn build

# Imagen de producción, copiar todos los archivos y ejecutar
FROM node:20.15-alpine3.20 AS runner
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn install --prod
COPY --from=builder /app/dist ./dist
CMD [ "node", "dist/main" ]
