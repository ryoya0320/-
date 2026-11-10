(() => {
  'use strict';
  const ADMIN_HASH='1e4d62cf48588fd6a69eb33b5a0247b66ff9b1d3c7bb5abb6563396c7198b7f3';
  const EDIT_URL='https://github.com/ryoya0320/ryoya0320.github.io/edit/main/maintenance.json';
  let current={enabled:false,title:'メンテナンス中です',message:''};
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const digest=async t=>[...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(t)))].map(x=>x.toString(16).padStart(2,'0')).join('');
  function shell(){let e=document.querySelector('#globalMaintenance');if(!e){e=document.createElement('div');e.id='globalMaintenance';e.className='maintenance global-maintenance';document.body.append(e)}return e}
  function show(){const e=shell();if(!current.enabled){e.remove();return}e.innerHTML=`<section class="card"><div class="big">🔧</div><h1>${esc(current.title)}</h1><p>${esc(current.message)}</p><p class="muted">この画面は全利用者共通の設定です。自動的に終了を確認します。</p><div class="actions"><button id="globalReload">再確認</button><button id="globalAdmin">管理者</button></div></section>`;e.hidden=false}
  async function check(){try{const r=await fetch(`./maintenance.json?t=${Date.now()}`,{cache:'no-store'});if(!r.ok)throw Error();current=await r.json();show()}catch(e){console.warn('maintenance.jsonを確認できませんでした',e)}}
  async function login(){let m=document.querySelector('#modal');m.innerHTML=`<div class="sheet"><h2>管理者認証</h2><form id="globalAdminForm" class="form"><label>専用コード<input type="password" name="code" required></label><button class="primary">認証</button><button type="button" id="globalAdminClose">閉じる</button><p id="globalAdminError"></p></form></div>`;m.hidden=false}
  function dashboard(){let m=document.querySelector('#modal');m.innerHTML=`<div class="sheet"><h2>全利用者のメンテナンス設定</h2><p>GitHub上の maintenance.json を変更すると、アプリを利用している端末へ反映されます。</p><p><strong>現在：</strong>${current.enabled?'メンテナンス中':'通常公開中'}</p><a class="button primary" href="${EDIT_URL}" target="_blank" rel="noopener">GitHubで設定を切り替える</a><p class="muted">enabled を true で開始、false で終了し、Commit changesを押してください。</p><button id="globalCheckNow">反映を確認</button><button id="globalAdminClose">閉じる</button></div>`;m.hidden=false}
  document.addEventListener('click',e=>{if(e.target.id==='globalReload'||e.target.id==='globalCheckNow')check();if(e.target.id==='globalAdmin')login();if(e.target.id==='globalAdminClose')document.querySelector('#modal').hidden=true});
  document.addEventListener('submit',async e=>{if(e.target.id!=='globalAdminForm')return;e.preventDefault();let code=new FormData(e.target).get('code');if(await digest(code)===ADMIN_HASH)dashboard();else document.querySelector('#globalAdminError').textContent='コードが違います。'});
  addEventListener('DOMContentLoaded',()=>{check();setInterval(check,15000)});
})();
