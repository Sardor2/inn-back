import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateHotelDto {
  @IsString()
  title_uz: string;

  @IsString()
  title_ru: string;

  @IsString()
  title_en: string;

  @IsString()
  info_uz: string;

  @IsString()
  info_ru: string;

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

  @IsString()
  photos_room: string;

  @IsString()
  photos_reception: string;

  @IsString()
  photos_front: string;

  @IsString()
  photos_bathroom: string;

  @IsString()
  photos_breakfast: string;

  @IsString()
  photos_other: string;

  @IsString()
  main_photo: string;

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
