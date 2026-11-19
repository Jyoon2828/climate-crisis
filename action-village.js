(function (root) {
  'use strict';

  // Anchor each place to the same village photograph, independent of the viewport.
  const stations = {
    waste: {
      place:'가게', x:40, y:65, question:'어떤 컵으로 마실까요?',
      more:['일회용 컵 쓰기','새 컵을 만들고, 쓴 컵을 처리하는 데 에너지가 들어요.'],
      less:['내 물병 다시 쓰기','같은 물병을 오래 쓰면 새로 만들고 버릴 컵이 줄어요.']
    },
    fridge: {
      place:'집 안 주방', x:55, y:52, question:'냉장고 문을 어떻게 쓸까요?',
      more:['문 오래 열어 두기','따뜻한 공기가 들어와 안을 다시 식히는 데 전기가 더 필요해요.'],
      less:['꺼내고 바로 닫기','문을 짧게 열면 안을 다시 식히는 데 쓰는 전기를 아낄 수 있어요.']
    },
    forest: {
      place:'숲', x:12.5, y:25.5, question:'숲의 나무를 어떻게 할까요?',
      more:['나무 베기','자라던 나무가 줄어들면 숲이 흡수하는 이산화탄소도 줄어들 수 있어요.'],
      less:['묘목 심어 기르기','심은 묘목은 천천히 자라면서 이산화탄소를 흡수해요.']
    },
    factory: {
      place:'공장', x:67.2, y:23, question:'공장에서 연료를 어떻게 쓸까요?',
      more:['연료 더 태우기','같은 물건을 만들 때 화석 연료를 더 태우면 이산화탄소가 더 나와요.'],
      less:['연료 아껴 생산하기','기계에서 새는 열을 줄이면 같은 물건을 만드는 데 연료가 덜 들어요.']
    },
    transport: {
      place:'도로', x:29.5, y:84, question:'가까운 곳에 무엇을 타고 갈까요?',
      more:['자동차로 가기','휘발유 자동차가 달리면 연료를 태우면서 이산화탄소가 나와요.'],
      less:['자전거로 가기','가까운 길을 자전거로 가면 자동차 연료를 아낄 수 있어요.']
    },
    power: {
      place:'학교', x:25, y:40, question:'빈 교실의 불을 어떻게 할까요?',
      more:['불 켜 두기','빈 교실에 불을 켜 두면 아무도 쓰지 않는 전등에도 전기가 들어가요.'],
      less:['불 끄기','교실을 비울 때 불을 끄면 조명에 필요한 전기를 아낄 수 있어요.']
    }
  };

  function actionName(event,topics) {
    const topic=topics[event.topic],high=event.level>0;
    return event.source==='village'?stations[topic.id][high?'more':'less'][0]:topic[high?'high':'low'];
  }
  function recordLines(events,topics) {
    const totals=topics.map(()=>new Map());
    for(const event of events){
      const byName=totals[event.topic],name=actionName(event,topics);
      byName.set(name,(byName.get(name)||0)+1);
    }
    return totals.flatMap((byName,i)=>byName.size?
      [stations[topics[i].id].place+' · '+Array.from(byName,([name,n])=>name+' '+n+'회').join(' / ')]:[]);
  }

  // Small props share the photograph's coordinate system. The notebook keeps the exact counts.
  function makeMapProps(layer) {
    const props={};
    function groupOf(name,positions) {
      props[name]=positions.map(([x,y,width])=>{
        const img=document.createElement('img');
        img.alt='';img.draggable=false;img.hidden=true;img.className='av-map-prop av-prop-'+name;
        img.src='assets/actions/map-'+name+'.webp';
        Object.assign(img.style,{left:x+'%',top:y+'%',width:width+'%'});
        layer.append(img);return img;
      });
    }
    groupOf('cup',[[42.3,64.6,1.8],[44,64.6,1.75],[45.8,64.2,1.75]]);
    groupOf('bottle',[[47,64.1,1.45]]);
    groupOf('stump',[[7.7,32.8,4.5],[11,32.7,4.3],[5.1,31.8,3.7]]);
    groupOf('sapling',[[13.2,32.9,4.4],[15.8,31.6,4.1],[10.3,30.2,3.9]]);
    groupOf('car',[[48.5,67,6.5]]);
    groupOf('bike',[[48.5,67,5.7]]);
    const exhaust=layer.querySelector('.av-exhaust'),windows=layer.querySelector('.av-windows'),kitchen=layer.querySelector('.av-kitchen');
    function count(name,n){props[name].forEach((node,i)=>{node.hidden=i>=n;});}
    function paint(counts,last,focus) {
      count('cup',counts.waste.high);count('bottle',counts.waste.low);
      count('stump',counts.forest.high);count('sapling',counts.forest.low);
      count('car',last.transport===1?1:0);count('bike',last.transport===-1?1:0);
      exhaust.hidden=last.factory===undefined;
      exhaust.style.setProperty('--av-fuel',last.factory===1?Math.min(.68,.36+counts.factory.high*.06):.18);
      windows.hidden=last.power===undefined;windows.classList.toggle('lit',last.power===1);
      kitchen.hidden=focus!=='fridge'||last.fridge===undefined;
      if(!kitchen.hidden)kitchen.src='assets/actions/fridge-'+(last.fridge===1?'more':'less')+'.webp';
    }
    function animate(id,level) {
      const kinds={transport:['car','bike'],waste:['cup','bottle'],forest:['stump','sapling']};
      if(!kinds[id])return;
      const name=kinds[id][level===1?0:1];
      const object=props[name].filter(node=>!node.hidden).at(-1);
      if(!object)return;
      object.classList.remove('av-moving');
      void object.offsetWidth;
      object.classList.add('av-moving');
    }
    return {paint,animate};
  }

  function mount(host, {topics, icons, pick, perform, notify}) {
    const places = topics.map(topic => stations[topic.id]);
    const get = selector => host.querySelector(selector);
    const picture = (topic,level) => 'assets/actions/'+topics[topic].id+'-'+(level>0?'more':'less')+'.webp';
    const pins = places.map((site,i) =>
      '<button type="button" class="av-pin" data-station="'+i+'" style="left:'+site.x+'%;top:'+site.y+'%">'+
        '<span class="av-pin-face"><i class="av-pin-dot"></i><strong>'+site.place+'</strong><small hidden></small></span></button>'
    ).join('');
    const cards = [1,-1].map(level =>
      '<button type="button" class="av-choice" data-do="'+level+'">'+
        '<span class="av-art"><img alt="" draggable="false"></span><span class="av-choice-label"></span>'+
        '<span class="av-choice-count"></span></button>'
    ).join('');
    host.innerHTML =
      '<header class="av-header"><div><small>02　우리의 행동 · 교과서 94~95쪽</small><h1>마을에서 행동해 봐요</h1></div>'+
        '<div class="av-tools"><button type="button" data-action-prediction>'+icons.book+'<span>예상 쓰기</span></button>'+
        '<button type="button" data-action-tab="history">쌓인 행동</button><button type="button" class="av-future" data-action-tab="future">두 미래 비교</button></div></header>'+
      '<div class="av-work"><section class="av-map-card" aria-labelledby="av-map-heading">'+
        '<div class="av-map-head"><h2 id="av-map-heading"><span class="av-step">1</span>마을에서 장소를 골라요</h2><span class="av-total">전체 행동 <b></b>회</span></div>'+
        '<div class="av-stage"><div class="av-image-frame"><img class="av-village-image" src="assets/village.webp" width="1672" height="941" alt="숲과 학교, 집과 가게, 도로와 공장이 있는 해안 마을" draggable="false">'+
        '<div class="av-map-props" aria-hidden="true"><span class="av-exhaust" hidden><i></i><i></i><i></i></span><span class="av-windows" hidden><i></i><i></i><i></i><i></i></span><img class="av-kitchen" alt="" hidden></div>'+
        '<div class="av-pins" role="group" aria-label="마을의 여섯 장소">'+pins+'</div><div class="av-echo" aria-hidden="true" hidden></div></div></div>'+
        '<div class="av-result"><span class="av-result-icon" aria-hidden="true"></span><div><strong class="av-result-title"></strong><p class="av-result-text"></p></div></div></section>'+
      '<section class="av-station" aria-labelledby="av-question"><div class="av-station-head"><span class="av-step">2</span><span class="av-location"></span></div>'+
        '<h2 id="av-question"></h2><p class="av-hint" id="av-touch-hint">물건 그림을 톡 누르거나 지도의 노란 표시로 옮겨요.</p>'+
        '<div class="av-choices" role="group" aria-labelledby="av-question" aria-describedby="av-touch-hint">'+cards+'</div>'+
        '<div class="av-station-foot"><button type="button" class="av-cause" data-action-cause>기후와 어떤 관계일까요?</button>'+
        '<button type="button" class="av-undo" data-undo-action>마지막 행동 취소</button></div></section></div>'+
      '<div class="av-ghost" aria-hidden="true" hidden><img alt=""></div><div class="av-sr" role="status" aria-live="polite" aria-atomic="true"></div>';

    const stage=get('.av-stage'), frame=get('.av-image-frame'), echo=get('.av-echo'), ghost=get('.av-ghost');
    const mapProps=makeMapProps(get('.av-map-props'));
    const pinButtons=[...host.querySelectorAll('[data-station]')], choices=[...host.querySelectorAll('[data-do]')];
    let topic=0, maximum=false, previousTopic=-1, drag=null, suppressClick=null, echoTimer=0;
    function fitMap() {
      const {width,height}=stage.getBoundingClientRect();
      if(!width||!height)return;
      // Crop only the margins, so that the six landmarks stay reachable even on a short screen.
      const aspect=1672/941, imageWidth=Math.min(Math.max(width,height*aspect),width*(width<600?1:1.10),height*aspect*1.04);
      frame.style.width=imageWidth+'px';
      frame.style.height=imageWidth/aspect+'px';
    }
    new ResizeObserver(fitMap).observe(stage);
    function stopEcho() {
      clearTimeout(echoTimer);echo.hidden=true;echo.replaceChildren();
    }
    function showAction(index,level,total) {
      const site=places[index],key=level>0?'more':'less';
      stopEcho();
      mapProps.animate(topics[index].id,level);
      echo.className='av-echo av-echo-'+topics[index].id+' av-'+key;
      echo.style.left=site.x+'%';echo.style.top=site.y+'%';
      if(topics[index].id==='fridge'){
        const object=document.createElement('img');
        object.src=picture(index,level);object.alt='';echo.append(object);
      }
      const plus=document.createElement('b');plus.textContent='+1';
      echo.append(plus);echo.hidden=false;
      const card=choices[level>0?0:1];
      card.classList.remove('did-act');
      void card.offsetWidth;
      card.classList.add('did-act');
      get('.av-sr').textContent=site.place+'에서 '+site[key][0]+' 한 번. 전체 행동 '+total+'회.';
      echoTimer=setTimeout(stopEcho,1450);
    }
    function update(state) {
      const next=state.topic,site=places[next],t=topics[next],events=state.events;
      if(topic!==next)deactivate();
      topic=next;maximum=events.length>=root.ClimateActions.MAX;
      const counts=root.ClimateActions.counts(events), mine=counts[topic],lastByStation={};
      for(const event of events)lastByStation[topics[event.topic].id]=event.level;
      mapProps.paint(Object.fromEntries(topics.map((item,i)=>[item.id,counts[i]])),lastByStation,t.id);
      get('.av-total b').textContent=events.length;
      pinButtons.forEach((pin,i)=>{
        const n=counts[i].high+counts[i].low;
        pin.setAttribute('aria-pressed',String(i===topic));
        pin.setAttribute('aria-label',places[i].place+' 선택, 행동 '+n+'회');
        const badge=pin.querySelector('small');badge.hidden=!n;badge.textContent=n+'회';
      });
      if(previousTopic!==topic) {
        get('.av-location').innerHTML=icons[t.icon]+' '+site.place;
        get('#av-question').textContent=site.question;
        get('.av-result-icon').innerHTML=icons[t.icon];
        choices.forEach(card=>{
          const level=Number(card.dataset.do),key=level>0?'more':'less';
          const img=card.querySelector('img');img.src=picture(topic,level);
          card.querySelector('.av-choice-label').textContent=site[key][0];
          card.classList.remove('did-act');card.dataset.object=t.id;
        });
        previousTopic=topic;
      }
      const last=events.slice().reverse().find(event=>event.topic===topic);
      choices.forEach(card=>{
        const level=Number(card.dataset.do),key=level>0?'more':'less',n=level>0?mine.high:mine.low;
        card.querySelector('.av-choice-count').textContent='이 행동 '+n+'회';
        card.setAttribute('aria-label',site[key][0]+', 현재 '+n+'회');
        card.classList.toggle('av-last',Boolean(last&&last.level===level));card.disabled=maximum;
      });
      get('.av-undo').disabled=!events.length;
      get('.av-result-title').textContent=last?actionName(last,topics)+' · 이 장소에서 '+(mine.high+mine.low)+'회':'지금은 '+site.place+'에서 행동해요.';
      get('.av-result-text').textContent=last?(last.source==='village'?site[last.level>0?'more':'less'][1]:t[last.level>0?'cause':'lowCause']):'어느 행동을 해 볼까요? 고른 물건이 이곳에서 어떻게 쓰이는지 살펴보세요.';
      get('.av-hint').textContent=maximum?'행동 120회를 모두 기록했어요. 쌓인 행동과 두 미래를 살펴보세요.':'물건 그림을 톡 누르거나 지도의 노란 표시로 옮겨요.';
      fitMap();
    }
    function inTarget(x,y) {
      const pin=pinButtons[topic].getBoundingClientRect(),pad=21;
      return x>=pin.left-pad&&x<=pin.right+pad&&y>=pin.top-pad&&y<=pin.bottom+pad;
    }
    function finishDrag() {
      const done=drag;
      if(!done)return;
      drag=null;ghost.hidden=true;host.classList.remove('av-dragging','av-over-target');
      if(done.button.hasPointerCapture(done.id))done.button.releasePointerCapture(done.id);
      return done;
    }
    function deactivate() {
      finishDrag();stopEcho();suppressClick=null;
      choices.forEach(c=>c.classList.remove('did-act'));
    }
    pinButtons.forEach((pin,i)=>pin.addEventListener('click',()=>{if(!drag)pick(i);}));
    for(const button of choices) {
      const level=Number(button.dataset.do);
      button.addEventListener('click',event=>{
        if((event.detail!==0||event.pointerType)&&suppressClick===button){suppressClick=null;return;}
        if(!maximum)perform(level,topic);
      });
      button.addEventListener('pointerdown',event=>{
        if(maximum||drag||!event.isPrimary||event.button!==0)return;
        suppressClick=null;
        drag={id:event.pointerId,x:event.clientX,y:event.clientY,active:false,button};
        button.setPointerCapture(event.pointerId);
      });
      button.addEventListener('pointermove',event=>{
        const g=drag;if(!g||g.id!==event.pointerId)return;
        if(!g.active&&Math.hypot(event.clientX-g.x,event.clientY-g.y)<10)return;
        if(!g.active) {
          g.active=true;
          ghost.querySelector('img').src=picture(topic,level);
          ghost.hidden=false;host.classList.add('av-dragging');
        }
        ghost.style.transform='translate('+event.clientX+'px,'+event.clientY+'px) translate(-50%,-65%)';
        host.classList.toggle('av-over-target',inTarget(event.clientX,event.clientY));
      });
      button.addEventListener('pointerup',event=>{
        if(!drag||drag.id!==event.pointerId)return;
        const held=finishDrag();
        const moved=held.active||Math.hypot(event.clientX-held.x,event.clientY-held.y)>=10;
        if(!moved)return;
        suppressClick=button;
        if(inTarget(event.clientX,event.clientY)&&!maximum)perform(level,topic);
        else notify('물건을 '+places[topic].place+'의 노란 표시에 놓아 보세요. 그림만 눌러도 돼요.');
      });
      function cancel(event) {
        if(drag&&drag.id===event.pointerId){suppressClick=button;finishDrag();}
      }
      button.addEventListener('pointercancel',cancel);
      button.addEventListener('lostpointercapture',cancel);
    }
    host.addEventListener('keydown',event=>{
      if(event.key==='Escape'&&drag){suppressClick=drag.button;finishDrag();}
    });
    return {update,showAction,deactivate};
  }
  root.ActionVillage={mount,stations,actionName,recordLines};
})(typeof window!=='undefined'?window:globalThis);
