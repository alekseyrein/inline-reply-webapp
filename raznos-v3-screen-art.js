(()=>{
if(window.__rzV3ScreenArtLoaded)return;window.__rzV3ScreenArtLoaded=true;

// Только экранные фоны и стартовые заставки. Поле, фишки, умения, счёт и механику не трогаем.
const VER='20260427-screen-art-03';
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
const LVL_ART={0:'firstTeam',1:'cracks',2:'emil',3:'spider',4:'spider',5:'batenin'};
const LVL_COPY={
  0:{title:'Первый состав',sub:'Знакомство с главным офисным хаосом. Собирай Самирхана и Блэк Настю, пока состав ещё делает вид, что всё под контролем.',tips:['3 одинаковых в ряд — сбор','Цели всегда сверху','Самирхан и Блэк Настя — главные цели уровня']},
  1:{title:'Первый скандал',sub:'Состав начал трещать. Тут уже нужны спецкомбо, иначе офис просто красиво развалится.',tips:['4 в ряд создаёт спецфишку','5 в ряд создаёт Чёрный список','Спецкомбо дают больше очков']},
  2:{title:'Эмиль на созвоне',sub:'Эмиль завис в вечном созвоне и блокирует процесс. Его надо убирать матчами рядом.',tips:['Эмиля нельзя двигать','Собирай рядом с ним','Спецэффекты тоже помогают']},
  3:{title:'Первая паутина',sub:'Паучиха уже растянула сеть по офису. Паутина держит фишки и ломает красивые планы.',tips:['Снимай паутину как можно раньше','Матч рядом чистит клетку','Black mode может убрать помеху']},
  4:{title:'Менеджерская сеть',sub:'Паутина, Эмиль и отчёты собрались в один прекрасный корпоративный клубок.',tips:['Сначала чисти помехи','Потом добирай цели','Береги спецкомбо под плотные места']},
  5:{title:'Батенин сверху',sub:'Батенин уже печатает приказ. Через несколько ходов офис вспомнит, что у него есть руководитель.',tips:['Следи за полосой Батенина','Чисти паутину заранее','Не трать спецкомбо в пустоту']}
};
function css(){
  if(document.getElementById('rz-v3-screen-art-style'))return;
  const s=document.createElement('style');
  s.id='rz-v3-screen-art-style';
  s.textContent=`
    .overlay{overflow:hidden!important;background:rgba(4,4,8,.84)!important;}
    .rz-screen-art{position:absolute;inset:0;background-size:cover;background-position:center 18%;background-repeat:no-repeat;opacity:.48;filter:saturate(1.04) contrast(1.03) blur(.2px);transform:scale(1.03);transition:opacity .25s ease,background-image .25s ease;z-index:0;pointer-events:none;}
    .rz-screen-art:after{content:"";position:absolute;inset:0;background:radial-gradient(circle at 50% 30%,rgba(8,7,12,.20),rgba(5,4,9,.72) 56%,rgba(5,4,9,.97) 100%),linear-gradient(180deg,rgba(0,0,0,.30),rgba(0,0,0,.82));}
    .overlay-card{position:relative!important;z-index:2!important;}
    #startOverlay .rz-screen-art{opacity:.44;filter:saturate(1.02) contrast(1.02) blur(1.2px);}
    #levelsOverlay .rz-screen-art,#leaderOverlay .rz-screen-art,#helpOverlay .rz-screen-art{opacity:.34;filter:saturate(.95) contrast(1) blur(1.6px);}
    #introOverlay .overlay-card,#resultOverlay .overlay-card{background:linear-gradient(180deg,rgba(25,20,38,.86),rgba(11,9,16,.92))!important;}
    #introOverlay .rz-screen-art,#resultOverlay .rz-screen-art{opacity:.66;filter:saturate(1.08) contrast(1.05) blur(.3px);}

    .rz-level-splash{position:absolute;inset:0;display:none;align-items:flex-end;justify-content:center;padding:calc(18px + var(--safe-top,0px)) 14px calc(20px + var(--safe-bottom,0px));background:rgba(3,3,8,.86);z-index:80;overflow:hidden;}
    .rz-level-splash.active{display:flex;animation:rzSplashFade .18s ease-out both;}
    .rz-level-splash-bg{position:absolute;inset:0;background-size:cover;background-position:center top;background-repeat:no-repeat;transform:scale(1.02);filter:saturate(1.08) contrast(1.04);}
    .rz-level-splash-bg:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.14) 0%,rgba(0,0,0,.28) 38%,rgba(0,0,0,.82) 72%,rgba(0,0,0,.98) 100%),radial-gradient(circle at 50% 30%,rgba(255,210,92,.08),rgba(0,0,0,.64) 70%);}
    .rz-level-splash-card{position:relative;z-index:2;width:min(100%,480px);padding:16px;border-radius:22px;border:1px solid rgba(255,255,255,.11);background:linear-gradient(180deg,rgba(28,22,42,.83),rgba(10,8,15,.94));box-shadow:0 18px 45px rgba(0,0,0,.55);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);}
    .rz-level-kicker{font-size:11px;color:#f2cf77;text-transform:uppercase;letter-spacing:.08em;font-weight:900;margin-bottom:5px;}
    .rz-level-title{font-size:26px;line-height:1.02;font-weight:950;margin:0;color:#fff;text-shadow:0 2px 18px rgba(0,0,0,.55);}
    .rz-level-sub{font-size:14px;line-height:1.34;color:#d6ccdf;margin-top:8px;}
    .rz-level-tips{display:grid;gap:7px;margin-top:12px;}
    .rz-level-tip{border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.055);border-radius:14px;padding:8px 10px;font-size:12px;color:#e8e1ef;}
    .rz-level-start{width:100%;margin-top:14px;min-height:46px;border:0;border-radius:15px;background:linear-gradient(135deg,#ff56d0,#8f4fff);color:#fff;font-size:18px;font-weight:950;box-shadow:0 12px 30px rgba(154,81,255,.32);}
    @keyframes rzSplashFade{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
    @media(max-height:720px){.rz-screen-art{opacity:.42}.rz-level-title{font-size:22px}.rz-level-tip{display:none}.rz-level-splash-card{padding:14px}.rz-level-start{min-height:42px}}
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
function currentLevelIndex(){try{return typeof st!=='undefined'&&Number.isFinite(st.level)?st.level:0}catch(e){return 0}}
function levelArtKey(i=currentLevelIndex()){
  if(LVL_ART[i])return LVL_ART[i];
  const t=(document.getElementById('levelTitle')?.textContent||'').toLowerCase();
  if(t.includes('эмил'))return 'emil';
  if(t.includes('паутин')||t.includes('сеть'))return 'spider';
  if(t.includes('батенин'))return 'batenin';
  if(t.includes('скандал'))return 'cracks';
  return 'firstTeam';
}
function introKey(){return levelArtKey(currentLevelIndex())}
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
function makeSplash(){
  let o=document.getElementById('rzLevelSplash');
  if(o)return o;
  const app=document.querySelector('.app')||document.body;
  o=document.createElement('div');
  o.id='rzLevelSplash';
  o.className='rz-level-splash';
  o.innerHTML=`<div class="rz-level-splash-bg"></div><div class="rz-level-splash-card"><div class="rz-level-kicker"></div><h2 class="rz-level-title"></h2><div class="rz-level-sub"></div><div class="rz-level-tips"></div><button class="rz-level-start">Начать разнос</button></div>`;
  app.appendChild(o);
  o.querySelector('.rz-level-start').addEventListener('click',()=>{o.classList.remove('active')});
  return o;
}
function showLevelSplash(i=currentLevelIndex()){
  const o=makeSplash();
  const copy=LVL_COPY[i]||LVL_COPY[0];
  o.querySelector('.rz-level-splash-bg').style.backgroundImage=`url('${url(levelArtKey(i))}')`;
  o.querySelector('.rz-level-kicker').textContent='Уровень '+(i+1);
  o.querySelector('.rz-level-title').textContent=copy.title;
  o.querySelector('.rz-level-sub').textContent=copy.sub;
  o.querySelector('.rz-level-tips').innerHTML=(copy.tips||[]).map(t=>`<div class="rz-level-tip">${t}</div>`).join('');
  document.getElementById('introOverlay')?.classList.remove('active');
  o.classList.add('active');
}
function patchStartLevel(){
  try{
    if(window.__rzV3ScreenArtStartPatched||typeof startLevel!=='function')return;
    window.__rzV3ScreenArtStartPatched=true;
    const old=startLevel;
    startLevel=function(i){
      const r=old.apply(this,arguments);
      const idx=Number.isFinite(i)?i:currentLevelIndex();
      setTimeout(()=>{refresh();showLevelSplash(idx)},90);
      return r;
    };
  }catch(e){}
}
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
function init(){css();preload();makeSplash();patchShowIntro();patchStartLevel();refresh();observe();setTimeout(()=>{patchStartLevel();refresh()},300);setTimeout(()=>{patchStartLevel();refresh()},1200)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
window.addEventListener('load',()=>setTimeout(init,50));
window.RZ_SCREEN_ART_READY=true;
})();
