(()=>{
let art='',loaded=false,loading=null,raf=0;
function st(){
  if(document.getElementById('rz-web-art-style'))return;
  const s=document.createElement('style');
  s.id='rz-web-art-style';
  s.textContent=`
#board .cell.rz-web-cell{box-shadow:0 0 0 1px rgba(150,86,255,.18),0 8px 18px rgba(0,0,0,.28)!important}
#board .cell.rz-web-cell>.tile,#board .cell.rz-web-cell>.blocker{filter:brightness(.38) saturate(.85)!important}
#board .cell.rz-web-cell .overlay-web{position:absolute!important;inset:0!important;z-index:12!important;display:block!important;opacity:1!important;border-radius:inherit!important;background:var(--rz-web-img) center/cover no-repeat!important;mix-blend-mode:normal!important;box-shadow:inset 0 0 0 1px rgba(205,172,255,.28),0 0 14px rgba(130,72,255,.28)!important;border:0!important;pointer-events:none!important;transform:translateZ(0)!important;backface-visibility:hidden!important}
#board .cell.rz-web-cell .overlay-web::before,#board .cell.rz-web-cell .overlay-web::after{display:none!important;content:none!important}
#board .cell.rz-web-cell .rz-final-special{filter:brightness(.42) saturate(.9)!important}
`;
  document.head.appendChild(s);
}
async function load(){
  if(loaded)return art;
  if(loading)return loading;
  loading=fetch('./raznos-art-web.txt?v=20260425-web-overlay-art',{cache:'no-store'}).then(r=>r.text()).then(t=>{art=t.trim();loaded=true;return art}).catch(e=>{console.warn('web art load failed',e);loaded=true;return ''});
  return loading;
}
function paint(){
  st();
  if(!art)return;
  document.querySelectorAll('#board .cell').forEach(cell=>{
    const web=cell.querySelector(':scope > .overlay-web, .overlay-web');
    if(web){
      cell.classList.add('rz-web-cell');
      web.style.setProperty('--rz-web-img',`url("${art}")`);
      web.style.backgroundImage=`url("${art}")`;
    }else{
      cell.classList.remove('rz-web-cell');
    }
  });
}
function schedule(){if(raf)return;raf=requestAnimationFrame(()=>{raf=0;paint()})}
function bind(){
  const bd=document.getElementById('board');
  if(bd&&!bd.__rzWebArtObs){
    bd.__rzWebArtObs=1;
    new MutationObserver(schedule).observe(bd,{childList:true,subtree:true,attributes:true,attributeFilter:['class','style']});
  }
}
async function start(){st();bind();await load();schedule();setTimeout(schedule,120);setTimeout(schedule,500);setTimeout(schedule,1200)}
document.addEventListener('DOMContentLoaded',start);
window.addEventListener('load',start);
setTimeout(start,0);
setInterval(()=>{bind();schedule()},500);
document.addEventListener('click',()=>setTimeout(schedule,80),true);
document.addEventListener('touchend',()=>setTimeout(schedule,80),true);
})();