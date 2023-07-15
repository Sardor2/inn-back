import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreateHotelDto {
  @IsString()
  password: string;

  @IsString()
  region: string;

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
}
