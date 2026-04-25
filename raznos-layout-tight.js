(()=>{
function inject(){
  if(document.getElementById('rz-layout-tight-style'))return;
  const s=document.createElement('style');
  s.id='rz-layout-tight-style';
  s.textContent=`
html,body{overflow:hidden!important}
.app{gap:7px!important;padding-top:calc(7px + var(--safe-top))!important;padding-left:10px!important;padding-right:10px!important;padding-bottom:calc(8px + var(--safe-bottom))!important;max-width:540px!important}
.topbar{padding:8px 12px!important;border-radius:16px!important;min-height:74px!important}
.brand-title{font-size:17px!important;line-height:1.1!important}.brand-sub{font-size:12px!important;line-height:1.25!important;margin-top:3px!important}
.header-badges{gap:6px!important}.badge{min-width:62px!important;padding:6px 8px!important;border-radius:13px!important}.badge-label{font-size:10px!important}.badge-value{font-size:18px!important;line-height:1.05!important}
.panel{padding:8px!important;border-radius:16px!important}.goals-wrap{gap:7px!important}.goal-chip{min-height:50px!important;padding:7px 8px!important;border-radius:13px!important;gap:8px!important}.goal-icon{width:32px!important;height:32px!important;border-radius:10px!important}.goal-title{font-size:13px!important;line-height:1.08!important}.goal-progress{font-size:12px!important;margin-top:2px!important;line-height:1.05!important}
.board-shell{gap:6px!important;overflow:hidden!important;min-height:0!important}.board-wrap{align-items:flex-start!important;justify-content:center!important;overflow:hidden!important;min-height:0!important}
.board{width:var(--rz-board-size, min(calc(100vw - 28px), 390px))!important;height:var(--rz-board-size, min(calc(100vw - 28px), 390px))!important;max-width:calc(100vw - 28px)!important;max-height:var(--rz-board-size, 390px)!important;aspect-ratio:1/1!important;margin:0 auto!important;transform:translateZ(0)!important;backface-visibility:hidden!important;contain:layout paint!important;gap:5px!important;padding:7px!important;border-radius:20px!important;align-content:start!important;overflow:hidden!important;flex:0 0 auto!important}
.footer-actions{padding:7px!important;gap:7px!important;border-radius:16px!important}.action-btn{min-height:46px!important;border-radius:15px!important}.action-btn strong{font-size:14px!important;line-height:1.05!important}.action-btn span{font-size:11px!important;margin-top:2px!important;line-height:1!important}
@media(max-height:760px){.app{gap:6px!important;padding-top:calc(5px + var(--safe-top))!important}.topbar{padding:7px 11px!important;min-height:68px!important}.brand-title{font-size:16px!important}.panel{padding:7px!important}.goal-chip{min-height:46px!important;padding:6px 7px!important}.goal-icon{width:30px!important;height:30px!important}.footer-actions{padding:6px!important}.action-btn{min-height:42px!important}.board{gap:4px!important;padding:6px!important}}
`;
  document.head.appendChild(s);
}
function calc(){
  inject();
  const app=document.querySelector('.app'), board=document.getElementById('board');
  if(!app||!board)return;
  const top=document.querySelector('.topbar');
  const panel=document.querySelector('.panel');
  const footer=document.querySelector('.footer-actions');
  const boss=document.getElementById('bossBar');
  const vh=window.innerHeight;
  const vw=window.innerWidth;
  const gap=7;
  const topH=top?top.getBoundingClientRect().height:0;
  const panelH=panel?panel.getBoundingClientRect().height:0;
  const footerH=footer?footer.getBoundingClientRect().height:0;
  const bossH=(boss&&getComputedStyle(boss).display!=='none')?boss.getBoundingClientRect().height+6:0;
  const padding=18;
  const available=vh-topH-panelH-footerH-bossH-gap*3-padding;
  const side=Math.max(292,Math.min(vw-28,available,430));
  document.documentElement.style.setProperty('--rz-board-size',Math.floor(side)+'px');
}
let raf=0;function schedule(){if(raf)return;raf=requestAnimationFrame(()=>{raf=0;calc()})}
document.addEventListener('DOMContentLoaded',()=>{schedule();setTimeout(schedule,120);setTimeout(schedule,700)});
window.addEventListener('load',()=>{schedule();setTimeout(schedule,120);setTimeout(schedule,700)});
window.addEventListener('resize',schedule);
document.addEventListener('click',e=>{if(e.target.closest('#menuBtn,#startGameBtn,#resultPrimaryBtn,.level-chip,.level-btn,#closeLevelsBtn'))setTimeout(schedule,120)},true);
setTimeout(schedule,0);setTimeout(schedule,500);
})();