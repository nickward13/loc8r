FROM node:6-alpine
ENV NODE_ENV production
ENV MONGOLAB_URI mongodb://hectagon:doublepass@ds062889.mlab.com:62889/loc8r
WORKDIR /usr/src/app
COPY ["package.json", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
COPY . .
EXPOSE 3000
CMD npm start