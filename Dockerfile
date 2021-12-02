FROM node:16-alpine

RUN apk update && apk add bash

RUN mkdir -p /src

WORKDIR /src

COPY package*.json ./

RUN npm install

COPY . .
