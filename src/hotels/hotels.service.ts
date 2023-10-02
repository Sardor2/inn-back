import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { UpdateHotelDto } from './dto/update-hotel.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ActiveControlDto } from './dto/active-control.dto';
import { exclude } from 'src/utils/exclude';
import { hash, verify } from 'argon2';
import { ROLES } from 'src/auth/auth.constants';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { AddTariffPlanDto } from './dto/add-tariff.dto';
import { UpdateTariffDto } from './dto/update-tariff.dto';
import { AddAgentsDto } from './dto/add-agents.dto';

@Injectable()
export class HotelsService {
  constructor(private prisma: PrismaService) {}

  async create(createHotelDto: CreateHotelDto) {
    const { password, location, ...otherData } = createHotelDto;
    const password_hash = await hash(password);

    const existingHotel = await this.prisma.hotels.findFirst({
      where: {
        email: otherData.email,
      },
    });

    if (existingHotel?.id) {
      throw new ForbiddenException('Email already exists!');
    }

    // const roomsPrices = {};

    // Object.entries(rooms).forEach(([name, val]) => {
    //   roomsPrices[name] = val.price;
    // });

    await this.prisma.hotels.create({
      data: {
        ...otherData,
        // ...roomsPrices,
        password_hash,
        password,
        role: ROLES.HOTEL_OWNER,
        latitude: location[0],
        longitude: location[1],
      },
    });

    // let transactions = [];
    // Object.entries(rooms).map(([room_type, { quantity, price }]) => {
    //   transactions.push(
    //     this.prisma.rooms.createMany({
    //       data: Array(quantity)
    //         .fill(room_type)
    //         .map(() => ({
    //           type: room_type,
    //           hotel_id: Number(hotel.id),
    //           price: String(price),
    //         })),
    //     }),
    //   );
    // });

    // await this.prisma.$transaction(transactions);

    return {
      message: 'Created Hotel!',
    };
  }

  async findAll(query: any, user_hotel_id: number) {
    const limit = +query.limit || 10;
    const page = +query.page || 1;

    const skip = page * limit - limit;
    const search = query.search;

    let whereQuery: any = {
      NOT: {
        id: user_hotel_id,
      },
    };

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
      where: whereQuery,
      skip,
      take: limit,
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

  async updatePassword(id: number, dto: UpdatePasswordDto) {
    const { old_password, new_password } = dto;
    const hotel = await this.prisma.hotels.findUnique({ where: { id } });
    const match = await verify(hotel.password_hash, old_password);
    if (!match) {
      throw new ForbiddenException('Passwords dont match');
    }
    await this.prisma.hotels.update({
      where: {
        id,
      },
      data: {
        password_hash: await hash(new_password),
        password: new_password,
      },
    });

    return {
      message: 'Udpated',
    };
  }

  async update(id: number, { location, ...dto }: UpdateHotelDto) {
    await this.prisma.hotels.update({
      where: {
        id,
      },
      data: {
        ...dto,
        latitude: location[0],
        longitude: location[1],
      },
    });

    return {
      message: 'Updated!',
    };
  }

  async getTariffPlans(hotel_id: number, filters: any = {}) {
    let where = {};
    if (!!filters.getActiveTariffs) {
      where = Object.assign(where, {
        active: !!filters.getActiveTariffs,
      });
    }
    return {
      results: await this.prisma.tariff_plans.findMany({
        where: {
          hotel_id,
          ...where,
        },
        select: {
          id: true,
          name: true,
          price: true,
          active: true,
        },
      }),
    };
  }

  async addTariffPlans(dto: AddTariffPlanDto, hotel_id: number) {
    await this.prisma.tariff_plans.createMany({
      data: dto.plans.map((plan) => ({
        hotel_id,
        price: plan.price,
        name: plan.name,
        active: true,
      })),
    });

    return {
      message: 'created!',
    };
  }

  async updateTariff(
    tariff_id: number,
    { name, price, active }: UpdateTariffDto,
  ) {
    let updateObject: any = {};

    if (typeof name === 'string') {
      updateObject.name = name;
    }
    if (typeof price === 'string') {
      updateObject.price = price;
    }

    if (typeof active === 'boolean') {
      updateObject.active = active;
    }

    await this.prisma.tariff_plans.update({
      where: {
        id: tariff_id,
      },
      data: updateObject,
    });

    return {
      message: 'Updated!',
    };
  }

  async addAgents({ agents }: AddAgentsDto, hotel_id: number) {
    await this.prisma.agents.createMany({
      data: agents.map((a) => ({ name: a.name, hotel_id })),
    });
    return {
      message: 'Added successfully!',
    };
  }

  async getAgents(hotel_id: number) {
    const agents = await this.prisma.agents.findMany({
      where: {
        hotel_id,
      },
    });

    return {
      results: agents,
    };
  }

  remove(id: number) {
    return `This action removes a #${id} hotel`;
  }

  async getClientsList({ search }) {
    return this.prisma.users.findMany({
      where: {},
    });
  }
}
