# build environment
FROM node:22 AS build
WORKDIR /app
ENV PATH=/app/parelpracht-client/node_modules/.bin:$PATH
COPY package.json ./
COPY yarn.lock ./
RUN corepack enable
RUN yarn install --immutable

COPY index.html ./parelpracht-client/
COPY vite.config.mts ./parelpracht-client/
COPY tsconfig.json ./parelpracht-client/
COPY tsconfig.app.json ./parelpracht-client/
COPY tsconfig.node.json ./parelpracht-client/
COPY public ./parelpracht-client/public
COPY src ./parelpracht-client/src
COPY ../.git ./.git
RUN cd parelpracht-client && yarn run build

# production environment
FROM nginx:stable-alpine
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d
COPY --from=build /app/parelpracht-client/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
