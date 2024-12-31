import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignupDto } from './dtos/signup.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dtos/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signup(signupDto: SignupDto) {
    const { email, username, password } = signupDto;
    const IsUsernameUse = await this.prisma.user.findUnique({
      where: {
        username,
      },
    });
    const IsEmailUse = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (IsEmailUse) {
      throw new BadRequestException('Email already exists');
    }

    if (IsUsernameUse) {
      throw new BadRequestException('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await this.prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
      },
    });
    return {
      message: 'User created successfully',
      email,
      username,
      hashedPassword,
    };
  }

  async login(credentials: LoginDto) {
    const { email, username, password } = credentials;

    const user = await this.prisma.user.findUnique({
      where: email ? { email } : { username },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateToken(user.id);
    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      userId: user.id,
    };
  }

  async generateToken(userId) {
    const accessToken = this.jwtService.sign(
      { userId },
      {
        expiresIn: this.configService.get('jwt.expiresIn'),
        secret: this.configService.get('jwt.secret'),
      },
    );

    const refreshToken = uuidv4();

    await this.storeRefreshToken(refreshToken, userId);

    return {
      accessToken,
      refreshToken,
    };
  }

  async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ) {
    //Find User by id
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    //User exists?
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    //compare old password with password in db
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

    //if password is not valid
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    //hash new password
    const newHashedPassword = await bcrypt.hash(newPassword, 10);

    //update password
    user.password = newHashedPassword;
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password: newHashedPassword,
      },
    });
    return {
      message: 'Password changed successfully',
    };
  }

  async refreshToken(refreshToken: string) {
    const token = await this.prisma.refreshToken.findUnique({
      where: {
        token: refreshToken,
        expiresAt: {
          gt: new Date(),
        },
      },
    });
    if (!token) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    //удаление токена после того как мы проверили его и создали новый
    await this.prisma.refreshToken.delete({
      where: {
        token: refreshToken,
      },
    });

    return this.generateToken(token.userId);
  }

  async storeRefreshToken(token: string, userId) {
    await this.prisma.refreshToken.upsert({
      where: {
        userId,
      },
      create: {
        token,
        userId,
        expiresAt: new Date(new Date().setDate(new Date().getDate() + 3)),
      },
      update: {
        token,
      },
    });
  }
}
