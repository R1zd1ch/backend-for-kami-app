import { Module } from '@nestjs/common';
import { GoogleBooksApiService } from './google-books-api.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [GoogleBooksApiService],
  exports: [HttpModule],
})
export class GoogleBooksApiModule {}
