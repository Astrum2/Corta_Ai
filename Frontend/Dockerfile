FROM node:lts AS base

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

FROM base AS frontend

RUN npm run build

EXPOSE 3000

CMD ["node", "server.js"]

FROM base AS upload-server

ENV UPLOAD_PORT=3002

EXPOSE 3002

CMD ["npm", "run", "start:upload"]