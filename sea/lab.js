(function(root){
  'use strict';
  root.mountSeaLesson=function(host,options){
  const ui=host.shadowRoot||host.attachShadow({mode:'open'});
  ui.replaceChildren(document.getElementById('seaLessonTemplate').content.cloneNode(true));
  const $ = id => ui.getElementById(id);
  const B=root.BuildingModel, C=root.Curriculum, tank=root.createCoastalTank($('tank'));
  const paths = {
    bulb:'<path d="M9 18h6m-5 3h4M8.6 15.5C8.2 13.5 5 12.1 5 8.5a7 7 0 0 1 14 0c0 3.6-3.2 5-3.6 7z"/>',
    book:'<path d="M3 4.5c3.5-1 6.5-.5 9 1.3 2.5-1.8 5.5-2.3 9-1.3v14c-3.5-1-6.5-.6-9 1.2-2.5-1.8-5.5-2.2-9-1.2zM12 6v13"/>',
    tag:'<path d="M3 4h8.5L21 13.5 13.5 21 3 10.5z"/><circle cx="7.5" cy="8" r="1"/>',
    hand:'<path d="M8 14V8a1.6 1.6 0 0 1 3.2 0v4-8a1.6 1.6 0 0 1 3.2 0v8-5a1.6 1.6 0 0 1 3.2 0v6-3a1.6 1.6 0 0 1 3.2 0v5c0 4.5-2.5 7-7 7-2.7 0-4-1.2-5.5-3l-4.5-5.2a1.8 1.8 0 0 1 2.6-2.2z"/>',
    minus:'<path d="M5 12h14"/>',plus:'<path d="M5 12h14M12 5v14"/>',fit:'<path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/>',
    pulse:'<path d="M2 13h4l3-7 5 13 3-9 2 3h3"/>',
    drop:'<path d="M12 2.5c-2.1 3.7-7 8.1-7 12a7 7 0 0 0 14 0c0-3.9-4.9-8.3-7-12zM8 15c.3 1.5 1 2.3 2.6 2.6"/>',
    village:'<path d="m2 11 5-4 5 4m-9 0v9h8v-9m2-1V4h7v16h-6m2-13h1m-1 4h1m-1 4h1"/>',
    undo:'<path d="m8 4-5 5 5 5M4 9h9.5a6.5 6.5 0 0 1 0 13" transform="translate(0 -1)"/>',
    orbit:'<path d="M5 8C-1 11 2 15 10 16s16-3 11-6M18 6l3 4 1-4"/><path d="m8 8 4-2 4 2v5l-4 2-4-2z"/>',
    move:'<path d="M12 2v20M2 12h20m-13-7 3-3 3 3m-6 14 3 3 3-3M5 9l-3 3 3 3m14-6 3 3-3 3"/>',
    note:'<path d="M13 4H5v17h14v-9m-9 4 3-1 8-8-2.5-2.5-8 8z"/>',reset:'<path d="M3 10a9 9 0 1 1 1 7m-1-14v7h7"/>',
    close:'<path d="m6 6 12 12M18 6 6 18"/>',ice:'<path d="m2 18 7-13 5 8 3-5 5 10zM7 10l2 1 2-2M2 21h20"/>',
    sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v3m0 14v3M2 12h3m14 0h3M5 5l2 2m10 10 2 2M5 19l2-2M17 7l2-2"/>'
  };
  function icons(root=ui) {
    root.querySelectorAll('i[data-icon]').forEach(i => {
      i.setAttribute('aria-hidden','true');
      i.innerHTML='<svg viewBox="0 0 24 24">'+paths[i.dataset.icon]+'</svg>';
    });
  }
  const N=root.SeaNotebook, data=options.data;
  const state=data;
  let tool='orbit',movingId=null;
  if(!state.firstScene&&!state.runs.length)state.firstScene=N.capture(state.water,state.buildings);
  const scenes=()=>N.allScenes(state);
  const history=[];
  let hideToast=0,storageWarned=false;
  function announce(message) {
    clearTimeout(hideToast);$('toast').textContent=message;$('toast').classList.add('show');
    hideToast=setTimeout(()=>$('toast').classList.remove('show'),2400);
  }
  function save() {
    if(!options.save()&&!storageWarned){storageWarned=true;announce('이 기기에서는 자동 저장할 수 없어요. 탐구 노트를 그림으로 저장하세요.');}
  }
  function render(){
    $('level').value=state.water;$('level').style.setProperty('--val',state.water*10+'%');
    $('target').textContent=state.water+'단계';$('level').setAttribute('aria-valuetext',state.water+'단계');
    $('less').disabled=state.water<=0;$('more').disabled=state.water>=10;$('total').textContent=state.buildings.length;
    $('tank').dataset.mode=tool;
    $('nameToggle').setAttribute('aria-pressed',state.showBuildingNames);
    $('orbit').setAttribute('aria-pressed',tool==='orbit');$('move').setAttribute('aria-pressed',tool==='move');
    ui.querySelectorAll('[data-building]').forEach(b=>b.setAttribute('aria-pressed',tool==='place'&&state.selected===b.dataset.building));
    $('hint').textContent=tool==='orbit'?'손가락으로 밀어 마을을 돌려 보세요.':tool==='place'?B.TYPES[state.selected].name+' 모형을 놓을 땅을 눌러요.':movingId?'선택한 건물을 옮길 땅을 눌러요.':'옮길 건물이나 건물 이름을 눌러요.';
    $('undo').disabled=!history.length;
    $('removeLast').disabled=!state.buildings.length;
    const n=scenes().length;
    $('recordTip').textContent=n<2?'처음 장면은 노트에 담았어요. 물 높이를 바꾼 뒤 다음 장면을 기록해요.':'탐구 노트에서 기록한 '+n+'개 장면을 골라 비교해요.';
    tank.set({...state,tool,movingId});
  }
  function setLevel(value){
    state.water=C.clamp(Math.round(value),0,10);save();render();$('record').disabled=!tank.settled();
  }
  function setTool(nextTool, building) {
    tool=nextTool;movingId=null;if(building){state.selected=building;save();}render();
  }
  function rememberLayout(){history.push(state.buildings.map(b=>({...b})));if(history.length>40)history.shift();}
  function start(){
    $('buildings').innerHTML=B.PLACEABLE.map(type=>'<button class="building" data-building="'+type+'" title="'+B.TYPES[type].description+'" aria-pressed="false">'+B.preview(type)+'<span>'+B.TYPES[type].name+'</span></button>').join('');
    icons();render();
  }
  $('tank').addEventListener('tank-reading',({detail})=>{
    $('currentLevel').textContent=detail.moving?Number(detail.level.toFixed(1)):state.water;
    $('wetCount').textContent=detail.wet;$('record').disabled=detail.moving;
  });
  $('tank').addEventListener('tank-tap',({detail:{tile,building}})=>{
    if(tool==='move'&&!movingId){
      if(building){movingId=building;render();}else announce('먼저 옮길 건물을 눌러요.');
      return;
    }
    if(!tile){announce('수조 안의 땅을 눌러요.');return;}
    const old=state.buildings.find(b=>b.id===movingId);
    if(!old&&state.buildings.length>=24){announce('건물은 24개까지 놓을 수 있어요.');return;}
    const candidate=B.create(old?.type||state.selected,tile.x,tile.z,old?.id||'b-'+Date.now()+'-'+Math.random().toString(36).slice(2,7));
    if(C.terrain(candidate.x,candidate.z)<.06){announce('처음부터 바다였던 곳이에요. 땅을 골라 주세요.');return;}
    if(state.buildings.some(b=>b.id!==candidate.id&&B.overlaps(b,candidate))){announce('건물이 겹쳐요. 조금 더 넓은 땅을 골라요.');return;}
    rememberLayout();
    if(old){state.buildings=state.buildings.map(b=>b.id===old.id?candidate:b);movingId=null;}
    else state.buildings.push(candidate);
    save();render();announce(candidate.name+(old?' 모형을 옮겼어요.':' 모형을 놓았어요.'));
  });
  const dialog=$('dialog');
  function openDialog(title,html){
    dialog.classList.toggle('notebook-dialog',title==='해수면 탐구 노트');
    $('dialogTitle').textContent=title;$('dialogBody').innerHTML='<div class="dialog-content">'+html+'</div>';
    icons($('dialogBody'));if(!dialog.open)dialog.showModal();$('close').focus();
  }
  const notebook=N.connect({state,scenes,save,openDialog,close:()=>dialog.close(),announce,byId:$,
    openWorksheet:options.openWorksheet,addEvidence:options.addEvidence,complete:options.complete,isComplete:options.isComplete});
  function record(){
    if(!tank.settled())return;
    if(state.runs.length>=100){announce('장면을 100번 기록했어요. 탐구 노트에서 비교할 장면을 골라요.');return;}
    state.runs.push(N.capture(state.water,state.buildings));
    if(!state.notebook.pinned)state.notebook.last=scenes().length-1;
    save();
    render();
    announce('탐구 노트에 기록했어요. 현재 장면 '+scenes().length+'개');
  }
  $('level').oninput=e=>setLevel(Number(e.target.value));$('less').onclick=()=>setLevel(state.water-1);$('more').onclick=()=>setLevel(state.water+1);
  $('buildings').onclick=e=>{const b=e.target.closest('[data-building]');if(b)setTool('place',b.dataset.building);};
  $('move').onclick=()=>setTool('move');$('orbit').onclick=()=>setTool('orbit');
  $('removeLast').onclick=()=>{
    if(!state.buildings.length)return;
    rememberLayout();state.buildings.pop();movingId=null;save();render();
  };
  $('undo').onclick=()=>{if(history.length){state.buildings=history.pop();movingId=null;save();render();announce('마지막 배치 변경을 되돌렸어요.');}};
  $('nameToggle').onclick=()=>{state.showBuildingNames=!state.showBuildingNames;save();render();};
  $('zoomIn').onclick=()=>tank.zoom(.14);$('zoomOut').onclick=()=>tank.zoom(-.14);$('cameraHome').onclick=()=>tank.reset();
  $('openNotes').onclick=notebook.open;$('principle').onclick=options.principle;$('record').onclick=record;
  $('reset').onclick=()=>{
    openDialog('수조를 처음으로 되돌릴까요?','<p>처음 건물 배치와 물 높이 0단계로 돌아가요. 탐구 노트에 적은 내용과 관찰값은 보관해요.</p><div class="actions"><button id="cancelReset" class="subtle">취소</button><button id="confirmReset" class="primary">수조 초기화</button></div>');
    $('cancelReset').onclick=()=>dialog.close();$('confirmReset').onclick=()=>{state.buildings=B.normalize(C.BASE_BUILDINGS);state.water=0;movingId=null;tool='orbit';history.length=0;tank.reset();save();render();dialog.close();};
  };
  $('close').onclick=()=>dialog.close();dialog.setAttribute('aria-labelledby','dialogTitle');
  start();
  save();
  return {data,dispose(){clearTimeout(hideToast);if(dialog.open)dialog.close();tank.dispose();ui.replaceChildren();}};
  };
})(window);
