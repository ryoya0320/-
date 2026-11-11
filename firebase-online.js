import { initializeApp } from "https://www.gstatic.com/firebasejs/13.2.0/firebase-app.js";
import { getDatabase, ref, onValue, update, serverTimestamp } from "https://www.gstatic.com/firebasejs/13.2.0/firebase-database.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/13.2.0/firebase-auth.js";

const app = initializeApp({
  apiKey:"AIzaSyDEb9KvqDtjiWossEehvEpKrP020tQ-F2w",
  authDomain:"studyflow-f444d.firebaseapp.com",
  databaseURL:"https://studyflow-f444d-default-rtdb.firebaseio.com",
  projectId:"studyflow-f444d",
  storageBucket:"studyflow-f444d.firebasestorage.app",
  messagingSenderId:"36777313496",
  appId:"1:36777313496:web:36fdc1a81c8fe324d683ad",
  measurementId:"G-9DJ62YS0VS"
});
const auth=getAuth(app), db=getDatabase(app), maintenanceRef=ref(db,"appConfig/maintenance");
let state={enabled:false,title:"メンテナンス中です",message:"現在、アプリの更新作業を行っています。"}, adminOpen=false;
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function modal(html){const m=document.querySelector("#modal");if(!m){alert("管理画面の表示領域がありません。index.htmlをv11へ更新してください。");return}m.innerHTML=`<div class="sheet">${html}</div>`;m.hidden=false}
function close(){const m=document.querySelector("#modal");if(m)m.hidden=true;adminOpen=false;render()}
function render(){document.querySelector("#firebaseMaintenance")?.remove();if(!state.enabled||adminOpen||auth.currentUser)return;const e=document.createElement("div");e.id="firebaseMaintenance";e.className="maintenance";e.innerHTML=`<section class="card"><div class="big">🔧</div><h1>${esc(state.title)}</h1><p>${esc(state.message)}</p><button id="firebaseAdminButton">管理者</button></section>`;document.body.append(e)}
function login(){adminOpen=true;render();modal(`<h2>オンライン管理者ログイン</h2><form id="firebaseLoginForm" class="form"><label>メールアドレス<input type="email" name="email" required autocomplete="username"></label><label>パスワード<input type="password" name="password" required autocomplete="current-password"></label><button class="primary">ログイン</button><button type="button" id="firebaseClose">閉じる</button><p id="firebaseError" class="danger"></p></form>`)}
function panel(){adminOpen=true;render();modal(`<h2>管理者コントロール</h2><div class="admin-badge">管理者としてログイン中</div><div class="form"><div class="switch"><strong>メンテナンスモード</strong><input id="firebaseToggle" type="checkbox" ${state.enabled?"checked":""}></div><label>案内タイトル<input id="firebaseTitle" value="${esc(state.title)}"></label><label>案内メッセージ<textarea id="firebaseMessage">${esc(state.message)}</textarea></label><button class="primary" id="firebaseSave">全利用者へ反映</button><div class="admin-grid"><button type="button" id="adminDashboard">詳細ダッシュボード</button><button type="button" id="adminOpenQuestions">問題管理へ移動</button><button type="button" id="adminExport">データを書き出す</button><button type="button" id="adminClearCache">表示キャッシュ更新</button></div><p class="muted">問題の追加・編集・削除は「問題管理」から行えます。</p><button id="firebaseLogout">ログアウト</button><button id="firebaseClose">閉じる</button><p id="firebaseStatus"></p></div>`)}
function openAdmin(){auth.currentUser?panel():login()}
onValue(maintenanceRef,s=>{if(s.exists())state={...state,...s.val()};render()},error=>console.error("Firebase read error",error));
// Capture phase makes this work even if script.js stops or replaces the click event.
document.addEventListener("click",async e=>{
  const adminButton=e.target.closest('[data-act="admin"],#firebaseAdminButton');
  if(adminButton){e.preventDefault();e.stopImmediatePropagation();openAdmin();return}
  if(e.target.id==="firebaseClose"){e.preventDefault();close()}
  if(e.target.id==="firebaseLogout"){e.preventDefault();await signOut(auth);close()}
  if(e.target.id==='adminDashboard'){e.preventDefault();close();document.dispatchEvent(new CustomEvent('studyflow:open-admin-console'));return}if(e.target.id==='adminOpenQuestions'){e.preventDefault();close();document.querySelector('[data-page=quiz]')?.click();return}if(e.target.id==='adminExport'){e.preventDefault();const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([localStorage.getItem('studyflow_data_v1')||'{}'],{type:'application/json'}));a.download='studyflow-admin-data.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);return}if(e.target.id==='adminClearCache'){e.preventDefault();if('caches'in window)caches.keys().then(k=>Promise.all(k.map(x=>caches.delete(x)))).then(()=>location.reload());else location.reload();return}if(e.target.id==="firebaseSave"){
    e.preventDefault();const status=document.querySelector("#firebaseStatus");
    try{await update(maintenanceRef,{enabled:document.querySelector("#firebaseToggle").checked,title:document.querySelector("#firebaseTitle").value.trim()||"メンテナンス中です",message:document.querySelector("#firebaseMessage").value.trim(),updatedAt:serverTimestamp()});status.textContent="保存しました。全利用者へ反映されます。"}catch(err){status.textContent="保存失敗: "+err.message}
  }
},true);
document.addEventListener("submit",async e=>{if(e.target.id!=="firebaseLoginForm")return;e.preventDefault();const f=new FormData(e.target);try{await signInWithEmailAndPassword(auth,f.get("email"),f.get("password"));panel()}catch(err){document.querySelector("#firebaseError").textContent="ログインできませんでした。登録したメールアドレスとパスワードを確認してください。";console.error(err)}});
onAuthStateChanged(auth,user=>{document.dispatchEvent(new CustomEvent('studyflow:admin-state',{detail:!!user}));render()});document.addEventListener('studyflow:open-admin',openAdmin);window.FirebaseMaintenance={open:openAdmin};
