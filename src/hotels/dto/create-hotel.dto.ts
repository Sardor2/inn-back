import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNumber,
  IsObject,
  IsString,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Room } from 'src/rooms/entities/room.entity';

class Rooms {
  @IsNumber()
  single: number;

  @IsNumber()
  double: number;

  @IsNumber()
  triple: number;

  @IsNumber()
  family: number;

  @IsNumber()
  deluxe: number;

  @IsNumber()
  twin: number;
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
  main_photo: string;

  @IsString()
  contact_number: string;

  @IsObject()
  @ValidateNested()
  @Type(() => Room)
  rooms: Rooms;
}
