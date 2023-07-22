import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Put,
} from '@nestjs/common';
import { HotelsService } from './hotels.service';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { UpdateHotelDto } from './dto/update-hotel.dto';
import { isAdmin } from 'src/auth/decorators/is-admin';
import { GetUser } from 'src/auth/decorators/get-user';
import { ActiveControlDto } from './dto/active-control.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Controller('hotels')
export class HotelsController {
  constructor(private readonly hotelsService: HotelsService) {}

  @Post()
  create(@Body() createHotelDto: CreateHotelDto) {
    return this.hotelsService.create(createHotelDto);
  }

  @isAdmin()
  @Get()
  findAll(@Query() query) {
    return this.hotelsService.findAll(query);
  }

  @isAdmin()
  @Post('active-control')
  activeControl(@Body() dto: ActiveControlDto) {
    return this.hotelsService.activeControl(dto);
  }

  @Get('/me')
  findOne(@GetUser('sub') id: string) {
    return this.hotelsService.findOne(id);
  }

  @Put('/update-password')
  updatePass(@GetUser('sub') id: string, @Body() dto: UpdatePasswordDto) {
    return this.hotelsService.updatePassword(+id, dto);
  }

  @Patch('edit')
  update(@GetUser('sub') id: string, @Body() updateHotelDto: UpdateHotelDto) {
    return this.hotelsService.update(+id, updateHotelDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.hotelsService.remove(+id);
  }
}
