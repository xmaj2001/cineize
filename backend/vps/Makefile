COMPOSE := docker compose -f ../docker-compose.vps.yml

up:
	$(COMPOSE) up -d --build

down:
	$(COMPOSE) down

logs:
	$(COMPOSE) logs -f api

sh:
	$(COMPOSE) exec api sh

migrate:
	$(COMPOSE) exec api npx prisma migrate dev --create-only

migrate-deploy:
	$(COMPOSE) exec api npx prisma migrate deploy

generate:
	$(COMPOSE) exec api npx prisma generate

seed:
	$(COMPOSE) exec api npx prisma db seed

reset:
	$(COMPOSE) exec api npx prisma migrate reset

test:
	$(COMPOSE) exec api npm run test

test-e2e:
	$(COMPOSE) exec api npm run test:e2e