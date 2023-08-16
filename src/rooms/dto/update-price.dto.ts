import { PickType } from '@nestjs/mapped-types';
import { IsArray, IsObject } from 'class-validator';
import { RoomDto } from 'src/hotels/dto/create-hotel.dto';

class RoomWithPriceDto extends PickType(RoomDto, ['price']) {}

export class UpdateRoomPricesDto {
  @IsObject()
  rooms: Record<string, RoomWithPriceDto>;
}
