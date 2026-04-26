(()=>{
const SCORE_RULES={win:2000,move:450,heat:350,perfectHeat:700,noLoseLeaderboard:true};
function installStyle(){
  if(document.getElementById('rz-v3-scoring-style'))return;
  const s=document.createElement('style');
  s.id='rz-v3-scoring-style';
  s.textContent=`
.rz-score-breakdown{display:grid!important;gap:7px!important}.rz-score-row{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:12px!important;padding:8px 10px!important;border-radius:14px!important;background:rgba(255,255,255,.045)!important;border:1px solid rgba(255,255,255,.07)!important}.rz-score-row b{font-size:13px!important}.rz-score-row span{font-weight:950!important;color:#f2cf77!important}.rz-score-total{background:linear-gradient(135deg,rgba(255,86,208,.14),rgba(143,79,255,.14))!important;border-color:rgba(255,255,255,.14)!important}.rz-score-note{font-size:12px!important;line-height:1.35!important;color:#b8afca!important;padding:2px 4px!important}
`;
  document.head.appendChild(s);
}
function fmt(n){return String(Math.max(0,Math.round(Number(n)||0))).replace(/\B(?=(\d{3})+(?!\d))/g,' ')}
function computeBonus(win){
  const base=Number(st?.score)||0;
  const moves=Math.max(0,Number(st?.moves)||0);
  const heat=Math.max(0,Number(st?.heat)||0);
  const winBonus=win?SCORE_RULES.win:0;
  const moveBonus=win?moves*SCORE_RULES.move:0;
  const heatBonus=win?(heat*SCORE_RULES.heat+(heat>=3?SCORE_RULES.perfectHeat:0)):0;
  const total=base+winBonus+moveBonus+heatBonus;
  return {base,moves,heat,winBonus,moveBonus,heatBonus,total};
}
function saveWinOnly(win,bonus){
  if(!win||SCORE_RULES.noLoseLeaderboard)return win;
  return win;
}
function patchFinish(){
  try{
    if(window.__rzV3ScoringPatched||typeof finish!=='function')return;
    window.__rzV3ScoringPatched=true;
    const oldFinish=finish;
    finish=function(win){
      if(st.__finished)return;
      st.__finished=true;
      const bonus=computeBonus(!!win);
      st.__scoreBreakdown=bonus;
      st.score=bonus.total;
      if(win){
        try{
          let arr=JSON.parse(localStorage.getItem('raznos_v3_leader')||'[]');
          arr.push({score:st.score,base:bonus.base,moveBonus:bonus.moveBonus,heatBonus:bonus.heatBonus,level:level().id,name:level().name,win:true,date:new Date().toLocaleDateString('ru-RU')});
          arr.sort((a,b)=>b.score-a.score);
          localStorage.setItem('raznos_v3_leader',JSON.stringify(arr.slice(0,20)));
        }catch(e){}
      }
      $('resultTitle').textContent=win?'Разнос удался':'Разнос перенесён';
      $('resultText').textContent=win?'Состав собран. Бонус за быстрый и чистый проход уже добавлен.':'Ходы закончились. В рейтинг теперь попадают только победы.';
      const rows=[];
      rows.push(`<div class="rz-score-row"><b>Очки за сборы</b><span>${fmt(bonus.base)}</span></div>`);
      if(win){
        rows.push(`<div class="rz-score-row"><b>Победа</b><span>+${fmt(bonus.winBonus)}</span></div>`);
        rows.push(`<div class="rz-score-row"><b>Осталось ходов × ${SCORE_RULES.move}</b><span>+${fmt(bonus.moveBonus)}</span></div>`);
        rows.push(`<div class="rz-score-row"><b>Жар ${bonus.heat}/3</b><span>+${fmt(bonus.heatBonus)}</span></div>`);
      }else{
        rows.push(`<div class="rz-score-note">Очки за попытку видны здесь, но в рейтинг не сохраняются — чтобы не было выгодно фармить до проигрыша.</div>`);
      }
      rows.push(`<div class="rz-score-row rz-score-total"><b>Итого</b><span>${fmt(st.score)}</span></div>`);
      rows.push(`<div class="rz-score-note">Теперь максимум очков — это не тянуть до нуля, а закрыть цели с запасом ходов, делать спецкомбо и держать высокий Жар.</div>`);
      $('resultDetails').innerHTML=`<div class="mini-card rz-score-breakdown">${rows.join('')}</div>`;
      try{hideAll()}catch(e){}
      $('resultOverlay').classList.add('active');
    };
  }catch(e){console.warn('score finish patch failed',e)}
}
function patchStartLevel(){
  try{
    if(window.__rzV3StartLevelScoringPatched||typeof startLevel!=='function')return;
    window.__rzV3StartLevelScoringPatched=true;
    const old=startLevel;
    startLevel=function(){st.__finished=false;st.__scoreBreakdown=null;return old.apply(this,arguments)};
  }catch(e){}
}
function patchLeaderboard(){
  try{
    if(window.__rzV3LeaderboardScoringPatched||typeof renderLeaderboard!=='function')return;
    window.__rzV3LeaderboardScoringPatched=true;
    renderLeaderboard=function(){
      let arr=[];try{arr=JSON.parse(localStorage.getItem('raznos_v3_leader')||'[]').filter(x=>x.win)}catch(e){}
      $('leaderList').innerHTML=arr.length?arr.slice(0,10).map((x,i)=>`<div class="mini-card"><strong>${i+1}. ${fmt(x.score)} очков</strong>Уровень ${x.level}: ${x.name} · победа · ${x.date}</div>`).join(''):'<div class="mini-card"><strong>Пока пусто</strong>В рейтинг теперь попадают только победы. Закрой уровень с запасом ходов — и результат появится здесь.</div>'
    };
  }catch(e){}
}
function patchHelp(){
  try{
    if(window.__rzV3ScoreHelpPatched)return;window.__rzV3ScoreHelpPatched=true;
    document.addEventListener('click',e=>{
      const badge=e.target.closest&&e.target.closest('.badge[data-help="score"]');
      if(!badge)return;
      setTimeout(()=>{
        try{showHelp('Очки','Максимум очков теперь даёт не затягивание, а красивое быстрое прохождение:\n\n• обычные сборы дают базовые очки;\n• победа даёт +2000;\n• каждый оставшийся ход даёт +450;\n• Жар даёт бонус, а 3/3 — дополнительный премиум;\n• проигрыш не попадает в рейтинг.\n\nЛучшая стратегия: делать спецкомбо и чистить помехи, но закрывать цели с запасом ходов.') }catch(err){}
      },0);
    },true);
  }catch(e){}
}
function patchSelfTest(){
  try{
    const old=window.rzV3SelfTest;
    window.rzV3ScoreTest=function(show=true){
      const backup=JSON.stringify({score:st.score,moves:st.moves,heat:st.heat});
      st.score=1000;st.moves=5;st.heat=3;
      const b=computeBonus(true);
      const ok=b.total===1000+SCORE_RULES.win+5*SCORE_RULES.move+3*SCORE_RULES.heat+SCORE_RULES.perfectHeat;
      Object.assign(st,JSON.parse(backup));
      const text=(ok?'✅':'❌')+' Бонус победы: '+fmt(b.total)+'\nПобеда +'+fmt(SCORE_RULES.win)+' · ходы 5×'+SCORE_RULES.move+' · жар 3/3';
      if(show){try{showHelp('Тест очков',text)}catch(e){alert(text)}}
      return ok;
    };
  }catch(e){}
}
function init(){installStyle();patchStartLevel();patchFinish();patchLeaderboard();patchHelp();patchSelfTest();setTimeout(()=>{patchStartLevel();patchFinish();patchLeaderboard()},800)}
document.addEventListener('DOMContentLoaded',init);window.addEventListener('load',init);setTimeout(init,0);setTimeout(init,900);
})();