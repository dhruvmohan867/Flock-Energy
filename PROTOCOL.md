# Legacy Portal Investigation Protocol

## Goal

The objective of this investigation was to understand how the legacy **Urja Meter Ops** portal communicates with its backend so that a clean, documented REST API could be built on top of it.

The portal provides no public API documentation, so it was treated as a black box. The investigation focused on identifying the authentication flow, discovering the internal data endpoints, understanding how requests were authorized, and documenting any limitations or unusual behaviour observed during the process.

---

## Investigation Process

The investigation was performed manually using **Chrome Developer Tools**.

After logging into the portal, I used the **Network** tab with the **Fetch/XHR** filter enabled to observe the requests made by the application while navigating through different parts of the portal.

The following workflow was used:

1. Inspect the login request to understand how authentication works.
2. Open the Meter page and inspect the requests responsible for listing meters.
3. Search for specific meters to understand pagination and filtering behaviour.
4. Open an individual meter to identify geolocation and historical energy endpoints.
5. Open the Transformers page to discover infrastructure-related endpoints.
6. Compare browser request headers, payloads, cookies and responses.
7. Reproduce the discovered requests in Node.js until identical responses were obtained.

The **Headers**, **Preview**, and **Response** tabs inside Chrome DevTools were used throughout the investigation to understand request formats and response payloads.

---

## Authentication Flow

Authentication is based on a traditional server-side session rather than token-based authentication.

### Login Endpoint

```
POST /login
```

### Request Format

- Method: POST
- Content-Type: application/x-www-form-urlencoded
- Body:
  - email
  - password

Unlike the JSON APIs exposed by the portal, authentication only succeeds when credentials are submitted as form-encoded data.

### Required Headers

The login endpoint expects browser-style headers including:

- Origin
- Referer

Authentication requests without these headers were rejected, indicating that the portal validates the request origin before creating a session.

### Successful Login

A successful login returns:

- HTTP 200 OK
- A `Set-Cookie` response header containing the authenticated session.

---

## Session Management

The portal protects every data endpoint using the session cookie returned during login.

The authentication lifecycle observed during investigation was:

1. Authenticate using the login endpoint.
2. Receive a session cookie.
3. Store the session identifier.
4. Include the cookie in every subsequent request.
5. Continue using the same session until it expires.
6. Once expired, the portal responds with **401 Unauthorized**.
7. A fresh login is required before requests succeed again.

This confirms that the portal relies entirely on server-managed session authentication.

---

## Internal Endpoints Discovered

| Method | Endpoint | Purpose |
|----------|---------------------------------------------|--------------------------------|
| GET | `/portal/meters/search?page={page}&q={query}` | Search and list meters |
| GET | `/portal/meters/{meterId}/geo` | Retrieve meter coordinates |
| GET | `/portal/meters/{meterId}/energy` | Retrieve historical energy readings |
| GET | `/portal/dts?page={page}` | List distribution transformers |

---

## Data Available

### Meter Search

Returns paginated meter information including:

- Meter ID
- Serial Number
- Manufacturer
- Phase Type
- Installation Status
- Distribution Transformer Code

The endpoint supports:

- Pagination
- Free-text search
- Exact meter lookup using the `q` parameter

---

### Meter Geolocation

Returns:

- Latitude
- Longitude

---

### Historical Energy

Returns historical readings including values such as:

- Timestamp
- kWh
- kVAh
- Voltage

---

### Transformers

Returns infrastructure information including:

- Transformer Code
- Transformer Name
- Feeder Code
- Capacity (kVA)

---

## Key Findings

During the investigation several important observations were made.

### 1. No Public API

The portal exposes no documented API for external consumers.

---

### 2. Internal JSON APIs

The investigated sections of the portal retrieve their data through internal JSON endpoints rather than server-rendered HTML, eliminating the need for HTML scraping.

---

### 3. Session-Based Authentication

Authentication is maintained entirely through an HTTP session cookie rather than bearer tokens.

---

### 4. Form-Encoded Login

The login endpoint accepts only `application/x-www-form-urlencoded` requests.

Submitting JSON payloads was unsuccessful.

---

### 5. CSRF Requirements

Successful authentication required browser-style request headers, specifically `Origin` and `Referer`, matching the portal domain.

---

### 6. Pagination

Both the meter and transformer endpoints expose paginated responses containing fields such as:

- page
- pageSize
- total

This indicates that pagination is handled server-side.

---

### 7. Search Behaviour

The meter search endpoint supports searching through the `q` query parameter.

Providing an exact meter ID returns a single matching result, making it possible to implement meter lookup without requiring a dedicated endpoint.

---

### 8. Missing Meter Endpoint

A direct request to:

```
GET /portal/meters/{meterId}
```

consistently returned **404 Not Found**.

To retrieve a single meter, the search endpoint had to be reused with the exact meter identifier.

---

## Conclusion

The investigation showed that although the Urja Meter Ops portal does not expose a public API, it already communicates internally through well-structured JSON endpoints.

The primary challenge was understanding the authentication lifecycle rather than extracting data. By reproducing the browser's authentication flow, preserving the session cookie, and following the request patterns observed through Chrome DevTools, all required data could be accessed reliably.

The resulting REST API abstracts these implementation details behind a clean, stateless interface, allowing clients to consume the portal's data without needing to understand its authentication model or internal request structure.