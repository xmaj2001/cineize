# Define a versão do Node num único lugar
ARG NODE_IMAGE=node:22-alpine

# ---- deps: instala tudo pra poder buildar ----
FROM ${NODE_IMAGE} AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ---- build: gera o Prisma Client e compila o Nest ----
FROM ${NODE_IMAGE} AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# ---- prod-deps: só as dependências de produção ----
FROM ${NODE_IMAGE} AS prod-deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY prisma ./prisma
RUN npx prisma generate

# ---- runner: imagem final, leve ----
FROM ${NODE_IMAGE} AS runner
RUN apk add --no-cache tini
WORKDIR /app
ENV NODE_ENV=production

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY entrypoint.sh ./
RUN chmod +x entrypoint.sh && addgroup -S nest && adduser -S nest -G nest
USER nest

EXPOSE 3000
ENTRYPOINT ["/sbin/tini", "--", "./entrypoint.sh"]
CMD ["node", "dist/main.js"]