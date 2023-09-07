import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ReceptionService } from './reception.service';
import { CreateReceptionDto } from './dto/create-reception.dto';
import { UpdateReceptionDto } from './dto/update-reception.dto';

@Controller('reception')
export class ReceptionController {
  constructor(private readonly receptionService: ReceptionService) {}

  @Post()
  create(@Body() createReceptionDto: CreateReceptionDto) {
    return this.receptionService.create(createReceptionDto);
  }

  @Get()
  findAll(@Query() query: any) {
    return this.receptionService.findAll(query);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateReceptionDto: UpdateReceptionDto,
  ) {
    return this.receptionService.update(+id, updateReceptionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.receptionService.remove(+id);
  }
}
