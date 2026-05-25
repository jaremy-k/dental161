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
- Логотипы: `public/logo.png`, `public/logo-white.png`

## Сборка

```bash
npm run build
npm start
```
