# Frontend Dockerfile
FROM node:18-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: serve with a lightweight web server
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html

# expose port that nginx listens on
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
