(()=>{
const KEY='raznos_tutorial_seen_v1';
const LEVEL_TEXT={
  1:{title:'Уровень 1 · Первый состав',text:'Главное: меняй соседние фишки местами и собирай 3 одинаковых в ряд. Сверху показаны цели уровня — кого нужно собрать.',tips:['Тапни фишку, потом соседнюю','Можно свайпать в сторону','3 в ряд исчезают и дают очки']},
  2:{title:'Уровень 2 · Первый скандал',text:'Появляется спецкомбо. Собери 4 одинаковых в ряд, чтобы создать сильную фишку и закрыть цель спецкомбо.',tips:['4 в ряд = линия','5 в ряд = Чёрный список','L/T форма = Скандал']},
  3:{title:'Уровень 3 · Эмиль на созвоне',text:'Эмиль — блокер. Его нужно убирать совпадениями рядом или сильными спецфишками.',tips:['Цель: убрать Эмиля','Следи за ходами','Спецфишки помогают быстрее']},
  4:{title:'Уровень 4 · Первая паутина',text:'Паутина держит фишку на месте. Собирай совпадения рядом с паутиной, чтобы снять её.',tips:['Паутина мешает двигать фишки','Снимай её рядом матчем','Не трать все ходы на обычные сборы']},
  5:{title:'Уровень 5 · Менеджерская сеть',text:'Здесь уже несколько задач сразу: паутина, Эмиль и спецкомбо. Сначала чисти помехи, потом добирай цели.',tips:['Сначала паутина и Эмиль','Спецкомбо делай по возможности','Умения команды помогают']},
  6:{title:'Уровень 6 · Батенин сверху',text:'Батенин периодически включает распоряжение. Индикатор сверху показывает, через сколько ходов он сработает.',tips:['Батенин через 4 хода','Чисти паутину заранее','Сохраняй спецфишки для давления']}
};
function seen(){try{return JSON.parse(localStorage.getItem(KEY))||{}}catch{return{}}}
function saveSeen(id){const s=seen();s[id]=true;localStorage.setItem(KEY,JSON.stringify(s))}
function st(){if(document.getElementById('rz-tutorial-style'))return;const s=document.createElement('style');s.id='rz-tutorial-style';s.textContent=`
.rz-start-steps{display:grid!important;gap:8px!important;margin-top:14px!important}.rz-start-step{display:grid!important;grid-template-columns:30px 1fr!important;gap:9px!important;align-items:start!important;padding:10px!important;border-radius:15px!important;background:rgba(255,255,255,.045)!important;border:1px solid rgba(255,255,255,.07)!important}.rz-step-num{width:30px!important;height:30px!important;border-radius:10px!important;display:grid!important;place-items:center!important;background:linear-gradient(135deg,#ff56d0,#8f4fff)!important;font-weight:950!important}.rz-step-title{font-weight:900!important;font-size:13px!important;line-height:1.1!important}.rz-step-text{font-size:12px!important;line-height:1.28!important;color:#b8afca!important;margin-top:2px!important}.rz-start-hint{margin-top:12px!important;padding:10px!important;border-radius:15px!important;background:rgba(242,207,119,.08)!important;border:1px solid rgba(242,207,119,.14)!important;color:#eadab2!important;font-size:12px!important;line-height:1.32!important}.rz-level-intro{position:absolute!important;inset:0!important;display:none!important;align-items:center!important;justify-content:center!important;z-index:55!important;padding:18px 14px calc(18px + var(--safe-bottom,0px))!important;background:rgba(4,4,8,.68)!important}.rz-level-intro.active{display:flex!important}.rz-level-card{width:min(100%,460px)!important;border-radius:22px!important;padding:18px!important;background:linear-gradient(180deg,rgba(25,20,38,.98),rgba(11,9,16,.98))!important;border:1px solid rgba(255,255,255,.09)!important;box-shadow:0 18px 40px rgba(0,0,0,.46)!important;color:#fff!important}.rz-level-title{font-size:24px!important;font-weight:950!important;line-height:1.05!important}.rz-level-text{margin-top:8px!important;color:#cfc7dd!important;font-size:14px!important;line-height:1.35!important}.rz-level-tips{display:grid!important;gap:7px!important;margin-top:13px!important}.rz-level-tip{padding:9px 10px!important;border-radius:14px!important;background:rgba(255,255,255,.045)!important;border:1px solid rgba(255,255,255,.07)!important;color:#e9e4f4!important;font-size:13px!important;line-height:1.2!important}.rz-level-tip:before{content:'✓';color:#42d392!important;font-weight:950!important;margin-right:7px!important}.rz-level-actions{display:grid!important;grid-template-columns:1fr 1fr!important;gap:8px!important;margin-top:14px!important}.rz-level-actions button{min-height:44px!important;border-radius:15px!important;border:1px solid rgba(255,255,255,.10)!important;color:#fff!important;font-weight:900!important}.rz-level-skip{background:rgba(255,255,255,.06)!important}.rz-level-ok{background:linear-gradient(135deg,#ff56d0,#8f4fff)!important}
@media(max-height:720px){.rz-start-step{padding:8px!important}.rz-start-hint{display:none!important}.rz-level-card{padding:15px!important}.rz-level-title{font-size:21px!important}.rz-level-text{font-size:13px!important}.rz-level-tip{font-size:12px!important;padding:8px!important}}
`;document.head.appendChild(s)}
function improveStart(){
  const ov=document.getElementById('startOverlay'); if(!ov||ov.dataset.rzTutorialImproved)return; ov.dataset.rzTutorialImproved='1';
  const sub=ov.querySelector('.hero-sub'); if(sub) sub.textContent='Быстрый match-3 про наших героев. Собирай нужных персонажей, чисти помехи и делай спецкомбо, чтобы пройти уровень.';
  const old=ov.querySelector('.mini-list'); if(old){old.className='rz-start-steps'; old.innerHTML=`
    <div class="rz-start-step"><div class="rz-step-num">1</div><div><div class="rz-step-title">Меняй соседние фишки</div><div class="rz-step-text">Тапни две соседние фишки или свайпни одну в сторону.</div></div></div>
    <div class="rz-start-step"><div class="rz-step-num">2</div><div><div class="rz-step-title">Собирай 3 одинаковых</div><div class="rz-step-text">3 в ряд исчезают. Цели уровня всегда показаны сверху.</div></div></div>
    <div class="rz-start-step"><div class="rz-step-num">3</div><div><div class="rz-step-title">Делай спецкомбо</div><div class="rz-step-text">4 в ряд даёт линию, 5 в ряд — сильный «Чёрный список».</div></div></div>
    <div class="rz-start-step"><div class="rz-step-num">4</div><div><div class="rz-step-title">Следи за помехами</div><div class="rz-step-text">Эмиль, паутина, отчёты и Батенин мешают закрыть уровень.</div></div></div>
  `; old.insertAdjacentHTML('afterend','<div class="rz-start-hint">На каждом новом уровне появится короткая подсказка: что изменилось и на что смотреть.</div>')}
}
function currentLevel(){const t=document.querySelector('.brand-sub')?.textContent||'';const m=t.match(/Уровень\s+(\d+)/i);return m?Number(m[1]):0}
function overlayOpen(){return [...document.querySelectorAll('#startOverlay,#levelsOverlay,#resultOverlay')].some(o=>o&&(o.classList.contains('active')||o.classList.contains('show')))}
function makeOverlay(){let ov=document.getElementById('rzLevelIntro');if(ov)return ov;ov=document.createElement('div');ov.id='rzLevelIntro';ov.className='rz-level-intro';ov.innerHTML=`<div class="rz-level-card"><div class="rz-level-title"></div><div class="rz-level-text"></div><div class="rz-level-tips"></div><div class="rz-level-actions"><button class="rz-level-skip">Больше не показывать</button><button class="rz-level-ok">Понятно</button></div></div>`;document.querySelector('.app')?.appendChild(ov);ov.querySelector('.rz-level-ok').onclick=()=>closeIntro(true);ov.querySelector('.rz-level-skip').onclick=()=>{localStorage.setItem(KEY,JSON.stringify({1:true,2:true,3:true,4:true,5:true,6:true}));closeIntro(false)};ov.addEventListener('click',e=>{if(e.target===ov)closeIntro(true)});return ov}
function closeIntro(mark){const ov=document.getElementById('rzLevelIntro');if(mark&&ov?.dataset.level)saveSeen(ov.dataset.level);ov?.classList.remove('active')}
let lastLevel=0, timer=0;
function maybeShow(){
  const lvl=currentLevel(); if(!lvl||!LEVEL_TEXT[lvl])return; if(lvl===lastLevel)return; lastLevel=lvl;
  clearTimeout(timer); timer=setTimeout(()=>{
    if(overlayOpen())return;
    if(seen()[lvl])return;
    const d=LEVEL_TEXT[lvl], ov=makeOverlay(); ov.dataset.level=String(lvl);
    ov.querySelector('.rz-level-title').textContent=d.title;
    ov.querySelector('.rz-level-text').textContent=d.text;
    ov.querySelector('.rz-level-tips').innerHTML=d.tips.map(x=>'<div class="rz-level-tip">'+x+'</div>').join('');
    ov.classList.add('active');
  },650);
}
function tick(){st();improveStart();maybeShow()}
document.addEventListener('DOMContentLoaded',tick);window.addEventListener('load',tick);setInterval(tick,700);document.addEventListener('click',()=>setTimeout(tick,250),true);
})();