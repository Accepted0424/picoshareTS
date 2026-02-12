ARG BASE_IMAGE=node:20-bookworm-slim
FROM ${BASE_IMAGE}

WORKDIR /app

COPY package*.json ./
RUN npm ci --include=optional

COPY . .
RUN chmod +x ./scripts/docker-entrypoint.sh

ENV HOST=0.0.0.0
ENV PORT=8787
ENV PERSIST_DIR=/data
ENV DB_NAME=picoshare_db

EXPOSE 8787
VOLUME ["/data"]

CMD ["./scripts/docker-entrypoint.sh"]
