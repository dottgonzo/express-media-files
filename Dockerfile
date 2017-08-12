FROM node:8-alpine
MAINTAINER Dario Caruso <dev@dariocaruso.info>
RUN apk update && apk add ffmpeg && rm -rf /var/cache/apk/*
RUN mkdir /app
WORKDIR /app
COPY ./* /app/
CMD node server

