import os
import jwt
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jwt import PyJWKClient

app = FastAPI(title="FastAPI + Keycloak")
security = HTTPBearer(auto_error=True)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Settings:
    def __init__(self):
        self.keycloak_url = os.environ["KEYCLOAK_URL"]
        self.realm = os.environ["KEYCLOAK_REALM"]
        self.client_id = os.environ["KEYCLOAK_CLIENT_ID"]
        self.issuer = os.environ["KEYCLOAK_ISSUER"]

    @property
    def jwks_url(self):
        return f"{self.keycloak_url}/realms/{self.realm}/protocol/openid-connect/certs"


def get_settings():
    return Settings()


class User:
    def __init__(self, sub, username=None, email=None, roles=None):
        self.sub = sub
        self.username = username
        self.email = email
        self.roles = roles or []


_jwk_clients: dict = {}


def decode_token(token: str, settings: Settings) -> User:
    if settings.jwks_url not in _jwk_clients:
        _jwk_clients[settings.jwks_url] = PyJWKClient(settings.jwks_url)
    signing_key = _jwk_clients[settings.jwks_url].get_signing_key_from_jwt(token)
    payload = jwt.decode(
        token,
        signing_key.key,
        algorithms=["RS256"],
        issuer=settings.issuer,
        options={"verify_exp": True, "verify_aud": False, "verify_iss": True},
    )
    if payload.get("azp") != settings.client_id:
        raise HTTPException(status_code=401, detail="Invalid authorized party")
    subject = payload.get("sub") or payload.get("preferred_username") or payload.get("email")
    if not subject:
        raise HTTPException(status_code=401, detail="Token has no usable subject claim")
    return User(
        sub=subject,
        username=payload.get("preferred_username"),
        email=payload.get("email"),
        roles=payload.get("realm_access", {}).get("roles", []),
    )


async def get_current_user(
    creds: HTTPAuthorizationCredentials = Depends(security),
    settings: Settings = Depends(get_settings),
) -> User:
    try:
        return decode_token(creds.credentials, settings)
    except HTTPException:
        raise
    except jwt.PyJWTError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))


@app.get("/")
def root():
    return {"ok": True, "service": "FastAPI + Keycloak"}


@app.get("/health")
def health():
    return {"status": "healthy"}


@app.get("/me")
def me(user: User = Depends(get_current_user)):
    return {
        "sub": user.sub,
        "username": user.username,
        "email": user.email,
        "roles": user.roles,
    }


@app.get("/debug-auth")
def debug_auth(settings: Settings = Depends(get_settings)):
    return {
        "keycloak_url": settings.keycloak_url,
        "issuer": settings.issuer,
        "jwks_url": settings.jwks_url,
        "client_id": settings.client_id,
    }
