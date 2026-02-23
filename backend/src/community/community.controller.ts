import { Controller, Get, Post, Body, Param, Headers } from '@nestjs/common';
import { CommunityService } from './community.service';
import { CreateAlertDto } from './dto/create-alert.dto';

@Controller('community')
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  @Post('alerts')
  create(@Headers('x-user-id') userId: string, @Body() dto: CreateAlertDto) {
    // For now we get userId from headers since auth is not fully implemented
    return this.communityService.createAlert(userId, dto);
  }

  @Get('alerts')
  findAll() {
    return this.communityService.findAllAlerts();
  }

  @Post('alerts/:id/verify')
  verify(@Headers('x-user-id') userId: string, @Param('id') alertId: string) {
    return this.communityService.verifyAlert(userId, alertId);
  }
}
