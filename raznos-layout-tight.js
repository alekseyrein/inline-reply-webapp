(()=>{
function inject(){
  if(document.getElementById('rz-layout-tight-style'))return;
  const s=document.createElement('style');
  s.id='rz-layout-tight-style';
  s.textContent=`
html,body{overflow-x:hidden!important;overflow-y:auto!important;background:#09070c!important;-webkit-overflow-scrolling:touch!important}
.app{gap:7px!important;padding-top:calc(7px + var(--safe-top))!important;padding-left:10px!important;padding-right:10px!important;padding-bottom:calc(12px + var(--safe-bottom))!important;max-width:540px!important;min-height:auto!important}
.topbar{padding:8px 12px!important;border-radius:16px!important;min-height:68px!important}.brand-title{font-size:17px!important;line-height:1.08!important}.brand-sub{font-size:12px!important;line-height:1.18!important;margin-top:3px!important}.header-badges{gap:6px!important}.badge{min-width:62px!important;padding:6px 8px!important;border-radius:13px!important}.badge-label{font-size:10px!important}.badge-value{font-size:18px!important;line-height:1.05!important}
.panel{padding:8px!important;border-radius:16px!important}.goals-wrap{gap:7px!important}.goal-chip{min-height:48px!important;padding:7px 8px!important;border-radius:13px!important;gap:8px!important}.goal-icon{width:32px!important;height:32px!important;border-radius:10px!important;flex:0 0 32px!important}.goal-title{font-size:13px!important;line-height:1.08!important}.goal-progress{font-size:12px!important;margin-top:2px!important;line-height:1.05!important}
.board-shell{gap:7px!important;min-height:0!important;overflow:visible!important}.board-wrap{align-items:flex-start!important;justify-content:center!important;min-height:0!important;overflow:visible!important}.board{width:var(--rz-board-size,min(calc(100vw - 20px),398px))!important;height:var(--rz-board-size,min(calc(100vw - 20px),398px))!important;max-width:calc(100vw - 20px)!important;max-height:none!important;aspect-ratio:1/1!important;margin:0 auto!important;transform:translateZ(0)!important;backface-visibility:hidden!important;contain:layout paint!important;display:grid!important;grid-template-columns:repeat(7,minmax(0,1fr))!important;grid-template-rows:repeat(7,minmax(0,1fr))!important;gap:5px!important;padding:7px!important;border-radius:20px!important;align-content:stretch!important;overflow:hidden!important;flex:0 0 auto!important}
#board>*{width:auto!important;height:auto!important;min-width:0!important;min-height:0!important;aspect-ratio:1/1!important;position:relative!important;overflow:visible!important}#board .tile,#board .blocker{width:100%!important;height:100%!important;inset:0!important;min-width:0!important;min-height:0!important}
.footer-actions{padding:7px!important;gap:7px!important;border-radius:16px!important}.action-btn{min-height:46px!important;border-radius:15px!important}.action-btn strong{font-size:14px!important;line-height:1.05!important}.action-btn span{font-size:11px!important;margin-top:2px!important;line-height:1!important}
.rz-boss-compact{min-height:44px!important;padding:7px 10px!important;border-radius:15px!important;margin:0!important;display:grid!important;grid-template-columns:42px 1fr!important;gap:8px!important;align-items:center!important}.rz-boss-compact p,.rz-boss-compact .desc,.rz-boss-compact .description{display:none!important}.rz-boss-compact .progress,.rz-boss-compact progress{height:5px!important;margin-top:3px!important}.rz-boss-compact *{line-height:1.08!important}
body.rz-late-level .app{gap:6px!important;padding-top:calc(5px + var(--safe-top))!important;padding-bottom:calc(10px + var(--safe-bottom))!important}body.rz-late-level .topbar{min-height:58px!important;padding:7px 11px!important}.rz-late-level .brand-title{font-size:16px!important}.rz-late-level .brand-sub{font-size:11px!important}.rz-late-level .badge{min-width:58px!important;padding:5px 7px!important}.rz-late-level .badge-value{font-size:17px!important}.rz-late-level .panel{padding:6px!important}.rz-late-level .goals-wrap{gap:5px!important}.rz-late-level .goal-chip{min-height:40px!important;padding:5px 7px!important;gap:6px!important}.rz-late-level .goal-icon{width:28px!important;height:28px!important;flex-basis:28px!important;border-radius:9px!important}.rz-late-level .goal-title{font-size:12px!important;line-height:1.05!important}.rz-late-level .goal-progress{font-size:11px!important}.rz-late-level .footer-actions{padding:6px!important}.rz-late-level .action-btn{min-height:42px!important}
@media(max-height:760px){.app{gap:6px!important;padding-top:calc(5px + var(--safe-top))!important}.topbar{padding:7px 11px!important;min-height:62px!important}.brand-title{font-size:16px!important}.panel{padding:7px!important}.goal-chip{min-height:44px!important;padding:6px 7px!important}.goal-icon{width:30px!important;height:30px!important}.footer-actions{padding:6px!important}.action-btn{min-height:42px!important}.board{gap:4px!important;padding:6px!important}}
`;
  document.head.appendChild(s);
}
function getLevelNum(){
  const m=(document.body.textContent||'').match(/Уровень\s+(\d+)/i);
  return m?Number(m[1]):1;
}
function markBoss(){
  const board=document.getElementById('board');
  const items=[...document.querySelectorAll('.app > *, .board-shell > *, .panel + *')];
  items.forEach(el=>{
    if(!el||el===board||el.contains(board))return;
    const t=(el.textContent||'').toLowerCase();
    if(t.includes('батенин сверху')||t.includes('распоряжения батенина')) el.classList.add('rz-boss-compact');
  });
}
function calc(){
  inject();
  const board=document.getElementById('board');
  if(!board)return;
  markBoss();
  const n=getLevelNum();
  const bossVisible=!!document.querySelector('.rz-boss-compact');
  document.body.classList.toggle('rz-late-level',n>=5||bossVisible);
  const vw=window.innerWidth;
  let side=Math.min(vw-20,398);
  if(window.innerHeight<680) side=Math.min(side,380);
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