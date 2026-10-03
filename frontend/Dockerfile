# stage 1
 FROM node:18-alpine AS build

 WORKDIR /app

 COPY package*.json ./

 RUN npm install

 COPY . .

 RUN npm run build

 # stage 2

 FROM nginx:alpine

 COPY --from=build /app/dist /user/share/nginx/html

 EXPOSE 5173

 CMD["nginx","-g","daemon off;"]