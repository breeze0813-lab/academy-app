import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();
const prisma = new PrismaClient();

// 공지 생성
router.post('/', authenticate, async (req: Request, res: Response) => {
  try {
    const { title, content, academyId } = req.body;
    const user = (req as any).user;
    const notice = await prisma.notice.create({
      data: {
        title,
        content,
        academyId,
        authorId: user.id,
      },
      include: { author: { select: { name: true } } },
    });
    res.status(201).json(notice);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create notice' });
  }
});

// 학원별 공지 목록
router.get('/:academyId', authenticate, async (req: Request, res: Response) => {
  try {
    const { academyId } = req.params;
    const notices = await prisma.notice.findMany({
      where: { academyId },
      include: { author: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(notices);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notices' });
  }
});

// 공지 수정
router.put('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const notice = await prisma.notice.update({
      where: { id },
      data: { title, content },
    });
    res.json(notice);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update notice' });
  }
});

// 공지 삭제
router.delete('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.notice.delete({ where: { id } });
    res.json({ message: 'Notice deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete notice' });
  }
});

export default router;
