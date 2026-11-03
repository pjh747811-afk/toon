# 🎨 ToonLog (툰로그) - AI 4-Cut Webtoon Diary Studio

<div align="center">

![ToonLog Banner](https://lh3.googleusercontent.com/aida-public/AB6AXuAlidjpZVzi4ZSaqqhs49KAy4h-wwy3Ph_IOcLqXzXAtYkoe0pgCpXCghZ2OqJ6p9opntpJnxix6mjrgDwADjZfRar705k3lNAPNmtFu7FhHp6VzsE0s2fF0A3MKcKSSy9JdZysLNA14_GYTln-t5gi0fCVLUz2YkrBwRsBJHglsIW7F_gl6wlQ8E2olJ4LuzxWQVke8BW6g6MEEF_z8omw90M0l9p4EeWm_40bOIh3)

### 당신의 소소한 일상, 오늘 하루의 이야기가 4컷 웹툰이 됩니다 ✍️

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.21-lightgrey.svg)](https://expressjs.com/)
[![Google Gemini API](https://img.shields.io/badge/Google%20Gen%20AI-Gemini%20API-4285F4.svg)](https://ai.google.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v3%2Fv4-38B2AC.svg)](https://tailwindcss.com/)

**ToonLog**는 일기 텍스트를 입력하면 **Google Gemini AI**가 기·승·전·결 4컷 스토리보드(장면 묘사, 캐릭터 대사, 독백, 감성 효과음)를 자동으로 완성하고, 사용자가 자유롭게 말풍선을 드래그하고 스티커를 부착하여 **인스타그램 규격(4:5) 고해상도 PNG**로 저장할 수 있는 AI 웹툰 다이어리 플랫폼입니다.

</div>

---

## 🌈 5-Color Harmony Design System

첨부된 브랜드 컬러 팔레트를 바탕으로 구축된 조화로운 디자인 시스템이 적용되어 있습니다.

| 색상명 | HEX 코드 | 주 용도 |
| :--- | :--- | :--- |
| **Coral Pink** | `#FE5E7F` | 메인 브랜드 컬러, 주요 CTA 버튼, 활성 탭 하이라이트 |
| **Peach Blush** | `#FEA7A7` | 보조 액센트, 로고 서브 그라디언트, 감성 배지 |
| **Warm Apricot**| `#FFD7A5` | 경계선 및 프레임, 하이라이트 배경 틴트, 카드 보더 |
| **Pastel Mint** | `#CCFFC0` | 성공 상태 배지, 활성 태그, 신규 피처 인디케이터 |
| **Sky Cyan**    | `#9CF6FE` | 컨테이너 글로우, 백라이트 오버레이, 듀얼 페르소나 태그 |

---

## ✨ 핵심 기능 (Key Features)

### 1. 🤖 실제 AI 웹툰 스토리보드 생성 (Gemini API)
- 일기 작성 홈(`/studio`)에서 일기를 입력하면 `@google/genai` SDK 및 **Gemini API**(`gemini-3.8-flash` / `gemini-2.5-flash`)를 통해 4컷 분할 스토리콘티, 인스타 캡션, 해시태그를 자동 생성합니다.
- API 키가 없는 로컬 개발 환경에서도 즉시 구동될 수 있도록 감성 폴백 스토리가 안전하게 내장되어 있습니다.

### 2. 🖐️ 드래그 앤 드롭 4컷 웹툰 에디터 (`/editor`)
- **말풍선 자유 이동**: 컷 안에서 말풍선을 마우스 및 모바일 터치 드래그로 원하는 위치로 자유롭게 이동할 수 있습니다.
- **4종 감성 폰트 일괄 변경**:
  - `바른히피체` (`Gaegu`): 손글씨 느낌의 편안한 일상툰 서체
  - `나눔손글씨` (`Nanum Pen Script`): 펜으로 꾹꾹 눌러쓴 감성 서체
  - `주아체` (`Jua`): 통통 튀는 발랄한 코믹 서체
  - `깔끔고딕` (`Plus Jakarta Sans`): 모던하고 깔끔한 웹툰 본문 서체
- **의성어/효과음 스티커 키트**: `💨 휴우-`, `⚡ 두둥!`, `💖 심쿵-!`, `🐾 촉촉-`, `✨ 샤랄라`, `🔥 활활!`, `😭 흑흑` 등 감성 스티커를 클릭하여 컷에 부착하고, 드래그 이동 및 `✕` 삭제를 지원합니다.

### 3. 📸 인스타그램 규격 고해상도 PNG Canvas 다운로드
- **인스타 피드 규격 (4:5, 1080×1350 px)**
- **정사각형 컷 규격 (1:1, 1080×1080 px)**
- **세로 전체 웹툰 스트립 (1080×2400 px)**
- HTML5 Canvas를 이용해 제목, 에피소드 날짜, 각 컷별 이미지, 사용자가 이동시킨 말풍선 및 선택 서체, 부착한 효과음 스티커까지 완벽하게 합성하여 한 번에 PNG 파일로 내려받을 수 있습니다.

### 4. 📅 영구 보관 다이어리 아카이브 (`/archive`)
- 작성하고 수정한 웹툰 일기를 브라우저 `localStorage`(`toonlog_saved_diaries`)에 자동 영구 보관합니다.
- **캘린더 뷰**와 **갤러리 카드 뷰**를 전환해가며 날짜별 일기를 조회할 수 있습니다.
- 저장된 웹툰 카드를 클릭하여 4컷 상세보기를 열람하고, **[에디터에서 수정 & 편집]**을 눌러 언제든지 다시 편집할 수 있습니다.

### 5. 💻 반응형 듀얼 메뉴바 레이아웃
- **PC 데스크톱 (`>= 768px`)**: 화면 좌측에 260px 폭의 깔끔한 전용 사이드바가 고정 배치되어 메인 대시보드를 가리지 않고 넓고 쾌적하게 사용할 수 있습니다.
- **모바일 화면 (`< 768px`)**: 하단 독(Bottom Dock)으로 자동 전환되어 스마트폰에서도 편리하게 모든 메뉴를 탐색할 수 있습니다.

---

## 📁 프로젝트 구조 (Project Structure)

```
Toon-Log/
├── server.js                        # Express 서버 & Gemini AI 엔드포인트 & 반응형 주입
├── package.json                     # 프로젝트 설정 및 npm 의존성
├── .env.example                     # 환경 변수 템플릿 (GEMINI_API_KEY)
├── .gitignore                       # 깃허브 제외 파일 목록
├── README.md                        # 프로젝트 설명 문서
│
├── stitch_duplicate_of_ai/
│   ├── _4/code.html                 # 🏠 메인 스튜디오 (일기 입력 & AI 스토리보드 생성)
│   ├── _2/code.html                 # ✏️ 4컷 웹툰 에디터 (말풍선/폰트/스티커/Canvas)
│   ├── _6/code.html                 # 📅 내 웹툰 다이어리 (캘린더 & 갤러리 보관함)
│   ├── 24/code.html                 # 🎨 24종 화풍 프리셋 쇼케이스 갤러리
│   ├── _1/code.html                 # 📜 8컷 스크롤 웹툰 에디터
│   ├── _11/code.html                # 👤 SeedLock™ 고정 캐릭터 설정 금고
│   ├── ai_1/code.html               # 📷 내 사진 + 화풍 결합 듀얼 페르소나
│   ├── _7/code.html                 # 🧪 커스텀 LoRA 화풍 학습 스튜디오
│   ├── _3/code.html                 # 📲 인스타그램 자동 연동 & 발행 관리
│   ├── _12/code.html                # 📖 실물 만화책(단행본) 인쇄 주문
│   ├── _8/code.html                 # 💎 크리에이터 요금제 & 멤버십
│   └── toonlog_1/code.html          # 🧩 ToonLog 디자인 시스템 토큰 쇼케이스
└── public/
    └── assets/                      # 프로젝트 정적 리소스 및 이미지
```

---

## 🚀 빠른 시작 (Getting Started)

### 1. 레포지토리 복제 및 패키지 설치
```bash
git clone https://github.com/pjh747811-afk/Toon-Log.git
cd Toon-Log
npm install
```

### 2. 환경 변수 설정
`.env.example` 파일을 복사하여 `.env`를 생성하고 본인의 Google Gemini API 키를 입력합니다.
```bash
cp .env.example .env
```
`.env` 파일 내용:
```ini
PORT=3000
GEMINI_API_KEY=your_gemini_api_key_here
```
*(Gemini API 키가 없어도 내장된 Mock 스토리보드 엔진으로 모든 에디터와 다운로드 기능을 정상 체험할 수 있습니다.)*

### 3. 개발 서버 실행
```bash
npm run dev
```
브라우저에서 `http://localhost:3000`으로 접속합니다.

---

## 📤 깃허브(GitHub) 업로드 방법

본 프로젝트를 깃허브 저장소(`pjh747811-afk/Toon-Log`)에 커밋하고 푸시하려면 터미널에서 다음 명령어를 순서대로 실행하세요:

```bash
# 1. 깃 초기화 및 사용자 정보 설정 (최초 1회)
git init
git config user.name "pjh747811-afk"
git config user.email "pjh747811@gmail.com"

# 2. 변경된 파일 전체 추가
git add .

# 3. 커밋 생성
git commit -m "feat: ToonLog AI 4-cut webtoon platform with PC sidebar layout, Gemini story generator, draggable bubble editor, and canvas export"

# 4. 원격 저장소 연결 (이미 등록되어 있다면 건너뛰기)
git remote add origin https://github.com/pjh747811-afk/Toon-Log.git

# 5. 메인 브랜치 설정 및 푸시
git branch -M main
git push -u origin main
```

*(기존 원격 저장소에 커밋 이력이 있는 경우 `git push -u origin main --force`를 사용하거나 `git pull origin main --rebase` 후 푸시할 수 있습니다.)*

---

## 📄 라이선스 (License)

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
