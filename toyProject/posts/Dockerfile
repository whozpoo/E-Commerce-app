FROM node:18-alpine

WORKDIR /app

COPY ./package.json ./

RUN npm config set registry http://r.cnpmjs.org

RUN npm install

COPY ./ ./

CMD ["npm", "start"]