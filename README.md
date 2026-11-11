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

인증 콜백 테스트 11개와 좋아요 저장·복원·저장 실패 복구 테스트 5개가 있습니다.

2026-11-10 확인: 타입 검사·린트·빌드 통과. 브라우저에서 홈·가입 화면, 제보·관리자 화면의 비로그인 리디렉션, 비밀번호 표시 전환, 소셜 로그인 취소 복귀를 확인했습니다. Codex 샌드박스에서는 SWC 사용자 캐시 접근 제한이 있어 빌드와 개발 서버를 일반 사용자 권한으로 실행했습니다. 빌드에는 단일 JS 청크가 500 kB를 넘는 크기 경고가 있습니다.

2026-11-11 확인: Google OAuth 앱과 Supabase 연결 후 운영 사이트의 Google 로그인·대시보드 복귀·새로고침 복원을 확인했습니다. 만료된 OAuth 요청이 Site URL로 돌아올 때도 로그인 실패를 안내하도록 보완했고 관련 회귀 테스트를 포함한 16개 테스트·타입 검사·린트·빌드가 통과했습니다.

## 외부 연결과 배포에 남은 설정

API 주소와 Supabase URL·공개 키를 설정했습니다. 별도 `pwd-week8-server` 폴더에 8주차 서버도 구현하고 4000번 포트에서 실행했습니다. 실제 Supabase에 스키마·기본 맛집 3건을 적용했습니다. `/health` 200·CORS·맛집 응답을 확인했고, 서버 API·서비스 테스트 58개와 PostgreSQL 테스트 10개가 통과했습니다. 실제 Supabase Auth 계정을 이용한 로그인·프로필·권한·관리자 CRUD·제보 승인·세션 갱신·로그아웃 검사도 통과했습니다. 본인 관리자 계정도 생성했으며 임시 로그인 정보는 서버의 `.env.admin.local`에 있습니다. 일반 사용자의 이메일 가입·메일 확인과 브라우저 전체 흐름, Google·네이버 로그인은 추가 확인이 필요합니다.

1. 서버 Secret key·DB 스키마·기본 데이터·로컬 `CLIENT_URL`은 준비했습니다. Supabase SQL을 다시 수동 실행할 필요는 없습니다.
2. Supabase Site URL과 로컬·운영 Redirect URLs를 등록했고 Google 공급자 설정과 실제 로그인을 확인했습니다. 네이버 공급자 연결은 남아 있습니다.
3. 본인 [클라이언트 저장소](https://github.com/KwonWooJin0626/pwd-week8-client)와 [서버 저장소](https://github.com/KwonWooJin0626/pwd-week8-server)에 업로드했습니다. 실제 환경변수와 `node_modules`, `dist`는 제외했습니다.
4. Vercel 프로젝트에 Vite, Node 24.x, Install `npm ci --include=dev`, Build `npm run build`, Output `dist`를 설정했습니다.
5. Vercel 배포와 Render API 연결을 완료했습니다. 클라이언트는 `https://pwd-week8-client-ashy.vercel.app`, API는 `https://pwd-week8-server-kwonwoojin-hpek.onrender.com`입니다. `vercel.json`이 `/auth/callback` 직접 접근을 처리합니다.
6. 서버 CORS에 배포 주소를 등록했습니다. Supabase·공급자 설정에도 배포 주소를 추가한 뒤 실제 계정으로 이메일 확인·소셜 로그인·브라우저 전체 흐름을 확인해야 합니다.

GitHub·Vercel·Render의 실제 작업 결과와 남은 설정은 `SETUP_STATUS.md`에서 확인합니다.
