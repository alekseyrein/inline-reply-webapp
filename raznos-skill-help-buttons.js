(()=>{
const MAP=[
  {rx:/black\s*mode/i,title:'Black mode',text:'Пассивка Блэкнасти. После нескольких сборов Блэкнастя чистит одну помеху: Эмиля, паутину, отчёт или закрытую клетку.'},
  {rx:/рывок/i,title:'Рывок Самирхана',text:'Пассивка Самирхана. Когда Самирхан достаточно часто собирается на поле, он добавляет +1 ход. Это помогает дожать уровень, когда ходов мало.'},
  {rx:/глам/i,title:'Глам-подмена',text:'Пассивка Розы Ксю. Она помогает получить нужного героя на поле, когда сбор цели начинает буксовать.'},
  {rx:/дискоряд/i,title:'Дискоряд Вовы',text:'Пассивка Вовы Дискотеки. После зарядки Вова сносит целый ряд и может задеть помехи.'},
  {rx:/жар/i,title:'Жар',text:'Жар — это счётчик сильных моментов уровня. Он растёт от активной игры, цепочек и спецкомбо.'},
  {rx:/ходы/i,title:'Ходы',text:'Сколько ходов осталось до конца уровня. Нужно закрыть цели сверху до того, как ходы закончатся.'},
  {rx:/очки/i,title:'Очки',text:'Очки начисляются за сборы, цепочки и спецкомбо. Результат сохраняется в локальный рейтинг после завершения уровня.'}
];
function norm(s){return String(s||'').toLowerCase().replace(/ё/g,'е').replace(/\s+/g,' ').trim()}
function helpFor(el){
  if(!el)return null;
  const title=el.querySelector?.('.goal-title')?.textContent || el.querySelector?.('.badge-label')?.textContent || el.textContent || '';
  const n=norm(title);
  return MAP.find(x=>x.rx.test(n)) || null;
}
function style(){
 if(document.getElementById('rz-skill-help-button-style'))return;
 const s=document.createElement('style');s.id='rz-skill-help-button-style';s.textContent=`
.rz-skill-q{display:none!important}.goal-chip.rz-skill-help-card,.badge.rz-skill-help-card,.rz-skill-mini.rz-skill-help-card{cursor:pointer!important;-webkit-tap-highlight-color:rgba(255,255,255,.08)!important}.rz-skill-help-card:active{transform:scale(.987)!important}.rz-skill-help-overlay{position:absolute!important;inset:0!important;z-index:95!important;display:none!important;align-items:center!important;justify-content:center!important;padding:18px 14px calc(18px + var(--safe-bottom,0px))!important;background:rgba(4,4,8,.68)!important}.rz-skill-help-overlay.active{display:flex!important}.rz-skill-help-card-modal{width:min(100%,430px)!important;border-radius:22px!important;padding:18px!important;background:linear-gradient(180deg,rgba(28,22,42,.98),rgba(11,9,16,.98))!important;border:1px solid rgba(255,255,255,.09)!important;box-shadow:0 18px 44px rgba(0,0,0,.48)!important;color:#fff!important}.rz-skill-help-title{font-size:25px!important;line-height:1.05!important;font-weight:950!important}.rz-skill-help-text{margin-top:9px!important;font-size:14px!important;line-height:1.38!important;color:#cbc3da!important}.rz-skill-help-ok{margin-top:14px!important;width:100%!important;min-height:44px!important;border-radius:15px!important;border:1px solid rgba(255,255,255,.10)!important;background:linear-gradient(135deg,#ff56d0,#8f4fff)!important;color:#fff!important;font-weight:950!important;font:inherit!important}`;document.head.appendChild(s)}
function overlay(){style();let ov=document.getElementById('rzSkillHelpOverlay2');if(!ov){ov=document.createElement('div');ov.id='rzSkillHelpOverlay2';ov.className='rz-skill-help-overlay';ov.innerHTML='<div class="rz-skill-help-card-modal"><div class="rz-skill-help-title"></div><div class="rz-skill-help-text"></div><button class="rz-skill-help-ok">Понятно</button></div>';(document.querySelector('.app')||document.body).appendChild(ov);ov.addEventListener('pointerdown',e=>{if(e.target===ov)close()});ov.querySelector('button').addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();close()})}return ov}
function open(h,e){if(e){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation?.()}const ov=overlay();ov.querySelector('.rz-skill-help-title').textContent=h.title;ov.querySelector('.rz-skill-help-text').textContent=h.text;ov.classList.add('active')}
function close(){document.getElementById('rzSkillHelpOverlay2')?.classList.remove('active')}
function prepare(){style();document.querySelectorAll('.rz-skill-q').forEach(b=>b.remove());document.querySelectorAll('.goal-chip,.badge,.rz-skill-mini').forEach(el=>{if(el.closest('#board,#startOverlay,#levelsOverlay,#resultOverlay,#rzSkillHelpOverlay2'))return;const h=helpFor(el);el.classList.toggle('rz-skill-help-card',!!h)})}
function candidateAt(e){
  const x=e.clientX ?? (e.changedTouches&&e.changedTouches[0]?.clientX);
  const y=e.clientY ?? (e.changedTouches&&e.changedTouches[0]?.clientY);
  const direct=e.target?.closest?.('.goal-chip,.badge,.rz-skill-mini');
  if(direct&&helpFor(direct))return direct;
  if(Number.isFinite(x)&&Number.isFinite(y)){
    const els=[...document.querySelectorAll('.goal-chip,.badge,.rz-skill-mini')].filter(el=>!el.closest('#board,#startOverlay,#levelsOverlay,#resultOverlay,#rzSkillHelpOverlay2'));
    const inside=els.filter(el=>{const r=el.getBoundingClientRect();return x>=r.left&&x<=r.right&&y>=r.top&&y<=r.bottom&&helpFor(el)}).sort((a,b)=>{const ra=a.getBoundingClientRect(),rb=b.getBoundingClientRect();return ra.width*ra.height-rb.width*rb.height});
    if(inside[0])return inside[0];
  }
  return null;
}
function handler(e){const card=candidateAt(e);if(!card)return;const h=helpFor(card);if(!h)return;open(h,e)}
['pointerdown','touchend','click'].forEach(ev=>document.addEventListener(ev,handler,true));
document.addEventListener('DOMContentLoaded',prepare);window.addEventListener('load',prepare);setInterval(prepare,500);setTimeout(prepare,0);setTimeout(prepare,700);
})();