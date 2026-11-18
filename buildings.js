(function(root){
 'use strict';
 const TYPES={
  home:{name:'집',icon:'home',w:.72,d:.68,h:.57,color:'#c67b5b',description:'낮은 집 · 경사진 빨간 지붕'},
  school:{name:'학교',icon:'school',w:1.7,d:.9,h:.8,color:'#5796ac',description:'넓은 교실동 · 시계탑 · 깃발'},
  tower:{name:'빌딩',icon:'tower',w:.68,d:.72,h:1.8,color:'#548ca9',description:'높은 건물 · 파란 유리벽'},
  apartment:{name:'아파트',icon:'apartment',w:1.1,d:.72,h:1.35,color:'#bba67c',description:'여러 층 · 줄지어 있는 창문'},
  hospital:{name:'병원',icon:'hospital',w:1.22,d:.85,h:.95,color:'#c66a63',description:'하얀 건물 · 빨간 십자 표시'},
  market:{name:'가게',icon:'shop',w:.9,d:.72,h:.55,color:'#649777',description:'큰 쇼윈도 · 줄무늬 차양'},
  factory:{name:'공장',icon:'factory',w:1.2,d:.75,h:.75,color:'#8da396',description:'공장동과 높은 굴뚝'},
  farm:{name:'비닐하우스',icon:'leaf',w:1.1,d:.7,h:.5,color:'#9abfa9',description:'투명한 둥근 지붕'}
 };
 const PLACEABLE=['home','school','tower','apartment','hospital','market'];
 const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
 function create(type,x,z,id){const t=Object.hasOwn(TYPES,type)?TYPES[type]:null;if(!t||!Number.isFinite(x)||!Number.isFinite(z))return null;return {id:typeof id==='string'?id:'building-'+type,x:clamp(x,-6.5+t.w/2,6.5-t.w/2),z:clamp(z,-5+t.d/2,5-t.d/2),w:t.w,d:t.d,h:t.h,type,name:t.name};}
 function normalize(list){if(!Array.isArray(list))return [];return list.slice(0,24).filter(b=>b&&Object.hasOwn(TYPES,b.type)&&Number.isFinite(b.x)&&Number.isFinite(b.z)&&Math.abs(b.x)<=6.5&&Math.abs(b.z)<=5).map((b,i)=>create(b.type,b.x,b.z,typeof b.id==='string'?b.id.slice(0,100):'building-'+i));}
 function overlaps(a,b){return Math.abs(a.x-b.x)<(a.w+b.w)/2+.12&&Math.abs(a.z-b.z)<(a.d+b.d)/2+.12;}
 function preview(type){
  const shapes={
   home:'<path d="m18 45 42-30 42 30" fill="#be7256"/><path d="M27 44h66v39H27Z" fill="#ead9b8"/><path d="M53 59h16v24H53Z" fill="#9d785e"/><path d="M34 54h12v12H34Zm42 0h12v12H76Z" fill="#7ba3aa"/><path d="M80 20h8v20h-8Z" fill="#987d69"/>',
   school:'<path d="M8 42h104v40H8Z" fill="#e6d7af"/><path d="M8 39h104v7H8Z" fill="#5d94ac"/><path d="M47 20h26v62H47Z" fill="#f2e4c7"/><circle cx="60" cy="32" r="8" fill="#fff" stroke="#5d94ac"/><path d="M60 26v6l5 3M24 53h12m-12 14h12m48-14h12m-12 14h12" stroke="#6b9ea6" stroke-width="7"/><path d="M54 67h12v15H54Z" fill="#6c8c88"/><path d="M14 8v29" stroke="#8c9c94" stroke-width="2"/><path d="m15 8 21 6-21 7Z" fill="#ce8a68"/>',
   tower:'<path d="M36 5h47v78H36Z" fill="#568eaa"/><path d="M32 5h55v6H32Z" fill="#c4d8dc"/><path d="M44 18v57m12-57v57m13-57v57M40 26h39M40 42h39M40 58h39" stroke="#b1d6df" stroke-width="3"/><path d="M52 70h16v13H52Z" fill="#31586f"/>',
   apartment:'<path d="M24 14h72v69H24Z" fill="#e1d5bd"/><path d="M20 12h80v7H20Z" fill="#a59172"/><path d="M35 27h10m11 0h10m11 0h10M35 45h10m11 0h10m11 0h10M35 63h10m11 0h10m11 0h10" stroke="#87a4ac" stroke-width="9"/><path d="M29 33h62M29 51h62M29 69h62" stroke="#bba67c" stroke-width="3"/>',
   hospital:'<path d="M17 32h86v51H17Z" fill="#edf3ed"/><path d="M35 18h50v65H35Z" fill="#f9fbf5"/><path d="M55 23h10v25H55Zm-8 8h26v10H47Z" fill="#c66a63"/><path d="M24 54h20m32 0h20" stroke="#83acba" stroke-width="8"/><path d="M48 64h24v19H48Z" fill="#78a6b3"/><path d="M43 61h34" stroke="#699aae" stroke-width="5"/>',
   market:'<path d="M18 37h84v46H18Z" fill="#e5d3b0"/><path d="M14 25h92v14H14Z" fill="#759c77"/><path d="m15 39-6 16h102l-6-16Z" fill="#f6edcd"/><path d="m26 39-3 16h12l1-16m17 0v16h13V39m18 0 3 16h12l-4-16" fill="#649777"/><path d="M25 59h38v19H25Zm48 0h18v24H73Z" fill="#83a9af"/>'
  };
  return '<svg viewBox="0 0 120 90" aria-hidden="true"><ellipse cx="60" cy="83" rx="54" ry="5" fill="#dce7ce"/>'+(shapes[type]||shapes.home)+'</svg>';
 }
 const api={TYPES,PLACEABLE,create,normalize,overlaps,preview};root.BuildingModel=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
