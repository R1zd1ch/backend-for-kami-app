import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { PrismaService } from 'src/prisma/prisma.service';

@WebSocketGateway(3005, {})
export class ChatGateway {
  constructor(
    private readonly chatService: ChatService,
    private readonly prisma: PrismaService,
  ) {}

  @WebSocketServer() server: Server;

  handleConnection(client: Socket) {
    const userId = client.handshake.headers.userid as string;
    this.chatService.getUserChats(userId).then((chats) => {
      console.log(userId);
      chats.forEach((chat) => {
        client.join(`chat-${chat.id}`);
        console.log(chat);
      });
    });
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() data: { chatId: string; content: string; userId: string },
  ) {
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

    data.userIds.forEach((userId) => {
      this.server.to(`user-${userId}`).emit('addedToGroup', chat);
    });

    this.server
      .in(data.userIds.map((id) => `user-${id}`))
      .socketsJoin(`chat-${data.chatId}`);
  }
}
