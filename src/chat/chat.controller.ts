import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
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

  @Get('messages/:chatId/:userId')
  async getMessages(
    @Param('chatId') chatId: string,
    @Param('userId') userId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number,
  ) {
    try {
      return await this.chatService.getMessages(chatId, userId, page, limit);
    } catch (error) {
      console.error(error);
      throw new HttpException(error.message, HttpStatus.FORBIDDEN);
    }
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
