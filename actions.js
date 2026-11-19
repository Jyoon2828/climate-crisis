(function(root){
  'use strict';
  const MAX=120,clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
  function clean(input){
    const events=(Array.isArray(input)?input:[]).filter(e=>e&&Number.isInteger(e.topic)&&e.topic>=0&&e.topic<6&&[-1,1].includes(e.level));
    return events.slice(0,MAX).map((e,i)=>{
      const item={topic:e.topic,level:e.level,id:typeof e.id==='string'?e.id:'action-'+i};
      if(e.source==='village')item.source='village';
      return item;
    });
  }
  function emptyCounts(){return Array.from({length:6},()=>({high:0,low:0}));}
  function simulate(input,baseline=false){
    const events=clean(input),counts=emptyCounts(),levels=Array(6).fill(0),loads=Array(6).fill(0),plants=[];
    let gas=1,warmth=.12;
    function rates(step){
      const grown=plants.reduce((s,born)=>s+clamp((step-born)/6,0,1),0);
      const emission=baseline?.70:Math.max(.16,.70+loads.reduce((a,b)=>a+b,0)+counts[2].high*.008);
      const uptake=baseline?.22:clamp(.22-counts[2].high*.018+grown*.012,.03,.45);
      return {emission,uptake,net:Math.max(.015,emission-uptake)};
    }
    function snapshot(step){return {step,gas,warmth,...rates(step),choices:[...levels],counts:counts.map(c=>({...c})),planted:plants.length};}
    const frames=[snapshot(0)];
    events.forEach((e,i)=>{
      const step=i+1;
      if(!baseline){counts[e.topic][e.level>0?'high':'low']++;levels[e.topic]=e.level;
        if(e.topic===2){if(e.level<0)plants.push(step);}else loads[e.topic]=clamp(loads[e.topic]+e.level*.045,-.10,.40);
      }
      const r=rates(step);gas+=r.net*.22;
      const target=.12+(gas-1)*.66;warmth+=(target-warmth)*.26;
      frames.push(snapshot(step));
    });return frames;
  }
  function compare(frames,base,step){const a=base[step],b=frames[step],d=b.gas-a.gas;return {a,b,d,direction:Math.abs(d)<.000001?'same':d>0?'higher':'lower'};}
  function counts(input){const c=emptyCounts();clean(input).forEach(e=>c[e.topic][e.level>0?'high':'low']++);return c;}
  function preview(input,step,focus,running=false){
    const events=Array.isArray(input)?input:[];
    if(!Number.isInteger(focus)||focus<0||focus>=6)return null;
    const cursor=clamp(Math.floor(Number(step)||0),0,events.length),end=Math.min(events.length-1,running?cursor:cursor-1);
    for(let i=end;i>=0;i--){const event=events[i];if(event&&event.topic===focus&&[-1,1].includes(event.level))return {event,index:i,active:Boolean(running&&i===cursor)};}
    return null;
  }
  const api={MAX,clean,simulate,compare,counts,emptyCounts,preview};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  root.ClimateActions=api;
})(typeof window!=='undefined'?window:globalThis);
