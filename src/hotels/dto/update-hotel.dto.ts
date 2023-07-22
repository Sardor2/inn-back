import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateHotelDto } from './create-hotel.dto';

export class UpdateHotelDto extends PartialType(
  OmitType(CreateHotelDto, ['active']),
) {}
