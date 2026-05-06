# RepoRadar

**A full-stack app for getting a quick overview of an unfamiliar codebase.**

RepoRadar helps developers understand unfamiliar codebases without executing uploaded code. Users create projects, upload or paste source files, run AI-generated analysis, and ask follow-up questions about their own project files.

## Screenshots

| Landing | Dashboard |
| --- | --- |
| ![Landing page](docs/screenshots/landing.png) | ![Dashboard](docs/screenshots/Dashboard.png) |

| New Project | Project Analysis | Questions |
| --- | --- | --- |
| ![New project](docs/screenshots/new-project.png) | ![Project analysis](docs/screenshots/project-analysis.png) | ![Questions](docs/screenshots/questions.png) |

## Features

- Signup/login with httpOnly cookie auth
- Create projects with per-user ownership
- Upload or paste source files
- File size/type validation
- Secret redaction before storage and AI analysis
- AI-generated codebase analysis
- Analysis sections for architecture, stack, important files, data flow, risks, and next steps
- Follow-up Q&A grounded in uploaded files and saved analysis
- Protected frontend routes and backend ownership checks

## Tech Stack

- **Frontend:** Next.js App Router, React, TypeScript, Tailwind CSS
- **Backend:** FastAPI, SQLAlchemy, Pydantic
- **Database:** PostgreSQL locally, SQLite-compatible SQLAlchemy setup
- **AI:** OpenAI API with structured JSON responses
- **Auth:** JWT stored in httpOnly cookies

## Security Highlights

- Uploaded code is never executed
- Uploaded files are treated as untrusted plain text
- Secrets are redacted before AI analysis
- JWT is stored in an httpOnly cookie, not localStorage
- Users can only access their own projects
- `.env` files are ignored by Git
- Local development uses consistent `localhost` origins to avoid cookie issues

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

## Environment Variables

Backend `.env`:

```env
FRONTEND_URL=http://localhost:3000
DATABASE_URL=postgresql+psycopg2://postgres:postgres@localhost:5432/codebase_compass
JWT_SECRET=change-me
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=15
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4.1-mini
OPENAI_TIMEOUT_SECONDS=30
```

Frontend `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Full App Test Flow

1. Visit `http://localhost:3000/signup`.
2. Create an account and open the dashboard.
3. Create a project at `/projects/new`.
4. Add source files by upload or paste.
5. Run `Analyze Codebase` from the project detail page.
6. Review stack, architecture, important files, data flow, risks, and next steps.
7. Open `Ask questions` and submit a follow-up question.
8. Confirm the saved Q&A history appears.
9. Logout and verify protected routes redirect to login.

## Future Improvements

- Background analysis jobs and progress updates
- Alembic migrations and broader automated test coverage
- Team sharing and project collaboration
- Repository import from GitHub
- Analysis version history and exportable reports
- Streaming AI responses for long analyses and Q&A

## Resume Bullet

Built **RepoRadar**, a full-stack app with Next.js, FastAPI, PostgreSQL, OpenAI analysis, httpOnly cookie authentication, per-user project authorization, file validation, secret redaction, and follow-up questions over uploaded codebases.
