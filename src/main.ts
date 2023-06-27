import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  // @ts-ignore
  BigInt.prototype.toJSON = function () {
    return this.toString();
  };

  await app.listen(5000);
}
bootstrap();
