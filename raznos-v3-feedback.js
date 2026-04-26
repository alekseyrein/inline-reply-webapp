(()=>{
const DAY=24*60*60*1000;
const STORE='raznos_v3_feedback';
const LAST='raznos_v3_feedback_last';
function style(){
  if(document.getElementById('rz-v3-feedback-style'))return;
  const s=document.createElement('style');
  s.id='rz-v3-feedback-style';
  s.textContent=`
.rz-feedback-btn{width:100%;min-height:38px;border-radius:14px;border:1px solid rgba(255,255,255,.09);background:rgba(255,255,255,.065);font-weight:950;color:#fff}.rz-feedback-form{display:grid;gap:10px;margin-top:12px}.rz-feedback-form textarea,.rz-feedback-form input,.rz-feedback-form select{width:100%;border-radius:14px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.06);color:#fff;padding:11px 12px;font:inherit;outline:none}.rz-feedback-form textarea{min-height:118px;resize:vertical}.rz-feedback-form textarea::placeholder,.rz-feedback-form input::placeholder{color:rgba(255,255,255,.45)}.rz-feedback-row{display:grid;grid-template-columns:1fr 1fr;gap:8px}.rz-feedback-muted{font-size:12px;line-height:1.35;color:#b8afca}.rz-feedback-item{padding:10px;border-radius:16px;background:rgba(255,255,255,.045);border:1px solid rgba(255,255,255,.07);font-size:12px;line-height:1.35;color:#cfc7dc}.rz-feedback-item strong{display:block;color:#fff;font-size:13px;margin-bottom:4px}.rz-feedback-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px}.rz-feedback-copy{font-size:11px;color:#f2cf77;margin-top:4px}
`;
  document.head.appendChild(s);
}
function getItems(){try{return JSON.parse(localStorage.getItem(STORE)||'[]')}catch(e){return[]}}
function setItems(a){localStorage.setItem(STORE,JSON.stringify(a.slice(-100)))}
function fmt(d){try{return new Date(d).toLocaleString('ru-RU')}catch(e){return String(d)}}
function left(){const last=Number(localStorage.getItem(LAST)||0);return Math.max(0,DAY-(Date.now()-last))}
function leftText(){const ms=left();if(!ms)return '';const h=Math.ceil(ms/3600000);return `Следующее сообщение можно отправить примерно через ${h} ч.`}
function overlay(id,title,body){
  style();
  let ov=document.getElementById(id);
  if(!ov){ov=document.createElement('div');ov.className='overlay';ov.id=id;(document.querySelector('.app')||document.body).appendChild(ov)}
  ov.innerHTML=`<div class="overlay-card"><div class="hero-title" style="font-size:24px">${title}</div>${body}</div>`;
  ov.classList.add('active');
  return ov;
}
function close(id){document.getElementById(id)?.classList.remove('active')}
function showForm(){
 const wait=leftText();
 const disabled=!!wait;
 const body=`<div class="hero-sub">Оставь коротко, что смешно/непонятно/сломалось. Ограничение: 1 сообщение в сутки с устройства.</div><div class="rz-feedback-form"><div class="rz-feedback-row"><input id="rzFbName" placeholder="Имя / ник" maxlength="40"><select id="rzFbType"><option>Баг</option><option>Юмор</option><option>Баланс</option><option>Идея</option><option>Другое</option></select></div><textarea id="rzFbText" placeholder="Напиши отзыв…" maxlength="1000" ${disabled?'disabled':''}></textarea><div class="rz-feedback-muted" id="rzFbLimit">${wait||'Сегодня сообщение ещё доступно.'}</div><div class="rz-feedback-actions"><button class="secondary-btn" id="rzFbClose">Закрыть</button><button class="primary-btn" id="rzFbSend" ${disabled?'disabled style="opacity:.45"':''}>Отправить</button></div></div>`;
 const ov=overlay('rzFeedbackOverlay','Обратная связь',body);
 ov.querySelector('#rzFbClose').onclick=()=>close('rzFeedbackOverlay');
 ov.querySelector('#rzFbSend').onclick=()=>{
   if(left()){ov.querySelector('#rzFbLimit').textContent=leftText();return}
   const text=ov.querySelector('#rzFbText').value.trim();
   const name=ov.querySelector('#rzFbName').value.trim()||'Игрок';
   const type=ov.querySelector('#rzFbType').value;
   if(text.length<3){ov.querySelector('#rzFbLimit').textContent='Напиши хотя бы пару слов — иначе Батенин не поймёт, что согласовывать.';return}
   const item={date:Date.now(),name,type,text,level:(typeof level==='function'?level().id:null),score:(window.st&&st.score)||0};
   const arr=getItems();arr.push(item);setItems(arr);localStorage.setItem(LAST,String(Date.now()));
   showThanks(item);
 };
}
function showThanks(item){
 const payload=`[${item.type}] ${item.name}\nУровень: ${item.level||'-'}\nОчки: ${item.score||0}\nДата: ${fmt(item.date)}\n\n${item.text}`;
 const body=`<div class="hero-sub">Сохранил отзыв на этом устройстве. Для централизованного сбора можно скопировать текст и прислать тебе в Telegram/чат.</div><div class="rz-feedback-form"><textarea id="rzFbCopy" readonly>${payload.replace(/[&<>]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[m]))}</textarea><div class="rz-feedback-actions"><button class="secondary-btn" id="rzFbBack">Закрыть</button><button class="primary-btn" id="rzFbCopyBtn">Скопировать</button></div><div class="rz-feedback-copy" id="rzFbCopyMsg"></div></div>`;
 const ov=overlay('rzFeedbackOverlay','Отзыв принят',body);
 ov.querySelector('#rzFbBack').onclick=()=>close('rzFeedbackOverlay');
 ov.querySelector('#rzFbCopyBtn').onclick=async()=>{try{await navigator.clipboard.writeText(payload);ov.querySelector('#rzFbCopyMsg').textContent='Скопировано.'}catch(e){ov.querySelector('#rzFbCopyMsg').textContent='Не удалось скопировать автоматически — выдели текст вручную.'}};
}
function showList(){
 const arr=getItems().slice().reverse();
 const list=arr.length?arr.map((x,i)=>`<div class="rz-feedback-item"><strong>${i+1}. ${x.type} · ${x.name} · ${fmt(x.date)}</strong>${String(x.text).replace(/[&<>]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[m]))}<div class="rz-feedback-muted">Уровень: ${x.level||'-'} · Очки: ${x.score||0}</div></div>`).join(''):'<div class="rz-feedback-item"><strong>Пока пусто</strong>Отзывы ещё не оставляли. Даже Батенин молчит.</div>';
 const body=`<div class="hero-sub">Отзывы сохраняются локально на этом устройстве. Для общего сбора потом лучше подключить Telegram/Google Form/сервер.</div><div class="mini-list">${list}</div><div class="overlay-actions"><button class="secondary-btn" id="rzFbClear">Очистить</button><button class="primary-btn" id="rzFbListClose">Назад</button></div>`;
 const ov=overlay('rzFeedbackListOverlay','Отзывы игроков',body);
 ov.querySelector('#rzFbListClose').onclick=()=>close('rzFeedbackListOverlay');
 ov.querySelector('#rzFbClear').onclick=()=>{localStorage.removeItem(STORE);showList()};
}
function addMenuButtons(){
 style();
 const levels=document.querySelector('#levelsOverlay .overlay-actions');
 if(levels&&!document.getElementById('rzFeedbackMenuBtn')){
   const b=document.createElement('button');b.className='rz-feedback-btn';b.id='rzFeedbackMenuBtn';b.textContent='💬 Обратная связь';b.onclick=showForm;levels.prepend(b);
   const v=document.createElement('button');v.className='rz-feedback-btn';v.id='rzFeedbackViewBtn';v.textContent='📬 Смотреть отзывы';v.onclick=showList;levels.prepend(v);
 }
 const start=document.querySelector('#startOverlay .overlay-actions');
 if(start&&!document.getElementById('rzFeedbackStartBtn')){
   const b=document.createElement('button');b.className='secondary-btn';b.id='rzFeedbackStartBtn';b.textContent='💬 Обратная связь';b.onclick=showForm;start.insertBefore(b,start.firstChild);
 }
}
function init(){addMenuButtons();setInterval(addMenuButtons,700)}
document.addEventListener('DOMContentLoaded',init);window.addEventListener('load',init);setTimeout(init,0);setTimeout(init,1000);
})();