(function(root){
 'use strict';
 root.createCoastalTank = function(canvas){
 const C=root.Curriculum,ctx=canvas.getContext('2d');
 let w=0,h=0,dpr=1,angle=.55,zoom=1,currentWater=.06,hitTiles=[],labelHits=[],appState=null;
 let cameraCache, waterMotion=null, lastRequestedWater=null, frame=0, moving=false, activePointer=null;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 function schedule(){if(!frame)frame=requestAnimationFrame(draw);}
 function resize(){
  const r=canvas.getBoundingClientRect();w=r.width;h=r.height;dpr=Math.min(2,devicePixelRatio||1);
  canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);
  ctx.setTransform(dpr,0,0,dpr,0,0);schedule();
 }
 const observer=new ResizeObserver(resize);
 observer.observe(canvas);
 function available(){return {x:0,y:0,w,h};}
 function camera(){return cameraCache;}
 function poly(points,fill,stroke){ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=.65;ctx.stroke();}}
 function rounded(x,y,ww,hh,r,fill,stroke){ctx.beginPath();ctx.roundRect(x,y,ww,hh,r);if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.stroke();}}
 function line(a,b,color,width=1){ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke();}
 function text(t,x,y,size=12,color='#315a47',align='center'){ctx.fillStyle=color;ctx.font='700 '+size+'px sans-serif';ctx.textAlign=align;ctx.fillText(t,x,y);}
 function project(x,z,y=0){const c=camera(),rx=x*c.cos-z*c.sin,rz=x*c.sin+z*c.cos;return {x:c.cx+rx*c.scale,y:c.cy+rz*c.scale*.48-y*c.scale,depth:rz};}
 const W=root.WaterModel;
 const V=(x,z,y)=>({x,z,y});
 const worldPoint=p=>project(p.x,p.z,p.y);
 const faceDepth=points=>points.reduce((s,p)=>s+project(p.x,p.z,p.y).depth,0)/points.length;
 function worldPoly(points,fill,stroke){if(points.length<3)return;poly(points.map(worldPoint),fill,stroke);}
 function worldPath(polygons){ctx.beginPath();for(const points of polygons){if(points.length<3)continue;points.forEach((p,i)=>{const q=worldPoint(p);i?ctx.lineTo(q.x,q.y):ctx.moveTo(q.x,q.y);});ctx.closePath();}}
 function boxFaces(x,z,y,ww,dd,hh,colors,roof=false){
  const b=[V(x-ww/2,z-dd/2,y),V(x+ww/2,z-dd/2,y),V(x+ww/2,z+dd/2,y),V(x-ww/2,z+dd/2,y)];
  const t=b.map(p=>({...p,y:y+hh})),faces=[];
  for(let i=0;i<4;i++)faces.push({points:[b[i],b[(i+1)%4],t[(i+1)%4],t[i]],color:colors[1+i%2]});
  if(roof){
   const r1=V(x,z-dd/2,y+hh+.23),r2=V(x,z+dd/2,y+hh+.23);
   faces.push({points:[t[0],t[3],r2,r1],color:'#c67b5b'},{points:[t[1],t[2],r2,r1],color:'#a75e49'});
   faces.push({points:[t[0],t[1],r1],color:colors[1]},{points:[t[2],t[3],r2],color:colors[2]});
  }else faces.push({points:t,color:colors[0]});
  return faces;
 }
 function buildingFaces(b){
  const base=C.terrain(b.x,b.z),top=base+b.h,kind=b.type;
  const colors=kind==='school'?['#e9dfc3','#ccbfa0','#eee3ca']:kind==='tower'?['#759cae','#4a7d96','#6896ac']:kind==='hospital'?['#f1f5eb','#cfddd8','#e8efea']:kind==='apartment'?['#e8dec9','#c9bda5','#e2d7c0']:kind==='factory'?['#b8c5b6','#8da396','#adbcaa']:['#eee3c9','#cbbda4','#e7ddc4'];
  let faces=boxFaces(b.x,b.z,base,b.w,b.d,b.h,colors,kind==='home');
  function front(x,z,y,ww,hh,color){faces.push({points:[V(x-ww/2,z,y),V(x+ww/2,z,y),V(x+ww/2,z,y+hh),V(x-ww/2,z,y+hh)],color});}
  function side(x,z,y,dd,hh,color){faces.push({points:[V(x,z-dd/2,y),V(x,z+dd/2,y),V(x,z+dd/2,y+hh),V(x,z-dd/2,y+hh)],color});}
  function windows(rows,cols,color='#7da8b5'){
   const rowH=b.h/(rows+1),windowH=Math.min(.15,rowH*.6),windowW=Math.min(.16,b.w/(cols+1)*.48);
   for(const s of [-1,1])for(let r=0;r<rows;r++){
    for(let c=0;c<cols;c++)front(b.x+(c-(cols-1)/2)*b.w/(cols+.7),b.z+s*(b.d/2+.006),base+rowH*(r+.7),windowW,windowH,color);
    for(let c=0;c<2;c++)side(b.x+s*(b.w/2+.006),b.z+(c-.5)*b.d*.5,base+rowH*(r+.7),Math.min(.14,b.d*.2),windowH,color);
   }
  }
  if(kind==='home'){
   windows(1,2,'#7e9ea6');front(b.x,b.z+b.d/2+.01,base,.15,.31,'#99765a');
   faces.push(...boxFaces(b.x-b.w*.25,b.z-.1,top+.08,.11,.12,.3,['#baaa8e','#968873','#ad9a80']));
  }else if(kind==='school'){
   windows(2,5,'#6e9ea9');faces.push(...boxFaces(b.x,b.z,top,b.w+.05,b.d+.04,.065,['#6f9eaf','#527f96','#82abb8']));
   const tz=b.z+b.d*.2,clockZ=tz+.19;faces.push(...boxFaces(b.x,tz,top+.06,.4,.36,.38,['#eee5ca','#d2c5a5','#eadfc3']));
   const circle=[];for(let i=0;i<20;i++){const a=i/20*Math.PI*2;circle.push(V(b.x+Math.cos(a)*.115,clockZ,top+.27+Math.sin(a)*.115));}faces.push({points:circle,color:'#fcfff8'});
   front(b.x,clockZ+.003,top+.27,.018,.08,'#496d78');front(b.x+.035,clockZ+.004,top+.264,.085,.018,'#496d78');front(b.x,b.z+b.d/2+.01,base,.27,.31,'#65909a');
   faces.push(...boxFaces(b.x-b.w*.36,b.z-.12,top+.07,.025,.025,.56,['#e2e8df','#8eaaa8','#bccfca']));
   faces.push({points:[V(b.x-b.w*.36,b.z-.12,top+.61),V(b.x-b.w*.36+.27,b.z-.12,top+.54),V(b.x-b.w*.36,b.z-.12,top+.46)],color:'#d98d72'});
  }else if(kind==='tower'){
   windows(6,2,'#b1d5e0');faces.push(...boxFaces(b.x,b.z,top,b.w+.04,b.d+.04,.07,['#d3e1e0','#95b1bc','#bacdd2']));
   faces.push(...boxFaces(b.x-.1,b.z-.13,top+.07,.27,.3,.15,['#b0c2c6','#7f9ca9','#a0b6be']));
   for(const s of [-1,1]){front(b.x,b.z+s*(b.d/2+.009),base,.025,b.h,'#d1e0df');side(b.x+s*(b.w/2+.009),b.z,base,.025,b.h,'#c2d8dd');}
   front(b.x,b.z+b.d/2+.015,base,.2,.27,'#315c75');
  }else if(kind==='apartment'){
   windows(4,3,'#7d9da6');faces.push(...boxFaces(b.x,b.z,top,b.w+.04,b.d+.03,.06,['#bcaa88','#9f8f72','#cbbb9a']));
   for(let r=1;r<=4;r++){for(const s of [-1,1])front(b.x,b.z+s*(b.d/2+.013),base+r*b.h/5-.025,b.w*.93,.035,'#bdad8e');}
   front(b.x,b.z+b.d/2+.015,base,.18,.25,'#8a8273');
  }else if(kind==='hospital'){
   windows(2,3,'#8eb7c4');faces.push(...boxFaces(b.x,b.z,top,b.w+.05,b.d+.05,.065,['#e7efe7','#bacfcb','#d8e5df']));
   const y=top+.07;faces.push({points:[V(b.x-.07,b.z-.23,y),V(b.x+.07,b.z-.23,y),V(b.x+.07,b.z+.23,y),V(b.x-.07,b.z+.23,y)],color:'#cd7068'},{points:[V(b.x-.23,b.z-.07,y+.003),V(b.x+.23,b.z-.07,y+.003),V(b.x+.23,b.z+.07,y+.003),V(b.x-.23,b.z+.07,y+.003)],color:'#cd7068'});
   const z=b.z+b.d/2+.015;front(b.x,z,base+b.h*.52,.085,.28,'#cd7068');front(b.x,z+.003,base+b.h*.62,.27,.085,'#cd7068');front(b.x,z,base,.27,.3,'#7fa8b6');
   faces.push(...boxFaces(b.x,b.z+b.d/2+.09,base+.31,.45,.28,.04,['#709bb1','#62869a','#97b2bf']));
  }else if(kind==='market'){
   front(b.x-b.w*.16,b.z+b.d/2+.01,base+.08,b.w*.48,.28,'#92b2b3');front(b.x+b.w*.3,b.z+b.d/2+.01,base,.19,.36,'#739a9d');
   faces.push(...boxFaces(b.x,b.z,top,b.w+.07,b.d+.03,.07,['#83a282','#5e866c','#779a7d']));
   for(let i=0;i<8;i++){const x=b.x-b.w*.55+i*b.w*1.1/8,ww=b.w*1.1/8,z=b.z+b.d/2;faces.push({points:[V(x,z,top-.07),V(x+ww,z,top-.07),V(x+ww,z+.22,top-.18),V(x,z+.22,top-.18)],color:i%2?'#6b987b':'#f0e6c5'});}
  }else if(kind==='factory'){
   windows(1,3,'#789996');faces.push(...boxFaces(b.x+.3,b.z-.1,top,.16,.16,.8,['#d5c9b3','#a79c86','#c6bca7']));
  }else if(kind==='farm'){
   faces=[];const radius=b.w/2,center=base+.12;
   for(let i=0;i<10;i++){const a=Math.PI*i/10,q=Math.PI*(i+1)/10,x1=b.x+Math.cos(a)*radius,x2=b.x+Math.cos(q)*radius,y1=center+Math.sin(a)*b.h,y2=center+Math.sin(q)*b.h;faces.push({points:[V(x1,b.z-b.d/2,y1),V(x2,b.z-b.d/2,y2),V(x2,b.z+b.d/2,y2),V(x1,b.z+b.d/2,y1)],color:i%2?'#c4dcd7':'#a7c9c4'});for(const s of [-1,1])faces.push({points:[V(b.x,b.z+s*b.d/2,base),V(x1,b.z+s*b.d/2,y1),V(x2,b.z+s*b.d/2,y2)],color:'#bad3cc'});}
  }
  return faces;
 }

 function buildingNames(state){
  labelHits=[];if(!state.showBuildingNames)return;
  const size=w<540?11:13, labels=[];
  const order=[...state.buildings].sort((a,b)=>project(a.x,a.z).y-project(b.x,b.z).y);
  ctx.save();ctx.font='700 '+size+'px sans-serif';
  for(const b of order){
   const extra=b.type==='school'?.68:b.type==='home'?.37:b.type==='factory'?.94:.24;
   const base=C.terrain(b.x,b.z), anchor=project(b.x,b.z,Math.max(base+b.h+extra,currentWater+.19));
   const label=root.BuildingModel.TYPES[b.type].name, width=ctx.measureText(label).width+19;
   let left=C.clamp(anchor.x-width/2,3,Math.max(3,w-width-3)), top=anchor.y-20;
   while(labels.some(r=>left<r.x+r.w+3&&left+width+3>r.x&&top<r.y+24&&top+24>r.y))top-=23;
   top=Math.max(2,top);
   const r={x:left,y:top,w:width,h:21,id:b.id};
   labels.push(r);labelHits.push(r);
   const wet=base<currentWater,chosen=b.id===state.movingId;
   if(top<anchor.y-24)line({x:left+width/2,y:top+21},anchor,'#648b9999',1);
   rounded(left,top,width,21,7,chosen?'#fff0d8':wet?'#e7f8ff':'#ffffffed',chosen?'#d28138':wet?'#64a8c3':'#94b9ad');
   text(label,left+width/2,top+15,size,wet?'#166090':'#284f47');
  }
  ctx.restore();
 }
 function treeLayer(x,z,scale,water,under){
  const base=C.terrain(x,z),root=project(x,z,base),top=project(x,z,base+.95*scale),wl=project(x,z,water),sc=camera().scale,rad=sc*.23*scale;
  if(under&&base>=water)return;
  ctx.save();ctx.beginPath();ctx.rect(0,under?wl.y:-h,w,under?h:wl.y+h);ctx.clip();
  if(under)ctx.globalAlpha=.4;
  line(root,top,under?'#7b9f94':'#826b4d',Math.max(2,sc*.055*scale));
  const gr=ctx.createRadialGradient(top.x-rad*.4,top.y-rad*.5,0,top.x,top.y,rad*1.5);
  gr.addColorStop(0,under?'#8cb6a4':'#b4c891');gr.addColorStop(.55,under?'#6a9e92':'#789c5a');gr.addColorStop(1,under?'#4a8e8d':'#386944');ctx.fillStyle=gr;
  for(let i=0;i<4;i++){ctx.beginPath();ctx.arc(top.x+Math.sin(i*2)*rad*.55,top.y+Math.cos(i*2)*rad*.35,rad,0,Math.PI*2);ctx.fill();}
  ctx.restore();
 }
 function drawStructureJobs(jobs,under){
  jobs.sort((a,b)=>a.depth-b.depth);
  for(const j of jobs){
   if(j.tree){treeLayer(j.tree.x,j.tree.z,j.tree.scale,currentWater,under);continue;}
   ctx.save();if(under){ctx.globalAlpha=.54;worldPoly(j.points,j.color);worldPoly(j.points,'#248eac45');}else worldPoly(j.points,j.color,'#36594212');ctx.restore();
  }
 }
 function edgePoints(){
  const edges=[{a:[-6.5,-5],b:[6.5,-5],n:[0,-1]},{a:[6.5,-5],b:[6.5,5],n:[1,0]},{a:[6.5,5],b:[-6.5,5],n:[0,1]},{a:[-6.5,5],b:[-6.5,-5],n:[-1,0]}];
  for(const e of edges)e.near=e.n[0]*Math.sin(angle)+e.n[1]*Math.cos(angle)>0;
  return edges;
 }
 function glassWall(e,front){
  const a=V(e.a[0],e.a[1],-.23),b=V(e.b[0],e.b[1],-.23),at={...a,y:2.15},bt={...b,y:2.15};
  worldPoly([a,b,bt,at],front?'#e6fbff0c':'#d8edf20b',front?'#79adb282':'#9bbfc27d');
  line(worldPoint(at),worldPoint(bt),front?'#91bcc5':'#adcdd0',2);
  if(front){const q1=worldPoint({...a,y:1.9}),q2=worldPoint({...a,y:1.55});line({x:q1.x+9,y:q1.y},{x:q2.x+16,y:q2.y},'#ffffff3b',3);}
 }
 function tankCrossSection(edges,waterOnly=false){
  for(const e of edges.filter(e=>e.near)){
   const n=30,pieces=[],shore=[];
   for(let i=0;i<n;i++){
    const t=i/n,u=(i+1)/n,x1=e.a[0]+(e.b[0]-e.a[0])*t,z1=e.a[1]+(e.b[1]-e.a[1])*t,x2=e.a[0]+(e.b[0]-e.a[0])*u,z2=e.a[1]+(e.b[1]-e.a[1])*u;
    const a=V(x1,z1,Math.max(-.23,C.terrain(x1,z1))),b=V(x2,z2,Math.max(-.23,C.terrain(x2,z2)));
    if(!waterOnly){pieces.push([{...a,y:-.23},{...b,y:-.23},b,a]);continue;}
    const points=W.edgeVolume(a,b,currentWater);if(points.length<3)continue;
    pieces.push(points);
    // The bright meniscus stays exactly at the horizontal water plane.
    const topEdge=W.clip([a,b,{...b,y:currentWater},{...a,y:currentWater}],currentWater);
    const waterPoints=topEdge.filter(p=>Math.abs(p.y-currentWater)<1e-6);if(waterPoints.length>=2)shore.push([waterPoints[0],waterPoints.at(-1)]);
   }
   worldPath(pieces);
   if(waterOnly){const x=(e.a[0]+e.b[0])/2,z=(e.a[1]+e.b[1])/2,p=project(x,z,currentWater),q=project(x,z,-.23),g=ctx.createLinearGradient(p.x,p.y,q.x,q.y);g.addColorStop(0,'rgba(85,190,216,.66)');g.addColorStop(.55,'rgba(52,146,183,.76)');g.addColorStop(1,'rgba(27,108,151,.84)');ctx.fillStyle=g;}else ctx.fillStyle=e.n[0]?'#acb796':'#b8bf9c';
   ctx.fill();for(const [a,b] of shore)line(worldPoint(a),worldPoint(b),'#bdeef5aa',1.3);
  }
 }
 function waterRing(x,z,r,time,alpha=1){
  ctx.beginPath();for(let i=0;i<=32;i++){const a=i/32*Math.PI*2,p=project(x+Math.cos(a)*r,z+Math.sin(a)*r,currentWater+.006);i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y);}ctx.strokeStyle='rgba(224,250,255,'+alpha+')';ctx.lineWidth=1;ctx.stroke();
 }
 function waterSurface(polygons,time,moving){
  worldPath(polygons);const a=available(),g=ctx.createLinearGradient(0,a.y,a.w,a.y+a.h);
  g.addColorStop(0,'rgba(111,206,214,.38)');g.addColorStop(.5,'rgba(62,163,195,.48)');g.addColorStop(1,'rgba(43,132,179,.61)');ctx.fillStyle=g;ctx.fill();
  ctx.save();ctx.clip();
  // Sparse moving highlights are clipped to the water, including the shoreline.
  for(let i=0;i<75;i++){
   const x=-6.3+(i*.75487766%1)*12.6,z=-4.8+(i*.56984029%1)*9.6,t=reduced?0:time*.00032;
   const p=project(x,z,currentWater+.007),q=project(x+.16+Math.sin(i+t)*.07,z+.025,currentWater+.007);
   line(p,q,'rgba(233,253,255,'+(.12+.16*(Math.sin(t+i)*.5+.5))+')',.8);
  }
  const glow=project(4.9,-1,currentWater+.01),gl=ctx.createRadialGradient(glow.x,glow.y,0,glow.x,glow.y,90*zoom);gl.addColorStop(0,'#ffffff27');gl.addColorStop(1,'#ffffff00');ctx.fillStyle=gl;ctx.fillRect(glow.x-100*zoom,glow.y-100*zoom,200*zoom,200*zoom);
  if(moving&&!reduced){for(let i=0;i<3;i++){const phase=(time*.0013+i/3)%1;waterRing(5.8,3.5,.08+phase*.85,time,(1-phase)*.65);}}
  ctx.restore();
 }
 function inlet(time,fluid){
  const base=project(6.8,3.5,-.15),upright=project(6.8,3.5,2.7),bend=project(5.8,3.5,2.7),mouth=project(5.8,3.5,2.48),surface=project(5.8,3.5,currentWater+.02);
  ctx.save();ctx.lineJoin='round';ctx.lineCap='round';ctx.beginPath();ctx.moveTo(base.x,base.y);ctx.lineTo(upright.x,upright.y);ctx.lineTo(bend.x,bend.y);ctx.lineTo(mouth.x,mouth.y);ctx.strokeStyle='#8ca7aa';ctx.lineWidth=Math.max(5,camera().scale*.12);ctx.stroke();ctx.strokeStyle='#dcebea';ctx.lineWidth=Math.max(2,camera().scale*.055);ctx.stroke();
  const handle=project(6.8,3.5,2.19);line({x:handle.x-9,y:handle.y},{x:handle.x+9,y:handle.y},fluid.moving&&fluid.direction>0?'#3d9fbd':'#7c999d',4);
  if(fluid.moving&&fluid.direction>0&&!reduced){
   const g=ctx.createLinearGradient(mouth.x,mouth.y,surface.x,surface.y);g.addColorStop(0,'#b7eff5d9');g.addColorStop(.6,'#5cbfd7ba');g.addColorStop(1,'#c8f8ffdf');
   ctx.beginPath();ctx.moveTo(mouth.x-3,mouth.y);ctx.bezierCurveTo(mouth.x-4+Math.sin(time*.02),mouth.y+(surface.y-mouth.y)*.4,surface.x-4,surface.y-12,surface.x-5,surface.y);ctx.lineTo(surface.x+5,surface.y);ctx.bezierCurveTo(surface.x+4,surface.y-12,mouth.x+3,mouth.y+15,mouth.x+3,mouth.y);ctx.closePath();ctx.fillStyle=g;ctx.fill();line(mouth,surface,'#edffff9a',1.5);
   for(let i=0;i<7;i++){const f=(time*.001+i*.14)%1,p=project(5.8+Math.sin(i*4+time*.003)*f*.18,3.5+Math.cos(i*3)*f*.16,currentWater+.03+Math.sin(f*Math.PI)*.12);ctx.fillStyle='#defaffb3';ctx.beginPath();ctx.arc(p.x,p.y,1.2,0,7);ctx.fill();}
  }
  ctx.restore();
 }

 function liveWaterReadout(state,fluid){
  canvas.dispatchEvent(new CustomEvent('tank-reading',{detail:{
   wet:W.floodAt(currentWater,state.buildings,C.terrain),moving:fluid.moving,
   direction:fluid.direction,level:(currentWater-.06)/.13
  }}));
 }
 // A continuous elevation palette keeps the shoreline readable as water rises.
 const landStops=[[-.25,[142,192,183]],[.06,[221,208,155]],[.3,[199,211,147]],[.74,[173,203,137]],[1.35,[146,185,137]],[2,[123,166,135]]];
 function terrainColor(height){
  const i=landStops.findIndex(stop=>stop[0]>=height);
  if(i<=0)return 'rgb('+landStops[i===0?0:landStops.length-1][1].join(',')+')';
  const [low,a]=landStops[i-1],[high,b]=landStops[i],t=(height-low)/(high-low);
  return 'rgb('+a.map((v,k)=>Math.round(v+(b[k]-v)*t)).join(',')+')';
 }
 function seaScene(state,time){
  const target=.06+state.water*.13;
  if(lastRequestedWater!==target){waterMotion=W.motion(currentWater,target,time,reduced);lastRequestedWater=target;}
  const fluid=W.sample(waterMotion,time);currentWater=fluid.height;hitTiles=[];

  moving=fluid.moving;
  const shadow=project(0,0,-.87);ctx.save();ctx.translate(shadow.x,shadow.y);
  ctx.scale(camera().scale*8.8,camera().scale*2.7);
  const shade=ctx.createRadialGradient(0,0,.1,0,0,1);
  shade.addColorStop(0,'#365f714a');shade.addColorStop(.7,'#365f7121');shade.addColorStop(1,'#365f7100');
  ctx.fillStyle=shade;ctx.fillRect(-1,-1,2,2);ctx.restore();
  const edges=edgePoints();for(const e of edges.filter(e=>!e.near))glassWall(e,false);
  const base=boxFaces(0,0,-.57,13,10,.34,['#a1b8ad','#789c91','#94ada2']);base.sort((a,b)=>faceDepth(a.points)-faceDepth(b.points));for(const f of base)worldPoly(f.points,f.color);
  tankCrossSection(edges);
  const triangles=[],surface=[],step=.5,underJobs=[],aboveJobs=[];
  for(let x=-6.5;x<6.5;x+=step)for(let z=-5;z<5;z+=step){
   const p=[V(x,z,C.terrain(x,z)),V(x+step,z,C.terrain(x+step,z)),V(x+step,z+step,C.terrain(x+step,z+step)),V(x,z+step,C.terrain(x,z+step))];
   for(const points of [[p[0],p[1],p[2]],[p[0],p[2],p[3]]]){const elev=points.reduce((s,p)=>s+p.y,0)/3,road=Math.abs(z+.25-1.1)<.31||Math.abs(x+.25-.1)<.29;triangles.push({points,elev,road,depth:faceDepth(points)});const water=W.surface(points,currentWater);if(water.length>=3)surface.push(water);}
   hitTiles.push({points:p.map(worldPoint),x:x+.25,z:z+.25,elev:C.terrain(x+.25,z+.25),depth:faceDepth(p)});
  }
  triangles.sort((a,b)=>a.depth-b.depth);hitTiles.sort((a,b)=>a.depth-b.depth);

  ctx.lineWidth=.64;
  for(const t of triangles){
   const color=t.road&&t.elev>.1?'#b1bec0':terrainColor(t.elev);
   worldPoly(t.points,color,color);
  }
  for(let x=-6.25;x<6;x+=.78){
   const z=1.25;if(C.terrain(x,z)<.15)continue;
   line(project(x,z,C.terrain(x,z)+.008),project(x+.24,z,C.terrain(x+.24,z)+.008),'#f3f4de',Math.max(1,camera().scale*.028));
  }
  for(let z=-4.7;z<4.7;z+=.8){
   const x=.25;if(Math.abs(z-1.25)<.45)continue;
   line(project(x,z,C.terrain(x,z)+.008),project(x,z+.22,C.terrain(x,z+.22)+.008),'#f3f4de',Math.max(1,camera().scale*.028));
  }
  for(const b of state.buildings)for(const f of buildingFaces(b)){
   const under=W.clip(f.points,currentWater),above=W.clip(f.points,currentWater,true);
   if(under.length>=3)underJobs.push({points:under,color:f.color,depth:faceDepth(under)});
   if(above.length>=3)aboveJobs.push({points:above,color:f.color,depth:faceDepth(above)});
  }
  for(let i=0;i<32;i++){const x=-5.5+(i%7)*.72,z=-3.8+Math.floor(i/7)*1.05;if((x<-2.9||z<-3.1)&&!state.buildings.some(b=>Math.abs(b.x-x)<b.w/2+.2&&Math.abs(b.z-z)<b.d/2+.2)){const j={tree:{x,z,scale:.75+(i%3)*.16},depth:project(x,z).depth};underJobs.push(j);aboveJobs.push(j);}}
  drawStructureJobs(underJobs,true);waterSurface(surface,time,fluid.moving&&fluid.direction>0);drawStructureJobs(aboveJobs,false);
  tankCrossSection(edges,true);for(const e of edges.filter(e=>e.near))glassWall(e,true);
  // A visible water column, tank-wall waterline and ruler communicate height.
  const rulerx=-6.54,rulerz=4.9;line(project(rulerx,rulerz,0),project(rulerx,rulerz,1.6),'#557b68',2);
  for(let i=0;i<=10;i++){const p=project(rulerx,rulerz,i*.13+.06);line({x:p.x-4,y:p.y},{x:p.x+4,y:p.y},'#557b68',1);if(i%2===0)text(String(i),p.x-11,p.y+3,9,'#53705b','right');}
  const wp=project(rulerx,rulerz,currentWater);line({x:wp.x-10,y:wp.y},{x:wp.x+10,y:wp.y},'#cb8150',2);inlet(time,fluid);buildingNames(state);liveWaterReadout(state,fluid);
 }
 function inside(p,points){let c=false;for(let i=0,j=points.length-1;i<points.length;j=i++){if(((points[i].y>p.y)!==(points[j].y>p.y))&&(p.x<(points[j].x-points[i].x)*(p.y-points[i].y)/(points[j].y-points[i].y)+points[i].x))c=!c;}return c;}

 function draw(time){
  frame=0;if(!appState||!w||!h)return;
  cameraCache={cx:w*.49,cy:h*.5+Math.min(w/17.7,h/11.6)*1.05,scale:Math.min(w/17.7,h/11.6)*zoom,cos:Math.cos(angle),sin:Math.sin(angle)};
  ctx.clearRect(0,0,w,h);seaScene(appState,time);
  if(moving)schedule();
 }
 function pickBuilding(p){
  const label=[...labelHits].reverse().find(r=>p.x>=r.x&&p.x<=r.x+r.w&&p.y>=r.y&&p.y<=r.y+r.h);
  if(label)return label.id;
  const front=[...appState.buildings].sort((a,b)=>project(b.x,b.z).depth-project(a.x,a.z).depth);
  return front.find(b=>buildingFaces(b).some(f=>inside(p,f.points.map(worldPoint))))?.id;
 }
 canvas.addEventListener('pointerdown',e=>{
  if(activePointer||e.button!==0)return;
  activePointer={id:e.pointerId,x:e.clientX,y:e.clientY,drag:0};canvas.setPointerCapture(e.pointerId);
 });
 canvas.addEventListener('pointermove',e=>{
  const p=activePointer;if(!p||p.id!==e.pointerId)return;
  const dx=e.clientX-p.x;p.drag+=Math.abs(dx)+Math.abs(e.clientY-p.y);
  if(appState.tool==='orbit'){angle+=dx*.008;schedule();}
  p.x=e.clientX;p.y=e.clientY;
 });
 canvas.addEventListener('pointerup',e=>{
  const active=activePointer;if(!active||active.id!==e.pointerId)return;
  activePointer=null;if(active.drag>12||appState.tool==='orbit')return;
  const rect=canvas.getBoundingClientRect(),p={x:e.clientX-rect.left,y:e.clientY-rect.top};
  const tile=[...hitTiles].reverse().find(t=>inside(p,t.points));
  const building=pickBuilding(p);
  canvas.dispatchEvent(new CustomEvent('tank-tap',{detail:{tile,building}}));
 });
 canvas.addEventListener('pointercancel',()=>{activePointer=null;});
 function scaleBy(by){zoom=C.clamp(zoom+by,.65,1.65);schedule();}
 canvas.addEventListener('wheel',e=>{e.preventDefault();scaleBy(-e.deltaY*.001);},{passive:false});
 resize();
 return {
  dispose(){observer.disconnect();cancelAnimationFrame(frame);appState=null;},
  set(state){appState=state;schedule();},
  reset(){angle=.55;zoom=1;schedule();},
  zoom:scaleBy,
  settled(){return !!appState&&Math.abs(.06+appState.water*.13-currentWater)<.000001&&!moving;},
 };
 };
})(window);
