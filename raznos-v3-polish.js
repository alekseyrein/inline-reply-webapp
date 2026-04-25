(()=>{
const GOAL_HELP=[
  [/самирхан/i,'Самирхан','Собирай фишки Самирхана в ряд из 3+. Это закрывает цель уровня. Его пассивка «Рывок» после зарядки добавляет +1 ход.'],
  [/блэкнаст|black/i,'Блэк Настя','Собирай Блэк Настю в ряд из 3+. Её Black mode после зарядки чистит одну помеху: Эмиля, паутину, отчёт или закрытую клетку.'],
  [/роза/i,'Роза Ксю','Собирай Розу Ксю в ряд из 3+. Её «Глам-подмена» помогает получить нужного героя на поле.'],
  [/вова/i,'Вова Д','Собирай Вову Дискотеку в ряд из 3+. Его «Дискоряд» после зарядки сносит ряд и может задеть помехи.'],
  [/эмил/i,'Эмиль','Эмиль — блокер. Его нельзя собрать как обычную фишку. Собери любые 3+ одинаковые фишки рядом с ним, чтобы он вышел из созвона.'],
  [/паутин/i,'Паутина','Паутина держит клетку. Снимай её сбором рядом или сбором запутанной фишки. Чем раньше снять паутину, тем легче уровень.'],
  [/спец/i,'Спецкомбо','Собери 4 одинаковые фишки в ряд, чтобы создать линию. 5 в ряд создаёт Чёрный список. Спецкомбо помогает чистить поле и помехи.'],
  [/отч[её]т/i,'Отчёт','Отчёт — помеха на поле. Убирается сбором рядом или спецэффектом.']
];
function css(){
 if(document.getElementById('rz-v3-polish-style'))return;
 const s=document.createElement('style');s.id='rz-v3-polish-style';s.textContent=`
.skills{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:5px!important;overflow:visible!important;padding:4px!important;min-height:34px!important}.skills-label{display:none!important}.skill{justify-content:center!important;padding:3px!important;min-width:0!important;border-radius:12px!important}.skill span:not(.icon){font-size:9px!important;overflow:hidden!important;text-overflow:ellipsis!important}.skill .icon{width:24px!important;height:24px!important;min-width:24px!important}.goals>.chip{cursor:pointer!important}.boss-pill{min-height:44px!important}.boss-text{font-size:12px!important;line-height:1.16!important}.tile .art{background-size:cover!important}`;
 document.head.appendChild(s)
}
async function loadTbankArts(){
 try{
  const txt=await fetch('./raznos-tbank-icons.js?v=20260425-v3-polish',{cache:'no-store'}).then(r=>r.text());
  const p=txt.match(/"P"\s*:\s*"(data:image\/webp;base64,[^"]+)"/);
  const m=txt.match(/"M"\s*:\s*"(data:image\/webp;base64,[^"]+)"/);
  if(window.TILE||typeof TILE!=='undefined'){
    if(p){A.pass=p[1];TILE.pass.art='pass'}
    if(m){A.mic=m[1];TILE.mic.art='mic'}
    try{renderAll()}catch{}
  }
 }catch(e){console.warn('v3 polish tbank art failed',e)}
}
function patchNames(){try{TILE.black.name='Блэк Настя'}catch{}}
function patchBoss(){
 try{
  if(window.__rzV3BossPatched)return;window.__rzV3BossPatched=true;
  const old=renderHud;
  renderHud=function(){old();try{if(level().boss){bossText.textContent='Батенин уже печатает приказ — через '+st.bossLeft+' х.'}}catch{}};
 }catch(e){}
}
function bindGoalHelp(){
 if(window.__rzV3GoalHelpBound)return;window.__rzV3GoalHelpBound=true;
 document.addEventListener('click',e=>{
   const chip=e.target.closest&&e.target.closest('.goals > .chip');
   if(!chip||e.target.closest('.skill'))return;
   const t=chip.textContent||'';
   const item=GOAL_HELP.find(([rx])=>rx.test(t));
   if(item){e.preventDefault();e.stopPropagation();try{showHelp(item[1],item[2])}catch{}}
 },true);
}
function init(){css();patchNames();patchBoss();bindGoalHelp();loadTbankArts();setTimeout(()=>{try{renderAll()}catch{}},300);setTimeout(loadTbankArts,900)}
document.addEventListener('DOMContentLoaded',init);window.addEventListener('load',init);setTimeout(init,0);setTimeout(init,700);
})();