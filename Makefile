CLIENT_COMPOSE = apps/sparkpad/client/compose.dev.yml

dev-client:
	docker compose -f $(CLIENT_COMPOSE) up --build

dev-client-detach:
	docker compose -f $(CLIENT_COMPOSE) up --build -d

stop-client:
	docker compose -f $(CLIENT_COMPOSE) down