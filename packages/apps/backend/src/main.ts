import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app/app.module";

const hostname = process.env.HOSTNAME;
const backendPort = process.env.BACKEND_PORT || 3333;
const frontendPort = process.env.FRONTEND_PORT;
const chatPort = process.env.SOCKET_CHAT;
const gamePort = process.env.SOCKET_GAME;

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
    console.log(process.env.BACKEND_PORT)
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(docPrefix, app, document);
  const cors = await import("cors");
  const corsOptions = {
    origin: `http://${hostname}:` + frontendPort,
    credentials: true,
    optionSuccessStatus: 200,
  };
  app.use(cors(corsOptions));

  await app.listen(backendPort);
  Logger.log(`🚀 Application is running on: http://${hostname}:${backendPort}/`);
  Logger.log(
    `📄 Please find the api documentation on http://${hostname}:${backendPort}/${docPrefix}`
  );
  Logger.log(`💬 The chat socket is listening on http://${hostname}:${chatPort}`);
  Logger.log(`💬 The game socket is listening on http://${hostname}:${gamePort}`);
}

bootstrap();
