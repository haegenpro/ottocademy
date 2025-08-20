FROM node:18-alpine AS base
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
COPY package*.json ./

# Install only production dependencies
RUN npm install --omit=dev
COPY --from=build /usr/src/app/dist ./dist

# Copy frontend assets to /usr/src/app/public
COPY --from=build /usr/src/app/src/frontend ./public

# Copy Prisma files
COPY --from=build /usr/src/app/prisma ./prisma
COPY --from=build /usr/src/app/node_modules/.prisma/client ./node_modules/.prisma/client

# Copy scripts for seeding
COPY --from=build /usr/src/app/scripts ./scripts

EXPOSE 3000
CMD ["node", "dist/main"]