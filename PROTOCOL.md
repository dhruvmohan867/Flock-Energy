# Protocol

## Investigation & Discovery
The legacy electricity management portal was reverse-engineered to understand its internal APIs and authentication flow.
- **Authentication**: Uses `POST /login` which returns a stateful session cookie rather than a modern JWT. 
- **Session Cookie Flow**: The session cookie must be captured from the `set-cookie` header and injected into all subsequent requests. If a request returns a `401 Unauthorized`, the cookie has expired.
- **Portal Endpoints**:
  - `GET /portal/meters/search?page={page}&q={query}` (Pagination & Search)
  - `GET /portal/meters/{meterId}/geo` (Geospatial data)
  - `GET /portal/meters/{meterId}/energy` (Historical energy readings)
  - `GET /portal/dts?page={page}` (Distribution Transformers)

## Architecture Decisions
- **Middleware-based Wrapper**: To abstract the legacy infrastructure, an Express backend acts as a proxy.
- **Centralized Session Management**: Instead of requiring clients to log in and manage legacy cookies, a backend singleton (`CookieManager`) stores a global session cookie acquired via service account credentials (`.env`).
- **Axios Interceptors**: Used to transparently handle cookie injection and automatic re-authentication upon `401` errors, preventing the frontend from ever knowing a re-login occurred.
- **Thundering Herd Prevention**: A Promise lock (`loginPromise`) was implemented in `authService.js` to ensure concurrent `401` errors don't trigger multiple redundant login requests.

## Trade-offs & Assumptions
- **Assumption**: All backend requests are made on behalf of a single service account entity since user-level granular permissions were not specified.
- **Trade-off**: Storing the session cookie in-memory. While fine for a single instance, this would require a distributed cache (like Redis) if the backend scales horizontally to multiple Node.js instances.
