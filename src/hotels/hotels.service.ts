import { Injectable } from '@nestjs/common';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { UpdateHotelDto } from './dto/update-hotel.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ActiveControlDto } from './dto/active-control.dto';
import { exclude } from 'src/utils/exclude';
import { ROLES } from 'src/auth/auth.constants';

@Injectable()
export class HotelsService {
  constructor(private prisma: PrismaService) {}

  create(createHotelDto: CreateHotelDto) {
    return 'create';
  }

  async findAll(query: any) {
    const limit = +query.limit || 10;
    const page = +query.page || 1;

    const skip = page * limit - limit;
    const search = query.search;

    let whereQuery: any = {};

    if (search) {
      whereQuery = {
        ...whereQuery,
        OR: [
          {
            title_ru: {
              contains: search,
            },
          },
          {
            title_en: {
              contains: search,
            },
          },
          {
            title_uz: {
              contains: search,
            },
          },
          {
            address: {
              contains: search,
            },
          },
        ],
      };
    }

    if (
      query.accountStatus === 'active' ||
      query.accountStatus === 'inactive'
    ) {
      whereQuery = {
        ...whereQuery,
        active: query.accountStatus === 'active',
      };
    }

    let hotels = await this.prisma.hotels.findMany({
      skip,
      take: limit,
      where: whereQuery,
    });

    const hotelsNewData = await Promise.all(
      hotels.map(async (hotel) => {
        hotel = exclude(hotel, ['password', 'password_hash', 'auth_key']);
        if (hotel.region_id) {
          // @ts-ignore
          hotel.region = await this.prisma.regions.findFirst({
            where: {
              id: hotel.region_id,
            },
          });
        }
        return hotel;
      }),
    );

    const count = await this.prisma.hotels.count({
      where: whereQuery,
    });

    return {
      results: hotelsNewData,
      count,
    };
  }

  async findOne(id: string) {
    const hotel = await this.prisma.hotels.findUnique({
      where: {
        id: +id,
      },
    });

    return exclude(hotel, ['password', 'password_hash', 'role', 'auth_key']);
  }

  async activeControl(dto: ActiveControlDto) {
    await this.prisma.hotels.update({
      where: {
        id: dto.id,
      },
      data: {
        active: dto.active,
      },
    });
  }

  update(id: number, updateHotelDto: UpdateHotelDto) {
    return `This action updates a #${id} hotel`;
  }

  remove(id: number) {
    return `This action removes a #${id} hotel`;
  }
}
