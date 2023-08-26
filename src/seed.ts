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

async function changeReservations() {
  await prisma.reservations.update({
    where: {
      id: 110,
    },
    data: {
      start_date: new Date().toISOString(),
      end_date: new Date('08-30-2023').toISOString(),
    },
  });
}

changeReservations();
