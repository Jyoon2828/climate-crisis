(function (root) {
  'use strict';

  const evidenceKind = {phenomena:'case', actions:'actions', severity:'world', sea:'sea', life:'life'};
  const color = {phenomena:'#2b7163', actions:'#446637', severity:'#864c33', sea:'#22687b', life:'#6b537d'};

  function build(id, state) {
    const C = root.Curriculum, sea = root.SeaNotebook, cases = root.CLIMATE_CASES;
    const lesson = C.LESSONS.find(item => item.id === id);
    if (!lesson) throw new Error('알 수 없는 탐구예요.');
    const evidence = state.evidence.filter(e => e.kind === evidenceKind[id] || (!e.kind && e.id.startsWith(evidenceKind[id] + '-')));
    const rows = [];
    const has = key => Boolean(state.notes[key]?.trim());
    function answer(label, key, owner = state.notes, limit = 3000, pin = false) {
      rows.push({kind:'answer', label, text:owner[key] || '', field:{owner, key, limit, pin}});
    }
    function fact(label, lines, hint) {
      rows.push({kind:'fact', label, lines:lines.filter(Boolean), hint});
    }
    if (id === 'phenomena') {
      let selected = cases.filter(c => has('phenomena_' + c.id) || has('limits_' + c.id) || evidence.some(e => e.id === 'case-' + c.id));
      if (!selected.length || state.view === id) selected = cases.filter(c => selected.includes(c) || c.id === state.hazard);
      for (const c of selected) {
        answer(c.name + ' · 사진이나 수치에서 무엇을 발견했나요?', 'phenomena_' + c.id);
        answer(c.name + ' · 이 자료만으로 알기 어려운 점은 무엇인가요?', 'limits_' + c.id);
      }
    } else if (id === 'actions') {
      answer('내가 고른 행동이 계속되면 어떻게 될까요?', 'action_prediction');
      const events = state.events, more = events.filter(e => e.level > 0).length;
      const lines = [];
      if (events.length) {
        lines.push('전체 ' + events.length + '회 · 온실가스를 늘리는 선택 ' + more + '회 · 줄이는 선택 ' + (events.length - more) + '회');
        lines.push(...root.ActionVillage.recordLines(events, root.ClimateModel.TOPICS));
        const direction = C.score(events).direction;
        lines.push('모형에서 기준 마을과 비교한 온실가스 누적량 · ' + ({higher:'더 많음',lower:'더 적음',same:'같음'})[direction]);
      }
      fact('마을에서 내가 한 행동', lines, '마을에서 행동하면 선택한 물건과 횟수가 여기에 모여요.');
      answer('두 미래를 비교하니 어떤 차이가 보였나요?', 'action_observation');
    } else if (id === 'severity') {
      const seen = C.WORLDS.filter(c => state.worldSeen.includes(c.id));
      if (seen.length) fact('지도에서 살펴본 곳', seen.map(c => c.country + ' · ' + c.year + '년 ' + c.hazard));
      let selected = C.WORLDS.filter(c => has('world_' + c.id) || evidence.some(e => e.id === 'world-' + c.id));
      if (!selected.length || state.view === id) selected = C.WORLDS.filter(c => selected.includes(c) || c.id === state.world);
      for (const c of selected) answer(c.country + ' · ' + c.hazard + ' 때 어떤 생활이 어려워졌나요?', 'world_' + c.id);
      answer('우리나라에서 찾은 사례는 무엇인가요?', 'korea_case');
    } else if (id === 'sea') {
      const lab = state.seaLab, n = lab.notebook, pair = sea.selectedPair(lab);
      answer('처음 예상 · 어디부터 잠길까요?', 'prediction', lab);
      fact('비교한 장면의 물 높이와 건물', sea.comparisonLines(lab), '수조에서 물 높이를 바꾸고 장면을 기록해 보세요.');
      answer('실험하며 무엇을 관찰했나요?', 'observation', lab);
      const question = n.condition ? '해수면 높이가 ' + n.condition + ' 우리 생활은 어떻게 달라질까요?' : '해수면 높이가 달라지면 우리 생활은 어떻게 될까요?';
      answer(question, 'effect', n, 500, true);
      answer('그렇게 예상한 근거는 무엇인가요?', 'evidence', n, 500, true);
      sea.investigations.forEach((q, i) => {
        const a = n.questions[i];
        if (a.before || a.after || (i === 3 && n.custom)) {
          fact('더 탐구하기 · ' + (i === 3 && n.custom ? n.custom : q.title),
            [a.before && '시험 전 예상 · ' + a.before, a.after && '시험 결과 · ' + a.after]);
        }
      });
      const others = pair.all.flatMap((run, i) => i === pair.first || i === pair.last ? [] : ['장면 ' + (i + 1) + ' · ' + sea.sceneSummary(run)]);
      for (const [key, a] of Object.entries(n.answers)) {
        if (key === pair.key || (!a.water && !a.wet)) continue;
        const [first, last] = key.split('-').map(Number);
        if (pair.all[first] && pair.all[last]) others.push('장면 ' + (first + 1) + '과 ' + (last + 1) + ' · ' + [a.water, a.wet].filter(Boolean).join(' · '));
      }
      if (others.length) fact('함께 기록한 다른 장면', others);
    } else if (id === 'life') {
      const places = cases.flatMap(c => C.PLACES.map(p => ({c, p, key:'life_' + c.id + '_' + p.id})));
      let selected = places.filter(v => has(v.key) || evidence.some(e => e.id === 'life-' + v.c.id + '-' + v.p.id));
      if (!selected.length || state.view === id) selected = places.filter(v => selected.includes(v) || (v.c.id === state.hazard && v.p.id === state.place));
      for (const {c, p, key} of selected) answer(c.name + ' · ' + p.name + '에서 내 하루는 어떻게 달라질까요?', key);
      answer('피해를 줄이기 위해 우리가 할 수 있는 일은 무엇인가요?', 'life_response');
    }
    for (const e of evidence) rows.push({kind:'evidence',label:e.title,lines:[e.text],source:e.source});
    return {...lesson, color:color[id], name:state.name, group:state.group, rows};
  }

  function write(row, value, state) {
    const f = row?.field;
    if (!f) return;
    f.owner[f.key] = value.slice(0, f.limit);
    if (f.pin) state.seaLab.notebook.pinned = true;
  }
  function filename(sheet, ext, page = 0) {
    const clean = s => String(s).normalize('NFC').replace(/[<>:"/\\|?*\u0000-\u001f\u007f\u202a-\u202e\u2066-\u2069]/g, '').trim().replace(/[ .]+$/g, '').replace(/\s+/g, '_');
    const person = clean(sheet.name) || '이름없음';
    return [sheet.no,clean(sheet.title),'탐구기록지',sheet.group && clean(sheet.group) + '모둠',person,
      page ? String(page).padStart(2,'0') + '쪽' : ''].filter(Boolean).join('_') + '.' + ext;
  }

  root.LessonWorksheets = {build, write, filename};
})(typeof window === 'undefined' ? globalThis : window);
