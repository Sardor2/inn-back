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
import { GetUser } from 'src/auth/decorators/get-user';

@Controller('reception')
export class ReceptionController {
  constructor(private readonly receptionService: ReceptionService) {}

  @Post()
  create(
    @Body() createReceptionDto: CreateReceptionDto,
    @GetUser('sub') id: string,
  ) {
    return this.receptionService.create(createReceptionDto, +id);
  }

  @Get()
  findAll(@Query() query: any, @GetUser('sub') id: string) {
    return this.receptionService.findAll(query, +id);
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
