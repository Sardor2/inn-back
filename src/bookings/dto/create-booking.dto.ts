import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDecimal,
  IsEnum,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsPhoneNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { PaymentType } from 'src/reservations/constants';
import { RoomType } from 'src/rooms/constants';

export class UserGuestDto {
  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsString()
  @IsOptional()
  @IsPhoneNumber()
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

  @IsString()
  @IsOptional()
  agent: string;

  @IsEnum(PaymentType)
  pay_type: PaymentType;

  @IsNumber()
  tariff_plan_id: number;

  @IsString()
  @IsOptional()
  discount: string;
}
