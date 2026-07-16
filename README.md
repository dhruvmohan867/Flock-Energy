# Flock Energy Backend API

## Overview
A clean REST API wrapper built over the legacy Urja Meter Ops portal. This backend acts as an intermediary layer between client applications and the legacy electricity management portal, managing stateful session cookies automatically and exposing a stateless RESTful interface.

## What I Built
I built a Node.js/Express application that abstracts the underlying legacy system. It exposes structured JSON APIs for searching meters, retrieving geospatial and historical energy data, and listing transformers, without requiring the end client to handle legacy authentication or cookie management.

## Short Investigation Summary
I investigated the legacy Urja Meter Ops portal using browser developer tools to understand its authentication flow and discover internal JSON endpoints. The complete details of this investigation, including exact endpoints and security mechanisms, are documented in [PROTOCOL.md](./PROTOCOL.md).

## Architecture
```text
Client
  ↓ (Stateless REST)
Express Backend (Flock Energy API)
  ↓ (Stateful Session Cookie)
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
- Express.js
- Axios
- Swagger UI
- ES Modules

## Features
- Legacy portal authentication
- Automatic session cookie management
- Automatic re-authentication
- Meter search
- Meter lookup by ID
- Meter geo endpoint
- Meter energy endpoint
- Transformer listing
- Swagger documentation
- Global error handling

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
- The backend operates as a single instance (which allows in-memory session storage).
- The portal's response format is relatively stable. The API acts as a passthrough for the JSON payload and trusts its structure.

## Design Trade-offs
- **In-Memory Session Storage:** Using an in-memory `CookieManager` is simple and fast but prevents horizontal scaling across multiple Node.js instances without introducing a sticky session or distributed cache.
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
The API was manually verified for the following scenarios:
- Meter search and pagination
- Meter lookup by ID (simulated via search filtering)
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

## PROTOCOL.md
[PROTOCOL.md](./PROTOCOL.md) contains the detailed findings from investigating the legacy Urja Meter Ops portal, detailing the authentication flow and exact endpoints discovered.

## openapi.json / Swagger
The Swagger configuration is defined in [src/config/swagger.js](./src/config/swagger.js) and served at `/api-docs`. It defines all paths, parameters, and response schemas.

## Reflection

A detailed reflection covering the challenges encountered, assumptions made, lessons learned, and self-review during the assignment is available in [Reflection.md](./Reflection.md).

## License
ISC
