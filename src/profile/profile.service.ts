import { Injectable } from '@nestjs/common';
// import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}
  async findAll() {
    return await this.prisma.user.findMany();
  }

  async findOne(id: string) {
    return await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: string, updateProfileDto: UpdateProfileDto) {
    return await this.prisma.user.update({
      where: {
        id,
      },
      data: updateProfileDto,
    });
  }

  async remove(id: string) {
    return await this.prisma.user.delete({
      where: {
        id,
      },
    });
  }

  async addPartner(id: string, partnerId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      return 'User not found';
    }

    const partner = await this.prisma.user.findUnique({
      where: {
        id: partnerId,
      },
    });

    if (!partner) {
      return 'Partner not found';
    }
    if (user.partnerId) {
      return 'You already have a partner';
    }

    await this.prisma.user.update({
      where: {
        id: partnerId,
      },
      data: {
        partnerId: id,
      },
    });
    await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        partnerId: partnerId,
      },
    });

    return 'Partner added';
  }

  async removePartner(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      return 'User not found';
    }

    if (!user.partnerId) {
      return 'You do not have a partner';
    }

    await this.prisma.user.update({
      where: {
        id: user.partnerId,
      },
      data: {
        partnerId: null,
      },
    });

    await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        partnerId: null,
      },
    });

    return 'Partner removed';
  }

  async getAllUsers() {
    const users = await this.prisma.user.findMany({});
    console.log('users', users);
    return users;
  }
}
