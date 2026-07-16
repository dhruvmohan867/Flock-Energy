# Flock Energy Backend API

## Overview

A clean REST API wrapper built over the legacy Urja Meter Ops portal. This backend acts as an intermediary layer between client applications and the legacy electricity management portal, managing stateful session cookies automatically and exposing a stateless RESTful interface.

## What I Built

I built a Node.js/Express application that abstracts the underlying legacy system. It exposes structured JSON APIs for searching meters, retrieving geospatial and historical energy data, and listing transformers, without requiring the end client to handle legacy authentication or cookie management.

## Investigation Summary

The legacy Urja Meter Ops portal has no public API documentation. By inspecting network requests via browser developer tools, I identified:
- The authentication mechanism relies on a `POST /login` endpoint expecting `application/x-www-form-urlencoded` credentials.
- The portal enforces CSRF protection, requiring `Origin` and `Referer` headers.
- Successful login yields a stateful session cookie via the `set-cookie` header.
- Internal JSON endpoints are available for meters and transformers, but they do not follow standard REST patterns (e.g., retrieving a single meter requires filtering the search endpoint because a direct ID lookup returns a 404).

## Architecture

```text
Client
  ↓ (Stateless REST)
Express Backend (Flock Energy API)
  ↓ (Stateful Session Cookie + CSRF bypass)
Legacy Portal (Urja Meter Ops)
  ↓ (JSON Response)
Express Backend
  ↓ (Formatted Response)
Client
```

## Project Structure

- `src/config/` - Environment configuration and Swagger setup.
- `src/controllers/` - Route handlers that extract request parameters and format responses.
- `src/middlewares/` - Request validation and global error handling.
- `src/routes/` - Express router definitions mapping HTTP methods to controllers.
- `src/services/` - Core business logic, external API orchestration, and legacy portal integration.
- `src/utils/` - Reusable singletons, including the Axios HTTP client and in-memory Cookie Manager.

## Technology Stack

- Node.js
- Express.js v5
- Axios
- Swagger UI Express
- ES Modules

## Features

- Authentication with legacy portal (CSRF bypass)
- Automatic session cookie management
- Axios client with interceptors for seamless requests
- Automatic re-login on expired session
- Meter search and lookup by exact ID
- Meter geolocation retrieval
- Historical energy readings retrieval
- Transformer listing
- Swagger/OpenAPI documentation
- Consistent global error handling and validation

## Installation

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```

## Environment Variables

Create a `.env` file in the root directory. See `.env.example` for reference.

| Variable | Description |
|---|---|
| `PORT` | Server port (default: 3000) |
| `LEGACY_PORTAL_URL` | Base URL of the legacy portal |
| `LEGACY_EMAIL` | Service account email |
| `LEGACY_PASSWORD` | Service account password |

## Running the Project

Start the development server with hot-reloading:
```bash
npm run dev
```

Start the production server:
```bash
npm start
```

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/meters` | Search meters (supports `page`, `search` query params) |
| GET | `/api/v1/meters/:meterId` | Get a single meter by ID |
| GET | `/api/v1/meters/:meterId/geo` | Get meter GPS coordinates |
| GET | `/api/v1/meters/:meterId/energy` | Get meter energy history |
| GET | `/api/v1/transformers` | List transformers (supports `page` query param) |

## Sample Request and Response

**Request:**
```bash
curl http://localhost:3000/api/v1/meters/J100001/geo
```

**Response:**
```json
{
  "data": {
    "latitude": "26.822136543835608",
    "longitude": "75.90718190602279"
  }
}
```

## Swagger Documentation

Interactive API documentation is served at:
```text
http://localhost:3000/api-docs
```

## Design Decisions

- **Stateless REST API over stateful portal:** Clients interact statelessly. The backend handles the stateful, legacy session cookie internally.
- **Session cookie management:** An in-memory singleton (`CookieManager`) stores the global session cookie.
- **Axios interceptors:** Used to abstract authentication. Interceptors automatically inject the session cookie into outgoing requests and catch `401 Unauthorized` responses to trigger a re-login transparently.
- **Automatic re-authentication & Promise lock:** When a cookie expires, the `authService` handles re-login. A promise lock (`loginPromise`) prevents the "thundering herd" problem, ensuring concurrent 401 failures only trigger a single authentication request to the portal.
- **Separation of concerns:** Strict adherence to a layered architecture (Routes → Controllers → Services → External APIs) keeps the codebase modular and testable.

## Assumptions

- The legacy portal relies on a single service account. Granular user-level permissions are not required for this API wrapper.
- The portal's response format is relatively stable. The API acts as a passthrough for the JSON payload and trusts its structure.
- The backend operates as a single instance (which allows in-memory session storage).

## Design Trade-offs

- **In-Memory Session Storage:** Using an in-memory `CookieManager` is simple and fast but prevents horizontal scaling across multiple Node.js instances without introducing a sticky session or distributed cache (like Redis).
- **Passthrough Validation:** To minimize latency and complexity, the backend does not enforce strict JSON schema validation on the portal's responses.

## Error Handling

All errors (including Axios network errors and validation failures) are caught and formatted into a consistent JSON structure by global error-handling middleware:
```json
{
  "error": {
    "message": "Error description",
    "status": 404
  }
}
```

## Testing

The API was manually verified using the Swagger UI and curl for the following scenarios:
- Meter search and pagination
- Meter lookup by exact ID (simulated via search filtering)
- Geo and Energy endpoints
- Transformer endpoint
- Invalid IDs (returns 404)
- Empty search results
- Handling expired sessions (verified automatic re-login)

## What I Intentionally Skipped

- **Redis:** Skipped distributed caching for the session cookie to keep the assignment scope focused.
- **Rate Limiting:** Omitted to simplify local testing, though essential for production to prevent overloading the legacy portal.
- **Unit Tests:** Relied on manual E2E verification to prioritize architectural completion within the time constraint.
- **Docker:** Did not containerize the application to keep setup minimal.

## Future Improvements

- Implement Redis for session cookie storage to support horizontal scaling.
- Add an API Gateway or rate limiter (e.g., `express-rate-limit`).
- Add comprehensive unit tests using Jest.
- Implement structured logging (e.g., Pino or Winston) instead of `console.log`.
- Add a circuit breaker (e.g., Opossum) to fail fast if the legacy portal goes down.

## PROTOCOL.md

[PROTOCOL.md](./PROTOCOL.md) contains the detailed findings from investigating the legacy Urja Meter Ops portal, detailing the authentication flow, exact endpoints discovered, and the CSRF bypass mechanism.

## openapi.json

The Swagger configuration is defined in [src/config/swagger.js](./src/config/swagger.js). This file serves as the single source of truth for the OpenAPI 3.0 specification, defining all paths, parameters, and response schemas.

## Reflection

- **What assumptions did I make?** I assumed that performance under heavy load was less critical for this assignment than establishing a robust, self-healing authentication architecture.
- **What was most difficult?** Bypassing the portal's undocumented CSRF protection. My initial `POST /login` requests were rejected with `403 Forbidden` until I added the exact `Origin` and `Referer` headers required.
- **How did I get unstuck?** By meticulously comparing my Node.js request headers with the successful browser requests in the Network tab, I identified the missing CSRF headers and the required `application/x-www-form-urlencoded` content type.
- **What mistake did I make?** I initially assumed the portal supported a direct `GET /portal/meters/{meterId}` endpoint. Live testing proved this returns a 404. I had to pivot and implement single-meter lookup by filtering the search endpoint.
- **What would I improve with another day?** I would add an automated test suite (Jest + Supertest) and mock the legacy portal responses to ensure regressions aren't introduced in the future.
- **If reviewing my own submission, what would I criticize?** The reliance on an in-memory variable for the session cookie limits scalability. While acceptable for the assignment, a senior engineer would flag this during a system design review for a production environment.

## License

ISC
