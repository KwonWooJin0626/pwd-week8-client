# 연결·배포 진행 상태

기준일: 2026-11-10 (한국 시간). 실제 외부 설정과 검사 결과가 확인된 항목만 완료로 표시합니다.

## 완료

- 클라이언트 전체 실습 코드, Supabase URL·공개 키, API `http://localhost:4000` 설정.
- 클라이언트 타입 검사·린트·빌드 및 테스트 13개 통과.
- 별도 `pwd-week8-server` 폴더에 인증·프로필·권한·맛집·제보·공급자 상태 API, SQL, 네이버 등록 스크립트 구현.
- 서버 타입 검사·빌드, API·서비스·공급자 테스트 58개 및 PostgreSQL 테스트 10개 통과.
- 로컬 서버 `/health` 200 및 `http://127.0.0.1:5173` CORS 허용 확인.
- 서버 기본 포트 4000, Render 무료 웹 서비스 Blueprint `render.yaml` 준비.
- Vercel 팀 접근 승인 및 대상 계정 확인.

## 필요한 외부 설정

1. 같은 Supabase 프로젝트의 서버 Secret key를 `pwd-week8-server/.env`의 `SUPABASE_SECRET_KEY`에 입력합니다. 기존 7주차 서버는 다른 Supabase 프로젝트이므로 그 키를 복사하지 않습니다.
2. Supabase SQL Editor에서 `pwd-week8-server/supabase/schema.sql`, 이어서 `seed.sql`을 실행합니다.
3. Supabase Site URL은 로컬 개발 시 `http://127.0.0.1:5173`, Redirect URLs에는 `http://127.0.0.1:5173/auth/callback`을 등록합니다. 배포 후 실제 Vercel 주소도 추가합니다.
4. Google OAuth 웹 클라이언트 ID·Secret을 준비해 Supabase Google 공급자에 등록합니다. 현재 공개 Auth 설정에서 Google 비활성화를 확인했습니다.
5. 네이버 앱의 Client ID·Secret과 테스터를 준비하고 서버 `.env`에 설정한 뒤 `npm run auth:setup-naver`, `npm run auth:check`를 실행합니다.

Google·네이버 공급자 Callback URL: `https://joovhrxjefwmydoaezrx.supabase.co/auth/v1/callback`.

서버 키와 SQL 준비 후 `npm run db:check`, `npm run test:live`로 실제 DB·인증·API 흐름을 확인합니다. 최초 본인 관리자는 가입 후 `npm run change-user-type -- 가입이메일 admin`으로 지정합니다.

## 배포

Render는 서버 저장소의 `render.yaml`로 Blueprint 배포를 준비했습니다. 실제 배포 후 부여된 HTTPS API 주소를 Vercel `VITE_API_BASE_URL`에 설정해야 합니다. 공개 배포에 `localhost:4000`을 사용하지 않습니다. 공급자 Callback URL과 앱 복귀 URL은 구분합니다.

Supabase·Render 연결은 아직 확인되지 않았습니다. 외부 콘솔 조작은 브라우저 도구가 Windows의 현재 주소를 확인하지 못해 중단되었습니다. 기존 서버·DB는 수정하지 않았습니다.
