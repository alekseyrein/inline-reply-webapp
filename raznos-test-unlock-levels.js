(()=>{
function unlock(){
  try{
    const n=(typeof LEVELS!=='undefined'&&LEVELS&&LEVELS.length)?LEVELS.length:6;
    const key=(typeof STORAGE_KEY!=='undefined'&&STORAGE_KEY)?STORAGE_KEY:'raznos_sostava_progress_v1';
    const data={unlocked:n,stars:{}};
    localStorage.setItem(key,JSON.stringify(data));
    if(typeof state!=='undefined'&&state&&state.progressStore){
      state.progressStore.unlocked=n;
      state.progressStore.stars=state.progressStore.stars||{};
    }
    if(typeof renderLevelMenu==='function') renderLevelMenu();
  }catch(e){console.warn('test unlock failed',e)}
}
document.addEventListener('DOMContentLoaded',()=>setTimeout(unlock,100));
window.addEventListener('load',()=>setTimeout(unlock,200));
setTimeout(unlock,0);
setTimeout(unlock,600);
document.addEventListener('click',e=>{if(e.target&&e.target.closest&&e.target.closest('#menuBtn,#openLevelsFromStart'))setTimeout(unlock,120)},true);
})();