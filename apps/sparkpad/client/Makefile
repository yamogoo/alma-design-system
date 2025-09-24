CLIENT_COMPOSE = compose.dev.yml

dev-client:
	docker compose -f $(CLIENT_COMPOSE) up --build

dev-client-detach:
	docker compose -f $(CLIENT_COMPOSE) up --build -d

stop-client:
	docker compose -f $(CLIENT_COMPOSE) down