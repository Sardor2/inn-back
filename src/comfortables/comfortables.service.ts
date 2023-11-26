import { Injectable } from '@nestjs/common';
import { CreateComfortableDto } from './dto/create-comfortable.dto';
import { UpdateComfortableDto } from './dto/update-comfortable.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ComfortablesService {
  constructor(private prisma: PrismaService) {}
  create({ title_ru, title_uz, title_en }: CreateComfortableDto) {
    return this.prisma.comfortables.create({
      data: {
        title_ru,
        title_uz,
        title_en,
      },
    });
  }

  async findAll(query) {
    let where = {};

    if (query.search) {
      where = {
        OR: [
          {
            title_uz: {
              contains: query.search,
            },
          },
          {
            title_ru: {
              contains: query.search,
            },
          },
        ],
      };
    }

    return {
      results: await this.prisma.comfortables.findMany({
        where,
      }),
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} comfortable`;
  }

  update(id: number, updateComfortableDto: UpdateComfortableDto) {
    return this.prisma.comfortables.update({
      where: {
        id,
      },
      data: updateComfortableDto,
    });
  }

  remove(id: number) {
    return this.prisma.comfortables.delete({
      where: {
        id,
      },
    });
  }
}
