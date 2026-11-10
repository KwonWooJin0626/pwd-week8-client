# Ajou Campus Foodmap — 8주차 클라이언트

React 19, TypeScript, Vite로 아주대학교 주변 맛집을 조회하고 제보하는 클라이언트입니다.
[원본 실습 안내](https://github.com/ajou-hyunseok-oh/pwd-week8-client/blob/main/README.md)의 3-6절부터 10-3절까지 이어서 구현했습니다. 기존 패키지 버전과 TypeScript 설정을 유지했습니다.

## 실행

Node.js 24.x를 사용합니다.

```powershell
npm ci --include=dev
npm run dev -- --host 127.0.0.1 --strictPort
```

접속 주소: http://127.0.0.1:5173

`.env.local`의 `VITE_API_BASE_URL`은 현재 `http://localhost:4000`이며, `VITE_SUPABASE_URL`은 `https://joovhrxjefwmydoaezrx.supabase.co`로 설정했습니다. 같은 Supabase 프로젝트의 공개 키도 `VITE_SUPABASE_PUBLISHABLE_KEY`에 적용했습니다. 아래는 공유 가능한 예시입니다.

```dotenv
VITE_API_BASE_URL=http://localhost:4000
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_replace_with_your_key
```

API 주소에는 `/api`를 붙이지 않습니다. 브라우저에는 Supabase 공개 키만 사용하며 서버용 secret/service-role 키를 넣지 않습니다. 환경변수를 수정하면 Vite를 재시작합니다. `.env.local`은 Git에서 제외됩니다.

## 구현한 기능

| 주소 | 기능 |
| --- | --- |
| `/#/` | 홈과 탐색 메뉴 |
| `/#/list` | 목록, 카테고리 필터, 좋아요 저장·복원 |
| `/#/restaurant/:id` | 맛집 상세와 추천 메뉴 |
| `/#/popular` | 서버 기준 인기 맛집 |
| `/#/login`, `/#/register` | 이메일 가입·로그인, Google·네이버 로그인 |
| `/auth/callback` | PKCE 코드 교환, 로그인 취소·실패 안내 |
| `/#/dashboard` | 내 정보, 이름·이미지·비밀번호 변경, 계정 비활성화, 로그아웃 |
| `/#/submit` | 로그인 사용자 맛집 제보 |
| `/#/admin` | 관리자 맛집 생성·수정·삭제, 사용자 역할 변경 |
| `/#/submissions` | 관리자 제보 조회·필터·승인·거절·삭제 |

보호 화면은 로그인·역할을 검사하며, 실제 API 권한 검사는 서버가 수행합니다. 인증 요청에는 Supabase 세션의 Bearer 토큰을 첨부합니다. 계정 전환 시 이전 조회 캐시를 지웁니다. 좋아요는 현재 브라우저의 LocalStorage에 보관합니다.

## 검사

```powershell
npm run typecheck
npm run lint
npm test
npm run build
```

인증 콜백 테스트 8개와 좋아요 저장·복원·저장 실패 복구 테스트 5개가 있습니다.

2026-11-10 확인: 타입 검사·린트·빌드 통과. 브라우저에서 홈·가입 화면, 제보·관리자 화면의 비로그인 리디렉션, 비밀번호 표시 전환, 소셜 로그인 취소 복귀를 확인했습니다. Codex 샌드박스에서는 SWC 사용자 캐시 접근 제한이 있어 빌드와 개발 서버를 일반 사용자 권한으로 실행했습니다. 빌드에는 단일 JS 청크가 500 kB를 넘는 크기 경고가 있습니다.

## 외부 연결과 배포에 남은 설정

API 주소와 Supabase URL·공개 키를 설정했습니다. 별도 `pwd-week8-server` 폴더에 8주차 서버도 구현하고 4000번 포트에서 실행했습니다. `/health` 200과 클라이언트 CORS를 확인했고, 서버 API·서비스 테스트 58개와 PostgreSQL 테스트 10개가 통과했습니다. 실제 Supabase 서버 키와 SQL 준비가 필요하며 맛집 응답·회원가입·로그인·프로필 저장·관리자 CRUD·제보 승인은 아직 통합 검증하지 못했습니다. Google·네이버의 실제 동의 화면도 공급자 설정 후 확인해야 합니다.

1. `pwd-week8-server`의 `.env`에 같은 Supabase 프로젝트의 서버 Secret key를 설정하고 `supabase/schema.sql`, `supabase/seed.sql`을 순서대로 적용합니다. 로컬 `CLIENT_URL`은 설정했습니다.
2. Supabase Redirect URLs에 `http://127.0.0.1:5173/auth/callback`을 등록합니다. Google·네이버 공급자는 원본 실습 안내의 9절에 맞춰 설정합니다.
3. 본인 [클라이언트 저장소](https://github.com/KwonWooJin0626/pwd-week8-client)와 [서버 저장소](https://github.com/KwonWooJin0626/pwd-week8-server)에 소스·설정·테스트·lock 파일을 반영합니다. 실제 환경변수와 `node_modules`, `dist`는 제외합니다.
4. Vercel에서 Vite, Node 24.x, Install `npm ci --include=dev`, Build `npm run build`, Output `dist`로 설정합니다.
5. Vercel의 API 환경변수에는 본인 Render HTTPS 기본 주소를 사용하고, Supabase 공개 환경변수 두 개도 등록합니다. `vercel.json`이 `/auth/callback` 직접 접근을 처리합니다.
6. 서버 CORS와 Supabase·공급자 설정에 배포 주소를 추가한 뒤 실제 계정으로 일반 사용자·관리자 흐름을 확인합니다.

GitHub·Vercel·Render의 실제 작업 결과와 남은 설정은 `SETUP_STATUS.md`에서 확인합니다.
