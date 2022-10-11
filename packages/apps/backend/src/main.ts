import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app/app.module";
import { createServer } from "http";
import { Server } from "socket.io";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const docPrefix = "doc";
  const config = new DocumentBuilder()
    .setTitle("ft-transcendence API")
    .setDescription("The ft-transcendence API description")
    .setVersion("1.0")
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        name: "JWT",
        description: "Enter JWT token here",
        in: "header",
      },
      "JWT-auth"
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(docPrefix, app, document);
  const port = process.env.PORT || 3333;
  const cors = await import("cors");
  const corsOptions = {
    origin: "http://localhost:" + 4200,
    credentials: true,
    optionSuccessStatus: 200,
  };
  app.use(cors(corsOptions));

  ////////////SOCKET_IO SERVER////////////////////
  const httpServer = createServer();
  const io = new Server(httpServer, {
    cors: corsOptions
  });

  io.on("connection", (socket) => {
    // send a message to the client
    socket.emit("hello from server", 1, "2", { 3: Buffer.from([4]) });
    
    // receive a message from the client
    socket.on("hello from client", (...args) => {
         console.log("Client has connected");

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });

    socket.on('chat message', (...msg) => {
      console.log('message: ' + msg);
      io.emit('chat message', msg);
    });

  });
  ////////////////////////////////////////////////
});

  httpServer.listen(3000);
  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}/`);
  Logger.log(
    `📄 Please find the api documentation on http://localhost:${port}/${docPrefix}`
  );
}

bootstrap();
