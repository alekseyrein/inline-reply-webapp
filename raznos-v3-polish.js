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
function patchBoss(){
 try{
  if(window.__rzV3BossPatched)return;window.__rzV3BossPatched=true;
  const old=renderHud;
  renderHud=function(){old();try{if(level().boss){bossText.textContent='Батенин уже печатает приказ — через '+st.bossLeft+' х. Без паники.'}}catch(e){};markPMArts()};
 }catch(e){}
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
function init(){css();patchNames();patchBoss();bindGoalHelp();loadTbankArts();setTimeout(()=>{try{renderAll();markPMArts()}catch(e){}},250);setTimeout(loadTbankArts,900);setTimeout(markPMArts,1200);window.rzV3SelfTest=runSelfTest;maybeAutoSelfTest()}
document.addEventListener('DOMContentLoaded',init);window.addEventListener('load',init);setTimeout(init,0);setTimeout(init,700);
})();