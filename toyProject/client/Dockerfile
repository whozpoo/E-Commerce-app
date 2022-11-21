FROM node:16-alpine

ENV BROWSER=none
ENV CI=true
ENV WDS_SOCKET_PORT=0

WORKDIR /app

COPY ./package.json ./

RUN npm config set registry https://registry.npmmirror.com

RUN npm install

COPY ./ ./

CMD ["npm", "start"]