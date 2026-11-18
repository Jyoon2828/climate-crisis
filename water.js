(function(root){
 'use strict';
 const EPS=1e-8,clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
 // Clip real world-space geometry at a horizontal water plane. A submerged
 // wall keeps its original base and height; it is never moved onto the water.
 function clip(vertices,height,above=false){
  if(!Array.isArray(vertices)||vertices.length<3)return [];
  const result=[],inside=p=>above?p.y>=height-EPS:p.y<=height+EPS;
  for(let i=0;i<vertices.length;i++){
   const a=vertices[i],b=vertices[(i+1)%vertices.length],ai=inside(a),bi=inside(b);
   if(ai)result.push({...a});
   if(ai!==bi){const t=(height-a.y)/(b.y-a.y);result.push({x:a.x+(b.x-a.x)*t,z:a.z+(b.z-a.z)*t,y:height});}
  }
  return result.filter((p,i,a)=>!i||Math.abs(p.x-a[i-1].x)+Math.abs(p.z-a[i-1].z)+Math.abs(p.y-a[i-1].y)>EPS);
 }
 function surface(triangle,height){return clip(triangle,height).map(p=>({x:p.x,z:p.z,y:height}));}
 function edgeVolume(a,b,height){if(Math.min(a.y,b.y)>=height-EPS)return [];return clip([a,b,{...b,y:height},{...a,y:height}],height);}
 function motion(from,to,now,reduced=false){return {from,to,start:now,duration:reduced||Math.abs(to-from)<EPS?0:Math.min(1900,650+Math.abs(to-from)*650)};}
 function sample(m,time){if(!m)return null;const t=m.duration?clamp((time-m.start)/m.duration,0,1):1,eased=t*t*(3-2*t);return {height:m.from+(m.to-m.from)*eased,progress:t,moving:t<1,direction:Math.sign(m.to-m.from)};}
 function floodAt(height,buildings,terrain){return buildings.filter(b=>terrain(b.x,b.z)<height-EPS).length;}
 const api={clip,surface,edgeVolume,motion,sample,floodAt};root.WaterModel=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
