import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, authorizeRoles, AuthRequest } from '../middleware/authMiddleware';

const router = Router();
const prisma = new PrismaClient();

// POST /api/attendance - 출결 기록 생성
router.post('/', authenticate, authorizeRoles('ADMIN', 'TEACHER'), async (req: AuthRequest, res: Response): Promise<void> => {
  const { studentId, classId, date, status, memo } = req.body;
  try {
    const attendance = await prisma.attendance.create({
      data: {
        studentId,
        classId,
        date: new Date(date),
        status,
        memo
      },
      include: {
        student: { select: { id: true, name: true } },
        class: { select: { id: true, name: true } }
      }
    });
    res.status(201).json(attendance);
  } catch {
    res.status(500).json({ message: '서버 오류' });
  }
});

// GET /api/attendance/class/:classId - 클래스별 출결 현황 조회
router.get('/class/:classId', authenticate, authorizeRoles('ADMIN', 'TEACHER'), async (req: AuthRequest, res: Response): Promise<void> => {
  const classId = parseInt(req.params.classId);
  const { date } = req.query;
  try {
    const where: { classId: number; date?: { gte: Date; lt: Date } } = { classId };
    if (date) {
      const d = new Date(date as string);
      const nextDay = new Date(d);
      nextDay.setDate(d.getDate() + 1);
      where.date = { gte: d, lt: nextDay };
    }
    const attendances = await prisma.attendance.findMany({
      where,
      include: {
        student: { select: { id: true, name: true } }
      },
      orderBy: { date: 'desc' }
    });
    res.json(attendances);
  } catch {
    res.status(500).json({ message: '서버 오류' });
  }
});

// GET /api/attendance/student/:studentId - 학생별 출결 이력 조회
router.get('/student/:studentId', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  const studentId = parseInt(req.params.studentId);
  try {
    const attendances = await prisma.attendance.findMany({
      where: { studentId },
      include: {
        class: { select: { id: true, name: true, subject: true } }
      },
      orderBy: { date: 'desc' },
      take: 50
    });
    res.json(attendances);
  } catch {
    res.status(500).json({ message: '서버 오류' });
  }
});

// PUT /api/attendance/:id - 출결 정보 수정
router.put('/:id', authenticate, authorizeRoles('ADMIN', 'TEACHER'), async (req: AuthRequest, res: Response): Promise<void> => {
  const id = parseInt(req.params.id);
  const { status, memo } = req.body;
  try {
    const updated = await prisma.attendance.update({
      where: { id },
      data: { status, memo }
    });
    res.json(updated);
  } catch {
    res.status(500).json({ message: '서버 오류' });
  }
});

// GET /api/attendance/summary/:academyId - 학원 전체 출결 현황 (오늘)
router.get('/summary/:academyId', authenticate, authorizeRoles('ADMIN', 'TEACHER'), async (req: AuthRequest, res: Response): Promise<void> => {
  const academyId = parseInt(req.params.academyId);
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const [present, absent, late, earlyLeave] = await Promise.all([
      prisma.attendance.count({ where: { class: { academyId }, date: { gte: today, lt: tomorrow }, status: 'PRESENT' } }),
      prisma.attendance.count({ where: { class: { academyId }, date: { gte: today, lt: tomorrow }, status: 'ABSENT' } }),
      prisma.attendance.count({ where: { class: { academyId }, date: { gte: today, lt: tomorrow }, status: 'LATE' } }),
      prisma.attendance.count({ where: { class: { academyId }, date: { gte: today, lt: tomorrow }, status: 'EARLY_LEAVE' } })
    ]);

    res.json({ present, absent, late, earlyLeave, total: present + absent + late + earlyLeave });
  } catch {
    res.status(500).json({ message: '서버 오류' });
  }
});

export default router;
