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
import { AddTariffPlanDto } from './dto/add-tariff.dto';
import { UpdateTariffDto } from './dto/update-tariff.dto';
import { AddAgentsDto } from './dto/add-agents.dto';

@Controller('hotels')
export class HotelsController {
  constructor(private readonly hotelsService: HotelsService) {}

  @Post()
  create(@Body() createHotelDto: CreateHotelDto) {
    return this.hotelsService.create(createHotelDto);
  }

  @isAdmin()
  @Get()
  findAll(@Query() query, @GetUser('sub') id: string) {
    return this.hotelsService.findAll(query, +id);
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

  @Post('add-tariff-plans')
  addTariffPlans(@GetUser('sub') id: string, @Body() dto: AddTariffPlanDto) {
    return this.hotelsService.addTariffPlans(dto, +id);
  }

  @Get('get-tariff-plans')
  getTariffPlans(@GetUser('sub') id: string, @Query() query: any) {
    return this.hotelsService.getTariffPlans(+id, query);
  }

  @Patch('tariff/:id')
  updateTariff(@Param('id') id: string, @Body() dto: UpdateTariffDto) {
    return this.hotelsService.updateTariff(+id, dto);
  }

  @Post('agents')
  addAgents(@Body() dto: AddAgentsDto, @GetUser('sub') id: string) {
    return this.hotelsService.addAgents(dto, +id);
  }

  @Get('agents')
  getAgents(@GetUser('sub') id: string) {
    return this.hotelsService.getAgents(+id);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.hotelsService.remove(+id);
  // }
}
