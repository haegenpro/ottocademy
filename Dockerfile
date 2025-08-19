FROM node:18-alpine AS base

WORKDIR /usr/src/app

FROM base AS dependencies
COPY package*.json ./
RUN npm ci
COPY prisma ./prisma/

FROM dependencies AS build
COPY . .
RUN npx prisma generate
RUN npx tsc --build --force

FROM base AS production
COPY package*.json ./

# Install only production dependencies
RUN npm install --omit=dev
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/src/frontend ./frontend
COPY --from=build /usr/src/app/prisma ./prisma
COPY --from=build /usr/src/app/node_modules/.prisma/client ./node_modules/.prisma/client

EXPOSE 3000
CMD ["node", "dist/main"]