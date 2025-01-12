import { Module } from '@nestjs/common';
import { SidebarStateService } from './sidebar-state.service';
import { SidebarStateController } from './sidebar-state.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [PrismaModule],
  controllers: [SidebarStateController],
  providers: [SidebarStateService, JwtService],
})
export class SidebarStateModule {}
