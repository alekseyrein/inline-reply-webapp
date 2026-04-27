(()=>{
const LEADERBOARD_URL='https://script.google.com/macros/s/AKfycbyb-QWZAf2e0dthB5-jbd5l1n-CLd5UMzRLjdgwK5n0jslb8vZeJG130dXsXlxJYYE/exec';
const SHEET_ID='1x39s3Gwfv5XsNgXcOaycwgKa1jZf9T5ujeEajSW9aRc';
const TOP_LIMIT=5;
function fmt(n){return String(Math.max(0,Math.round(Number(n)||0))).replace(/\B(?=(\d{3})+(?!\d))/g,' ')}
function hasState(){try{return typeof st!=='undefined'&&typeof level==='function'}catch(e){return false}}
function getSessionId(){const k='raznos_v3_session_id';let id=localStorage.getItem(k);if(!id){id='rz_'+Math.random().toString(36).slice(2)+Date.now().toString(36);localStorage.setItem(k,id)}return id}
function getNick(){return (localStorage.getItem('raznos_v3_nick')||'Игрок').trim()||'Игрок'}
async function submitScoreToGlobal(source='game'){
  try{
    if(!hasState())return false;
    const lv=level();
    const payload={nick:getNick(),score:Number(st.score||0),level:Number(lv.id||((st.level||0)+1)||1),levelName:String(lv.name||''),win:true,heat:Number(st.heat||0),movesLeft:Number(st.moves||0),source,sessionId:getSessionId(),userAgent:navigator.userAgent||''};
    await fetch(LEADERBOARD_URL,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(payload),mode:'no-cors'});
    return true;
  }catch(e){console.warn('Global leaderboard submit failed',e);return false}
}
function toNum(v){const n=Number(String(v??'').replace(/[^0-9.-]/g,''));return Number.isFinite(n)?n:0}
function normLevel(v){if(v===undefined||v===null)return 0;const m=String(v).match(/\d+/);return m?Number(m[0]):0}
function normNick(v){const s=String(v||'Игрок').trim();return s||'Игрок'}
function normRow(x){
  if(!x)return null;
  if(Array.isArray(x))return {date:x[0],nick:normNick(x[1]),score:toNum(x[2]),level:normLevel(x[3]),levelName:String(x[4]||''),win:x[5],heat:toNum(x[6]),movesLeft:toNum(x[7]),source:String(x[8]||''),sessionId:String(x[9]||'')};
  return {date:x.date||x.timestamp||x['Дата']||'',nick:normNick(x.nick||x.name||x['Ник']),score:toNum(x.score||x['Очки']),level:normLevel(x.level||x['Уровень']),levelName:String(x.levelName||x['Название уровня']||''),win:x.win??x['Победа'],heat:toNum(x.heat??x['Жар']),movesLeft:toNum(x.movesLeft??x['Осталось ходов']),source:String(x.source||x['Источник']||''),sessionId:String(x.sessionId||x['Session ID']||'')};
}
function aggregateRows(raw,limit=TOP_LIMIT){
  const players=new Map();
  raw.map(normRow).filter(r=>r&&r.score>0&&r.level>0).forEach(r=>{
    const nick=normNick(r.nick);
    const id=nick.toLowerCase();
    if(!players.has(id))players.set(id,{nick,total:0,levels:0,maxLevel:0,bestByLevel:new Map(),lastDate:r.date});
    const p=players.get(id);
    const prev=p.bestByLevel.get(r.level);
    if(!prev||r.score>prev.score)p.bestByLevel.set(r.level,r);
    p.maxLevel=Math.max(p.maxLevel,r.level);
    p.lastDate=r.date||p.lastDate;
  });
  const rows=[...players.values()].map(p=>{
    const best=[...p.bestByLevel.values()];
    const total=best.reduce((s,r)=>s+Number(r.score||0),0);
    const last=best.sort((a,b)=>Number(b.level)-Number(a.level))[0]||{};
    return {nick:p.nick,total,levels:p.bestByLevel.size,maxLevel:p.maxLevel,lastLevelName:last.levelName||'',lastScore:last.score||0,lastDate:p.lastDate};
  }).filter(p=>p.total>0);
  return rows.sort((a,b)=>b.total-a.total||b.levels-a.levels||b.maxLevel-a.maxLevel||String(a.nick).localeCompare(String(b.nick),'ru')).slice(0,limit);
}
async function fetchViaScriptRaw(limit=500){
  const res=await fetch(`${LEADERBOARD_URL}?action=leaderboard&limit=${limit}&t=${Date.now()}`,{cache:'no-store'});
  const data=await res.json();
  return data.leaderboard||data.rows||data.data||data.items||[];
}
async function fetchViaSheetRaw(){
  const url=`https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&t=${Date.now()}`;
  const txt=await fetch(url,{cache:'no-store'}).then(r=>r.text());
  const json=JSON.parse(txt.replace(/^[\s\S]*?setResponse\(/,'').replace(/\);?\s*$/,''));
  return (json.table?.rows||[]).map(r=>(r.c||[]).map(c=>c?c.v:''));
}
async function fetchGlobalLeaderboard(limit=TOP_LIMIT){
  let raw=[];
  try{raw=await fetchViaScriptRaw(500)}catch(e){console.warn('script leaderboard failed',e)}
  let agg=aggregateRows(raw,limit);
  if(agg.length)return agg;
  try{raw=await fetchViaSheetRaw()}catch(e){console.warn('sheet leaderboard failed',e)}
  return aggregateRows(raw,limit);
}
function renderGlobalLeaderboardIntoModal(rows){
  const list=document.getElementById('leaderList');if(!list)return;
  const clear=document.getElementById('clearLeader');if(clear)clear.style.display='none';
  const sub=document.querySelector('#leaderOverlay .hero-sub');if(sub)sub.textContent='Топ-5 игроков. Сумма лучших результатов по каждому пройденному уровню из Google Sheets.';
  if(!rows.length){list.innerHTML='<div class="mini-card"><strong>Пока не удалось загрузить общий рейтинг</strong>Результаты пишутся в таблицу, но игра не смогла прочитать список. Проверь доступ к таблице или doGet в Apps Script.</div>';return}
  list.innerHTML=rows.map((x,i)=>`<div class="mini-card"><strong>${i+1}. ${fmt(x.total)} — ${escapeHtml(x.nick||'Игрок')}</strong>Пройдено уровней: ${x.levels} · максимум: ${x.maxLevel}/60 · лучший зачёт по каждому уровню</div>`).join('');
}
function escapeHtml(s){return String(s).replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]))}
async function loadLeaderboard(){const list=document.getElementById('leaderList');if(list)list.innerHTML='<div class="mini-card"><strong>Загружаю топ-5…</strong>Считаю сумму лучших результатов по уровням.</div>';const rows=await fetchGlobalLeaderboard(TOP_LIMIT);renderGlobalLeaderboardIntoModal(rows)}
function patchFinish(){try{if(window.__rzV3GlobalFinishPatched||typeof finish!=='function')return;window.__rzV3GlobalFinishPatched=true;const old=finish;finish=function(win){const out=old.apply(this,arguments);if(win)setTimeout(()=>submitScoreToGlobal('game'),250);return out}}catch(e){console.warn('global finish patch failed',e)}}
function patchLeaderboard(){try{if(!window.__rzV3GlobalLeaderboardPatched&&typeof renderLeaderboard==='function'){window.__rzV3GlobalLeaderboardPatched=true;renderLeaderboard=loadLeaderboard}document.addEventListener('click',e=>{if(e.target.closest&&e.target.closest('#openLeaderboardStart,#resultLeaderboard'))setTimeout(loadLeaderboard,120)},true)}catch(e){console.warn('global leaderboard patch failed',e)}}
window.rzV3SubmitScoreToGlobal=submitScoreToGlobal;window.rzV3FetchGlobalLeaderboard=fetchGlobalLeaderboard;window.rzV3LoadLeaderboard=loadLeaderboard;
function init(){patchFinish();patchLeaderboard();setTimeout(()=>{patchFinish();patchLeaderboard();const clear=document.getElementById('clearLeader');if(clear)clear.style.display='none'},800)}
document.addEventListener('DOMContentLoaded',init);window.addEventListener('load',init);setTimeout(init,0);
})();