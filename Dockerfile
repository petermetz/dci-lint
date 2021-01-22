FROM node:14.15.4-buster as builder

RUN apt-get update
RUN apt -y install software-properties-common
RUN apt-add-repository 'deb http://security.debian.org/debian-security stretch/updates main'
RUN apt-get update
RUN apt-get install -y openjdk-8-jdk

RUN npm install modclean -g

WORKDIR /
RUN mkdir /app/
WORKDIR /app/
COPY ./ ./
RUN npm ci
RUN ./node_modules/.bin/lerna clean --yes
RUN ./node_modules/.bin/lerna bootstrap
RUN npm run build:dev
RUN ./node_modules/.bin/lerna clean --yes
RUN ./node_modules/.bin/lerna bootstrap -- --production --no-optional

RUN modclean --run --patterns="default:*" --path ./pkg/api-client/
RUN modclean --run --patterns="default:*" --path ./pkg/cmd-api-server/
RUN modclean --run --patterns="default:*" --path ./pkg/cockpit/
RUN modclean --run --patterns="default:*" --path ./pkg/common/
RUN modclean --run --patterns="default:*" --path ./pkg/core/
RUN modclean --run --patterns="default:*" --path ./pkg/core-api/

RUN rm -rf ./pkg/test-api-client
RUN rm -rf ./pkg/test-cmd-api-server
RUN rm -rf ./node_modules/

FROM node:14.15.4-buster-slim

RUN apt-get update
RUN apt-get install -y ca-certificates tzdata curl tini git
RUN rm -rf /var/lib/apt/lists/*

ARG APP=/usr/src/app/

ENV TZ=Etc/UTC \
    APP_USER=appuser

RUN groupadd $APP_USER \
    && useradd -g $APP_USER $APP_USER \
    && mkdir -p ${APP}

COPY --chown=$APP_USER:$APP_USER --from=builder /app/ ${APP}

USER $APP_USER
WORKDIR ${APP}

# Web GUI + Reverse proxy for API
EXPOSE 3000

# API
EXPOSE 4000

RUN ls -al

ENV COCKPIT_TLS_ENABLED=false
ENV COCKPIT_CORS_DOMAIN_CSV=\*
ENV COCKPIT_MTLS_ENABLED=false
ENV API_MTLS_ENABLED=false
ENV API_TLS_ENABLED=false
ENV COCKPIT_TLS_CERT_PEM=-
ENV COCKPIT_TLS_KEY_PEM=-
ENV COCKPIT_TLS_CLIENT_CA_PEM=-
ENV API_TLS_CERT_PEM=-
ENV API_TLS_CLIENT_CA_PEM=-
ENV API_TLS_KEY_PEM=-
ENV COCKPIT_HOST=0.0.0.0
ENV API_HOST=0.0.0.0
ENV API_PORT=4000
ENV PORT=3000
ENV COCKPIT_PORT=$PORT
ENV LOG_LEVEL=INFO

ENTRYPOINT ["/usr/bin/tini", "--"]
CMD ["node /usr/src/app/pkg/cmd-api-server/dist/lib/main/typescript/cmd/dci-lint-server.js"]

HEALTHCHECK --interval=1s --timeout=5s --start-period=1s --retries=30 CMD curl -vv -i -X OPTIONS http://127.0.0.1:4000/

