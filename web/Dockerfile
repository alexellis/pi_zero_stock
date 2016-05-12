FROM mhart/alpine-node:4

ADD package.json ./
RUN npm install

ADD server.js ./
ADD static ./static/

EXPOSE 3000
CMD ["npm", "start"]
