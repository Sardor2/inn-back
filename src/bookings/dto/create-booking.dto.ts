import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsPhoneNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { RoomType } from 'src/rooms/constants';

export class UserGuestDto {
  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsString()
  @IsOptional()
  phone_number: string;
}
export class CreateBookingDto {
  @IsNumberString()
  amount: string;

  @IsNumber()
  room_number: number;

  @IsNumber()
  room_id: number;

  @IsNumberString()
  paid: string;

  @IsEnum(RoomType)
  room_type: RoomType;

  @IsOptional()
  @IsString()
  notes: string;

  @IsString()
  start_date: string;

  @IsString()
  end_date: string;

  @IsString()
  admin: string;

  @IsNumber()
  children: number;

  @IsString()
  country: string;

  @IsArray()
  @ValidateNested()
  @ArrayMinSize(1)
  @Type(() => UserGuestDto)
  users: Array<UserGuestDto>;

  //   @IsNumber()
  //   debt:
  //   @IsString()
  //   pay_typ
}
