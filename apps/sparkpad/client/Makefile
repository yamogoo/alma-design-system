CLIENT_COMPOSE = docker-compose.yml

dev-sparkpad:
	docker compose -f $(CLIENT_COMPOSE) up --build

dev-sparkpad-detach:
	docker compose -f $(CLIENT_COMPOSE) up --build -d

stop-sparkpad:
	docker compose -f $(CLIENT_COMPOSE) down