import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

// import { AuthModule } from 'src/auth/auth.module';
import {
  // JwtModule,
  JwtService,
} from '@nestjs/jwt';
// import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    PrismaModule,
    // AuthModule,
    // JwtModule.registerAsync({
    //   imports: [ConfigModule],
    //   useFactory: async (configService: ConfigService) => ({
    //     global: true,
    //     secret: configService.get<string>('jwt.secret'),
    //     signOptions: {
    //       expiresIn: configService.get<string>('jwt.expiresIn'),
    //     },
    //   }),
    //   inject: [ConfigService],
    // }),
  ],
  controllers: [ProfileController],
  providers: [ProfileService, JwtService],
})
export class ProfileModule {}
