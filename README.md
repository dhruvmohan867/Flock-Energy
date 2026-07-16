# Flock Energy Backend API

A modern, clean REST API wrapper built over a legacy electricity management portal.

## Overview
This backend acts as an intermediary layer. It communicates with the legacy portal via internal APIs, manages stateful session cookies automatically, and exposes a stateless, clean RESTful interface to frontend clients.

## Tech Stack
- **Node.js** & **Express.js** (Server)
- **Axios** (HTTP Client)
- **Swagger UI** (API Documentation)
- **ES Modules** (Modern JavaScript)

## Architecture
The project strictly follows Clean Architecture and Separation of Concerns:
- `routes/`: Maps HTTP endpoints to controllers.
- `middlewares/`: Validates incoming requests.
- `controllers/`: Extracts request data and formats responses.
- `services/`: Contains business logic and external API orchestration.
- `utils/`: Reusable singletons like `apiClient` and `CookieManager`.

## Setup & Installation
1. Clone the repository.
2. Copy `.env.example` to `.env` and fill in the required credentials.
3. Install dependencies:
   ```bash
   npm install
   ```

## Running the Project
Start the development server with hot-reloading:
```bash
npm run dev
```
Start the production server:
```bash
npm start
```

## API Documentation
Once the server is running, interactive API documentation is available at:
`http://localhost:3000/api-docs`
