import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors() // Use this after the variable declaration
  await app.listen(process.env.BACK_ENV_PORT);
}

bootstrap();
