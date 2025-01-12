import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotificationsGateway } from 'src/notifications/notifications.gateway';

@Injectable()
export class PartnerService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsGateway: NotificationsGateway, // Внедрение Gateway
  ) {}

  async sendPartnerRequest(userId: string, partnerId: string) {
    const [user, partner] = await Promise.all([
      this.prisma.user.findUnique({
        where: {
          id: userId,
        },
      }),
      this.prisma.user.findUnique({
        where: {
          id: partnerId,
        },
      }),
    ]);

    if (!user) {
      return 'User not found';
    }

    if (!partner) {
      return 'Partner not found';
    }
    if (user.partnerId) {
      return 'You already have a partner';
    }

    if (partner.partnerId) {
      return 'User already has a partner';
    }

    const existingRequest = await this.prisma.friendship.findFirst({
      where: {
        userId,
        friendId: partnerId,
      },
    });

    if (existingRequest) {
      return 'Request already sent';
    }

    const request = await this.prisma.friendship.create({
      data: {
        userId,
        friendId: partnerId,
        status: 'pending',
        type: 'partner',
      },
    });

    //TODO notify partner
    // this.notificationsGateway.sendNotification(
    //   partnerId,
    //   `${user.username} sent you a partner request.`,
    // );
    this.notificationsGateway.sendNotification(partnerId, {
      message: `${user.username} отправил(ла) вам запрос на пару`,
      user: user,
    });

    return request;
  }

  async acceptPartnerRequest(userId: string) {
    const request = await this.prisma.friendship.findFirst({
      where: {
        friendId: userId,
        status: 'pending',
      },
    });
    if (!request) {
      return 'Request not found';
    }
    await this.prisma.friendship.update({
      where: {
        id: request.id,
      },
      data: {
        status: 'accepted',
      },
    });

    const partner = await this.prisma.user.update({
      where: {
        id: request.userId,
      },
      data: {
        partnerId: userId,
      },
    });

    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        partnerId: request.userId,
      },
    });

    await this.prisma.friendship.delete({
      where: {
        id: request.id,
      },
    });
    //TODO notify user
    this.notificationsGateway.sendNotification(request.userId, {
      message: `Твой запрос на пару ${user.username} принят.`,
      user: user,
    });

    this.notificationsGateway.sendNotification(userId, {
      message: `Запрос на пару принят ${partner.username}.`,
      user: partner,
    });

    return 'Request accepted';
  }

  async removePartner(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return 'User not found';
    }

    if (!user.partnerId) {
      return 'User does not have a partner';
    }

    const partner = await this.prisma.user.update({
      where: {
        id: user.partnerId,
      },
      data: {
        partnerId: null,
      },
    });

    const user1 = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        partnerId: null,
      },
    });

    //TODO notify user
    this.notificationsGateway.sendNotification(userId, {
      message: `Вы завершили пару с ${partner.username}.`,
      user: user1,
    });

    this.notificationsGateway.sendNotification(partner.id, {
      message: `Ваш партнер ${user1.username} завершил пару.`,
      user: partner,
    });

    return 'Partner removed';
  }
}
