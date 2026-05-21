import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import studentRoutes from './routes/students';
import attendanceRoutes from './routes/attendance';
import invoiceRoutes from './routes/invoice';
import assignmentRoutes from './routes/assignment';
import noticeRoutes from './routes/notice';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/notices', noticeRoutes);

app.get('/', (_req, res) => {
  res.json({ message: '학원 관리 API 서버 동작 중' });
});

app.listen(PORT, () => {
  console.log('서버 실행 중: http://localhost:' + PORT);
});

export default app;
