import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ComfortablesService } from './comfortables.service';
import { CreateComfortableDto } from './dto/create-comfortable.dto';
import { UpdateComfortableDto } from './dto/update-comfortable.dto';

@Controller('comfortables')
export class ComfortablesController {
  constructor(private readonly comfortablesService: ComfortablesService) {}

  @Post()
  create(@Body() createComfortableDto: CreateComfortableDto) {
    return this.comfortablesService.create(createComfortableDto);
  }

  @Get()
  findAll() {
    return this.comfortablesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.comfortablesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateComfortableDto: UpdateComfortableDto) {
    return this.comfortablesService.update(+id, updateComfortableDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.comfortablesService.remove(+id);
  }
}
