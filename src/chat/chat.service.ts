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
              every: {
                userId: {
                  in: [userId1, userId2],
                },
              },
            },
          },
          include: {
            participants: {
              include: { user: true },
            },
            messages: {
              take: 1,
              orderBy: { createdAt: 'desc' },
              include: {
                sender: {
                  select: {
                    username: true,
                  },
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
      include: {
        participants: {
          include: { user: true },
        },
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
          include: {
            sender: {
              select: {
                username: true,
              },
            },
          },
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
          include: { user: true },
        },
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
          include: {
            sender: {
              select: {
                username: true,
              },
            },
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
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
          },
        },
        seenBy: {
          select: {
            user: {
              select: {
                id: true,
                username: true,
                avatarUrl: true,
              },
            },
            seenAt: true,
          },
        },
      },
    });
  }

  async getUnreadMessagesCount(chatId: string, userId: string) {
    return this.prisma.message.count({
      where: {
        chatId,
        seenBy: {
          none: {
            userId,
          },
        },
        senderId: {
          not: userId,
        },
      },
    });
  }

  async getUserChats(userId: string) {
    const chats = this.prisma.chat.findMany({
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
          include: {
            sender: {
              select: {
                username: true,
              },
            },
          },
        },
      },
    });

    const chatsWithUnreadMessages = await Promise.all(
      (await chats).map(async (chat) => {
        const unreadMessagesCount = await this.getUnreadMessagesCount(
          chat.id,
          userId,
        );
        return { ...chat, unreadMessagesCount };
      }),
    );

    return chatsWithUnreadMessages;
  }

  async addParticipants(chatId: string, adderId: string, userIds: string[]) {
    console.log('bebraNewPart', chatId, adderId, userIds);
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
      include: {
        participants: {
          include: { user: true },
        },
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
          include: {
            sender: {
              select: {
                username: true,
              },
            },
          },
        },
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

  async getMessages(
    chatId: string,
    userId: string,
    page: number,
    limit: number,
  ) {
    const isParticipant = await this.prisma.chatParticipants.findFirst({
      where: {
        chatId,
        userId,
      },
    });

    if (!isParticipant) {
      throw new Error('Нет доступа к чату');
    }

    const [messages, total] = await this.prisma.$transaction([
      this.prisma.message.findMany({
        where: {
          chatId,
        },
        take: limit,
        skip: (page - 1) * limit,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          sender: {
            select: {
              id: true,
              username: true,
              avatarUrl: true,
            },
          },
          seenBy: {
            select: {
              user: {
                select: {
                  id: true,
                  username: true,
                  avatarUrl: true,
                },
              },
              seenAt: true,
            },
          },
        },
      }),
      this.prisma.message.count({
        where: {
          chatId,
        },
      }),
    ]);

    return {
      data: messages.reverse(),
      meta: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
      },
    };
  }

  async markMessagesAsSeen(
    chatId: string,
    userId: string,
    messageIds: string[],
  ) {
    const unseenMessages = await this.prisma.message.findMany({
      where: {
        chatId,
        id: {
          in: messageIds,
        },
        seenBy: {
          none: {
            userId,
          },
        },
      },
    });

    if (!unseenMessages.length) {
      return { updated: 0 };
    }

    const seenRecord = unseenMessages.map((m) => ({
      userId,
      messageId: m.id,
    }));

    await this.prisma.seenMessage.createMany({
      data: seenRecord,
      skipDuplicates: true,
    });

    const updatedRecords = await this.prisma.seenMessage.findMany({
      where: {
        messageId: {
          in: messageIds,
        },
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
          },
        },
      },
    });

    return {
      updated: unseenMessages.length,
      records: updatedRecords,
    };
  }
}
