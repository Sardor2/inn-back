import { IsString } from 'class-validator';

export class UpdatePasswordDto {
  @IsString()
  new_password: string;

  @IsString()
  old_password: string;
}
