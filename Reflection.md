# Reflection

## Challenges Faced
The primary challenge was handling the stateful, cookie-based authentication of the legacy system within a modern, stateless REST API architecture. Legacy systems often lack proper documentation and error handling, making reverse-engineering necessary.

## Architectural Choices
The choice to abstract the legacy session entirely away from the client was deliberate. By managing the cookie internally via `CookieManager` and automatically handling `401 Unauthorized` responses via Axios interceptors, the frontend is provided with a completely stateless, clean REST experience.

## Improvements for Production
If this were deployed to a highly available production environment:
1. **Distributed Caching**: The in-memory `CookieManager` would be replaced with Redis. This is crucial for horizontal scaling across multiple instances, ensuring all instances share the same legacy portal session.
2. **Circuit Breakers**: Wrapping the `apiClient` in a circuit breaker (e.g., `opossum`) to prevent cascading failures if the legacy portal goes down.
3. **Structured Logging**: Replacing `console.log` with a structured logger like `Winston` or `Pino` to integrate with Datadog or ELK.

## Lessons Learned
- **Interceptor Power**: Axios interceptors are incredibly powerful for abstracting complex retry and authentication logic away from business services.
- **Race Conditions**: When dealing with automatic token refreshes, one must always anticipate concurrent failures. The Promise lock pattern prevents the "thundering herd" problem effectively.
