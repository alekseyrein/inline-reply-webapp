(()=>{
function patchLevels(){
  try{
    if(typeof LEVELS==='undefined'||!Array.isArray(LEVELS))return false;
    const l5=LEVELS.find(x=>x&&x.id===5);
    if(l5&&!l5.__rzPolished){
      l5.__rzPolished=true;
      const web=l5.goals?.find(g=>g.kind==='clearWebs'); if(web) web.count=8;
      const spec=l5.goals?.find(g=>g.kind==='createSpecials'); if(spec) spec.count=1;
      l5.webs=8;
      l5.webEvery=4;
      l5.subtitle='Сеть, но без перегруза';
    }
    const l6=LEVELS.find(x=>x&&x.id===6);
    if(l6&&!l6.__rzPolished){
      l6.__rzPolished=true;
      l6.moves=30;
      l6.webs=8;
      l6.webEvery=4;
      if(l6.boss) l6.boss.every=4;
      l6.subtitle='Батенин давит, но честно';
    }
    return true;
  }catch(e){console.warn('balance polish failed',e);return false}
}
function showLevelHint(){
  try{
    const t=(document.querySelector('.brand-sub')?.textContent||'');
    if(!t||t===showLevelHint.last)return;
    showLevelHint.last=t;
    if(typeof showToast!=='function')return;
    if(/Уровень 2/i.test(t)) setTimeout(()=>showToast('4 в ряд = спецфишка'),450);
    if(/Уровень 4/i.test(t)) setTimeout(()=>showToast('Паутина держит фишку'),450);
    if(/Уровень 6/i.test(t)) setTimeout(()=>showToast('Батенин срабатывает через 4 хода'),450);
  }catch{}
}
function resultPolish(){
  const ov=document.getElementById('resultOverlay');
  const details=document.getElementById('resultDetails');
  if(!ov||!details||!ov.classList.contains('active'))return;
  if(details.querySelector('.rz-result-bonus'))return;
  const score=Number(document.getElementById('scoreBadge')?.textContent?.replace(/\D/g,'')||0);
  const moves=Number(document.getElementById('movesBadge')?.textContent?.replace(/\D/g,'')||0);
  const card=document.createElement('div');
  card.className='mini-card rz-result-bonus';
  card.innerHTML='<strong>Бонус разносчика</strong><span>'+(moves>0?'Осталось ходов: '+moves+' · ':'')+'Очки идут в локальный рейтинг после завершения.</span>';
  details.appendChild(card);
}
function tick(){patchLevels();showLevelHint();resultPolish()}
patchLevels();
document.addEventListener('DOMContentLoaded',tick);
window.addEventListener('load',tick);
setInterval(tick,700);
})();