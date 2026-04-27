(()=>{
if(window.__rzV3LongSeason)return;window.__rzV3LongSeason=1;
function clone(x){return JSON.parse(JSON.stringify(x))}
function goal(kind,type,count){const g={kind,count};if(type)g.type=type;return g}
function makeLevel(id,chapter,step){
  const s=step+1;
  const ch=chapter+1;
  const lv={id,name:'',sub:`Глава ${ch} · Подуровень ${s}/10`,moves:20,goals:[],shuffle:2,intro:['','',[]]};
  if(ch===1){
    lv.name=`Первый состав ${s}/10`;
    lv.moves=17+Math.ceil(s/2);
    const pairs=[['samir','black'],['rosa','vova'],['samir','rosa'],['black','vova'],['samir','black']];
    const p=pairs[step%pairs.length];
    lv.goals=[goal('collect',p[0],8+s),goal('collect',p[1],7+s)];
    if(s>=7)lv.goals.push(goal('special',null,1));
    lv.intro=['Первый состав',`Подуровень ${s}/10. Учимся собирать состав без паники и лишних созвонов.`,['3 в ряд — сбор цели','4 в ряд — спецфишка','Цели всегда сверху']];
  }else if(ch===2){
    lv.name=`Первый скандал ${s}/10`;
    lv.moves=19+Math.ceil(s/2);lv.reports=1+Math.floor(s/3);lv.shuffle=2;
    lv.goals=[goal('collect',s%2?'vova':'samir',8+s),goal('special',null,1+Math.floor((s-1)/4))];
    if(s>=6)lv.goals.push(goal('collect',s%2?'black':'rosa',6+s));
    lv.intro=['Первый скандал',`Подуровень ${s}/10. Офис делает вид, что это планёрка, но это уже разнос.`,['Спецкомбо дают темп','Не копи отчёты','Закрывай цели с запасом ходов']];
  }else if(ch===3){
    lv.name=`Эмиль на созвоне ${s}/10`;
    lv.moves=22+Math.ceil(s/2);lv.emils=2+Math.floor((s+1)/3);lv.reports=Math.floor(s/4);lv.shuffle=1;
    lv.goals=[goal('clearEmils',null,lv.emils),goal('collect',s%2?'rosa':'black',7+s)];
    if(s>=7)lv.goals.push(goal('special',null,1));
    lv.intro=['Эмиль на созвоне',`Подуровень ${s}/10. Эмиль опять завис в звонке и стал частью инфраструктуры.`,['Эмиля убирают матчи рядом','Спецфишки помогают','Не оставляй блокеры на финал']];
  }else if(ch===4){
    lv.name=`Паутина ${s}/10`;
    lv.moves=22+Math.ceil(s/2);lv.webs=5+s;lv.webEvery=Math.max(3,6-Math.floor(s/3));lv.shuffle=1;
    if(s>=5)lv.reports=1+Math.floor(s/5);
    lv.goals=[goal('clearWebs',null,lv.webs),goal('collect',s%2?'black':'rosa',7+s)];
    if(s>=8)lv.goals.push(goal('special',null,1));
    lv.intro=['Паутина',`Подуровень ${s}/10. Паучиха плетёт сеть, а ты делаешь вид, что это просто таск-трекер.`,['Снимай паутину заранее','Black mode полезен против помех','Не зажимай углы']];
  }else if(ch===5){
    lv.name=`Менеджерская сеть ${s}/10`;
    lv.moves=25+Math.ceil(s/2);lv.emils=2+Math.floor(s/4);lv.reports=1+Math.floor(s/3);lv.webs=6+s;lv.locks=Math.floor(s/3);lv.webEvery=4;lv.shuffle=1;
    lv.goals=[goal('clearWebs',null,lv.webs),goal('clearEmils',null,lv.emils),goal('special',null,1+Math.floor(s/5))];
    lv.intro=['Менеджерская сеть',`Подуровень ${s}/10. Паутина, Эмиль и отчёты собрались в один корпоративный клубок.`,['Сначала помехи','Потом цели','Спецкомбо держи под плотные места']];
  }else{
    lv.name=`Батенин сверху ${s}/10`;
    lv.moves=27+Math.ceil(s/2);lv.emils=2+Math.floor(s/4);lv.reports=2+Math.floor(s/3);lv.webs=7+s;lv.locks=1+Math.floor(s/4);lv.webEvery=4;lv.boss={every:Math.max(3,6-Math.floor(s/3))};lv.shuffle=1;
    lv.goals=[goal('collect','samir',7+s),goal('collect','vova',7+s),goal('clearWebs',null,lv.webs)];
    if(s>=6)lv.goals.push(goal('special',null,1));
    lv.intro=['Батенин сверху',`Подуровень ${s}/10. Батенин уже над полем. Состав держится на честном слове и двух спецкомбо.`,['Следи за таймером Батенина','Чисти паутину заранее','Закрывай уровень с запасом ходов']];
  }
  return lv;
}
function expand(){
  try{
    if(typeof LEVELS==='undefined'||!Array.isArray(LEVELS)||LEVELS.__rzLongSeason)return;
    const arr=[];let id=1;
    for(let ch=0;ch<6;ch++)for(let s=0;s<10;s++)arr.push(makeLevel(id++,ch,s));
    LEVELS.splice(0,LEVELS.length,...arr);LEVELS.__rzLongSeason=true;
    if(window.st&&Number.isFinite(st.level)&&st.level>=LEVELS.length)st.level=0;
    try{renderLevels&&renderLevels()}catch(e){}
    try{renderHud&&renderHud()}catch(e){}
  }catch(e){console.warn('long season failed',e)}
}
function init(){expand();setTimeout(expand,250);setTimeout(expand,1000)}
document.addEventListener('DOMContentLoaded',init);window.addEventListener('load',init);setTimeout(init,0);
})();