(()=>{
const KEY='studyflow_app_preferences_v16';
const defaults={theme:'system',fontSize:100,highContrast:false,reduceMotion:false,sound:true,haptics:true,dailyGoal:30,showDifficulty:true,focusMode:false,confirmNext:false};
let stored={};try{stored=JSON.parse(localStorage.getItem(KEY)||'{}')}catch{localStorage.removeItem(KEY)}let pref={...defaults,...stored};
const save=()=>{localStorage.setItem(KEY,JSON.stringify(pref));apply()};
function apply(){
 const root=document.documentElement,dark=pref.theme==='dark'||(pref.theme==='system'&&matchMedia('(prefers-color-scheme: dark)').matches);
 root.dataset.theme=dark?'dark':'light';root.dataset.contrast=pref.highContrast?'high':'normal';root.dataset.motion=pref.reduceMotion?'reduced':'normal';root.dataset.focus=pref.focusMode?'on':'off';root.style.fontSize=pref.fontSize+'%';
}
function buzz(){if(pref.haptics&&navigator.vibrate)navigator.vibrate(18)}
function beep(){if(!pref.sound)return;try{const c=new(window.AudioContext||window.webkitAudioContext)(),o=c.createOscillator(),g=c.createGain();o.connect(g);g.connect(c.destination);o.frequency.value=660;g.gain.value=.025;o.start();o.stop(c.currentTime+.06)}catch{}}
function profileEnhance(){
 if(document.querySelector('#profileAdminSection')||document.querySelector('#title')?.textContent!=='プロフィール')return;
 const main=document.querySelector('#view');if(!main)return;
 const box=document.createElement('section');box.id='profileAdminSection';box.className='card profile-admin';box.innerHTML=`<h2>管理者</h2><p class="muted">問題、学習データ、メンテナンス、バックアップを管理します。</p><button class="primary" data-act="admin">管理者コントロールを開く</button>`;const cards=main.querySelectorAll('.card');cards.length?cards[0].after(box):main.prepend(box);
}
function settingsEnhance(){
 if(document.querySelector('#appSettingsV16')||document.querySelector('#title')?.textContent!=='設定')return;
 const main=document.querySelector('#view');if(!main)return;
 const box=document.createElement('section');box.id='appSettingsV16';box.className='card settings-panel';box.innerHTML=`
 <h2>アプリ内設定</h2>
 <div class="setting-row"><label>テーマ<select id="setTheme"><option value="system">端末に合わせる</option><option value="light">ライト</option><option value="dark">ダーク</option></select></label></div>
 <div class="setting-row"><label>文字サイズ <strong id="fontValue">${pref.fontSize}%</strong><input id="setFont" type="range" min="85" max="140" step="5" value="${pref.fontSize}"></label></div>
 <div class="setting-row switch"><span>高コントラスト</span><input id="setContrast" type="checkbox" ${pref.highContrast?'checked':''}></div>
 <div class="setting-row switch"><span>動きを減らす</span><input id="setMotion" type="checkbox" ${pref.reduceMotion?'checked':''}></div>
 <div class="setting-row switch"><span>効果音</span><input id="setSound" type="checkbox" ${pref.sound?'checked':''}></div>
 <div class="setting-row switch"><span>タップ振動</span><input id="setHaptics" type="checkbox" ${pref.haptics?'checked':''}></div>
 <div class="setting-row switch"><span>集中モード</span><input id="setFocus" type="checkbox" ${pref.focusMode?'checked':''}></div>
 <div class="setting-row"><label>1日の目標時間（分）<input id="setGoal" type="number" min="5" max="600" value="${pref.dailyGoal}"></label></div>
 <h3>データ管理</h3>
 <div class="button-grid"><button id="exportData">学習データを書き出す</button><button id="importData">学習データを読み込む</button><button id="resetPrefs">設定だけ初期化</button></div>
 <input id="importFile" type="file" accept="application/json" hidden>
 <p class="muted">プロフィール、学習記録、習熟度は端末内に保存されています。</p>`;
 main.prepend(box);box.querySelector('#setTheme').value=pref.theme;
}
function enhance(){profileEnhance();settingsEnhance()}
new MutationObserver(enhance).observe(document.body,{childList:true,subtree:true});
document.addEventListener('change',e=>{
 const map={setTheme:'theme',setContrast:'highContrast',setMotion:'reduceMotion',setSound:'sound',setHaptics:'haptics',setFocus:'focusMode',setGoal:'dailyGoal'};
 if(e.target.id==='setFont'){pref.fontSize=Number(e.target.value);document.querySelector('#fontValue').textContent=pref.fontSize+'%';save();return}
 if(map[e.target.id]){pref[map[e.target.id]]=e.target.type==='checkbox'?e.target.checked:e.target.type==='number'?Number(e.target.value):e.target.value;save();buzz()}
 if(e.target.id==='importFile'){const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{const x=JSON.parse(r.result);if(!x.studyflow)throw Error();localStorage.setItem('studyflow_data_v1',JSON.stringify(x.studyflow));if(x.preferences)localStorage.setItem(KEY,JSON.stringify({...defaults,...x.preferences}));alert('読み込みました。アプリを再読み込みします。');location.reload()}catch{alert('StudyFlowのバックアップファイルではありません。')}};r.readAsText(f)}
});
document.addEventListener('click',e=>{
 if(e.target.closest('button')){buzz();beep()}
 if(e.target.id==='exportData'){const payload={version:19,exportedAt:new Date().toISOString(),studyflow:JSON.parse(localStorage.getItem('studyflow_data_v1')||'{}'),preferences:pref};const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}));a.download='studyflow-backup.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
 if(e.target.id==='importData')document.querySelector('#importFile').click();
 if(e.target.id==='resetPrefs'&&confirm('アプリ内設定を初期状態に戻しますか？')){pref={...defaults};save();location.reload()}
});
apply();enhance();
})();
