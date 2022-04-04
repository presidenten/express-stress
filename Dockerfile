FROM node:16.13.1-alpine3.14 as builder
WORKDIR /app
COPY src/package.json src/yarn.lock /app/
RUN yarn --production

# ---

FROM node:16.13.1-alpine3.14

RUN apk update && apk add --no-cache stress-ng curl

WORKDIR /app

COPY --from=builder /app/node_modules /app/node_modules
COPY src /app

CMD node index.js
