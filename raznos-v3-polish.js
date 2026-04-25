(()=>{
const GOAL_HELP=[
  [/самирхан/i,'Самирхан','Собирай Самирхана в ряд из 3+. Он закрывает цель уровня, а его пассивка «Рывок» после зарядки добавляет +1 ход — как будто дедлайн отодвинули.'],
  [/блэк\s*наст|блэкнаст|black/i,'Блэк Настя','Собирай Блэк Настю в ряд из 3+. Её Black mode после зарядки чистит одну помеху: Эмиля, паутину, отчёт или закрытую клетку.'],
  [/роза/i,'Роза Ксю','Собирай Розу Ксю в ряд из 3+. Её «Глам-подмена» помогает получить нужного героя на поле, когда состав упрямится.'],
  [/вова/i,'Вова Д','Собирай Вову Дискотеку в ряд из 3+. Его «Дискоряд» после зарядки сносит целый ряд и может задеть помехи.'],
  [/эмил/i,'Эмиль','Эмиль — блокер на созвоне. Его нельзя двигать и собирать как обычную фишку. Собери любые 3+ одинаковые фишки рядом с ним, чтобы он вышел из созвона.'],
  [/паутин/i,'Паутина','Паутина держит клетку. Снимай её сбором рядом или сбором запутанной фишки. Чем раньше снять паутину, тем меньше хаоса на поле.'],
  [/спец/i,'Спецкомбо','Собери 4 одинаковые фишки в ряд, чтобы создать линию. 5 в ряд создаёт Чёрный список. Спецкомбо помогает чистить поле и помехи.'],
  [/отч[её]т/i,'Отчёт','Отчёт — помеха на поле. Убирается сбором рядом или спецэффектом. Если отчётов много — состав начинает пахнуть понедельником.']
];
function css(){
 if(document.getElementById('rz-v3-polish-style'))return;
 const s=document.createElement('style');
 s.id='rz-v3-polish-style';
 s.textContent=`
.skills{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:5px!important;overflow:visible!important;padding:4px!important;min-height:34px!important}.skills-label{display:none!important}.skill{justify-content:center!important;padding:3px!important;min-width:0!important;border-radius:12px!important}.skill span:not(.icon){font-size:9px!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important}.skill .icon{width:24px!important;height:24px!important;min-width:24px!important}.goals>.chip{cursor:pointer!important}.boss-pill{min-height:44px!important}.boss-text{font-size:12px!important;line-height:1.16!important}.tile .art{background-size:cover!important}.tile[data-rz-art="pass"] .art,.tile[data-rz-art="mic"] .art{background-size:cover!important;background-position:center!important}#helpText{white-space:pre-line!important}
.cell .tile{animation:rzTileIn .18s cubic-bezier(.2,.9,.2,1)}.cell.selected .tile{animation:rzSelectedPulse .72s ease-in-out infinite}.toast.show{animation:rzToastPop .34s cubic-bezier(.2,1.35,.3,1)}.badge.rz-pulse,.chip.rz-pulse,.skill.rz-pulse,.boss-pill.rz-pulse{animation:rzUiPulse .52s ease-out}.web-layer{animation:rzWebBreath 1.8s ease-in-out infinite}.locked-layer{animation:rzLockGlow 1.9s ease-in-out infinite}.boss-pill.show{animation:rzBossIdle 2.4s ease-in-out infinite}.rz-cell-ripple{position:absolute;inset:0;border-radius:inherit;pointer-events:none;z-index:30;background:radial-gradient(circle,rgba(255,255,255,.46),rgba(255,86,208,.22) 34%,transparent 68%);animation:rzRipple .38s ease-out forwards}.rz-burst{position:absolute;left:50%;top:50%;width:0;height:0;pointer-events:none;z-index:85}.rz-burst i{position:absolute;width:7px;height:7px;border-radius:50%;background:linear-gradient(135deg,#ff56d0,#f2cf77);box-shadow:0 0 10px rgba(255,86,208,.65);animation:rzParticle .72s ease-out forwards}.rz-board-shake{animation:rzBoardShake .22s ease-out}.rz-board-glow{animation:rzBoardGlow .55s ease-out}.rz-skill-flash{animation:rzSkillFlash .72s ease-out!important}.rz-score-float{position:absolute;right:18px;top:58px;z-index:75;font-weight:950;color:#f2cf77;text-shadow:0 2px 10px rgba(0,0,0,.55);pointer-events:none;animation:rzScoreFloat .9s ease-out forwards}
@keyframes rzTileIn{from{opacity:.72;transform:scale(.88) translateY(-3px)}to{opacity:1;transform:scale(1) translateY(0)}}@keyframes rzSelectedPulse{0%,100%{filter:brightness(1);transform:scale(1)}50%{filter:brightness(1.14);transform:scale(1.035)}}@keyframes rzToastPop{0%{transform:translateX(-50%) translateY(28px) scale(.92)}70%{transform:translateX(-50%) translateY(-2px) scale(1.04)}100%{transform:translateX(-50%) translateY(0) scale(1)}}@keyframes rzUiPulse{0%{box-shadow:0 0 0 0 rgba(255,86,208,0)}35%{box-shadow:0 0 0 4px rgba(255,86,208,.28)}100%{box-shadow:0 0 0 0 rgba(255,86,208,0)}}@keyframes rzWebBreath{0%,100%{opacity:.92;filter:brightness(1)}50%{opacity:1;filter:brightness(1.18)}}@keyframes rzLockGlow{0%,100%{filter:brightness(1)}50%{filter:brightness(1.22)}}@keyframes rzBossIdle{0%,100%{transform:translateY(0)}50%{transform:translateY(-1px)}}@keyframes rzRipple{0%{opacity:.65;transform:scale(.4)}100%{opacity:0;transform:scale(1.45)}}@keyframes rzParticle{0%{opacity:1;transform:translate(0,0) scale(1)}100%{opacity:0;transform:translate(var(--x),var(--y)) scale(.25)}}@keyframes rzBoardShake{0%,100%{transform:translateX(0)}25%{transform:translateX(-3px)}55%{transform:translateX(3px)}75%{transform:translateX(-1px)}}@keyframes rzBoardGlow{0%{box-shadow:0 14px 30px rgba(0,0,0,.35)}35%{box-shadow:0 0 0 3px rgba(255,86,208,.22),0 18px 38px rgba(143,79,255,.35)}100%{box-shadow:0 14px 30px rgba(0,0,0,.35)}}@keyframes rzSkillFlash{0%{transform:scale(1);filter:brightness(1)}35%{transform:scale(1.05);filter:brightness(1.28)}100%{transform:scale(1);filter:brightness(1)}}@keyframes rzScoreFloat{0%{opacity:0;transform:translateY(8px) scale(.9)}18%{opacity:1}100%{opacity:0;transform:translateY(-24px) scale(1.08)}}
@media(max-height:720px){.skills{grid-template-columns:repeat(4,minmax(0,1fr))!important}.skill span:not(.icon){display:block!important;font-size:0!important}.skill .icon{width:26px!important;height:26px!important;min-width:26px!important}}
`;
 document.head.appendChild(s)
}
function extractArt(txt,key){
 const m=txt.match(new RegExp('"'+key+'"\\s*:\\s*"(data:image\\/webp;base64,[^"]+)"'));
 return m&&m[1]?m[1]:'';
}
async function loadTbankArts(){
 try{
  const txt=await fetch('./raznos-tbank-icons.js?v=20260426-v3-direct',{cache:'no-store'}).then(r=>r.text());
  const p=extractArt(txt,'P');
  const m=extractArt(txt,'M');
  if(typeof TILE!=='undefined'&&typeof A!=='undefined'){
    if(p){A.pass=p;TILE.pass.art='pass';TILE.pass.emoji='';TILE.pass.name='Клиенты'}
    if(m){A.mic=m;TILE.mic.art='mic';TILE.mic.emoji='';TILE.mic.name='Карта'}
    try{renderAll()}catch(e){}
    setTimeout(()=>{try{renderAll()}catch(e){}},150);
  }
 }catch(e){console.warn('v3 polish tbank art failed',e)}
}
function markPMArts(){
 try{
  document.querySelectorAll('#board .cell').forEach(cell=>{
    const r=+cell.dataset.r,c=+cell.dataset.c;
    const x=st?.board?.[r]?.[c];
    const tile=cell.querySelector('.tile');
    if(!x||!tile||!x.type)return;
    if(x.type==='pass')tile.dataset.rzArt='pass';
    if(x.type==='mic')tile.dataset.rzArt='mic';
  })
 }catch(e){}
}
function patchNames(){try{TILE.black.name='Блэк Настя';TILE.pass.name='Клиенты';TILE.mic.name='Карта'}catch(e){}}
function pulse(el){if(!el)return;el.classList.remove('rz-pulse');void el.offsetWidth;el.classList.add('rz-pulse')}
function pulseSkillByText(text){try{document.querySelectorAll('.skill').forEach(s=>{if((s.textContent||'').toLowerCase().includes(text))s.classList.add('rz-skill-flash'),setTimeout(()=>s.classList.remove('rz-skill-flash'),780)})}catch(e){}}
function boardFx(kind='glow'){const b=document.getElementById('board');if(!b)return;const cls=kind==='shake'?'rz-board-shake':'rz-board-glow';b.classList.remove(cls);void b.offsetWidth;b.classList.add(cls);setTimeout(()=>b.classList.remove(cls),650)}
function burst(){const app=document.querySelector('.app')||document.body;const box=document.createElement('div');box.className='rz-burst';const rect=(document.getElementById('board')||app).getBoundingClientRect();box.style.left=(rect.left+rect.width/2)+'px';box.style.top=(rect.top+rect.height/2)+'px';for(let i=0;i<14;i++){const p=document.createElement('i');const a=Math.PI*2*i/14;const d=38+Math.random()*32;p.style.setProperty('--x',Math.cos(a)*d+'px');p.style.setProperty('--y',Math.sin(a)*d+'px');box.appendChild(p)}app.appendChild(box);setTimeout(()=>box.remove(),850)}
function scoreFloat(txt){const app=document.querySelector('.app')||document.body;const el=document.createElement('div');el.className='rz-score-float';el.textContent=txt;app.appendChild(el);setTimeout(()=>el.remove(),950)}
function patchBoss(){
 try{
  if(window.__rzV3BossPatched)return;window.__rzV3BossPatched=true;
  const old=renderHud;
  renderHud=function(){old();try{if(level().boss){bossText.textContent='Батенин уже печатает приказ — через '+st.bossLeft+' х. Без паники.'}}catch(e){};markPMArts()};
 }catch(e){}
}
function patchToastFx(){
 try{
  if(window.__rzV3ToastFxPatched)return;window.__rzV3ToastFxPatched=true;
  const old=toast;
  toast=function(t){old(t);const low=String(t||'').toLowerCase();if(low.includes('рывок')){pulseSkillByText('рывок');pulse(document.getElementById('movesBadge')?.closest('.badge'));scoreFloat('+1 ход')}if(low.includes('black mode')){pulseSkillByText('black');boardFx('glow');burst()}if(low.includes('глам')){pulseSkillByText('глам');boardFx('glow');burst()}if(low.includes('дискоряд')){pulseSkillByText('дискоряд');boardFx('shake');burst()}if(low.includes('скандал')){boardFx('glow');burst();scoreFloat('+спец')}if(low.includes('батенин')){pulse(document.getElementById('bossPill'));boardFx('shake')}if(low.includes('паучиха')||low.includes('паутина'))boardFx('glow')}
 }catch(e){}
}
function bindTapRipple(){
 if(window.__rzV3RippleBound)return;window.__rzV3RippleBound=true;
 document.addEventListener('pointerdown',e=>{const c=e.target.closest&&e.target.closest('#board .cell');if(!c)return;const r=document.createElement('span');r.className='rz-cell-ripple';c.appendChild(r);setTimeout(()=>r.remove(),420)},true)
}
function bindGoalHelp(){
 if(window.__rzV3GoalHelpBound)return;window.__rzV3GoalHelpBound=true;
 document.addEventListener('click',e=>{
   const chip=e.target.closest&&e.target.closest('.goals > .chip');
   if(!chip||e.target.closest('.skill'))return;
   const t=chip.textContent||'';
   const item=GOAL_HELP.find(([rx])=>rx.test(t));
   if(item){e.preventDefault();e.stopPropagation();try{showHelp(item[1],item[2])}catch(err){}}
 },true);
}
function countObstacles(){
 let n=0;
 try{for(let r=0;r<SIZE;r++)for(let c=0;c<SIZE;c++){const x=st.board[r][c];if(x&&(x.web||x.locked||x.blocker))n++}}catch(e){}
 return n;
}
function fillTestBoard(type='pass'){
 st.board=Array.from({length:SIZE},()=>Array.from({length:SIZE},()=>cell(type)));
}
function snap(){return JSON.stringify({level:st.level,board:st.board,sel:st.sel,moves:st.moves,score:st.score,heat:st.heat,progress:st.progress,shuffle:st.shuffle,anim:st.anim,bossLeft:st.bossLeft,skillCharge:st.skillCharge})}
function restore(s){const o=JSON.parse(s);Object.assign(st,o);try{renderAll()}catch(e){}}
function runOne(name,fn){try{const ok=fn();return {name,ok:!!ok,detail:ok===true?'OK':String(ok)}}catch(e){return {name,ok:false,detail:e.message||String(e)}}}
function runSelfTest(show=true){
 const backup=snap();
 const results=[];
 results.push(runOne('P/M арты загружены',()=>!!A.pass&&!!A.mic||'A.pass/A.mic ещё не загрузились'));
 results.push(runOne('Рывок Самирхана: +1 ход',()=>{fillTestBoard('pass');st.moves=10;st.skillCharge.rush=4;chargeSkills('samir');return st.moves===11&&st.skillCharge.rush===0||`moves=${st.moves}, charge=${st.skillCharge.rush}`}));
 results.push(runOne('Black mode: чистит помеху',()=>{fillTestBoard('pass');st.board[0][0].web=true;st.board[0][1].locked=true;st.board[0][2]=cell(null);st.board[0][2].blocker='emil';const before=countObstacles();st.skillCharge.black=4;chargeSkills('black');const after=countObstacles();return after<before||`before=${before}, after=${after}`}));
 results.push(runOne('Глам-подмена: создаёт Розу Ксю',()=>{fillTestBoard('pass');st.skillCharge.glam=4;const before=JSON.stringify(st.board).match(/"rosa"/g)?.length||0;chargeSkills('rosa');const after=JSON.stringify(st.board).match(/"rosa"/g)?.length||0;return after>before||`before=${before}, after=${after}`}));
 results.push(runOne('Дискоряд Вовы: сносит ряд',()=>{fillTestBoard('pass');st.score=0;st.skillCharge.disco=4;const oldRandom=Math.random;Math.random=()=>0;try{chargeSkills('vova')}finally{Math.random=oldRandom}return st.score>=80&&st.skillCharge.disco===0||`score=${st.score}, charge=${st.skillCharge.disco}`}));
 restore(backup);
 const passed=results.filter(x=>x.ok).length;
 const text=results.map(x=>(x.ok?'✅ ':'❌ ')+x.name+(x.ok?'':' — '+x.detail)).join('\n')+`\n\nИтог: ${passed}/${results.length} проверок пройдено.`;
 console.table(results);
 if(show){try{showHelp('Самотест умений',text)}catch(e){alert(text)}}
 return results;
}
function maybeAutoSelfTest(){
 try{if(new URLSearchParams(location.search).has('selftest'))setTimeout(()=>runSelfTest(true),1700)}catch(e){}
}
function init(){css();patchNames();patchBoss();patchToastFx();bindTapRipple();bindGoalHelp();loadTbankArts();setTimeout(()=>{try{renderAll();markPMArts()}catch(e){}},250);setTimeout(loadTbankArts,900);setTimeout(markPMArts,1200);window.rzV3SelfTest=runSelfTest;maybeAutoSelfTest()}
document.addEventListener('DOMContentLoaded',init);window.addEventListener('load',init);setTimeout(init,0);setTimeout(init,700);
})();