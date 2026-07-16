# Reflection

## Challenges Faced

### CSRF Protection
The most unexpected challenge was the legacy portal's CSRF protection. The `POST /login` endpoint returned `403 Forbidden` with "Cross-site POST form submissions are forbidden" when called without proper `Origin` and `Referer` headers. This was only discoverable by actually executing requests against the real portal — static code review alone would have missed it entirely.

### Form-Encoded vs JSON
The portal expects `application/x-www-form-urlencoded` for login, not `application/json`. Sending JSON resulted in authentication failures. This required using `URLSearchParams` to properly encode the credentials and setting the correct `Content-Type` header.

### Non-Existent Endpoint
The initial implementation included a `GET /portal/meters/{meterId}` endpoint for fetching a single meter by ID. Live testing revealed this endpoint does not exist on the portal (returns 404). This dead route, service method, and controller function had to be removed.

## Architecture Decisions

### Why Axios Interceptors
Interceptors cleanly separate authentication concerns from business logic. Services call `apiClient.get()` without knowing anything about cookies or re-authentication. The interceptor handles everything transparently.

### Why In-Memory Cookie Storage
For a single-instance deployment, an in-memory singleton is the simplest, fastest, and most correct solution. It avoids unnecessary complexity from external stores.

### Why Startup Authentication
The server authenticates during bootstrap (`server.js`) rather than lazily on the first request. This ensures the first client request doesn't pay the penalty of a 401-then-retry round trip.

## What Could Be Improved

1. **Redis for Horizontal Scaling**: Replace `CookieManager` with a Redis-backed store if the backend needs to run across multiple instances.
2. **Circuit Breaker**: Wrap the Axios client in a circuit breaker to prevent cascading failures if the legacy portal goes down.
3. **Structured Logging**: Replace `console.log` with a structured logger like Pino for production observability.
4. **Rate Limiting**: Add rate limiting to prevent clients from overwhelming the legacy portal.
5. **Response Caching**: Cache frequently accessed data (like transformer lists) to reduce load on the portal.

## Lessons Learned

- Always test against the real system. Static code review missed both the CSRF issue and the non-existent endpoint.
- Legacy systems have undocumented behaviors that only surface during runtime.
- The Promise lock pattern is essential when multiple concurrent failures can trigger the same recovery action.
