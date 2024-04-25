FROM node:lts-alpine AS base

# Adde dependencies
FROM base as deps
WORKDIR /app

COPY package.json package-lock.json ./
RUN ci --ignore-scripts

# Rebuild source as needed
FROM base as builder 

WORKDIR /app 
COPY --from=deps /app/node_modeules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build 

FROM node:lts-slim AS runner 

ENV NODE_ENV production

RUN addgroup --system -gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Set perms for prerender
RUN mkdir .next 
RUN chown nextjs:nodejs .next 

USER nextjs

EXPOSE 3000 

ENV PORT 3000

ENV HOSTNAME "0.0.0.0"
HEALTHCHECK CMD curl --fail http://localhost:3000 || exit 1

CMD ["node" ,"server.js"]



