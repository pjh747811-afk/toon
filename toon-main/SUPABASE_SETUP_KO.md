# ToonLog Supabase 연결 안내

## 적용된 기능
- 페이지 우측 상단의 `로그인 / 내 계정` 패널에서 이메일 회원가입·로그인·로그아웃
- 기존 `toonlog_saved_diaries` 브라우저 저장을 유지
- 로그인 상태에서 새 웹툰이 브라우저 저장소에 저장되면 Supabase `toonlog_diaries` 테이블에도 동기화
- 로그인 후 기존 브라우저 보관함을 클라우드로 이전하고, 계정에 저장된 웹툰을 보관함과 동기화
- Publishable Key만 브라우저에 전달. Secret Key는 브라우저에 노출하지 않음

## 1. Supabase 테이블 및 RLS 만들기
1. Supabase 대시보드에서 프로젝트 선택
2. 왼쪽 `SQL Editor` > `New query`
3. `supabase/toonlog_schema.sql` 파일의 전체 내용을 붙여넣고 `Run`
4. `Table Editor`에 `toonlog_diaries` 테이블이 생성됐는지 확인

## 2. Vercel 환경변수
Vercel 프로젝트 > Settings > Environment Variables에 다음을 등록합니다.

- `SUPABASE_URL` : Supabase Project URL
- `SUPABASE_PUBLISHABLE_KEY` : Supabase Publishable key
- `SUPABASE_SECRET_KEY` : 선택 사항. 서버 전용으로만 보관하며 현재 사용자 데이터 저장 기능에는 사용하지 않습니다.
- 기존 `GEMINI_API_KEY`도 유지합니다.

`SUPABASE_SECRET_KEY`를 `NEXT_PUBLIC_`로 시작하는 이름으로 만들거나 HTML/JavaScript에 직접 넣지 마세요. 이 프로젝트는 사용자별 RLS 권한으로 동작하므로 브라우저에는 Publishable Key만 전달합니다.

## 3. Supabase 이메일 인증 설정
Supabase > Authentication > URL Configuration에서 Site URL에 `https://toon-olive.vercel.app`을 등록합니다.
회원가입 후 인증 메일이 발송되도록 Email provider 설정을 확인합니다. 테스트 중 인증메일을 받지 못하면 Supabase Authentication > Users에서 가입 상태를 확인하세요.

## 4. 재배포 및 테스트
1. 수정된 프로젝트를 GitHub 저장소에 반영합니다.
2. Vercel에서 새 배포가 완료될 때까지 기다립니다.
3. `https://toon-olive.vercel.app/api/health`에서 `supabase_ready: true`인지 확인합니다.
4. 사이트 우측 상단 `로그인 / 내 계정` > 회원가입 또는 로그인
5. 웹툰을 생성하고 저장합니다.
6. Supabase > Table Editor > `toonlog_diaries`에서 로그인한 사용자 ID와 웹툰 행이 생성되는지 확인합니다.
7. 다른 기기/브라우저에서 같은 계정으로 로그인해 보관함이 표시되는지 확인합니다.

## 주의
- 현재 브라우저에 로그인하지 않은 상태에서는 기존처럼 localStorage에 저장됩니다. 로그인 후 로컬 보관함을 클라우드로 동기화합니다.
- 이미지 URL이나 base64 이미지가 매우 큰 경우 JSON payload가 커질 수 있습니다. 대용량 이미지의 영구 보관은 다음 단계에서 Supabase Storage 버킷으로 분리하는 것이 좋습니다.
- Secret Key는 사용자 브라우저에서 절대 사용하지 않습니다.
