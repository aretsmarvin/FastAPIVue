# Vue + Keycloak + FastAPI

Fully working SSO stack with:
- **Keycloak** (Identity Provider)
- **FastAPI** (Backend API with JWT validation)
- **Vue 3** (Frontend with PKCE login)

## Requirements

- Docker + Docker Compose
- Ports 8080, 8000, 5173 free

## Quick start

```bash
git clone https://github.com/aretsmarvin/FastAPIVue.git
cd FastAPIVue
docker compose up --build
```

Then open [http://localhost:5173](http://localhost:5173)

## Services

| Service | URL |
|---|---|
| Vue frontend | http://localhost:5173 |
| FastAPI backend | http://localhost:8000 |
| Keycloak admin | http://localhost:8080 |

## Login credentials

| What | Value |
|---|---|
| Keycloak admin | `admin` / `admin` |
| Demo user | `devuser` / `devpass` |

## How it works

1. User opens the Vue frontend and clicks **Login with SSO**.
2. Keycloak handles the login using Authorization Code Flow + PKCE.
3. Vue receives an access token and sends it as a Bearer token to FastAPI `/me`.
4. FastAPI validates the token against Keycloak's JWKS and returns user info.
5. Vue displays the user's profile.

## Architecture

```
Browser
  └─> Vue 3 (localhost:5173)
        └─> Keycloak login redirect (localhost:8080)
        └─> GET /me with Bearer token
              └─> FastAPI (localhost:8000)
                    └─> JWKS validation via host.docker.internal:8080
```

## Environment variables

### Backend

| Variable | Default | Description |
|---|---|---|
| `KEYCLOAK_URL` | required | Internal Keycloak URL for JWKS fetch |
| `KEYCLOAK_REALM` | `demo` | Realm name |
| `KEYCLOAK_CLIENT_ID` | `fastapi` | API client ID |
| `KEYCLOAK_ISSUER` | required | Issuer matching token `iss` claim |

### Frontend

| Variable | Default | Description |
|---|---|---|
| `VITE_KEYCLOAK_URL` | `http://localhost:8080` | Public Keycloak URL |
| `VITE_KEYCLOAK_REALM` | `demo` | Realm name |
| `VITE_KEYCLOAK_CLIENT_ID` | `vue-frontend` | SPA client ID |
| `VITE_API_BASE_URL` | `http://localhost:8000` | Backend URL |
