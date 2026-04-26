(()=> {
  function addStyle() {
    if (document.getElementById('rz-v3-toast-tuning-style')) return;
    const s = document.createElement('style');
    s.id = 'rz-v3-toast-tuning-style';
    s.textContent = `
      .toast {
        line-height: 1.22;
        letter-spacing: .01em;
      }
      .toast.show {
        opacity: 1;
      }
    `;
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

      window.__rzV3ToastHideTimer = setTimeout(() => {
        el.classList.remove('show');
      }, duration);
    };
  }

  function init() {
    addStyle();
    patchToast();
    setTimeout(patchToast, 700);
    setTimeout(patchToast, 1500);
  }

  document.addEventListener('DOMContentLoaded', init);
  window.addEventListener('load', init);
  setTimeout(init, 0);
})();