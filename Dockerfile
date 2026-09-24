FROM node:20-alpine AS base
WORKDIR /usr/src/app

FROM base AS dependencies
COPY package*.json ./
RUN npm ci
COPY prisma ./prisma/

FROM dependencies AS build
COPY . .
# Generate Prisma client
RUN npx prisma generate
# Build CSS from Tailwind
RUN npx tailwindcss -i ./src/frontend/css/globals.css -o ./src/frontend/css/styles.css --minify
# Compile TypeScript backend code
RUN npx tsc --build --force

FROM base AS production
ENV NODE_ENV=production
COPY package*.json ./

# Install only production dependencies, reproducibly from the lockfile.
# `prisma` (the CLI, needed for `prisma migrate deploy` at startup) is a
# regular dependency, so it is included here.
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=build /usr/src/app/dist ./dist

# Copy frontend assets to /usr/src/app/public
COPY --from=build /usr/src/app/src/frontend ./public

# Copy Prisma files (schema + migrations, required by `prisma migrate deploy`)
COPY --from=build /usr/src/app/prisma ./prisma
COPY --from=build /usr/src/app/node_modules/.prisma/client ./node_modules/.prisma/client

# Copy scripts for seeding/entrypoint
COPY --from=build /usr/src/app/scripts ./scripts
RUN chmod +x ./scripts/docker-entrypoint.sh

# Run as a non-root user. Uploaded files are written under ./uploads, so
# that directory (created here, since it isn't part of the repo) must be
# owned by the same user the process runs as.
RUN addgroup -S app && adduser -S app -G app \
  && mkdir -p uploads \
  && chown -R app:app /usr/src/app
USER app

EXPOSE 3000
ENTRYPOINT ["./scripts/docker-entrypoint.sh"]
