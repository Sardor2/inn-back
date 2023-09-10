import { IsDecimal, IsNumber } from 'class-validator';

export class ApplyDiscountDto {
  @IsDecimal()
  discount_amount: string;

  @IsNumber()
  booking_id: number;
}
