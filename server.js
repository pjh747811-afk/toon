import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { exec } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const HOST = '0.0.0.0';

app.use(express.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Route dictionary mapping path names to HTML files
const ROUTES = {
  // Main Studio
  '/': 'stitch_duplicate_of_ai/_4/code.html',
  '/studio': 'stitch_duplicate_of_ai/_4/code.html',
  // 4-Cut & 8-Cut Webtoon Editors
  '/editor': 'stitch_duplicate_of_ai/_2/code.html',
  '/editor/4cut': 'stitch_duplicate_of_ai/_2/code.html',
  '/editor/8cut': 'stitch_duplicate_of_ai/_1/code.html',
  // Styles Library
  '/styles': 'stitch_duplicate_of_ai/24/code.html',
  '/style-gallery': 'stitch_duplicate_of_ai/24/code.html',
  // Story Feed
  '/feed': 'stitch_duplicate_of_ai/_5/code.html',
  '/feed-and-explore': 'stitch_duplicate_of_ai/_5/code.html',
  // Archive & Calendar
  '/archive': 'stitch_duplicate_of_ai/_6/code.html',
  '/my-archive': 'stitch_duplicate_of_ai/_6/code.html',
  // Character & Persona
  '/character': 'stitch_duplicate_of_ai/_11/code.html',
  '/character-studio': 'stitch_duplicate_of_ai/_11/code.html',
  '/character-settings': 'stitch_duplicate_of_ai/_11/code.html',
  '/character-vault': 'stitch_duplicate_of_ai/_11/code.html',
  '/dual-persona': 'stitch_duplicate_of_ai/ai_1/code.html',
  // Custom LoRA Tuning
  '/custom-style': 'stitch_duplicate_of_ai/_7/code.html',
  '/lora': 'stitch_duplicate_of_ai/_7/code.html',
  // Instagram Sync
  '/instagram': 'stitch_duplicate_of_ai/_3/code.html',
  '/instagram-sync': 'stitch_duplicate_of_ai/_3/code.html',
  '/instagram_publish': 'stitch_duplicate_of_ai/_3/code.html',
  // Pricing
  '/pricing': 'stitch_duplicate_of_ai/_8/code.html',
  '/pricing-and-membership': 'stitch_duplicate_of_ai/_8/code.html',
  // Physical Book Publishing
  '/book': 'stitch_duplicate_of_ai/_12/code.html',
  '/book-publish': 'stitch_duplicate_of_ai/_12/code.html',
  '/book/specs': 'stitch_duplicate_of_ai/_13/code.html',
  // Motion Effects
  '/motion': 'stitch_duplicate_of_ai/_14/code.html',
  // Design System Showcase
  '/design-system': 'stitch_duplicate_of_ai/toonlog_1/code.html',
  '/design-system-showcase': 'stitch_duplicate_of_ai/toonlog_1/code.html'
};

// 5-Color Harmony Stylesheet (sampled from user's attached image)
const PALETTE_THEME_CSS = `
<style id="toonlog-palette-theme">
  :root {
    --tl-coral: #fe5e7f;      /* 1. Vibrant Coral Pink (Primary Brand) */
    --tl-blush: #fea7a7;      /* 2. Soft Peach Blush (Secondary Accent) */
    --tl-apricot: #ffd7a5;    /* 3. Warm Peach Cream (Tertiary & Highlights) */
    --tl-mint: #ccffc0;       /* 4. Pastel Spring Mint (Success & Badges) */
    --tl-cyan: #9cf6fe;       /* 5. Airy Sky Cyan (Container & Glow) */
    
    --tl-bg-warm: #fffcfb;
    --tl-surface-card: #ffffff;
    --tl-border-soft: #fde6dc;
  }

  /* Layout adaptation: PC has fixed left nav (260px), Mobile has bottom nav */
  @media (min-width: 768px) {
    #mobile-drawer-backdrop,
    #mobile-screens-drawer,
    #toonlog-mobile-bottom-dock {
      display: none !important;
      visibility: hidden !important;
      pointer-events: none !important;
      opacity: 0 !important;
    }

    #toonlog-pc-sidebar {
      display: flex !important;
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      bottom: 0 !important;
      width: 260px !important;
      min-width: 260px !important;
      max-width: 260px !important;
      height: 100vh !important;
      z-index: 40 !important;
      background-color: #ffffff !important;
      border-right: 1px solid #fed7aa !important;
      box-shadow: 4px 0 20px rgba(0, 0, 0, 0.05) !important;
      overflow-y: auto !important;
      box-sizing: border-box !important;
    }

    body {
      padding-left: 260px !important;
      padding-bottom: 1rem !important;
      margin: 0 !important;
      box-sizing: border-box !important;
      overflow-x: hidden !important;
    }

    header.fixed, .fixed.top-0 {
      left: 260px !important;
      width: calc(100% - 260px) !important;
      max-width: calc(100% - 260px) !important;
      box-sizing: border-box !important;
    }

    main {
      width: 100% !important;
      max-width: 100% !important;
      box-sizing: border-box !important;
    }

    /* Hide old duplicate sidebars from prototype files so there's only one unified left bar */
    body > aside:not(#toonlog-pc-sidebar) {
      display: none !important;
    }
    body > div.pl-64, body > div.pl-72 {
      padding-left: 0 !important;
    }
  }

  @media (max-width: 767px) {
    #toonlog-pc-sidebar {
      display: none !important;
      visibility: hidden !important;
      pointer-events: none !important;
    }

    #toonlog-mobile-bottom-dock {
      display: flex !important;
      position: fixed !important;
      bottom: 0 !important;
      left: 0 !important;
      right: 0 !important;
      height: 60px !important;
      z-index: 40 !important;
      background: #ffffff !important;
      border-top: 1px solid #fed7aa !important;
      box-shadow: 0 -4px 16px rgba(254, 94, 127, 0.08) !important;
    }

    body {
      padding-left: 0 !important;
      padding-bottom: 70px !important;
      margin: 0 !important;
      box-sizing: border-box !important;
    }

    header.fixed, .fixed.top-0 {
      left: 0 !important;
      width: 100% !important;
      box-sizing: border-box !important;
    }

    body > aside:not(#toonlog-pc-sidebar) {
      display: none !important;
    }
    body > div.pl-64, body > div.pl-72 {
      padding-left: 0 !important;
    }
  }

  /* Color Palette Harmony Overrides */
  .bg-primary {
    background-color: var(--tl-coral) !important;
    color: #ffffff !important;
  }
  .text-primary {
    color: var(--tl-coral) !important;
  }
  .border-primary {
    border-color: var(--tl-coral) !important;
  }
  .hover\\:bg-primary:hover {
    background-color: #e6496b !important;
  }

  /* Primary Container & Cyan Accents */
  .bg-primary-container, .bg-primary-container\\/20, .bg-primary-container\\/30 {
    background-color: var(--tl-cyan) !important;
    color: #01434c !important;
  }
  .text-on-primary-container, .text-primary-container {
    color: #01434c !important;
  }
  .hover\\:bg-primary-container:hover {
    background-color: #8bebf6 !important;
  }

  /* Secondary Accents (Blush & Mint) */
  .bg-secondary-container, .bg-secondary-container\\/25, .bg-secondary-container\\/40 {
    background-color: var(--tl-mint) !important;
    color: #104316 !important;
  }
  .text-on-secondary-container {
    color: #104316 !important;
  }
  .bg-secondary {
    background-color: var(--tl-blush) !important;
    color: #3b1019 !important;
  }

  /* Tertiary Accents (Warm Apricot) */
  .bg-tertiary-container, .bg-tertiary-container\\/15, .bg-tertiary-container\\/30 {
    background-color: var(--tl-apricot) !important;
    color: #593500 !important;
  }
  .text-tertiary {
    color: #d97816 !important;
  }
  .text-on-tertiary-container {
    color: #593500 !important;
  }

  /* Atmospheric gradients with the 5 palette colors */
  .from-primary-container {
    --tw-gradient-from: var(--tl-cyan) var(--tw-gradient-from-position) !important;
    --tw-gradient-to: rgb(156 246 254 / 0) var(--tw-gradient-to-position) !important;
    --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to) !important;
  }
  .to-primary {
    --tw-gradient-to: var(--tl-coral) var(--tw-gradient-to-position) !important;
  }
  
  /* Brand Logo & Accent gradient */
  .toonlog-logo-gradient {
    background: linear-gradient(135deg, var(--tl-coral) 0%, var(--tl-blush) 35%, var(--tl-apricot) 70%, var(--tl-cyan) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .toonlog-palette-strip {
    background: linear-gradient(to right, #fe5e7f 0%, #fe5e7f 20%, #fea7a7 20%, #fea7a7 40%, #ffd7a5 40%, #ffd7a5 60%, #ccffc0 60%, #ccffc0 80%, #9cf6fe 80%, #9cf6fe 100%);
  }

  /* Soft glowing shadow with coral tint */
  .shadow-palette-glow {
    box-shadow: 0 4px 20px -2px rgba(254, 94, 127, 0.22);
  }

  /* Active Sidebar Item */
  .nav-active-item {
    background: linear-gradient(135deg, rgba(254, 94, 127, 0.15), rgba(156, 246, 254, 0.2)) !important;
    color: #fe5e7f !important;
    font-weight: 700 !important;
    border-left: 4px solid #fe5e7f !important;
  }
</style>
`;

// Responsive Navigation: PC on Left, Mobile at Bottom
const NAVIGATION_HTML_AND_SCRIPT = `
<!-- ========================================== -->
<!-- ToonLog Harmonious Navigation Architecture -->
<!-- PC: Left Sidebar | Mobile: Bottom Dock     -->
<!-- ========================================== -->

<!-- 1. PC Left Navigation Bar (Visible on md: and above) -->
<aside id="toonlog-pc-sidebar" class="flex flex-col justify-between select-none">
  <div class="flex flex-col">
    <!-- Brand Header -->
    <div class="p-4 border-b border-[#fde8de] bg-gradient-to-b from-[#fff7f5] to-transparent">
      <a href="/studio" class="flex items-center gap-2.5 group">
        <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#fe5e7f] via-[#fea7a7] to-[#ffd7a5] flex items-center justify-center shadow-[0_4px_12px_rgba(254,94,127,0.3)] group-hover:scale-105 transition-transform">
          <span class="material-symbols-outlined text-white text-[22px]">auto_stories</span>
        </div>
        <div class="flex flex-col">
          <div class="flex items-center gap-1.5">
            <span class="font-extrabold text-xl tracking-tight text-slate-900">Toon<span class="text-[#fe5e7f]">Log</span></span>
            <span class="px-1.5 py-0.5 rounded-full bg-[#ccffc0] text-[#134418] text-[10px] font-bold tracking-wider">BETA</span>
          </div>
          <span class="text-[11px] text-slate-500 font-medium">AI 4컷 웹툰 다이어리</span>
        </div>
      </a>
      
      <!-- 5-Color Harmony Palette Strip -->
      <div class="mt-3 flex flex-col gap-1">
        <div class="w-full h-1.5 rounded-full toonlog-palette-strip shadow-sm"></div>
        <div class="flex items-center justify-between text-[10px] text-slate-400 font-semibold px-0.5">
          <span>Coral</span>
          <span>Blush</span>
          <span>Peach</span>
          <span>Mint</span>
          <span>Cyan</span>
        </div>
      </div>
    </div>

    <!-- Quick Status Pill -->
    <div class="px-3 pt-3">
      <div class="p-2.5 rounded-xl bg-gradient-to-r from-[#fff5f3] to-[#f4fdff] border border-[#fde8de] flex items-center justify-between shadow-xs">
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-[#fe5e7f] animate-ping"></span>
          <span class="text-[12px] font-semibold text-slate-700">무료 생성 혜택</span>
        </div>
        <span class="text-[11px] px-2 py-0.5 rounded-full bg-[#fe5e7f] text-white font-bold">1회 남음</span>
      </div>
    </div>

    <!-- Navigation Section Group: 핵심 창작 스튜디오 -->
    <div class="px-3 pt-4">
      <div class="px-2 pb-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
        <span class="material-symbols-outlined text-[14px] text-[#fe5e7f]">draw</span>
        <span>스튜디오 & 에디터</span>
      </div>
      <nav class="flex flex-col gap-1 text-[13px]" id="pc-nav-links-1">
        <a href="/studio" data-route="/studio" class="pc-nav-item flex items-center justify-between px-3 py-2 rounded-xl text-slate-700 hover:bg-[#fff0f3] hover:text-[#fe5e7f] transition-all">
          <div class="flex items-center gap-2.5">
            <span class="material-symbols-outlined text-[20px] text-[#fe5e7f]">edit_note</span>
            <span class="font-medium">홈 & 일기 생성</span>
          </div>
          <span class="text-[10px] px-1.5 py-0.5 rounded-md bg-[#9cf6fe]/40 text-[#004d57] font-semibold">AI스튜디오</span>
        </a>
        <a href="/editor" data-route="/editor" class="pc-nav-item flex items-center justify-between px-3 py-2 rounded-xl text-slate-700 hover:bg-[#fff0f3] hover:text-[#fe5e7f] transition-all">
          <div class="flex items-center gap-2.5">
            <span class="material-symbols-outlined text-[20px] text-[#fe5e7f]">dashboard_customize</span>
            <span class="font-medium">4컷 캔버스 에디터</span>
          </div>
          <span class="text-[10px] px-1.5 py-0.5 rounded-md bg-[#ccffc0]/60 text-[#134418] font-semibold">인스타</span>
        </a>
        <a href="/editor/8cut" data-route="/editor/8cut" class="pc-nav-item flex items-center justify-between px-3 py-2 rounded-xl text-slate-700 hover:bg-[#fff0f3] hover:text-[#fe5e7f] transition-all">
          <div class="flex items-center gap-2.5">
            <span class="material-symbols-outlined text-[20px] text-[#fea7a7]">view_stream</span>
            <span class="font-medium">8컷 스크롤 웹툰</span>
          </div>
          <span class="text-[10px] px-1.5 py-0.5 rounded-md bg-[#ffd7a5]/60 text-[#523200] font-semibold">세로스크롤</span>
        </a>
        <a href="/styles" data-route="/styles" class="pc-nav-item flex items-center justify-between px-3 py-2 rounded-xl text-slate-700 hover:bg-[#fff0f3] hover:text-[#fe5e7f] transition-all">
          <div class="flex items-center gap-2.5">
            <span class="material-symbols-outlined text-[20px] text-[#ffd7a5]">palette</span>
            <span class="font-medium">24종 화풍 라이브러리</span>
          </div>
          <span class="text-[10px] px-1.5 py-0.5 rounded-md bg-[#fe5e7f]/15 text-[#fe5e7f] font-bold">24화풍</span>
        </a>
      </nav>
    </div>

    <!-- Navigation Section Group: 페르소나 & 보관함 -->
    <div class="px-3 pt-3">
      <div class="px-2 pb-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
        <span class="material-symbols-outlined text-[14px] text-[#9cf6fe]">account_circle</span>
        <span>캐릭터 & 아카이브</span>
      </div>
      <nav class="flex flex-col gap-1 text-[13px]" id="pc-nav-links-2">
        <a href="/character" data-route="/character" class="pc-nav-item flex items-center justify-between px-3 py-2 rounded-xl text-slate-700 hover:bg-[#fff0f3] hover:text-[#fe5e7f] transition-all">
          <div class="flex items-center gap-2.5">
            <span class="material-symbols-outlined text-[20px] text-[#fe5e7f]">face</span>
            <span class="font-medium">고정 캐릭터 (SeedLock™)</span>
          </div>
          <span class="text-[10px] px-1.5 py-0.5 rounded-md bg-[#ccffc0]/70 text-[#134418] font-bold">고정</span>
        </a>
        <a href="/dual-persona" data-route="/dual-persona" class="pc-nav-item flex items-center justify-between px-3 py-2 rounded-xl text-slate-700 hover:bg-[#fff0f3] hover:text-[#fe5e7f] transition-all">
          <div class="flex items-center gap-2.5">
            <span class="material-symbols-outlined text-[20px] text-[#fea7a7]">add_photo_alternate</span>
            <span class="font-medium">내 사진 + 화풍 결합</span>
          </div>
          <span class="text-[10px] px-1.5 py-0.5 rounded-md bg-[#9cf6fe]/50 text-[#004d57] font-semibold">듀얼</span>
        </a>
        <a href="/custom-style" data-route="/custom-style" class="pc-nav-item flex items-center justify-between px-3 py-2 rounded-xl text-slate-700 hover:bg-[#fff0f3] hover:text-[#fe5e7f] transition-all">
          <div class="flex items-center gap-2.5">
            <span class="material-symbols-outlined text-[20px] text-[#ffd7a5]">tune</span>
            <span class="font-medium">커스텀 LoRA 화풍</span>
          </div>
          <span class="text-[10px] px-1.5 py-0.5 rounded-md bg-[#ffd7a5]/60 text-[#523200] font-semibold">학습</span>
        </a>
        <a href="/archive" data-route="/archive" class="pc-nav-item flex items-center justify-between px-3 py-2 rounded-xl text-slate-700 hover:bg-[#fff0f3] hover:text-[#fe5e7f] transition-all">
          <div class="flex items-center gap-2.5">
            <span class="material-symbols-outlined text-[20px] text-[#fe5e7f]">calendar_month</span>
            <span class="font-medium">내 웹툰 다이어리</span>
          </div>
          <span class="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 font-semibold">캘린더</span>
        </a>
        <a href="/feed" data-route="/feed" class="pc-nav-item flex items-center justify-between px-3 py-2 rounded-xl text-slate-700 hover:bg-[#fff0f3] hover:text-[#fe5e7f] transition-all">
          <div class="flex items-center gap-2.5">
            <span class="material-symbols-outlined text-[20px] text-[#fea7a7]">explore</span>
            <span class="font-medium">스토리 피드 & 탐색</span>
          </div>
          <span class="text-[10px] px-1.5 py-0.5 rounded-md bg-red-100 text-red-600 font-bold">HOT</span>
        </a>
      </nav>
    </div>

    <!-- Navigation Section Group: 출판 & 퍼블리싱 -->
    <div class="px-3 pt-3">
      <div class="px-2 pb-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
        <span class="material-symbols-outlined text-[14px] text-[#ccffc0]">auto_stories</span>
        <span>출판 & 퍼블리싱</span>
      </div>
      <nav class="flex flex-col gap-1 text-[13px]" id="pc-nav-links-3">
        <a href="/instagram" data-route="/instagram" class="pc-nav-item flex items-center justify-between px-3 py-2 rounded-xl text-slate-700 hover:bg-[#fff0f3] hover:text-[#fe5e7f] transition-all">
          <div class="flex items-center gap-2.5">
            <span class="material-symbols-outlined text-[20px] text-[#fe5e7f]">share</span>
            <span class="font-medium">인스타그램 자동발행</span>
          </div>
          <span class="text-[10px] px-1.5 py-0.5 rounded-md bg-[#9cf6fe]/40 text-[#004d57] font-semibold">API</span>
        </a>
        <a href="/book" data-route="/book" class="pc-nav-item flex items-center justify-between px-3 py-2 rounded-xl text-slate-700 hover:bg-[#fff0f3] hover:text-[#fe5e7f] transition-all">
          <div class="flex items-center gap-2.5">
            <span class="material-symbols-outlined text-[20px] text-[#ffd7a5]">menu_book</span>
            <span class="font-medium">단행본 만화책 주문</span>
          </div>
          <span class="text-[10px] px-1.5 py-0.5 rounded-md bg-[#ffd7a5]/60 text-[#523200] font-semibold">실물인쇄</span>
        </a>
        <a href="/pricing" data-route="/pricing" class="pc-nav-item flex items-center justify-between px-3 py-2 rounded-xl text-slate-700 hover:bg-[#fff0f3] hover:text-[#fe5e7f] transition-all">
          <div class="flex items-center gap-2.5">
            <span class="material-symbols-outlined text-[20px] text-[#fea7a7]">loyalty</span>
            <span class="font-medium">멤버십 & 요금제</span>
          </div>
          <span class="text-[10px] px-1.5 py-0.5 rounded-md bg-[#ccffc0] text-[#134418] font-bold">PRO</span>
        </a>
        <a href="/motion" data-route="/motion" class="pc-nav-item flex items-center justify-between px-3 py-2 rounded-xl text-slate-700 hover:bg-[#fff0f3] hover:text-[#fe5e7f] transition-all">
          <div class="flex items-center gap-2.5">
            <span class="material-symbols-outlined text-[20px] text-[#9cf6fe]">motion_photos_on</span>
            <span class="font-medium">모션 & 트랜지션</span>
          </div>
          <span class="text-[10px] px-1.5 py-0.5 rounded-md bg-purple-100 text-purple-700 font-semibold">NEW</span>
        </a>
        <a href="/design-system" data-route="/design-system" class="pc-nav-item flex items-center justify-between px-3 py-2 rounded-xl text-slate-700 hover:bg-[#fff0f3] hover:text-[#fe5e7f] transition-all">
          <div class="flex items-center gap-2.5">
            <span class="material-symbols-outlined text-[20px] text-[#ccffc0]">token</span>
            <span class="font-medium">디자인 시스템 쇼케이스</span>
          </div>
          <span class="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500 font-medium">토큰</span>
        </a>
      </nav>

      <!-- GitHub Push / Sync Quick Action Button -->
      <div class="pt-3 px-1">
        <button type="button" onclick="window.openGitHubSyncModal()" class="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white hover:from-[#fe5e7f] hover:to-[#fea7a7] shadow-sm transition-all group cursor-pointer">
          <div class="flex items-center gap-2">
            <svg class="w-4 h-4 fill-current text-white group-hover:scale-110 transition-transform" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
            <span class="text-xs font-bold text-white tracking-tight">GitHub 푸시 / 백업</span>
          </div>
          <span class="text-[9px] px-1.5 py-0.5 rounded-full bg-[#fe5e7f] text-white font-extrabold animate-pulse">해결</span>
        </button>
      </div>
    </div>
  </div>

  <!-- Bottom User Profile Card -->
  <div class="p-3 border-t border-[#fde8de] bg-gradient-to-t from-[#fff7f5] to-transparent">
    <div class="p-2.5 rounded-2xl bg-white border border-[#fde8de] flex items-center justify-between shadow-xs">
      <div class="flex items-center gap-2.5">
        <div class="relative">
          <div class="w-9 h-9 rounded-full bg-gradient-to-tr from-[#fe5e7f] to-[#ffd7a5] p-0.5">
            <img class="w-full h-full rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBpZ96hsN26f5FwrDGADnhDyO_loMndTfK_gQxOhWkNOVf_6uXj2GgzdzBbQrqPTDfBGSnv2uEu6eqEzu_B8mGE-_9ZOH3dmppvTAANFZzBncnb3Hrt4B5j7NIBPXdQKJr0vzL3RT6WGjIQx7aXQ9riN_NoanuGT-qJ447Vn4gdQYs5KEBy4oI7YLUjLyjxuA-troRp4qaL9aOgshR-V4u-9cqK0KvyZujHUwIsyPg7" alt="Profile">
          </div>
          <span class="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#ccffc0] ring-2 ring-white"></span>
        </div>
        <div class="flex flex-col">
          <span class="text-[13px] font-bold text-slate-800 leading-tight">소라 작가님</span>
          <span class="text-[11px] text-[#fe5e7f] font-semibold">Pro Creator</span>
        </div>
      </div>
      <a href="/pricing" class="w-7 h-7 rounded-full bg-[#fff0f3] text-[#fe5e7f] flex items-center justify-center hover:bg-[#fe5e7f] hover:text-white transition-colors" title="요금제 관리">
        <span class="material-symbols-outlined text-[16px]">settings</span>
      </a>
    </div>
  </div>
</aside>

<!-- 2. Mobile Bottom Navigation Dock (Visible on mobile < 768px) -->
<nav id="toonlog-mobile-bottom-dock" class="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-2xl border-t border-[#ffd7a5]/60 shadow-[0_-4px_20px_rgba(254,94,127,0.12)] z-[9990] px-2 py-1.5 flex items-center justify-around select-none">
  <!-- Tab 1: Studio -->
  <a href="/studio" data-route="/studio" class="mobile-nav-tab flex flex-col items-center justify-center py-1 px-3 rounded-xl text-slate-600 active:scale-95 transition-all">
    <span class="material-symbols-outlined text-[22px]">edit_note</span>
    <span class="text-[10px] font-semibold mt-0.5">스튜디오</span>
  </a>

  <!-- Tab 2: 4-Cut Editor -->
  <a href="/editor" data-route="/editor" class="mobile-nav-tab flex flex-col items-center justify-center py-1 px-3 rounded-xl text-slate-600 active:scale-95 transition-all">
    <span class="material-symbols-outlined text-[22px]">dashboard_customize</span>
    <span class="text-[10px] font-semibold mt-0.5">4컷에디터</span>
  </a>

  <!-- Tab 3: Style Presets -->
  <a href="/styles" data-route="/styles" class="mobile-nav-tab flex flex-col items-center justify-center py-1 px-3 rounded-xl text-slate-600 active:scale-95 transition-all">
    <span class="material-symbols-outlined text-[22px]">palette</span>
    <span class="text-[10px] font-semibold mt-0.5">화풍24종</span>
  </a>

  <!-- Tab 4: Archive Calendar -->
  <a href="/archive" data-route="/archive" class="mobile-nav-tab flex flex-col items-center justify-center py-1 px-3 rounded-xl text-slate-600 active:scale-95 transition-all">
    <span class="material-symbols-outlined text-[22px]">calendar_month</span>
    <span class="text-[10px] font-semibold mt-0.5">다이어리</span>
  </a>

  <!-- Tab 5: All Screens Trigger (Drawer) -->
  <button id="mobile-all-screens-btn" type="button" class="mobile-nav-tab flex flex-col items-center justify-center py-1 px-3 rounded-xl text-[#fe5e7f] active:scale-95 transition-all">
    <div class="w-6 h-6 rounded-lg bg-[#fff0f3] flex items-center justify-center text-[#fe5e7f]">
      <span class="material-symbols-outlined text-[18px]">menu</span>
    </div>
    <span class="text-[10px] font-bold mt-0.5 text-[#fe5e7f]">전체메뉴</span>
  </button>
</nav>

<!-- 3. Mobile All-Screens Sliding Drawer Modal -->
<div id="mobile-drawer-backdrop" class="hidden fixed inset-0 bg-black/50 backdrop-blur-xs z-50"></div>
<div id="mobile-screens-drawer" class="hidden fixed bottom-0 left-0 right-0 max-h-[85vh] bg-white rounded-t-3xl shadow-2xl z-50 flex-col">
  <div class="p-4 border-b border-slate-100 flex items-center justify-between">
    <div class="flex items-center gap-2">
      <div class="w-7 h-7 rounded-lg bg-gradient-to-br from-[#fe5e7f] to-[#ffd7a5] flex items-center justify-center text-white">
        <span class="material-symbols-outlined text-[16px]">apps</span>
      </div>
      <div>
        <h3 class="font-bold text-slate-900 text-sm">ToonLog 전체 화면 이동</h3>
        <p class="text-[11px] text-slate-500">원하시는 화면으로 바로 이동하세요</p>
      </div>
    </div>
    <button id="mobile-drawer-close" class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900" type="button">
      <span class="material-symbols-outlined text-[18px]">close</span>
    </button>
  </div>
  
  <div class="w-full h-1.5 toonlog-palette-strip"></div>

  <div class="p-4 overflow-y-auto space-y-3">
    <!-- Category 1 -->
    <div>
      <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">스튜디오 & 에디터</span>
      <div class="grid grid-cols-2 gap-2 mt-1.5">
        <a href="/studio" class="p-2.5 rounded-xl border border-slate-100 bg-[#fffbfc] hover:border-[#fe5e7f] flex items-center gap-2">
          <span class="material-symbols-outlined text-[#fe5e7f] text-[20px]">edit_note</span>
          <span class="text-xs font-semibold text-slate-800">일기 생성 홈</span>
        </a>
        <a href="/editor" class="p-2.5 rounded-xl border border-slate-100 bg-[#fffbfc] hover:border-[#fe5e7f] flex items-center gap-2">
          <span class="material-symbols-outlined text-[#fe5e7f] text-[20px]">dashboard_customize</span>
          <span class="text-xs font-semibold text-slate-800">4컷 캔버스</span>
        </a>
        <a href="/editor/8cut" class="p-2.5 rounded-xl border border-slate-100 bg-[#fffbfc] hover:border-[#fe5e7f] flex items-center gap-2">
          <span class="material-symbols-outlined text-[#fea7a7] text-[20px]">view_stream</span>
          <span class="text-xs font-semibold text-slate-800">8컷 스크롤</span>
        </a>
        <a href="/styles" class="p-2.5 rounded-xl border border-slate-100 bg-[#fffbfc] hover:border-[#fe5e7f] flex items-center gap-2">
          <span class="material-symbols-outlined text-[#ffd7a5] text-[20px]">palette</span>
          <span class="text-xs font-semibold text-slate-800">화풍 24종</span>
        </a>
      </div>
    </div>

    <!-- Category 2 -->
    <div>
      <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">캐릭터 & 보관함</span>
      <div class="grid grid-cols-2 gap-2 mt-1.5">
        <a href="/character" class="p-2.5 rounded-xl border border-slate-100 bg-[#fffbfc] hover:border-[#fe5e7f] flex items-center gap-2">
          <span class="material-symbols-outlined text-[#fe5e7f] text-[20px]">face</span>
          <span class="text-xs font-semibold text-slate-800">고정 캐릭터</span>
        </a>
        <a href="/dual-persona" class="p-2.5 rounded-xl border border-slate-100 bg-[#fffbfc] hover:border-[#fe5e7f] flex items-center gap-2">
          <span class="material-symbols-outlined text-[#fea7a7] text-[20px]">add_photo_alternate</span>
          <span class="text-xs font-semibold text-slate-800">사진+화풍 결합</span>
        </a>
        <a href="/custom-style" class="p-2.5 rounded-xl border border-slate-100 bg-[#fffbfc] hover:border-[#fe5e7f] flex items-center gap-2">
          <span class="material-symbols-outlined text-[#ffd7a5] text-[20px]">tune</span>
          <span class="text-xs font-semibold text-slate-800">LoRA 화풍</span>
        </a>
        <a href="/archive" class="p-2.5 rounded-xl border border-slate-100 bg-[#fffbfc] hover:border-[#fe5e7f] flex items-center gap-2">
          <span class="material-symbols-outlined text-[#fe5e7f] text-[20px]">calendar_month</span>
          <span class="text-xs font-semibold text-slate-800">내 캘린더</span>
        </a>
        <a href="/feed" class="p-2.5 rounded-xl border border-slate-100 bg-[#fffbfc] hover:border-[#fe5e7f] flex items-center gap-2">
          <span class="material-symbols-outlined text-[#fea7a7] text-[20px]">explore</span>
          <span class="text-xs font-semibold text-slate-800">스토리 피드</span>
        </a>
        <a href="/motion" class="p-2.5 rounded-xl border border-slate-100 bg-[#fffbfc] hover:border-[#fe5e7f] flex items-center gap-2">
          <span class="material-symbols-outlined text-[#9cf6fe] text-[20px]">motion_photos_on</span>
          <span class="text-xs font-semibold text-slate-800">모션 연출</span>
        </a>
      </div>
    </div>

    <!-- Category 3 -->
    <div>
      <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">출판 & 설정</span>
      <div class="grid grid-cols-2 gap-2 mt-1.5">
        <a href="/instagram" class="p-2.5 rounded-xl border border-slate-100 bg-[#fffbfc] hover:border-[#fe5e7f] flex items-center gap-2">
          <span class="material-symbols-outlined text-[#fe5e7f] text-[20px]">share</span>
          <span class="text-xs font-semibold text-slate-800">인스타 발행</span>
        </a>
        <a href="/book" class="p-2.5 rounded-xl border border-slate-100 bg-[#fffbfc] hover:border-[#fe5e7f] flex items-center gap-2">
          <span class="material-symbols-outlined text-[#ffd7a5] text-[20px]">menu_book</span>
          <span class="text-xs font-semibold text-slate-800">단행본 주문</span>
        </a>
        <a href="/pricing" class="p-2.5 rounded-xl border border-slate-100 bg-[#fffbfc] hover:border-[#fe5e7f] flex items-center gap-2">
          <span class="material-symbols-outlined text-[#fea7a7] text-[20px]">loyalty</span>
          <span class="text-xs font-semibold text-slate-800">멤버십 요금제</span>
        </a>
        <a href="/design-system" class="p-2.5 rounded-xl border border-slate-100 bg-[#fffbfc] hover:border-[#fe5e7f] flex items-center gap-2">
          <span class="material-symbols-outlined text-[#ccffc0] text-[20px]">token</span>
          <span class="text-xs font-semibold text-slate-800">디자인 시스템</span>
        </a>
      </div>
    </div>

    <!-- Mobile GitHub Action -->
    <div class="pt-2 border-t border-slate-100">
      <button type="button" onclick="window.openGitHubSyncModal()" class="w-full p-3 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between shadow-md cursor-pointer">
        <div class="flex items-center gap-2.5">
          <svg class="w-5 h-5 fill-current text-white" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
          <div class="text-left">
            <div class="text-xs font-bold text-white">GitHub 푸시 / 백업 도구</div>
            <div class="text-[10px] text-slate-300">토큰 원클릭 푸시 & ZIP 다운로드</div>
          </div>
        </div>
        <span class="text-[10px] px-2 py-1 rounded-lg bg-[#fe5e7f] text-white font-bold">실행</span>
      </button>
    </div>
  </div>
</div>

<!-- 4. GitHub Sync & Push Modal -->
<div id="toonlog-github-modal" class="hidden fixed inset-0 z-[9999] flex items-center justify-center p-4">
  <!-- Backdrop -->
  <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onclick="window.closeGitHubSyncModal()"></div>
  
  <!-- Modal Content Box -->
  <div class="relative bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-xl w-full max-h-[90vh] overflow-y-auto z-10 flex flex-col">
    <!-- Modal Header -->
    <div class="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-t-3xl">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white">
          <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
        </div>
        <div>
          <h3 class="text-base font-bold">ToonLog GitHub 푸시 & 백업</h3>
          <p class="text-xs text-slate-300 font-mono">pjh747811-afk / Toon-Log (main)</p>
        </div>
      </div>
      <button type="button" onclick="window.closeGitHubSyncModal()" class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer">
        <span class="material-symbols-outlined text-[18px]">close</span>
      </button>
    </div>

    <!-- 5-Color Strip -->
    <div class="w-full h-1 toonlog-palette-strip"></div>

    <div class="p-6 space-y-5">
      <!-- Status Badge -->
      <div class="p-3.5 rounded-2xl bg-gradient-to-r from-[#fff0f3] to-[#f4fdff] border border-[#fde8de] flex items-center justify-between">
        <div class="flex items-center gap-2.5">
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <div>
            <div class="text-xs font-bold text-slate-800">로컬 최신 작업 커밋 준비 완료</div>
            <div class="text-[11px] text-slate-500">원격 origin/main 브랜치 바로 위에 대기 중 (1 commit ahead)</div>
          </div>
        </div>
        <span class="text-[11px] px-2.5 py-1 rounded-full bg-[#ccffc0] text-[#134418] font-bold">정상 준비됨</span>
      </div>

      <!-- Solution 1: GitHub PAT Direct Push (Recommended) -->
      <div class="p-4 rounded-2xl bg-white border-2 border-[#fe5e7f]/30 hover:border-[#fe5e7f] transition-all shadow-xs">
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2">
            <span class="w-6 h-6 rounded-full bg-[#fe5e7f] text-white flex items-center justify-center text-xs font-bold">1</span>
            <h4 class="text-sm font-bold text-slate-900">GitHub Personal Access Token (PAT)으로 즉시 푸시</h4>
          </div>
          <span class="text-[10px] px-2 py-0.5 rounded-md bg-[#fe5e7f] text-white font-bold">가장 확실한 해결법</span>
        </div>
        <p class="text-xs text-slate-600 mb-3 leading-relaxed">
          AI Studio UI 버튼에서 오류가 날 때, 본인의 GitHub Personal Access Token을 넣으면 서버가 GitHub 저장소로 <strong>직접 즉시 푸시</strong>합니다.
        </p>

        <div class="space-y-3">
          <div>
            <label class="block text-[11px] font-bold text-slate-700 mb-1">GitHub Personal Access Token (PAT)</label>
            <div class="relative flex items-center">
              <input type="password" id="gh-token-input" placeholder="ghp_... 또는 github_pat_..." class="w-full px-3.5 py-2.5 pr-16 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#fe5e7f] font-mono bg-slate-50 focus:bg-white transition-all">
              <button type="button" onclick="window.toggleTokenVisibility()" class="absolute right-2 text-[11px] px-2 py-1 text-slate-500 hover:text-slate-900 font-medium cursor-pointer">보기</button>
            </div>
            <p class="text-[10px] text-slate-500 mt-1">
              * 토큰 생성: <a href="https://github.com/settings/tokens/new" target="_blank" rel="noreferrer" class="text-[#fe5e7f] font-bold underline">GitHub Tokens (classic) 생성</a>에서 <strong>repo</strong> 체크 후 생성하여 입력
            </p>
          </div>

          <div class="flex items-center justify-between pt-1">
            <label class="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
              <input type="checkbox" id="gh-force-check" class="rounded text-[#fe5e7f] focus:ring-[#fe5e7f]">
              <span class="text-[11px]">충돌 시 강제 푸시 (--force)</span>
            </label>
            <button type="button" id="gh-push-btn" onclick="window.submitGitHubPush()" class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#fe5e7f] to-[#fea7a7] hover:brightness-105 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 cursor-pointer">
              <span class="material-symbols-outlined text-[16px]">upload</span>
              <span>지금 GitHub에 푸시하기</span>
            </button>
          </div>

          <!-- Push Result Output Box -->
          <div id="gh-push-status" class="hidden p-3 rounded-xl bg-slate-900 text-slate-200 text-xs font-mono whitespace-pre-wrap max-h-48 overflow-y-auto border border-slate-700"></div>
        </div>
      </div>

      <!-- Solution 2: One-Click Project ZIP Download -->
      <div class="p-4 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition-all">
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2">
            <span class="w-6 h-6 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-bold">2</span>
            <h4 class="text-sm font-bold text-slate-900">최신 완성 소스코드 전체 ZIP 다운로드</h4>
          </div>
          <span class="text-[10px] px-2 py-0.5 rounded-md bg-[#9cf6fe]/50 text-[#004d57] font-bold">즉시 보관</span>
        </div>
        <p class="text-xs text-slate-600 mb-3 leading-relaxed">
          AI 에디터, Gemini API 연동, 4컷/8컷 캔버스 및 모든 최신 수정본을 ZIP 압축 파일로 내 컴퓨터에 바로 저장합니다.
        </p>
        <a href="/api/download-zip" download="ToonLog-latest.zip" class="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all border border-slate-200">
          <span class="material-symbols-outlined text-[16px]">download</span>
          <span>ToonLog 프로젝트 전체 ZIP 다운로드 (ToonLog-latest.zip)</span>
        </a>
      </div>

      <!-- Solution 3: Terminal Command -->
      <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200">
        <div class="flex items-center gap-2 mb-2">
          <span class="w-6 h-6 rounded-full bg-slate-600 text-white flex items-center justify-center text-xs font-bold">3</span>
          <h4 class="text-sm font-bold text-slate-800">로컬 PC 터미널에서 올리기</h4>
        </div>
        <p class="text-xs text-slate-600 mb-2">
          내 컴퓨터의 터미널에서 직접 푸시할 때 사용하는 명령어:
        </p>
        <div class="relative bg-slate-900 text-slate-200 p-2.5 rounded-xl font-mono text-[11px] flex items-center justify-between">
          <span id="cmd-git-text">git clone https://github.com/pjh747811-afk/Toon-Log.git</span>
          <button type="button" onclick="window.copyGitCommand()" class="px-2 py-1 bg-white/10 hover:bg-white/20 rounded-md text-[10px] text-white cursor-pointer">복사</button>
        </div>
      </div>
    </div>
  </div>
</div>

<script>
(function() {
  const PATH_MAP = {
    'studio': '/studio',
    'feed': '/feed',
    'feed-and-explore': '/feed',
    'my-archive': '/archive',
    'archive': '/archive',
    'character-studio': '/character',
    'character-settings': '/character',
    'character-vault': '/character',
    'character': '/character',
    'style-gallery': '/styles',
    'styles': '/styles',
    'pricing': '/pricing',
    'pricing-and-membership': '/pricing',
    'instagram_publish': '/instagram',
    'instagram-sync': '/instagram',
    'instagram': '/instagram',
    'book-publish': '/book',
    'book': '/book',
    'design-system-showcase': '/design-system',
    'design-system': '/design-system',
    'editor': '/editor',
    'editor-4cut': '/editor',
    'editor-8cut': '/editor/8cut',
    'dual-persona': '/dual-persona',
    'custom-style': '/custom-style',
    'lora': '/custom-style',
    'motion': '/motion'
  };

  // Mark Active Navigation Links
  const currentPath = window.location.pathname;
  
  function highlightActive() {
    // Desktop Nav Highlight
    document.querySelectorAll('.pc-nav-item').forEach(el => {
      const route = el.getAttribute('data-route');
      if (route && (currentPath === route || (route === '/studio' && currentPath === '/'))) {
        el.classList.add('nav-active-item');
      } else {
        el.classList.remove('nav-active-item');
      }
    });

    // Mobile Dock Highlight
    document.querySelectorAll('.mobile-nav-tab').forEach(el => {
      const route = el.getAttribute('data-route');
      if (route && (currentPath === route || (route === '/studio' && currentPath === '/'))) {
        el.classList.add('text-[#fe5e7f]', 'font-bold');
        el.classList.remove('text-slate-600');
      }
    });
  }

  // Intercept click on data-path and internal navigation
  document.addEventListener('click', function(e) {
    const target = e.target.closest('[data-path], a[href^="#"], button');
    if (!target) return;

    const dataPath = target.getAttribute('data-path');
    if (dataPath && PATH_MAP[dataPath]) {
      e.preventDefault();
      window.location.href = PATH_MAP[dataPath];
      return;
    }

    // Intercept back buttons
    const text = (target.textContent || '').trim();
    if (text.includes('홈으로') || text.includes('스튜디오로') || text.includes('스튜디오 홈')) {
      e.preventDefault();
      window.location.href = '/studio';
      return;
    }

    // Intercept generation action in Studio (only if not the async generate button)
    if (target.id === 'generate-button' || target.closest('#generate-button')) {
      return; // Handled by studio's async AI generation logic
    }
    if (text.includes('생성하기') || text.includes('웹툰 생성') || text.includes('만들기')) {
      if (target.tagName.toLowerCase() === 'a' && (window.location.pathname.includes('/studio') || window.location.pathname === '/')) {
        e.preventDefault();
        target.classList.add('animate-pulse');
        setTimeout(() => {
          window.location.href = '/editor';
        }, 300);
        return;
      }
    }

    // Intercept 8-cut vs 4-cut toggle buttons in editors
    if (target.id === 'btn-format-8cut') {
      e.preventDefault();
      window.location.href = '/editor/8cut';
      return;
    }
    if (target.id === 'btn-format-4cut') {
      e.preventDefault();
      window.location.href = '/editor';
      return;
    }
  }, true);

  // Setup Mobile Drawer
  window.addEventListener('DOMContentLoaded', function() {
    highlightActive();

    const openBtn = document.getElementById('mobile-all-screens-btn');
    const closeBtn = document.getElementById('mobile-drawer-close');
    const backdrop = document.getElementById('mobile-drawer-backdrop');
    const drawer = document.getElementById('mobile-screens-drawer');

    function openDrawer() {
      if (!drawer || !backdrop || window.innerWidth >= 768) return;
      backdrop.classList.remove('hidden');
      drawer.classList.remove('hidden');
      drawer.classList.add('flex');
    }

    function closeDrawer() {
      if (!drawer || !backdrop) return;
      backdrop.classList.add('hidden');
      drawer.classList.add('hidden');
      drawer.classList.remove('flex');
    }

    if (openBtn) openBtn.addEventListener('click', openDrawer);
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    if (backdrop) backdrop.addEventListener('click', closeDrawer);
  });

  // Global GitHub Sync Modal Helpers
  window.openGitHubSyncModal = function() {
    const modal = document.getElementById('toonlog-github-modal');
    if (modal) modal.classList.remove('hidden');
  };

  window.closeGitHubSyncModal = function() {
    const modal = document.getElementById('toonlog-github-modal');
    if (modal) modal.classList.add('hidden');
  };

  window.toggleTokenVisibility = function() {
    const input = document.getElementById('gh-token-input');
    if (!input) return;
    input.type = input.type === 'password' ? 'text' : 'password';
  };

  window.copyGitCommand = function() {
    const text = 'git clone https://github.com/pjh747811-afk/Toon-Log.git';
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        alert('Git clone 명령어가 복사되었습니다: ' + text);
      });
    }
  };

  window.submitGitHubPush = async function() {
    const tokenInput = document.getElementById('gh-token-input');
    const forceCheck = document.getElementById('gh-force-check');
    const statusBox = document.getElementById('gh-push-status');
    const pushBtn = document.getElementById('gh-push-btn');

    const token = tokenInput ? tokenInput.value.trim() : '';
    if (!token) {
      alert('GitHub Personal Access Token(PAT)을 입력해주세요!');
      if (tokenInput) tokenInput.focus();
      return;
    }

    if (pushBtn) {
      pushBtn.disabled = true;
      pushBtn.innerHTML = '<span class="material-symbols-outlined text-[16px] animate-spin">sync</span><span>푸시 진행 중...</span>';
    }

    if (statusBox) {
      statusBox.classList.remove('hidden');
      statusBox.innerHTML = '<span class="text-amber-400">⚡ GitHub 저장소(pjh747811-afk/Toon-Log)로 푸시를 실행하고 있습니다...</span>';
    }

    try {
      const res = await fetch('/api/github/push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, branch: 'main', force: forceCheck ? forceCheck.checked : false })
      });

      const data = await res.json();
      if (data.success) {
        if (statusBox) {
          statusBox.innerHTML = '<span class="text-emerald-400 font-bold">🎉 ' + data.message + '</span>\n\n' + (data.output || 'Push successful!');
        }
        alert('🎉 GitHub 저장소로 성공적으로 푸시되었습니다!');
      } else {
        if (statusBox) {
          statusBox.innerHTML = '<span class="text-rose-400 font-bold">❌ 푸시 실패:</span> ' + (data.error || 'Unknown error') + '\n\n' + (data.details || '');
        }
      }
    } catch (err) {
      if (statusBox) {
        statusBox.innerHTML = '<span class="text-rose-400 font-bold">❌ 통신 오류:</span> ' + err.message;
      }
    } finally {
      if (pushBtn) {
        pushBtn.disabled = false;
        pushBtn.innerHTML = '<span class="material-symbols-outlined text-[16px]">upload</span><span>지금 GitHub에 푸시하기</span>';
      }
    }
  };
})();
</script>
`;

function serveScreen(relPath, res) {
  const fullPath = path.join(__dirname, relPath);
  if (!fs.existsSync(fullPath)) {
    return res.status(404).send('Page not found');
  }

  let html = fs.readFileSync(fullPath, 'utf8');

  // Inject meta tags and title if missing or basic
  if (!html.includes('<title>')) {
    html = html.replace('<head>', `<head>
  <title>ToonLog (툰로그) - AI 4-Cut Webtoon Diary</title>
  <meta name="description" content="소소한 일상 텍스트를 AI 기반 4컷 일상 웹툰으로 변환해주는 크리에이티브 AI 플랫폼">
  <meta property="og:title" content="ToonLog (툰로그) - AI 4-Cut Webtoon Diary">
  <meta property="og:description" content="소소한 일상 텍스트를 AI 기반 4컷 일상 웹툰으로 변환해주는 크리에이티브 AI 플랫폼">`);
  }

  // Inject 5-Color Harmony Palette Theme CSS into <head>
  if (html.includes('</head>')) {
    html = html.replace('</head>', `${PALETTE_THEME_CSS}\n</head>`);
  } else {
    html = PALETTE_THEME_CSS + html;
  }

  // Inject Left (PC) / Bottom (Mobile) Navigation Bar right before </body>
  if (html.includes('</body>')) {
    html = html.replace('</body>', `${NAVIGATION_HTML_AND_SCRIPT}\n</body>`);
  } else {
    html += NAVIGATION_HTML_AND_SCRIPT;
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(html);
}

// Register explicit screen routes
for (const [routePath, filePath] of Object.entries(ROUTES)) {
  app.get(routePath, (req, res) => {
    serveScreen(filePath, res);
  });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    palette: ['#fe5e7f', '#fea7a7', '#ffd7a5', '#ccffc0', '#9cf6fe'],
    nav_position: { pc: 'left', mobile: 'bottom' },
    gemini_ready: !!process.env.GEMINI_API_KEY,
    time: new Date().toISOString()
  });
});

// Gemini AI story generation proxy endpoint
app.post('/api/generate-toon', async (req, res) => {
  const { diaryText, style } = req.body || {};
  const text = diaryText || '오늘 출근길에 귀여운 강아지가 발등 위로 다가와서 인사했다.';
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.json({
      success: true,
      mode: 'mock',
      story: {
        title: '출근길의 작은 힐링견 🐶',
        cuts: [
          { cutNumber: 1, scene: '분주한 월요일 출근길 지하철역', dialogue: '월요일 아침, 발걸음이 무겁다...', soundEffect: '터벅터벅' },
          { cutNumber: 2, scene: '발등 위로 폭 안겨오는 아기 강아지', dialogue: '앗? 누구지? 안녕 귀요미!', soundEffect: '심쿵!' },
          { cutNumber: 3, scene: '초롱초롱한 눈망울로 올려다보는 강아지', dialogue: '월요병이 순식간에 녹아내린다...', soundEffect: '사르르~' },
          { cutNumber: 4, scene: '따뜻한 미소로 출근길을 나서는 주인공', dialogue: '오늘 하루도 힘내서 화이팅! ✨', soundEffect: '샤방샤방' }
        ]
      }
    });
  }

  try {
    const ai = new GoogleGenAI({});
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `당신은 최고 인기 네이버/인스타그램 일상 웹툰 작가이자 스토리보드 콘티 디렉터입니다.
사용자가 작성한 일기를 읽고, 재미있고 따뜻한 감동과 웃음을 주는 4컷 웹툰 스토리보드로 변환해주세요.

사용자 일기: "${text}"
선택된 그림체 화풍: "${style || '인스타 일상툰'}"

다음 원칙을 지켜서 작성하세요:
1. 1컷: 기 (상황의 시작, 기대 또는 일상의 평범함)
2. 2컷: 승 (사건 발생, 작은 반전 또는 특별한 만남)
3. 3컷: 전 (감정의 절정, 심쿵, 당황, 코믹한 리액션)
4. 4컷: 결 (따뜻한 여운, 재치 있는 마무리, 훈훈한 힐링)
5. 각 컷마다 캐릭터가 말하는 자연스러운 말풍선 대사(dialogue), 하단 내레이션(narration), 그리고 한국 만화 특유의 의성어/의태어 효과음(soundEffect: 예: '두둥!', '심쿵~', '사르르', '토닥토닥', '번쩍!', '말랑말랑')을 작성하세요.

반드시 아래 JSON 형식만 반환하세요:
{
  "title": "공감 100% 웹툰 제목",
  "summary": "에피소드 한 줄 요약",
  "style": "${style || '인스타 일상툰'}",
  "cuts": [
    {
      "cutNumber": 1,
      "scene": "1컷 장면 설명",
      "dialogue": "1컷 말풍선 대사",
      "narration": "1컷 독백/해설",
      "soundEffect": "효과음",
      "mood": "감정 분위기"
    },
    {
      "cutNumber": 2,
      "scene": "2컷 장면 설명",
      "dialogue": "2컷 말풍선 대사",
      "narration": "2컷 독백/해설",
      "soundEffect": "효과음",
      "mood": "감정 분위기"
    },
    {
      "cutNumber": 3,
      "scene": "3컷 장면 설명",
      "dialogue": "3컷 말풍선 대사",
      "narration": "3컷 독백/해설",
      "soundEffect": "효과음",
      "mood": "감정 분위기"
    },
    {
      "cutNumber": 4,
      "scene": "4컷 장면 설명",
      "dialogue": "4컷 말풍선 대사",
      "narration": "4컷 독백/해설",
      "soundEffect": "효과음",
      "mood": "감정 분위기"
    }
  ]
}`,
      config: { responseMimeType: 'application/json' }
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, mode: 'gemini', story: parsed });
  } catch (error) {
    console.error('Gemini API Error:', error);
    return res.json({
      success: true,
      mode: 'fallback',
      story: {
        title: '오늘의 감성 일기 툰 📖',
        cuts: [
          { cutNumber: 1, scene: '소소한 하루의 시작', dialogue: '오늘의 첫 순간...', soundEffect: '살랑살랑' },
          { cutNumber: 2, scene: '뜻밖의 기분 좋은 발견', dialogue: '이런 특별한 일이!', soundEffect: '두둥!' },
          { cutNumber: 3, scene: '따뜻한 마음의 온기', dialogue: '마음이 몽글몽글해진다', soundEffect: '포근포근' },
          { cutNumber: 4, scene: '웃음과 함께하는 기록', dialogue: '내일도 좋은 하루가 될 거야 ✨', soundEffect: '방긋~' }
        ]
      }
    });
  }
});

// GitHub Direct Push API
app.post('/api/github/push', (req, res) => {
  const { token, branch = 'main', force = false } = req.body;
  if (!token || typeof token !== 'string') {
    return res.status(400).json({ success: false, error: 'GitHub Personal Access Token (PAT)을 입력해주세요.' });
  }

  const cleanToken = token.trim();
  // Safe token format check
  if (!/^[a-zA-Z0-9_.-]+$/.test(cleanToken)) {
    return res.status(400).json({ success: false, error: '유효하지 않은 토큰 형식입니다.' });
  }

  const pushTarget = `https://pjh747811-afk:${cleanToken}@github.com/pjh747811-afk/Toon-Log.git`;
  const forceFlag = force ? '--force ' : '';
  const cmd = `git push ${forceFlag}"${pushTarget}" ${branch}`;

  exec(cmd, { cwd: __dirname }, (error, stdout, stderr) => {
    // Mask token from all outputs
    const mask = (str) => (str || '').replace(new RegExp(cleanToken.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '***TOKEN***');
    const safeStdout = mask(stdout);
    const safeStderr = mask(stderr);

    if (error) {
      console.error('[GitHub Push Failed]:', safeStderr || error.message);
      return res.status(500).json({
        success: false,
        error: safeStderr || error.message,
        details: 'GitHub 푸시 중 거부되었습니다. GitHub Settings -> Developer settings -> Personal access tokens에서 repo 권한이 부여되었는지 확인해주세요.'
      });
    }

    console.log('[GitHub Push Success]:', safeStdout || safeStderr);
    return res.json({
      success: true,
      message: 'GitHub 저장소(pjh747811-afk/Toon-Log)의 main 브랜치로 성공적으로 푸시되었습니다! 🎉',
      output: (safeStdout + '\n' + safeStderr).trim()
    });
  });
});

// Project Source Code Download as ZIP
app.get('/api/download-zip', (req, res) => {
  const zipPath = path.join('/tmp', 'toonlog-latest-source.zip');
  const pyScript = `import zipfile, os
with zipfile.ZipFile('${zipPath}', 'w', zipfile.ZIP_DEFLATED) as z:
    for root, dirs, files in os.walk('${__dirname}'):
        if any(ign in root for ign in ['node_modules', '.git', '.cache', 'stitch_duplicate_of_ai.zip']):
            continue
        for f in files:
            fp = os.path.join(root, f)
            rel = os.path.relpath(fp, '${__dirname}')
            z.write(fp, rel)
`;
  exec(`python3 -c "${pyScript.replace(/"/g, '\\"')}"`, (err) => {
    if (err) {
      console.error('Zip generation error:', err);
      return res.status(500).send('ZIP 파일 생성 중 오류가 발생했습니다.');
    }
    res.download(zipPath, 'ToonLog-latest.zip');
  });
});

// Serve all static files from stitch_duplicate_of_ai and workspace
app.use(express.static(path.join(__dirname, 'stitch_duplicate_of_ai')));
app.use(express.static(__dirname));

// Fallback to Home Studio
app.use((req, res) => {
  serveScreen(ROUTES['/'], res);
});

app.listen(PORT, HOST, () => {
  console.log(`[ToonLog] Dev server running on http://${HOST}:${PORT}`);
  console.log(`[ToonLog] Color Palette: #fe5e7f, #fea7a7, #ffd7a5, #ccffc0, #9cf6fe`);
  console.log(`[ToonLog] Screen Nav: PC (Left) / Mobile (Bottom)`);
});
