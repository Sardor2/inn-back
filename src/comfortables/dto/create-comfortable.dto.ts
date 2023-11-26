import { IsString } from 'class-validator';

export class CreateComfortableDto {
  @IsString()
  title_uz: string;

  @IsString()
  title_ru: string;

  @IsString()
  title_en: string;
}
