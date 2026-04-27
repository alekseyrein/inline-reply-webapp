(()=>{function add(){if(document.getElementById('rz-v3-no-field-shake-style'))return;const s=document.createElement('style');s.id='rz-v3-no-field-shake-style';s.textContent=`
/* Полностью убираем микровздрагивание поля/фишек на desktop при выборе */
#board,#board *{backface-visibility:hidden!important;will-change:auto!important}
#board{transform:none!important;animation:none!important;transition:none!important}
#board.rz-board-shake,#board.rz-board-glow,#board.rz-board-glow-soft,#board.rz-match-mode{transform:none!important;animation:none!important;transition:none!important}
#board .cell,#board .tile,#board .tile .art{animation:none!important;transition:filter .08s linear!important;transform:none!important}
#board .cell.selected{transform:none!important;z-index:6!important;animation:none!important;box-shadow:0 0 0 2px rgba(255,255,255,.86),0 0 0 5px rgba(242,207,119,.22),0 8px 18px rgba(0,0,0,.34)!important}
#board .cell.selected .tile{transform:none!important;animation:none!important;filter:brightness(1.14) saturate(1.08)!important}
#board .cell.selected .tile::after{content:'';position:absolute;inset:0;border-radius:inherit;box-shadow:inset 0 0 0 2px rgba(255,255,255,.35),inset 0 0 18px rgba(242,207,119,.22);pointer-events:none;z-index:9}
.rz-cell-ripple{display:none!important}
@keyframes rzTileIn{from{opacity:1;transform:none}to{opacity:1;transform:none}}
@keyframes rzSelectedPulse{0%,100%{filter:brightness(1.14);transform:none}50%{filter:brightness(1.14);transform:none}}
@keyframes rzBoardShake{0%,100%{transform:none}25%{transform:none}55%{transform:none}75%{transform:none}}
@keyframes rzBoardImpact{0%,100%{filter:brightness(1);transform:none}30%{filter:brightness(1.05);transform:none}}
@keyframes rzBoardGlow{0%,100%{box-shadow:0 14px 30px rgba(0,0,0,.35)}35%{box-shadow:0 14px 30px rgba(0,0,0,.35)}}
`;document.head.appendChild(s)}function patchFx(){try{if(window.__rzNoShakeFxPatched)return;window.__rzNoShakeFxPatched=1;window.boardFx=function(){return false}}catch(e){}}document.addEventListener('DOMContentLoaded',()=>{add();patchFx()});window.addEventListener('load',()=>{add();patchFx()});setTimeout(()=>{add();patchFx()},0);setTimeout(()=>{add();patchFx()},700);})();