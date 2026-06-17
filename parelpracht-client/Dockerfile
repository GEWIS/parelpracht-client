# build environment
FROM node:22 AS build
WORKDIR /app
ENV PATH=/app/node_modules/.bin:$PATH
COPY package.json ./
COPY yarn.lock ./
RUN corepack enable
RUN yarn install --immutable

COPY index.html ./
COPY vite.config.mts ./
COPY tsconfig.json ./
COPY tsconfig.app.json ./
COPY tsconfig.node.json ./
COPY public ./public
COPY src ./src

ARG APP_VERSION=
ARG GIT_COMMIT_HASH=
ARG GIT_COMMIT_DATE=
ENV APP_VERSION=$APP_VERSION
ENV GIT_COMMIT_HASH=$GIT_COMMIT_HASH
ENV GIT_COMMIT_DATE=$GIT_COMMIT_DATE
RUN yarn run build

# production environment
FROM nginx:stable-alpine
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
