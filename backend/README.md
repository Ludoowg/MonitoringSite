# MonitoringSite Backend (V1 POC)

Backend REST API for MonitoringSite, a lightweight SaaS-style monitoring app for URLs/APIs.

## Stack

- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- Jest + Supertest
- dotenv
- cors
- helmet
- morgan
- axios
- zod

## Installation

```bash
cd backend
npm install
```

## Environment Configuration

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Required variables:

- `PORT=5000`
- `NODE_ENV=development`
- `DATABASE_URL=postgresql://postgres:postgres@localhost:5432/uptimeguard?schema=public`
- `HTTP_CHECK_TIMEOUT_MS=5000`
- `SLOW_THRESHOLD_MS=2000`

## Prisma Commands

```bash
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run prisma:studio
```

## Run the Server

Development:

```bash
npm run dev
```

Production-like:

```bash
npm start
```

## Tests

```bash
npm test
npm run test:watch
npm run test:coverage
```

Note: integration tests that hit a real DB may require a dedicated test database. Current tests are lightweight and mock Prisma for local simplicity.

## Main Endpoints

- `GET /api/health`
- `POST /api/monitors`
- `GET /api/monitors`
- `GET /api/monitors/:id`
- `PATCH /api/monitors/:id`
- `DELETE /api/monitors/:id`
- `POST /api/monitors/:id/check`
- `GET /api/monitors/:id/checks`
- `GET /api/checks`

## cURL Examples

Create monitor:

```bash
curl -X POST http://localhost:5000/api/monitors \
  -H "Content-Type: application/json" \
  -d '{"name":"Google","url":"https://google.com"}'
```

Run manual check:

```bash
curl -X POST http://localhost:5000/api/monitors/<MONITOR_ID>/check
```
