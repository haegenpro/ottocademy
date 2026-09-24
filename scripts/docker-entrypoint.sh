#!/bin/sh
# Production container entrypoint: bring the database schema up to date
# with a safe, non-destructive strategy (`prisma migrate deploy` never
# generates new migrations, only applies ones already committed to the
# repo), then start the given command (or the compiled app by default).
# `docker-compose.yml`'s `app`/`db-migrate` services pass their own
# command, which is honored via "$@" below.
set -e

echo "Applying database migrations (prisma migrate deploy)..."
npx prisma migrate deploy

if [ "$#" -gt 0 ]; then
  echo "Starting: $@"
  exec "$@"
else
  echo "Starting application..."
  exec node dist/main
fi
