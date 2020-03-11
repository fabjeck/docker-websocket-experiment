# use image of latest node version
FROM node:latest

# make directory structure inside node image and set ownership to user "node"
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

# move to created directory
WORKDIR /home/node/app

# copy  package.json and package-lock.json from local to image
COPY package*.json ./

# set user to "node"
USER node

# install dependencies
RUN npm install

# copy application code with the appropriate permissions to the application directory on the container
COPY --chown=node:node . .

# expose port on the container
EXPOSE 3000

# start the application
CMD [ "npm", "build" ]