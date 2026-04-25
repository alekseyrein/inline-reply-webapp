(()=>{
let installed=false;
let resolvingDepth=0;
let lastToast=0;
let lastHitAt=0;
function key(r,c){return r+','+c}
function parseKey(k){const a=String(k).split(',').map(Number);return{r:a[0],c:a[1]}}
function boardSize(){try{return Number(SIZE)||7}catch{return 7}}
function getBoard(){try{return state&&state.board}catch{return null}}
function getCell(r,c){try{const b=getBoard();if(!b)return null;if(Array.isArray(b[r]))return b[r][c];return b[r*boardSize()+c]}catch{return null}}
function setCell(r,c,v){try{const b=getBoard();if(!b)return;if(Array.isArray(b[r]))b[r][c]=v;else b[r*boardSize()+c]=v}catch{}}
function val(x){return String(x||'').toLowerCase().replace(/ё/g,'е')}
function isEmil(cell){if(!cell)return false;const vals=[cell.blocker,cell.kind,cell.type,cell.id,cell.name,cell.short,cell.role,cell.blockerType].map(val);return vals.some(v=>v==='emil'||v==='эмиль'||v==='эмил'||v==='э'||v.includes('emil')||v.includes('эмил'))}
function isBlocker(cell){if(!cell)return false;if(isEmil(cell))return true;const vals=[cell.blocker,cell.kind,cell.type,cell.id,cell.name,cell.short,cell.role].map(val);return vals.some(v=>v==='report'||v==='отчет'||v==='отчёт'||v.includes('blocker'))||cell.blocker===true}
function tileType(cell){if(!cell||isBlocker(cell))return '';return String(cell.type||cell.kind||cell.id||cell.name||cell.short||'')}
function normMatches(input,out=new Set(),seen=new Set()){
  if(!input)return out;
  if(typeof input==='string'){const m=input.match(/^(\d+)\s*,\s*(\d+)$/);if(m)out.add(Number(m[1])+','+Number(m[2]));return out}
  if(typeof input!=='object')return out;
  if(seen.has(input))return out;seen.add(input);
  if(input instanceof Set||Array.isArray(input)){input.forEach(x=>normMatches(x,out,seen));return out}
  if(Number.isFinite(input.r)&&Number.isFinite(input.c)){out.add(input.r+','+input.c);return out}
  if(Number.isFinite(input.row)&&Number.isFinite(input.col)){out.add(input.row+','+input.col);return out}
  Object.keys(input).forEach(k=>{if(!/^parent|target|currentTarget|srcElement|view$/i.test(k))normMatches(input[k],out,seen)});
  return out;
}
function bumpEmil(n){
  if(!n)return;
  try{if(typeof updateGoalProgress==='function')updateGoalProgress({kind:'clearEmils'},n)}catch{}
  try{if(typeof addGoalProgress==='function')addGoalProgress('clearEmils',n)}catch{}
  try{if(typeof addProgress==='function')addProgress('clearEmils',n)}catch{}
  try{
    const lvl=LEVELS?.[state.currentLevelIndex];
    if(state.progress&&typeof state.progress==='object'){
      ['clearEmils','clearEmils:','clearEmils:emil','clearEmils:э','emils','emil','clear:emil'].forEach(k=>{state.progress[k]=(Number(state.progress[k])||0)+n});
      (lvl?.goals||[]).forEach(g=>{if(g.kind==='clearEmils'){const k=typeof goalKey==='function'?goalKey(g):'clearEmils';state.progress[k]=Math.min(g.count||999,(Number(state.progress[k])||0)+n)}});
    }
  }catch{}
}
function repaintSoon(){setTimeout(()=>{['renderBoard','renderGoals','updateHud','renderHud','checkWinLose','render'].forEach(fn=>{try{if(typeof window[fn]==='function')window[fn]()}catch{}})},0)}
function hitSet(hit){
  if(!hit||!hit.size)return 0;
  let n=0;
  hit.forEach(k=>{const {r,c}=parseKey(k);if(isEmil(getCell(r,c))){setCell(r,c,null);n++}});
  if(!n)return 0;
  bumpEmil(n);
  lastHitAt=Date.now();
  if(Date.now()-lastToast>700){lastToast=Date.now();try{if(typeof showToast==='function')showToast(n>1?'Эмили вышли из созвона':'Эмиль вышел из созвона')}catch{}}
  repaintSoon();
  return n;
}
function hitAdjacentEmilsFromCells(cells){
  const n=boardSize();
  const dirs=[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
  const hit=new Set();
  [...cells].forEach(k=>{const {r,c}=parseKey(k);dirs.forEach(([dr,dc])=>{const rr=r+dr,cc=c+dc;if(rr>=0&&cc>=0&&rr<n&&cc<n&&isEmil(getCell(rr,cc)))hit.add(key(rr,cc))})});
  return hitSet(hit);
}
function scanBoardAndHit(){
  const n=boardSize();
  if(!getBoard())return 0;
  const matched=new Set();
  for(let r=0;r<n;r++){
    let c=0;while(c<n){const t=tileType(getCell(r,c));if(!t){c++;continue}let e=c+1;while(e<n&&tileType(getCell(r,e))===t)e++;if(e-c>=3)for(let x=c;x<e;x++)matched.add(key(r,x));c=e}
  }
  for(let c=0;c<n;c++){
    let r=0;while(r<n){const t=tileType(getCell(r,c));if(!t){r++;continue}let e=r+1;while(e<n&&tileType(getCell(e,c))===t)e++;if(e-r>=3)for(let x=r;x<e;x++)matched.add(key(x,c));r=e}
  }
  return hitAdjacentEmilsFromCells(matched);
}
function patch(){
  if(installed)return;
  installed=true;
  try{if(typeof findMatches==='function'){const originalFind=findMatches;findMatches=function(...args){const res=originalFind.apply(this,args);const cells=normMatches(res);if(cells.size)hitAdjacentEmilsFromCells(cells);else scanBoardAndHit();return res}}}catch(e){console.warn('emil find patch failed',e)}
  try{if(typeof resolveBoard==='function'){const originalResolve=resolveBoard;resolveBoard=async function(...args){resolvingDepth++;try{scanBoardAndHit();const out=await originalResolve.apply(this,args);setTimeout(scanBoardAndHit,40);return out}finally{resolvingDepth=Math.max(0,resolvingDepth-1)}}}}catch(e){console.warn('emil resolve patch failed',e)}
}
function tick(){patch(); if(Date.now()-lastHitAt>500) scanBoardAndHit()}
document.addEventListener('DOMContentLoaded',tick);window.addEventListener('load',tick);setInterval(tick,350);document.addEventListener('touchend',()=>setTimeout(tick,90),true);document.addEventListener('click',()=>setTimeout(tick,90),true);window.rzHitAdjacentEmils=(x)=>hitAdjacentEmilsFromCells(normMatches(x));window.rzScanEmil=scanBoardAndHit;
})();