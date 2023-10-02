import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { RoomType } from 'src/rooms/constants';
import { PaymentType } from '../constants';
export class CreateReservationDto {
  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsPhoneNumber()
  phone_number: string;

  @IsNumber()
  amount: number;

  @IsNumber()
  room_id: number;

  @IsString()
  room_number: string;

  @IsBoolean()
  paid: boolean;

  @IsEnum(RoomType)
  room_type: RoomType;

  @IsOptional()
  @IsString()
  extra_information: string;

  @IsString()
  start_date: string;

  @IsString()
  end_date: string;

  @IsNumber()
  children: number;

  @IsString()
  country: string;

  @IsEnum(PaymentType)
  pay_type: PaymentType;

  @IsString()
  @IsOptional()
  agent: string;
}
