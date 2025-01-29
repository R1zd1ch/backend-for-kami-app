import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { GiftsService } from './gifts.service';
import { CreateGiftDto } from './dtos/create-gift.dto';
import { UpdateGiftDto } from './dtos/update-gift.dto';

@Controller('gifts')
export class GiftsController {
  constructor(private readonly giftsService: GiftsService) {}

  @Get(':userId')
  findAll(@Param('userId') userId: string) {
    return this.giftsService.findAll(userId);
  }

  @Get(':userId/categories')
  getUserCategories(@Param('userId') userId: string) {
    return this.giftsService.getUserCategories(userId);
  }

  @Get(':userId/analytics')
  getUserAnalytics(@Param('userId') userId: string) {
    return this.giftsService.getUserAnalytics(userId);
  }

  @Get(':userId/:id')
  findOne(@Param('userId') userId: string, @Param('id') id: string) {
    return this.giftsService.findOne(userId, id);
  }

  @Post(':userId')
  create(@Param('userId') userId: string, @Body() data: CreateGiftDto) {
    return this.giftsService.create(userId, data);
  }

  @Put(':userId/:id')
  update(
    @Param('userId') userId: string,
    @Param('id') id: string,
    @Body() data: UpdateGiftDto,
  ) {
    return this.giftsService.update(userId, id, data);
  }

  @Delete(':userId/:id')
  delete(@Param('userId') userId: string, @Param('id') id: string) {
    return this.giftsService.delete(userId, id);
  }
}
