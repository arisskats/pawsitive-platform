import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAlertDto } from './dto/create-alert.dto';

@Injectable()
export class CommunityService {
  constructor(private readonly prisma: PrismaService) {}

  async createAlert(authorId: string, dto: CreateAlertDto) {
    return this.prisma.communityAlert.create({
      data: {
        ...dto,
        authorId,
      },
      include: {
        author: {
          select: {
            name: true,
            trustScore: true,
          },
        },
      },
    });
  }

  async findAllAlerts() {
    return this.prisma.communityAlert.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            name: true,
            trustScore: true,
          },
        },
        _count: {
          select: { verifications: true },
        },
      },
    });
  }

  async verifyAlert(userId: string, alertId: string) {
    const alert = await this.prisma.communityAlert.findUnique({
      where: { id: alertId },
    });

    if (!alert) {
      throw new NotFoundException('Alert not found');
    }

    // Create verification and update user trust score logic
    const verification = await this.prisma.verification.upsert({
      where: {
        userId_alertId: { userId, alertId },
      },
      update: { isValid: true },
      create: {
        userId,
        alertId,
        isValid: true,
      },
    });

    // Update author trust score (simple logic: +1 per verification)
    await this.prisma.user.update({
      where: { id: alert.authorId },
      data: { trustScore: { increment: 1 } },
    });

    return verification;
  }
}
