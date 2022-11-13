FROM node:19.0.1-alpine3.15

ARG NX_CONTAINER_FILES_PATH

WORKDIR NX_CONTAINER_FILES_PATH

COPY . .

# Install dependencies
RUN npm install

RUN npm install -g @nrwl/cli
RUN npm install -g @nestjs/cli

RUN npm install nx -y

RUN npx nx build apps-backend

CMD ["npx", "nx", "serve", "apps-backend", "--host", "0.0.0.0", "--port", "3333"]
