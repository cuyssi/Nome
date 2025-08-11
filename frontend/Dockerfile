# Etapa 1: build
FROM node:18 AS builder
ARG VITE_API_URL
WORKDIR /app
COPY . .
RUN echo "VITE_API_URL=$VITE_API_URL" > .env.production
RUN npm install
RUN VITE_API_URL=$VITE_API_URL npm run build

# Etapa 2: producción con Nginx
FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
