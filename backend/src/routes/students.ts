import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, authorizeRoles, AuthRequest } from '../middleware/authMiddleware';

const router = Router();
const prisma = new PrismaClient();

// GET /api/students - 학원의 전체 학생 목록 조회
router.get('/', authenticate, authorizeRoles('ADMIN', 'TEACHER'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const academy = await prisma.academy.findUnique({ where: { ownerId: req.user!.id } });
    if (!academy) {
      res.status(404).json({ message: '학원 정보를 찾을 수 없습니다.' });
      return;
    }
    const students = await prisma.studentClass.findMany({
      where: { class: { academyId: academy.id } },
      include: {
        student: { select: { id: true, name: true, phone: true, email: true } },
        class: { select: { id: true, name: true, subject: true } }
      },
      distinct: ['studentId']
    });
    res.json(students);
  } catch {
    res.status(500).json({ message: '서버 오류' });
  }
});

// GET /api/students/:id - 학생 상세 조회
router.get('/:id', authenticate, authorizeRoles('ADMIN', 'TEACHER'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const studentId = parseInt(req.params.id);
    const student = await prisma.user.findUnique({
      where: { id: studentId },
      select: {
        id: true, name: true, phone: true, email: true, role: true, createdAt: true,
        studentClasses: {
          include: { class: { select: { id: true, name: true, subject: true, schedule: true } } }
        }
      }
    });
    if (!student) {
      res.status(404).json({ message: '학생을 찾을 수 없습니다.' });
      return;
    }
    res.json(student);
  } catch {
    res.status(500).json({ message: '서버 오류' });
  }
});

// POST /api/students/enroll - 클래스에 학생 등록
router.post('/enroll', authenticate, authorizeRoles('ADMIN'), async (req: AuthRequest, res: Response): Promise<void> => {
  const { studentId, classId } = req.body;
  try {
    const enrollment = await prisma.studentClass.create({
      data: { studentId, classId }
    });
    res.status(201).json({ message: '수강 등록 완료', enrollment });
  } catch {
    res.status(400).json({ message: '이미 등록된 학생이거나 잘못된 요청입니다.' });
  }
});

// DELETE /api/students/enroll/:studentId/:classId - 수강 취소
router.delete('/enroll/:studentId/:classId', authenticate, authorizeRoles('ADMIN'), async (req: AuthRequest, res: Response): Promise<void> => {
  const studentId = parseInt(req.params.studentId);
  const classId = parseInt(req.params.classId);
  try {
    await prisma.studentClass.deleteMany({ where: { studentId, classId } });
    res.json({ message: '수강 취소 완료' });
  } catch {
    res.status(500).json({ message: '서버 오류' });
  }
});

export default router;
