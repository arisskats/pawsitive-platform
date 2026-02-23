import { Test, TestingModule } from '@nestjs/testing';
import { FoodAnalysisService } from './food-analysis.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';

jest.mock('@google/generative-ai');

describe('FoodAnalysisService', () => {
  let service: FoodAnalysisService;
  let prisma: PrismaService;

  const mockPrismaService = {
    pet: {
      findUnique: jest.fn(),
    },
    foodAnalysis: {
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FoodAnalysisService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<FoodAnalysisService>(FoodAnalysisService);
    prisma = module.get<PrismaService>(PrismaService);
    
    // Default API Key for tests
    process.env.GEMINI_API_KEY = 'test-key';
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('analyzeAndSave', () => {
    const mockFile = {
      path: 'test-path',
      mimetype: 'image/jpeg',
      filename: 'test-file.jpg',
    } as Express.Multer.File;

    it('should throw NotFoundException if pet does not exist', async () => {
      mockPrismaService.pet.findUnique.mockResolvedValue(null);

      await expect(service.analyzeAndSave('invalid-pet', mockFile)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw InternalServerErrorException if API key is missing', async () => {
      delete process.env.GEMINI_API_KEY;
      mockPrismaService.pet.findUnique.mockResolvedValue({ id: 'pet-1' });

      await expect(service.analyzeAndSave('pet-1', mockFile)).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should correctly parse AI response with new fields', () => {
      const mockAiContent = '```json {"ingredients": ["Meat"], "harmfulAdditives": [], "healthRating": 8, "summary": "Good", "confidenceScore": 95, "toxicAlert": false} ```';
      
      // Accessing private method for testing logic
      const result = (service as any).parseAnalysisResult(mockAiContent);

      expect(result).toEqual({
        ingredients: ['Meat'],
        harmfulAdditives: [],
        healthRating: 8,
        summary: 'Good',
        confidenceScore: 95,
        toxicAlert: false,
      });
    });

    it('should handle toxic alerts in parsing', () => {
      const mockAiContent = '{"ingredients": ["Onion"], "harmfulAdditives": [], "healthRating": 1, "summary": "Danger", "confidenceScore": 100, "toxicAlert": true}';
      
      const result = (service as any).parseAnalysisResult(mockAiContent);

      expect(result.toxicAlert).toBe(true);
      expect(result.healthRating).toBe(1);
    });
  });
});
