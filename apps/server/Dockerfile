# The API server: the bundle of `pnpm nx run server:build`, its chunks and the migrations it applies, on Node alone.
FROM node:26.11.1-trixie-slim
WORKDIR /app
COPY dist ./
ENV NODE_ENV=production MIGRATIONS=/app/drizzle
USER 10001
EXPOSE 8080
STOPSIGNAL SIGTERM
# Exec form, so Node is PID 1 and receives SIGTERM itself to drain.
ENTRYPOINT ["node", "server.mjs"]
