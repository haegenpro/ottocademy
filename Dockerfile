FROM node:18-alpine AS base

WORKDIR /usr/src/app

FROM base AS dependencies
COPY package*.json ./
RUN npm ci
COPY prisma ./prisma/

FROM dependencies AS build
COPY . .
RUN npx prisma generate
# Force build with our custom TypeScript configuration
RUN npx tsc --build --force

FROM base AS production
COPY package*.json ./
# Install all dependencies including dev dependencies for seeding
RUN npm ci
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/prisma ./prisma
COPY --from=build /usr/src/app/node_modules/.prisma/client ./node_modules/.prisma/client
COPY --from=build /usr/src/app/uploads ./uploads

# Create uploads directory with proper permissions
RUN mkdir -p /usr/src/app/uploads/modules && chmod -R 755 /usr/src/app/uploads

EXPOSE 3000
CMD ["node", "dist/main"]