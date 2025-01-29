import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}

  async createBook(userId: string, data: any) {
    console.log('data', data.externalId);
    const bookExists = await this.prisma.book.findFirst({
      where: {
        userId,
        externalId: data.externalId,
      },
    });

    if (bookExists) {
      return {
        message: 'Book already exists',
      };
    }

    return this.prisma.book.create({
      data: {
        ...data,
        userId,
        status: 'to-read',
        coverUrl: data.coverUrl ? data.coverUrl : null,
        authors: data.authors || [],
        categories: data.categories || [],
      },
    });
  }

  async getUserBooks(userId: string) {
    return this.prisma.book.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateBook(userId: string, bookId: string, data: any) {
    return await this.prisma.book.update({
      where: {
        id: bookId,
        userId,
      },
      data,
    });
  }

  async addToFavourites(userId: string, bookId: string) {
    return await this.prisma.book.update({
      where: {
        id: bookId,
        userId,
      },
      data: {
        isFavourite: true,
      },
    });
  }

  async removeFromFavourites(userId: string, bookId: string) {
    return await this.prisma.book.update({
      where: {
        id: bookId,
        userId,
      },
      data: {
        isFavourite: false,
      },
    });
  }

  async deleteBook(userId: string, bookId: string) {
    return await this.prisma.book.delete({
      where: {
        id: bookId,
        userId,
      },
    });
  }
}
