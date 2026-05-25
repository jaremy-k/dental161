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

Остановка: `docker compose down`

## Локальный запуск без Docker

```bash
npm install
npm run dev
```

## Бренд

- Акцентный цвет: `#00AEEF`
- Логотипы: `public/logo.svg`, `public/logo-white.png`

## Заявки

Форма отправляет POST на `/api/callback`. Если задать переменные окружения
`TELEGRAM_BOT_TOKEN` и `TELEGRAM_CHAT_ID`, заявки будут уходить в Telegram.
Без них заявка принимается приложением и выводится в серверный лог.

## Сборка

```bash
npm run build
npm start
```
