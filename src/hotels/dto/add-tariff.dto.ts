import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDecimal,
  IsString,
  ValidateNested,
} from 'class-validator';

export class TariffDto {
  @IsString()
  name: string;

  @IsDecimal()
  price: string;
}

export class AddTariffPlanDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested()
  @Type(() => TariffDto)
  plans: Array<TariffDto>;
}
