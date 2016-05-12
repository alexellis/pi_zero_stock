FROM mhart/alpine-node:4

ADD package.json ./
RUN npm install

RUN mkdir -p fetch
ADD fetch/* ./fetch/
ADD index.js ./

CMD ["npm", "start"]
