FROM node:lts AS builder

WORKDIR /app

COPY . .

RUN npm install
RUN npm run build

EXPOSE 3007

CMD ["node", "dist/src/main.js"]