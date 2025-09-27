# форсим amd64, чтобы были готовые бинарники чаще
FROM --platform=linux/amd64 node:20-bookworm-slim

WORKDIR /repo

# тулчейн для native модулей
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 make g++ ca-certificates && \
    rm -rf /var/lib/apt/lists/*

# pnpm
RUN corepack enable && corepack prepare pnpm@9.12.3 --activate

# скопируем ONLY рабочие файлы для кеша и установки
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
# package.json самого сервера:
COPY apps/sparkpad/server/package.json apps/sparkpad/server/
# (если есть локальные пакеты, добавь их package.json аналогично)

# важно: скрипты включены, соберём sqlite3 при установке
ENV npm_config_build_from_source=true
RUN pnpm install --frozen-lockfile --ignore-scripts=false --filter ./apps/sparkpad/server...

# теперь копируем исходники всего монорепо
COPY . .

# на всякий — перестроим sqlite3
RUN pnpm --filter ./apps/sparkpad/server rebuild sqlite3 || true

WORKDIR /repo/apps/sparkpad/server
EXPOSE 5042
ENV NODE_ENV=development

CMD ["pnpm", "run", "dev", "--", "--host", "--port", "5042"]
