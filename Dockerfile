# syntax=docker/dockerfile:1

ARG NODE_VERSION=20.11.1


FROM node:${NODE_VERSION}-alpine as base
WORKDIR /usr/src/app
EXPOSE 3000

FROM base as dev
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --include=dev
USER node
COPY . .
CMD npm run dev

FROM base as prod
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

USER node
COPY . .

COPY service-account-file.json /usr/src/app/service-account-file.json
RUN chown node:node /usr/src/app/service-account-file.json
RUN chmod 400 /usr/src/app/service-account-file.json

CMD node src/index.js
