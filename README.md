# 🏫 Academy App

랠리즈(Rallyz) 유사 **학원 관리 웹 플랫폼**

> React + TypeScript + Node.js + Express + PostgreSQL + Prisma

---

## 📁 프로젝트 구조

```
academy-app/
├── backend/                # Node.js + Express + TypeScript
│   ├── prisma/
│   │   └── schema.prisma   # DB 스키마
│   ├── src/
│   │   ├── middleware/
│   │   │   └── authMiddleware.ts
│   │   ├── routes/
│   │   │   ├── auth.ts
│   │   │   ├── students.ts
│   │   │   ├── attendance.ts
│   │   │   ├── invoice.ts
│   │   │   ├── assignment.ts
│   │   │   └── notice.ts
│   │   └── app.ts
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
└── frontend/               # React + TypeScript + Tailwind CSS
    └── src/
        ├── pages/
        ├── components/
        ├── api/
        └── types/
```

---

## 🚀 로컬 실행 방법

### 1. 레포지토리 클론

```bash
git clone https://github.com/breeze0813-lab/academy-app.git
cd academy-app
```

### 2. 백엔드 설정

```bash
cd backend

# 패키지 설치
npm install

# 환경변수 설정
cp .env.example .env
# .env 파일에서 DATABASE_URL, JWT_SECRET 값 수정

# DB 마이그레이션
npx prisma migrate dev --name init
npx prisma generate

# 개발 서버 실행
npm run dev
```

### 3. 프론트엔드 설정

```bash
cd frontend

# 패키지 설치
npm install

# 개발 서버 실행
npm run dev
```

---

## 🛠 기술 스택

| 영역 | 기술 |
|---|---|
| 프론트엔드 | React, TypeScript, Tailwind CSS, Vite |
| 백엔드 | Node.js, Express, TypeScript |
| 데이터베이스 | PostgreSQL |
| ORM | Prisma |
| 인증 | JWT + bcrypt |

---

## 📋 주요 기능

- **인증/권한**: 원장(ADMIN), 강사(TEACHER), 학부모(PARENT), 학생(STUDENT) 역할 기반 접근 제어
- **학원/클래스 관리**: 학원 정보, 수업 시간표, 클래스 편성
- **출결 관리**: 출석 체크, 지각/조퇴/결석 기록, 자동 알림
- **학원비 수납**: 청구서 생성, 납부 확인, 미납 관리
- **학습 관리**: 과제 출제/제출, 성적 입력, 학습 리포트
- **소통/공지**: 학원 공지, 피드, 채팅

---

## 🗄 데이터베이스 ERD

주요 모델: User, Academy, Class, StudentClass, Attendance, Invoice, Assignment, Grade, Notice, ChatRoom, Message
