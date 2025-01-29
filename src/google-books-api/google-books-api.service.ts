import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class GoogleBooksApiService {
  private readonly API_URL = 'https://www.googleapis.com/books/v1/volumes';
  private readonly API_KEY = process.env.GOOGLE_API_KEY;

  constructor(private readonly httpService: HttpService) {}

  async searchBooks(query: string, maxResults = 5) {
    const params = {
      q: query,
      maxResults,
      langRestrict: 'ru',
      key: this.API_KEY,
    };

    const { data } = await firstValueFrom(
      this.httpService.get(this.API_URL, { params }),
    );

    return this.transformResponse(data.items || []);
  }

  private transformResponse(items: any[]) {
    console.log(items[0]);
    return items.map((item) => ({
      externalId: item.id,
      title: item.volumeInfo.title,
      authors: item.volumeInfo.authors || [],
      description: item.volumeInfo.description,
      coverUrl: item.volumeInfo.imageLinks?.thumbnail,
      publishedDate: item.volumeInfo.publishedDate,
      isbn: this.extractIsbn(item.volumeInfo.industryIdentifiers),
      pages: item.volumeInfo.pageCount,
      categories: item.volumeInfo.categories || [],
    }));
  }

  private extractIsbn(identifiers: any[]) {
    return identifiers?.find((id) => id.type === 'ISBN_13')?.identifier || null;
  }
}
