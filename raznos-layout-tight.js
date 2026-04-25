(()=>{
function inject(){
  if(document.getElementById('rz-layout-tight-style'))return;
  const s=document.createElement('style');
  s.id='rz-layout-tight-style';
  s.textContent=`
html,body{overflow-x:hidden!important;overflow-y:auto!important;background:#09070c!important}
.app{gap:7px!important;padding-top:calc(7px + var(--safe-top))!important;padding-left:10px!important;padding-right:10px!important;padding-bottom:calc(10px + var(--safe-bottom))!important;max-width:540px!important;min-height:auto!important}
.topbar{padding:8px 12px!important;border-radius:16px!important;min-height:70px!important}.brand-title{font-size:17px!important;line-height:1.08!important}.brand-sub{font-size:12px!important;line-height:1.18!important;margin-top:3px!important}.header-badges{gap:6px!important}.badge{min-width:62px!important;padding:6px 8px!important;border-radius:13px!important}.badge-label{font-size:10px!important}.badge-value{font-size:18px!important;line-height:1.05!important}
.panel{padding:8px!important;border-radius:16px!important}.goals-wrap{gap:7px!important}.goal-chip{min-height:48px!important;padding:7px 8px!important;border-radius:13px!important;gap:8px!important}.goal-icon{width:32px!important;height:32px!important;border-radius:10px!important;flex:0 0 32px!important}.goal-title{font-size:13px!important;line-height:1.08!important}.goal-progress{font-size:12px!important;margin-top:2px!important;line-height:1.05!important}
.board-shell{gap:6px!important;min-height:0!important}.board-wrap{align-items:flex-start!important;justify-content:center!important;min-height:0!important;overflow:visible!important}.board{width:var(--rz-board-size,min(calc(100vw - 28px),390px))!important;height:var(--rz-board-size,min(calc(100vw - 28px),390px))!important;max-width:calc(100vw - 28px)!important;max-height:none!important;aspect-ratio:1/1!important;margin:0 auto!important;transform:translateZ(0)!important;backface-visibility:hidden!important;contain:layout paint!important;gap:5px!important;padding:7px!important;border-radius:20px!important;align-content:start!important;overflow:hidden!important;flex:0 0 auto!important}
.footer-actions{padding:7px!important;gap:7px!important;border-radius:16px!important}.action-btn{min-height:46px!important;border-radius:15px!important}.action-btn strong{font-size:14px!important;line-height:1.05!important}.action-btn span{font-size:11px!important;margin-top:2px!important;line-height:1!important}
#bossBar{padding:8px 12px!important;border-radius:15px!important;margin:0!important;min-height:48px!important}#bossBar *{line-height:1.12!important}#bossBar p,#bossBar .desc,#bossBar .description{font-size:12px!important;margin:2px 0 0!important}#bossBar .progress,#bossBar progress{height:6px!important;margin-top:5px!important}
body.rz-late-level .app{gap:5px!important;padding-top:calc(5px + var(--safe-top))!important;padding-bottom:calc(7px + var(--safe-bottom))!important}body.rz-late-level .topbar{min-height:60px!important;padding:7px 11px!important}.rz-late-level .brand-title{font-size:16px!important}.rz-late-level .brand-sub{font-size:11px!important}.rz-late-level .badge{min-width:58px!important;padding:5px 7px!important}.rz-late-level .badge-value{font-size:17px!important}.rz-late-level .panel{padding:6px!important}.rz-late-level .goals-wrap{gap:5px!important}.rz-late-level .goal-chip{min-height:40px!important;padding:5px 7px!important;gap:6px!important}.rz-late-level .goal-icon{width:28px!important;height:28px!important;flex-basis:28px!important;border-radius:9px!important}.rz-late-level .goal-title{font-size:12px!important;line-height:1.05!important}.rz-late-level .goal-progress{font-size:11px!important}.rz-late-level .footer-actions{padding:6px!important}.rz-late-level .action-btn{min-height:42px!important}.rz-late-level #bossBar{min-height:42px!important;padding:6px 10px!important}.rz-late-level #bossBar p,.rz-late-level #bossBar .desc,.rz-late-level #bossBar .description{display:none!important}
@media(max-height:760px){.app{gap:6px!important;padding-top:calc(5px + var(--safe-top))!important}.topbar{padding:7px 11px!important;min-height:64px!important}.brand-title{font-size:16px!important}.panel{padding:7px!important}.goal-chip{min-height:44px!important;padding:6px 7px!important}.goal-icon{width:30px!important;height:30px!important}.footer-actions{padding:6px!important}.action-btn{min-height:42px!important}.board{gap:4px!important;padding:6px!important}}
`;
  document.head.appendChild(s);
}
function getLevelNum(){
  const txt=(document.body.textContent||'').match(/Уровень\s+(\d+)/i);
  return txt?Number(txt[1]):1;
}
function calc(){
  inject();
  const board=document.getElementById('board');
  if(!board)return;
  const n=getLevelNum();
  const boss=document.getElementById('bossBar');
  const bossVisible=!!(boss&&getComputedStyle(boss).display!=='none'&&boss.getBoundingClientRect().height>10);
  document.body.classList.toggle('rz-late-level',n>=5||bossVisible);
  const vw=window.innerWidth;
  let side=Math.min(vw-28,390);
  if(n>=5||bossVisible) side=Math.min(vw-28,382);
  if(window.innerHeight<730) side=Math.min(side,366);
  if(window.innerHeight<680) side=Math.min(side,350);
  side=Math.max(340,side);
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