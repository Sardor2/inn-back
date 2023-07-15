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

  app.enableCors({
    origin: function (origin, callback) {
      callback(null, true);
      return;
      // if (whitelist.indexOf(origin) !== -1) {
      //   console.log('allowed cors for:', origin);
      // } else {
      //   console.log('blocked cors for:', origin);
      //   callback(new Error('Not allowed by CORS'));
      // }
    },
  });

  await app.listen(5000);
}
bootstrap();
