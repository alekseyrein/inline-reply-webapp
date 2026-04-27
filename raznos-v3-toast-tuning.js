(()=> {
  function addStyle() {
    if (document.getElementById('rz-v3-toast-tuning-style')) return;
    const s = document.createElement('style');
    s.id = 'rz-v3-toast-tuning-style';
    s.textContent = `.toast{line-height:1.22;letter-spacing:.01em}.toast.show{opacity:1}`;
    document.head.appendChild(s);
  }
  function patchToast() {
    if (window.__rzV3ToastTunePatched || typeof toast !== 'function') return;
    window.__rzV3ToastTunePatched = true;
    toast = function (t) {
      const el = document.getElementById('toast');
      if (!el) return;
      const msg = String(t || '').trim();
      const duration = Math.max(2400, Math.min(4300, 1500 + msg.length * 28));
      clearTimeout(window.__rzV3ToastHideTimer);
      el.textContent = msg;
      el.classList.add('show');
      window.__rzV3ToastHideTimer = setTimeout(() => el.classList.remove('show'), duration);
    };
  }
  function askNickIfNeeded() {
    const k = 'raznos_v3_nick';
    let nick = (localStorage.getItem(k) || '').trim();
    if (nick && nick !== 'Игрок') return nick;
    nick = prompt('Как записать тебя в рейтинг?', nick || '') || '';
    nick = nick.trim().slice(0, 24);
    if (!nick) nick = 'Игрок';
    localStorage.setItem(k, nick);
    return nick;
  }
  async function submitFinalScore() {
    try {
      if (!window.st || typeof level !== 'function') return;
      const nick = (localStorage.getItem('raznos_v3_nick') || 'Игрок').trim() || 'Игрок';
      const url = 'https://script.google.com/macros/s/AKfycbyb-QWZAf2e0dthB5-jbd5l1n-CLd5UMzRLjdgwK5n0jslb8vZeJG130dXsXlxJYYE/exec';
      const payload = {
        nick,
        score: Number(st.score || 0),
        level: 'FINAL',
        levelName: 'Финал игры',
        win: true,
        heat: Number(st.heat || 0),
        movesLeft: Number(st.moves || 0),
        source: 'game_final',
        sessionId: localStorage.getItem('raznos_v3_session_id') || '',
        userAgent: navigator.userAgent || ''
      };
      await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), mode: 'cors' });
    } catch (e) { console.warn('final score submit failed', e); }
  }
  function showFinalResult() {
    const title = document.getElementById('resultTitle');
    const text = document.getElementById('resultText');
    const details = document.getElementById('resultDetails');
    const next = document.getElementById('resultNext');
    const levels = document.getElementById('resultLevels');
    const nick = localStorage.getItem('raznos_v3_nick') || 'Игрок';
    if (title) title.textContent = 'Состав разнесён';
    if (text) text.textContent = `${nick}, ты прошёл весь текущий сезон. Итог записан в рейтинг.`;
    if (details && window.st) details.innerHTML = `<div class="mini-card"><strong>${nick}</strong>Очки финального уровня: ${Number(st.score || 0).toLocaleString('ru-RU')} · жар ${st.heat || 0}/3 · ходов осталось ${st.moves || 0}</div><div class="mini-card"><strong>Дальше</strong>Нужен длинный сезон: 6 глав по 10 подуровней, чтобы игра стала не на 5 минут, а на полноценное прохождение.</div>`;
    if (levels) levels.textContent = 'К уровням';
    if (next) {
      next.textContent = 'В меню';
      next.onclick = (e) => {
        e.preventDefault();
        document.getElementById('resultOverlay')?.classList.remove('active');
        document.getElementById('startOverlay')?.classList.add('active');
      };
    }
    submitFinalScore();
  }
  function patchFinishFinal() {
    if (window.__rzV3FinalWinPatched || typeof finish !== 'function') return;
    window.__rzV3FinalWinPatched = true;
    const old = finish;
    finish = function (win) {
      if (win) askNickIfNeeded();
      const isFinal = !!(win && window.LEVELS && window.st && st.level >= LEVELS.length - 1);
      const out = old.apply(this, arguments);
      if (isFinal) setTimeout(showFinalResult, 60);
      return out;
    };
  }
  function init() {
    addStyle();
    patchToast();
    patchFinishFinal();
    setTimeout(patchToast, 700);
    setTimeout(patchFinishFinal, 700);
    setTimeout(patchFinishFinal, 1500);
  }
  document.addEventListener('DOMContentLoaded', init);
  window.addEventListener('load', init);
  setTimeout(init, 0);
})();