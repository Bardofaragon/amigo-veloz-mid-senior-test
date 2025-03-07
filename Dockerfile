FROM --platform=linux/amd64 node:22-alpine
RUN mkdir -p /usr/src/node-app && chown -R node:node /usr/src/node-app
WORKDIR /usr/src/node-app
COPY package.json yarn.lock ./
USER node
RUN rm -rf node_modules && yarn install --frozen-lockfile --platform=linux
COPY --chown=node:node . .
EXPOSE 3000
CMD ["yarn", "dev"]
