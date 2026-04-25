(()=>{
function inject(){
  if(document.getElementById('rz-layout-tight-style'))return;
  const s=document.createElement('style');
  s.id='rz-layout-tight-style';
  s.textContent=`
html,body{overflow-x:hidden!important;overflow-y:auto!important;background:#09070c!important;-webkit-overflow-scrolling:touch!important}
.app{gap:6px!important;padding-top:calc(5px + var(--safe-top))!important;padding-left:10px!important;padding-right:10px!important;padding-bottom:calc(10px + var(--safe-bottom))!important;max-width:540px!important;min-height:auto!important}
.topbar{padding:7px 11px!important;border-radius:15px!important;min-height:58px!important}.brand-title{font-size:16px!important;line-height:1.05!important}.brand-sub{font-size:11px!important;line-height:1.12!important;margin-top:2px!important}.header-badges{gap:5px!important}.badge{min-width:58px!important;padding:5px 7px!important;border-radius:12px!important}.badge-label{font-size:9px!important}.badge-value{font-size:17px!important;line-height:1.02!important}
.panel{padding:6px!important;border-radius:15px!important}.goals-wrap{gap:5px!important}.goal-chip{min-height:44px!important;padding:5px 7px!important;border-radius:12px!important;gap:7px!important}.goal-icon{width:34px!important;height:34px!important;border-radius:10px!important;flex:0 0 34px!important}.goal-title{font-size:12px!important;line-height:1.05!important}.goal-progress{font-size:11px!important;margin-top:1px!important;line-height:1!important}
.board-shell{gap:7px!important;min-height:0!important;overflow:visible!important}.board-wrap{align-items:flex-start!important;justify-content:center!important;min-height:0!important;overflow:visible!important}.board{width:var(--rz-board-size,min(calc(100vw - 18px),402px))!important;height:var(--rz-board-size,min(calc(100vw - 18px),402px))!important;max-width:calc(100vw - 18px)!important;max-height:none!important;aspect-ratio:1/1!important;margin:0 auto!important;transform:translateZ(0)!important;backface-visibility:hidden!important;contain:layout paint!important;display:grid!important;grid-template-columns:repeat(7,minmax(0,1fr))!important;grid-template-rows:repeat(7,minmax(0,1fr))!important;gap:5px!important;padding:7px!important;border-radius:20px!important;align-content:stretch!important;overflow:hidden!important;flex:0 0 auto!important}
#board>*{width:auto!important;height:auto!important;min-width:0!important;min-height:0!important;aspect-ratio:1/1!important;position:relative!important;overflow:visible!important}#board .tile,#board .blocker{width:100%!important;height:100%!important;inset:0!important;min-width:0!important;min-height:0!important}
.footer-actions{position:relative!important;bottom:auto!important;z-index:1!important;padding:5px!important;gap:6px!important;border-radius:15px!important;background:rgba(22,20,31,.92)!important;backdrop-filter:blur(10px)!important}.action-btn{min-height:38px!important;border-radius:14px!important}.action-btn strong{font-size:13px!important;line-height:1.04!important}.action-btn span{font-size:10px!important;margin-top:1px!important;line-height:1!important}
.rz-boss-compact{min-height:34px!important;padding:4px 8px!important;border-radius:13px!important;margin:0!important;display:flex!important;align-items:center!important;gap:8px!important}.rz-boss-compact p,.rz-boss-compact .desc,.rz-boss-compact .description{display:none!important}.rz-boss-compact .progress,.rz-boss-compact progress{height:3px!important;margin-top:2px!important}.rz-boss-compact *{line-height:1.02!important}.rz-boss-compact .rz-batenin-boss-icon{width:32px!important;height:32px!important;min-width:32px!important;border-radius:10px!important}
body.rz-late-level .app{gap:5px!important;padding-top:calc(3px + var(--safe-top))!important;padding-bottom:calc(8px + var(--safe-bottom))!important}body.rz-late-level .topbar{min-height:44px!important;padding:4px 9px!important}.rz-late-level .brand-title{font-size:14px!important}.rz-late-level .brand-sub{font-size:10px!important}.rz-late-level .badge{min-width:52px!important;padding:4px 6px!important}.rz-late-level .badge-label{font-size:8px!important}.rz-late-level .badge-value{font-size:16px!important}.rz-late-level .panel{padding:5px!important}.rz-late-level .goals-wrap{gap:4px!important}.rz-late-level .goal-chip{min-height:38px!important;padding:4px 6px!important;gap:6px!important}.rz-late-level .goal-icon{width:34px!important;height:34px!important;flex-basis:34px!important;border-radius:10px!important}.rz-late-level .goal-title{font-size:11px!important;line-height:1.03!important}.rz-late-level .goal-progress{font-size:10px!important}.rz-late-level .rz-skill-chip{min-height:34px!important}.rz-late-level .rz-skill-chip .goal-progress{display:none!important}.rz-late-level .rz-skill-chip .goal-icon{width:32px!important;height:32px!important;flex-basis:32px!important}.rz-late-level .footer-actions{padding:5px!important}.rz-late-level .action-btn{min-height:36px!important}
@media(max-height:760px){.board{gap:4px!important;padding:6px!important}.goal-icon{width:32px!important;height:32px!important;flex-basis:32px!important}}
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
function markBoss(){
  document.querySelectorAll('.rz-boss-compact').forEach(el=>el.classList.remove('rz-boss-compact'));
  const board=document.getElementById('board');
  if(!board)return false;
  const candidates=[...document.querySelectorAll('.app > *, .board-shell > *')].filter(el=>{
    if(!el||el===board||el.contains(board))return false;
    if(el.closest('.overlay,#startOverlay,#levelsOverlay,#resultOverlay'))return false;
    const r=el.getBoundingClientRect();
    if(r.width<250||r.height<26||r.height>150)return false;
    const t=(el.textContent||'').toLowerCase();
    return t.includes('батенин сверху')||t.includes('распоряжения батенина');
  });
  candidates.forEach(el=>el.classList.add('rz-boss-compact'));
  return candidates.length>0;
}
function calc(){
  inject();
  const board=document.getElementById('board');
  if(!board)return;
  markChips();
  const n=getLevelNum();
  const bossVisible=markBoss();
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