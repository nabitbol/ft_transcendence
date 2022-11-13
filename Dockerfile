FROM node:latest

# Add env variable as args
ARG NX_CONTAINER_FILES_PATH

# Set working directory at nx container files path
WORKDIR ${NX_CONTAINER_FILES_PATH}

# Copy project files
COPY . .


# Install dependencies
RUN npm install --loglevel=error
RUN npm install -g @nrwl/cli
RUN npm install -g @nestjs/cli
RUN npm install nx -y

# Build backend
RUN npx nx build apps-backend

# CMD
CMD ["npx", "nx", "serve", "apps-backend", "--host", "0.0.0.0", "--port", "3333"]
