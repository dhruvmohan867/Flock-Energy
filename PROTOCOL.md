# Protocol

## Investigation & Discovery

The legacy Urja Meter Ops portal was reverse-engineered to understand its internal APIs and authentication flow.

### Authentication

- **Method**: `POST /login`
- **Content-Type**: `application/x-www-form-urlencoded` (NOT JSON)
- **Body**: `email` and `password` as form-encoded fields
- **Response**: Returns a `set-cookie` header containing a session cookie
- **CSRF Protection**: The portal rejects cross-site POST requests. Requests must include `Origin` and `Referer` headers matching the portal URL.
- **Session Expiry**: When the cookie expires, subsequent API calls return `401 Unauthorized`.

### Session Cookie Flow

1. Backend sends `POST /login` with form-encoded credentials and proper Origin/Referer headers.
2. Portal validates credentials and returns a session cookie via `set-cookie` header.
3. The cookie is parsed (everything before the first `;`) and stored in-memory via `CookieManager`.
4. All subsequent requests to the portal inject this cookie via the `Cookie` header.
5. If a request receives a `401`, the Axios response interceptor triggers `authService.login()`, stores the new cookie, and retries the original request.

### Portal Endpoints Discovered

| Method | Endpoint | Returns |
|---|---|---|
| GET | `/portal/meters/search?page={page}&q={query}` | Paginated list of meters |
| GET | `/portal/meters/{meterId}/geo` | Latitude and longitude |
| GET | `/portal/meters/{meterId}/energy` | Historical energy readings |
| GET | `/portal/dts?page={page}` | Paginated list of transformers |

**Note**: `GET /portal/meters/{meterId}` was tested and returns `404` — the portal does NOT support fetching a single meter by ID.

## Architecture Decisions

- **Middleware Wrapper**: An Express backend acts as a proxy, abstracting the legacy infrastructure.
- **Centralized Session Management**: A singleton `CookieManager` stores a global session cookie acquired via service account credentials from `.env`.
- **Axios Interceptors**: Used to transparently handle cookie injection and automatic re-authentication upon `401` errors.
- **Thundering Herd Prevention**: A Promise lock (`loginPromise`) ensures concurrent `401` errors don't trigger multiple redundant login requests.
- **Startup Authentication**: The server authenticates with the portal during bootstrap before accepting client requests.

## Assumptions

- All backend requests are made on behalf of a single service account since user-level granular permissions were not specified.
- The portal's session cookie format is standard (key=value before the first semicolon).

## Trade-offs

- The session cookie is stored in-memory. For horizontal scaling across multiple Node.js instances, a distributed cache like Redis would be required.
- The backend trusts the portal's JSON response structure without schema validation. If the portal changes its response format, the backend will pass through the new format without transformation.
