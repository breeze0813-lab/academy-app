import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, authorizeRoles, AuthRequest } from '../middleware/authMiddleware';

const router = Router();
const prisma = new PrismaClient();

// POST /api/invoices - 청구서 생성
router.post('/', authenticate, authorizeRoles('ADMIN'), async (req: AuthRequest, res: Response): Promise<void> => {
  const { studentId, academyId, month, tuitionFee, extraFee, dueDate } = req.body;
  try {
    const totalFee = (tuitionFee || 0) + (extraFee || 0);
    const invoice = await prisma.invoice.create({
      data: {
        studentId,
        academyId,
        month,
        tuitionFee,
        extraFee: extraFee || 0,
        totalFee,
        dueDate: new Date(dueDate),
        status: 'UNPAID'
      },
      include: {
        student: { select: { id: true, name: true, phone: true } }
      }
    });
    res.status(201).json(invoice);
  } catch {
    res.status(500).json({ message: '서버 오류' });
  }
});

// POST /api/invoices/bulk - 전체 학생 청구서 일괄 생성
router.post('/bulk', authenticate, authorizeRoles('ADMIN'), async (req: AuthRequest, res: Response): Promise<void> => {
  const { academyId, month, tuitionFee, dueDate } = req.body;
  try {
    const studentClasses = await prisma.studentClass.findMany({
      where: { class: { academyId } },
      select: { studentId: true },
      distinct: ['studentId']
    });
    const invoices = await Promise.all(
      studentClasses.map(sc =>
        prisma.invoice.create({
          data: {
            studentId: sc.studentId,
            academyId,
            month,
            tuitionFee,
            extraFee: 0,
            totalFee: tuitionFee,
            dueDate: new Date(dueDate),
            status: 'UNPAID'
          }
        })
      )
    );
    res.status(201).json({ message: `${invoices.length}건 청구서 생성 완료`, count: invoices.length });
  } catch {
    res.status(500).json({ message: '서버 오류' });
  }
});

// GET /api/invoices - 청구서 목록 조회
router.get('/', authenticate, authorizeRoles('ADMIN', 'TEACHER'), async (req: AuthRequest, res: Response): Promise<void> => {
  const { academyId, month, status } = req.query;
  try {
    const where: { academyId?: number; month?: string; status?: string } = {};
    if (academyId) where.academyId = parseInt(academyId as string);
    if (month) where.month = month as string;
    if (status) where.status = status as string;

    const invoices = await prisma.invoice.findMany({
      where,
      include: {
        student: { select: { id: true, name: true, phone: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(invoices);
  } catch {
    res.status(500).json({ message: '서버 오류' });
  }
});

// GET /api/invoices/unpaid - 미납 청구서 목록
router.get('/unpaid', authenticate, authorizeRoles('ADMIN'), async (req: AuthRequest, res: Response): Promise<void> => {
  const { academyId } = req.query;
  try {
    const invoices = await prisma.invoice.findMany({
      where: { academyId: parseInt(academyId as string), status: 'UNPAID' },
      include: {
        student: { select: { id: true, name: true, phone: true } }
      },
      orderBy: { dueDate: 'asc' }
    });
    res.json(invoices);
  } catch {
    res.status(500).json({ message: '서버 오류' });
  }
});

// PATCH /api/invoices/:id/pay - 납부 처리
router.patch('/:id/pay', authenticate, authorizeRoles('ADMIN'), async (req: AuthRequest, res: Response): Promise<void> => {
  const id = parseInt(req.params.id);
  try {
    const updated = await prisma.invoice.update({
      where: { id },
      data: { status: 'PAID', paidAt: new Date() }
    });
    res.json({ message: '납부 처리 완료', invoice: updated });
  } catch {
    res.status(500).json({ message: '서버 오류' });
  }
});

// GET /api/invoices/student/:studentId - 학생별 청구서 목록
router.get('/student/:studentId', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  const studentId = parseInt(req.params.studentId);
  try {
    const invoices = await prisma.invoice.findMany({
      where: { studentId },
      orderBy: { createdAt: 'desc' }
    });
    res.json(invoices);
  } catch {
    res.status(500).json({ message: '서버 오류' });
  }
});

export default router;
