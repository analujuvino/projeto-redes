/* Segurança em Redes Wi-Fi · navegação e interações do site */
(() => {
  'use strict';

  const deck = document.getElementById('deck');
  const slides = [...document.querySelectorAll('.slide')];
  const total = slides.length;
  let current = 0;

  /* ---------- Ícones (traços no estilo Feather, MIT) ---------- */
  const ICONS = {
    activity: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    warning: '<path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
    lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    'check-circle': '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4 12 14.01l-3-3"/>',
    key: '<circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6"/><path d="m15.5 7.5 3 3L22 7l-3-3"/>',
    verified: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
    lightning: '<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>',
    globe: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>'
  };
  document.querySelectorAll('[data-icon]').forEach(el => {
    el.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[el.dataset.icon] || ''}</svg>`;
  });

  /* ---------- Palco escalável ---------- */
  function fit() {
    const s = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
    deck.style.transform = `scale(${s})`;
  }
  window.addEventListener('resize', fit);
  fit();

  /* ---------- Numeração e menu ---------- */
  slides.forEach((s, i) => {
    const pg = s.querySelector('.pg');
    if (pg) pg.textContent = String(i + 1).padStart(2, '0');
  });
  const list = document.getElementById('menu-list');
  let lastBlock = '';
  slides.forEach((s, i) => {
    if (s.dataset.block !== lastBlock) {
      lastBlock = s.dataset.block;
      const g = document.createElement('li');
      g.className = 'grp';
      g.textContent = lastBlock;
      list.appendChild(g);
    }
    const li = document.createElement('li');
    li.innerHTML = `<button data-go="${i + 1}"><span>${String(i + 1).padStart(2, '0')}</span>${s.dataset.title}</button>`;
    list.appendChild(li);
  });

  /* ---------- Navegação ---------- */
  const timers = new Set();
  function later(fn, ms) { const t = setTimeout(() => { timers.delete(t); fn(); }, ms); timers.add(t); return t; }
  function clearTimers() { timers.forEach(clearTimeout); timers.clear(); }

  function go(n) {
    n = Math.max(0, Math.min(total - 1, n));
    clearTimers();
    slides[current].classList.remove('active');
    current = n;
    const s = slides[current];
    void s.offsetWidth; // reinicia as animações de entrada
    s.classList.add('active');
    document.getElementById('counter').textContent = `${String(n + 1).padStart(2, '0')} / ${total}`;
    document.getElementById('progress-fill').style.width = `${((n + 1) / total) * 100}%`;
    document.querySelectorAll('#menu-list button').forEach((b, i) => b.classList.toggle('cur', i === n));
    document.getElementById('notes-text').textContent = s.querySelector('aside')?.textContent || '';
    document.title = `${String(n + 1).padStart(2, '0')} · ${s.dataset.title} · Segurança em Redes Wi-Fi`;
    if (location.hash !== `#${n + 1}`) history.replaceState(null, '', `#${n + 1}`);
    onEnter(s);
  }
  const next = () => go(current + 1);
  const prev = () => go(current - 1);

  document.getElementById('btn-next').onclick = next;
  document.getElementById('btn-prev').onclick = prev;
  document.addEventListener('click', e => {
    const t = e.target.closest('[data-go]');
    if (!t) return;
    const v = t.dataset.go;
    go(v === 'next' ? current + 1 : parseInt(v, 10) - 1);
    toggle('menu', false);
  });

  /* Painéis: menu, notas, modais */
  const panels = { menu: document.getElementById('menu'), notes: document.getElementById('notes'),
    senha: document.getElementById('modal-senha'), quiz: document.getElementById('modal-quiz') };
  function toggle(name, force) {
    const p = panels[name];
    const open = force ?? !p.classList.contains('open');
    p.classList.toggle('open', open);
    p.setAttribute('aria-hidden', String(!open));
    if (name === 'notes') document.getElementById('btn-notes').classList.toggle('on', open);
    if (name === 'senha' && open) setTimeout(() => document.getElementById('pw').focus(), 50);
    if (name === 'quiz' && open) startQuiz();
  }
  const anyModal = () => panels.senha.classList.contains('open') || panels.quiz.classList.contains('open');
  document.getElementById('btn-menu').onclick = () => toggle('menu');
  document.getElementById('btn-notes').onclick = () => toggle('notes');
  document.getElementById('btn-full').onclick = fullscreen;
  document.addEventListener('click', e => {
    const o = e.target.closest('[data-open]'); if (o) toggle(o.dataset.open, true);
    const c = e.target.closest('[data-close]'); if (c) toggle(c.dataset.close, false);
    if (e.target.classList.contains('modal')) toggle(e.target.id.replace('modal-', ''), false);
  });
  function fullscreen() {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
    else document.exitFullscreen?.();
  }

  document.addEventListener('keydown', e => {
    if (e.target.tagName === 'INPUT') { if (e.key === 'Escape') toggle('senha', false); return; }
    if (e.key === 'Escape') { ['menu', 'senha', 'quiz'].forEach(p => toggle(p, false)); return; }
    if (anyModal()) return;
    if (['ArrowRight', 'PageDown', ' '].includes(e.key)) { e.preventDefault(); next(); }
    else if (['ArrowLeft', 'PageUp'].includes(e.key)) { e.preventDefault(); prev(); }
    else if (e.key === 'Home') go(0);
    else if (e.key === 'End') go(total - 1);
    else if (e.key.toLowerCase() === 'm') toggle('menu');
    else if (e.key.toLowerCase() === 'n') toggle('notes');
    else if (e.key.toLowerCase() === 'f') fullscreen();
  });

  /* Toque: deslizar para os lados */
  let tx = null, ty = null;
  document.addEventListener('touchstart', e => { tx = e.touches[0].clientX; ty = e.touches[0].clientY; }, { passive: true });
  document.addEventListener('touchend', e => {
    if (tx === null || anyModal()) return;
    const dx = e.changedTouches[0].clientX - tx, dy = e.changedTouches[0].clientY - ty;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) (dx < 0 ? next : prev)();
    tx = null;
  });

  /* Esconde os controles quando o mouse fica parado (modo apresentação) */
  let idleT;
  function wake() { document.body.classList.remove('idle'); clearTimeout(idleT); idleT = setTimeout(() => document.body.classList.add('idle'), 2800); }
  ['mousemove', 'keydown', 'touchstart'].forEach(ev => document.addEventListener(ev, wake, { passive: true }));
  wake();

  /* ---------- O que acontece ao entrar em cada slide ---------- */
  function onEnter(s) {
    s.querySelectorAll('[data-term]').forEach(runTerminal);
    s.querySelectorAll('.type-line').forEach(typeLine);
    s.querySelectorAll('.flip.on').forEach(c => c.classList.remove('on'));
  }

  /* Subtítulo da capa digitado letra a letra */
  function typeLine(el) {
    const text = el.dataset.type;
    el.innerHTML = '';
    const spans = [...text].map(ch => { const p = document.createElement('p'); p.className = 'tc'; p.textContent = ch; el.appendChild(p); return p; });
    const cur = document.createElement('div'); cur.className = 'type-cursor'; el.appendChild(cur);
    spans.forEach((p, i) => later(() => { p.style.opacity = 1; el.appendChild(cur); el.insertBefore(cur, spans[i + 1] || null); }, 1000 + i * 60));
    later(() => cur.style.animation = 'blink 1.1s steps(1) 4', 1000 + spans.length * 60);
  }

  /* Terminais: scan da capa e ataque de dicionário */
  const SCRIPTS = {
    scan: [[['t-p', '$ '], ['', 'scan --wifi', true]], [['t-bad', '[!] Cafe_WiFi    aberta   vulnerável']], [['t-ok', '[ok] Casa_Silva  WPA3     protegida']]],
    brute: [[['', '$ ataque --dicionario captura.cap', true]], [['', '[*] lista carregada: 1.000.000 senhas']],
      ...['12345678', 'senha123', 'qwerty2024', 'joaopessoa', 'admin1234', 'cafe2023'].map(p => [['', `testando: ${p.padEnd(12)} ...... falhou`]]),
      [['t-win', '>> SENHA ENCONTRADA: cafe2024']], [['t-info', '[i] senha fraca cai em minutos']]]
  };
  function runTerminal(out) {
    const lines = SCRIPTS[out.dataset.term];
    const loop = out.dataset.term === 'brute';
    out.innerHTML = '';
    const cur = document.createElement('span'); cur.className = 't-cur';
    let t = 900;
    lines.forEach(segs => {
      later(() => {
        const row = document.createElement('div'); out.appendChild(row);
        if (loop) while (out.children.length > 6) out.removeChild(out.firstChild);
        let tt = 0;
        segs.forEach(([cls, txt, typed]) => {
          const sp = document.createElement('span'); sp.className = cls; row.appendChild(sp);
          if (typed) { [...txt].forEach((ch, k) => later(() => { sp.textContent += ch; row.appendChild(cur); }, tt + k * 55)); tt += txt.length * 55; }
          else later(() => { sp.textContent = txt; row.appendChild(cur); }, tt);
        });
      }, t);
      t += segs.some(s => s[2]) ? segs.reduce((a, s) => a + (s[2] ? s[1].length * 55 : 0), 0) + 500 : (loop ? 320 : 500);
    });
    if (loop) later(() => runTerminal(out), t + 3200);
  }

  /* Handshake: botão Simular acende os passos em sequência */
  document.querySelector('[data-action="handshake"]').addEventListener('click', () => {
    const rows = [...document.querySelectorAll('.hs-row')];
    rows.forEach((r, i) => {
      later(() => { rows.forEach(x => x.classList.remove('ping')); r.classList.add('ping'); }, i * 900);
    });
    later(() => rows.forEach(x => x.classList.remove('ping')), rows.length * 900 + 400);
  });

  /* Ataques: o cartão vira e mostra a defesa */
  document.querySelectorAll('.flip').forEach(c => c.addEventListener('click', () => c.classList.toggle('on')));

  /* Evil Twin: simulação de escolha de rede */
  const flow = document.querySelector('.flow');
  const simOut = document.querySelector('.sim-out');
  document.querySelectorAll('.net').forEach(b => b.addEventListener('click', () => {
    flow.classList.remove('attack', 'safe'); void flow.offsetWidth;
    if (b.dataset.net === 'fake') {
      flow.classList.add('attack');
      simOut.className = 'sim-out bad';
      simOut.textContent = 'Você caiu no gêmeo do mal: tudo o que digitar passa pelo atacante primeiro.';
    } else {
      flow.classList.add('safe');
      simOut.className = 'sim-out ok';
      simOut.textContent = 'Rede verdadeira. Mesmo assim: confirme o nome com o café e use VPN.';
    }
  }));

  /* Em casa: checklist com medidor */
  const checks = [...document.querySelectorAll('.check')];
  const fill = document.querySelector('.score .meter-fill');
  const scoreTxt = document.querySelector('.score-txt');
  function score() {
    const n = checks.filter(c => c.getAttribute('aria-pressed') === 'true').length;
    fill.style.width = `${(n / checks.length) * 100}%`;
    fill.style.background = n === checks.length ? '#27E6EC' : n >= 3 ? '#FFC86B' : '#FF6E82';
    scoreTxt.textContent = n === checks.length ? 'Rede blindada: 6/6' : `Sua rede: ${n}/6 itens`;
  }
  checks.forEach(c => c.addEventListener('click', () => {
    c.setAttribute('aria-pressed', String(c.getAttribute('aria-pressed') !== 'true'));
    score();
  }));

  /* Teste de senha (estimativa local, nada sai do navegador) */
  const COMMON = ['123456', '12345678', 'senha', 'password', 'qwerty', 'admin', 'abc123', '111111', 'iloveyou', 'flamengo', 'brasil', 'joaopessoa', 'wifi', 'internet'];
  const pw = document.getElementById('pw');
  pw.addEventListener('input', () => {
    const v = pw.value;
    const verdict = document.getElementById('pw-verdict');
    const time = document.getElementById('pw-time');
    const bar = document.getElementById('pw-fill');
    if (!v) { verdict.textContent = 'Digite algo para ver o resultado.'; verdict.style.color = ''; time.textContent = ''; bar.style.width = '0'; return; }
    let pool = 0;
    if (/[a-z]/.test(v)) pool += 26;
    if (/[A-Z]/.test(v)) pool += 26;
    if (/[0-9]/.test(v)) pool += 10;
    if (/[^a-zA-Z0-9]/.test(v)) pool += 33;
    let bits = v.length * Math.log2(Math.max(pool, 1));
    const low = v.toLowerCase();
    if (COMMON.some(w => low.includes(w))) bits = Math.min(bits, 20);
    if (/^(.)\1+$/.test(v)) bits = Math.min(bits, 8);
    const secs = Math.pow(2, bits) / 2 / 1e10;
    bar.style.width = `${Math.min(100, (bits / 90) * 100)}%`;
    const [label, color] = bits < 40 ? ['Fraca: cairia rápido', '#FF6E82'] : bits < 65 ? ['Média: dá para melhorar', '#FFC86B'] : ['Forte: ataque impraticável', '#2DF2E1'];
    verdict.textContent = label; verdict.style.color = color; bar.style.background = color;
    time.textContent = `Tempo estimado para quebrar: ${human(secs)}.`;
  });
  function human(s) {
    if (s < 1) return 'menos de 1 segundo';
    const u = [['séculos', 3153600000], ['anos', 31536000], ['dias', 86400], ['horas', 3600], ['minutos', 60], ['segundos', 1]];
    for (const [n, d] of u) if (s >= d) { const x = s / d; return x > 1e6 ? `mais de 1 milhão de ${n}` : `${Math.round(x).toLocaleString('pt-BR')} ${n}`; }
    return 'instantes';
  }

  /* Quiz rápido */
  const QUIZ = [
    { q: 'Qual protocolo é o recomendado hoje?', o: ['WEP', 'WPA', 'WPA2', 'WPA3'], a: 3, e: 'O WPA3 usa o SAE, que impede o teste de senhas offline.' },
    { q: 'O que caracteriza um Evil Twin?', o: ['Um vírus no roteador', 'Uma rede falsa com o mesmo nome da verdadeira', 'Uma senha repetida', 'Um cabo grampeado'], a: 1, e: 'O atacante imita o nome da rede, com sinal mais forte, e o tráfego passa por ele.' },
    { q: 'Numa rede pública, o que protege seu tráfego mesmo num Evil Twin?', o: ['Desligar o Bluetooth', 'Usar VPN', 'Aumentar o brilho da tela', 'Esquecer a senha'], a: 1, e: 'A VPN cria um túnel cifrado: o atacante vê só dados embaralhados.' }
  ];
  let qi = 0, hits = 0;
  const qTitle = document.getElementById('quiz-title'), qOpts = document.getElementById('quiz-opts'), qFb = document.getElementById('quiz-fb'), qStep = document.getElementById('quiz-step'), qNext = document.getElementById('quiz-next');
  function startQuiz() { qi = 0; hits = 0; showQ(); }
  function showQ() {
    if (qi >= QUIZ.length) {
      qTitle.textContent = `Você acertou ${hits} de ${QUIZ.length}!`;
      qOpts.innerHTML = ''; qFb.textContent = hits === QUIZ.length ? 'Rede blindada. Obrigado por participar!' : 'Boa! Revise os slides de protocolos e defesa.';
      qStep.textContent = ''; qNext.textContent = 'Recomeçar'; return;
    }
    const item = QUIZ[qi];
    qTitle.textContent = item.q; qFb.textContent = ''; qStep.textContent = `${qi + 1} / ${QUIZ.length}`; qNext.textContent = 'Próxima'; qNext.disabled = true;
    qOpts.innerHTML = '';
    item.o.forEach((txt, i) => {
      const b = document.createElement('button'); b.textContent = txt;
      b.onclick = () => {
        if (qOpts.dataset.done === '1') return;
        qOpts.dataset.done = '1';
        if (i === item.a) hits++; else b.classList.add('wrong');
        qOpts.children[item.a].classList.add('right');
        qFb.textContent = item.e; qNext.disabled = false;
      };
      qOpts.appendChild(b);
    });
    qOpts.dataset.done = '0';
  }
  qNext.onclick = () => { if (qi >= QUIZ.length) startQuiz(); else { qi++; showQ(); } };

  /* Wi-Fi público: rede de pontos que reage ao mouse */
  const cv = document.querySelector('.dots');
  if (cv) {
    const ctx = cv.getContext('2d');
    cv.width = 1920; cv.height = 1080;
    const P = Array.from({ length: 84 }, () => ({ x: Math.random() * 1920, y: Math.random() * 1080, vx: (Math.random() - .5) * .5, vy: (Math.random() - .5) * .5, r: 1.8 + Math.random() * 2.4, p: Math.random() < .25 }));
    let mx = -9999, my = -9999;
    cv.parentElement.addEventListener('mousemove', e => {
      const r = deck.getBoundingClientRect(), s = r.width / 1920;
      mx = (e.clientX - r.left) / s; my = (e.clientY - r.top) / s;
    });
    cv.parentElement.addEventListener('mouseleave', () => { mx = my = -9999; });
    (function frame() {
      if (cv.parentElement.classList.contains('active')) {
        ctx.clearRect(0, 0, 1920, 1080);
        for (const a of P) {
          const dx = mx - a.x, dy = my - a.y, d = Math.hypot(dx, dy);
          if (d < 260) { a.vx += dx / d * 0.03; a.vy += dy / d * 0.03; }
          a.vx *= 0.985; a.vy *= 0.985;
          const sp = Math.hypot(a.vx, a.vy); if (sp < 0.15) { a.vx += (Math.random() - .5) * .1; a.vy += (Math.random() - .5) * .1; }
          a.x += a.vx; a.y += a.vy;
          if (a.x < 0 || a.x > 1920) a.vx *= -1; if (a.y < 0 || a.y > 1080) a.vy *= -1;
        }
        for (let i = 0; i < P.length; i++) for (let j = i + 1; j < P.length; j++) {
          const a = P[i], b = P[j], q = Math.hypot(a.x - b.x, a.y - b.y);
          if (q < 230) { ctx.strokeStyle = (a.p || b.p) ? `rgba(156,158,208,${.32 * (1 - q / 230)})` : `rgba(39,230,236,${.30 * (1 - q / 230)})`; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
        }
        for (const a of P) {
          const q = Math.hypot(mx - a.x, my - a.y);
          if (q < 260) { ctx.strokeStyle = `rgba(39,230,236,${.5 * (1 - q / 260)})`; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mx, my); ctx.stroke(); }
          ctx.fillStyle = a.p ? 'rgba(156,158,208,.8)' : 'rgba(39,230,236,.8)'; ctx.shadowColor = ctx.fillStyle; ctx.shadowBlur = 10;
          ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, 6.283); ctx.fill(); ctx.shadowBlur = 0;
        }
      }
      requestAnimationFrame(frame);
    })();
  }

  /* ---------- Início: abre no slide do endereço (#3) ou na capa ---------- */
  const start = parseInt(location.hash.slice(1), 10);
  go(Number.isFinite(start) ? start - 1 : 0);
  window.addEventListener('hashchange', () => { const h = parseInt(location.hash.slice(1), 10); if (Number.isFinite(h) && h - 1 !== current) go(h - 1); });
})();
