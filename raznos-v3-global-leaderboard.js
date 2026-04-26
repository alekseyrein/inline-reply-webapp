(()=>{
const LEADERBOARD_URL='https://script.google.com/macros/s/AKfycbyb-QWZAf2e0dthB5-jbd5l1n-CLd5UMzRLjdgwK5n0jslb8vZeJG130dXsXlxJYYE/exec';
function fmt(n){return String(Math.max(0,Math.round(Number(n)||0))).replace(/\B(?=(\d{3})+(?!\d))/g,' ')}
function getSessionId(){const k='raznos_v3_session_id';let id=localStorage.getItem(k);if(!id){id='rz_'+Math.random().toString(36).slice(2)+Date.now().toString(36);localStorage.setItem(k,id)}return id}
function getNick(){return localStorage.getItem('raznos_v3_nick')||'Игрок'}
async function submitScoreToGlobal(){
  try{
    if(!window.st||typeof level!=='function')return;
    const lv=level();
    const payload={
      nick:getNick(),
      score:Number(st.score||0),
      level:Number(lv.id||((st.level||0)+1)||1),
      levelName:String(lv.name||''),
      win:true,
      heat:Number(st.heat||0),
      movesLeft:Number(st.moves||0),
      source:'game',
      sessionId:getSessionId(),
      userAgent:navigator.userAgent||''
    };
    await fetch(LEADERBOARD_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),mode:'cors'});
  }catch(e){console.warn('Global leaderboard submit failed',e)}
}
async function fetchGlobalLeaderboard(limit=10){
  const url=`${LEADERBOARD_URL}?action=leaderboard&limit=${limit}`;
  const res=await fetch(url,{cache:'no-store'});
  const data=await res.json();
  if(!data||!data.ok)return[];
  return Array.isArray(data.leaderboard)?data.leaderboard:[];
}
function renderGlobalLeaderboardIntoModal(rows){
  const list=document.getElementById('leaderList');
  if(!list)return;
  if(!rows.length){
    list.innerHTML='<div class="mini-card"><strong>Пока пусто</strong>Глобальный рейтинг ещё не раскачали.</div>';
    return;
  }
  list.innerHTML=rows.map((x,i)=>`<div class="mini-card"><strong>${i+1}. ${fmt(x.score)} очков — ${x.nick||'Игрок'}</strong>Уровень ${x.level||'-'}: ${x.levelName||''} · жар ${x.heat??0} · ходов осталось ${x.movesLeft??0}</div>`).join('');
}
function patchFinish(){
  try{
    if(window.__rzV3GlobalFinishPatched||typeof finish!=='function')return;
    window.__rzV3GlobalFinishPatched=true;
    const old=finish;
    finish=function(win){
      const out=old.apply(this,arguments);
      if(win)setTimeout(()=>{submitScoreToGlobal()},250);
      return out;
    };
  }catch(e){console.warn('global finish patch failed',e)}
}
function patchLeaderboard(){
  try{
    if(window.__rzV3GlobalLeaderboardPatched||typeof renderLeaderboard!=='function')return;
    window.__rzV3GlobalLeaderboardPatched=true;
    renderLeaderboard=async function(){
      const list=document.getElementById('leaderList');
      if(list)list.innerHTML='<div class="mini-card"><strong>Загружаю общий рейтинг…</strong></div>';
      try{const rows=await fetchGlobalLeaderboard(10);renderGlobalLeaderboardIntoModal(rows)}catch(e){if(list)list.innerHTML='<div class="mini-card"><strong>Не удалось загрузить рейтинг</strong>Попробуй открыть ещё раз.</div>'}
    };
  }catch(e){console.warn('global leaderboard patch failed',e)}
}
function init(){patchFinish();patchLeaderboard();setTimeout(()=>{patchFinish();patchLeaderboard()},1000)}
document.addEventListener('DOMContentLoaded',init);window.addEventListener('load',init);setTimeout(init,0);
})();