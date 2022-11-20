FROM node:19-alpine

WORKDIR /usr/app
COPY ./package.json ./

RUN npm config set registry http://r.cnpmjs.org

RUN npm install
COPY ./ ./

CMD ["npm", "start"]