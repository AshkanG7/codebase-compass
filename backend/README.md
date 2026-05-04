# Codebase Compass Backend

Backend foundation for Codebase Compass.

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

## Auth Configuration

The backend uses bcrypt password hashing and short-lived JWT access tokens stored in an httpOnly cookie named `access_token`.

Required auth environment variables:

- `JWT_SECRET`: local development secret. Use a long random value and do not commit real secrets.
- `JWT_ALGORITHM`: defaults to `HS256`.
- `ACCESS_TOKEN_EXPIRE_MINUTES`: defaults to `15`.

The `.env` file is ignored by git. Keep real secrets only in `.env` or your deployment secret manager.

## Manual Auth Testing

Run these commands from PowerShell after starting the API.

Signup and save the auth cookie:

```powershell
curl.exe -i -c .\cookies.txt -H "Content-Type: application/json" -d "{\"email\":\"test@example.com\",\"password\":\"ChangeMe123!\",\"display_name\":\"Test User\"}" http://127.0.0.1:8000/auth/signup
```

Login and refresh the auth cookie:

```powershell
curl.exe -i -c .\cookies.txt -H "Content-Type: application/json" -d "{\"email\":\"test@example.com\",\"password\":\"ChangeMe123!\"}" http://127.0.0.1:8000/auth/login
```

Fetch the current user with the cookie:

```powershell
curl.exe -i -b .\cookies.txt http://127.0.0.1:8000/auth/me
```

Protected projects route without auth should fail with `401`:

```powershell
curl.exe -i http://127.0.0.1:8000/projects
```

Protected projects route with auth should reach the placeholder route and return `501`:

```powershell
curl.exe -i -b .\cookies.txt http://127.0.0.1:8000/projects
```

Logout clears the auth cookie:

```powershell
curl.exe -i -b .\cookies.txt -c .\cookies.txt -X POST http://127.0.0.1:8000/auth/logout
```

## Implemented Scope

- FastAPI application startup
- CORS configured from `FRONTEND_URL`
- Environment variable loading from `.env`
- SQLAlchemy database base, engine, and session setup
- Initial `User`, `Project`, `CodeFile`, `Analysis`, and `Question` models
- Initial Pydantic schemas
- `GET /health`
- Secure signup, login, current-user, and logout auth routes
- Placeholder project, analysis, and question routes

## Security And Performance Foundations

Uploaded code is treated as untrusted plain text only. The backend must not execute uploaded files.

Limits:

- Max files per project: 50
- Max individual file size: 100 KB
- Max total project size: 1 MB

The backend also includes allowed extension constants, path normalization helpers, a placeholder secret scanner, a placeholder file safety utility, database indexes for common user/project lookups, and safe generic error responses.
