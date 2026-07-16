# Flock Energy Backend API

A clean REST API wrapper built over the legacy Urja Meter Ops portal.

## Overview

This backend acts as an intermediary layer between client applications and the legacy electricity management portal. It manages stateful session cookies automatically and exposes a stateless RESTful interface.

## Architecture

```
Client → Express Backend → Legacy Portal → JSON Response → Client
```

The project follows Clean Architecture and Separation of Concerns:

- `routes/` — Maps HTTP endpoints to controllers
- `middlewares/` — Validates incoming requests
- `controllers/` — Extracts request data and formats responses
- `services/` — Contains business logic and external API calls
- `utils/` — Reusable singletons (Axios client, Cookie Manager)
- `config/` — Environment variables, Swagger configuration

## Tech Stack

- Node.js
- Express.js v5
- Axios
- Swagger UI Express
- ES Modules

## Setup

1. Clone the repository
2. Copy `.env.example` to `.env` and configure the credentials
3. Install dependencies:
   ```bash
   npm install
   ```

## Running

Development (with hot-reloading):
```bash
npm run dev
```

Production:
```bash
npm start
```

## Environment Variables

| Variable | Description |
|---|---|
| `PORT` | Server port (default: 3000) |
| `LEGACY_PORTAL_URL` | Base URL of the legacy portal |
| `LEGACY_EMAIL` | Service account email |
| `LEGACY_PASSWORD` | Service account password |

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/meters` | Search meters (supports `page`, `search` query params) |
| GET | `/api/v1/meters/:meterId/geo` | Get meter GPS coordinates |
| GET | `/api/v1/meters/:meterId/energy` | Get meter energy history |
| GET | `/api/v1/transformers` | List transformers (supports `page` query param) |

## API Documentation

Interactive Swagger documentation is available at:
```
http://localhost:3000/api-docs
```

## Design Decisions

- **Session Cookie Management**: The legacy portal uses stateful session cookies. The backend manages this transparently via a singleton `CookieManager` and Axios interceptors.
- **Automatic Re-authentication**: When a 401 is received, the Axios response interceptor automatically re-authenticates and retries the original request.
- **Thundering Herd Prevention**: A Promise lock ensures concurrent 401 failures trigger only one login request.
- **CSRF Compliance**: Login requests include `Origin` and `Referer` headers to satisfy the portal's CSRF protection.
- **Form-encoded Authentication**: The portal expects `application/x-www-form-urlencoded` for login, not JSON.

## Error Handling

All errors return a consistent JSON structure:
```json
{
  "error": {
    "message": "Error description",
    "status": 400
  }
}
```
