import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// POST /api/auth/register
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  const { name, phone, email, password, role } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, phone, email, password: hashed, role }
    });
    res.status(201).json({ message: '회원가입 완료', userId: user.id });
  } catch {
    res.status(400).json({ message: '이미 존재하는 이메일 또는 전화번호입니다.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
      return;
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      res.status(401).json({ message: '비밀번호가 틀렸습니다.' });
      return;
    }
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );
    res.json({ token, user: { id: user.id, name: user.name, role: user.role, email: user.email } });
  } catch {
    res.status(500).json({ message: '서버 오류' });
  }
});

// GET /api/auth/me
router.get('/me', async (req: Request, res: Response): Promise<void> => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    res.status(401).json({ message: '토큰이 없습니다.' });
    return;
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, name: true, email: true, phone: true, role: true }
    });
    res.json(user);
  } catch {
    res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
  }
});

export default router;
