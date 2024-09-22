# Realtime Chat Backend

## Описание

Это бэкенд для чата с поддержкой авторизации и реалтайм обновлений, разработанный на основе следующего стека:

- **Hasura** — для обработки GraphQL-запросов (queries)
- **Apollo Server** — для мутаций и GraphQL подписок (subscriptions)
- **PostgreSQL** — с использованием pub/sub и триггеров для реализации реалтайм-событий
- **Docker Compose** — для контейнеризации всего приложения

### Проект построен без использования ORM

## Структура проекта

```bash
app-node
  ├── database
  ├── docker
  │   └── Dockerfile
  ├── node_modules
  ├── postgres-data
  ├── src
  │   ├── db.js (.sql for database)
  │   └── index.js (server up)
  │   └── resolvers.js (solution)
  │   └── schema.js (graphql schema)
  │   └── subscriptions.js (subscriptions)
  ├── docker-compose.yml
  ├── package.json
  ├── package-lock.json
