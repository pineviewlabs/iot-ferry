# Base image for this container
FROM node:16-alpine3.16

# Create a temporary directory for a CSV document
RUN mkdir /tmp/shiny-data
# Set a "free-for-all" permissions on this directory
RUN chmod 777 /tmp/shiny-data
# Create an application directory and set proper permissions
RUN mkdir -p /home/node/app && chown -R node:node /home/node/app
# Change current directory to an application folder
WORKDIR /home/node/app
# Switch user to node
USER node
# Copy project files into the container
COPY --chown=node:node . .
# Start the Node.js application
CMD [ "npm", "start" ]
