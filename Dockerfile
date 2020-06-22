# Builder Image
# =============
# Download tools, install and compile dependencies.
FROM node:10.21.0-alpine as builder

ENV NODE_ENV=production \
    TCPWAIT_VERSION=2.2.0

WORKDIR /usr/src/app

# * Install glibc and friends to compile bcrypt.
# * Add tcpwait to wait for the database connection.
# * Create non-privileged psychoquiz user & group.
RUN apk --no-cache add \
      ca-certificates \
      g++ \
      gcc \
      libgcc \
      libstdc++ \
      linux-headers \
      make \
      python \
      wget \
    && \
    wget -O /usr/local/bin/tcpwait https://github.com/AlphaHydrae/tcpwait/releases/download/v${TCPWAIT_VERSION}/tcpwait_v${TCPWAIT_VERSION}_linux_amd64 && \
    chmod +x /usr/local/bin/tcpwait && \
    addgroup -S psychoquiz && \
    adduser -D -G psychoquiz -S psychoquiz && \
    chown psychoquiz:psychoquiz /usr/src/app

USER psychoquiz:psychoquiz

# Install dependencies.
COPY --chown=psychoquiz:psychoquiz package.json package-lock.json /usr/src/app/
RUN npm ci --only=production && \
    npm cache clean --force

# Production Image
# ================
FROM node:10.21.0-alpine

ENV NODE_ENV=production

WORKDIR /usr/src/app

# Create non-privileged psychoquiz user & group.
RUN addgroup -S psychoquiz && \
    adduser -D -G psychoquiz -S psychoquiz && \
    chown psychoquiz:psychoquiz /usr/src/app

USER psychoquiz:psychoquiz

COPY --chown=psychoquiz:psychoquiz --from=builder /usr/src/app/node_modules /usr/src/app/node_modules
COPY --chown=psychoquiz:psychoquiz ./ /usr/src/app/

COPY --from=builder /usr/local/bin/tcpwait /usr/local/bin/tcpwait

EXPOSE 8089

# Wait for the database to be reachable before running the application.
ENTRYPOINT [ \
  "tcpwait", \
  "--retries", "${TCPWAIT_ATTEMPTS-59}", \
  "--timeout", "${TCPWAIT_TIMEOUT-1000}", \
  "${DB_PROD_HOST-db}:${DB_PROD_PORT-3306}", \
  "--" \
]

CMD [ "node", "app.js" ]
