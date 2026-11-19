(function(root){
 'use strict';
 const LESSONS=[
 {id:'phenomena',no:'01',title:'현상 찾기',question:'어떤 변화가 일어나고 있을까?',pages:'교과서 90~93쪽',mission:'사진과 수치를 근거로 기후 현상의 특징을 설명해요.',minutes:40},
 {id:'actions',no:'02',title:'우리의 행동',question:'우리의 선택이 쌓이면 어떻게 될까?',pages:'교과서 94~95쪽',mission:'마을에서 물건을 눌러 행동을 쌓고, 두 미래를 비교해요.',minutes:40},
 {id:'severity',no:'03',title:'문제의 심각성',question:'세계 곳곳에서는 무슨 일이?',pages:'교과서 96~97쪽',mission:'지도에서 나라를 눌러 피해 사진을 보고, 생활에 생긴 변화를 비교해요.',minutes:40},
 {id:'sea',no:'04',title:'해수면 실험',question:'바닷물이 높아지면 어디가 잠길까?',pages:'교과서 98~99쪽',mission:'수조의 두 장면을 비교하고 해수면 높이 변화가 우리 생활에 미칠 영향을 예상해요.',minutes:40},
 {id:'life',no:'05',title:'생활의 변화',question:'내 하루는 어떻게 달라질까?',pages:'교과서 100~101쪽',mission:'학교·농장·도로·주거의 변화를 연결하여 설명해요.',minutes:40}
 ];
 const WORLDS=[
 {id:'canada',country:'캐나다',year:2021,hazard:'폭염',longitude:-101.9107,latitude:60.324287,title:'더위가 길어지고 큰 산불이 발생했어요.',clues:['폭염이 오래 이어졌어요.','큰 산불이 발생했어요.'],question:'집과 학교 주변에 큰 산불이 생기면 하루가 어떻게 달라질까요?'},
 {id:'china',country:'중국',year:2022,hazard:'가뭄',longitude:106.337289,latitude:32.498178,title:'가뭄이 길어져 강바닥이 드러났어요.',clues:['비가 부족한 기간이 길어졌어요.','강의 물이 줄어들었어요.'],question:'강의 물이 부족하면 농사와 물 사용에 어떤 어려움이 생길까요?'},
 {id:'nigeria',country:'나이지리아',year:2022,hazard:'홍수',longitude:7.50322,latitude:9.439799,title:'심한 홍수로 많은 사람이 피해를 입었어요.',clues:['마을과 생활 공간에 물이 들어왔어요.','많은 주민이 피해를 입었어요.'],question:'집과 도로가 잠기면 어떤 도움이 먼저 필요할까요?'},
 {id:'germany',country:'독일',year:2021,hazard:'폭설',longitude:9.678348,latitude:50.961733,title:'심한 폭설로 도시의 교통이 마비되었어요.',clues:['많은 눈이 쌓였어요.','이동이 어려워졌어요.'],question:'버스와 물건을 나르는 차가 멈추면 어떤 일이 이어질까요?'},
 {id:'brazil',country:'브라질',year:2022,hazard:'한파',longitude:-49.55945,latitude:-12.098687,title:'심한 한파로 농작물이 피해를 입었어요.',clues:['강한 추위가 찾아왔어요.','옥수수 등 농작물이 피해를 입었어요.'],question:'작물이 추위에 상하면 농부와 시장에 어떤 영향이 있을까요?'},
 {id:'india',country:'인도',year:2023,hazard:'폭염',longitude:79.358105,latitude:22.686852,title:'전기가 부족해 냉방 기기 사용이 어려웠어요.',clues:['폭염이 오래 이어졌어요.','전기가 부족해 냉방 기기를 쓰기 어려웠어요.'],question:'더운 날 전기를 충분히 쓸 수 없다면 누가 특히 힘들까요?'}
 ];
 const PLACES=[
 {id:'school',name:'학교·운동장',x:-2.2,z:-2.1,icon:'school',effects:{heat:['뜨거워진 운동장','실외 활동 중단','체육 수업과 놀이 장소 변경'],drought:['학교에서 쓸 물 부족','물 사용 시간 조절','급식·청소 방법 변경'],flood:['통학로 침수','등교가 어려워짐','안전한 길 확인·수업 일정 조정'],snow:['눈이 쌓인 통학로','미끄러짐·버스 지연','제설과 안전한 등교 방법 필요'],cold:['수도 시설이 얼 수 있음','물 사용·난방의 어려움','시설 점검과 보온 필요'],night:['밤에도 식지 않는 더위','잠을 충분히 자기 어려움','다음 날 집중과 활동에 영향']}},
 {id:'farm',name:'농장·먹거리',x:-3.4,z:2.4,icon:'leaf',effects:{heat:['오래 이어지는 더위','작물이 잘 자라지 못함','수확과 먹거리 공급에 영향'],drought:['농업용수 부족','작물이 마르고 수확 감소','농부의 생활과 먹거리 공급에 영향'],flood:['밭과 비닐하우스 침수','농작물 피해','수확·운반 일정 변경'],snow:['비닐하우스 위에 쌓인 눈','시설 파손 위험','작물 재배와 수확에 영향'],cold:['강한 추위','작물이 얼거나 상함','수확량과 농가 생활에 영향'],night:['밤에도 계속되는 고온','작물의 생장에 영향','재배 관리 방식 변화']}},
 {id:'road',name:'도로·시장',x:.1,z:1.6,icon:'car',effects:{heat:['뜨거운 낮의 도로와 거리','야외에서 일하기 어려움','운반·작업 시간 조정'],drought:['물 공급 부족','가게와 시설의 물 사용 제한','영업과 생활 방식 조정'],flood:['도로와 다리 침수','버스·물건 운반 중단','이동과 먹거리 공급 차질'],snow:['도로에 깊게 쌓인 눈','차량 이동과 운반 지연','제설·안전한 이동 필요'],cold:['도로 결빙','미끄러짐과 이동 위험','교통 안전과 시설 관리 필요'],night:['밤에도 높은 기온','야외 작업자의 휴식 어려움','작업·휴식 시간 조정']}},
 {id:'home',name:'주택·해안',x:2.5,z:-.8,icon:'home',effects:{heat:['집 안에 쌓이는 더위','건강과 냉방의 부담','그늘·환기·쉼터 등 필요'],drought:['쓸 수 있는 물 감소','씻기·빨래·요리에 영향','물 아끼기와 공급 대책 필요'],flood:['집과 생활 공간 침수','가재도구 피해·대피','안전한 주거와 복구 필요'],snow:['눈이 쌓인 지붕과 출입구','출입·시설 이용 어려움','제설과 시설 점검 필요'],cold:['수도관이 얼어 터질 수 있음','물 사용 중단','수리·보온과 이웃 돌봄 필요'],night:['밤 최저기온이 높음','수면과 휴식의 어려움','안전한 냉방과 이웃 돌봄 필요']}}
 ];
 const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
 function terrain(x,z){return Math.max(-.25,.33+(3.5-x)*.14+.09*Math.sin(z*1.1)+.15*Math.cos(x*.8)- (Math.abs(z+.25*x)<.42?.25:0));}
 const BASE_BUILDINGS=[{id:'school',x:-2.2,z:-2.1,w:1.45,d:.8,h:.68,type:'school',name:'학교'},{id:'market',x:-.3,z:2,w:.75,d:.7,h:.7,type:'market',name:'시장'},{id:'house1',x:2.5,z:-.8,w:.65,d:.68,h:.7,type:'home',name:'해안 주택'},{id:'house2',x:1.2,z:-2.2,w:.7,d:.65,h:.65,type:'tower',name:'빌딩'},{id:'house3',x:-.3,z:-2.2,w:.65,d:.65,h:.62,type:'hospital',name:'병원'},{id:'factory',x:1.3,z:-3.9,w:1.2,d:.75,h:.75,type:'factory',name:'공장'},{id:'greenhouse',x:-3.5,z:2.1,w:1.1,d:.65,h:.5,type:'farm',name:'비닐하우스'}];
 function floodState(level,buildings=BASE_BUILDINGS){const water=.06+clamp(Number(level)||0,0,10)*.13;const items=buildings.map(b=>({...b,ground:terrain(b.x,b.z),flooded:terrain(b.x,b.z)<water}));return {water,items,flooded:items.filter(b=>b.flooded).length,total:items.length};}
 function sanitizeEvents(a){return root.ClimateActions.clean(a);}
 function score(events){const e=sanitizeEvents(events);if(!e.length)return {mine:.36,base:.36,direction:'same',gas:1,baseGas:1};const mine=root.ClimateActions.simulate(e).at(-1),base=root.ClimateActions.simulate(e,true).at(-1);return {mine:clamp(.26+mine.warmth*.16,0,1),base:clamp(.26+base.warmth*.16,0,1),direction:mine.gas>base.gas+.001?'higher':mine.gas<base.gas-.001?'lower':'same',gas:mine.gas,baseGas:base.gas};}
 const api={LESSONS,WORLDS,PLACES,terrain,BASE_BUILDINGS,floodState,score,clamp};root.Curriculum=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
