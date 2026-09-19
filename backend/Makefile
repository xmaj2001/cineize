up:
	docker compose build --no-cache && docker compose up -d
down:
	docker compose down

logs:
	docker compose logs -f api

sh:
	docker compose exec api sh

migrate:
	docker compose exec api npx prisma migrate dev --create-only

# PROD: aplica migrações já existentes contra a BD real
migrate-deploy:
	docker compose exec api npx prisma migrate deploy

generate:
	docker compose exec api npx prisma generate

seed:
	docker compose exec api npx prisma db seed

reset:
	docker compose exec api npx prisma migrate reset

test:
	docker compose exec api npm run test

test-e2e:
	docker compose exec api npm run test:e2e


# =======================================
# VPS COMMANDS
# =======================================

vps:
	@$(MAKE) -C vps
	
# vps-up, vps-down, vps-logs, etc.
vps-%:
	@$(MAKE) -C vps $*