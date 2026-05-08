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
cp .env.example .env        # edit .env for your registries
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

## Registry configuration (air-gapped / corporate)

Edit `.env` to route all package and image pulls through your internal registries:

```env
# Harbor: Docker image registry
HARBOR_REGISTRY=harbor.corp.local

# Nexus: PyPI proxy (pip)
NEXUS_PYPI_URL=https://nexus.corp.local/repository/pypi-proxy/simple

# Nexus: npm proxy
NEXUS_NPM_URL=https://nexus.corp.local/repository/npm-proxy
```

### What each variable controls

| Variable | Controls |
|---|---|
| `HARBOR_REGISTRY` | Base image prefix for all `FROM` lines in Dockerfiles (`python`, `node`, `nginx`, `keycloak`) |
| `NEXUS_PYPI_URL` | `pip install --index-url` during backend build |
| `NEXUS_NPM_URL` | `npm install --registry` during frontend build |

### Leave empty for local/public dev

All three variables default to empty. When empty:
- Docker pulls images from the public registry as normal.
- pip pulls from PyPI.
- npm pulls from the public npm registry.

### Harbor image naming

When `HARBOR_REGISTRY=harbor.corp.local`, Docker Compose will pull:

```
harbor.corp.local/python:3.12-slim
harbor.corp.local/node:22-alpine
harbor.corp.local/nginx:alpine
harbor.corp.local/quay.io/keycloak/keycloak:25.0
```

Make sure these images are proxied or pushed to your Harbor instance before building.

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

## Backend environment variables

| Variable | Description |
|---|---|
| `KEYCLOAK_URL` | Internal Keycloak URL for JWKS fetch |
| `KEYCLOAK_REALM` | Realm name |
| `KEYCLOAK_CLIENT_ID` | API client ID |
| `KEYCLOAK_ISSUER` | Issuer matching token `iss` claim |
