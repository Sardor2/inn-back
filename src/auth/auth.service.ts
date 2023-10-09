import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { hash, verify } from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './types';
import { ROLES, Role } from './auth.constants';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async signIn(dto: any) {
    const { email, password } = dto;
    const hotelUser = await this.prisma.hotels.findFirst({
      where: {
        email,
      },
    });

    if (!hotelUser) {
      throw new NotFoundException('User not found');
    }

    const match = await verify(hotelUser.password_hash, password);
    if (!match) {
      throw new ForbiddenException('Password is incorrect');
    }
    const payload: JwtPayload = {
      sub: hotelUser.id.toString(),
      role: hotelUser.role as Role,
    };
    return {
      accessToken: await this.jwtService.signAsync(payload, {
        secret: this.config.get('JWT_SECRET'),
        expiresIn: this.config.get('NODE_ENV') === 'production' ? '2h' : '5h',
      }),
      isAdmin: hotelUser.role === ROLES.ADMIN,
    };
  }

  async makeHash(pass: any) {
    return {
      hash: await hash(pass),
    };
  }
}
