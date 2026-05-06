# RepoRadar Frontend

Next.js App Router frontend for RepoRadar.

## Setup

Install dependencies:

```powershell
npm install
```

Create a local environment file:

```powershell
Copy-Item .env.example .env.local
```

Run the frontend:

```powershell
npm run dev
```

The app runs at `http://localhost:3000` and expects the backend at `http://localhost:8000`.

## Environment

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Auth uses the backend httpOnly cookie. The frontend uses `fetch` with `credentials: "include"` and does not store JWTs in localStorage.

Use the same local hostname consistently. Mixing `localhost` and `127.0.0.1` can make the browser treat the frontend and backend as different cookie sites, which may prevent httpOnly auth cookies from being sent during local development.

## Full App Flow

1. Start the backend from `backend/` with `uvicorn app.main:app --reload`.
2. Start the frontend from `frontend/` with `npm run dev`.
3. Visit `http://localhost:3000/signup` and create an account.
4. Open `/projects/new`, create a project, and paste or import code files.
5. Open the project detail page and select `Analyze Codebase`.
6. Open `Ask questions` from the project detail page.
7. Ask a follow-up question and review the saved Q&A history.

Uploaded code and AI responses are displayed as plain text. The frontend does not use `dangerouslySetInnerHTML`.
