(()=>{
function addStyle(){
  if(document.getElementById('rz-v3-toast-tuning-style'))return;
  const s=document.createElement('style');
  s.id='rz-v3-toast-tuning-style';
  s.textContent=`.toast{line-height:1.22;letter-spacing:.01em}.toast.show{opacity:1}`;
  document.head.appendChild(s);
}
function patchToast(){
  try{
    if(window.__rzV3ToastTunePatched||typeof toast!=='function')return;
    window.__rzV3ToastTunePatched=true;
    const old=toast;
    toast=function(t){
      old(t);
      const el=document.getElementById('toast');
      if(!el)return;
      const msg=String(el.textContent||t||'').trim();
      const duration=Math.max(2200,Math.min(4200,1400+msg.length*26));
      clearTimeout(window.__rzV3ToastHideTimer);
      clearInterval(window.__rzV3ToastKeepAlive);
      el.textContent=msg;
      el.classList.add('show');
      window.__rzV3ToastKeepAlive=setInterval(()=>{el.textContent=msg;el.classList.add('show')},220);
      window.__rzV3ToastHideTimer=setTimeout(()=>{
        clearInterval(window.__rzV3ToastKeepAlive);
        el.classList.remove('show');
      },duration);
    };
  }catch(e){console.warn('toast tuning patch failed',e)}
}
function init(){addStyle();patchToast();setTimeout(patchToast,700);setTimeout(patchToast,1500)}
document.addEventListener('DOMContentLoaded',init);window.addEventListener('load',init);setTimeout(init,0);
})();