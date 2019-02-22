FROM node:6-alpine

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Setup environment variables
ENV NODE_ENV production
ENV MONGOLAB_URI mongodb://loc8r-hect:ZEqlqEdEmwJn8Kz6xpm24m2BowukZIqDnz7HxA4x8rWy1qPfsnZI0KzCTlgpXmBhyWAyAhCjerZbIDWF8RvYBA==@loc8r-hect.documents.azure.com:10255/loc8r?ssl=true
ENV API_ADDRESS https://hectagon.azurewebsites.net/

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install --silent

# Bundle app source
COPY . .

EXPOSE 3000
CMD [ "npm", "start" ]