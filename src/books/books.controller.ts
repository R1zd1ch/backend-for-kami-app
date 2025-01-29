// src/books/books.controller.ts
import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { GoogleBooksApiService } from 'src/google-books-api/google-books-api.service';
import { SearchBooksDto } from './dtos/search-book.dto';
import { CreateBookDto } from './dtos/create-book.dto';
import { UpdateBookDto } from './dtos/update-book.dto';

@Controller('books')
export class BooksController {
  constructor(
    private booksService: BooksService,
    private googleBooksService: GoogleBooksApiService,
  ) {}

  @Get('search')
  async searchBooks(@Query() dto: SearchBooksDto) {
    return this.googleBooksService.searchBooks(dto.query, +dto.limit);
  }

  @Post(':userId')
  async createBook(
    @Param('userId') userId: string,
    @Body() dto: CreateBookDto,
  ) {
    return this.booksService.createBook(userId, dto);
  }

  @Get(':userId')
  async getUserBooks(@Param('userId') userId: string) {
    return this.booksService.getUserBooks(userId);
  }

  @Put(':userId/:bookId')
  async updateBook(
    @Param('userId') userId: string,
    @Param('bookId') bookId: string,
    @Body() dto: UpdateBookDto,
  ) {
    return this.booksService.updateBook(userId, bookId, dto);
  }

  @Put(':userId/:bookId/favourites')
  async addToFavourites(
    @Param('userId') userId: string,
    @Param('bookId') bookId: string,
  ) {
    return this.booksService.addToFavourites(userId, bookId);
  }

  @Put(':userId/:bookId/unfavourites')
  async removeFromFavourites(
    @Param('userId') userId: string,
    @Param('bookId') bookId: string,
  ) {
    return this.booksService.removeFromFavourites(userId, bookId);
  }

  @Delete(':userId/:bookId')
  async deleteBook(
    @Param('userId') userId: string,
    @Param('bookId') bookId: string,
  ) {
    return this.booksService.deleteBook(userId, bookId);
  }
}
