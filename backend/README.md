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

Protected projects route with auth should return the user's paginated projects:

```powershell
curl.exe -i -b .\cookies.txt http://127.0.0.1:8000/projects
```

Logout clears the auth cookie:

```powershell
curl.exe -i -b .\cookies.txt -c .\cookies.txt -X POST http://127.0.0.1:8000/auth/logout
```

## Manual Project And File Testing

If you ran an earlier phase against the same database, recreate the development database or add a migration before testing because Phase 3 adds the `code_files.language` column.

Create an account once if needed:

```powershell
$session = New-Object Microsoft.PowerShell.Commands.WebRequestSession
$signupBody = @{ email = "phase3@example.com"; password = "ChangeMe123!"; display_name = "Phase 3 User" } | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri "http://127.0.0.1:8000/auth/signup" -WebSession $session -ContentType "application/json" -Body $signupBody
```

Login:

```powershell
$session = New-Object Microsoft.PowerShell.Commands.WebRequestSession
$loginBody = @{ email = "phase3@example.com"; password = "ChangeMe123!" } | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri "http://127.0.0.1:8000/auth/login" -WebSession $session -ContentType "application/json" -Body $loginBody
```

Create a project:

```powershell
$projectBody = @{ name = "My React App"; description = "Optional description" } | ConvertTo-Json
$project = Invoke-RestMethod -Method Post -Uri "http://127.0.0.1:8000/projects" -WebSession $session -ContentType "application/json" -Body $projectBody
$projectId = $project.id
```

Get paginated projects:

```powershell
Invoke-RestMethod -Method Get -Uri "http://127.0.0.1:8000/projects?page=1&page_size=10" -WebSession $session
```

Add code files. Secrets are redacted before saving:

```powershell
$filesBody = @{
  files = @(
    @{
      path = "src/App.tsx"
      language = "TypeScript"
      content = "const token = 'not-a-secret';`nexport default function App() { return <main>Hello</main>; }"
    },
    @{
      path = "package.json"
      language = "JSON"
      content = "{ `"name`": `"my-react-app`", `"scripts`": { `"dev`": `"next dev`" } }"
    }
  )
} | ConvertTo-Json -Depth 5
Invoke-RestMethod -Method Post -Uri "http://127.0.0.1:8000/projects/$projectId/files" -WebSession $session -ContentType "application/json" -Body $filesBody
```

Get project files:

```powershell
Invoke-RestMethod -Method Get -Uri "http://127.0.0.1:8000/projects/$projectId/files" -WebSession $session
```

Get one project with files and latest analysis:

```powershell
Invoke-RestMethod -Method Get -Uri "http://127.0.0.1:8000/projects/$projectId" -WebSession $session
```

Delete the project:

```powershell
Invoke-RestMethod -Method Delete -Uri "http://127.0.0.1:8000/projects/$projectId" -WebSession $session
```

Confirm unauthenticated requests fail:

```powershell
Invoke-WebRequest -Method Get -Uri "http://127.0.0.1:8000/projects" -SkipHttpErrorCheck
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
- Authenticated project creation, pagination, lookup, deletion, and secure code file storage
- Placeholder analysis and question routes

## Security And Performance Foundations

Uploaded code is treated as untrusted plain text only. The backend must not execute uploaded files.

Limits:

- Max files per project: 50
- Max individual file size: 100 KB
- Max total project size: 1 MB

The backend also includes allowed extension constants, path normalization helpers, secret scanning and redaction utilities, file safety checks, database indexes for common user/project lookups, and safe generic error responses.

Phase 3 upgrades the file safety layer to reject empty files, binary-looking content, unsafe paths, path traversal attempts, disallowed extensions, too many files, oversized files, and oversized projects. It also redacts common API keys, passwords, tokens, database URLs, private keys, JWT secrets, OAuth secrets, and `.env`-style secrets before saving file content.
