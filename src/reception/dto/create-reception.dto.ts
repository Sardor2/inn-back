import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';

class AdminDto {
  @IsString()
  full_name: string;

  @IsString()
  @IsOptional()
  phone_number: string;
}

export class CreateReceptionDto {
  @IsArray()
  @ValidateNested()
  @Type(() => AdminDto)
  admins: AdminDto[];
}
