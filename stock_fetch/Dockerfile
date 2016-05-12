FROM mhart/alpine-node:4

ADD package.json ./
RUN npm install

ADD fetch ./
ADD index.js ./

CMD ["npm", "start"]
