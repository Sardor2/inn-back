import { PartialType } from '@nestjs/mapped-types';
import { CreateRoomDto } from './create-room.dto';
import { RoomStatus } from '../constants';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateRoomDto extends PartialType(CreateRoomDto) {
  @IsOptional()
  @IsEnum(RoomStatus)
  status: RoomStatus;

  //   @IsOptional()
  //   @IsString()
  //   last_clean_date: string;

  //   @IsOptional()
  //   @IsEnum(CleanType)
  //   cleaned_type: CleanType;
}
