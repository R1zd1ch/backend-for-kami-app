import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { GoogleBooksApiModule } from 'src/google-books-api/google-books-api.module';
import { GoogleBooksApiService } from 'src/google-books-api/google-books-api.service';

@Module({
  imports: [PrismaModule, GoogleBooksApiModule],
  controllers: [BooksController],
  providers: [BooksService, GoogleBooksApiService],
})
export class BooksModule {}
