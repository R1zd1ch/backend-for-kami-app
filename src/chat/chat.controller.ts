import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get(':userId')
  async getUserChats(@Param('userId') userId: string) {
    return this.chatService.getUserChats(userId);
  }

  @Post('private/:userId1/:userId2')
  async createPrivateChat(
    @Param('userId1') userId1: string,
    @Param('userId2') userId2: string,
  ) {
    return this.chatService.createPrivateChat(userId1, userId2);
  }

  @Post('messages/:chatId/userId')
  async sendMessage(
    @Param('chatId') chatId: string,
    @Param('userId') userId: string,
    @Body() data: { content: string },
  ) {
    return this.chatService.sendMessage(userId, chatId, data.content);
  }

  @Post('group/:userId')
  async createGroupChat(
    @Param('userId') userId: string,
    @Body() data: { name: string; userIds: string[] },
  ) {
    return this.chatService.createGroupChat(userId, data.name, data.userIds);
  }

  @Post('participants/:chatId/:userId')
  async addParticipants(
    @Param('chatId') chatId: string,
    @Param('userId') userId: string,
    @Body() data: { userIds: string[] },
  ) {
    return this.chatService.addParticipants(chatId, userId, data.userIds);
  }
}
