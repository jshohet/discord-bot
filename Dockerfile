FROM node:20

COPY package.json /

COPY src /src

WORKDIR /src

RUN npm install

CMD ["node", "index.js"]