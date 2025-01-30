import {
  BadRequestException,
  Controller,
  FileTypeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UploadImageService } from './upload-image.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { catchError, firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';

@Controller('upload-image')
export class UploadImageController {
  constructor(
    private readonly uploadImageService: UploadImageService,
    private readonly httpService: HttpService,
  ) {}

  @Post('/gifts')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: '.(png|jpg|jpeg)' })],
      }),
    )
    file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    console.log(file);

    try {
      const formData = new FormData();
      formData.append('image', Buffer.from(file.buffer).toString('base64'));

      const { data: imageData } = await firstValueFrom(
        this.httpService
          .post(
            `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`,
            formData,
          )
          .pipe(
            catchError((error) => {
              console.log(error);
              throw new BadRequestException('Error uploading image');
            }),
          ),
      );

      return {
        url: imageData.data.display_url,
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Error uploading image');
    }
  }
}
