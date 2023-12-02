FROM node:18 as build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ARG VITE_APP_AUTH_SERVICE_URL
ENV VITE_APP_AUTH_SERVICE_URL="$VITE_APP_AUTH_SERVICE_URL"

ARG VITE_APP_FEED_SERVICE_URL
ENV VITE_APP_FEED_SERVICE_URL="$VITE_APP_FEED_SERVICE_URL"

RUN npm run build

FROM nginx:1.19

COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

COPY --from=build /app/dist /usr/share/nginx/html