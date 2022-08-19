# Base image for this container
FROM node:16-alpine3.16

# Create an application directory and set proper permissions
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
# Change current directory to an application folder
WORKDIR /home/node/app
# Switch user to node
USER node
# Copy package.json and package-lock.json into the container
COPY package.json ./
# Install dependencies
RUN npm install
# Copy project files into the container
COPY --chown=node:node . .
# Start the Node.js application
CMD [ "npm", "start" ]
