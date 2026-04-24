(() => {
  function svg(str) {
    return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(str);
  }

  const STATIC_ART = {
    M: svg(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <defs>
          <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#eef3ff"/>
            <stop offset="1" stop-color="#bcc7d8"/>
          </linearGradient>
          <linearGradient id="metal" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#ffffff"/>
            <stop offset="1" stop-color="#8d99aa"/>
          </linearGradient>
        </defs>
        <rect width="100" height="100" rx="22" fill="url(#bg)"/>
        <rect x="34" y="14" width="32" height="44" rx="16" fill="url(#metal)" stroke="#6c7687" stroke-width="3"/>
        <path d="M25 44a25 25 0 0 0 50 0" fill="none" stroke="#667284" stroke-width="5" stroke-linecap="round"/>
        <path d="M50 69v11" stroke="#667284" stroke-width="5" stroke-linecap="round"/>
        <path d="M38 82h24" stroke="#667284" stroke-width="5" stroke-linecap="round"/>
      </svg>
    `),
    P: svg(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <defs>
          <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#938232"/>
            <stop offset="1" stop-color="#4d4318"/>
          </linearGradient>
          <linearGradient id="ticket" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#f6de7d"/>
            <stop offset="1" stop-color="#c9a743"/>
          </linearGradient>
        </defs>
        <rect width="100" height="100" rx="22" fill="url(#bg)"/>
        <path d="M21 32h58a6 6 0 0 1 6 6v8a8 8 0 0 0 0 16v8a6 6 0 0 1-6 6H21a6 6 0 0 1-6-6v-8a8 8 0 0 0 0-16v-8a6 6 0 0 1 6-6z"
              fill="url(#ticket)" stroke="#5a4914" stroke-width="3"/>
        <path d="M34 42h20M34 51h18M34 60h24" stroke="#7c651a" stroke-width="4" stroke-linecap="round"/>
        <circle cx="68" cy="51" r="7" fill="#a68322"/>
        <path d="M68 45v12" stroke="#f8e8b4" stroke-width="2.6" stroke-linecap="round"/>
      </svg>
    `)
  };

  function ensureStyle() {
    if (document.getElementById('rts')) return;

    const e = document.createElement('style');
    e.id = 'rts';
    e.textContent = `
      .tile.ta {
        overflow: hidden !important;
        background: transparent !important;
        background-image: none !important;
        border: 0 !important;
        outline: none !important;
        box-shadow: none !important;
      }

      .tile.ta::before,
      .tile.ta::after {
        display: none !important;
        content: none !important;
        background: none !important;
        border: 0 !important;
        box-shadow: none !important;
      }

      .tile.ta .tile-bg,
      .tile.ta .tile-face,
      .tile.ta .tile-inner,
      .tile.ta .tile-fill,
      .tile.ta .gem-face,
      .tile.ta .gem-bg {
        display: none !important;
        opacity: 0 !important;
        background: transparent !important;
        border: 0 !important;
        box-shadow: none !important;
      }

      .tile.ta .tile-name {
        display: none !important;
      }

      .tile.ta .tai {
        position: absolute;
        inset: -2px !important;
        border-radius: inherit;
        overflow: hidden;
        z-index: 1;
        pointer-events: none;
        background: transparent !important;
        box-shadow: none !important;
      }

      .tile.ta .tai img {
        width: 100%;
        height: 100%;
        display: block;
        object-fit: cover;
        object-position: center;
        transform: scale(1.045);
        transform-origin: center;
        backface-visibility: hidden;
        -webkit-backface-visibility: hidden;
      }

      .tile.ta .tile-short {
        position: absolute;
        right: 4px;
        bottom: 4px;
        top: auto !important;
        left: auto !important;
        z-index: 3;
        margin: 0;
        padding: 2px 5px;
        border-radius: 999px;
        background: rgba(8, 8, 12, 0.62);
        border: 1px solid rgba(255,255,255,.16);
        font-size: 10px !important;
        line-height: 1 !important;
        letter-spacing: 0;
        color: #fff !important;
        text-shadow: none;
        box-shadow: 0 4px 10px rgba(0,0,0,.22);
      }

      .tile.ta.selected,
      .tile.ta.is-selected,
      .cell.selected .tile.ta,
      .cell.is-selected .tile.ta {
        box-shadow:
          0 0 0 2px rgba(255,255,255,.28),
          0 0 18px rgba(255,255,255,.10) !important;
      }

      @media (max-width: 640px) {
        .tile.ta .tile-short {
          right: 3px;
          bottom: 3px;
          font-size: 9px !important;
          padding: 2px 4px;
        }
      }
    `;
    document.head.appendChild(e);
  }

  function buildMap() {
    const art = { ...STATIC_ART };

    document.querySelectorAll('.goal-chip').forEach(chip => {
      const txt = (chip.textContent || '').toLowerCase();
      const src = chip.querySelector('.goal-icon img')?.src || '';
      if (!src) return;

      if (txt.includes('самир')) art['С'] = src;
      if (txt.includes('блэк')) art['BN'] = src;
    });

    document.querySelectorAll('#passivesWrap .passive-chip').forEach(chip => {
      const txt = (chip.textContent || '').toLowerCase();
      const src = chip.querySelector('img')?.src || '';
      if (!src) return;

      if (txt.includes('самир')) art['С'] = src;
      if (txt.includes('black mode') || txt.includes('блэк')) art['BN'] = src;
      if (txt.includes('роза') || txt.includes('глам')) {
        art['РК'] = src;
        art['PK'] = src;
      }
      if (txt.includes('вова') || txt.includes('диско')) art['ВД'] = src;
    });

    return art;
  }

  function getCode(tile) {
    const short = tile.querySelector('.tile-short');
    if (short) return (short.textContent || '').trim();

    const name = tile.querySelector('.tile-name');
    if (name) {
      const t = (name.textContent || '').trim();
      if (t === 'BN' || t === 'PK' || t === 'РК' || t === 'ВД' || t === 'С' || t === 'M' || t === 'P') {
        return t;
      }
    }

    const raw = (tile.textContent || '').replace(/\s+/g, ' ').trim();
    for (const c of ['BN', 'PK', 'РК', 'ВД', 'С', 'M', 'P']) {
      if (raw === c || raw.startsWith(c + ' ')) return c;
    }

    return '';
  }

  function ensureBadge(tile, code) {
    let badge = tile.querySelector('.tile-short');
    if (!badge) {
      badge = document.createElement('span');
      badge.className = 'tile-short';
      tile.appendChild(badge);
    }
    badge.textContent = code;
    return badge;
  }

  function ensureArt(tile, code, src) {
    tile.classList.add('ta');

    tile.style.background = 'transparent';
    tile.style.backgroundImage = 'none';
    tile.style.border = '0';
    tile.style.outline = 'none';
    tile.style.boxShadow = 'none';

    let wrap = tile.querySelector('.tai');
    if (!wrap) {
      wrap = document.createElement('span');
      wrap.className = 'tai';

      const img = document.createElement('img');
      img.alt = code;
      img.loading = 'eager';

      wrap.appendChild(img);
      tile.prepend(wrap);
    }

    const img = wrap.querySelector('img');
    if (img && img.src !== src) {
      img.src = src;
    }

    const name = tile.querySelector('.tile-name');
    if (name) name.style.display = 'none';
  }

  function decorate() {
    ensureStyle();
    const art = buildMap();

    document.querySelectorAll('#board .tile').forEach(tile => {
      const code = getCode(tile);
      const src = art[code];
      if (!code || !src) return;

      ensureArt(tile, code, src);
      ensureBadge(tile, code);
    });
  }

  let rafQueued = false;
  function schedule() {
    if (rafQueued) return;
    rafQueued = true;
    requestAnimationFrame(() => {
      rafQueued = false;
      decorate();
    });
  }

  let watchUntil = 0;
  let watching = false;
  function watch(ms = 1200) {
    const end = performance.now() + ms;
    if (end > watchUntil) watchUntil = end;
    if (watching) return;

    watching = true;
    const loop = now => {
      schedule();
      if (now < watchUntil) {
        requestAnimationFrame(loop);
      } else {
        watching = false;
      }
    };
    requestAnimationFrame(loop);
  }

  function attachBoardObserver() {
    const board = document.getElementById('board');
    if (!board || board.__tileArtObserved) return;

    board.__tileArtObserved = true;

    const mo = new MutationObserver(() => {
      watch(900);
    });

    mo.observe(board, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    attachBoardObserver();
    watch(1000);
  });

  window.addEventListener('load', () => {
    attachBoardObserver();
    watch(1500);
  });

  setTimeout(() => {
    attachBoardObserver();
    watch(800);
  }, 0);

  setTimeout(() => watch(900), 250);
  setTimeout(() => watch(1200), 900);

  document.addEventListener('click', () => watch(1500), true);
  document.addEventListener('touchend', () => watch(1500), true);
})();
