(function () {
  'use strict';
  const STORAGE_KEY = 'toonlog_saved_diaries';
  let client = null;
  let currentUser = null;
  let initialized = false;

  function readLocalDiaries() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
    catch (_) { return []; }
  }

  function setStatus(message, isError) {
    const el = document.getElementById('toonlog-db-status');
    if (el) {
      el.textContent = message;
      el.style.color = isError ? '#b91c1c' : '#0f766e';
    }
  }

  function showAuthPanel() {
    if (!document.body) {
      document.addEventListener('DOMContentLoaded', showAuthPanel, { once: true });
      return;
    }
    if (document.getElementById('toonlog-auth-widget')) return;
    const wrap = document.createElement('div');
    wrap.id = 'toonlog-auth-widget';
    wrap.innerHTML = `
      <style>
        #toonlog-auth-widget{position:fixed;right:16px;top:12px;z-index:100001;font:13px/1.45 Arial,sans-serif;color:#263238}
        #toonlog-auth-widget button{cursor:pointer;border:0;border-radius:9px;padding:8px 11px;font-weight:700}
        #toonlog-auth-toggle{background:#fe5e7f;color:white;box-shadow:0 3px 12px #fe5e7f44}
        #toonlog-auth-panel{display:none;position:absolute;right:0;top:42px;width:min(310px,calc(100vw - 32px));padding:14px;background:#fff;border:1px solid #fde6dc;border-radius:14px;box-shadow:0 12px 36px #0002}
        #toonlog-auth-panel.open{display:block}
        #toonlog-auth-panel input{display:block;width:100%;box-sizing:border-box;margin:7px 0;padding:10px;border:1px solid #e5e7eb;border-radius:8px;font-size:13px}
        #toonlog-auth-panel .primary{background:#fe5e7f;color:white}
        #toonlog-auth-panel .secondary{background:#fff1f2;color:#be123c}
        #toonlog-auth-panel .actions{display:flex;gap:7px;flex-wrap:wrap;margin-top:8px}
        #toonlog-db-status{font-size:11px;margin-top:9px;color:#64748b;min-height:16px}
        @media(max-width:767px){#toonlog-auth-widget{top:8px;right:8px}#toonlog-auth-toggle{padding:6px 9px;font-size:11px}}
      </style>
      <button id="toonlog-auth-toggle" type="button">로그인 / 내 계정</button>
      <div id="toonlog-auth-panel">
        <strong>ToonLog 계정</strong>
        <div id="toonlog-auth-user" style="font-size:12px;color:#64748b;margin-top:4px">로그인하면 여러 기기에서 웹툰을 볼 수 있어요.</div>
        <input id="toonlog-auth-email" type="email" autocomplete="email" placeholder="이메일">
        <input id="toonlog-auth-password" type="password" autocomplete="current-password" placeholder="비밀번호 (6자 이상)">
        <div class="actions">
          <button class="primary" id="toonlog-signin" type="button">로그인</button>
          <button class="secondary" id="toonlog-signup" type="button">회원가입</button>
          <button class="secondary" id="toonlog-signout" type="button" style="display:none">로그아웃</button>
        </div>
        <div id="toonlog-db-status">Supabase 연결 확인 중...</div>
      </div>`;
    document.body.appendChild(wrap);
    document.getElementById('toonlog-auth-toggle').addEventListener('click', () => {
      document.getElementById('toonlog-auth-panel').classList.toggle('open');
    });
    document.getElementById('toonlog-signin').addEventListener('click', signIn);
    document.getElementById('toonlog-signup').addEventListener('click', signUp);
    document.getElementById('toonlog-signout').addEventListener('click', signOut);
  }

  function emailAndPassword() {
    return {
      email: (document.getElementById('toonlog-auth-email')?.value || '').trim(),
      password: document.getElementById('toonlog-auth-password')?.value || ''
    };
  }

  async function signUp() {
    if (!client) return setStatus('Supabase 설정을 확인할 수 없습니다.', true);
    const { email, password } = emailAndPassword();
    if (!email || password.length < 6) return setStatus('이메일과 6자 이상의 비밀번호를 입력하세요.', true);
    setStatus('회원가입 처리 중...');
    const { data, error } = await client.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin } });
    if (error) return setStatus(error.message, true);
    if (data.session) {
      currentUser = data.user;
      await afterLogin();
      setStatus('회원가입 및 로그인 완료');
    } else {
      setStatus('가입 요청 완료. 이메일 인증 링크를 확인한 뒤 로그인하세요.');
    }
  }

  async function signIn() {
    if (!client) return setStatus('Supabase 설정을 확인할 수 없습니다.', true);
    const { email, password } = emailAndPassword();
    if (!email || !password) return setStatus('이메일과 비밀번호를 입력하세요.', true);
    setStatus('로그인 중...');
    const { data, error } = await client.auth.signInWithPassword({ email, password });
    if (error) return setStatus(error.message, true);
    currentUser = data.user;
    await afterLogin();
    setStatus('로그인 완료 · 데이터 동기화됨');
  }

  async function signOut() {
    if (!client) return;
    const { error } = await client.auth.signOut();
    if (error) return setStatus(error.message, true);
    currentUser = null;
    document.getElementById('toonlog-auth-user').textContent = '로그아웃 상태입니다.';
    document.getElementById('toonlog-signin').style.display = '';
    document.getElementById('toonlog-signup').style.display = '';
    document.getElementById('toonlog-signout').style.display = 'none';
    setStatus('로그아웃되었습니다. 이 브라우저의 기존 로컬 데이터는 유지됩니다.');
  }

  function normalizeDiary(diary) {
    const id = String(diary.id || ('toon_' + Date.now()));
    return {
      id,
      title: diary.title || '제목 없는 웹툰',
      date: diary.date || diary.created_at || new Date().toISOString().slice(0, 10),
      style: diary.style || '인스타 일상툰',
      created_at: diary.created_at || new Date().toISOString(),
      ...diary
    };
  }

  async function saveDiary(diary) {
    if (!client || !currentUser) return { saved: false, reason: 'login_required' };
    const item = normalizeDiary(diary);
    const row = {
      user_id: currentUser.id,
      diary_id: item.id,
      title: item.title,
      diary_date: String(item.date || '').slice(0, 40),
      style: item.style || null,
      payload: item,
      updated_at: new Date().toISOString()
    };
    const { error } = await client.from('toonlog_diaries').upsert(row, { onConflict: 'user_id,diary_id' });
    if (error) {
      console.error('[ToonLog] Supabase save failed:', error);
      setStatus('DB 저장 실패: ' + error.message, true);
      return { saved: false, error: error.message };
    }
    return { saved: true };
  }

  async function getDiaries() {
    if (!client || !currentUser) return [];
    const { data, error } = await client.from('toonlog_diaries')
      .select('diary_id,payload,updated_at')
      .eq('user_id', currentUser.id)
      .order('updated_at', { ascending: false });
    if (error) {
      console.error('[ToonLog] Supabase load failed:', error);
      setStatus('DB 조회 실패: ' + error.message, true);
      return [];
    }
    return (data || []).map(row => row.payload || { id: row.diary_id });
  }

  async function deleteDiary(id) {
    if (!client || !currentUser) return { deleted: false };
    const { error } = await client.from('toonlog_diaries')
      .delete().eq('user_id', currentUser.id).eq('diary_id', String(id));
    if (error) return { deleted: false, error: error.message };
    return { deleted: true };
  }

  async function syncLocalToCloud() {
    const local = readLocalDiaries();
    for (const item of local) await saveDiary(item);
  }

  async function afterLogin() {
    const userLabel = document.getElementById('toonlog-auth-user');
    if (userLabel) userLabel.textContent = currentUser?.email || '로그인되었습니다.';
    document.getElementById('toonlog-signin').style.display = 'none';
    document.getElementById('toonlog-signup').style.display = 'none';
    document.getElementById('toonlog-signout').style.display = '';
    await syncLocalToCloud();
    const remote = await getDiaries();
    if (remote.length) {
      const local = readLocalDiaries();
      const merged = [...remote];
      local.forEach(item => { if (!merged.some(x => String(x.id) === String(item.id))) merged.push(item); });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      const notifyArchive = () => window.dispatchEvent(new CustomEvent('toonlog:diaries-loaded', { detail: merged }));
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', notifyArchive, { once: true });
      } else {
        notifyArchive();
      }
    } else {
      await syncLocalToCloud();
    }
  }

  function installStorageBridge() {
    const originalSetItem = localStorage.setItem.bind(localStorage);
    localStorage.setItem = function (key, value) {
      originalSetItem(key, value);
      if (key === STORAGE_KEY && currentUser) {
        try {
          const list = JSON.parse(value || '[]');
          if (Array.isArray(list)) list.forEach(item => saveDiary(item));
        } catch (e) { console.warn('[ToonLog] local storage sync skipped', e); }
      }
    };
  }

  async function initialize() {
    if (initialized) return;
    initialized = true;
    showAuthPanel();
    try {
      const configResponse = await fetch('/api/config');
      const config = await configResponse.json();
      if (!config.supabaseUrl || !config.supabasePublishableKey) {
        setStatus('서버 환경변수 SUPABASE_URL / SUPABASE_PUBLISHABLE_KEY를 확인하세요.', true);
        return;
      }
      if (!window.supabase || !window.supabase.createClient) {
        setStatus('Supabase 클라이언트를 불러오지 못했습니다. 새로고침해 주세요.', true);
        return;
      }
      client = window.supabase.createClient(config.supabaseUrl, config.supabasePublishableKey);
      window.ToonLogDB = { saveDiary, getDiaries, deleteDiary, getUser: () => currentUser };
      const { data } = await client.auth.getSession();
      currentUser = data.session?.user || null;
      if (currentUser) {
        await afterLogin();
        setStatus('Supabase 연결 및 로그인 확인 완료');
      } else {
        setStatus('Supabase 연결 완료 · 로그인하면 클라우드 저장이 활성화됩니다.');
      }
      client.auth.onAuthStateChange(async (_event, session) => {
        currentUser = session?.user || null;
        if (currentUser) await afterLogin();
      });
    } catch (error) {
      console.error('[ToonLog] Initialization error:', error);
      setStatus('연결 오류: ' + (error.message || '설정 확인 필요'), true);
    }
  }

  // The storage bridge is installed synchronously before app page scripts execute.
  installStorageBridge();
  const sdk = document.createElement('script');
  sdk.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
  sdk.onload = initialize;
  sdk.onerror = function () {
    showAuthPanel();
    setStatus('Supabase 라이브러리 로딩 실패. 네트워크를 확인하세요.', true);
  };
  document.head.appendChild(sdk);
  document.addEventListener('DOMContentLoaded', showAuthPanel);
})();
