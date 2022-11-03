FROM node:17-alpine3.12

WORKDIR /app

COPY . .

# Install dependencies
RUN npm install

RUN npm install --production --silent 
RUN npm install -g @nrwl/cli
RUN npm install -g @nestjs/cli

RUN npm install nx -y


# Init the database with the last migration
# RUN npx prisma migrate dev

CMD ["npx", "nx", "serve", "apps-backend", "--host", "0.0.0.0", "--port", "3333"]
