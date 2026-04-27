(()=>{
const LEADERBOARD_URL='https://script.google.com/macros/s/AKfycbyb-QWZAf2e0dthB5-jbd5l1n-CLd5UMzRLjdgwK5n0jslb8vZeJG130dXsXlxJYYE/exec';
const SHEET_ID='1x39s3Gwfv5XsNgXcOaycwgKa1jZf9T5ujeEajSW9aRc';
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
function normRow(x){
  if(!x)return null;
  if(Array.isArray(x))return {date:x[0],nick:x[1]||'Игрок',score:Number(x[2]||0),level:x[3],levelName:x[4]||'',win:x[5],heat:x[6]||0,movesLeft:x[7]||0,source:x[8]||''};
  return {date:x.date||x.timestamp||x['Дата']||'',nick:x.nick||x.name||x['Ник']||'Игрок',score:Number(x.score||x['Очки']||0),level:x.level||x['Уровень']||'',levelName:x.levelName||x['Название уровня']||'',win:x.win??x['Победа'],heat:x.heat??x['Жар'],movesLeft:x.movesLeft??x['Осталось ходов'],source:x.source||x['Источник']||''};
}
function sortRows(rows,limit){return rows.map(normRow).filter(r=>r&&r.score>0).sort((a,b)=>Number(b.score)-Number(a.score)||Number(b.level||0)-Number(a.level||0)).slice(0,limit||20)}
async function fetchViaScript(limit){
  const res=await fetch(`${LEADERBOARD_URL}?action=leaderboard&limit=${limit}&t=${Date.now()}`,{cache:'no-store'});
  const data=await res.json();
  const raw=data.leaderboard||data.rows||data.data||data.items||[];
  return sortRows(raw,limit);
}
async function fetchViaSheet(limit){
  const url=`https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&t=${Date.now()}`;
  const txt=await fetch(url,{cache:'no-store'}).then(r=>r.text());
  const json=JSON.parse(txt.replace(/^[\s\S]*?setResponse\(/,'').replace(/\);?\s*$/,''));
  const rows=(json.table?.rows||[]).map(r=>(r.c||[]).map(c=>c?c.v:''));
  return sortRows(rows,limit);
}
async function fetchGlobalLeaderboard(limit=20){
  try{const a=await fetchViaScript(limit);if(a.length)return a}catch(e){console.warn('script leaderboard failed',e)}
  try{const b=await fetchViaSheet(limit);if(b.length)return b}catch(e){console.warn('sheet leaderboard failed',e)}
  return [];
}
function renderGlobalLeaderboardIntoModal(rows){
  const list=document.getElementById('leaderList');if(!list)return;
  const clear=document.getElementById('clearLeader');if(clear)clear.style.display='none';
  const sub=document.querySelector('#leaderOverlay .hero-sub');if(sub)sub.textContent='Общий рейтинг из Google Sheets. Видят все игроки на разных устройствах.';
  if(!rows.length){list.innerHTML='<div class="mini-card"><strong>Пока не удалось загрузить общий рейтинг</strong>Результаты в таблицу пишутся, но отдача рейтинга из Apps Script/Sheets пока не отвечает. Проверь doGet или доступ к таблице.</div>';return}
  list.innerHTML=rows.map((x,i)=>`<div class="mini-card"><strong>${i+1}. ${fmt(x.score)} — ${escapeHtml(x.nick||'Игрок')}</strong>Уровень ${x.level||'-'}: ${escapeHtml(x.levelName||'')} · жар ${x.heat??0} · ходов осталось ${x.movesLeft??0}</div>`).join('');
}
function escapeHtml(s){return String(s).replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]))}
async function loadLeaderboard(){const list=document.getElementById('leaderList');if(list)list.innerHTML='<div class="mini-card"><strong>Загружаю общий рейтинг…</strong>Тяну данные из Google Sheets.</div>';const rows=await fetchGlobalLeaderboard(20);renderGlobalLeaderboardIntoModal(rows)}
function patchFinish(){try{if(window.__rzV3GlobalFinishPatched||typeof finish!=='function')return;window.__rzV3GlobalFinishPatched=true;const old=finish;finish=function(win){const out=old.apply(this,arguments);if(win)setTimeout(()=>submitScoreToGlobal('game'),250);return out}}catch(e){console.warn('global finish patch failed',e)}}
function patchLeaderboard(){try{if(!window.__rzV3GlobalLeaderboardPatched&&typeof renderLeaderboard==='function'){window.__rzV3GlobalLeaderboardPatched=true;renderLeaderboard=loadLeaderboard}document.addEventListener('click',e=>{if(e.target.closest&&e.target.closest('#openLeaderboardStart,#resultLeaderboard'))setTimeout(loadLeaderboard,120)},true)}catch(e){console.warn('global leaderboard patch failed',e)}}
window.rzV3SubmitScoreToGlobal=submitScoreToGlobal;window.rzV3FetchGlobalLeaderboard=fetchGlobalLeaderboard;window.rzV3LoadLeaderboard=loadLeaderboard;
function init(){patchFinish();patchLeaderboard();setTimeout(()=>{patchFinish();patchLeaderboard();const clear=document.getElementById('clearLeader');if(clear)clear.style.display='none'},800)}
document.addEventListener('DOMContentLoaded',init);window.addEventListener('load',init);setTimeout(init,0);
})();