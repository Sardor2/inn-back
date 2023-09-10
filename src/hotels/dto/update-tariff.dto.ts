import { PartialType } from '@nestjs/mapped-types';
import { TariffDto } from './add-tariff.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateTariffDto extends PartialType(TariffDto) {
  @IsBoolean()
  @IsOptional()
  active: boolean;
}
