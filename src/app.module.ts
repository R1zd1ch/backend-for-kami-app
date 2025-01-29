import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProfileService } from './profile/profile.service';
import { ProfileModule } from './profile/profile.module';
import { PartnerModule } from './partner/partner.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ChatModule } from './chat/chat.module';
import { TasksModule } from './tasks/tasks.module';
import { SidebarStateModule } from './sidebar-state/sidebar-state.module';
import { NotesModule } from './notes/notes.module';
import { MoodModule } from './mood/mood.module';
import { MoodSummaryModule } from './mood-summary/mood-summary.module';
import { BooksModule } from './books/books.module';
import { GoogleBooksApiModule } from './google-books-api/google-books-api.module';
import { GiftsModule } from './gifts/gifts.module';
import { UploadImageModule } from './upload-image/upload-image.module';
import configuration from './config/config';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [configuration],
    }),
    HttpModule,
    NotificationsModule,
    PrismaModule,
    AuthModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
        signOptions: {
          expiresIn: configService.get<string>('jwt.expiresIn'),
        },
      }),
      global: true,
      inject: [ConfigService],
    }),
    ProfileModule,
    PartnerModule,
    ChatModule,
    TasksModule,
    SidebarStateModule,
    NotesModule,
    MoodModule,
    MoodSummaryModule,
    BooksModule,
    GoogleBooksApiModule,
    GiftsModule,
    UploadImageModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, ProfileService],
})
export class AppModule {}
