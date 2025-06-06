import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
  IsString,
} from 'class-validator';
import { RoomStatus, RoomType } from '../constants';
import { PickType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';

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

export class PartialCreateRoomDto extends PickType(CreateRoomDto, [
  'area',
  'price',
  'type',
]) {}

export class CreateMultipleRoomsDto {
  @IsString()
  area: string;

  @IsNumber()
  quantity: number;

  @IsEnum(RoomType)
  type: RoomType;

  @IsString()
  price: string;

  @IsInt()
  size: number;

  @IsNumber()
  hotel_id: number;
}
