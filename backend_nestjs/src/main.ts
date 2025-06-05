import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'https://cise-assignment1-b-iq5g-l7ykkb89g.vercel.app', // Replace with your Vercel domain
  });

  await app.listen(process.env.PORT || 3000, '0.0.0.0');
}
bootstrap();
