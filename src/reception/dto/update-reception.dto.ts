import { IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class UpdateReceptionDto {
  @IsString()
  @IsOptional()
  full_name: string;

  @IsString()
  @IsOptional()
  @IsPhoneNumber()
  phone_number: string;
}
