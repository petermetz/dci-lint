FROM ubuntu:20.04

SHELL ["/bin/bash", "-c"]

ARG APP=/usr/src/app/
ENV APP_USER=appuser

# GUI: 3000, API: 4000
EXPOSE 3000 4000

RUN groupadd --gid 1000 appuser \
  && useradd --uid 1000 --gid appuser --shell /bin/bash --create-home ${APP_USER}

RUN apt update && apt install -y curl git

RUN mkdir -p "${APP}log/"
RUN chown -R $APP_USER:$APP_USER "${APP}log/"

WORKDIR ${APP}

COPY --chown=${APP_USER}:${APP_USER} ./pkg/cmd-api-server/docker-entrypoint.sh /usr/local/bin/
COPY --chown=${APP_USER}:${APP_USER} ./pkg/cmd-api-server/healthcheck.sh /
RUN chown -R $APP_USER:$APP_USER ${APP}

USER $APP_USER

ENV TZ=Etc/UTC
ENV NODE_ENV=production

ENV NVM_DIR /home/${APP_USER}/.nvm
ENV NODE_VERSION 18.12.1
ENV NODE_PATH $NVM_DIR/v$NODE_VERSION/lib/node_modules
ENV PATH      $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

# Install nvm with node and npm
RUN mkdir -p ${NVM_DIR}
RUN curl https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.2/install.sh | bash \
  && source $NVM_DIR/nvm.sh \
  && nvm install $NODE_VERSION \
  && nvm alias default $NODE_VERSION \
  && nvm use default \
  && npm install -g npm@8.19.2

ARG NPM_PKG_VERSION=latest
RUN npm install @dci-lint/cmd-api-server@${NPM_PKG_VERSION} --production

ENV COCKPIT_TLS_ENABLED=false
ENV COCKPIT_CORS_DOMAIN_CSV=\*
ENV COCKPIT_MTLS_ENABLED=false
ENV API_MTLS_ENABLED=false
ENV API_TLS_ENABLED=false
ENV COCKPIT_TLS_CERT_PEM=-
ENV COCKPIT_TLS_KEY_PEM=-
ENV COCKPIT_TLS_CLIENT_CA_PEM=-
ENV COCKPIT_WWW_ROOT=/usr/src/app/node_modules/@dci-lint/cockpit/www/
ENV API_TLS_CERT_PEM=-
ENV API_TLS_CLIENT_CA_PEM=-
ENV API_TLS_KEY_PEM=-
ENV COCKPIT_HOST=0.0.0.0
ENV API_HOST=0.0.0.0
ENV API_PORT=4000
ENV PORT=3000
ENV LOG_LEVEL=INFO

HEALTHCHECK --interval=1s --timeout=5s --start-period=1s --retries=60 CMD /healthcheck.sh
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["node_modules/@dci-lint/cmd-api-server/dist/lib/main/typescript/cmd/dci-lint-server.js"]
