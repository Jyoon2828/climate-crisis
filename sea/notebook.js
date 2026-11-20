(function (root) {
  'use strict';
  const C=root.Curriculum, B=root.BuildingModel;
  const waterChoices=['높아졌다','같다','낮아졌다'];
  const wetChoices=['잠긴 건물이 있다','잠긴 건물이 없다'];
  const conditions=['높아지면','낮아지면'];
  const investigations=[
    {title:'같은 물 높이에서 집을 높은 땅으로 옮기면 어떻게 될까요?',hint:'집의 바닥이 잠긴 장면을 기록해요. 물 높이를 그대로 두고 집만 옮긴 뒤 다시 기록해요.'},
    {title:'우리 마을에서 어느 건물의 바닥이 가장 먼저 잠길까요?',hint:'건물을 그대로 두고 물을 한 단계씩 넣어요. 처음 잠긴 건물의 이름과 그때의 물 높이를 적어 보세요.'},
    {title:'물을 다시 빼면 어떤 건물의 바닥부터 드러날까요?',hint:'여러 건물의 바닥이 잠긴 상태에서 물을 한 단계씩 빼요. 어느 건물의 바닥이 먼저 드러나는지 살펴봐요.'},
    {title:'내가 궁금한 질문',hint:'무엇을 바꾸고 무엇을 관찰할지 정한 뒤 시험해 보세요.'}
  ];
  const text=(v,n=500)=>typeof v==='string'?v.slice(0,n):'';
  const choice=(v,list)=>list.includes(v)?v:'';
  function validRun(r){
    return r && Number.isInteger(r.level)&&r.level>=0&&r.level<=10&&Number.isInteger(r.total)&&r.total>=0&&r.total<=24&&Number.isInteger(r.wet)&&r.wet>=0&&r.wet<=r.total&&typeof r.names==='string';
  }
  function restoreRun(r){
    return {level:r.level,total:r.total,wet:r.wet,names:text(r.names,160),layout:text(r.layout,4800)};
  }
  function capture(level,buildings){
    const f=C.floodState(level,buildings),counts=new Map();
    for(const b of f.items.filter(b=>b.flooded)){
      const name=B.TYPES[b.type].name;
      counts.set(name,(counts.get(name)||0)+1);
    }
    const names=Array.from(counts,([name,n])=>n===1?name:name+' '+n+'개').join(' · ');
    const layout=JSON.stringify(buildings.map(b=>[b.id,b.type,b.x,b.z]));
    return {level,total:f.total,wet:f.flooded,names,layout};
  }
  function restore(raw={}){
    const d=raw||{},answers={};
    for(const [key,value] of Object.entries(d.answers||{})){
      if(/^\d{1,3}-\d{1,3}$/.test(key)&&value)answers[key]={water:choice(value.water,waterChoices),wet:choice(value.wet,wetChoices)};
    }
    const questions=investigations.map((_,i)=>({before:text(d.questions?.[i]?.before),after:text(d.questions?.[i]?.after)}));
    return {first:Number.isInteger(d.first)?d.first:0,last:Number.isInteger(d.last)?d.last:1,answers,pinned:d.pinned===true,
      condition:choice(d.condition,conditions),effect:text(d.effect),evidence:text(d.evidence),extra:Number.isInteger(d.extra)&&investigations[d.extra]?d.extra:-1,
      custom:text(d.custom,140),questions};
  }
  function sceneSummary(r){
    return '물 높이 '+r.level+'단계 · 전체 '+r.total+'개 중 바닥이 잠긴 건물 '+r.wet+'개';
  }
  function pairHint(a,b){
    if(!a||!b)return '';
    if(a.layout&&b.layout&&a.layout!==b.layout){
      return a.level===b.level?'두 장면의 물 높이는 같고 건물 배치가 달라요.':'물 높이와 건물 배치가 모두 달라요. 물 높이의 영향만 보려면 건물을 같은 자리에 두고 비교해요.';
    }
    return '';
  }
  function restoreLab(raw, legacy={}) {
    const current=raw && typeof raw==='object';
    const data=current ? raw : legacy;
    const oldRuns=Array.isArray(legacy.seaRuns) ? legacy.seaRuns : [];
    const runs=current ? (Array.isArray(data.runs) ? data.runs : []) :
      oldRuns.map(r=>r && ({level:r.water,wet:r.flooded,total:r.total,names:'',layout:''}));
    const oldNotes=legacy.notes||{};
    const selected=data.selected||data.selectedBuilding;
    return {
      water:C.clamp(Math.round(Number(data.water)||0),0,10),
      buildings:B.normalize(Array.isArray(data.buildings)?data.buildings:C.BASE_BUILDINGS),
      selected:B.PLACEABLE.includes(selected)?selected:'home',
      showBuildingNames:data.showBuildingNames!==false,
      prediction:text(current?data.prediction:oldNotes.sea_prediction,3000),
      observation:text(current?data.observation:oldNotes.sea_observation,3000),
      firstScene:validRun(data.firstScene)?restoreRun(data.firstScene):null,
      runs:runs.filter(validRun).slice(0,100).map(restoreRun),
      notebook:restore(data.notebook)
    };
  }
  function allScenes(state){
    return state.firstScene?[state.firstScene,...state.runs]:state.runs;
  }
  function selectedPair(state){
    const all=allScenes(state), end=all.length-1, n=state.notebook;
    const first=end>0?C.clamp(n.first,0,end-1):0;
    const last=end>0?C.clamp(n.last,first+1,end):-1;
    return {all,first,last,a:all[first],b:all[last],key:first+'-'+last};
  }
  function wetNames(run){
    return run.names||(run.wet?'이전 기록에 이름 없음':'없음');
  }
  function comparisonLines(state){
    const p=selectedPair(state),n=state.notebook,ans=n.answers[p.key]||{},lines=[];
    if(p.a)lines.push('처음 장면 '+(p.first+1)+' · '+sceneSummary(p.a));
    if(p.b)lines.push('나중 장면 '+(p.last+1)+' · '+sceneSummary(p.b),'나중에 잠긴 건물 · '+wetNames(p.b));
    if(ans.water)lines.push('내가 고른 물 높이 변화 · '+ans.water);
    if(ans.wet)lines.push('내가 관찰한 건물 바닥 · '+ans.wet);
    if(p.a&&p.b&&pairHint(p.a,p.b))lines.push(pairHint(p.a,p.b));
    return lines;
  }
  function reportLines(state){
    const n=state.notebook,p=selectedPair(state),lines=comparisonLines(state);
    if(state.prediction)lines.unshift('처음 예상 · '+state.prediction);
    if(state.observation)lines.push('관찰하며 알게 된 점 · '+state.observation);
    if(n.condition||n.effect)lines.push('생활 영향 예상 · '+(n.condition?'해수면 높이가 '+n.condition+' ':'')+n.effect);
    if(n.evidence)lines.push('예상한 근거 · '+n.evidence);
    investigations.forEach((q,i)=>{
      const a=n.questions[i];
      if(!a.before&&!a.after&&!(i===3&&n.custom))return;
      lines.push('더 탐구하기 · '+(i===3&&n.custom?n.custom:q.title));
      if(a.before)lines.push('시험 전 예상 · '+a.before);
      if(a.after)lines.push('시험 결과 · '+a.after);
    });
    if(p.all.length>2){
      p.all.forEach((run,i)=>{
        if(i!==p.first&&i!==p.last)lines.push('장면 '+(i+1)+' · '+sceneSummary(run));
      });
    }
    return lines;
  }
  function connect({state,scenes,save,openDialog,close,announce,byId,openWorksheet,addEvidence,complete,isComplete}){
    const n=state.notebook;
    let page=0;
    const pair=()=>selectedPair(state);
    function sceneCard(run,index,when,allowSelect,first,last){
      const muted=when==='처음'?'first':'last';
      if(!run)return '<div class="scene-card empty"><strong>나중 장면</strong><p>물 높이를 바꾸고 <b>장면 기록하기</b>를 눌러요.</p><button class="subtle return-sim">마을로 돌아가기</button></div>';
      const all=scenes(),label=when+' 장면';
      let selector='<strong>'+label+'</strong>';
      if(allowSelect){
        const start=muted==='first'?0:first+1,end=muted==='first'?all.length-2:all.length-1;
        let options='';
        for(let i=start;i<=end;i++)options+='<option value="'+i+'"'+(i===index?' selected':'')+'>장면 '+(i+1)+' · '+all[i].level+'단계</option>';
        selector+='<select id="scene-'+muted+'" aria-label="'+label+' 고르기">'+options+'</select>';
      }else selector+='<span class="scene-index">장면 '+(index+1)+'</span>';
      return '<div class="scene-card '+muted+'"><div class="scene-top">'+selector+'</div>'+
        '<div class="level-row"><span class="gauge" aria-hidden="true"><b style="height:'+((run.level+1)/11*100)+'%"></b></span>'+
        '<div><small>물 높이</small><strong>'+run.level+'<em>단계</em></strong></div></div>'+
        '<p class="scene-count">건물 '+run.total+'개 중 <b>'+run.wet+'개</b> 잠김</p><small class="wet-names" id="names-'+muted+'"></small></div>';
    }
    function evidencePanel(p){
      return '<section class="evidence-panel"><h3>내가 기록한 두 장면</h3><div class="scene-pair">'+
        sceneCard(p.a,p.first,'처음',p.all.length>2,p.first,p.last)+sceneCard(p.b,p.last,'나중',p.all.length>2,p.first,p.last)+'</div>'+
        '<p class="pair-tip">'+(pairHint(p.a,p.b)||'건물 바닥이 물에 닿아 잠겼는지 살펴보세요.')+'</p></section>';
    }
    function choices(field,items,selected,disabled=false){
      return '<div class="choice-row">'+items.map((name,i)=>'<button type="button" data-pick="'+field+'" data-index="'+i+'" aria-pressed="'+(selected===name)+'"'+(disabled?' disabled':'')+'>'+name+'</button>').join('')+'</div>';
    }
    function field(id,label,placeholder,rows=2){
      return '<label for="nb-'+id+'">'+label+'</label><textarea id="nb-'+id+'" rows="'+rows+'" maxlength="500" placeholder="'+placeholder+'"></textarea>';
    }
    function observations(p){
      const ans=n.answers[p.key]||{};
      return '<div class="note-grid">'+evidencePanel(p)+'<section class="write-panel"><h3>시뮬레이션 결과</h3>'+
        '<fieldset><legend>두 장면에서 물의 높이는 어떻게 변했나요?</legend>'+choices('water',waterChoices,ans.water,!p.b)+'</fieldset>'+
        '<fieldset><legend>나중 장면에서 건물 바닥은 어떻게 되었나요?</legend>'+choices('wet',wetChoices,ans.wet,!p.b)+'</fieldset>'+
        '<button id="check-results" class="check"'+(!p.b?' disabled':'')+'>관찰값과 맞춰 보기</button><p id="check-msg" class="feedback" role="status"></p></section></div>';
    }
    function impacts(p){
      return '<div class="note-grid">'+evidencePanel(p)+'<section class="write-panel"><h3>우리 생활에 미치는 영향 예상하기</h3>'+
        '<fieldset><legend>해수면 높이가…</legend>'+choices('condition',conditions,n.condition)+'</fieldset>'+
        field('effect','사람들의 생활은 어떻게 달라질까요?','누가, 어디에서, 무엇을 할 때 달라질지 써 보세요.')+
        field('evidence','어느 장면을 보고 그렇게 생각했나요?','내가 본 건물이나 물 높이를 떠올려 써 보세요.')+
        '<details class="help-fold"><summary>생각을 여는 질문</summary><p>아침에 집을 나서서 학교에 갈 때 어떤 길을 지날까요? 물이 그 길까지 차오르면 무엇이 달라질까요?</p></details></section></div>';
    }
    function extra(){
      const opts=investigations.map((q,i)=>'<option value="'+i+'"'+(n.extra===i?' selected':'')+'>'+q.title+'</option>').join('');
      return '<section class="extra-page"><h3>더 알아보고 싶은 질문이 있나요?</h3><label class="sr" for="extra-question">추가 탐구 질문</label><select id="extra-question"><option value="-1">탐구할 질문 고르기</option>'+opts+'</select>'+
        (n.extra<0?'':'<div class="extra-prompt">'+(n.extra===3?'<label for="nb-custom">나의 질문</label><input id="nb-custom" maxlength="140" placeholder="어떤 점이 궁금한가요?">':'')+'<p>'+investigations[n.extra].hint+'</p></div><div class="extra-fields">'+
        field('before','시험하기 전, 내 예상','어떻게 될 것 같나요?')+field('after','시험해 보니','바꾼 것과 실제로 본 결과를 적어요.')+'</div><button class="subtle return-sim">마을에서 시험하기</button>')+
        '<details class="help-fold free-notes"><summary>자유 관찰 메모</summary>'+field('prediction','처음 예상','어디부터 잠길까요?')+field('observation','관찰하며 알게 된 점','더 남기고 싶은 관찰을 적어요.')+'</details></section>';
    }
    function fillField(id,obj,key){
      const el=byId('nb-'+id);if(!el)return;
      if(id==='prediction'||id==='observation')el.maxLength=3000;
      el.value=obj[key];el.oninput=()=>{obj[key]=el.value;if(id==='effect'||id==='evidence')n.pinned=true;save();};
    }
    function show(step,focusPanel=false){
      page=step;
      const p=pair();
      const tabs=['관찰 결과','생활 영향 예상','더 탐구하기'];
      const nav=tabs.map((t,i)=>'<button class="note-tab" aria-current="'+(page===i?'step':'false')+'" data-step="'+i+'"><span>'+['1','2','＋'][i]+'</span>'+t+'</button>').join('');
      const footer='<div class="note-footer"><button id="worksheet" class="subtle">04 기록지 다운로드</button><a id="export" class="subtle" href="#" download="해수면_탐구_노트.png">노트 그림 저장</a><button id="keep-evidence" class="subtle">관찰 증거 담기</button><button id="finish-lesson" class="subtle">'+(isComplete()?'✓ 탐구 완료':'탐구 완료 표시')+'</button>'+
        (page===0?'<button id="next-step" class="primary">생활 영향 예상하기 →</button>':'<button class="primary return-sim">마을로 돌아가기</button>')+'</div>';
      openDialog('해수면 탐구 노트','<nav class="note-tabs" aria-label="탐구 노트 활동">'+nav+'</nav><div id="note-sheet">'+[observations,impacts,extra][page](p)+'</div>'+footer+'<p id="lesson-feedback" class="lesson-feedback" role="status"></p>');
      const body=byId('dialogBody');
      byId('worksheet').onclick=()=>{close();openWorksheet();};
      for(const b of body.querySelectorAll('[data-step]'))b.onclick=()=>show(Number(b.dataset.step),true);
      for(const b of body.querySelectorAll('.return-sim'))b.onclick=close;
      body.querySelectorAll('[data-pick]').forEach(b=>b.onclick=()=>{
        const field=b.dataset.pick,i=Number(b.dataset.index);
        n.pinned=true;
        if(field==='condition')n.condition=conditions[i];
        else {
          if(!p.b)return;
          const answer=n.answers[p.key]||={};
          answer[field]=(field==='water'?waterChoices:wetChoices)[i];
          byId('check-msg').textContent='';
        }
        b.parentElement.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',x===b));
        save();
      });
      for(const side of ['first','last']){
        const run=side==='first'?p.a:p.b;
        const names=byId('names-'+side);
        if(names&&run)names.textContent='잠긴 건물 · '+wetNames(run);
        const select=byId('scene-'+side);
        if(select)select.onchange=()=>{
          n.pinned=true;n[side]=Number(select.value);
          if(side==='first'&&n.last<=n.first)n.last=n.first+1;
          save();show(page);byId('scene-'+side)?.focus();
        };
      }
      if(page===0){
        byId('next-step').onclick=()=>show(1,true);
        byId('check-results').onclick=()=>{
          const ans=n.answers[p.key]||{},msg=byId('check-msg');
          if(!ans.water||!ans.wet){msg.textContent='두 질문에서 관찰한 결과를 하나씩 골라요.';return;}
          const water=p.b.level>p.a.level?waterChoices[0]:p.b.level===p.a.level?waterChoices[1]:waterChoices[2];
          if(ans.water!==water){msg.textContent='두 장면의 물 높이 숫자를 차례로 다시 읽어 보세요.';return;}
          if(ans.wet!==wetChoices[p.b.wet>0?0:1]){msg.textContent='나중 장면의 ‘잠긴 건물’에 몇 개가 적혀 있나요?';return;}
          msg.textContent='두 결과가 관찰값과 맞아요. 이 변화가 누구의 생활에 영향을 줄까요?';
        };
      }else if(page===1){
        fillField('effect',n,'effect');fillField('evidence',n,'evidence');
      }else{
        byId('extra-question').onchange=e=>{n.extra=Number(e.target.value);save();show(2);byId('extra-question').focus();};
        fillField('custom',n,'custom');
        if(n.extra>=0){fillField('before',n.questions[n.extra],'before');fillField('after',n.questions[n.extra],'after');}
        fillField('prediction',state,'prediction');fillField('observation',state,'observation');
      }
      byId('keep-evidence').onclick=()=>{byId('lesson-feedback').textContent=addEvidence();};
      byId('finish-lesson').onclick=()=>{
        complete();byId('finish-lesson').textContent='✓ 탐구 완료';
        byId('lesson-feedback').textContent='통합 탐구 기록지에 완료 표시를 남겼어요.';
      };
      byId('export').onclick=event=>{
        try {
          event.currentTarget.href=exportNote(state,p);
        } catch {
          event.preventDefault();
          const message='그림을 만들지 못했어요. 다시 시도해 주세요.';
          byId('lesson-feedback').textContent=message;
          announce(message);
        }
      };
      if(focusPanel)body.querySelector('[aria-current="step"]').focus();
    }
    return {open:()=>show(page)};
  }
  function exportNote(state,p){
    const n=state.notebook,ans=n.answers[p.key]||{},out=document.createElement('canvas');
    const g=out.getContext('2d'),W=1000,margin=56,maxWidth=W-2*margin,ops=[];
    let y=152;
    function lines(content,font,width){
      g.font=font;
      const result=[];
      for(const para of String(content).trim().replace(/\n{3,}/g,'\n\n').split('\n')){
        let row='';
        for(const ch of para){
          if(row&&g.measureText(row+ch).width>width){result.push(row);row='';}
          row+=ch;
        }
        result.push(row);
      }
      return result;
    }
    function print(line,x,baseline,font,color){
      ops.push(()=>{g.font=font;g.fillStyle=color;g.fillText(line,x,baseline);});
    }
    function block(content,{font='25px sans-serif',color='#193d44',height=37}={}){
      for(const line of lines(content,font,maxWidth)){
        y+=height;print(line,margin,y,font,color);
      }
    }
    function heading(title){
      y+=22;
      const lineY=y;
      ops.push(()=>{g.fillStyle='#c8ddd4';g.fillRect(margin,lineY,maxWidth,2);});
      block(title,{font:'bold 31px sans-serif',color:'#116961',height:49});
    }
    function card(x,label,run){
      const top=y+15,w=(maxWidth-18)/2;
      ops.push(()=>{g.fillStyle='#e8f2ec';g.fillRect(x,top,w,112);});
      print(label,x+18,top+34,'bold 22px sans-serif','#1d6963');
      if(run){
        print('물 높이 '+run.level+'단계',x+18,top+72,'bold 31px sans-serif','#164d56');
        print('건물 '+run.total+'개 중 '+run.wet+'개 잠김',x+18,top+100,'22px sans-serif','#325c5b');
      }else print('기록 전',x+18,top+81,'24px sans-serif','#536c69');
    }
    heading('1. 시뮬레이션에서 관찰한 결과');
    card(margin,'처음 · 장면 '+(p.first+1),p.a);
    card(margin+(maxWidth+18)/2,'나중'+(p.b?' · 장면 '+(p.last+1):''),p.b);
    y+=136;
    if(p.b)block('나중 장면에서 잠긴 건물  '+wetNames(p.b),{font:'22px sans-serif',color:'#395e5c'});
    block('물의 높이  ·  '+(ans.water||'선택 전'));
    block('나중 장면의 건물 바닥  ·  '+(ans.wet||'선택 전'));
    const hint=pairHint(p.a,p.b);
    if(hint)block(hint,{font:'22px sans-serif',color:'#53665e'});
    heading('2. 해수면 높이 변화가 우리 생활에 미치는 영향');
    block(n.condition?'해수면 높이가 '+n.condition+'…':'내가 생각한 생활의 변화',{font:'bold 24px sans-serif',color:'#396765'});
    block(n.effect||'아직 쓰지 않았어요.');
    block('그렇게 예상한 근거',{font:'bold 24px sans-serif',color:'#396765'});
    block(n.evidence||'아직 쓰지 않았어요.');
    const included=investigations.map((q,i)=>({q,i,...n.questions[i]})).filter(r=>r.before||r.after||r.i===n.extra);
    if(included.length){
      heading('더 탐구하기');
      for(const r of included){
        block(r.i===3?(n.custom||r.q.title):r.q.title,{font:'bold 25px sans-serif'});
        block('내 예상  ·  '+(r.before||'작성 전'));block('시험해 보니  ·  '+(r.after||'작성 전'));
      }
    }
    if(state.prediction||state.observation){
      heading('자유 관찰 메모');
      if(state.prediction)block('처음 예상  ·  '+state.prediction);
      if(state.observation)block('알게 된 점  ·  '+state.observation);
    }
    if(p.all.length>2){
      heading('전체 관찰 기록');
      p.all.forEach((r,i)=>{
        block('장면 '+(i+1)+'   '+sceneSummary(r),{font:'23px sans-serif'});
        block('잠긴 건물  '+wetNames(r),{font:'21px sans-serif',color:'#486965',height:30});
      });
    }
    const fullHeight=y+55,scale=Math.min(1,12000/fullHeight);
    out.width=Math.ceil(W*scale);out.height=Math.ceil(fullHeight*scale);g.scale(scale,scale);
    g.fillStyle='#fffef8';g.fillRect(0,0,W,fullHeight);
    g.fillStyle='#174e55';g.fillRect(0,0,W,139);
    g.fillStyle='#bddfd3';g.font='23px sans-serif';g.fillText('4학년 과학   /   기후변화와 우리 생활',margin,47);
    g.fillStyle='#fff';g.font='bold 48px sans-serif';g.fillText('해수면 탐구 노트',margin,111);
    ops.forEach(draw=>draw());
    const png=out.toDataURL('image/png');
    if(!png.startsWith('data:image/png;base64,'))throw new Error('PNG export failed');
    return png;
  }
  root.SeaNotebook={investigations,sceneSummary,capture,restoreLab,allScenes,selectedPair,comparisonLines,reportLines,connect};
})(typeof window!=='undefined'?window:globalThis);
