import { Module } from '@nestjs/common';
import { PartnerService } from './partner.service';
import { PartnerController } from './partner.controller';
import { JwtService } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';
import { NotificationsGateway } from 'src/notifications/notifications.gateway';

@Module({
  imports: [PrismaModule],
  controllers: [PartnerController],
  providers: [PartnerService, JwtService, NotificationsGateway],
})
export class PartnerModule {}
