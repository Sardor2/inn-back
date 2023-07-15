import { IsNotEmpty, IsString } from 'class-validator';

export class SignInDto {
  @IsString()
  email: string;

  @IsNotEmpty()
  password: string;
}
