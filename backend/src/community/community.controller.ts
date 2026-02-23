import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { CommunityService } from './community.service';
import { CreateAlertDto } from './dto/create-alert.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('community')
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  @UseGuards(JwtAuthGuard)
  @Post('alerts')
  create(@Request() req: any, @Body() dto: CreateAlertDto) {
    return this.communityService.createAlert(req.user.userId, dto);
  }

  @Get('alerts')
  findAll() {
    return this.communityService.findAllAlerts();
  }

  @UseGuards(JwtAuthGuard)
  @Post('alerts/:id/verify')
  verify(@Request() req: any, @Param('id') alertId: string) {
    return this.communityService.verifyAlert(req.user.userId, alertId);
  }
}
