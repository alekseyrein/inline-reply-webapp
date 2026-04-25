(()=>{
let art='',loaded=false,loading=null,raf=0,lastTapped=null;
function st(){
  if(document.getElementById('rz-closed-cell-style'))return;
  const s=document.createElement('style');
  s.id='rz-closed-cell-style';
  s.textContent=`
#board .cell.rz-closed-cell{position:relative!important;overflow:hidden!important;box-shadow:0 0 0 1px rgba(255,83,83,.18),0 8px 18px rgba(0,0,0,.32)!important;background:#08070b!important}
#board .cell.rz-closed-cell>.tile,#board .cell.rz-closed-cell>.blocker{filter:brightness(.22) saturate(.75)!important;opacity:.22!important}
#board .cell.rz-closed-cell>.overlay-web{display:none!important;opacity:0!important;visibility:hidden!important}
#board .cell.rz-closed-cell>.rz-closed-art{position:absolute!important;inset:0!important;z-index:18!important;display:block!important;border-radius:inherit!important;background:var(--rz-closed-img) center/cover no-repeat!important;box-shadow:inset 0 0 0 1px rgba(255,210,120,.20),0 0 16px rgba(255,82,82,.24)!important;pointer-events:none!important;transform:translateZ(0)!important;backface-visibility:hidden!important}
#board .cell.rz-closed-cell>.rz-closed-art::after{content:'Блок'!important;position:absolute!important;right:4px!important;bottom:4px!important;padding:2px 5px!important;border-radius:999px!important;background:rgba(8,8,12,.72)!important;border:1px solid rgba(255,255,255,.16)!important;color:#fff!important;font-size:10px!important;line-height:1!important;font-weight:900!important;text-shadow:none!important}
`;
  document.head.appendChild(s);
}
async function load(){
  if(loaded)return art;
  if(loading)return loading;
  loading=fetch('./raznos-art-black-list.txt?v=20260425-closed-cell-art',{cache:'no-store'}).then(r=>r.text()).then(t=>{art=t.trim();loaded=true;return art}).catch(e=>{console.warn('closed cell art load failed',e);loaded=true;return ''});
  return loading;
}
function norm(x){return String(x||'').toLowerCase().replace(/ё/g,'е')}
function boardSize(){try{return Number(SIZE)||7}catch{return 7}}
function getStateCellByIndex(i){
  try{
    if(!state||!state.board)return null;
    const n=boardSize(),r=Math.floor(i/n),c=i%n;
    if(Array.isArray(state.board[r]))return state.board[r][c];
    return state.board[i];
  }catch{return null}
}
function hasClosedState(cell){
  if(!cell)return false;
  if(cell.closed||cell.locked||cell.blocked||cell.isClosed||cell.isLocked||cell.isBlocked||cell.wall||cell.noCell)return true;
  const vals=[cell.type,cell.kind,cell.id,cell.name,cell.short,cell.role,cell.blocker,cell.blockerType,cell.state,cell.status].map(norm);
  return vals.some(v=>v==='closed'||v==='locked'||v==='lock'||v==='block'||v==='blocked'||v==='black_list'||v==='blacklist'||v==='закрыто'||v==='закрыт'||v==='закрытая'||v.includes('closed')||v.includes('locked')||v.includes('black_list')||v.includes('blacklist')||v.includes('закрыт'));
}
function hasClosedDom(cell){
  const t=norm([cell.className,cell.dataset?.type,cell.dataset?.kind,cell.dataset?.cell,cell.dataset?.state,cell.getAttribute('aria-label'),cell.title,cell.textContent].filter(Boolean).join(' '));
  if(/closed|locked|lock|blocked|black-list|black_list|blacklist|закрыт|закрыта|закрыто|блок/.test(t))return true;
  if(cell.querySelector('[class*="closed"],[class*="locked"],[class*="lock"],[class*="blocked"],[class*="black-list"],[class*="black_list"]'))return true;
  return false;
}
function looksLikeClosedVisual(cell){
  // Closed cells in the current build often have an overlay but no real movable tile label.
  if(cell.classList.contains('rz-web-cell')&&cell.querySelector(':scope>.overlay-web')){
    const hasTile=cell.querySelector(':scope>.tile,:scope>.blocker');
    const hasBadge=cell.querySelector(':scope .rz-badge,:scope .tile-short,:scope .blocker-short');
    if(!hasTile||!hasBadge)return true;
  }
  return false;
}
function isClosedCell(cell,i){
  if(!cell||cell.closest('.overlay,#startOverlay,#levelsOverlay,#resultOverlay'))return false;
  if(hasClosedDom(cell))return true;
  if(hasClosedState(getStateCellByIndex(i)))return true;
  if(cell===lastTapped&&Date.now()-(lastTapped.__rzClosedTapTime||0)<1400)return true;
  return looksLikeClosedVisual(cell);
}
function mark(cell,on){
  if(!art)return;
  if(on){
    cell.classList.add('rz-closed-cell');
    let layer=cell.querySelector(':scope>.rz-closed-art');
    if(!layer){layer=document.createElement('span');layer.className='rz-closed-art';cell.appendChild(layer)}
    layer.style.setProperty('--rz-closed-img',`url("${art}")`);
    layer.style.backgroundImage=`url("${art}")`;
  }else{
    cell.classList.remove('rz-closed-cell');
    const layer=cell.querySelector(':scope>.rz-closed-art');
    if(layer)layer.remove();
  }
}
function paint(){
  st();
  if(!art)return;
  document.querySelectorAll('#board .cell').forEach((cell,i)=>mark(cell,isClosedCell(cell,i)));
}
function schedule(){if(raf)return;raf=requestAnimationFrame(()=>{raf=0;paint()})}
function bind(){
  const bd=document.getElementById('board');
  if(bd&&!bd.__rzClosedArtObs){
    bd.__rzClosedArtObs=1;
    new MutationObserver(schedule).observe(bd,{childList:true,subtree:true,attributes:true,attributeFilter:['class','style','data-type','data-kind','data-state']});
  }
}
function watchClosedToast(){
  const toast=document.querySelector('.toast,#toast');
  if(!toast||toast.__rzClosedToastObs)return;
  toast.__rzClosedToastObs=1;
  new MutationObserver(()=>{
    if(norm(toast.textContent).includes('клетка закрыта')&&lastTapped){lastTapped.__rzClosedTapTime=Date.now();schedule()}
  }).observe(toast,{childList:true,characterData:true,subtree:true,attributes:true});
}
async function start(){st();bind();watchClosedToast();await load();schedule();setTimeout(schedule,120);setTimeout(schedule,600);setTimeout(schedule,1400)}
document.addEventListener('pointerdown',e=>{const cell=e.target.closest&&e.target.closest('#board .cell');if(cell){lastTapped=cell;lastTapped.__rzClosedTapTime=Date.now()}},true);
document.addEventListener('DOMContentLoaded',start);
window.addEventListener('load',start);
setTimeout(start,0);
setInterval(()=>{bind();watchClosedToast();schedule()},500);
document.addEventListener('click',()=>setTimeout(schedule,80),true);
document.addEventListener('touchend',()=>setTimeout(schedule,80),true);
})();