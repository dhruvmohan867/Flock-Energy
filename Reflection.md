# Reflection

## Initial Approach

When I first looked at the assignment, I assumed the portal would expose straightforward REST endpoints that could be wrapped directly. After spending some time exploring the application through Chrome DevTools, I realized the challenge was not writing the API itself, but understanding how the legacy portal actually worked behind the scenes.

---

## Biggest Challenges

The most difficult part was understanding the authentication flow.

Initially, I was able to identify the login endpoint, but every login attempt returned a `403 Forbidden` response. After comparing my requests with the browser requests in the Network tab, I discovered that the portal expected `Origin` and `Referer` headers in addition to form-encoded credentials. Once those matched the browser's behaviour, authentication worked successfully.

Another challenge was understanding how individual meter details were retrieved. I initially assumed there would be a dedicated endpoint for fetching a meter by its ID. During testing, I discovered that such an endpoint always returned `404 Not Found`. Instead, the portal reused the search endpoint, and providing an exact meter ID through the search parameter returned the required record.

---

## Assumptions

While working on the assignment, I made a few assumptions:

- The backend would operate using a single service account.
- The portal's response structure would remain consistent.
- A single backend instance was sufficient, making in-memory session storage an acceptable choice for this assignment.

---

## What I Learned

The biggest lesson from this assignment was the importance of investigating a system before implementing a solution.

Instead of relying on assumptions, I learned to inspect real network traffic, compare browser requests with my own implementation, and validate every behaviour through testing.

I also gained a much better understanding of session-based authentication, cookie management, and how browser applications communicate with backend services.

---

## If I Had More Time

If I had additional time, I would focus on improving the overall quality of the project rather than adding more endpoints.

Some improvements I would consider include:

- Adding automated integration tests.
- Replacing the in-memory session storage with a distributed solution for scalability.
- Adding structured logging for easier debugging.
- Implementing rate limiting to better protect the legacy portal.

---

## Self Review

Looking back at my own submission, I think the implementation successfully meets the assignment requirements and provides a clean abstraction over the legacy portal.

The main area I would improve is production readiness. While the current solution is appropriate for the assignment, features such as distributed session storage, automated testing, and enhanced monitoring would be important before deploying it in a production environment.

Overall, this assignment was a valuable exercise in investigating an undocumented system, understanding its behaviour through observation, and designing a clean API around it rather than simply writing code.