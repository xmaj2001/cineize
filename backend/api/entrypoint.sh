#!/bin/sh
set -e

echo "==> A correr migrações do Prisma..."
npx prisma migrate deploy

echo "==> Migrações feitas, arrancar a aplicação..."
exec "$@"
