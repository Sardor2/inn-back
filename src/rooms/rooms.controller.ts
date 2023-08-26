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
import { RoomsService } from './rooms.service';
import { CreateMultipleRoomsDto, CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { GetUser } from 'src/auth/decorators/get-user';
import { UpdateRoomPricesDto } from './dto/update-price.dto';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  create(@Body() createRoomDto: CreateRoomDto, @GetUser('sub') id: string) {
    return this.roomsService.create(createRoomDto, +id);
  }

  @Get()
  findAll(@GetUser('sub') id: string, @Query() query: Record<string, any>) {
    return this.roomsService.findAll(+id, query);
  }

  @Get('types')
  getTypes() {
    return this.roomsService.getRoomTypes();
  }

  @Get('statuses')
  getStatuses() {
    return this.roomsService.getRoomStatuses();
  }

  @Get('cleaning-types')
  getCleaningTypes() {
    return this.roomsService.getCleaningTypes();
  }

  @Get('checkin-checkout')
  findCheckInCheckoutRooms() {
    return this.roomsService.getCheckinCheckoutRooms();
  }

  @Post('multiple')
  makeMultipleRooms(@Body() dto: CreateMultipleRoomsDto) {
    return this.roomsService.createMultipleRooms(dto);
  }

  @Put('update-room-prices')
  updateRoomPrices(
    @GetUser('sub') id: string,
    @Body() dto: UpdateRoomPricesDto,
  ) {
    return this.roomsService.updateRoomPrices(+id, dto);
  }

  @Get('prices')
  getRoomPrices(@GetUser('sub') id: string) {
    return this.roomsService.getRoomPrices(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
    return this.roomsService.update(+id, updateRoomDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomsService.remove(+id);
  }
}
