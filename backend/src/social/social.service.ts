import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class SocialService {
  constructor(private readonly prisma: PrismaService) {}

  async createPost(authorId: string, dto: CreatePostDto) {
    return this.prisma.socialPost.create({
      data: {
        content: dto.content,
        imageUrl: dto.imageUrl,
        authorId,
      },
      include: {
        author: {
          select: { id: true, name: true, trustScore: true },
        },
        _count: {
          select: { comments: true },
        },
      },
    });
  }

  async getPosts() {
    return this.prisma.socialPost.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: { id: true, name: true, trustScore: true },
        },
        comments: {
          orderBy: { createdAt: 'asc' },
          include: {
            author: {
              select: { id: true, name: true, trustScore: true },
            },
          },
          take: 10,
        },
        _count: {
          select: { comments: true },
        },
      },
      take: 50,
    });
  }

  async addComment(postId: string, authorId: string, dto: CreateCommentDto) {
    const post = await this.prisma.socialPost.findUnique({ where: { id: postId } });
    if (!post) throw new NotFoundException('Post not found');

    return this.prisma.socialPostComment.create({
      data: {
        text: dto.text,
        postId,
        authorId,
      },
      include: {
        author: {
          select: { id: true, name: true, trustScore: true },
        },
      },
    });
  }
}
