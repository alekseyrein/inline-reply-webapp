(()=>{
function add(){
  if(document.getElementById('rz-v3-no-field-shake-style'))return;
  const s=document.createElement('style');
  s.id='rz-v3-no-field-shake-style';
  s.textContent=`
/* Убираем все визуальные «вздрагивания» всего поля при выборе фишки */
#board{transform:none!important;will-change:auto!important}
#board.rz-board-shake,#board.rz-board-glow,#board.rz-board-glow-soft,#board.rz-match-mode{transform:none!important;animation:rzNoShiftBoardGlow .42s ease-out!important}
.cell.selected{transform:none!important;z-index:6!important;box-shadow:0 0 0 2px rgba(255,255,255,.86),0 0 0 5px rgba(255,86,208,.22),0 8px 18px rgba(0,0,0,.34)!important}
.cell.selected .tile{transform:none!important;animation:none!important;filter:brightness(1.14) saturate(1.08)!important}
.cell.selected .tile::after{content:'';position:absolute;inset:0;border-radius:inherit;box-shadow:inset 0 0 0 2px rgba(255,255,255,.35),inset 0 0 18px rgba(255,86,208,.22);pointer-events:none;z-index:9}
@keyframes rzBoardShake{0%,100%{transform:none}25%{transform:none}55%{transform:none}75%{transform:none}}
@keyframes rzBoardImpact{0%,100%{filter:brightness(1);transform:none}30%{filter:brightness(1.10);transform:none}}
@keyframes rzNoShiftBoardGlow{0%{box-shadow:0 14px 30px rgba(0,0,0,.35)}35%{box-shadow:0 0 0 2px rgba(255,86,208,.18),0 18px 38px rgba(143,79,255,.22)}100%{box-shadow:0 14px 30px rgba(0,0,0,.35)}}
`;
  document.head.appendChild(s);
}
document.addEventListener('DOMContentLoaded',add);
window.addEventListener('load',add);
setTimeout(add,0);
setTimeout(add,700);
})();