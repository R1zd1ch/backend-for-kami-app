import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { PartnerService } from './partner.service';

@Controller('partner')
export class PartnerController {
  constructor(private readonly partnerService: PartnerService) {}

  @Post(':id/send-partner-request')
  async sendPartnerRequest(
    @Param('id') id: string,
    @Body('partnerId') partnerId: string,
  ) {
    return await this.partnerService.sendPartnerRequest(id, partnerId);
  }

  @Post(':id/accept-partner-request')
  async acceptPartnerRequest(@Param('id') id: string) {
    return await this.partnerService.acceptPartnerRequest(id);
  }

  @Delete(':id/remove-partner')
  async removePartner(@Param('id') id: string) {
    return await this.partnerService.removePartner(id);
  }
}
