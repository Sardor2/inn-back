import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './guards/auth.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  providers: [
    AuthService,
    {
      useClass: AuthGuard,
      provide: APP_GUARD,
    },
  ],
  controllers: [AuthController],
  imports: [JwtModule.register({})],
})
export class AuthModule {}
