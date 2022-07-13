# ---------------------------------------------------------------------------- #
#                                    Frontend                                   #
# ---------------------------------------------------------------------------- #

# Deploy form node 16 image
FROM node:13.12.0-alpine

# Create the app directory
WORKDIR /var/home/ft_transcendence/srcs/frontend/app/

# Copy the porject files
COPY ./app .

# Install app dependencies 
RUN npm install

# Expose the port in the container
EXPOSE ${PORT}

# Execute backend command
CMD [ "npm", "run", "start"]
