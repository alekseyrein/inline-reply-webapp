(()=>{
function inject(){
  if(document.getElementById('rz-layout-tight-style'))return;
  const s=document.createElement('style');
  s.id='rz-layout-tight-style';
  s.textContent=`
html,body{overflow-x:hidden!important;overflow-y:auto!important;background:#09070c!important;-webkit-overflow-scrolling:touch!important}
.app{gap:6px!important;padding-top:calc(5px + var(--safe-top))!important;padding-left:10px!important;padding-right:10px!important;padding-bottom:calc(10px + var(--safe-bottom))!important;max-width:540px!important;min-height:auto!important}
.topbar{padding:7px 11px!important;border-radius:15px!important;min-height:58px!important;position:relative!important}.brand-title{font-size:16px!important;line-height:1.05!important}.brand-sub{font-size:11px!important;line-height:1.12!important;margin-top:2px!important}.header-badges{gap:5px!important}.badge{min-width:58px!important;padding:5px 7px!important;border-radius:12px!important}.badge-label{font-size:9px!important}.badge-value{font-size:17px!important;line-height:1.02!important}
.rz-boss-top-pill{position:absolute!important;left:8px!important;top:50%!important;transform:translateY(-50%)!important;display:none!important;align-items:center!important;gap:5px!important;z-index:5!important;pointer-events:none!important}.rz-boss-top-pill img{width:40px!important;height:40px!important;object-fit:cover!important;border-radius:12px!important;border:1px solid rgba(255,207,94,.42)!important;box-shadow:0 6px 14px rgba(0,0,0,.35)!important}.rz-boss-top-count{min-width:22px!important;height:22px!important;padding:0 6px!important;border-radius:999px!important;display:flex!important;align-items:center!important;justify-content:center!important;background:linear-gradient(135deg,#ffe27a,#a36b16)!important;color:#271704!important;font-size:12px!important;font-weight:900!important;border:1px solid rgba(255,236,160,.65)!important;box-shadow:0 4px 10px rgba(0,0,0,.3)!important;margin-left:-13px!important;margin-top:23px!important}.rz-boss-top-text{display:block!important;max-width:92px!important;color:#eadab2!important;font-weight:800!important;font-size:9.5px!important;line-height:1.05!important;text-shadow:0 1px 2px rgba(0,0,0,.5)!important}.rz-boss-active .rz-boss-top-pill{display:flex!important}.rz-boss-active .brand{padding-left:126px!important;min-width:0!important}.rz-boss-active .brand-title{font-size:0!important;line-height:0!important}.rz-boss-active .brand-sub{font-size:9.5px!important;line-height:1.05!important;margin-top:0!important;max-width:84px!important}
.panel{padding:5px!important;border-radius:15px!important}.goals-wrap{gap:5px!important}.goal-chip{min-height:42px!important;padding:5px 7px!important;border-radius:12px!important;gap:7px!important}.goal-icon{width:34px!important;height:34px!important;border-radius:10px!important;flex:0 0 34px!important}.goal-title{font-size:12px!important;line-height:1.05!important}.goal-progress{font-size:11px!important;margin-top:1px!important;line-height:1!important}
.rz-skill-chip{display:none!important}.rz-skill-strip{grid-column:1/-1!important;display:flex!important;align-items:center!important;gap:6px!important;min-height:34px!important;padding:5px 7px!important;border-radius:12px!important;background:rgba(255,255,255,.035)!important;border:1px solid rgba(255,255,255,.06)!important;color:#d9d0e8!important;overflow:hidden!important}.rz-skill-strip strong{font-size:11px!important;line-height:1!important;margin-right:2px!important;white-space:nowrap!important}.rz-skill-mini{display:flex!important;align-items:center!important;gap:4px!important;padding:3px 6px 3px 3px!important;border-radius:999px!important;background:rgba(255,255,255,.05)!important;border:1px solid rgba(255,255,255,.06)!important;font-size:10px!important;font-weight:800!important;white-space:nowrap!important}.rz-skill-mini img{width:22px!important;height:22px!important;border-radius:7px!important;object-fit:cover!important;box-shadow:0 3px 8px rgba(0,0,0,.3)!important}
.board-shell{gap:6px!important;min-height:0!important;overflow:visible!important}.board-wrap{align-items:flex-start!important;justify-content:center!important;min-height:0!important;overflow:visible!important}.board{width:var(--rz-board-size,min(calc(100vw - 18px),402px))!important;height:var(--rz-board-size,min(calc(100vw - 18px),402px))!important;max-width:calc(100vw - 18px)!important;max-height:none!important;aspect-ratio:1/1!important;margin:0 auto!important;transform:translateZ(0)!important;backface-visibility:hidden!important;contain:layout paint!important;display:grid!important;grid-template-columns:repeat(7,minmax(0,1fr))!important;grid-template-rows:repeat(7,minmax(0,1fr))!important;gap:5px!important;padding:7px!important;border-radius:20px!important;align-content:stretch!important;overflow:hidden!important;flex:0 0 auto!important}
#board>*{width:auto!important;height:auto!important;min-width:0!important;min-height:0!important;aspect-ratio:1/1!important;position:relative!important;overflow:visible!important}#board .tile,#board .blocker{width:100%!important;height:100%!important;inset:0!important;min-width:0!important;min-height:0!important}
.footer-actions{position:relative!important;bottom:auto!important;z-index:1!important;padding:5px!important;gap:6px!important;border-radius:15px!important;background:rgba(22,20,31,.92)!important;backdrop-filter:blur(10px)!important}.action-btn{min-height:34px!important;border-radius:13px!important}.action-btn strong{font-size:13px!important;line-height:1.04!important}.action-btn span{display:none!important}
.rz-boss-compact{display:none!important}
body.rz-late-level .app{gap:5px!important;padding-top:calc(3px + var(--safe-top))!important;padding-bottom:calc(8px + var(--safe-bottom))!important}body.rz-late-level .topbar{min-height:44px!important;padding:4px 9px!important}.rz-late-level .brand-title{font-size:14px!important}.rz-late-level .brand-sub{font-size:10px!important}.rz-late-level.rz-boss-active .brand-title{font-size:0!important;line-height:0!important}.rz-late-level .badge{min-width:52px!important;padding:4px 6px!important}.rz-late-level .badge-label{font-size:8px!important}.rz-late-level .badge-value{font-size:16px!important}.rz-late-level .panel{padding:5px!important}.rz-late-level .goals-wrap{gap:4px!important}.rz-late-level .goal-chip{min-height:36px!important;padding:4px 6px!important;gap:6px!important}.rz-late-level .goal-icon{width:32px!important;height:32px!important;flex-basis:32px!important;border-radius:10px!important}.rz-late-level .goal-title{font-size:11px!important;line-height:1.03!important}.rz-late-level .goal-progress{font-size:10px!important}.rz-late-level .rz-skill-strip{min-height:30px!important;padding:4px 6px!important}.rz-late-level .footer-actions{padding:5px!important}.rz-late-level .action-btn{min-height:34px!important}
@media(max-height:760px){.board{gap:4px!important;padding:6px!important}.goal-icon{width:32px!important;height:32px!important;flex-basis:32px!important}.rz-skill-mini span{display:none!important}}
`;
  document.head.appendChild(s);
}
function getLevelNum(){
  const m=(document.querySelector('.brand-sub')?.textContent||document.body.textContent||'').match(/Уровень\s+(\d+)/i);
  return m?Number(m[1]):1;
}
function markChips(){
  document.querySelectorAll('.goal-chip').forEach(ch=>{
    const t=(ch.textContent||'').toLowerCase();
    ch.classList.toggle('rz-skill-chip',/рывок|black mode|глам|дискоряд/.test(t));
    ch.classList.toggle('rz-task-chip',!/рывок|black mode|глам|дискоряд/.test(t));
  });
}
function skillIcon(ch){return ch.querySelector('.goal-icon img')?.src||''}
function buildSkillStrip(){
  const wrap=document.querySelector('.goals-wrap'); if(!wrap)return;
  const skills=[...wrap.querySelectorAll('.rz-skill-chip')];
  let strip=wrap.querySelector('.rz-skill-strip');
  if(!skills.length){if(strip)strip.remove();return}
  const html=skills.map(ch=>{const title=(ch.querySelector('.goal-title')?.textContent||'Умение').trim();const img=skillIcon(ch);return '<span class="rz-skill-mini">'+(img?'<img src="'+img+'" alt="">':'')+'<span>'+title.replace('Black mode','Black')+'</span></span>'}).join('');
  if(!strip){strip=document.createElement('div');strip.className='rz-skill-strip';wrap.appendChild(strip)}
  strip.innerHTML='<strong>Умения</strong>'+html;
}
function findBossBlocks(){
  const board=document.getElementById('board');
  if(!board)return [];
  return [...document.querySelectorAll('.app > *, .board-shell > *')].filter(el=>{
    if(!el||el===board||el.contains(board))return false;
    if(el.closest('.overlay,#startOverlay,#levelsOverlay,#resultOverlay'))return false;
    const r=el.getBoundingClientRect();
    if(r.width<250||r.height<20||r.height>160)return false;
    const t=(el.textContent||'').toLowerCase();
    return t.includes('батенин сверху')||t.includes('распоряжения батенина');
  });
}
function markBoss(){
  document.querySelectorAll('.rz-boss-compact').forEach(el=>el.classList.remove('rz-boss-compact'));
  const candidates=findBossBlocks();
  candidates.forEach(el=>el.classList.add('rz-boss-compact'));
  return candidates.length>0;
}
function updateBossTop(hasBoss){
  const top=document.querySelector('.topbar');
  if(!top)return;
  document.body.classList.toggle('rz-boss-active',!!hasBoss);
  if(!hasBoss){const old=top.querySelector('.rz-boss-top-pill'); if(old) old.remove(); return;}
  const src=(document.querySelector('.rz-batenin-boss-icon img')||document.querySelector('[data-rz-final-special="batenin"] img'))?.src || document.querySelector('img[src*="raznos-art-batenin"]')?.src || '';
  let turns='4';
  const txt=findBossBlocks().map(e=>e.textContent||'').join(' ');
  const m=txt.match(/(\d+)\s*ход/i); if(m) turns=m[1];
  let pill=top.querySelector('.rz-boss-top-pill');
  if(!pill){pill=document.createElement('div'); pill.className='rz-boss-top-pill'; pill.innerHTML='<img alt=""><span class="rz-boss-top-count"></span><span class="rz-boss-top-text"></span>'; top.prepend(pill)}
  const img=pill.querySelector('img'); if(src) img.src=src;
  pill.querySelector('.rz-boss-top-count').textContent=turns;
  pill.querySelector('.rz-boss-top-text').textContent='Батенин через '+turns+' х.';
}
function calc(){
  inject();
  const board=document.getElementById('board');
  if(!board)return;
  markChips(); buildSkillStrip();
  const n=getLevelNum();
  const bossVisible=markBoss();
  updateBossTop(bossVisible);
  document.body.classList.toggle('rz-late-level',n>=5||bossVisible);
  const vw=window.innerWidth;
  let side=Math.min(vw-18,402);
  if(window.innerHeight<680) side=Math.min(side,386);
  side=Math.max(360,side);
  document.documentElement.style.setProperty('--rz-board-size',Math.floor(side)+'px');
}
let raf=0;function schedule(){if(raf)return;raf=requestAnimationFrame(()=>{raf=0;calc()})}
document.addEventListener('DOMContentLoaded',()=>{schedule();setTimeout(schedule,120);setTimeout(schedule,700)});
window.addEventListener('load',()=>{schedule();setTimeout(schedule,120);setTimeout(schedule,700)});
window.addEventListener('resize',schedule);
document.addEventListener('click',()=>setTimeout(schedule,120),true);
new MutationObserver(()=>schedule()).observe(document.documentElement,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['class','style']});
setTimeout(schedule,0);setTimeout(schedule,500);
})();