FROM node:lts AS builder

WORKDIR /app

COPY . .

RUN npm install
RUN npm run build

CMD ["node","dist/src/server.js"]