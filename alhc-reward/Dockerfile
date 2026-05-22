# 1. Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Vite reads VITE_* at build time and bakes the value into the bundle.
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# 2. Serve stage (nginx)
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
