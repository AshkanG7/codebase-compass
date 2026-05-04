# Codebase Compass

Codebase Compass is a full-stack MVP for securely uploading source files, generating AI-assisted codebase analysis, and asking follow-up questions grounded in saved project files.

## Local Setup

Start the backend:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
uvicorn app.main:app --reload
```

Start the frontend in a second terminal:

```powershell
cd frontend
npm install
Copy-Item .env.example .env.local
npm run dev
```

Use these local origins consistently:

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000`

The frontend sends requests with `credentials: "include"` so the backend httpOnly auth cookie is included. Do not store JWTs in localStorage. Mixing `localhost` and `127.0.0.1` during local development can prevent cookies from being sent correctly.

## Test Flow

1. Visit `http://localhost:3000/signup`.
2. Create an account and open the dashboard.
3. Create a project at `/projects/new`.
4. Add source files.
5. Run `Analyze Codebase` from the project detail page.
6. Open `Ask questions` and submit a follow-up question.
