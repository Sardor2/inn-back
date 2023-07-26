import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
  IsString,
} from 'class-validator';
import { RoomStatus, RoomType } from '../constants';

export class CreateRoomDto {
  @IsNumber()
  room_number: number;

  @IsEnum(RoomType)
  type: RoomType;

  @IsNumber()
  price: number;

  @IsNumber()
  size: number;

  @IsNumber()
  area: number;

  @IsBoolean()
  active: boolean;

  @IsArray()
  photos: string[];
}
