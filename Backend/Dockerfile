FROM node:lts AS builder

WORKDIR /app

COPY . .

RUN npm install
RUN npm run build

EXPOSE 3001

CMD ["node","dist/src/server.js"]