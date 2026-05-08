ARG REGISTRY_PREFIX=
FROM ${REGISTRY_PREFIX}node:22-alpine AS builder

WORKDIR /app

ARG NEXUS_NPM_URL
RUN if [ -n "${NEXUS_NPM_URL}" ]; then \
        echo "registry=${NEXUS_NPM_URL}" > /root/.npmrc && \
        echo "strict-ssl=false" >> /root/.npmrc; \
    fi

COPY package.json package-lock.json* ./
RUN npm install

COPY . .
RUN npm run build

ARG REGISTRY_PREFIX=
FROM ${REGISTRY_PREFIX}nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
