(()=>{
const HELP={
  'рывок':{title:'Рывок Самирхана',text:'Пассивка команды. Когда Самирхан достаточно часто собирается на поле, он добавляет +1 ход. Это спасает уровень, если ходов мало.'},
  'black mode':{title:'Black mode',text:'Пассивка Блэкнасти. После нескольких сборов Блэкнастя чистит одну помеху: Эмиля, паутину, отчёт или закрытую клетку.'},
  'глам-подмена':{title:'Глам-подмена',text:'Пассивка Розы Ксю. Помогает получить нужного героя на поле, когда цель начинает буксовать.'},
  'дискоряд':{title:'Дискоряд Вовы',text:'Пассивка Вовы Дискотеки. После зарядки Вова сносит целый ряд и может задеть помехи.'},
  'жар':{title:'Жар',text:'Жар — это мини-счётчик сильных моментов уровня. Он растёт от активной игры, цепочек и спецкомбо. Чем больше жара, тем ближе разнос к красивому прохождению.'},
  'ходы':{title:'Ходы',text:'Сколько ходов осталось до конца уровня. Собирай цели сверху, пока ходы не закончились.'},
  'очки':{title:'Очки',text:'Очки за сборы, цепочки и спецкомбо. Результат сохраняется в локальный рейтинг после завершения уровня.'}
};
function norm(s){return String(s||'').toLowerCase().replace(/ё/g,'е').replace(/\s+/g,' ').trim()}
function st(){
 if(document.getElementById('rz-help-clean-style'))return;
 const s=document.createElement('style');
 s.id='rz-help-clean-style';
 s.textContent=`
#board .tile-short,#board .tile-name,#board .blocker-short,#board .blocker-name,#board .rz-badge,#board .label,#board .letter{display:none!important;opacity:0!important;visibility:hidden!important;color:transparent!important;text-shadow:none!important;font-size:0!important}
#board .tile,#board .blocker,#board .rz-final-special{font-size:0!important;color:transparent!important;text-shadow:none!important}
#board .rz-closed-art::after{display:none!important;content:none!important}
.goal-chip.rz-helpable,.rz-skill-strip,.rz-skill-mini,.badge.rz-helpable{cursor:pointer!important;-webkit-tap-highlight-color:rgba(255,255,255,.08)!important}
.goal-chip.rz-helpable:active,.rz-skill-mini:active,.badge.rz-helpable:active{transform:scale(.985)!important}
.rz-help-overlay{position:absolute!important;inset:0!important;z-index:80!important;display:none!important;align-items:center!important;justify-content:center!important;padding:18px 14px calc(18px + var(--safe-bottom,0px))!important;background:rgba(4,4,8,.66)!important}.rz-help-overlay.active{display:flex!important}.rz-help-card{width:min(100%,430px)!important;border-radius:22px!important;padding:18px!important;background:linear-gradient(180deg,rgba(28,22,42,.98),rgba(11,9,16,.98))!important;border:1px solid rgba(255,255,255,.09)!important;box-shadow:0 18px 44px rgba(0,0,0,.48)!important;color:#fff!important}.rz-help-title{font-size:24px!important;line-height:1.06!important;font-weight:950!important}.rz-help-text{margin-top:9px!important;font-size:14px!important;line-height:1.38!important;color:#cbc3da!important}.rz-help-actions{margin-top:14px!important;display:grid!important}.rz-help-actions button{min-height:44px!important;border-radius:15px!important;border:1px solid rgba(255,255,255,.10)!important;background:linear-gradient(135deg,#ff56d0,#8f4fff)!important;color:#fff!important;font-weight:950!important;font:inherit!important}
.rz-help-pulse{animation:rzHelpPulse .38s ease-out}@keyframes rzHelpPulse{0%{box-shadow:0 0 0 0 rgba(255,86,208,.0)}40%{box-shadow:0 0 0 3px rgba(255,86,208,.23)}100%{box-shadow:0 0 0 0 rgba(255,86,208,.0)}}
`;
 document.head.appendChild(s);
}
function overlay(){
 st();
 let ov=document.getElementById('rzHelpOverlay');
 if(!ov){
  ov=document.createElement('div');ov.id='rzHelpOverlay';ov.className='rz-help-overlay';
  ov.innerHTML='<div class="rz-help-card"><div class="rz-help-title"></div><div class="rz-help-text"></div><div class="rz-help-actions"><button>Понятно</button></div></div>';
  (document.querySelector('.app')||document.body).appendChild(ov);
  ov.addEventListener('click',e=>{if(e.target===ov)hide()});
  ov.querySelector('button').onclick=hide;
 }
 return ov;
}
function show(title,text){
 const ov=overlay();
 ov.querySelector('.rz-help-title').textContent=title;
 ov.querySelector('.rz-help-text').textContent=text;
 ov.classList.add('active');
}
function hide(){document.getElementById('rzHelpOverlay')?.classList.remove('active')}
function helpForText(txt){
 txt=norm(txt);
 if(txt.includes('black'))return HELP['black mode'];
 if(txt.includes('рывок'))return HELP['рывок'];
 if(txt.includes('глам'))return HELP['глам-подмена'];
 if(txt.includes('дискоряд')||txt.includes('вова'))return HELP['дискоряд'];
 if(txt.includes('жар'))return HELP['жар'];
 if(txt.includes('ходы'))return HELP['ходы'];
 if(txt.includes('очки'))return HELP['очки'];
 return null;
}
function markHelpables(){
 st();
 document.querySelectorAll('.goal-chip').forEach(ch=>{
  const h=helpForText(ch.textContent);
  ch.classList.toggle('rz-helpable',!!h);
  if(h)ch.dataset.rzHelpKey=h.title;
 });
 document.querySelectorAll('.badge').forEach(b=>{
  const h=helpForText(b.textContent);
  b.classList.toggle('rz-helpable',!!h);
  if(h)b.dataset.rzHelpKey=h.title;
 });
 document.querySelectorAll('.rz-skill-mini').forEach(m=>m.classList.add('rz-helpable'));
}
function cleanTiles(){
 st();
 document.querySelectorAll('#board .rz-badge,#board .tile-short,#board .tile-name,#board .blocker-short,#board .blocker-name').forEach(el=>{
  el.style.display='none';el.style.opacity='0';el.style.visibility='hidden';el.textContent='';
 });
}
function tick(){markHelpables();cleanTiles()}
document.addEventListener('click',e=>{
 const node=e.target.closest&&e.target.closest('.goal-chip.rz-helpable,.badge.rz-helpable,.rz-skill-mini,.rz-skill-strip');
 if(!node)return;
 const h=helpForText(node.textContent||node.dataset.rzHelpKey);
 if(!h)return;
 e.preventDefault();e.stopPropagation();
 node.classList.remove('rz-help-pulse');void node.offsetWidth;node.classList.add('rz-help-pulse');
 show(h.title,h.text);
},true);
document.addEventListener('DOMContentLoaded',tick);window.addEventListener('load',tick);setInterval(tick,600);setTimeout(tick,0);setTimeout(tick,500);
})();