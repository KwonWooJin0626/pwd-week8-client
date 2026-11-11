# 연결·배포 진행 상태

기준일: 2026-11-11 (한국 시간). 실제 외부 설정과 검사 결과가 확인된 항목만 완료로 표시합니다.

## 완료

- 클라이언트 전체 실습 코드, Supabase URL·공개 키, API `http://localhost:4000` 설정.
- 클라이언트 타입 검사·린트·빌드 및 테스트 16개 통과.
- 별도 `pwd-week8-server` 폴더에 인증·프로필·권한·맛집·제보·공급자 상태 API, SQL, 네이버 등록 스크립트 구현.
- 서버 타입 검사·빌드, API·서비스·공급자 테스트 58개 및 PostgreSQL 테스트 10개 통과.
- 로컬 서버 `/health` 200 및 `http://127.0.0.1:5173` CORS 허용 확인.
- 서버 기본 포트 4000, Render 무료 웹 서비스 Blueprint `render.yaml` 준비.
- Vercel 팀 접근 승인 및 대상 계정 확인.
- 클라이언트 GitHub 업로드 완료: `b91d32a17975bf65922aef4190537597faf00136`.
- 서버 GitHub 업로드 완료: `9587fdbaac7ef989248cadb9e716a291404ff48c`.
- 새 Supabase 서버 키 적용, 실제 테이블 3개·Auth 프로필 트리거·RPC·RLS 적용과 기본 맛집 3건 등록.
- 실제 Supabase Auth 계정으로 `npm run test:live` 통과: 로그인·프로필 생성·권한 위조 차단·401/403·관리자 CRUD·제보 승인·역할 변경·비활성화·세션 갱신·로그아웃. 검사 전용 계정·데이터는 정리했고 기존 맛집 3건은 보존했습니다.
- Vercel 프로젝트 `pwd-week8-client` 생성, Vite·Node 24.x·빌드·설치·출력 설정 및 Supabase 공개 환경변수 적용.
- Supabase·Render 도구 연결 확인.
- 지정한 본인 이메일로 최초 관리자 계정 생성·활성화. 임시 로그인 정보는 서버의 `.env.admin.local`에만 저장했고 Git 제외를 확인했습니다. 로그인 후 비밀번호를 변경합니다.
- Render 배포가 `live` 상태이며, 공개 조회·실제 관리자 로그인 후 `/me`·사용자 목록이 모두 200으로 응답하는 것을 확인했습니다.
- Render API 주소를 Vercel `VITE_API_BASE_URL`에 등록했습니다.
- Supabase 대시보드에서 Site URL을 공개 운영 origin으로 저장하고, 로컬·운영 `/auth/callback` 주소 2개를 허용 목록에 추가했습니다.
- Google OAuth 웹 클라이언트를 발급해 Supabase Google 공급자에 저장·활성화하고 본인 테스트 사용자를 등록했습니다.
- 운영 사이트에서 실제 Google 로그인과 대시보드 복귀·새로고침 복원을 확인했습니다. 기존 이메일 관리자와 같은 UUID에 `email`, `google` identities가 연결된 것을 DB에서 확인했습니다.
- 만료된 OAuth state 오류가 Site URL로 돌아와도 로그인 오류로 안내하도록 보완하고 회귀 테스트 3개를 추가했습니다.

## 필요한 외부 설정

1. 서버 Secret key와 DB 준비는 완료했습니다. 추가 SQL 수동 실행은 필요하지 않습니다.
2. 최초 관리자 계정은 준비했습니다. 본인이 로그인한 후 내 정보에서 임시 비밀번호를 변경합니다.
3. Supabase Site URL과 로컬·배포 Redirect URLs 등록은 완료했습니다.
4. Google 연결·실제 로그인은 완료했습니다. 앱은 테스트 모드이며 추가 계정은 Google 테스트 사용자로 등록해야 합니다.
5. 네이버 앱 `pwd-week-client`의 서비스 URL과 콜백 주소는 확인했습니다. 앱 Client ID·Secret의 로컬 서버 저장·Supabase 전송 승인과 키 입력 후 `npm run auth:setup-naver`, `npm run auth:check`를 실행해야 합니다. 현재 `custom:naver`는 미등록 상태이며 새 개발자 센터 탭에서 재로그인이 필요합니다.

Google·네이버 공급자 Callback URL: `https://joovhrxjefwmydoaezrx.supabase.co/auth/v1/callback`.

`npm run db:check`, `npm run test:live`로 실제 DB·인증·API 흐름을 확인했습니다. 소셜 공급자 설정의 자세한 주소와 단계는 `OAUTH_SETUP.md`에 있습니다.

## 배포

Render: https://pwd-week8-server-kwonwoojin-hpek.onrender.com

워크스페이스 `pwd-week7`에 신규 무료 웹 서비스 `pwd-week8-server-kwonwoojin-hpek`를 생성했습니다. 서비스 URL과 서버 키를 적용했으며 실제 API 응답을 확인했습니다. Vercel 공개 운영 origin을 Render CORS에 추가해 재배포했고, 맛집 API 200·맛집 3건·올바른 CORS 응답·Authorization 사전 요청 204를 확인했습니다.

Vercel: https://pwd-week8-client-ashy.vercel.app

운영 배포가 `READY` 상태입니다. 공개 운영 도메인의 HTML과 `/auth/callback` 직접 접근이 200으로 응답합니다. 배포 JS에 실제 Render API 주소가 반영되었고 실제 서버 Secret key가 포함되지 않았음을 확인했습니다. 로컬 `.env.local`의 API 주소는 요청대로 `http://localhost:4000`을 유지합니다. 팀 도메인과 개별 배포 URL은 Vercel 인증이 적용되어 있으므로 공개 접속에는 위 `-ashy` 운영 도메인을 사용합니다.

Supabase URL 설정과 Google 연결·실제 로그인은 완료했습니다. 네이버 앱은 등록되었으며 인증정보 연결을 이어서 진행합니다. 기존 7주차 서버·DB는 수정하지 않았습니다.

DB 보안 점검에서는 업무 테이블 3개의 [RLS 정책 없음 안내(INFO)](https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy)가 나왔습니다. 이 실습은 브라우저의 테이블 직접 접근을 차단하고 Express 서버만 접근하는 구조이며, 실제 검사에서도 익명·로그인 브라우저 역할의 직접 조회가 거절되는 것을 확인했습니다.
