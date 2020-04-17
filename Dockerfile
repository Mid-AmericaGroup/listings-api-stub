FROM node:12-alpine

EXPOSE 3000

WORKDIR /app

COPY . .

RUN yarn
CMD node index.js