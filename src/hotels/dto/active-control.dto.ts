import { PartialType } from '@nestjs/mapped-types';
import { CreateHotelDto } from './create-hotel.dto';
import { IsBoolean, IsNumber } from 'class-validator';

export class ActiveControlDto {
  @IsNumber()
  id: number;

  @IsBoolean()
  active: boolean;
}
