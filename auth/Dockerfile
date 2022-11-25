FROM node:18-alpine

WORKDIR /app
COPY package.json .

RUN npm config set registry https://registry.npm.taobao.org
RUN npm install

COPY . .

CMD ["npm", "start"]