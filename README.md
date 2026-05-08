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

Edit `.env` to route all image and package pulls through your internal registries:

```env
# Prefix for Docker Hub images (python, node, nginx) — include trailing slash
REGISTRY_PREFIX=docker-proxy.local/mirror.gcr.io/

# Prefix for quay.io images (keycloak) — include trailing slash
# If your proxy serves all registries under the same prefix, set this the same as REGISTRY_PREFIX
# If left empty, falls back to REGISTRY_PREFIX
KEYCLOAK_REGISTRY_PREFIX=docker-proxy.local/quay.io/

# Nexus: PyPI proxy (pip)
NEXUS_PYPI_URL=https://nexus.corp.local/repository/pypi-proxy/simple

# Nexus: npm proxy
NEXUS_NPM_URL=https://nexus.corp.local/repository/npm-proxy
```

### What each variable controls

| Variable | Controls |
|---|---|
| `REGISTRY_PREFIX` | Prefix for all `FROM` lines: `python:3.12-slim`, `node:22-alpine`, `nginx:alpine` |
| `KEYCLOAK_REGISTRY_PREFIX` | Prefix for the Keycloak image (`quay.io/keycloak/keycloak`). Falls back to `REGISTRY_PREFIX` if empty |
| `NEXUS_PYPI_URL` | `pip install --index-url` during backend build |
| `NEXUS_NPM_URL` | `npm install --registry` during frontend build |

### Important: trailing slash

Registry prefix variables **must include a trailing slash**:
```env
# Correct
REGISTRY_PREFIX=docker-proxy.local/mirror.gcr.io/

# Wrong — missing trailing slash
REGISTRY_PREFIX=docker-proxy.local/mirror.gcr.io
```

### Leave empty for local/public dev

All variables default to empty, which means Docker pulls from public registries as normal.

### Resulting image names (example)

With `REGISTRY_PREFIX=docker-proxy.local/mirror.gcr.io/` and `KEYCLOAK_REGISTRY_PREFIX=docker-proxy.local/quay.io/`:

```
docker-proxy.local/mirror.gcr.io/python:3.12-slim
docker-proxy.local/mirror.gcr.io/node:22-alpine
docker-proxy.local/mirror.gcr.io/nginx:alpine
docker-proxy.local/quay.io/quay.io/keycloak/keycloak:25.0
```

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
