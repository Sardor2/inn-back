import { Injectable } from '@nestjs/common';
import { CreateReceptionDto } from './dto/create-reception.dto';
import { UpdateReceptionDto } from './dto/update-reception.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ReceptionService {
  constructor(private prisma: PrismaService) {}

  create({ admins }: CreateReceptionDto, hotel_id: number) {
    return this.prisma.reception_admins.createMany({
      data: admins.map(({ full_name, phone_number }) => ({
        full_name,
        phone_number,
        hotel_id,
      })),
    });
  }

  async findAll({ search }, hotel_id: number) {
    let where = {};

    if (search) {
      where = Object.assign(where, {
        full_name: {
          contains: search,
        },
      });
    }
    return {
      results: await this.prisma.reception_admins.findMany({
        where: {
          ...where,
          hotel_id,
        },
      }),
    };
  }

  async update(id: number, updateReceptionDto: UpdateReceptionDto) {
    await this.prisma.reception_admins.update({
      where: {
        id,
      },
      data: updateReceptionDto,
    });

    return {
      message: 'Updated',
    };
  }

  remove(id: number) {
    return this.prisma.reception_admins.delete({
      where: {
        id,
      },
    });
  }
}
