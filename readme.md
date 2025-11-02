# AI Decision Journal Backend

Node.js/TypeScript REST API that powers the AI Decision Journal. It lets users register, authenticate with JWT, record decisions, and triggers an AI-powered estimation workflow to analyse each decision.

## Features
- Express server with TypeScript
- JWT-based auth: short-lived access tokens and HTTP-only refresh cookies
- MongoDB storage via Mongoose models for users, decisions, tokens, and estimations
- Automatic estimation pipeline that calls an external AI provider and persists the results
- Centralised error handling with consistent JSON responses

## Tech Stack
- Node.js
- Express
- TypeScript
- MongoDB with Mongoose
- bcrypt for credential hashing
- jsonwebtoken for token issuance

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Create environment configuration**
   Copy `.env.example` to `.env` and fill in the values:

   | Variable | Required | Description |
   | --- | --- | --- |
   | `PORT` | No | HTTP port (defaults to `4000`) |
   | `DB_URL` | Yes | Mongo connection string, e.g. `mongodb://localhost:27017/ai-decision-journal` |
   | `JWT_ACCESS_SECRET` | Yes | Secret for signing access tokens |
   | `JWT_REFRESH_SECRET` | Yes | Secret for signing refresh tokens |
   | `AI_URL` | Yes | URL of the AI estimation service |
   | `AI_MODEL` | Yes | Model identifier passed to the AI service |
   | `AI_API_KEY` | Yes | Bearer token for the AI service |

## Development

```bash
npm run dev
```
The server starts on `http://localhost:4000` (unless `PORT` overrides it) and reloads on file changes.

## Build & Run

```bash
npm run build
```

```bash
npm start
```

## API

### Auth

#### Sign up
- **POST** `/auth/sign-up`
- **Body**
  ```json
  {
    "email": "user@example.com",
    "password": "string",
    "name": "Jane Doe"
  }
  ```
- **Response**
  ```json
  {
    "user": {
      "id": "6564f5d7e9...",
      "email": "user@example.com",
      "name": "Jane Doe"
    },
    "accessToken": "jwt",
    "refreshToken": "jwt"
  }
  ```
  A `refreshToken` cookie is also set.

#### Sign in
- **POST** `/auth/sign-in`
- **Body**
  ```json
  {
    "email": "user@example.com",
    "password": "string"
  }
  ```
- **Response** – same shape as **Sign up**

#### Sign out
- **POST** `/auth/sign-out`
- **Cookies** – `refreshToken` must be present
- **Response** – HTTP 200 with an empty body and the `refreshToken` cookie cleared

#### Refresh session
- **POST** `/auth/refresh`
- **Cookies** – `refreshToken` must be present
- **Response** – same shape as **Sign up**

### Decisions

#### Add decision
- **POST** `/decisions/add`
- **Headers**
  - `Authorization: Bearer <accessToken>`
- **Body**
  ```json
  {
    "description": "Describe the situation...",
    "decision": "What you decided",
    "decisionExplanation": "Optional context"
  }
  ```
- **Response**
  ```json
  {
    "id": "6564f8bb1c...",
    "userId": "6564f5d7e9...",
    "description": "Describe the situation...",
    "decision": "What you decided",
    "decisionExplanation": "Optional context",
    "estimationStatus": "inProgress"
  }
  ```
  After the decision is stored, the estimation service asynchronously calls the configured AI endpoint. Once the analysis completes, the result is saved in the `estimations` collection and the decision’s `estimationStatus` transitions to `done` (or `error` if the call fails).

## Data Model
- `users` – credentials (`email`, `password` hash, `name`)
- `decisions` – decisions authored by users; linked via `userId`
- `estimations` – AI analysis linked to a decision through `decisionId`
- `tokens` – refresh tokens tied to a user
