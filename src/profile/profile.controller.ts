import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  // Post,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AuthGuard } from 'src/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  findAll() {
    // return this.profileService.findAll();
    return 'This action returns all profile';
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.profileService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProfileDto: UpdateProfileDto) {
    return this.profileService.update(id, updateProfileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.profileService.remove(id);
  }

  // @Post(':id/partner')
  // addPartner(@Param('id') id: string, @Body('partnerId') partnerId: string) {
  //   return this.profileService.addPartner(id, partnerId);
  // }

  // @Post(':id/remove-partner')
  // removePartner(@Param('id') id: string) {
  //   return this.profileService.removePartner(id);
  // }
}
