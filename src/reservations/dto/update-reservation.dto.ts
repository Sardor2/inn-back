import { PartialType } from '@nestjs/mapped-types';
import { CreateReservationDto } from './create-reservation.dto';

import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsPhoneNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { RoomType } from 'src/rooms/constants';
import { PaymentType } from '../constants';
import { Type } from 'class-transformer';

export class UserReservationDto {
  @IsNumber()
  id: number;

  @IsString()
  @IsOptional()
  first_name: string;

  @IsString()
  @IsOptional()
  last_name: string;

  @IsPhoneNumber()
  @IsOptional()
  phone_number: string;
}

export class UpdateReservationDto {
  @IsNumber()
  @IsOptional()
  amount: number;

  @IsObject()
  @ValidateNested()
  @IsOptional()
  @Type(() => UserReservationDto)
  user: UserReservationDto;

  @IsNumber()
  @IsOptional()
  room_id: number;

  @IsBoolean()
  @IsOptional()
  paid: boolean;

  @IsEnum(RoomType)
  @IsOptional()
  room_type: RoomType;

  @IsOptional()
  @IsString()
  extra_information: string;

  @IsString()
  @IsOptional()
  start_date: string;

  @IsString()
  @IsOptional()
  end_date: string;

  @IsNumber()
  @IsOptional()
  children: number;

  @IsString()
  @IsOptional()
  country: string;

  @IsEnum(PaymentType)
  @IsOptional()
  pay_type: PaymentType;

  @IsString()
  @IsOptional()
  agent: string;
}
