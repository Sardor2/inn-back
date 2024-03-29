import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const whitelist = ['http://localhost:3000'];

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get<ConfigService>(ConfigService);

  const originsStringFromEnv = (config.get('ALLOWED_ORIGINS') ?? '').split(';');

  app.useGlobalPipes(new ValidationPipe());

  // @ts-ignore
  BigInt.prototype.toJSON = function () {
    return this.toString();
  };

  app.enableCors({
    origin: (origin = '', callback) => {
      if (config.get('NODE_ENV') === 'development') {
        callback(null, true);
        return;
      }
      if (whitelist.concat(originsStringFromEnv).indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed origin!'));
      }
    },
  });

  await app.listen(5000);
}
bootstrap();
