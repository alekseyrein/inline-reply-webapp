(()=>{
let installed=false;
let resolvingDepth=0;
let lastToast=0;
function normMatches(input,out=new Set()){
  if(!input)return out;
  if(typeof input==='string'){
    const m=input.match(/^(\d+)\s*,\s*(\d+)$/);
    if(m)out.add(Number(m[1])+','+Number(m[2]));
    return out;
  }
  if(input instanceof Set){input.forEach(x=>normMatches(x,out));return out}
  if(Array.isArray(input)){input.forEach(x=>normMatches(x,out));return out}
  if(typeof input==='object'){
    if(Number.isFinite(input.r)&&Number.isFinite(input.c)){out.add(input.r+','+input.c);return out}
    if(Number.isFinite(input.row)&&Number.isFinite(input.col)){out.add(input.row+','+input.col);return out}
    ['cells','tiles','positions','matches','matched','matchedCells','toClear','clear','group','items'].forEach(k=>{if(input[k])normMatches(input[k],out)});
  }
  return out;
}
function getCell(r,c){
  try{
    if(!state||!state.board)return null;
    if(Array.isArray(state.board[r]))return state.board[r][c];
    return state.board[r*SIZE+c];
  }catch{return null}
}
function setCell(r,c,v){
  try{
    if(Array.isArray(state.board[r]))state.board[r][c]=v;
    else state.board[r*SIZE+c]=v;
  }catch{}
}
function isEmil(cell){
  if(!cell)return false;
  const vals=[cell.blocker,cell.kind,cell.type,cell.id,cell.name,cell.short,cell.role].map(x=>String(x||'').toLowerCase());
  return vals.some(v=>v==='emil'||v==='эмиль'||v==='э'||v.includes('emil')||v.includes('эмил'));
}
function bumpEmil(n){
  if(!n)return;
  try{
    ['addProgress','addGoalProgress','incrementProgress','updateProgress'].forEach(fn=>{
      if(typeof window[fn]==='function'){
        try{window[fn]('clearEmils',null,n)}catch{}
        try{window[fn]('clearEmils',n)}catch{}
      }
    });
  }catch{}
  try{
    const lvl=LEVELS?.[state.currentLevelIndex];
    if(Array.isArray(state.progress)){
      (lvl?.goals||[]).forEach((g,i)=>{if(g.kind==='clearEmils')state.progress[i]=Math.min((g.count||999),(Number(state.progress[i])||0)+n)});
    }else if(state.progress&&typeof state.progress==='object'){
      const keys=['clearEmils','clearEmils:','clearEmils:emil','clearEmils:э','emils','emil','clear:emil'];
      keys.forEach(k=>{state.progress[k]=(Number(state.progress[k])||0)+n});
      (lvl?.goals||[]).forEach((g,i)=>{if(g.kind==='clearEmils')state.progress[i]=(Number(state.progress[i])||0)+n});
    }
  }catch{}
}
function repaintSoon(){
  setTimeout(()=>{
    ['renderBoard','renderGoals','updateHud','renderHud','render'].forEach(fn=>{try{if(typeof window[fn]==='function')window[fn]()}catch{}});
  },0);
}
function hitAdjacentEmils(matches){
  const cells=[...normMatches(matches)];
  if(!cells.length)return 0;
  const hit=new Set();
  const dirs=[[1,0],[-1,0],[0,1],[0,-1]];
  cells.forEach(k=>{
    const [r,c]=k.split(',').map(Number);
    dirs.forEach(([dr,dc])=>{
      const rr=r+dr,cc=c+dc;
      if(rr<0||cc<0||rr>=SIZE||cc>=SIZE)return;
      if(isEmil(getCell(rr,cc)))hit.add(rr+','+cc);
    });
  });
  if(!hit.size)return 0;
  hit.forEach(k=>{const [r,c]=k.split(',').map(Number);setCell(r,c,null)});
  bumpEmil(hit.size);
  if(Date.now()-lastToast>900){lastToast=Date.now();try{if(typeof showToast==='function')showToast(hit.size>1?'Эмили вышли из созвона':'Эмиль вышел из созвона')}catch{}}
  repaintSoon();
  return hit.size;
}
function patch(){
  if(installed)return;
  if(typeof findMatches!=='function')return;
  installed=true;
  const originalFind=findMatches;
  findMatches=function(...args){
    const res=originalFind.apply(this,args);
    if(resolvingDepth>0)hitAdjacentEmils(res);
    return res;
  };
  if(typeof resolveBoard==='function'){
    const originalResolve=resolveBoard;
    resolveBoard=async function(...args){
      resolvingDepth++;
      try{return await originalResolve.apply(this,args)}
      finally{resolvingDepth=Math.max(0,resolvingDepth-1)}
    };
  }else if(typeof processBoard==='function'){
    const originalProcess=processBoard;
    processBoard=async function(...args){
      resolvingDepth++;
      try{return await originalProcess.apply(this,args)}
      finally{resolvingDepth=Math.max(0,resolvingDepth-1)}
    };
  }
}
function tick(){patch()}
document.addEventListener('DOMContentLoaded',tick);
window.addEventListener('load',tick);
setInterval(tick,500);
window.rzHitAdjacentEmils=hitAdjacentEmils;
})();