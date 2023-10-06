import { IsNumber } from 'class-validator';

export class CheckoutDto {
  @IsNumber()
  booking_id: number;

  @IsNumber()
  room_id: number;
}
