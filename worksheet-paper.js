(function (root) {
  'use strict';

  const width = 1240, height = 1754, margin = 88, right = width - margin, bottom = 1610;
  const family = '"Noto Sans KR", "Noto Sans CJK KR", "Malgun Gothic", sans-serif';
  const styles = {
    title:{font:'700 33px ' + family, step:51, ink:'#163c34'},
    answer:{font:'400 31px ' + family, step:51, ink:'#233b37'},
    fact:{font:'400 29px ' + family, step:47, ink:'#284f47'},
    source:{font:'400 24px ' + family, step:39, ink:'#536b63'},
    continued:{font:'600 24px ' + family, step:41, ink:'#536b63'},
    blank:{step:62}
  };

  function wrap(ctx, text, max) {
    const lines = [];
    for (const para of String(text).replace(/\r\n?/g,'\n').split('\n')) {
      const chars = Array.from(para);
      if (!chars.length) lines.push('');
      for (let at = 0; at < chars.length;) {
        let lo = 1, hi = Math.min(192, chars.length - at);
        while (lo < hi) {
          const mid = Math.ceil((lo + hi) / 2);
          if (ctx.measureText(chars.slice(at, at + mid).join('')).width <= max) lo = mid;
          else hi = mid - 1;
        }
        let take = lo;
        if (at + take < chars.length) {
          for (let j = take; j > take * 0.6; j--) {
            if (/\s/.test(chars[at + j - 1])) { take = j; break; }
          }
        }
        lines.push(chars.slice(at, at + take).join('').trimEnd());
        at += take;
      }
    }
    return lines;
  }

  function plan(ctx, sheet) {
    const pages = [], bodyWidth = right - margin - 25;
    ctx.font = '500 26px ' + family;
    const group = sheet.group ? sheet.group + '모둠' : '모둠 __________';
    const identity = wrap(ctx, group + '　　이름 ' + (sheet.name.trim() || '________________'), right - margin);
    let page, y;
    function newPage() {
      page = {ops:[]};
      pages.push(page);
      y = (pages.length === 1 ? 328 : 207) + 36 * identity.length;
    }
    function lines(type, text, max = bodyWidth) {
      ctx.font = styles[type].font;
      return wrap(ctx, text, max).map(text => ({type, text}));
    }
    function put(op) {
      page.ops.push({...op, y});
      y += styles[op.type].step;
    }

    newPage();
    for (const row of sheet.rows) {
      const title = (row.kind === 'evidence' ? '담은 증거 · ' : '') + row.label;
      const heads = lines('title', title);
      let body = [];
      if (row.kind === 'answer') {
        body = row.text.trim() ? lines('answer', row.text) : [{type:'blank'}, {type:'blank'}];
      } else {
        for (const line of row.lines) body.push(...lines('fact', line));
        if (!body.length && row.hint) body.push(...lines('source', row.hint), {type:'blank'});
        if (row.source) body.push(...lines('source', '출처 · ' + row.source));
      }
      const needed = heads.length * styles.title.step + body.slice(0,2).reduce((n,op) => n + styles[op.type].step,0);
      if (page.ops.length && y + needed > bottom) newPage();
      heads.forEach((op,i) => put({...op, accent:i === 0}));
      for (const op of body) {
        if (y + styles[op.type].step > bottom) {
          newPage();
          let label = lines('continued', title + ' (이어서)')[0].text;
          if (label.length < title.length) label = label.trimEnd() + '…';
          put({type:'continued',text:label});
        }
        put(op);
      }
      y += 34;
    }
    return {sheet, identity, pages};
  }

  function draw(ctx, documentPlan, index) {
    const {sheet, identity, pages} = documentPlan;
    function text(value, x, y, font, fill) {
      ctx.font = font + ' ' + family;
      ctx.fillStyle = fill;
      ctx.fillText(value, x, y);
    }
    function rule(y, stroke, x = margin) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(right,y); ctx.stroke();
    }
    ctx.fillStyle = '#ffffff'; ctx.fillRect(0,0,width,height);
    ctx.fillStyle = sheet.color; ctx.fillRect(0,0,width,15);
    text('우리 마을 기후 탐구실  /  학생 탐구 기록지', margin,83,'700 24px',sheet.color);
    ctx.textAlign = 'right';
    text(sheet.pages, right,83,'500 24px','#52665d');
    ctx.textAlign = 'left';
    if (index === 0) {
      text('탐구 ' + sheet.no + '　' + sheet.title, margin,172,'700 62px','#143e34');
      text(sheet.question,margin,236,'500 35px',sheet.color);
    } else {
      text('탐구 ' + sheet.no + '　' + sheet.title,margin,149,'700 37px','#143e34');
    }
    identity.forEach((s,i) => text(s,margin,(index === 0 ? 296 : 191) + i*36,'500 26px','#42554e'));
    rule((index === 0 ? 318 : 204) + (identity.length-1)*36,'#c6d5cd');
    for (const op of pages[index].ops) {
      const x = margin + 24;
      if (op.type === 'blank') { rule(op.y+35,'#cfd9d2',x); continue; }
      if (op.accent) { ctx.fillStyle = sheet.color; ctx.fillRect(margin,op.y-24,6,29); }
      ctx.font = styles[op.type].font;
      ctx.fillStyle = styles[op.type].ink;
      ctx.fillText(op.text,x,op.y);
    }
    rule(1658,'#d8e1da');
    text('4학년 과학  ·  기후 변화와 우리 생활',margin,1708,'500 24px','#58685f');
    ctx.textAlign = 'right'; text((index+1) + ' / ' + pages.length + '쪽',right,1708,'700 24px',sheet.color); ctx.textAlign = 'left';
  }

  // Each A4 page contains its Korean text as drawn by the device, including handwriting blanks.
  function pdf(jpegPages) {
    const enc = new TextEncoder(), parts = [], offsets = [0];
    let length = 0;
    function add(part) {
      const bytes = typeof part === 'string' ? enc.encode(part) : part;
      parts.push(bytes); length += bytes.length;
    }
    function start(id) { offsets[id] = length; add(id + ' 0 obj\n'); }
    function end() { add('endobj\n'); }
    add('%PDF-1.4\n'); add(new Uint8Array([37,226,227,207,211,10]));
    start(1); add('<< /Type /Catalog /Pages 2 0 R >>\n'); end();
    start(2);
    add('<< /Type /Pages /Count ' + jpegPages.length + ' /Kids [' + jpegPages.map((_,i) => (3+i*3)+' 0 R').join(' ') + '] >>\n'); end();
    jpegPages.forEach((bytes,i) => {
      const id = 3+i*3;
      start(id); add('<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Resources << /XObject << /Paper ' + (id+1) + ' 0 R >> >> /Contents ' + (id+2) + ' 0 R >>\n'); end();
      start(id+1);
      add('<< /Type /XObject /Subtype /Image /Width ' + width + ' /Height ' + height + ' /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ' + bytes.length + ' >>\nstream\n');
      add(bytes); add('\nendstream\n'); end();
      const paint = 'q\n595.28 0 0 841.89 0 0 cm\n/Paper Do\nQ\n';
      start(id+2); add('<< /Length ' + paint.length + ' >>\nstream\n' + paint + 'endstream\n'); end();
    });
    const xref = length;
    add('xref\n0 ' + offsets.length + '\n0000000000 65535 f \n');
    for (const offset of offsets.slice(1)) add(String(offset).padStart(10,'0') + ' 00000 n \n');
    add('trailer\n<< /Size ' + offsets.length + ' /Root 1 0 R >>\nstartxref\n' + xref + '\n%%EOF\n');
    return new Blob(parts, {type:'application/pdf'});
  }

  function canvas() {
    const el = document.createElement('canvas');
    el.width = width; el.height = height;
    return el;
  }
  function blob(canvas, format) {
    return new Promise((resolve,reject) => canvas.toBlob(value => value ? resolve(value) : reject(new Error('기록지 그림을 만들 수 없어요.')), format,0.92));
  }
  root.WorksheetPaper = {width,height,wrap,plan,draw,pdf,canvas,blob};
})(typeof window === 'undefined' ? globalThis : window);
