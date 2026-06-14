# 내 일정 관리 웹페이지 (무료 호스팅)

Next.js + Supabase 로 만든 개인용 일정 관리 웹페이지입니다.
로그인, 일정(캘린더) CRUD, 파일 첨부 기능을 제공하며, 전부 무료 티어로 운영할 수 있습니다.

## 사용 기술 (모두 무료)

- **Next.js** – 프론트엔드 + 서버 액션
- **Vercel** – 무료 배포/호스팅
- **Supabase 무료 플랜**
  - PostgreSQL DB (일정 데이터)
  - Auth (이메일/비밀번호 로그인, 회원가입)
  - Storage (파일 첨부, 1GB 무료)

## 설정 방법

### 1. Supabase 프로젝트 생성

1. https://supabase.com 에서 무료 계정 생성 후 새 프로젝트 생성
2. SQL Editor에서 `supabase/schema.sql` 내용을 실행 (테이블, RLS 정책, Storage 버킷 생성)
3. Project Settings > API 에서 `Project URL`, `anon public key` 복사

### 2. 환경변수 설정

`.env.local.example` 을 `.env.local` 로 복사하고 값을 채웁니다.

```bash
cp .env.local.example .env.local
```

### 3. 로컬 실행

```bash
npm install
npm run dev
```

### 4. 배포 (Vercel 무료)

1. https://vercel.com 에서 이 GitHub 저장소를 Import
2. 환경변수(`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`)를 Vercel 프로젝트 설정에 등록
3. Deploy

## 기능

- 이메일/비밀번호 회원가입 & 로그인 (Supabase Auth, 다중 사용자 지원)
- 사용자별 일정 등록/조회/삭제 (Row Level Security로 본인 데이터만 접근 가능)
- 일정에 파일 첨부 (Supabase Storage, 사용자별 폴더 분리)
- 첨부파일은 서명된 URL(1시간 유효)로 안전하게 다운로드

## 추가로 고려할 만한 기능

- 일정 수정 기능
- 월/주 단위 캘린더 뷰 (예: `react-big-calendar`)
- 일정 카테고리/색상 태그
- 마감일 알림 (Supabase Edge Functions + 무료 이메일 서비스 연동)
- 다크모드 토글
- 일정 검색/필터
- 다국어 지원
