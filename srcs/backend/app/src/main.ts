import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const cors=require("cors");
  const corsOptions ={
    origin:['http://localhost:3001', process.env.API_URL],
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200,
  }
  app.use(cors(corsOptions)) // Use this after the variable declaration
  await app.listen(process.env.BACK_ENV_PORT);
}

bootstrap();
