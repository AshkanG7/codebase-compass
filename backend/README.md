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

The API will be available at `http://localhost:8000`.

## Auth Configuration

The backend uses bcrypt password hashing and short-lived JWT access tokens stored in an httpOnly cookie named `access_token`.

Required auth environment variables:

- `JWT_SECRET`: local development secret. Use a long random value and do not commit real secrets.
- `JWT_ALGORITHM`: defaults to `HS256`.
- `ACCESS_TOKEN_EXPIRE_MINUTES`: defaults to `15`.

The `.env` file is ignored by git. Keep real secrets only in `.env` or your deployment secret manager.

## OpenAI Configuration

Phase 4 uses the official OpenAI Python package and the Responses API to analyze stored code files as untrusted plain text. Add these variables to `.env`:

- `OPENAI_API_KEY`: your OpenAI API key. Leave empty in local development if you want analysis requests to fail safely.
- `OPENAI_MODEL`: defaults to `gpt-4.1-mini`.
- `OPENAI_TIMEOUT_SECONDS`: defaults to `30`.

The analysis prompt explicitly ignores instructions inside uploaded files, sends redacted file content only, and requests structured JSON.

## Manual Auth Testing

Run these commands from PowerShell after starting the API.

Signup and save the auth cookie:

```powershell
curl.exe -i -c .\cookies.txt -H "Content-Type: application/json" -d "{\"email\":\"test@example.com\",\"password\":\"ChangeMe123!\",\"display_name\":\"Test User\"}" http://localhost:8000/auth/signup
```

Login and refresh the auth cookie:

```powershell
curl.exe -i -c .\cookies.txt -H "Content-Type: application/json" -d "{\"email\":\"test@example.com\",\"password\":\"ChangeMe123!\"}" http://localhost:8000/auth/login
```

Fetch the current user with the cookie:

```powershell
curl.exe -i -b .\cookies.txt http://localhost:8000/auth/me
```

Protected projects route without auth should fail with `401`:

```powershell
curl.exe -i http://localhost:8000/projects
```

Protected projects route with auth should return the user's paginated projects:

```powershell
curl.exe -i -b .\cookies.txt http://localhost:8000/projects
```

Logout clears the auth cookie:

```powershell
curl.exe -i -b .\cookies.txt -c .\cookies.txt -X POST http://localhost:8000/auth/logout
```

## Manual Project And File Testing

If you ran an earlier phase against the same database, recreate the development database or add a migration before testing because Phase 3 adds the `code_files.language` column.

Create an account once if needed:

```powershell
$session = New-Object Microsoft.PowerShell.Commands.WebRequestSession
$signupBody = @{ email = "phase3@example.com"; password = "ChangeMe123!"; display_name = "Phase 3 User" } | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri "http://localhost:8000/auth/signup" -WebSession $session -ContentType "application/json" -Body $signupBody
```

Login:

```powershell
$session = New-Object Microsoft.PowerShell.Commands.WebRequestSession
$loginBody = @{ email = "phase3@example.com"; password = "ChangeMe123!" } | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri "http://localhost:8000/auth/login" -WebSession $session -ContentType "application/json" -Body $loginBody
```

Create a project:

```powershell
$projectBody = @{ name = "My React App"; description = "Optional description" } | ConvertTo-Json
$project = Invoke-RestMethod -Method Post -Uri "http://localhost:8000/projects" -WebSession $session -ContentType "application/json" -Body $projectBody
$projectId = $project.id
```

Get paginated projects:

```powershell
Invoke-RestMethod -Method Get -Uri "http://localhost:8000/projects?page=1&page_size=10" -WebSession $session
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
Invoke-RestMethod -Method Post -Uri "http://localhost:8000/projects/$projectId/files" -WebSession $session -ContentType "application/json" -Body $filesBody
```

Get project files:

```powershell
Invoke-RestMethod -Method Get -Uri "http://localhost:8000/projects/$projectId/files" -WebSession $session
```

Get one project with files and latest analysis:

```powershell
Invoke-RestMethod -Method Get -Uri "http://localhost:8000/projects/$projectId" -WebSession $session
```

Delete the project:

```powershell
Invoke-RestMethod -Method Delete -Uri "http://localhost:8000/projects/$projectId" -WebSession $session
```

Confirm unauthenticated requests fail:

```powershell
Invoke-WebRequest -Method Get -Uri "http://localhost:8000/projects" -SkipHttpErrorCheck
```

## Manual AI Analysis Testing

If you ran earlier phases against the same database, recreate the development database or add a migration before testing because Phase 4 adds structured analysis columns.

Login:

```powershell
$session = New-Object Microsoft.PowerShell.Commands.WebRequestSession
$loginBody = @{ email = "phase4@example.com"; password = "ChangeMe123!" } | ConvertTo-Json
try {
  Invoke-RestMethod -Method Post -Uri "http://localhost:8000/auth/signup" -WebSession $session -ContentType "application/json" -Body (@{ email = "phase4@example.com"; password = "ChangeMe123!"; display_name = "Phase 4 User" } | ConvertTo-Json)
} catch {}
Invoke-RestMethod -Method Post -Uri "http://localhost:8000/auth/login" -WebSession $session -ContentType "application/json" -Body $loginBody
```

Create a project:

```powershell
$projectBody = @{ name = "Phase 4 Sample"; description = "AI analysis smoke test" } | ConvertTo-Json
$project = Invoke-RestMethod -Method Post -Uri "http://localhost:8000/projects" -WebSession $session -ContentType "application/json" -Body $projectBody
$projectId = $project.id
```

Add files:

```powershell
$filesBody = @{
  files = @(
    @{
      path = "package.json"
      language = "JSON"
      content = "{ `"scripts`": { `"dev`": `"next dev`" }, `"dependencies`": { `"next`": `"latest`", `"react`": `"latest`" } }"
    },
    @{
      path = "src/App.tsx"
      language = "TypeScript"
      content = "const apiKey = 'sk-test-should-redact';`nexport default function App() { return <main>Hello</main>; }"
    }
  )
} | ConvertTo-Json -Depth 5
Invoke-RestMethod -Method Post -Uri "http://localhost:8000/projects/$projectId/files" -WebSession $session -ContentType "application/json" -Body $filesBody
```

Analyze the project:

```powershell
Invoke-RestMethod -Method Post -Uri "http://localhost:8000/projects/$projectId/analyze" -WebSession $session
```

Get the project and confirm `latest_analysis` is included:

```powershell
Invoke-RestMethod -Method Get -Uri "http://localhost:8000/projects/$projectId" -WebSession $session
```

Test analyzing an empty project fails safely:

```powershell
$emptyProject = Invoke-RestMethod -Method Post -Uri "http://localhost:8000/projects" -WebSession $session -ContentType "application/json" -Body (@{ name = "Empty Project" } | ConvertTo-Json)
Invoke-WebRequest -Method Post -Uri "http://localhost:8000/projects/$($emptyProject.id)/analyze" -WebSession $session -SkipHttpErrorCheck
```

Test unauthenticated analyze fails:

```powershell
Invoke-WebRequest -Method Post -Uri "http://localhost:8000/projects/$projectId/analyze" -SkipHttpErrorCheck
```

## Manual Follow-Up Question Testing

Login:

```powershell
$session = New-Object Microsoft.PowerShell.Commands.WebRequestSession
$loginBody = @{ email = "phase5@example.com"; password = "ChangeMe123!" } | ConvertTo-Json
try {
  Invoke-RestMethod -Method Post -Uri "http://localhost:8000/auth/signup" -WebSession $session -ContentType "application/json" -Body (@{ email = "phase5@example.com"; password = "ChangeMe123!"; display_name = "Phase 5 User" } | ConvertTo-Json)
} catch {}
Invoke-RestMethod -Method Post -Uri "http://localhost:8000/auth/login" -WebSession $session -ContentType "application/json" -Body $loginBody
```

Create a project:

```powershell
$project = Invoke-RestMethod -Method Post -Uri "http://localhost:8000/projects" -WebSession $session -ContentType "application/json" -Body (@{ name = "Phase 5 Sample"; description = "Question answering smoke test" } | ConvertTo-Json)
$projectId = $project.id
```

Add files:

```powershell
$filesBody = @{
  files = @(
    @{
      path = "package.json"
      language = "JSON"
      content = "{ `"scripts`": { `"dev`": `"next dev`" }, `"dependencies`": { `"next`": `"latest`", `"react`": `"latest`" } }"
    },
    @{
      path = "src/App.tsx"
      language = "TypeScript"
      content = "export default function App() { return <main>Hello from the app entry component</main>; }"
    }
  )
} | ConvertTo-Json -Depth 5
Invoke-RestMethod -Method Post -Uri "http://localhost:8000/projects/$projectId/files" -WebSession $session -ContentType "application/json" -Body $filesBody
```

Analyze the project:

```powershell
Invoke-RestMethod -Method Post -Uri "http://localhost:8000/projects/$projectId/analyze" -WebSession $session
```

Ask a follow-up question:

```powershell
$questionBody = @{ question = "Where does this app start?" } | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri "http://localhost:8000/projects/$projectId/questions" -WebSession $session -ContentType "application/json" -Body $questionBody
```

Get question history:

```powershell
Invoke-RestMethod -Method Get -Uri "http://localhost:8000/projects/$projectId/questions?page=1&page_size=10" -WebSession $session
```

Confirm unauthenticated question requests fail:

```powershell
Invoke-WebRequest -Method Post -Uri "http://localhost:8000/projects/$projectId/questions" -ContentType "application/json" -Body $questionBody -SkipHttpErrorCheck
```

Confirm another user cannot ask questions about the first user's project:

```powershell
$otherSession = New-Object Microsoft.PowerShell.Commands.WebRequestSession
try {
  Invoke-RestMethod -Method Post -Uri "http://localhost:8000/auth/signup" -WebSession $otherSession -ContentType "application/json" -Body (@{ email = "phase5-other@example.com"; password = "ChangeMe123!"; display_name = "Other User" } | ConvertTo-Json)
} catch {}
Invoke-RestMethod -Method Post -Uri "http://localhost:8000/auth/login" -WebSession $otherSession -ContentType "application/json" -Body (@{ email = "phase5-other@example.com"; password = "ChangeMe123!" } | ConvertTo-Json)
Invoke-WebRequest -Method Post -Uri "http://localhost:8000/projects/$projectId/questions" -WebSession $otherSession -ContentType "application/json" -Body $questionBody -SkipHttpErrorCheck
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
- OpenAI-powered project analysis with structured saved results
- OpenAI-powered follow-up questions with saved Q&A history
- Placeholder standalone analysis and question routes

## Security And Performance Foundations

Uploaded code is treated as untrusted plain text only. The backend must not execute uploaded files.

Limits:

- Max files per project: 50
- Max individual file size: 100 KB
- Max total project size: 1 MB

The backend also includes allowed extension constants, path normalization helpers, secret scanning and redaction utilities, file safety checks, database indexes for common user/project lookups, and safe generic error responses.

Phase 3 upgrades the file safety layer to reject empty files, binary-looking content, unsafe paths, path traversal attempts, disallowed extensions, too many files, oversized files, and oversized projects. It also redacts common API keys, passwords, tokens, database URLs, private keys, JWT secrets, OAuth secrets, and `.env`-style secrets before saving file content.