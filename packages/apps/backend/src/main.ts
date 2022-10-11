import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app/app.module";
import { Server } from "socket.io";
import { registerGameHandlers } from "./app/gameHandler";
import { registerChatHandlers } from "./app/chatHandler";

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
  const io = new Server(3000, {cors: corsOptions});

  const onConnection = (socket) => {

    const userDisconnect = () => {
      console.log('user disconnected');
    }
    registerChatHandlers(io, socket);
    registerGameHandlers(io, socket);
    socket.on("disconnect", userDisconnect);
  }
  io.on("connection", onConnection);
  ////////////////////////////////////////////////


  io.listen(3001);
  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}/`);
  Logger.log(
    `📄 Please find the api documentation on http://localhost:${port}/${docPrefix}`
  );
}

bootstrap();
