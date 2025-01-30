import { Module } from '@nestjs/common';
import { ChatGateway } from './chat-gateway';
import { ChatService } from './chat.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ChatController } from './chat.controller';

@Module({
  imports: [PrismaModule],
  providers: [ChatGateway, ChatService],
  exports: [ChatGateway],
  controllers: [ChatController],
})
export class ChatModule {}
