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

[URL Configuration](https://supabase.com/dashboard/project/joovhrxjefwmydoaezrx/auth/url-configuration)에서 Site URL을 `https://pwd-week8-client-ashy.vercel.app`으로 설정하고 Redirect URLs에 `http://127.0.0.1:5173/auth/callback`과 `https://pwd-week8-client-ashy.vercel.app/auth/callback`을 추가합니다. 이 설정은 아직 직접 적용하지 못했으므로 콘솔에서 저장해야 합니다.

## Google

1. [Google Cloud](https://console.cloud.google.com/)에서 사용할 프로젝트를 선택합니다.
2. Google Auth Platform에서 앱 브랜딩·대상 사용자를 설정하고, 테스트 앱이면 실제 로그인할 계정을 테스터로 추가합니다.
3. 클라이언트 유형이 **웹 애플리케이션**인 OAuth 클라이언트를 만듭니다. 일반 API Key나 서비스 계정 키를 사용하지 않습니다.
4. Authorized JavaScript origins에 `http://127.0.0.1:5173`과 `https://pwd-week8-client-ashy.vercel.app`을 등록합니다.
5. Authorized redirect URIs에 `https://joovhrxjefwmydoaezrx.supabase.co/auth/v1/callback`을 등록합니다.
6. [Supabase Providers](https://supabase.com/dashboard/project/joovhrxjefwmydoaezrx/auth/providers)의 Google 공급자에 Client ID·Client Secret을 입력하고 활성화해 저장합니다.

현재 확인한 Supabase Google 공급자는 비활성화 상태입니다. Client Secret은 `.env.example`이나 GitHub에 넣지 않습니다.

## 네이버

1. [네이버 개발자 센터](https://developers.naver.com/apps/#/register)에서 네이버 로그인 앱을 준비합니다.
2. PC 웹 서비스 URL에 배포 주소 `https://pwd-week8-client-ashy.vercel.app`을 등록하고, 로컬 테스트가 필요하면 `http://127.0.0.1:5173`도 서비스 환경 설정에 추가합니다.
3. 네이버 로그인 Callback URL에 `https://joovhrxjefwmydoaezrx.supabase.co/auth/v1/callback`을 등록합니다.
4. 멤버 관리에서 실제 로그인할 네이버 테스터를 등록합니다. 실습 안내대로 이름·이메일 추가 프로필을 필수로 요구하지 않습니다.
5. 서버 `pwd-week8-server/.env`의 `NAVER_CLIENT_ID`, `NAVER_CLIENT_SECRET`에 앱 발급값을 입력합니다.
6. 서버 폴더에서 아래 명령을 실행합니다. 기존 `custom:naver` 연결이 있으면 삭제하지 않고 확인 후 갱신합니다.

```powershell
npm run auth:setup-naver
npm run auth:check
```

현재 `custom:naver`는 미등록 상태입니다. 네이버 OIDC 공개 설정과 PKCE 지원은 확인했습니다.

## 실제 확인

1. 서버가 실행된 상태에서 로그인 화면의 Google·네이버 버튼 활성화를 확인합니다. 공급자 상태는 최대 60초 캐시되므로 설정 직후에는 서버를 재시작하거나 잠시 후 다시 조회합니다.
2. 공급자 로그인·동의 후 `/#/dashboard`로 돌아오고 `/api/auth/me`가 200인지 확인합니다.
3. 로그인 취소, 새로고침, 로그아웃·재로그인, 계정 전환을 확인합니다.
4. 일반 사용자는 제보 가능·관리자 요청 403이어야 합니다. 소셜 이메일만으로 관리자 계정을 합치지 않습니다.

참고: [Supabase Google 로그인](https://supabase.com/docs/guides/auth/social-login/auth-google), [Supabase Redirect URLs](https://supabase.com/docs/guides/auth/redirect-urls), [네이버 애플리케이션 설정](https://developers.naver.com/docs/common/openapiguide/appconf.md).
