import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();
const prisma = new PrismaClient();

// 과제 생성
router.post('/', authenticate, async (req: Request, res: Response) => {
  try {
    const { title, description, dueDate, classId } = req.body;
    const assignment = await prisma.assignment.create({
      data: {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : null,
        classId,
      },
    });
    res.status(201).json(assignment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create assignment' });
  }
});

// 수업별 과제 목록
router.get('/class/:classId', authenticate, async (req: Request, res: Response) => {
  try {
    const { classId } = req.params;
    const assignments = await prisma.assignment.findMany({
      where: { classId },
      include: {
        submissions: {
          include: { student: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch assignments' });
  }
});

// 과제 제출
router.post('/:id/submit', authenticate, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { studentId, content, fileUrl } = req.body;
    const submission = await prisma.assignmentSubmission.upsert({
      where: {
        assignmentId_studentId: {
          assignmentId: id,
          studentId,
        },
      },
      update: { content, fileUrl, submittedAt: new Date() },
      create: {
        assignmentId: id,
        studentId,
        content,
        fileUrl,
      },
    });
    res.json(submission);
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit assignment' });
  }
});

// 과제 제출 목록 조회
router.get('/:id/submissions', authenticate, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const submissions = await prisma.assignmentSubmission.findMany({
      where: { assignmentId: id },
      include: { student: true },
    });
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

export default router;
