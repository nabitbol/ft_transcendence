# ---------------------------------------------------------------------------- #
#                                    Backend                                   #
# ---------------------------------------------------------------------------- #

# Deploy form node 16 image
FROM node:16

# Get the env vcariables
ENV ENV_HOST 127.0.0.1
ENV ENV_PORT 3000
ENV POSTGRES_ENV_PORT 5432

# Create the app directory
WORKDIR /var/home/ft_transcendence/srcs/backend/app/

# Copy the porject files
COPY ./app .

# Install app dependencies 
RUN npm install

# Expose the port in the container
EXPOSE ${ENV_PORT}

# Execute backend command
CMD [ "npm", "run", "start"]
