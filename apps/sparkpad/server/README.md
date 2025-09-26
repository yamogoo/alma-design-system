# Sparkpad Server (MDX groups & files)

Express + Sequelize (SQLite) + JWT auth. Designed for a Vue/Quasar MDX editor client.

## Quick start

```bash
pnpm i
cp .env.example .env
pnpm dev
```

## REST API

### Auth

- `POST /api/auth/register` { email, password, name? }
- `POST /api/auth/login` { email, password }
- `POST /api/auth/logout`

### Groups (auth required)

- `GET /api/groups` → list
- `POST /api/groups` { name, parentId? }
- `PATCH /api/groups/:id` { name?, parentId?, sortIndex? }
- `DELETE /api/groups/:id`

### Files (auth required)

- `GET /api/files?groupId=&q=&page=&pageSize=&archived=true|false`
- `GET /api/files/:id`
- `POST /api/files` { title, groupId?, content?, meta? }
- `PATCH /api/files/:id` { title?, content?, meta?, groupId?, sortIndex?, isArchived? }
- `POST /api/files/:id/move` { toGroupId }
- `DELETE /api/files/:id`

Notes:

- MDX content is plain text in `content`.
- `meta` is a free-form JSON field for frontmatter-like data.
