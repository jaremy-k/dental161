# DentalCare (ДенталКеа) — сайт клиники

Маркетинговый лендинг на Next.js 16 для сети стоматологий [dentalcare161.ru](https://dentalcare161.ru).

## Docker (рекомендуется)

**Production** — сборка и запуск на порту 3000:

```bash
docker compose up --build
# или
npm run docker:up
```

**Разработка** — hot reload:

```bash
docker compose --profile dev up --build
# или
npm run docker:dev
```

Сайт: [http://localhost:3000](http://localhost:3000)

Админ-панель: [http://localhost:3000/admin](http://localhost:3000/admin)

Остановка: `docker compose down`

## Админ-панель и PostgreSQL

Docker Compose поднимает PostgreSQL и сохраняет заявки с формы в базу. Админ-панель доступна по адресу `/admin`.

Переменные окружения (можно задать в `.env` рядом с `docker-compose.yml`):

```bash
DATABASE_URL=postgres://dental:dental@postgres:5432/dental
JWT_SECRET=change-me-in-production
ADMIN_EMAIL=admin@dentalcare161.ru
ADMIN_PASSWORD=admin123
NEXT_SERVER_ACTIONS_ENCRYPTION_KEY=<openssl rand -base64 32>
```

`NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` нужен **и при сборке, и при запуске** Docker-образа — иначе возможна ошибка `Failed to find Server Action`.

При первом запуске создаётся администратор с указанными `ADMIN_EMAIL` и `ADMIN_PASSWORD`. Сессия хранится в httpOnly-cookie на 7 дней.

В админ-панели доступно управление контентом:

- **Заявки** — `/admin/leads`
- **Врачи** — добавление, редактирование, мягкое удаление и восстановление
- **Клиники** — добавление, редактирование, мягкое удаление и восстановление
- **Цены** — редактирование прайса с версионированием (черновики и публикация версий)

Данные хранятся в PostgreSQL. При первом запуске таблицы заполняются из текущих статических файлов проекта.

Для локальной разработки без Docker скопируйте `.env.example` в `.env.local` и запустите PostgreSQL отдельно или через `docker compose up postgres -d`.

## Локальный запуск без Docker

```bash
npm install
npm run dev
```

## Бренд

- Акцентный цвет: `#00AEEF`
- Логотипы: `public/logo.svg`, `public/logo-white.png`

## Заявки

Форма отправляет POST на `/api/callback`. Для отправки заявок в чат MAX
задайте переменные окружения:

```bash
MAX_BOT_TOKEN=token
MAX_CHAT_ID=chat_id
```

Опционально можно переопределить `MAX_API_BASE`, по умолчанию используется
`https://platform-api.max.ru`. Если MAX не настроен, обработчик попробует
отправить заявку в Telegram через `TELEGRAM_BOT_TOKEN` и `TELEGRAM_CHAT_ID`.
Если ни один канал не настроен, заявка принимается приложением, сохраняется в PostgreSQL (если настроен `DATABASE_URL`) и выводится в
серверный лог.

## Сборка

```bash
npm run build
npm start
```
