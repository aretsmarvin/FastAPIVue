# BASE_IMAGE / NGINX_IMAGE allow swapping to Harbor-hosted mirrors.
# Defaults fall back to public images for local dev.
ARG BASE_IMAGE=node:22-alpine
ARG NGINX_IMAGE=nginx:alpine

FROM ${BASE_IMAGE} AS builder

# NEXUS_NPM_URL: if set, npm will pull from your Nexus npm proxy.
# Example: https://nexus.corp.local/repository/npm-proxy
ARG NEXUS_NPM_URL

WORKDIR /app
COPY package.json package-lock.json* ./

RUN if [ -n "$NEXUS_NPM_URL" ]; then \
        npm install --registry "$NEXUS_NPM_URL"; \
    else \
        npm install; \
    fi

COPY . .
RUN npm run build

FROM ${NGINX_IMAGE}
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
