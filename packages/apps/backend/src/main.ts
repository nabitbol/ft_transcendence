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
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(docPrefix, app, document);
  const port = process.env.PORT || 3333;
  const cors = await import("cors");
  const corsOptions = {
    origin: "http://localhost:" + 4200,
    credentials: true, //access-control-allow-credentials:true
    optionSuccessStatus: 200,
  };
  app.use(cors(corsOptions));

  ////////////SOCKET_IO SERVER////////////////////
  const httpServer = createServer();
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:4200",
      methods: ["GET", "POST"]
    }
  });
  io.on("connection", (socket) => {
    // send a message to the client
    socket.emit("hello from server", 1, "2", { 3: Buffer.from([4]) });
    
    // receive a message from the client
    socket.on("hello from client", (...args) => {
         console.log("Client has connected");
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
