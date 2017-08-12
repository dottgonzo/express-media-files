FROM ubuntu:xenial
MAINTAINER Dario Caruso <dev@dariocaruso.info>
RUN apt-get update && apt-get install -y ffmpeg curl
RUN curl --silent --location https://deb.nodesource.com/setup_8.x | bash -
RUN apt-get install --yes nodejs build-essential
RUN mkdir /app
WORKDIR /app
COPY ./* /app/
CMD node server

