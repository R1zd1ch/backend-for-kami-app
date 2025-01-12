import { Controller, Get, Param } from '@nestjs/common';
import { SidebarStateService } from './sidebar-state.service';

@Controller('sidebar-state')
export class SidebarStateController {
  constructor(private readonly sidebarStateService: SidebarStateService) {}
  @Get(':id')
  getSidebarState(@Param('id') id: string) {
    return this.sidebarStateService.getSidebarState(id);
  }
}
