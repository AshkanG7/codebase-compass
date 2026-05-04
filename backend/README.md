# Codebase Compass Backend

Phase 1 backend foundation for Codebase Compass.

## Setup

Create and activate a virtual environment:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

Install dependencies:

```powershell
pip install -r requirements.txt
```

Create a local environment file:

```powershell
Copy-Item .env.example .env
```

Create the intended PostgreSQL database if it does not exist yet:

```powershell
createdb codebase_compass
```

Run the API:

```powershell
uvicorn app.main:app --reload
```

The API will be available at `http://127.0.0.1:8000`.

## Phase 1 Scope

- FastAPI application startup
- CORS configured from `FRONTEND_URL`
- Environment variable loading from `.env`
- SQLAlchemy database base, engine, and session setup
- Initial `User`, `Project`, `CodeFile`, `Analysis`, and `Question` models
- Initial Pydantic schemas
- `GET /health`
- Placeholder auth, project, analysis, and question routes

## Security And Performance Foundations

Uploaded code is treated as untrusted plain text only. The backend must not execute uploaded files.

Limits:

- Max files per project: 50
- Max individual file size: 100 KB
- Max total project size: 1 MB

The backend also includes allowed extension constants, path normalization helpers, a placeholder secret scanner, a placeholder file safety utility, database indexes for common user/project lookups, and safe generic error responses.
