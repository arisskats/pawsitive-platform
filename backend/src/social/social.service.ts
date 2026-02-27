import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class SocialService {
  constructor(private readonly prisma: PrismaService) {}

  async createPost(authorId: string, dto: CreatePostDto) {
    return this.prisma.socialPost.create({
      data: { content: dto.content, imageUrl: dto.imageUrl, authorId },
      include: {
        author: { select: { id: true, name: true, trustScore: true } },
        _count: { select: { comments: true, reactions: true } },
      },
    });
  }

  async getPosts(userId?: string) {
    return this.prisma.socialPost.findMany({
      where: { isHidden: false },
      orderBy: { createdAt: 'desc' },
      include: {
        author: { select: { id: true, name: true, trustScore: true } },
        comments: {
          orderBy: { createdAt: 'asc' },
          include: { author: { select: { id: true, name: true, trustScore: true } } },
          take: 10,
        },
        reactions: userId ? { where: { userId }, select: { id: true }, take: 1 } : false,
        _count: { select: { comments: true, reactions: true } },
      },
      take: 50,
    });
  }

  async addComment(postId: string, authorId: string, dto: CreateCommentDto) {
    const post = await this.prisma.socialPost.findUnique({ where: { id: postId } });
    if (!post) throw new NotFoundException('Post not found');

    const comment = await this.prisma.socialPostComment.create({
      data: { text: dto.text, postId, authorId },
      include: { author: { select: { id: true, name: true, trustScore: true } } },
    });

    if (post.authorId !== authorId) {
      await this.prisma.socialActivity.create({ data: { recipientId: post.authorId, actorId: authorId, postId, type: 'COMMENT' } });
    }

    return comment;
  }

  async toggleReaction(postId: string, userId: string) {
    const post = await this.prisma.socialPost.findUnique({ where: { id: postId } });
    if (!post) throw new NotFoundException('Post not found');

    const existing = await this.prisma.socialPostReaction.findUnique({ where: { postId_userId: { postId, userId } } });

    if (existing) {
      await this.prisma.socialPostReaction.delete({ where: { id: existing.id } });
      return { liked: false };
    }

    await this.prisma.socialPostReaction.create({ data: { postId, userId } });
    if (post.authorId !== userId) {
      await this.prisma.socialActivity.create({ data: { recipientId: post.authorId, actorId: userId, postId, type: 'REACTION' } });
    }
    return { liked: true };
  }

  async reportPost(postId: string) {
    const post = await this.prisma.socialPost.findUnique({ where: { id: postId } });
    if (!post) throw new NotFoundException('Post not found');

    const nextCount = post.reportCount + 1;
    const updated = await this.prisma.socialPost.update({
      where: { id: postId },
      data: { reportCount: nextCount, isHidden: nextCount >= 3 ? true : post.isHidden },
      select: { id: true, reportCount: true, isHidden: true },
    });

    return updated;
  }

  async getActivity(userId: string) {
    const [items, unread] = await Promise.all([
      this.prisma.socialActivity.findMany({
        where: { recipientId: userId },
        orderBy: { createdAt: 'desc' },
        include: { actor: { select: { id: true, name: true, trustScore: true } }, post: { select: { id: true, content: true } } },
        take: 20,
      }),
      this.prisma.socialActivity.count({ where: { recipientId: userId, isRead: false } }),
    ]);
    return { unread, items };
  }

  async markActivityRead(userId: string) {
    await this.prisma.socialActivity.updateMany({ where: { recipientId: userId, isRead: false }, data: { isRead: true } });
    return { ok: true };
  }
}
