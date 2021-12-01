FROM node:16-alpine

RUN mkdir -p /src

WORKDIR /src

COPY package*.json ./

RUN npm install

COPY . .

CMD npm start