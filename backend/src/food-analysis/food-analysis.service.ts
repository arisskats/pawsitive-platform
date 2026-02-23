import {
  BadGatewayException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { promises as fs } from 'fs';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

type FoodAnalysisResult = {
  ingredients: string[];
  harmfulAdditives: string[];
  healthRating: number;
  summary: string;
  confidenceScore: number;
  toxicAlert: boolean;
};

@Injectable()
export class FoodAnalysisService {
  constructor(private readonly prisma: PrismaService) {}

  async analyzeAndSave(petId: string, file: Express.Multer.File) {
    const pet = await this.prisma.pet.findUnique({ where: { id: petId } });
    if (!pet) {
      throw new NotFoundException(`Pet with ID ${petId} not found`);
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new InternalServerErrorException('GEMINI_API_KEY is not configured');
    }

    const imageBuffer = await fs.readFile(file.path);
    const imageBase64 = imageBuffer.toString('base64');

    const client = new GoogleGenerativeAI(apiKey);
    const model = client.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
    const prompt =
      'Analyze this pet food label image and return strict JSON only. ' +
      'Schema: {"ingredients": string[], "harmfulAdditives": string[], "healthRating": number (1-10), "summary": string, "confidenceScore": number (0-100), "toxicAlert": boolean}. ' +
      'Identify if any ingredient is strictly toxic for pets (e.g. xylitol, chocolate, onion). ' +
      'The confidenceScore should reflect how readable the image is. ' +
      'Use concise ingredient names and a practical summary.';

    try {
      const response = await model.generateContent({
        contents: [
          {
            role: 'user',
            parts: [
              { text: prompt },
              {
                inlineData: {
                  data: imageBase64,
                  mimeType: file.mimetype,
                },
              },
            ],
          },
        ],
      });

      const rawText = response.response.text();
      const parsedResult = this.parseAnalysisResult(rawText);
      const photoUrl = `/uploads/${file.filename}`;

      const analysis = await this.prisma.foodAnalysis.create({
        data: {
          petId,
          photoUrl,
          result: parsedResult as Prisma.InputJsonValue,
        },
      });

      return {
        id: analysis.id,
        petId: analysis.petId,
        photoUrl: analysis.photoUrl,
        result: analysis.result,
        createdAt: analysis.createdAt,
      };
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw new BadGatewayException('Gemini analysis failed: ' + error.message);
    }
  }

  private parseAnalysisResult(content: string): FoodAnalysisResult {
    const cleaned = this.extractJson(content);

    try {
      const parsed = JSON.parse(cleaned) as Partial<FoodAnalysisResult>;

      const ingredients = Array.isArray(parsed.ingredients)
        ? parsed.ingredients.map((x) => String(x))
        : [];
      const harmfulAdditives = Array.isArray(parsed.harmfulAdditives)
        ? parsed.harmfulAdditives.map((x) => String(x))
        : [];
      const summary = parsed.summary ? String(parsed.summary) : '';

      const rawRating = Number(parsed.healthRating);
      const healthRating = Number.isFinite(rawRating)
        ? Math.min(10, Math.max(1, Math.round(rawRating)))
        : 1;

      const confidenceScore = Number.isFinite(Number(parsed.confidenceScore))
        ? Math.min(100, Math.max(0, Math.round(Number(parsed.confidenceScore))))
        : 0;

      const toxicAlert = !!parsed.toxicAlert;

      return { ingredients, harmfulAdditives, healthRating, summary, confidenceScore, toxicAlert };
    } catch {
      throw new BadGatewayException('Failed to parse Gemini analysis response');
    }
  }

  private extractJson(content: string): string {
    const fencedMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    if (fencedMatch?.[1]) {
      return fencedMatch[1];
    }

    const firstBrace = content.indexOf('{');
    const lastBrace = content.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      return content.slice(firstBrace, lastBrace + 1);
    }

    throw new BadGatewayException('Gemini response did not include JSON');
  }
}
