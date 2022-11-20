FROM node:18-alpine

WORKDIR /app

COPY ./package.json ./

RUN npm config set registry https://registry.npmmirror.com


RUN npm install

COPY ./ ./

CMD ["npm", "start"]