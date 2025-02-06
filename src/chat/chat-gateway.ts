import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Logger } from '@nestjs/common';

@WebSocketGateway(3005, { cors: { origin: '*' } })
export class ChatGateway {
  constructor(
    private readonly chatService: ChatService,
    private readonly prisma: PrismaService,
  ) {}

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('ChatGateway');

  handleConnection(client: Socket) {
    const userId = client.handshake.headers.userid as string;
    this.logger.log(`Client connected: ${userId}`);
    client.join(`user-${userId}`);
    this.chatService.getUserChats(userId).then((chats) => {
      chats.forEach((chat) => {
        client.join(`chat-${chat.id}`);

        console.log(chat);
      });
    });
  }

  handleDisconnect(client: Socket) {
    const userId = client.handshake.headers.userid as string;
    this.logger.log(`Client disconnected: ${userId}`);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() data: { chatId: string; content: string; userId: string },
  ) {
    console.log('data', data);
    const chat = await this.prisma.chat.findUnique({
      where: {
        id: data.chatId,
      },
    });

    if (!chat) {
      throw new Error('Чат не найден');
    }

    if (chat.type === 'private') {
      const participants = await this.prisma.chatParticipants.findMany({
        where: {
          chatId: data.chatId,
        },
      });

      if (!participants.some((p) => p.userId === data.userId)) {
        throw new Error('Нет доступа к чату');
      }
    }

    console.log('data', data);
    const message = await this.chatService.sendMessage(
      data.userId,
      data.chatId,
      data.content,
    );

    console.log('message', message);

    this.server.to(`chat-${data.chatId}`).emit('newMessage', message);
  }

  @SubscribeMessage('addToGroup')
  async handleAddToGroup(
    @MessageBody() data: { chatId: string; userIds: string[]; userId: string },
  ) {
    const checkChat = await this.prisma.chat.findUnique({
      where: { id: data.chatId },
    });

    if (checkChat?.type !== 'group') {
      throw new Error('Действие доступно только для групповых чатов');
    }
    const chat = await this.chatService.addParticipants(
      data.chatId,
      data.userId,
      data.userIds,
    );

    this.server.to(`chat-${data.chatId}`).emit('groupUpdated', chat);
    console.log('groupUpdated', chat);
    data.userIds.forEach((userId) => {
      this.server.to(`user-${userId}`).emit('addedToGroup', chat);
    });

    this.server
      .in(data.userIds.map((id) => `user-${id}`))
      .socketsJoin(`chat-${data.chatId}`);
  }

  @SubscribeMessage('createPrivateChat')
  async handleCreatePrivateChat(
    @MessageBody() data: { userId1: string; userId2: string },
  ) {
    console.log('privateChat', data);
    try {
      const chat = await this.chatService.createPrivateChat(
        data.userId1,
        data.userId2,
      );
      console.log('NewChat', chat);

      this.server.to(`user-${data.userId1}`).emit('chatCreated', chat);
      this.server.to(`user-${data.userId2}`).emit('chatCreated', chat);
      return chat;
    } catch (error) {
      console.log(error);
    }
  }

  @SubscribeMessage('createGroupChat')
  async handleCreateGroupChat(
    @MessageBody()
    data: {
      userId: string;
      chatName: string;
      userIds: string[];
    },
  ) {
    try {
      console.log(data);
      const uniqueUserIds = [...new Set([data.userId, ...data.userIds])];
      const chat = await this.chatService.createGroupChat(
        data.userId,
        data.chatName,
        data.userIds,
      );

      this.server
        .to(uniqueUserIds.map((id) => `user-${id}`))
        .emit('chatCreated', chat);

      uniqueUserIds.forEach((userId) => {
        this.server.to(`user-${userId}`).emit('chatCreated', chat);
      });
      return chat;
    } catch (error) {
      console.log(error);
    }
  }
}
