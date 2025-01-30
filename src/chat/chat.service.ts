import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async createPrivateChat(userId1: string, userId2: string) {
    const [existingUser1, existingUser2, existingChat] =
      await this.prisma.$transaction([
        this.prisma.user.findUnique({ where: { id: userId1 } }),
        this.prisma.user.findUnique({ where: { id: userId2 } }),
        this.prisma.chat.findFirst({
          where: {
            type: 'private',
            participants: {
              some: {
                userId: {
                  in: [userId1, userId2],
                },
              },
            },
          },
        }),
      ]);
    if (!existingUser1) {
      throw new Error('User 1 not found');
    }

    if (!existingUser2) {
      throw new Error('User 2 not found');
    }

    if (existingChat) {
      return existingChat;
    }

    return this.prisma.chat.create({
      data: {
        type: 'private',
        participants: {
          create: [{ userId: userId1 }, { userId: userId2 }],
        },
      },
    });
  }

  async createGroupChat(
    creatorId: string,
    name: string,
    userIds: string[] = [],
  ) {
    const existingChat = await this.prisma.chat.findFirst({
      where: {
        type: 'group',
        name,
      },
    });

    if (existingChat) {
      throw Error('Chat with this name already exists');
    }

    const uniqueUserIds = [...new Set([creatorId, ...userIds])];

    return this.prisma.chat.create({
      data: {
        type: 'group',
        name,
        participants: {
          create: uniqueUserIds.map((userId) => ({
            userId,
          })),
        },
      },
      include: {
        participants: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async sendMessage(senderId: string, chatId: string, content: string) {
    return this.prisma.message.create({
      data: {
        senderId,
        chatId,
        content,
      },
    });
  }

  async getUserChats(userId: string) {
    return this.prisma.chat.findMany({
      where: {
        participants: { some: { userId } },
      },
      include: {
        participants: {
          include: { user: true },
        },
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  async addParticipants(chatId: string, adderId: string, userIds: string[]) {
    const chat = await this.prisma.chat.findUnique({
      where: {
        id: chatId,
      },
      include: {
        participants: true,
      },
    });

    if (!chat || chat.type !== 'group') {
      throw new Error('Чат не найден или не является групповым');
    }

    const isAdderParticipant = chat.participants.some(
      (p) => p.userId === adderId,
    );

    if (!isAdderParticipant) {
      throw new Error('Пользователь не является участником чата');
    }

    return this.prisma.chat.update({
      where: {
        id: chatId,
      },
      data: {
        participants: {
          createMany: {
            data: userIds
              .filter((uId) => !chat.participants.some((p) => p.userId === uId))
              .map((uId) => ({ userId: uId })),
          },
        },
      },
    });
  }
}
