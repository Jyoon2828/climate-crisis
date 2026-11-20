(function (root) {
  'use strict';

  root.openLessonWorksheet = function (options) {
    const {state, id, host, save, open, openAll, esc, storageOK} = options;
    const W = root.LessonWorksheets, P = root.WorksheetPaper;
    let sheet = W.build(id,state), generation = 0, timer, active = true, changed = false, documentPlan;
    const urls = new Map();
    const element = selector => host.querySelector(selector);
    const icon = '<svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 3v12m-5-5 5 5 5-5M4 15v5h16v-5"/></svg>';
    function rowHTML(row, index) {
      const label = esc(row.label);
      if (row.kind === 'answer') {
        return '<label class="ws-answer"><span>' + label + '</span><textarea rows="2" maxlength="' + row.field.limit + '" data-ws-answer="' + index + '" placeholder="내 생각을 적어 보세요.">' + esc(row.text) + '</textarea></label>';
      }
      const source = row.source ? '<small>출처 · ' + esc(row.source) + '</small>' : '';
      return '<section class="ws-fact"><h4>' + (row.kind === 'evidence' ? '담은 증거 · ' : '') + label + '</h4>' +
        (row.lines.length ? '<ul>' + row.lines.map(line => '<li>' + esc(line) + '</li>').join('') + '</ul>' : '<p>' + esc(row.hint || '') + '</p>') + source + '</section>';
    }
    const lessons = root.Curriculum.LESSONS.map(l => '<option value="' + l.id + '"' + (l.id === id ? ' selected' : '') + '>' + l.no + ' ' + l.title + '</option>').join('');
    const groups = Array.from({length:6}, (_,i) => '<option value="' + (i+1) + '"' + (state.group === String(i+1) ? ' selected' : '') + '>' + (i+1) + '모둠</option>').join('');
    host.innerHTML = '<div class="ws-dialog" style="--ws-color:' + sheet.color + '">' +
      '<header class="ws-header"><h2 id="ws-title">내 탐구 기록지</h2><button type="button" class="ws-all">전체 기록 모아 보기</button><button type="button" class="close" data-close aria-label="닫기">×</button></header>' +
      '<div class="ws-identity"><label>탐구 선택<select data-ws-lesson>' + lessons + '</select></label>' +
      '<label>이름 <small>(선택)</small><input data-ws-profile="name" maxlength="60" value="' + esc(state.name) + '" placeholder="내 이름" autocomplete="off"></label>' +
      '<label>모둠 <small>(선택)</small><select data-ws-profile="group"><option value="">선택</option>' + groups + '</select></label></div>' +
      '<div class="ws-scroll"><article class="ws-paper"><header><small>탐구 ' + sheet.no + ' · ' + sheet.pages + '</small><h3>' + esc(sheet.question) + '</h3></header>' +
      sheet.rows.map(rowHTML).join('') + '</article></div>' +
      '<footer class="ws-footer"><div class="ws-save"><button type="button" data-ws-save>기기에 저장</button><small data-ws-status role="status"></small></div>' +
      '<div class="ws-downloads"><small data-ws-format role="status"></small><label class="ws-page" hidden>그림 쪽<select data-ws-page></select></label>' +
      '<a data-ws-png role="link" aria-disabled="true">PNG 다운로드</a><a data-ws-pdf role="link" aria-disabled="true">' + icon + ' PDF 다운로드</a></div></footer></div>';

    const pdfLink = element('[data-ws-pdf]'), pngLink = element('[data-ws-png]');
    const pages = element('[data-ws-page]'), pageLabel = pages.parentElement;
    const status = element('[data-ws-status]'), format = element('[data-ws-format]');
    status.textContent = storageOK ? '적은 내용은 자동 저장돼요.' : '기기 저장이 어려워요. 파일로 받아 두세요.';
    function release(link) {
      const url = urls.get(link);
      link.removeAttribute('href'); link.removeAttribute('download'); link.setAttribute('aria-disabled','true');
      if (url) { URL.revokeObjectURL(url); urls.delete(link); }
    }
    function install(link, file, filename) {
      release(link);
      const url = URL.createObjectURL(file);
      urls.set(link,url); link.download = filename; link.href = url; link.setAttribute('aria-disabled','false');
    }
    async function makePng(token, index, sharedCanvas) {
      const output = sharedCanvas || P.canvas();
      if (!sharedCanvas) P.draw(output.getContext('2d'),documentPlan,index);
      const data = await P.blob(output,'image/png');
      if (!sharedCanvas) { output.width=0; output.height=0; }
      if (active && token === generation && Number(pages.value || 0) === index) {
        install(pngLink,data,W.filename(sheet,'png',documentPlan.pages.length > 1 ? index+1 : 0));
      }
    }
    function failure(token) {
      if (active && token === generation) format.textContent = '파일 준비에 실패했어요. 기기에 저장을 눌러 다시 시도해요.';
    }
    async function prepare(token) {
      let paper;
      try {
        await document.fonts.ready;
        if (!active || token !== generation) return;
        sheet = W.build(id,state);
        paper = P.canvas();
        const ctx = paper.getContext('2d'), plan = P.plan(ctx,sheet);
        documentPlan = plan;
        const count = plan.pages.length;
        const current = Math.min(Number(pages.value || 0),count-1);
        pages.innerHTML = plan.pages.map((_,i) => '<option value="' + i + '">' + (i+1) + '쪽</option>').join('');
        pages.value = String(current); pageLabel.hidden = count === 1;
        pngLink.textContent = count === 1 ? 'PNG 다운로드' : '이 쪽 PNG';
        format.textContent = '전체 ' + count + '쪽';
        const images = [];
        for (let i=0;i<count;i++) {
          if (!active || token !== generation) return;
          P.draw(ctx,plan,i);
          if (i === current) await makePng(token,i,paper);
          images.push(new Uint8Array(await (await P.blob(paper,'image/jpeg')).arrayBuffer()));
        }
        if (!active || token !== generation) return;
        install(pdfLink,P.pdf(images),W.filename(sheet,'pdf'));
      } catch { failure(token); }
      finally { if (paper) {paper.width=0;paper.height=0;} }
    }
    function queue(delay = 0) {
      clearTimeout(timer);
      release(pdfLink); release(pngLink); documentPlan = null;
      const token = ++generation;
      format.textContent = '파일 준비 중…';
      timer = setTimeout(() => prepare(token),delay);
    }
    function persist(explicit) {
      const ok = save();
      status.textContent = ok ? (explicit ? sheet.no + ' 탐구 기록지를 이 기기에 저장했어요.' : '이 기기에 자동 저장했어요.') : '기기 저장이 어려워요. 파일로 받아 두세요.';
    }
    // Keep the row bindings stable even when clearing an older topic removes it from the next export.
    const editorRows = sheet.rows;
    host.oninput = e => {
      const el = e.target, field = el.dataset.wsProfile;
      if (field === 'name' || field === 'group') state[field] = el.value;
      else if (el.dataset.wsAnswer !== undefined) W.write(editorRows[Number(el.dataset.wsAnswer)], el.value, state);
      else return;
      changed = true;
      persist(false); queue(220);
    };
    element('[data-ws-lesson]').onchange = e => { open(e.target.value, true); };
    element('.ws-all').onclick = openAll;
    pages.onchange = () => {
      release(pngLink);
      if (documentPlan) {const token = generation; makePng(token,Number(pages.value)).catch(() => failure(token));}
    };
    element('[data-ws-save]').onclick = () => {persist(true); if (!pdfLink.hasAttribute('href')) queue();};
    queue();
    return function dispose() {
      changed && options.refresh();
      active = false; generation++; clearTimeout(timer);
      release(pdfLink); release(pngLink); host.oninput = null;
    };
  };
})(window);
