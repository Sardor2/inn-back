import { PrismaClient } from '@prisma/client';
import { RoomStatus } from './rooms/constants';

const prisma = new PrismaClient();

async function roomStatusSeedDefault() {
  await prisma.rooms.updateMany({
    data: {
      status: RoomStatus.AVAILABLE,
    },
  });
}
