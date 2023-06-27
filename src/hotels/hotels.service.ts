import { Injectable } from '@nestjs/common';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { UpdateHotelDto } from './dto/update-hotel.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class HotelsService {
  constructor(private prisma: PrismaService) {}

  create(createHotelDto: CreateHotelDto) {
    return 'create';
  }

  findAll() {
    return this.prisma.hotels.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} hotel`;
  }

  update(id: number, updateHotelDto: UpdateHotelDto) {
    return `This action updates a #${id} hotel`;
  }

  remove(id: number) {
    return `This action removes a #${id} hotel`;
  }
}
