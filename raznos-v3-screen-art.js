(()=>{
if(window.__rzV3ScreenArtLoaded)return;window.__rzV3ScreenArtLoaded=true;

// Только экранные фоны. Поле, фишки, умения, анимации и механику не трогаем.
// Арты лежат в /rz-screen-art/ с именами из ART ниже.
const VER='20260427-screen-art-02';
const BASE='./rz-screen-art/';
const ART={
  menu:'menu.jpg',
  firstTeam:'first-team.jpg',
  batenin:'batenin-pressure.jpg',
  emil:'emil-call.jpg',
  rosa:'rosa-enter.jpg',
  spider:'spider-web.jpg',
  black:'black-mode.jpg',
  disco:'disco-row.jpg',
  cracks:'cracks.jpg',
  samirSolo:'samir-solo.jpg',
  lose:'lose.jpg',
  win:'win.jpg'
};
const url=k=>BASE+(ART[k]||ART.menu)+'?v='+VER;

function css(){
  if(document.getElementById('rz-v3-screen-art-style'))return;
  const s=document.createElement('style');
  s.id='rz-v3-screen-art-style';
  s.textContent=`
    .overlay{overflow:hidden!important;background:rgba(4,4,8,.78)!important;}
    .rz-screen-art{position:absolute;inset:0;background-size:cover;background-position:center;background-repeat:no-repeat;opacity:.68;filter:saturate(1.08) contrast(1.06);transform:scale(1.035);transition:opacity .25s ease,background-image .25s ease;z-index:0;pointer-events:none;}
    .rz-screen-art:after{content:"";position:absolute;inset:0;background:radial-gradient(circle at 50% 34%,rgba(8,7,12,.08),rgba(5,4,9,.68) 58%,rgba(5,4,9,.96) 100%),linear-gradient(180deg,rgba(0,0,0,.18),rgba(0,0,0,.72));}
    .overlay-card{position:relative!important;z-index:2!important;}
    #startOverlay .rz-screen-art{opacity:.72;}
    #introOverlay .overlay-card,#resultOverlay .overlay-card{background:linear-gradient(180deg,rgba(25,20,38,.86),rgba(11,9,16,.91))!important;}
    #introOverlay .rz-screen-art,#resultOverlay .rz-screen-art{opacity:.76;}
    @media(max-height:720px){.rz-screen-art{opacity:.56}}
  `;
  document.head.appendChild(s);
}
function bgEl(overlay){
  if(!overlay)return null;
  let el=overlay.querySelector(':scope > .rz-screen-art');
  if(!el){el=document.createElement('div');el.className='rz-screen-art';overlay.insertBefore(el,overlay.firstChild)}
  return el;
}
function setArt(id,key){
  const o=document.getElementById(id);
  if(!o)return;
  const el=bgEl(o);
  if(!el)return;
  const next=url(key);
  if(o.dataset.rzArtUrl===next)return;
  o.dataset.rzArtUrl=next;
  el.style.backgroundImage=`url('${next}')`;
}
function introKey(){
  const t=(document.getElementById('introTitle')?.textContent||'').toLowerCase();
  if(t.includes('первый состав'))return 'firstTeam';
  if(t.includes('скандал'))return 'cracks';
  if(t.includes('эмил'))return 'emil';
  if(t.includes('паутин')||t.includes('сеть'))return 'spider';
  if(t.includes('батенин'))return 'batenin';
  if(t.includes('black')||t.includes('блэк'))return 'black';
  if(t.includes('диско')||t.includes('вова'))return 'disco';
  if(t.includes('роза'))return 'rosa';
  if(t.includes('самир'))return 'samirSolo';
  return 'firstTeam';
}
function resultKey(){
  const t=((document.getElementById('resultTitle')?.textContent||'')+' '+(document.getElementById('resultText')?.textContent||'')).toLowerCase();
  if(t.includes('побед')||t.includes('пройден')||t.includes('разнес'))return 'win';
  if(t.includes('проиг')||t.includes('ходы')||t.includes('не успел')||t.includes('не получилось'))return 'lose';
  return 'win';
}
function refresh(){
  setArt('startOverlay','menu');
  setArt('levelsOverlay','menu');
  setArt('leaderOverlay','menu');
  setArt('helpOverlay','menu');
  setArt('introOverlay',introKey());
  setArt('resultOverlay',resultKey());
}
function preload(){Object.keys(ART).forEach(k=>{const img=new Image();img.src=url(k)})}
function patchShowIntro(){
  try{
    if(window.__rzV3ScreenArtIntroPatched||typeof showIntro!=='function')return;
    window.__rzV3ScreenArtIntroPatched=true;
    const old=showIntro;
    showIntro=function(){const r=old.apply(this,arguments);setTimeout(refresh,0);setTimeout(refresh,80);return r};
  }catch(e){}
}
function observe(){
  const mo=new MutationObserver(refresh);
  ['startOverlay','introOverlay','resultOverlay','levelsOverlay','leaderOverlay','helpOverlay'].forEach(id=>{
    const el=document.getElementById(id);
    if(el)mo.observe(el,{attributes:true,childList:true,subtree:true,characterData:true});
  });
}
function init(){css();preload();patchShowIntro();refresh();observe();setTimeout(refresh,300);setTimeout(refresh,1200)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
window.addEventListener('load',()=>setTimeout(init,50));
window.RZ_SCREEN_ART_READY=true;
})();
