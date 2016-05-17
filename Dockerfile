FROM ubuntu:16.04

RUN apt-get update && apt-get install -y --no-install-recommends \
	ca-certificates \
	wget \
	xz-utils

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ENV NPM_CONFIG_LOGLEVEL info
ENV NODE_VERSION 4.4.4

RUN wget "https://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION-linux-x64.tar.xz" \
  && tar -xJf "node-v$NODE_VERSION-linux-x64.tar.xz" -C /usr/local --strip-components=1 \
  && rm "node-v$NODE_VERSION-linux-x64.tar.xz"

COPY package.json /usr/src/app/
RUN npm install

COPY *.js /usr/src/app/

EXPOSE 3000
CMD ["npm", "start"]
