(function(root){
 'use strict';
 const C=root.Curriculum,canvas=document.getElementById('village'),ctx=canvas.getContext('2d'),images={};
 for(const key of ['village','dry','flood','snow']){const im=new Image();im.src='assets/'+key+'.webp';images[key]=im;}
 let w=0,h=0,dpr=1,angle=.45,zoom=1,currentWater=.06,pointer=null,hitTiles=[],appState=null,stamp=0,anim=0;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 function resize(){const r=canvas.getBoundingClientRect();w=r.width;h=r.height;dpr=Math.min(2,devicePixelRatio||1);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);}
 new ResizeObserver(resize).observe(canvas);resize();
 function available(){const mobile=w<=760;return {x:0,y:mobile?148:155,w:mobile?w:Math.max(200,w-(w>1500?430:370)),h:mobile?Math.max(140,h*.57-170):Math.max(200,h-270)};}
 function poly(points,fill,stroke){ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=.65;ctx.stroke();}}
 function rounded(x,y,ww,hh,r,fill,stroke){ctx.beginPath();ctx.roundRect(x,y,ww,hh,r);if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.stroke();}}
 function line(a,b,color,width=1){ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke();}
 function text(t,x,y,size=12,color='#315a47',align='center'){ctx.fillStyle=color;ctx.font='700 '+size+'px sans-serif';ctx.textAlign=align;ctx.fillText(t,x,y);}
 function imageFit(im,x,y,ww,hh,cover=true){if(!im?.complete||!im.naturalWidth)return;const ratio=(cover?Math.max:Math.min)(ww/im.naturalWidth,hh/im.naturalHeight);const dw=im.naturalWidth*ratio,dh=im.naturalHeight*ratio;ctx.drawImage(im,x+(ww-dw)/2,y+(hh-dh)/2,dw,dh);}
 function weatherImage(key,amount,x,y,ww,hh){ctx.save();ctx.beginPath();ctx.rect(x,y,ww,hh);ctx.clip();imageFit(images.village,x,y,ww,hh);const variant=images[key];if(key!=='village'&&variant?.naturalWidth){ctx.globalAlpha=C.clamp(amount,0,1);imageFit(variant,x,y,ww,hh);}else if(key!=='village'){ctx.globalAlpha=.35*amount;ctx.fillStyle=key==='dry'?'#ad8334':key==='flood'?'#779eae':'#ecf3f6';ctx.fillRect(x,y,ww,hh);}ctx.globalAlpha=1;ctx.restore();}
 function photoScene(state,time){const a=available();const mobile=w<=760;let x=0,y=0,ww=w,hh=h;const severity=state.strength/3;
  if(state.view==='actions'&&state.actionTab==='future'){
   const score=C.score(state.events),progress=state.future/100,base=progress*.52,mine=progress*C.clamp(.52*Math.pow(score.gas/score.baseGas,1.8),.09,.99);const gap=mobile?10:18,cardw=(a.w-gap*3)/2,cardh=cardw/1.65;
   y=mobile?186:237;for(let i=0;i<2;i++){x=gap+(cardw+gap)*i;const val=i?mine:base;ctx.save();rounded(x,y,cardw,cardh,14,'#fff');ctx.clip();weatherImage(state.futureHazard==='flood'?'flood':'dry',val,x,y,cardw,cardh);ctx.restore();rounded(x,y,cardw,cardh,14,null,'#ffffffda');}
   return;
  }
  const key=['heat','drought'].includes(state.hazard)?'dry':state.hazard==='flood'?'flood':['snow','cold'].includes(state.hazard)?'snow':'village';
  const amount=state.view==='actions'?0:severity;weatherImage(key,amount,0,0,ww,hh);
  // Keep the whole illustrated village visible, then add the chosen weather.
  if(state.hazard==='night'&&state.view!=='actions'){ctx.fillStyle='rgba(13,30,67,'+(amount*.66)+')';ctx.fillRect(0,0,w,h);ctx.fillStyle='#ffefb2';for(const p of [[.35,.56],[.55,.37],[.72,.33],[.62,.45]]){ctx.globalAlpha=.4+Math.sin(time*.001+p[0]*4)*.1;ctx.fillRect(w*p[0],h*p[1],6,4);}ctx.globalAlpha=1;}
  if(['snow','flood'].includes(state.hazard)&&state.view!=='actions')particles(state.hazard,severity,time);
  // Readable space for the lesson prompt without covering the village.
  const shade=ctx.createLinearGradient(0,0,0,180);shade.addColorStop(0,'#eaf3e6ef');shade.addColorStop(1,'#eaf3e600');ctx.fillStyle=shade;ctx.fillRect(0,0,w,200);
  if(state.view==='actions')actionDetail(state,time);
 }
 function particles(kind,intensity,time){if(reduced)return;ctx.save();ctx.beginPath();ctx.rect(0,130,w,h*.8);ctx.clip();const t=time*.00013;for(let i=0;i<90*intensity;i++){const x=((i*.61803399+t*.3)%1)*w,y=((i*.41421+t*(kind==='snow'?.6:2))%1)*h;ctx.globalAlpha=kind==='snow'?.8:.4;ctx.strokeStyle='#d9edfa';ctx.fillStyle='#fff';if(kind==='snow'){ctx.beginPath();ctx.arc(x,y,1.5+(i%3),0,Math.PI*2);ctx.fill();}else line({x,y},{x:x-5,y:y+15},'#cfe1ef',1);}ctx.restore();}
 function actionDetail(state,time){if(state.actionTab==='future')return;const a=available(),boxw=Math.min(340,a.w-34),boxh=w<=760?130:165,bx=24,by=w<=760?176:216;ctx.save();rounded(bx,by,boxw,boxh,16,'#fbfdf2f7','#ffffffb3');ctx.translate(bx,by);text(root.ClimateModel.TOPICS[state.topic].short,16,25,12,'#517346','left');const recent=state.recent?.topic===state.topic?state.recent:null,elapsed=recent?(performance.now()-recent.at)/1100:10,active=elapsed<1,phase=active?elapsed:0,high=recent?.level>0;const tx=boxw/2,ty=boxh*.69;
  if(state.topic===3){ // Factory: only machine, fuel, and energy motions.
   rounded(tx-66,ty-45,100,55,3,'#d9d8c3');ctx.fillStyle='#788e87';ctx.fillRect(tx+20,ty-76,16,34);ctx.fillStyle='#d89170';for(let i=0;i<4;i++)ctx.fillRect(tx-55+i*21,ty-30,11,18);for(let i=0;i<2;i++){ctx.save();ctx.translate(tx-26+i*37,ty+1);ctx.rotate(active?phase*Math.PI*3:0);ctx.strokeStyle='#4d746a';ctx.lineWidth=4;ctx.beginPath();ctx.arc(0,0,11,0,7);ctx.stroke();for(let j=0;j<8;j++){const q=j*Math.PI/4;line({x:Math.cos(q)*10,y:Math.sin(q)*10},{x:Math.cos(q)*16,y:Math.sin(q)*16},'#4d746a',4);}ctx.restore();}if(active){for(let i=0;i<(high?6:2);i++){const yy=ty-80-(phase+i*.13)%1*42;ctx.fillStyle='#8c9e8a55';ctx.beginPath();ctx.arc(tx+28+Math.sin(i)*8,yy,4+(phase+i*.13)%1*7,0,7);ctx.fill();}}text(high?'연료를 더 사용해요':'에너지 낭비를 줄여요',tx,boxh-9,10);}
  else if(state.topic===2){ctx.fillStyle='#b8a382';ctx.fillRect(tx-65,ty+5,130,6);for(let i=0;i<3;i++){ctx.save();ctx.translate(tx-45+i*45,ty+5);if(active&&high&&i===1)ctx.rotate(phase*1.45);ctx.fillStyle='#876f52';ctx.fillRect(-4,-40,8,40);ctx.fillStyle='#5f8e53';for(let j=0;j<3;j++){ctx.beginPath();ctx.arc((j-1)*9,-45-(j===1?12:0),17,0,7);ctx.fill();}ctx.restore();}if(active&&!high){ctx.fillStyle='#76a45b';ctx.beginPath();ctx.ellipse(tx+70,ty-3-phase*15,8,4,-.7,0,7);ctx.fill();}text(high?'숲의 나무가 줄어요':'기존 숲을 지키고 길러요',tx,boxh-9,10);}
  else if(state.topic===1){rounded(tx-26,ty-65,52,78,5,'#d7e2db','#789285');ctx.fillStyle='#a9bcaf';ctx.fillRect(tx-23,ty-27,46,2);ctx.save();ctx.translate(tx-26,ty-65);const open=active?(high?Math.sin(Math.min(phase*1.5,1)*Math.PI/2):Math.sin(phase*Math.PI)*.5):.05;ctx.scale(1-open*.8,1);rounded(0,0,52,78,4,'#eaf0e8','#829a89');ctx.fillStyle='#93a898';ctx.fillRect(40,18,3,18);ctx.restore();text(high?'문을 오래 열어 두어요':'꺼낼 것을 정해 짧게 열어요',tx,boxh-9,10);}
  else if(state.topic===4){ctx.fillStyle='#9ba59b';ctx.fillRect(tx-100,ty+4,200,12);const move=active?phase*155-75:0;ctx.save();ctx.translate(move,0);if(high||!recent){rounded(tx-34,ty-13,68,20,5,'#cb775e');rounded(tx-19,ty-27,35,17,5,'#d98e71');ctx.fillStyle='#d7e8dd';ctx.fillRect(tx-12,ty-24,22,10);for(const xx of [-21,23]){ctx.fillStyle='#465e54';ctx.beginPath();ctx.arc(tx+xx,ty+9,8,0,7);ctx.fill();}}else{for(const xx of [-24,24]){ctx.beginPath();ctx.arc(tx+xx,ty,15,0,7);ctx.strokeStyle='#4a6b5a';ctx.lineWidth=2;ctx.stroke();}for(const pair of [[-24,0],[24,0]])line({x:tx+pair[0],y:ty},{x:tx,y:ty-25},'#71a068',3);line({x:tx-24,y:ty},{x:tx+24,y:ty},'#71a068',3);line({x:tx+10,y:ty-30},{x:tx+24,y:ty},'#71a068',3);}ctx.restore();text(high?'자동차 연료를 사용해요':'연료를 덜 쓰는 이동을 해요',tx,boxh-9,10);}
  else if(state.topic===0){ctx.fillStyle='#82997b';ctx.fillRect(tx+24,ty-32,35,43);ctx.fillStyle='#597651';ctx.fillRect(tx+20,ty-38,43,7);const counts=root.ClimateActions.counts(state.events)[0];for(let i=0;i<Math.min(counts.high,7);i++){ctx.fillStyle=['#dfae80','#d1c5a3','#a7b3a2'][i%3];rounded(tx-64+(i%4)*20,ty-7-Math.floor(i/4)*14,14,13,2,ctx.fillStyle);}if(active&&high){ctx.fillStyle='#d3b083';ctx.fillRect(tx+34,ty-65+phase*40,12,14);}if(recent&&!high){rounded(tx-52,ty-37,30,43,4,'#a6c4a0','#728f68');ctx.strokeStyle='#7b9d70';ctx.lineWidth=3;ctx.strokeRect(tx-49,ty-45,24,13);}text(high?'생산·처리할 물건이 늘어요':'물건을 오래 사용해요',tx,boxh-9,10);}
  else{rounded(tx-65,ty-62,130,77,5,'#d0d0b5');ctx.fillStyle=active&&!high?'#7e9589':'#f2d88a';for(let i=0;i<3;i++)ctx.fillRect(tx-49+i*37,ty-44,24,29);text(recent&&!high?'빈방의 전기를 꺼요':'필요 없는 전기를 사용해요',tx,boxh-9,10);}
  ctx.restore();
 }
 function camera(){const a=available(),sc=Math.min(a.w/17,a.h/7.8)*zoom;return {cx:a.w*.5,cy:a.y+a.h*.52,scale:sc,cos:Math.cos(angle),sin:Math.sin(angle)};}
 function project(x,z,y=0){const c=camera(),rx=x*c.cos-z*c.sin,rz=x*c.sin+z*c.cos;return {x:c.cx+rx*c.scale,y:c.cy+rz*c.scale*.48-y*c.scale,depth:rz};}
 function quad(x,z,y,ww,dd){return [project(x-ww/2,z-dd/2,y),project(x+ww/2,z-dd/2,y),project(x+ww/2,z+dd/2,y),project(x-ww/2,z+dd/2,y)];}
 function cube(x,z,bottom,ww,dd,hh,colors,roof=true){const p=quad(x,z,bottom,ww,dd),t=quad(x,z,bottom+hh,ww,dd);poly([p[1],p[2],t[2],t[1]],colors[1],'#31553b15');poly([p[2],p[3],t[3],t[2]],colors[2],'#31553b15');poly(t,colors[0],'#ffffff30');if(roof){const r1=project(x,z-dd/2,bottom+hh+.2),r2=project(x,z+dd/2,bottom+hh+.2);poly([t[0],t[3],r2,r1],'#c77f63','#f3c9a633');poly([t[1],t[2],r2,r1],'#b06450');}}
 const W=root.WaterModel;
 let waterMotion=null,lastRequestedWater=null;
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
  if(state.showBuildingNames===false)return;
  const catalog=root.BuildingModel.TYPES,size=w<=760?10:12;
  for(const b of [...state.buildings].sort((a,b)=>project(a.x,a.z).depth-project(b.x,b.z).depth)){
   const extra=b.type==='school'?.68:b.type==='home'?.37:b.type==='factory'?.94:.24;
   const base=C.terrain(b.x,b.z),p=project(b.x,b.z,Math.max(base+b.h+extra,currentWater+.19));
   const label=catalog[b.type]?.name||b.name;ctx.save();ctx.font='700 '+size+'px sans-serif';const width=ctx.measureText(label).width+18;
   rounded(p.x-width/2,p.y-19,width,22,6,'#fcfff8ed','#b8ccbc');text(label,p.x,p.y-4,size,'#3e6453');ctx.restore();
  }
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
  worldPoly([a,b,bt,at],front?'#e6fbff0c':'#d8edf20b',front?'#efffff9c':'#f7ffff70');
  line(worldPoint(at),worldPoint(bt),front?'#f7ffffdd':'#f2ffffa0',2);
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
  const wet=W.floodAt(currentWater,state.buildings,C.terrain),moving=fluid.moving&&Math.abs(waterMotion.to-waterMotion.from)>.0001;
  const set=(id,value)=>{const node=document.getElementById(id);if(node&&node.textContent!==value)node.textContent=value;};
  set('wetBuildings',String(wet));set('floodStatus','침수 건물 '+wet+'개');set('waterStatus',moving?state.water+'단계로 '+(fluid.direction>0?'채우는 중':'물이 빠지는 중'):state.water+'단계 / 10단계');
  set('waterValue',state.water+'단계'+(moving?' · '+(fluid.direction>0?'채우는 중':'물 빼는 중'):''));
  for(const node of document.querySelectorAll('[data-sea-run],[data-evidence="sea"]')){node.disabled=moving;if(moving)node.title='물이 목표 높이에 도달하면 기록할 수 있어요.';else node.removeAttribute('title');}
 }
 function seaScene(state,time){
  const target=C.floodState(state.water,state.buildings).water;
  if(lastRequestedWater!==target){waterMotion=W.motion(currentWater,target,time,reduced);lastRequestedWater=target;}
  const fluid=W.sample(waterMotion,time);currentWater=fluid.height;hitTiles=[];
  const sky=ctx.createLinearGradient(0,0,0,h);sky.addColorStop(0,'#dfebe8');sky.addColorStop(1,'#adcfc6');ctx.fillStyle=sky;ctx.fillRect(0,0,w,h);
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
  for(const t of triangles){const color=t.road?'#c6c9b7':t.elev>1.2?'#91aa7b':t.elev>.7?'#a3b785':t.elev>.3?'#b5bf8e':'#c6c6a4';worldPoly(t.points,color);}
  for(const b of state.buildings)for(const f of buildingFaces(b)){
   const under=W.clip(f.points,currentWater),above=W.clip(f.points,currentWater,true);
   if(under.length>=3)underJobs.push({points:under,color:f.color,depth:faceDepth(under)});
   if(above.length>=3)aboveJobs.push({points:above,color:f.color,depth:faceDepth(above)});
  }
  for(let i=0;i<32;i++){const x=-5.5+(i%7)*.72,z=-3.8+Math.floor(i/7)*1.05;if(x<-2.9||z<-3.1){const j={tree:{x,z,scale:.75+(i%3)*.16},depth:project(x,z).depth};underJobs.push(j);aboveJobs.push(j);}}
  drawStructureJobs(underJobs,true);waterSurface(surface,time,fluid.moving&&fluid.direction>0);drawStructureJobs(aboveJobs,false);
  tankCrossSection(edges,true);for(const e of edges.filter(e=>e.near))glassWall(e,true);
  // A visible water column, tank-wall waterline and ruler communicate height.
  const rulerx=-6.54,rulerz=4.9;line(project(rulerx,rulerz,0),project(rulerx,rulerz,1.6),'#557b68',2);
  for(let i=0;i<=10;i++){const p=project(rulerx,rulerz,i*.13+.06);line({x:p.x-4,y:p.y},{x:p.x+4,y:p.y},'#557b68',1);if(i%2===0)text(String(i),p.x-11,p.y+3,9,'#53705b','right');}
  const wp=project(rulerx,rulerz,currentWater);line({x:wp.x-10,y:wp.y},{x:wp.x+10,y:wp.y},'#cb8150',2);inlet(time,fluid);buildingNames(state);liveWaterReadout(state,fluid);
 }
 function inside(p,points){let c=false;for(let i=0,j=points.length-1;i<points.length;j=i++){if(((points[i].y>p.y)!==(points[j].y>p.y))&&(p.x<(points[j].x-points[i].x)*(p.y-points[i].y)/(points[j].y-points[i].y)+points[i].x))c=!c;}return c;}
 canvas.addEventListener('pointerdown',e=>{if(appState?.view!=='sea')return;pointer={x:e.clientX,y:e.clientY,ox:e.clientX,oy:e.clientY,drag:0};canvas.setPointerCapture(e.pointerId);});
 canvas.addEventListener('pointermove',e=>{if(!pointer)return;const dx=e.clientX-pointer.x;pointer.drag+=Math.abs(dx)+Math.abs(e.clientY-pointer.y);if(appState.seaTool==='orbit')angle+=dx*.008;pointer.x=e.clientX;pointer.y=e.clientY;});
 canvas.addEventListener('pointerup',e=>{if(!pointer)return;const p=pointer;pointer=null;if(p.drag>10||appState.seaTool==='orbit')return;const r=canvas.getBoundingClientRect(),tile=[...hitTiles].reverse().find(t=>inside({x:e.clientX-r.left,y:e.clientY-r.top},t.points));if(tile)root.dispatchEvent(new CustomEvent('village-place',{detail:{x:tile.x,z:tile.z,elev:tile.elev}}));});
 canvas.addEventListener('pointercancel',()=>pointer=null);
 canvas.addEventListener('wheel',e=>{if(appState?.view==='sea'){e.preventDefault();zoom=C.clamp(zoom-e.deltaY*.001,.65,1.6);}},{passive:false});
 function updateLabels(state){const el=document.getElementById('sceneLabels');if(!state||!['life','phenomena'].includes(state.view)){el.innerHTML='';return;}const positions={school:[.32,.40],farm:[.16,.68],road:[.48,.63],home:[.68,.43]};el.innerHTML=C.PLACES.map(p=>{const q=positions[p.id];return '<button class="place-label '+(state.place===p.id?'active':'')+'" data-place="'+p.id+'" style="left:'+q[0]*100+'%;top:'+q[1]*100+'%">'+(root.AppIcons?.[p.icon]||'')+p.name+'</button>';}).join('');}
 function loop(time){anim=requestAnimationFrame(loop);if(time-stamp<(reduced?160:33))return;stamp=time;if(!appState||appState.view==='home')return;ctx.clearRect(0,0,w,h);if(appState.view==='sea')seaScene(appState,time);else if(appState.view==='severity'){}else photoScene(appState,time);}
 requestAnimationFrame(loop);
 root.VillageScene={set(state){appState=state;updateLabels(state);},reset(){angle=.45;zoom=1;},zoom(by){zoom=C.clamp(zoom+by,.65,1.6);},snapshot(){return canvas.toDataURL('image/png');},project};
})(window);
