FROM node:20.12.0-alpine3.19 AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json yarn.lock .env ./
RUN yarn install --production=true

# Rebuild the source code only when needed
FROM node:20.12.0-alpine3.19 AS builder
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json yarn.lock .env ./
RUN yarn install
COPY . .
ENV NODE_ENV production
RUN yarn build
RUN yarn migration:run

# Production image, copy all the files and run next
FROM node:20.12.0-alpine3.19 AS runner
WORKDIR /app

ENV NODE_ENV production

RUN yarn global add pm2
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/.env ./.env

USER nestjs

EXPOSE 3000

ENV PORT 3000

CMD ["pm2-runtime", "-i", "max", "/app/dist/apps/main/main.js"]
