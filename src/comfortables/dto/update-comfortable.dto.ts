import { PartialType } from '@nestjs/mapped-types';
import { CreateComfortableDto } from './create-comfortable.dto';

export class UpdateComfortableDto extends PartialType(CreateComfortableDto) {}
