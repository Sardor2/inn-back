import { IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class UpdateReceptionDto {
  @IsString()
  @IsOptional()
  full_name: string;

  @IsString()
  @IsOptional()
  phone_number: string;
}
