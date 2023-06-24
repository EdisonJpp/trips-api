ARG NODE_VERSION=16
ARG ALPINE_VERSION=3.14

FROM node:${NODE_VERSION} AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --production=true --frozen-lockfile --non-interactive


ARG NODE_VERSION
ARG ALPINE_VERSION
FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} as build

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

COPY . .

RUN yarn build


ARG NODE_VERSION
ARG ALPINE_VERSION
FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} as release


COPY --from=build /app/dist ./src
COPY --from=deps /app/node_modules ./node_modules

CMD ["node", "src/main.js"]