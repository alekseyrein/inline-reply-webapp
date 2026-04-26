(()=>{
const STORE_UNLOCK='raznos_v3_unlocked_max';
const STORE_DEV='raznos_v3_dev_all';
const CODE=[[0,0],[6,6],[0,6],[6,0]];
function css(){
  if(document.getElementById('rz-v3-unlocks-style'))return;
  const s=document.createElement('style');
  s.id='rz-v3-unlocks-style';
  s.textContent=`
.level-chip.rz-locked{opacity:.58;filter:saturate(.72);position:relative}.level-chip.rz-locked::after{content:'🔒';position:absolute;right:10px;top:10px;font-size:16px;opacity:.9}.level-chip.rz-open{cursor:pointer}.level-chip.rz-open:hover{filter:brightness(1.06)}
`;
  document.head.appendChild(s);
}
function getUnlockedMax(){
  const raw=parseInt(localStorage.getItem(STORE_UNLOCK)||'1',10);
  return Math.max(1,Math.min((typeof LEVELS!=='undefined'?LEVELS.length:1),Number.isFinite(raw)?raw:1));
}
function setUnlockedMax(n){
  localStorage.setItem(STORE_UNLOCK,String(Math.max(1,Math.min(LEVELS.length,n))));
}
function hasDevAll(){return localStorage.getItem(STORE_DEV)==='1'}
function setDevAll(v){if(v)localStorage.setItem(STORE_DEV,'1');else localStorage.removeItem(STORE_DEV)}
function unlockNextFromCurrent(){setUnlockedMax(Math.max(getUnlockedMax(),Math.min(LEVELS.length,(st.level||0)+2)))}
function levelsText(){
  const sub=document.querySelector('#levelsOverlay .hero-sub');
  if(sub)sub.textContent=hasDevAll()?'Все уровни открыты: тестовый режим активирован на этом устройстве.':'Новые уровни открываются по мере прохождения.';
  const startSub=document.querySelector('#startOverlay .hero-sub');
  if(startSub)startSub.textContent='Меняй соседние фишки, собирай 3+ одинаковых, чисти Эмиля, паутину, отчёты и давление Батенина. Уровни открываются по мере прохождения.';
  const backupCard=[...document.querySelectorAll('#startOverlay .mini-card')].find(x=>(x.textContent||'').toLowerCase().includes('бэкап'));
  if(backupCard)backupCard.remove();
 }
function patchRenderLevels(){
  try{
    if(window.__rzV3UnlockRenderPatched||typeof renderLevels!=='function')return;
    window.__rzV3UnlockRenderPatched=true;
    const old=renderLevels;
    renderLevels=function(){
      try{old.apply(this,arguments)}catch(e){}
      css();levelsText();
      const grid=$('levelGrid'); if(!grid)return;
      const unlocked=getUnlockedMax(); const dev=hasDevAll();
      grid.innerHTML='';
      LEVELS.forEach((lv,idx)=>{
        const open=dev||idx<unlocked;
        const b=document.createElement('button');
        b.className='level-chip '+(open?'rz-open':'rz-locked');
        b.disabled=!open;
        b.innerHTML=`<strong>${lv.id}. ${lv.name}</strong><small>${open?lv.sub:(idx===0?'Открыт':'Открой уровень '+idx)}</small>`;
        if(open)b.onclick=()=>{startLevel(idx)};
        else b.onclick=()=>{try{showHelp('Уровень закрыт','Сначала пройди предыдущий уровень. Новые уровни открываются по порядку.')}catch(e){}};
        grid.appendChild(b);
      });
    };
  }catch(e){console.warn('unlock render patch failed',e)}
}
function patchStartLevel(){
  try{
    if(window.__rzV3UnlockStartPatched||typeof startLevel!=='function')return;
    window.__rzV3UnlockStartPatched=true;
    const old=startLevel;
    startLevel=function(i=0){
      const open=hasDevAll()||i<getUnlockedMax();
      if(!open){try{toast('Уровень пока закрыт')}catch(e){};try{showHelp('Уровень закрыт','Сначала пройди предыдущий уровень. Потом этот уровень откроется сам.')}catch(e){};return}
      st.__devCornerProgress=0;
      return old.apply(this,arguments);
    };
  }catch(e){console.warn('unlock start patch failed',e)}
}
function patchFinish(){
  try{
    if(window.__rzV3UnlockFinishPatched||typeof finish!=='function')return;
    window.__rzV3UnlockFinishPatched=true;
    const old=finish;
    finish=function(win){if(win)unlockNextFromCurrent();const out=old.apply(this,arguments);setTimeout(()=>{try{renderLevels()}catch(e){}},30);return out};
  }catch(e){console.warn('unlock finish patch failed',e)}
}
function bindCode(){
  if(window.__rzV3UnlockCodeBound)return;
  window.__rzV3UnlockCodeBound=true;
  document.addEventListener('pointerdown',e=>{
    const cell=e.target.closest&&e.target.closest('#board .cell');
    if(!cell)return;
    if(hasDevAll())return;
    if((st.level||0)!==0)return;
    const r=+cell.dataset.r,c=+cell.dataset.c;
    const p=st.__devCornerProgress||0;
    const expect=CODE[p];
    if(expect&&r===expect[0]&&c===expect[1]){
      st.__devCornerProgress=p+1;
      if(st.__devCornerProgress>=CODE.length){
        setDevAll(true);setUnlockedMax(LEVELS.length);
        st.__devCornerProgress=0;
        try{toast('Тестовый режим открыт')}catch(e){}
        try{showHelp('Тестовый режим','Все уровни открыты на этом устройстве. Секретный код принят.')}catch(e){}
        try{renderLevels()}catch(e){}
      }
    }else{
      st.__devCornerProgress=(r===CODE[0][0]&&c===CODE[0][1])?1:0;
    }
  },true);
}
function ensureDefaultLock(){if(!localStorage.getItem(STORE_UNLOCK))setUnlockedMax(1)}
function init(){ensureDefaultLock();patchRenderLevels();patchStartLevel();patchFinish();bindCode();levelsText();setTimeout(()=>{try{renderLevels()}catch(e){}},250);setTimeout(()=>{patchRenderLevels();patchStartLevel();patchFinish();levelsText();try{renderLevels()}catch(e){}},900)}
document.addEventListener('DOMContentLoaded',init);window.addEventListener('load',init);setTimeout(init,0);setTimeout(init,1200);
})();