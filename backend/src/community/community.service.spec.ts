import { Test, TestingModule } from '@nestjs/testing';
import { CommunityService } from './community.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { AlertType } from './dto/create-alert.dto';

describe('CommunityService', () => {
  let service: CommunityService;
  let prisma: PrismaService;

  const mockPrismaService = {
    communityAlert: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
    verification: {
      upsert: jest.fn(),
    },
    user: {
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommunityService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<CommunityService>(CommunityService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createAlert', () => {
    it('should create a new alert', async () => {
      const dto = {
        type: AlertType.DANGER,
        title: 'Test Alert',
        latitude: 37.9838,
        longitude: 23.7275,
        severity: 5,
      };
      const authorId = 'user-1';

      mockPrismaService.communityAlert.create.mockResolvedValue({ id: 'alert-1', ...dto, authorId });

      const result = await service.createAlert(authorId, dto);

      expect(prisma.communityAlert.create).toHaveBeenCalledWith({
        data: { ...dto, authorId },
        include: expect.any(Object),
      });
      expect(result.id).toEqual('alert-1');
    });
  });

  describe('verifyAlert', () => {
    it('should throw NotFoundException if alert does not exist', async () => {
      mockPrismaService.communityAlert.findUnique.mockResolvedValue(null);

      await expect(service.verifyAlert('user-1', 'invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should verify an alert and increment author trust score', async () => {
      const mockAlert = { id: 'alert-1', authorId: 'author-1' };
      mockPrismaService.communityAlert.findUnique.mockResolvedValue(mockAlert);
      mockPrismaService.verification.upsert.mockResolvedValue({ id: 'v1' });

      await service.verifyAlert('verifier-1', 'alert-1');

      expect(prisma.verification.upsert).toHaveBeenCalled();
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'author-1' },
        data: { trustScore: { increment: 1 } },
      });
    });
  });
});
