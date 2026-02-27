import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UnauthorizedException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { SocialService } from './social.service';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';

const socialUploadsPath = join(process.cwd(), 'uploads', 'social');
const DEV_FALLBACK_USER_ID = 'cmlwsxc4o0000vlwc0ermhwj0';
if (!existsSync(socialUploadsPath)) mkdirSync(socialUploadsPath, { recursive: true });

@Controller('social')
export class SocialController {
  constructor(private readonly socialService: SocialService) {}

  private resolveUserId(req: any) {
    if (req?.user?.userId) return req.user.userId;
    if (process.env.NODE_ENV !== 'production') return DEV_FALLBACK_USER_ID;
    throw new UnauthorizedException('Authentication required');
  }

  @Post('uploads')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: socialUploadsPath,
        filename: (_req, file, cb) => cb(null, `social-${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname) || '.jpg'}`),
      }),
      fileFilter: (_req, file, cb) => cb(null, ['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.mimetype)),
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  uploadImage(@Request() req: any, @UploadedFile() file?: Express.Multer.File) {
    if (!file) throw new BadRequestException('Image file is required');
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    return { imageUrl: `${baseUrl}/uploads/social/${file.filename}`, filename: file.filename, size: file.size };
  }

  @Get('posts')
  getPosts(@Request() req: any) {
    const userId = req?.user?.userId || (process.env.NODE_ENV !== 'production' ? DEV_FALLBACK_USER_ID : undefined);
    return this.socialService.getPosts(userId);
  }

  @Post('posts')
  createPost(@Request() req: any, @Body() dto: CreatePostDto) {
    return this.socialService.createPost(this.resolveUserId(req), dto);
  }

  @Post('posts/:id/comments')
  addComment(@Request() req: any, @Param('id') postId: string, @Body() dto: CreateCommentDto) {
    return this.socialService.addComment(postId, this.resolveUserId(req), dto);
  }

  @Post('posts/:id/react')
  reactToPost(@Request() req: any, @Param('id') postId: string) {
    return this.socialService.toggleReaction(postId, this.resolveUserId(req));
  }

  @Post('posts/:id/report')
  reportPost(@Param('id') postId: string) {
    return this.socialService.reportPost(postId);
  }

  @Get('activity')
  getActivity(@Request() req: any) {
    return this.socialService.getActivity(this.resolveUserId(req));
  }

  @Post('activity/read-all')
  markActivityRead(@Request() req: any) {
    return this.socialService.markActivityRead(this.resolveUserId(req));
  }
}

