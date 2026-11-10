/* StudyFlow v6 repair + admin panel */
(() => {
  'use strict';
  const KEY = 'studyflow_data_v1';
  const BACKUP_KEY = 'studyflow_backup_before_v6';
  const ADMIN_HASH = '1e4d62cf48588fd6a69eb33b5a0247b66ff9b1d3c7bb5abb6563396c7198b7f3';
  const builtIns = Array.isArray(window.DEFAULT_QUESTIONS) ? window.DEFAULT_QUESTIONS : [];
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const uid = () => `admin_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,8)}`;
  const read = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } };
  const write = data => localStorage.setItem(KEY, JSON.stringify(data));
  const hash = async text => Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text)))).map(b => b.toString(16).padStart(2,'0')).join('');

  function rebalance(questions) {
    let choiceIndex = 0;
    return questions.map(q => {
      if (q.type !== 'choice' || !Array.isArray(q.choices) || q.choices.length !== 4) return q;
      const choices = [...q.choices];
      const old = choices.indexOf(q.answer);
      if (old < 0) return q;
      choices.splice(old, 1);
      choices.splice(choiceIndex % 4, 0, q.answer);
      choiceIndex++;
      return {...q, choices};
    });
  }

  function migrate() {
    const data = read();
    if (!Object.keys(data).length) return;
    try { localStorage.setItem(BACKUP_KEY, JSON.stringify(data)); } catch {}
    const old = Array.isArray(data.questions) ? data.questions : [];
    const custom = old.filter(q => !/^q[1-5]$/.test(String(q.id)) && !/^g3_/.test(String(q.id)));
    const customIds = new Set(custom.map(q => q.id));
    data.questions = rebalance([...builtIns, ...custom.filter(q => !builtIns.some(b => b.id === q.id))]);
    data.version = 6;
    data.contentVersion = '6';
    write(data);
  }

  function availableCount() {
    const data = read();
    const questions = Array.isArray(data.questions) ? data.questions : builtIns;
    const subject = document.querySelector('#quizSubject')?.value || 'all';
    const unit = document.querySelector('#quizUnit')?.value || 'all';
    const difficulty = document.querySelector('#quizDifficulty')?.value || 'all';
    return questions.filter(q =>
      (subject === 'all' || q.subjectId === subject) &&
      (unit === 'all' || (q.unit || 'その他') === unit) &&
      (difficulty === 'all' || (q.difficulty || '基礎') === difficulty)
    ).length;
  }

  function fixCountOptions() {
    const select = document.querySelector('#quizCount');
    if (!select) return;
    const available = availableCount();
    const previous = select.value;
    [...select.options].forEach(option => {
      if (option.value === 'all') {
        option.textContent = `すべて（${available}問）`;
        return;
      }
      const n = Number(option.value);
      option.hidden = n > available;
      option.disabled = n > available;
    });
    if (previous !== 'all' && Number(previous) > available) {
      const valid = [...select.options].filter(o => !o.disabled && o.value !== 'all').map(o => Number(o.value));
      select.value = valid.length ? String(Math.max(...valid)) : 'all';
      select.dispatchEvent(new Event('change', {bubbles:true}));
    }
  }

  function modal(html) {
    let shell = document.querySelector('#adminV6Modal');
    if (!shell) {
      shell = document.createElement('div');
      shell.id = 'adminV6Modal';
      shell.className = 'admin-v6-modal';
      document.body.append(shell);
    }
    shell.innerHTML = `<div class="admin-v6-sheet">${html}</div>`;
    shell.hidden = false;
  }
  function closeAdmin() { const el = document.querySelector('#adminV6Modal'); if (el) el.hidden = true; }

  function login() {
    modal(`<div class="admin-v6-head"><h2>管理者設定</h2><button data-admin-close>閉じる</button></div>
      <form id="adminV6Login" class="admin-v6-form"><label>専用コード<input type="password" name="code" required autocomplete="current-password"></label><button class="admin-v6-primary">ログイン</button><p id="adminV6Error" class="admin-v6-error"></p></form>`);
  }

  function dashboard() {
    const data = read();
    const subjects = Array.isArray(data.subjects) ? data.subjects : [];
    const questions = Array.isArray(data.questions) ? data.questions : [];
    modal(`<div class="admin-v6-head"><h2>管理者設定</h2><button data-admin-close>閉じる</button></div>
      <div class="admin-v6-tabs"><button data-admin-tab="app">アプリ設定</button><button data-admin-tab="questions">問題管理</button><button data-admin-tab="backup">データ管理</button></div>
      <section id="adminV6Content">
        <form id="adminV6App" class="admin-v6-form"><label>アプリ表示名<input name="appName" maxlength="30" value="${esc(data.settings?.appName || 'StudyFlow')}"></label><label>1日の目標（分）<input type="number" min="1" max="1440" name="dailyGoal" value="${Number(data.settings?.dailyGoal || 60)}"></label><label>テーマ<select name="theme"><option value="auto">端末に合わせる</option><option value="light">ライト</option><option value="dark">ダーク</option></select></label><button class="admin-v6-primary">保存して再読み込み</button></form>
      </section>`);
    const theme = document.querySelector('#adminV6App [name=theme]'); if (theme) theme.value = data.settings?.theme || 'auto';
    window.__adminV6 = {subjects, questions};
  }

  function questionManager(query='') {
    const data = read();
    const questions = Array.isArray(data.questions) ? data.questions : [];
    const filtered = questions.filter(q => !query || q.question?.includes(query) || q.unit?.includes(query)).slice(0,300);
    document.querySelector('#adminV6Content').innerHTML = `<div class="admin-v6-actions"><button class="admin-v6-primary" data-admin-add>問題を追加</button><input id="adminV6Search" placeholder="問題・単元を検索" value="${esc(query)}"></div><p>${questions.length}問中 ${filtered.length}問を表示</p><div class="admin-v6-list">${filtered.map(q => `<div class="admin-v6-row"><div><strong>${esc(q.question)}</strong><small>${esc(q.unit || 'その他')}・${esc(q.difficulty || '基礎')}</small></div><button data-admin-edit="${esc(q.id)}">編集</button><button class="admin-v6-danger" data-admin-delete="${esc(q.id)}">削除</button></div>`).join('')}</div>`;
  }

  function questionForm(id='') {
    const data = read();
    const q = (data.questions || []).find(item => item.id === id) || {id:'',subjectId:data.subjects?.[0]?.id || 'math',unit:'',difficulty:'基礎',type:'choice',question:'',choices:['','','',''],answer:'',explanation:'',favorite:false};
    modal(`<div class="admin-v6-head"><h2>${id ? '問題を編集' : '問題を追加'}</h2><button data-admin-dashboard>戻る</button></div><form id="adminV6Question" class="admin-v6-form"><input type="hidden" name="id" value="${esc(q.id)}"><label>教科<select name="subjectId">${(data.subjects || []).map(s => `<option value="${esc(s.id)}" ${s.id===q.subjectId?'selected':''}>${esc(s.name)}</option>`).join('')}</select></label><label>単元<input name="unit" required value="${esc(q.unit)}"></label><label>難易度<select name="difficulty"><option ${q.difficulty==='基礎'?'selected':''}>基礎</option><option ${q.difficulty==='応用'?'selected':''}>応用</option></select></label><label>形式<select name="type"><option value="choice" ${q.type==='choice'?'selected':''}>4択</option><option value="boolean" ${q.type==='boolean'?'selected':''}>○×</option><option value="short" ${q.type==='short'?'selected':''}>一問一答</option></select></label><label>問題文<textarea name="question" required>${esc(q.question)}</textarea></label><label>選択肢（4択は4行）<textarea name="choices">${esc((q.choices || []).join('\n'))}</textarea></label><label>正解<input name="answer" required value="${esc(q.answer)}"></label><label>解説<textarea name="explanation" required>${esc(q.explanation)}</textarea></label><button class="admin-v6-primary">保存して再読み込み</button></form>`);
  }

  function backupPanel() {
    document.querySelector('#adminV6Content').innerHTML = `<div class="admin-v6-form"><button class="admin-v6-primary" data-admin-export>全データを書き出す</button><label class="admin-v6-file">データを復元<input type="file" id="adminV6Import" accept="application/json"></label><button class="admin-v6-danger" data-admin-reset-questions>標準問題を最新版へ戻す</button></div>`;
  }

  function addAdminButton() {
    const title = document.querySelector('#pageTitle');
    if (!title || title.textContent.trim() !== '設定' || document.querySelector('[data-admin-open]')) return;
    const main = document.querySelector('#view .grid') || document.querySelector('#view');
    if (!main) return;
    const card = document.createElement('section');
    card.className = 'card';
    card.innerHTML = `<div class="section-title"><h2>管理者設定</h2></div><p class="muted">専用コードで問題とアプリ設定を管理します。</p><button class="primary" data-admin-open>管理者設定を開く</button>`;
    main.append(card);
  }

  document.addEventListener('change', event => {
    if (['quizSubject','quizUnit','quizDifficulty'].includes(event.target.id)) setTimeout(fixCountOptions, 0);
  });
  document.addEventListener('click', async event => {
    if (event.target.closest('[data-admin-open]')) login();
    if (event.target.closest('[data-admin-close]')) closeAdmin();
    if (event.target.closest('[data-admin-dashboard]')) dashboard();
    const tab = event.target.closest('[data-admin-tab]')?.dataset.adminTab;
    if (tab === 'app') dashboard();
    if (tab === 'questions') questionManager();
    if (tab === 'backup') backupPanel();
    if (event.target.closest('[data-admin-add]')) questionForm();
    const edit = event.target.closest('[data-admin-edit]')?.dataset.adminEdit; if (edit) questionForm(edit);
    const del = event.target.closest('[data-admin-delete]')?.dataset.adminDelete;
    if (del && confirm('この問題を削除しますか？')) { const data=read(); data.questions=(data.questions||[]).filter(q=>q.id!==del); write(data); questionManager(); }
    if (event.target.closest('[data-admin-export]')) { const blob=new Blob([JSON.stringify(read(),null,2)],{type:'application/json'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='studyflow-admin-backup.json'; a.click(); setTimeout(()=>URL.revokeObjectURL(a.href),1000); }
    if (event.target.closest('[data-admin-reset-questions]') && confirm('標準問題を最新版へ戻します。学習記録は残ります。')) { const data=read(); const custom=(data.questions||[]).filter(q=>!/^q[1-5]$/.test(String(q.id))&&!/^g3_/.test(String(q.id))); data.questions=rebalance([...builtIns,...custom]); write(data); location.reload(); }
  });
  document.addEventListener('input', event => { if (event.target.id === 'adminV6Search') questionManager(event.target.value); });
  document.addEventListener('submit', async event => {
    if (event.target.id === 'adminV6Login') { event.preventDefault(); const code=new FormData(event.target).get('code'); if (await hash(code) === ADMIN_HASH) dashboard(); else document.querySelector('#adminV6Error').textContent='専用コードが違います。'; }
    if (event.target.id === 'adminV6App') { event.preventDefault(); const fd=Object.fromEntries(new FormData(event.target)); const data=read(); data.settings={...(data.settings||{}),appName:fd.appName.trim(),dailyGoal:Number(fd.dailyGoal),theme:fd.theme}; write(data); location.reload(); }
    if (event.target.id === 'adminV6Question') { event.preventDefault(); const fd=Object.fromEntries(new FormData(event.target)); const data=read(); const type=fd.type; const choices=type==='choice'?fd.choices.split('\n').map(x=>x.trim()).filter(Boolean):type==='boolean'?['○','×']:[]; if(type==='choice'&&choices.length!==4){alert('4択は選択肢を4行入力してください。');return} const item={id:fd.id||uid(),subjectId:fd.subjectId,unit:fd.unit.trim(),difficulty:fd.difficulty,type,question:fd.question.trim(),choices,answer:fd.answer.trim(),explanation:fd.explanation.trim(),favorite:false}; const i=(data.questions||[]).findIndex(q=>q.id===item.id); if(i>=0)data.questions[i]=item;else(data.questions||(data.questions=[])).push(item); data.questions=rebalance(data.questions); write(data); location.reload(); }
  });
  document.addEventListener('change', async event => { if(event.target.id==='adminV6Import'&&event.target.files[0]){try{const data=JSON.parse(await event.target.files[0].text());write(data);location.reload()}catch{alert('復元できないファイルです。')}} });

  migrate();
  const observer = new MutationObserver(() => { fixCountOptions(); addAdminButton(); });
  observer.observe(document.documentElement, {subtree:true, childList:true});
  addEventListener('DOMContentLoaded', () => { fixCountOptions(); addAdminButton(); });
})();
