# BASE_IMAGE allows swapping to a Harbor-hosted mirror.
# Default falls back to the public image for local dev.
ARG BASE_IMAGE=python:3.12-slim
FROM ${BASE_IMAGE}

WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1

# NEXUS_PYPI_URL: if set, pip will pull from your Nexus PyPI proxy.
# Example: https://nexus.corp.local/repository/pypi-proxy/simple
ARG NEXUS_PYPI_URL

COPY requirements.txt .
RUN if [ -n "$NEXUS_PYPI_URL" ]; then \
        pip install --no-cache-dir \
            --index-url "$NEXUS_PYPI_URL" \
            --trusted-host "$(echo $NEXUS_PYPI_URL | sed 's|https\?://||' | cut -d'/' -f1)" \
            -r requirements.txt; \
    else \
        pip install --no-cache-dir -r requirements.txt; \
    fi

COPY app.py .
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
