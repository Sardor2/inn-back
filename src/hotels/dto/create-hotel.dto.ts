import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNumber,
  IsObject,
  IsString,
  ValidateNested,
  IsOptional,
} from 'class-validator';

export class RoomDto {
  @IsNumber()
  quantity: number;

  @IsNumber()
  price: number;
}

class Rooms {
  @IsObject()
  @ValidateNested()
  @Type(() => RoomDto)
  single: RoomDto;

  @IsObject()
  @ValidateNested()
  @Type(() => RoomDto)
  double: RoomDto;

  @IsObject()
  @ValidateNested()
  @Type(() => RoomDto)
  triple: RoomDto;

  @IsObject()
  @ValidateNested()
  @Type(() => RoomDto)
  family: RoomDto;

  @IsObject()
  @ValidateNested()
  @Type(() => RoomDto)
  deluxe: RoomDto;

  @IsObject()
  @ValidateNested()
  @Type(() => RoomDto)
  twin: RoomDto;
}

export class CreateHotelDto {
  @IsString()
  title_uz: string;

  @IsString()
  title_ru: string;

  @IsString()
  title_en: string;

  @IsOptional()
  @IsString()
  info_uz: string;

  @IsOptional()
  @IsString()
  info_ru: string;

  @IsOptional()
  @IsString()
  info_en: string;

  @IsString()
  password: string;

  @IsNumber()
  region_id: number;

  @IsString()
  comfortables: string;

  @IsString()
  address: string;

  @IsNumber()
  rating: number;

  @IsBoolean()
  active: boolean;

  @IsOptional()
  @IsString()
  photos_room: string;

  @IsOptional()
  @IsString()
  photos_reception: string;

  @IsOptional()
  @IsString()
  photos_front: string;

  @IsOptional()
  @IsString()
  photos_bathroom: string;

  @IsOptional()
  @IsString()
  photos_breakfast: string;

  @IsOptional()
  @IsString()
  photos_other: string;

  @IsString()
  @IsOptional()
  main_photo: string;

  @IsString()
  contact_number: string;

  @IsObject()
  @ValidateNested()
  @Type(() => Rooms)
  rooms: Rooms;
}
