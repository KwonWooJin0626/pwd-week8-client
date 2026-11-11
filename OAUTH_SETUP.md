# Google·네이버 로그인에 필요한 외부 설정

클라이언트와 서버 코드는 준비되어 있습니다. 실제 소셜 로그인은 아래 개발자 앱과 Supabase 인증 설정이 있어야 동작합니다.

## 공통 주소

| 용도 | 설정값 |
| --- | --- |
| Supabase 프로젝트 | `joovhrxjefwmydoaezrx` |
| 공급자가 Supabase로 돌려주는 Callback URL | `https://joovhrxjefwmydoaezrx.supabase.co/auth/v1/callback` |
| 로컬 클라이언트 origin | `http://127.0.0.1:5173` |
| Supabase에서 앱으로 돌아오는 Redirect URL | `http://127.0.0.1:5173/auth/callback` |
| 배포 클라이언트 origin | `https://pwd-week8-client-ashy.vercel.app` |
| 배포 앱 Redirect URL | `https://pwd-week8-client-ashy.vercel.app/auth/callback` |

배포 주소와 로컬 주소를 각각 등록합니다. Google·네이버에 등록할 공급자 Callback URL은 배포 후에도 위 Supabase URL입니다.

## Supabase URL 설정

[URL Configuration](https://supabase.com/dashboard/project/joovhrxjefwmydoaezrx/auth/url-configuration)에 Site URL `https://pwd-week8-client-ashy.vercel.app`과 Redirect URLs `http://127.0.0.1:5173/auth/callback`, `https://pwd-week8-client-ashy.vercel.app/auth/callback`을 저장했습니다. 대시보드에서 복귀 주소 2개의 저장 성공을 확인했습니다.

## Google

1. Google 계정의 2단계 인증 절차를 완료하고 [Ajou Campus Foodmap 프로젝트](https://console.cloud.google.com/auth/overview?project=ajou-campus-foodmap-514314)를 만들었습니다. 프로젝트 ID는 `ajou-campus-foodmap-514314`입니다.
2. 본인의 정책 동의 후 앱 브랜딩 구성을 완료했고 본인 Google 계정을 테스트 사용자로 등록했습니다.
3. **웹 애플리케이션** OAuth 클라이언트 `Ajou Campus Foodmap Web`을 발급했습니다.
4. Authorized JavaScript origins에 `http://127.0.0.1:5173`과 `https://pwd-week8-client-ashy.vercel.app`을 등록했습니다.
5. Authorized redirect URIs에 `https://joovhrxjefwmydoaezrx.supabase.co/auth/v1/callback`을 등록했습니다.
6. [Supabase Providers](https://supabase.com/dashboard/project/joovhrxjefwmydoaezrx/auth/providers)에 발급한 Client ID·Client Secret을 저장하고 Google 공급자를 활성화했습니다.

운영 사이트에서 Google 로그인 → `/auth/callback` → 대시보드 복귀와 새로고침 후 세션 복원을 확인했습니다. 기존 이메일 관리자와 같은 UUID에 Google identity가 연결되어 관리자 역할도 유지됐습니다. 화면의 로그인 방식은 기존 앱 프로필의 `email` 값으로 표시됩니다. Client Secret은 `.env.example`이나 GitHub에 넣지 않습니다.

Google 앱은 테스트 모드입니다. 추가 계정으로 시험하려면 Google Auth Platform의 대상 → 테스트 사용자에 해당 계정을 추가합니다.

## 네이버

1. 본인이 [네이버 개발자 센터](https://developers.naver.com/apps/)에서 앱 `pwd-week-client`를 등록했습니다.
2. PC 웹 서비스 URL은 `https://pwd-week8-client-ashy.vercel.app`으로 확인했습니다.
3. 네이버 로그인 Callback URL은 `https://joovhrxjefwmydoaezrx.supabase.co/auth/v1/callback`으로 확인했습니다. 이름·이메일·프로필 추가 제공 항목도 선택하지 않은 상태입니다.
4. 멤버 관리에서 실제 로그인할 네이버 테스터를 등록합니다. 실습 안내대로 이름·이메일 추가 프로필을 필수로 요구하지 않습니다.
5. 서버 `pwd-week8-server/.env`의 `NAVER_CLIENT_ID`, `NAVER_CLIENT_SECRET`에 앱 발급값을 입력합니다.
6. 서버 폴더에서 아래 명령을 실행합니다. 기존 `custom:naver` 연결이 있으면 삭제하지 않고 확인 후 갱신합니다.

```powershell
npm run auth:setup-naver
npm run auth:check
```

현재 `custom:naver`는 미등록 상태입니다. 네이버 앱 키의 로컬 서버 저장·Supabase 전송 승인과 키 입력을 기다리고 있습니다. 기존 탭이 응답하지 않아 새 탭을 열었고, 새 탭에서 네이버 재로그인이 필요합니다. 네이버 OIDC 공개 설정과 PKCE 지원은 확인했습니다.

## 실제 확인

1. 서버가 실행된 상태에서 로그인 화면의 Google·네이버 버튼 활성화를 확인합니다. 공급자 상태는 최대 60초 캐시되므로 설정 직후에는 서버를 재시작하거나 잠시 후 다시 조회합니다.
2. 공급자 로그인·동의 후 `/#/dashboard`로 돌아오고 `/api/auth/me`가 200인지 확인합니다.
3. 로그인 취소, 새로고침, 로그아웃·재로그인, 계정 전환을 확인합니다.
4. 일반 사용자는 제보 가능·관리자 요청 403이어야 합니다. 소셜 이메일만으로 관리자 계정을 합치지 않습니다.

참고: [Supabase Google 로그인](https://supabase.com/docs/guides/auth/social-login/auth-google), [Supabase Redirect URLs](https://supabase.com/docs/guides/auth/redirect-urls), [네이버 애플리케이션 설정](https://developers.naver.com/docs/common/openapiguide/appconf.md).
