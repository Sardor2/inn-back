import { IsDateString, IsDecimal, IsEnum, IsInt } from 'class-validator';
import { PaymentType } from 'src/reservations/constants';

export class CreatePaymentDto {
  @IsInt()
  booking_id: number;

  @IsEnum(PaymentType)
  pay_type: PaymentType;

  @IsDecimal()
  sum: string;
}
