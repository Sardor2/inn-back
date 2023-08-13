import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMultipleRoomsDto, CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CleanType, RoomSortBy, RoomStatus, RoomType } from './constants';
import { isUndefined, omitBy } from 'lodash';

@Injectable()
export class RoomsService {
  constructor(private prisma: PrismaService) {}

  create(createRoomDto: CreateRoomDto, hotel_id: number) {
    const { active, area, photos, price, room_number, size, type } =
      createRoomDto;

    return this.prisma.rooms.create({
      data: {
        active,
        square: area.toString(),
        photo: photos[0],
        photo_second: photos[1],
        price: price.toString(),
        title: room_number.toString(),
        size,
        type,
        status: RoomStatus.AVAILABLE,
        hotel_id,
      },
    });
  }

  async createMultipleRooms(dto: CreateMultipleRoomsDto) {
    const { quantity, area, hotel_id, price, size, type } = dto;

    await this.prisma.rooms.createMany({
      data: Array(quantity)
        .fill(1)
        .map(() => ({
          size,
          hotel_id,
          price,
          square: area,
          type,
          status: RoomStatus.AVAILABLE,
        })),
    });

    return {
      message: 'Created',
    };
  }

  async findAll(id: number, filters: any) {
    const { type, activeControl, status, house_keeping, sortby, search } =
      filters;

    let where = {};

    if (type) {
      where = {
        ...where,
        type,
      };
    }
    if (activeControl === 'active' || activeControl === 'inactive') {
      where = {
        ...where,
        active: activeControl === 'active',
      };
    }
    if (status) {
      where = {
        ...where,
        status,
      };
    }

    if (house_keeping) {
      where = {
        ...where,
        OR: [
          {
            status: RoomStatus.NEEDS_CLEANING,
          },
          {
            status: RoomStatus.CLEANING,
          },
        ],
      };
    }

    if (sortby === RoomSortBy.new_created) {
      where = {
        ...where,
      };
    }

    if (search) {
      where = {
        ...where,
        title: {
          contains: search,
        },
      };
    }

    const rooms = await this.prisma.rooms.findMany({
      where: {
        hotel_id: id,

        ...where,
      },
      // orderBy: {
      //   created_at: 'asc',
      // },
    });

    return {
      results: rooms,
    };
  }

  async getCheckinCheckoutRooms() {
    const rooms = await this.prisma.rooms.findMany({
      where: {
        OR: [
          {
            status: RoomStatus.AVAILABLE,
          },
          {
            status: RoomStatus.KEEPING,
          },
        ],
      },
    });

    return {
      results: rooms,
    };
  }

  findOne(id: number) {
    return this.prisma.rooms.findUnique({
      where: {
        id,
      },
    });
  }

  update(id: number, updateRoomDto: UpdateRoomDto) {
    const {
      active,
      area,
      photos,
      price,
      room_number,
      size,
      type,
      status,
      // cleaned_type,
      // last_clean_date,
    } = updateRoomDto;

    let data: any = {
      active,
      square: area?.toString(),
      photo: photos?.[0],
      photo_second: photos?.[1],
      price: price?.toString(),
      title: room_number?.toString(),
      size,
      type,
      status,
      // cleaned: last_clean_date,
      // cleaned_type,
    };

    data = omitBy(data, isUndefined);

    return this.prisma.rooms.update({
      where: {
        id,
      },
      data,
    });
  }

  getCleaningTypes() {
    return {
      results: Object.values(CleanType),
    };
  }

  getRoomStatuses() {
    return {
      results: Object.values(RoomStatus),
    };
  }

  getRoomTypes() {
    return {
      results: Object.values(RoomType),
    };
  }

  async remove(id: number) {
    await this.prisma.rooms.delete({
      where: {
        id,
      },
    });

    return {
      message: 'Removed',
    };
  }
}
