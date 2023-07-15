import { Injectable } from '@nestjs/common';
import { CreateComfortableDto } from './dto/create-comfortable.dto';
import { UpdateComfortableDto } from './dto/update-comfortable.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ComfortablesService {
  constructor(private prisma: PrismaService) {}
  create(createComfortableDto: CreateComfortableDto) {
    return 'This action adds a new comfortable';
  }

  async findAll() {
    return {
      results: await this.prisma.comfortables.findMany(),
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} comfortable`;
  }

  update(id: number, updateComfortableDto: UpdateComfortableDto) {
    return `This action updates a #${id} comfortable`;
  }

  remove(id: number) {
    return `This action removes a #${id} comfortable`;
  }
}
