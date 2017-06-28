FROM node:6-alpine

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Setup environment variables
ENV NODE_ENV production
ENV MONGOLAB_URI mongodb://hectagon:doublepass@ds062889.mlab.com:62889/loc8r

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install --silent

# Bundle app source
COPY . .

EXPOSE 8080
CMD [ "npm", "start" ]