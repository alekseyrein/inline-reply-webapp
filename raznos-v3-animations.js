(()=>{
function addStyle(){
  if(document.getElementById('rz-v3-match-animation-style'))return;
  const s=document.createElement('style');
  s.id='rz-v3-match-animation-style';
  s.textContent=`
#board.rz-match-mode{animation:rzBoardImpact .46s ease-out}.cell.rz-match-hit{z-index:22!important;overflow:visible!important}.cell.rz-match-hit .tile{animation:rzMatchBoom .42s cubic-bezier(.14,1.42,.22,1) both!important;box-shadow:0 0 0 2px rgba(255,255,255,.76),0 0 22px rgba(255,86,208,.68),0 10px 22px rgba(0,0,0,.42)!important}.cell.rz-match-hit .tile::before{content:'';position:absolute;inset:-16%;border-radius:inherit;background:radial-gradient(circle,rgba(255,255,255,.55) 0%,rgba(255,86,208,.30) 35%,transparent 68%);z-index:6;pointer-events:none;animation:rzMatchFlash .42s ease-out forwards}.cell.rz-match-clear .tile{animation:rzClearOut .28s ease-in forwards!important}.rz-match-spark{position:absolute;left:50%;top:50%;width:0;height:0;z-index:88;pointer-events:none}.rz-match-spark i{position:absolute;width:6px;height:6px;border-radius:50%;background:linear-gradient(135deg,#fff,#ff56d0 48%,#f2cf77);box-shadow:0 0 12px rgba(255,86,208,.75);animation:rzMatchParticle .62s ease-out forwards}.rz-match-word{position:absolute;left:50%;top:50%;z-index:90;pointer-events:none;transform:translate(-50%,-50%);padding:8px 12px;border-radius:999px;background:rgba(8,7,12,.78);border:1px solid rgba(255,255,255,.18);box-shadow:0 14px 30px rgba(0,0,0,.38),0 0 26px rgba(255,86,208,.28);font-size:15px;font-weight:950;letter-spacing:.04em;color:#fff;text-shadow:0 2px 10px rgba(0,0,0,.6);animation:rzMatchWord .72s ease-out forwards;white-space:nowrap}.rz-match-line{position:absolute;z-index:70;pointer-events:none;border-radius:999px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.9),rgba(255,86,208,.65),transparent);filter:blur(.2px);box-shadow:0 0 18px rgba(255,86,208,.5);animation:rzLineSweep .42s ease-out forwards;transform-origin:center}.rz-fall-soft .tile{animation:rzFallSoft .24s ease-out both!important}
@keyframes rzBoardImpact{0%{filter:brightness(1);transform:scale(1)}28%{filter:brightness(1.18);transform:scale(1.012)}100%{filter:brightness(1);transform:scale(1)}}@keyframes rzMatchBoom{0%{transform:scale(1);filter:brightness(1)}45%{transform:scale(1.16) rotate(-1.2deg);filter:brightness(1.38) saturate(1.18)}100%{transform:scale(1.03);filter:brightness(1.12)}}@keyframes rzMatchFlash{0%{opacity:0;transform:scale(.58)}30%{opacity:1}100%{opacity:0;transform:scale(1.42)}}@keyframes rzClearOut{0%{opacity:1;transform:scale(1.04)}100%{opacity:0;transform:scale(.42) rotate(5deg);filter:blur(2px)}}@keyframes rzMatchParticle{0%{opacity:1;transform:translate(0,0) scale(1)}100%{opacity:0;transform:translate(var(--x),var(--y)) scale(.22)}}@keyframes rzMatchWord{0%{opacity:0;transform:translate(-50%,-38%) scale(.82)}20%{opacity:1;transform:translate(-50%,-55%) scale(1.08)}100%{opacity:0;transform:translate(-50%,-105%) scale(1)}}@keyframes rzLineSweep{0%{opacity:0;transform:scaleX(.18)}25%{opacity:1}100%{opacity:0;transform:scaleX(1.18)}}@keyframes rzFallSoft{0%{transform:translateY(-8px);opacity:.8}100%{transform:translateY(0);opacity:1}}
`;
  document.head.appendChild(s);
}
function wait(ms){return new Promise(r=>setTimeout(r,ms))}
function board(){return document.getElementById('board')}
function cellEl(p){return document.querySelector(`#board .cell[data-r="${p.r}"][data-c="${p.c}"]`)}
function centerOfCells(cells){
  const rects=cells.map(p=>cellEl(p)?.getBoundingClientRect()).filter(Boolean);
  if(!rects.length)return null;
  const l=Math.min(...rects.map(r=>r.left)),r=Math.max(...rects.map(r=>r.right)),t=Math.min(...rects.map(r=>r.top)),b=Math.max(...rects.map(r=>r.bottom));
  return {x:(l+r)/2,y:(t+b)/2,w:r-l,h:b-t,left:l,top:t};
}
function sparkAt(x,y,count=10){
  const app=document.querySelector('.app')||document.body;
  const sp=document.createElement('div');sp.className='rz-match-spark';sp.style.left=x+'px';sp.style.top=y+'px';
  for(let i=0;i<count;i++){const dot=document.createElement('i');const a=Math.PI*2*i/count+(Math.random()*.35);const d=22+Math.random()*34;dot.style.setProperty('--x',Math.cos(a)*d+'px');dot.style.setProperty('--y',Math.sin(a)*d+'px');sp.appendChild(dot)}
  app.appendChild(sp);setTimeout(()=>sp.remove(),760);
}
function wordAt(text,x,y){
  const app=document.querySelector('.app')||document.body;
  const w=document.createElement('div');w.className='rz-match-word';w.textContent=text;w.style.left=x+'px';w.style.top=y+'px';app.appendChild(w);setTimeout(()=>w.remove(),820);
}
function lineForGroup(g){
  const c=centerOfCells(g.cells||[]);if(!c)return;
  const app=document.querySelector('.app')||document.body;
  const line=document.createElement('div');line.className='rz-match-line';
  const row=(g.dir==='row')||(c.w>=c.h);
  line.style.left=(row?c.left:c.x-3)+'px';line.style.top=(row?c.y-3:c.top)+'px';line.style.width=(row?c.w:6)+'px';line.style.height=(row?6:c.h)+'px';
  app.appendChild(line);setTimeout(()=>line.remove(),520);
}
async function animateMatch(groups){
  addStyle();
  if(!groups||!groups.length)return;
  try{renderBoard()}catch(e){}
  const bd=board();if(bd){bd.classList.remove('rz-match-mode');void bd.offsetWidth;bd.classList.add('rz-match-mode');setTimeout(()=>bd.classList.remove('rz-match-mode'),520)}
  const seen=new Set();let maxLen=0;
  groups.forEach(g=>{maxLen=Math.max(maxLen,(g.cells||[]).length);lineForGroup(g);const c=centerOfCells(g.cells||[]);if(c){sparkAt(c.x,c.y,(g.cells||[]).length>=4?16:10);if((g.cells||[]).length>=4)wordAt((g.cells||[]).length>=5?'ЧЁРНЫЙ СПИСОК':'СПЕЦКОМБО',c.x,c.y)};(g.cells||[]).forEach(p=>{const k=p.r+','+p.c;if(seen.has(k))return;seen.add(k);const el=cellEl(p);if(el){el.classList.add('rz-match-hit')}})});
  if(maxLen===3){const all=[...seen].map(k=>{const [r,c]=k.split(',').map(Number);return{r,c}});const c=centerOfCells(all);if(c)wordAt('РАЗНОС',c.x,c.y)}
  await wait(330);
  seen.forEach(k=>{const [r,c]=k.split(',').map(Number);const el=cellEl({r,c});if(el){el.classList.add('rz-match-clear')}});
  await wait(190);
}
function patchResolve(){
  try{
    if(window.__rzV3ResolveAnimPatched||typeof resolve!=='function')return;
    window.__rzV3ResolveAnimPatched=true;
    const old=resolve;
    resolve=async function(groups){
      try{if(groups&&groups.length)await animateMatch(groups)}catch(e){console.warn('match animation failed',e)}
      return old.apply(this,arguments);
    };
  }catch(e){console.warn('resolve animation patch failed',e)}
}
function patchShuffleFall(){
  try{
    if(window.__rzV3RenderAnimPatched||typeof renderBoard!=='function')return;
    window.__rzV3RenderAnimPatched=true;
    const old=renderBoard;
    renderBoard=function(){const out=old.apply(this,arguments);setTimeout(()=>{document.querySelectorAll('#board .cell').forEach(c=>{c.classList.add('rz-fall-soft');setTimeout(()=>c.classList.remove('rz-fall-soft'),260)})},0);return out};
  }catch(e){}
}
function init(){addStyle();patchResolve();patchShuffleFall();setTimeout(patchResolve,500);setTimeout(patchResolve,1200)}
document.addEventListener('DOMContentLoaded',init);window.addEventListener('load',init);setTimeout(init,0);setTimeout(init,900);
})();