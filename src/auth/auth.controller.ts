import { Body, Controller, Post } from '@nestjs/common';
import { Public } from './decorators/is-public';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';

@Public()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-in')
  signIn(@Body() dto: SignInDto) {
    return this.authService.signIn(dto);
  }
}
