/* BlogDPC 5G · Grupo 2 · lógica del sitio (sin dependencias propias; Chart.js y D3 por CDN) */
(() => {
'use strict';
const D = window.DATA;
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const fmt = (n, d = 0) => Number(n).toLocaleString('fr-FR', { minimumFractionDigits: d, maximumFractionDigits: d });
const css = v => getComputedStyle(document.documentElement).getPropertyValue(v).trim();
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch { /* almacenamiento no disponible */ } }
};
const CL = { 1: 'Red y servicios', 2: 'Antenas y RF', 3: 'Capa física' };
const ccol = c => css(`--c${c}`);
const norm = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9ñ\s.-]/g, ' ');
const md = s => s.replace(/\*([^*]+)\*/g, '<i>$1</i>');

/* ================= Tema ================= */
const root = document.documentElement;
const temaGuardado = store.get('tema');
if (temaGuardado) root.dataset.tema = temaGuardado;
else if (matchMedia('(prefers-color-scheme: dark)').matches) root.dataset.tema = 'oscuro';
$('#btn-tema').addEventListener('click', () => {
  root.dataset.tema = root.dataset.tema === 'oscuro' ? 'claro' : 'oscuro';
  store.set('tema', root.dataset.tema);
  dibujarRejilla(true); redibujarGraficas(); if (window.__grafoColor) window.__grafoColor();
});

/* ================= Índice y navegación ================= */
const secciones = $$('main > section');
$('#toc-list').innerHTML = secciones.map(s => `<li><a href="#${s.id}" data-cat="${s.dataset.cat}">${s.dataset.titulo}</a></li>`).join('');
$('#timeline').innerHTML = D.entradas.map(([f, t, d, h]) =>
  `<li><time datetime="${f}">${new Date(f + 'T12:00').toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })}</time><a href="${h}" title="${d}">${t}</a></li>`).join('');
const toc = $('#toc'), menuBtn = $('#btn-menu');
menuBtn.addEventListener('click', () => { const a = toc.classList.toggle('abierto'); menuBtn.setAttribute('aria-expanded', a); });
toc.addEventListener('click', e => { if (e.target.closest('a')) { toc.classList.remove('abierto'); menuBtn.setAttribute('aria-expanded', false); } });
let actual = 'inicio';
const io = new IntersectionObserver(es => {
  es.forEach(e => { if (e.isIntersecting) actual = e.target.id; });
  $$('.toc a, .topnav a').forEach(a => a.classList.toggle('activo', a.getAttribute('href') === '#' + actual));
}, { rootMargin: '-40% 0px -55% 0px' });
secciones.forEach(s => io.observe(s));

/* ================= KPI ================= */
const K = D.kpi;
$('#kpis').innerHTML = [
  [fmt(K.docs), 'documentos de Scopus analizados'], [fmt(K.terminos_ini), 'términos extraídos de títulos y resúmenes'],
  [fmt(K.pasan), `términos superan el umbral de ${K.umbral} ocurrencias`], [fmt(K.finales), 'términos en el mapa tras la depuración'],
  [K.clusters, 'clústeres temáticos'], [fmt(K.enlaces), 'enlaces de co-ocurrencia'],
  [K.analisis, 'enlaces analizados (20 palabras × 10)'], ['1 ms', 'latencia URLLC que puso a prueba el mini-caso']
].map(([v, t]) => `<div><dt>${t}</dt><dd>${v}</dd></div>`).join('');

/* ================= Hero: rejilla de recursos ================= */
const rej = $('#rejilla');
let rejAnim = 0;
function dibujarRejilla(estatico) {
  const dpr = devicePixelRatio || 1, W = rej.clientWidth, H = rej.clientHeight;
  rej.width = W * dpr; rej.height = H * dpr;
  const g = rej.getContext('2d'); g.setTransform(dpr, 0, 0, dpr, 0, 0);
  const cols = Math.max(16, Math.round(W / 26)), filas = 10, cw = W / cols, rh = H / filas;
  // patrón determinista de asignaciones eMBB (usuario, filas) y llegadas URLLC
  let s = 7; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  const asign = [], urllc = [];
  for (let c = 0; c < cols; c++) {
    let f = 0;
    while (f < filas) { const h = 1 + Math.floor(rnd() * 4); asign.push({ c, f, h: Math.min(h, filas - f), u: Math.floor(rnd() * 3) }); f += h; }
    if (rnd() < 0.5) urllc.push({ c, f: Math.floor(rnd() * (filas - 1)), off: Math.floor(rnd() * 6) });
  }
  const colU = [css('--c3'), css('--c3'), css('--c3')], amber = css('--amber'), line = css('--line'), surf = css('--surface');
  const total = cols, dur = estatico || reduced ? 0 : 2600, t0 = performance.now();
  cancelAnimationFrame(rejAnim);
  const frame = now => {
    const p = dur ? Math.min(1, (now - t0) / dur) : 1, hasta = p * total;
    g.clearRect(0, 0, W, H);
    g.fillStyle = surf; g.fillRect(0, 0, W, H);
    asign.forEach(a => {
      if (a.c > hasta) return;
      g.globalAlpha = 0.14 + 0.13 * a.u; g.fillStyle = colU[a.u];
      g.fillRect(a.c * cw + 1, a.f * rh + 1, cw - 2, a.h * rh - 2);
    });
    g.globalAlpha = 1;
    urllc.forEach(u => {
      if (u.c + 0.6 > hasta) return;
      const x = u.c * cw + (u.off / 9) * cw, w = Math.max(5, cw * 0.32);
      g.fillStyle = surf; g.fillRect(x - 1, u.f * rh, w + 2, rh * 2);
      g.fillStyle = amber; g.fillRect(x, u.f * rh + 1, w, rh * 2 - 2);
    });
    g.strokeStyle = line; g.lineWidth = 1;
    for (let c = 0; c <= cols; c++) { g.beginPath(); g.moveTo(c * cw + .5, 0); g.lineTo(c * cw + .5, H); g.stroke(); }
    if (p < 1) rejAnim = requestAnimationFrame(frame);
  };
  rejAnim = requestAnimationFrame(frame);
}
dibujarRejilla(false);
let rz; addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(() => { dibujarRejilla(true); dibujarDemo(); }, 150); });

/* ================= Infografía de servicios ================= */
const SERV = [
  { id: 'eMBB', nombre: 'Banda ancha', sub: 'Video, realidad virtual, descargas', barra: 90, col: '--c3',
    det: [['Pico de descarga', '20 Gbit/s'], ['Latencia (plano de usuario)', '4 ms'], ['Ejemplo', 'Ver video 4K en un estadio lleno']] },
  { id: 'URLLC', nombre: 'Ultraconfiable', sub: 'Robots, vehículos, cirugía remota', barra: 99.999, col: '--amber',
    det: [['Latencia (plano de usuario)', '1 ms'], ['Confiabilidad', '99,999 % para 32 bytes'], ['Ejemplo', 'Detener un brazo robótico a tiempo']] },
  { id: 'mMTC', nombre: 'Masiva', sub: 'Sensores, medidores, ciudades', barra: 60, col: '--c2',
    det: [['Densidad de conexión', '1 000 000 dispositivos/km²'], ['Prioridad', 'Bajo consumo y bajo costo'], ['Ejemplo', 'Medidores de agua de toda una ciudad']] }
];
const info = $('#infografia');
info.innerHTML = SERV.map((s, i) => `<button class="servicio" role="tab" id="tab-${s.id}" aria-selected="${i === 1}" aria-controls="serv-det" data-i="${i}">
  <h3>${s.id}</h3><span class="sub">${s.nombre}: ${s.sub}</span><div class="barra"><span style="background:var(${s.col})"></span></div></button>`).join('')
  + `<div class="servicio-detalle" id="serv-det" role="tabpanel"></div>`;
function verServicio(i) {
  $$('.servicio', info).forEach((b, j) => { b.setAttribute('aria-selected', i === j); $('.barra span', b).style.width = i === j ? '100%' : '28%'; });
  const s = SERV[i];
  $('#serv-det').innerHTML = `<b>${s.id} · ${s.nombre}</b> (requisitos mínimos de ITU-R M.2410 <a class="cite" href="#ref-1">[1]</a>)<dl>${s.det.map(([a, b]) => `<div><dt>${a}</dt><dd>${b}</dd></div>`).join('')}</dl>`;
}
info.addEventListener('click', e => { const b = e.target.closest('.servicio'); if (b) verServicio(+b.dataset.i); });
info.addEventListener('keydown', e => {
  const i = $$('.servicio', info).findIndex(b => b.getAttribute('aria-selected') === 'true');
  if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { const n = (i + (e.key === 'ArrowRight' ? 1 : 2)) % 3; verServicio(n); $$('.servicio', info)[n].focus(); }
});
verServicio(1);

/* ================= Mini-demo ================= */
const demoC = $('#demo-canvas'), demoQ = $('#demo-q');
const T_EMBB = 0.12, T_RADIO = 0.18; // ms: paquete de 1500 B a 100 Mbit/s; retardo radio medio URLLC (mini-slot)
let demoState = null;
function esperaDemo(pol, q) { return pol === 'preem' ? 0 : pol === 'prio' ? T_EMBB / 2 : T_EMBB / 2 + q * T_EMBB; }
function dibujarDemo(prog = 1) {
  const dpr = devicePixelRatio || 1, W = demoC.clientWidth, H = 150;
  demoC.width = W * dpr; demoC.height = H * dpr;
  const g = demoC.getContext('2d'); g.setTransform(dpr, 0, 0, dpr, 0, 0);
  const pol = $('input[name=pol]:checked').value, q = +demoQ.value, maxT = 1.6, x = t => 40 + (W - 60) * t / maxT;
  g.clearRect(0, 0, W, H); g.font = '12px IBM Plex Sans, sans-serif';
  // eje
  g.strokeStyle = css('--line'); g.fillStyle = css('--muted');
  for (let t = 0; t <= maxT + 1e-9; t += 0.2) { g.beginPath(); g.moveTo(x(t), 20); g.lineTo(x(t), 120); g.stroke(); g.fillText(fmt(t, 1), x(t) - 8, 136); }
  g.fillText('ms', W - 18, 136);
  // límite 1 ms
  g.strokeStyle = css('--c1'); g.setLineDash([5, 4]); g.beginPath(); g.moveTo(x(1), 14); g.lineTo(x(1), 122); g.stroke(); g.setLineDash([]);
  g.fillStyle = css('--c1'); g.fillText('límite URLLC 1 ms', x(1) + 4, 14);
  // paquetes eMBB: el primero ya está en transmisión (le quedan 0,06 ms); los demás esperan en fila
  const w = esperaDemo(pol, q), txU = 0.003;
  const bloques = [];
  if (pol === 'preem') { bloques.push([txU, T_EMBB / 2]); for (let i = 0; i < q; i++) bloques.push([txU + T_EMBB / 2 + i * T_EMBB, T_EMBB]); }
  else if (pol === 'prio') { bloques.push([0, T_EMBB / 2]); for (let i = 0; i < q; i++) bloques.push([T_EMBB / 2 + txU + i * T_EMBB, T_EMBB]); }
  else { bloques.push([0, T_EMBB / 2]); for (let i = 0; i < q; i++) bloques.push([T_EMBB / 2 + i * T_EMBB, T_EMBB]); }
  bloques.forEach(([t0, d], i) => { if (t0 > maxT) return; g.fillStyle = css('--c3'); g.globalAlpha = i === 0 ? .7 : .4;
    g.fillRect(x(t0) + 1, 40, Math.max(2, x(Math.min(maxT, t0 + d)) - x(t0) - 2), 24); });
  g.globalAlpha = 1; g.fillStyle = css('--muted'); g.fillText('Transmisiones eMBB (la primera ya estaba en curso)', 40, 34);
  // paquete URLLC: espera (ámbar) + retardo radio (oscuro)
  const fin = w + T_RADIO, tp = fin * prog;
  g.fillStyle = css('--amber'); g.fillRect(x(0), 78, Math.max(3, x(Math.min(tp, w)) - x(0)), 12);
  if (tp > w) { g.fillStyle = css('--ink'); g.fillRect(x(w), 76, x(Math.min(tp, maxT)) - x(w), 16); }
  g.fillStyle = css('--muted'); g.fillText('URLLC: espera en fila (ámbar) + interfaz radio (oscuro)', 40, 110);
  return { w, fin };
}
function enviarDemo() {
  const pol = $('input[name=pol]:checked').value, q = +demoQ.value, w = esperaDemo(pol, q), fin = w + T_RADIO;
  const t0 = performance.now(), dur = reduced ? 0 : 900;
  const step = now => { const p = dur ? Math.min(1, (now - t0) / dur) : 1; dibujarDemo(p); if (p < 1) requestAnimationFrame(step); };
  requestAnimationFrame(step);
  const nombre = { fifo: 'esperando su turno', prio: 'pasando primero en la fila', preem: 'interrumpiendo al eMBB' }[pol];
  $('#demo-out').innerHTML = `Atendido ${nombre}: espera ${fmt(w, 2)} ms + radio ${fmt(T_RADIO, 2)} ms = <b>${fmt(fin, 2)} ms</b> → ` +
    (fin <= 1 ? '<span class="ok">llega a tiempo.</span>' : '<span class="ko">llega tarde: supera 1 ms.</span>');
}
$('#demo-go').addEventListener('click', enviarDemo);
demoQ.addEventListener('input', () => { $('#demo-q-out').value = demoQ.value; dibujarDemo(); });
$$('input[name=pol]').forEach(r => r.addEventListener('change', () => dibujarDemo()));
dibujarDemo();

/* ================= Embudo y eliminados ================= */
const emb = [['Términos extraídos', K.terminos_ini, '--muted'], [`Superan ${K.umbral} ocurrencias`, K.pasan, '--c3'], ['Seleccionados por relevancia (60 %)', K.relevancia, '--c2'], ['Tras la depuración manual', K.finales, '--c1']];
$('#embudo').innerHTML = emb.map(([t, v, c], i) => {
  const w = i === 0 ? 100 : Math.max(14, 100 * Math.sqrt(v / K.pasan) * 0.9);
  return `<div class="fila"><span class="etq">${t}</span><span class="bar" style="width:${w}%;background:var(${c})">${fmt(v)}</span></div>`;
}).join('');
const CRIT_COL = { 'Generalidad': '--c3', 'Ruido': '--c1', 'Irrelevancia': '--amber', 'Redundancia': '--c2' };
const tbE = $('#tabla-elim tbody');
let filtroCrit = 'Todos', filtroTxt = '';
function pintarElim() {
  const rows = D.eliminados.filter(e => (filtroCrit === 'Todos' || e.c === filtroCrit) && norm(e.t).includes(norm(filtroTxt)));
  tbE.innerHTML = rows.map(e => `<tr><td>${e.t}</td><td class="num">${fmt(e.o)}</td><td><span class="crit" style="background:var(${CRIT_COL[e.c]})"></span>${e.c}</td></tr>`).join('');
}
const cuenta = D.eliminados.reduce((a, e) => (a[e.c] = (a[e.c] || 0) + 1, a), {});
$('#filtro-elim').innerHTML = ['Todos', ...Object.keys(CRIT_COL)].map(c => `<button class="chip" aria-pressed="${c === 'Todos'}" data-c="${c}">${c}${c === 'Todos' ? ` (${D.eliminados.length})` : ` (${cuenta[c] || 0})`}</button>`).join('')
  + `<label class="sr" for="f-elim">Filtrar término</label><input id="f-elim" placeholder="Filtrar término…">`;
$('#filtro-elim').addEventListener('click', e => { const b = e.target.closest('.chip'); if (!b) return; filtroCrit = b.dataset.c; $$('#filtro-elim .chip').forEach(x => x.setAttribute('aria-pressed', x === b)); pintarElim(); });
$('#f-elim').addEventListener('input', e => { filtroTxt = e.target.value; pintarElim(); });
pintarElim();

/* ================= Clústeres ================= */
const tabs = $('#tabs-cluster');
tabs.innerHTML = D.clusters.map((c, i) => `<button role="tab" aria-selected="${i === 0}" data-i="${i}" style="--tab-c:var(--c${c.id})">Clúster ${c.id}: ${c.nombre}</button>`).join('');
function verCluster(i) {
  const c = D.clusters[i];
  $$('button', tabs).forEach((b, j) => b.setAttribute('aria-selected', i === j));
  const parrafos = c.texto.split('\n\n').map(p => `<p>${md(p)}</p>`).join('');
  $('#panel-cluster').innerHTML = `<p class="meta">${c.color} · ${c.n} términos · ${fmt(c.occ)} ocurrencias</p>
    <div class="terms">${c.top.map(t => `<span>${t}</span>`).join('')}</div>
    <img src="assets/img/mapa_cluster_${c.id}.webp" alt="Vista ampliada del clúster ${c.id} (${c.nombre}) en VOSviewer" loading="lazy" width="1120" height="860">${parrafos}`;
}
tabs.addEventListener('click', e => { const b = e.target.closest('button'); if (b) verCluster(+b.dataset.i); });
verCluster(0);

/* ================= Tabla y fichas de palabras ================= */
const P = D.palabras.map(p => ({ ...p, top: `${p.enlaces[0].t} (${fmt(p.enlaces[0].f)})` }));
const tbP = $('#tabla-palabras tbody');
let sortK = 'n', sortAsc = true;
function pintarTabla() {
  const r = [...P].sort((a, b) => { const x = a[sortK], y = b[sortK]; return (typeof x === 'number' ? x - y : String(x).localeCompare(String(y))) * (sortAsc ? 1 : -1); });
  tbP.innerHTML = r.map(p => `<tr><td class="num">${p.n}</td><td><a href="#w-${p.n}" data-open="${p.n}">${p.palabra}</a></td><td><span class="c-chip c${p.cluster}">${p.cluster}</span> ${CL[p.cluster]}</td><td class="num">${fmt(p.occ)}</td><td class="num">${p.links}</td><td class="num">${fmt(p.tls)}</td><td>${p.top}</td></tr>`).join('');
  $$('#tabla-palabras th').forEach(th => th.dataset.k === sortK ? th.setAttribute('aria-sort', sortAsc ? 'ascending' : 'descending') : th.removeAttribute('aria-sort'));
}
$('#tabla-palabras thead').addEventListener('click', e => { const th = e.target.closest('th'); if (!th) return; sortAsc = sortK === th.dataset.k ? !sortAsc : th.dataset.k === 'n' || th.dataset.k === 'palabra'; sortK = th.dataset.k; pintarTabla(); });
pintarTabla();
const fichas = $('#fichas');
fichas.innerHTML = P.map(p => {
  const max = p.enlaces[0].f;
  return `<details class="ficha" id="w-${p.n}" style="--fc:var(--c${p.cluster})">
  <summary><b>${p.n}. ${p.palabra}</b><span>Clúster ${p.cluster} · ${fmt(p.occ)} ocurrencias · ${p.links} enlaces · fuerza total ${fmt(p.tls)}</span></summary>
  <div class="ficha-body">
    <img src="${p.img}" alt="Red de enlaces de «${p.palabra}» resaltada en VOSviewer" loading="lazy" width="1120" height="860">
    <div class="table-wrap"><table class="data"><caption>10 enlaces más fuertes</caption><thead><tr><th class="num">#</th><th>Enlace</th><th>Clúster</th><th class="num">Fuerza</th></tr></thead><tbody>
    ${p.enlaces.map((e, i) => `<tr${i === 0 ? ' class="hl"' : ''}><td class="num">${i + 1}</td><td>${e.t}</td><td><span class="c-chip c${e.c}">${e.c}</span></td><td class="num"><span class="barra-f" style="width:${Math.round(60 * e.f / max)}px;--fc:var(--c${e.c})"></span>${fmt(e.f)}</td></tr>`).join('')}
    </tbody></table></div>
    <div class="txt"><p><b>Análisis.</b> ${md(p.analisis)}</p><p><b>Conclusión.</b> ${md(p.conclusion)}</p></div>
  </div></details>`;
}).join('');
$('#filtro-palabras').innerHTML = ['Todas', 1, 2, 3].map(c => `<button class="chip" aria-pressed="${c === 'Todas'}" data-c="${c}">${c === 'Todas' ? 'Todas' : 'Clúster ' + c + ': ' + CL[c]}</button>`).join('')
  + `<button class="chip" id="abrir-todas">Abrir todas</button>`;
$('#filtro-palabras').addEventListener('click', e => {
  const b = e.target.closest('.chip'); if (!b) return;
  if (b.id === 'abrir-todas') { const abrir = b.textContent === 'Abrir todas'; $$('details.ficha').forEach(d => { if (!d.hidden) d.open = abrir; }); b.textContent = abrir ? 'Cerrar todas' : 'Abrir todas'; return; }
  $$('#filtro-palabras .chip[data-c]').forEach(x => x.setAttribute('aria-pressed', x === b));
  P.forEach(p => { $('#w-' + p.n).hidden = !(b.dataset.c === 'Todas' || +b.dataset.c === p.cluster); });
});
function abrirFicha(n) { const d = $('#w-' + n); if (d) { d.hidden = false; d.open = true; d.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' }); } }
document.addEventListener('click', e => { const a = e.target.closest('[data-open]'); if (a) { e.preventDefault(); abrirFicha(a.dataset.open); history.replaceState(null, '', '#w-' + a.dataset.open); } });
if (/^#w-\d+$/.test(location.hash)) setTimeout(() => abrirFicha(location.hash.slice(3)), 300);

/* ================= Mapa conceptual (D3) ================= */
function grafo() {
  if (!window.d3) return;
  const svg = d3.select('#grafo'), el = svg.node();
  const W = el.clientWidth, H = el.clientHeight;
  const term = Object.fromEntries(D.terminos.map(t => [t.t, t]));
  const nodos = new Map(), links = [], seen = new Set();
  D.palabras.forEach(p => {
    nodos.set(p.palabra, { id: p.palabra, c: p.cluster, o: p.occ, sel: true, n: p.n });
    p.enlaces.forEach(e => {
      if (!nodos.has(e.t)) nodos.set(e.t, { id: e.t, c: e.c, o: term[e.t] ? term[e.t].o : 200, sel: false });
      const k = [p.palabra, e.t].sort().join('|');
      if (!seen.has(k)) { seen.add(k); links.push({ source: p.palabra, target: e.t, f: e.f }); }
    });
  });
  const N = [...nodos.values()], maxF = d3.max(links, l => l.f), maxO = d3.max(N, n => n.o);
  const r = d3.scaleSqrt().domain([0, maxO]).range([3, 22]);
  const sw = d3.scaleLinear().domain([0, maxF]).range([0.4, 7]);
  svg.selectAll('*').remove();
  const g = svg.append('g');
  svg.call(d3.zoom().scaleExtent([0.5, 4]).on('zoom', ev => g.attr('transform', ev.transform)));
  const L = g.append('g').selectAll('line').data(links).join('line').attr('stroke-width', l => sw(l.f)).attr('stroke-opacity', .35);
  const G = g.append('g').selectAll('g').data(N).join('g').attr('class', 'nodo').attr('tabindex', d => d.sel ? 0 : -1)
    .attr('role', d => d.sel ? 'button' : null).attr('aria-label', d => d.sel ? `Palabra ${d.id}` : null);
  G.append('circle').attr('r', d => r(d.o)).attr('stroke', 'var(--surface)').attr('stroke-width', 1.5);
  G.append('text').text(d => d.id).attr('x', d => r(d.o) + 3).attr('y', 4).style('font-weight', d => d.sel ? 700 : 400).style('font-size', d => d.sel ? '12px' : '10px');
  const color = () => { L.attr('stroke', css('--muted')); G.select('circle').attr('fill', d => ccol(d.c)).attr('fill-opacity', d => d.sel ? 1 : .55); };
  window.__grafoColor = color; color();
  const sim = d3.forceSimulation(N).force('link', d3.forceLink(links).id(d => d.id).distance(l => 150 - 70 * l.f / maxF).strength(.2))
    .force('charge', d3.forceManyBody().strength(-220)).force('center', d3.forceCenter(W / 2, H / 2))
    .force('x', d3.forceX(d => W * (d.c === 1 ? .2 : d.c === 2 ? .62 : .42)).strength(.06)).force('y', d3.forceY(H / 2).strength(.04)).force('collide', d3.forceCollide(d => r(d.o) + 4));
  const pad = 30; sim.on('tick', () => { N.forEach(d => { d.x = Math.max(pad, Math.min(W - 110, d.x)); d.y = Math.max(pad, Math.min(H - pad, d.y)); }); L.attr('x1', d => d.source.x).attr('y1', d => d.source.y).attr('x2', d => d.target.x).attr('y2', d => d.target.y); G.attr('transform', d => `translate(${d.x},${d.y})`); });
  if (reduced) { sim.stop(); for (let i = 0; i < 300; i++) sim.tick(); sim.on('tick')(); }
  G.call(d3.drag().on('start', (ev, d) => { if (!ev.active) sim.alphaTarget(.3).restart(); d.fx = d.x; d.fy = d.y; })
    .on('drag', (ev, d) => { d.fx = ev.x; d.fy = ev.y; }).on('end', (ev, d) => { if (!ev.active) sim.alphaTarget(0); d.fx = null; d.fy = null; }));
  const select = d => {
    const p = D.palabras.find(x => x.palabra === d.id);
    G.classed('sel', x => x.id === d.id);
    L.attr('stroke-opacity', l => (l.source.id === d.id || l.target.id === d.id) ? .9 : .12);
    $('#grafo-info').innerHTML = p
      ? `<h3>${p.palabra}</h3><p><span class="c-chip c${p.cluster}">${p.cluster}</span> ${CL[p.cluster]}<br>${fmt(p.occ)} ocurrencias · fuerza total ${fmt(p.tls)}</p><ol>${p.enlaces.map(e => `<li>${e.t} <b>${fmt(e.f)}</b></li>`).join('')}</ol><p><a href="#w-${p.n}" data-open="${p.n}">Leer el análisis completo</a></p>`
      : `<h3>${d.id}</h3><p>Término enlazado del clúster ${d.c} (${CL[d.c]}), ${fmt(d.o)} ocurrencias. No es una de las 20 palabras analizadas.</p>`;
  };
  G.on('click', (ev, d) => select(d)).on('keydown', (ev, d) => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); select(d); } });
  select(N.find(n => n.id === 'urllc'));
}

/* ================= Gráficas ================= */
const charts = {};
function baseOpts(extra = {}) {
  const ink = css('--ink'), line = css('--line');
  return Object.assign({ responsive: true, maintainAspectRatio: true, animation: reduced ? false : { duration: 500 },
    plugins: { legend: { labels: { color: ink, font: { family: 'IBM Plex Sans' } } }, tooltip: { mode: 'index', intersect: false } },
    scales: { x: { ticks: { color: ink }, grid: { color: line } }, y: { ticks: { color: ink }, grid: { color: line }, beginAtZero: true } } }, extra);
}
const SUBCOL = { '6G': '--c1', 'IA / aprendizaje': '--c3', 'IoT': '--c2', 'Seguridad': '--amber', 'URLLC': '--ink' };
const PAL = ['--c1', '--c3', '--c2', '--amber', '--ink', '--muted'];
const colorSub = (k, i) => css(SUBCOL[k] || PAL[i % PAL.length]);
let subSel = ['6G', 'IA / aprendizaje', 'IoT', 'Seguridad', 'URLLC'];
const AN = ['2024', '2025', '2026'];
function chAnios() {
  charts.anios && charts.anios.destroy();
  const t = D.tendencias;
  charts.anios = new Chart($('#ch-anios'), { type: 'bar', data: { labels: Object.keys(t.docs_por_anio), datasets: [{ label: 'Documentos', data: Object.values(t.docs_por_anio), backgroundColor: css('--c3') }] }, options: baseOpts({ plugins: { legend: { display: false } } }) });
}
function chSub() {
  charts.sub && charts.sub.destroy();
  const S = D.tendencias.subtemas;
  charts.sub = new Chart($('#ch-sub'), { type: 'line', data: { labels: AN, datasets: subSel.map((k, i) => ({ label: k, data: AN.map(a => S[k].pct_por_anio[a]), borderColor: colorSub(k, i), backgroundColor: colorSub(k, i), tension: .25 })) },
    options: baseOpts({ scales: { x: { ticks: { color: css('--ink') }, grid: { color: css('--line') } }, y: { ticks: { color: css('--ink'), callback: v => v + ' %' }, grid: { color: css('--line') }, beginAtZero: true } } }) });
}
function pintarSubtemas() {
  $('#sel-subtemas').innerHTML = Object.keys(D.tendencias.subtemas).map(k => `<button class="chip" aria-pressed="${subSel.includes(k)}" data-k="${k}">${k}</button>`).join('');
}
$('#sel-subtemas').addEventListener('click', e => { const b = e.target.closest('.chip'); if (!b) return; const k = b.dataset.k; subSel = subSel.includes(k) ? subSel.filter(x => x !== k) : [...subSel, k]; pintarSubtemas(); chSub(); });

/* Generador de visualizaciones por lenguaje natural (reglas sobre los datos reales) */
const SINON = { '6G': ['6g', 'sexta'], 'IA / aprendizaje': ['ia', 'inteligencia artificial', 'machine learning', 'aprendizaje', 'deep learning', ' ai '], 'IoT': ['iot', 'internet de las cosas'],
  'Seguridad': ['seguridad', 'security', 'ataque'], 'URLLC': ['urllc', 'baja latencia', 'ultraconfiable'], 'eMBB': ['embb', 'banda ancha'], 'mMTC': ['mmtc', 'masiv'],
  'Network slicing': ['slicing', 'rebanada', 'segmentacion'], 'Edge computing / MEC': ['edge', 'borde', 'mec'], 'mmWave': ['mmwave', 'milimetric'], 'MIMO': ['mimo'],
  'NTN / satélite': ['ntn', 'satelit', 'no terrestre'], 'O-RAN': ['o-ran', 'oran', 'open ran'], 'Eficiencia energética': ['energ'], 'Antenas': ['antena'] };
let genQ = '';
function generar(q) {
  genQ = q; const n = ' ' + norm(q) + ' ';
  let elegidos = Object.keys(SINON).filter(k => SINON[k].some(s => n.includes(norm(s))));
  const todos = /todos|todas|cada subtema|por subtema/.test(n);
  if (todos || !elegidos.length) elegidos = todos ? Object.keys(SINON) : [];
  const tipo = /barra|total|cuant|compar.*total/.test(n) ? 'bar' : /torta|pastel|dona/.test(n) ? 'doughnut' : 'line';
  const S = D.tendencias.subtemas;
  if (!elegidos.length) { $('#gen-msg').textContent = 'No reconocí ningún subtema. Prueba con: ' + Object.keys(SINON).join(', ') + '.'; return; }
  charts.gen && charts.gen.destroy();
  let data, opts;
  if (tipo === 'line') {
    data = { labels: AN, datasets: elegidos.map((k, i) => ({ label: k, data: AN.map(a => S[k].pct_por_anio[a]), borderColor: colorSub(k, i), backgroundColor: colorSub(k, i), tension: .25 })) };
    opts = baseOpts({ scales: { x: { ticks: { color: css('--ink') }, grid: { color: css('--line') } }, y: { ticks: { color: css('--ink'), callback: v => v + ' %' }, grid: { color: css('--line') } } } });
  } else {
    const orden = [...elegidos].sort((a, b) => S[b].total - S[a].total);
    data = { labels: orden, datasets: [{ label: 'Documentos que lo mencionan (total)', data: orden.map(k => S[k].total), backgroundColor: orden.map((k, i) => colorSub(k, i)) }] };
    opts = tipo === 'bar' ? baseOpts({ indexAxis: orden.length > 6 ? 'y' : 'x', plugins: { legend: { display: false } } }) : { plugins: { legend: { labels: { color: css('--ink') } } } };
  }
  charts.gen = new Chart($('#ch-gen'), { type: tipo, data, options: opts });
  $('#gen-msg').textContent = `Entendí: ${tipo === 'line' ? 'evolución (% de documentos por año)' : 'total de documentos'} de ${elegidos.join(', ')}.`;
}
$('#gen-form').addEventListener('submit', e => { e.preventDefault(); generar($('#gen-q').value || $('#gen-q').placeholder); });

/* ================= Simulador de resultados del mini-caso ================= */
const RHOS = [...new Set(D.minicaso.map(r => r.rho))].sort((a, b) => a - b);
const POLS = { FIFO: ['FIFO (una sola fila)', '--c1'], PRIO: ['Prioridad URLLC', '--c3'], PREEM: ['Apropiación', '--c2'] };
function simVer() {
  const i = +$('#sim-rho').value, rho = RHOS[i], esc = $('input[name=bler]:checked').value;
  $('#sim-rho-out').value = fmt(rho, 2);
  const get = (p, s) => D.minicaso.find(r => r.esc === esc && r.rho === rho && r.pol === p && r.serv === s);
  $('#sim-cards').innerHTML = Object.keys(POLS).map(p => {
    const u = get(p, 'URLLC'), e = get(p, 'eMBB'), ok = u.cumple >= 99.999;
    return `<div class="sim-card" style="--pc:var(${POLS[p][1]})"><h4>${POLS[p][0]}</h4><dl>
      <dt>URLLC p99</dt><dd>${fmt(u.p99, 3)} ms</dd><dt>URLLC media</dt><dd>${fmt(u.media, 3)} ms</dd>
      <dt>URLLC ≤ 1 ms</dt><dd class="${ok ? 'ok' : 'ko'}">${fmt(u.cumple, 3)} %</dd><dt>Jitter URLLC</dt><dd>${fmt(u.jitter, 3)} ms</dd>
      <dt>eMBB media</dt><dd>${fmt(e.media, 2)} ms</dd><dt>eMBB throughput</dt><dd>${fmt(e.thr, 1)} Mbit/s</dd></dl></div>`;
  }).join('');
  if (!window.Chart) return;
  charts.sim && charts.sim.destroy();
  const ds = Object.keys(POLS).map(p => ({ label: POLS[p][0], data: RHOS.map(r => D.minicaso.find(x => x.esc === esc && x.rho === r && x.pol === p && x.serv === 'URLLC').p99),
    borderColor: css(POLS[p][1]), backgroundColor: css(POLS[p][1]), pointRadius: RHOS.map((r, j) => j === i ? 7 : 3), tension: .2 }));
  ds.push({ label: 'Requisito 1 ms', data: RHOS.map(() => 1), borderColor: css('--muted'), borderDash: [6, 4], pointRadius: 0 });
  charts.sim = new Chart($('#ch-sim'), { type: 'line', data: { labels: RHOS.map(r => fmt(r, 2)), datasets: ds },
    options: baseOpts({ scales: { x: { title: { display: true, text: 'Carga total ρ', color: css('--ink') }, ticks: { color: css('--ink') }, grid: { color: css('--line') } },
      y: { title: { display: true, text: 'Latencia p99 URLLC (ms)', color: css('--ink') }, ticks: { color: css('--ink') }, grid: { color: css('--line') }, beginAtZero: true } } }) });
}
$('#sim-rho').addEventListener('input', simVer);
$$('input[name=bler]').forEach(r => r.addEventListener('change', simVer));

function redibujarGraficas() { if (!window.Chart) return; chAnios(); chSub(); simVer(); if (genQ) generar(genQ); dibujarDemo(); }

/* ================= Quiz ================= */
$('#quiz-form').innerHTML = D.quiz.map(([q, ops, ok, exp], i) => `<fieldset><legend>${i + 1}. ${q}</legend>
  ${ops.map((o, j) => `<label><input type="radio" name="q${i}" value="${j}"> ${o}</label>`).join('')}<p class="fb" id="fb${i}" aria-live="polite"></p></fieldset>`).join('')
  + `<button class="btn">Revisar respuestas</button>`;
$('#quiz-form').addEventListener('submit', e => {
  e.preventDefault(); let pts = 0;
  D.quiz.forEach(([, , ok, exp], i) => {
    const s = $(`input[name=q${i}]:checked`), fb = $('#fb' + i);
    if (!s) { fb.innerHTML = '<span class="ko">Sin responder.</span> ' + exp; return; }
    const bien = +s.value === ok; pts += bien;
    fb.innerHTML = `<span class="${bien ? 'ok' : 'ko'}">${bien ? 'Correcto.' : 'Incorrecto.'}</span> ${exp}`;
  });
  $('#quiz-score').textContent = `Resultado: ${pts} de ${D.quiz.length}.`;
});

/* ================= Plan, reflexión, equipo, referencias ================= */
$('#pregunta').textContent = D.plan.pregunta;
$('#plan-estrategias').innerHTML = D.plan.estrategias.map(s => `<li>${s}</li>`).join('');
$('#plan-crono').innerHTML = D.plan.cronograma.map(([f, t]) => `<li><b>${f}</b><span>${t}</span></li>`).join('');
$('#plan-riesgos tbody').innerHTML = D.plan.riesgos.map(([r, s]) => `<tr><td>${r}</td><td>${s}</td></tr>`).join('');
$('#reflexion-txt').innerHTML = D.reflexion.map(([t, p]) => `<h3>${t}</h3><p>${md(p)}</p>`).join('');
$('#lecciones').innerHTML = D.lecciones.map(l => `<li>${l}</li>`).join('');
$('#uso-ia').textContent = D.uso_ia;
$('#equipo-list').innerHTML = D.equipo.map(([n, c, r, d], i) => `<li style="--ec:var(${['--c3', '--amber', '--c2'][i]})"><b>${n}</b><span class="cod">Código ${c}</span><br><span class="rol">${r}</span><p>${d}</p></li>`).join('');
$('#refs').innerHTML = D.referencias.map(([t, u], i) => `<li id="ref-${i + 1}">${t} [En línea]. Disponible: <a href="${u}" target="_blank" rel="noopener">${u.replace(/^https?:\/\//, '')}</a></li>`).join('');
$('#citados').innerHTML = D.citados.map(c => { const a = c.a.split(';').map(s => s.trim()); const au = a.length > 3 ? a[0] + ' <i>et al.</i>' : a.join(', ');
  return `<li>${au}, “${c.t},” <i>${c.s}</i>, ${c.y}, doi: <a href="https://doi.org/${c.doi}" target="_blank" rel="noopener">${c.doi}</a>. (${fmt(c.c)} citas en Scopus)</li>`; }).join('');

/* ================= Video ================= */
const vb = $('#video-box'), yt = vb.dataset.youtube;
vb.innerHTML = yt ? `<iframe src="https://www.youtube-nocookie.com/embed/${yt}" title="Presentación del Grupo 2 sobre 5G" loading="lazy" allow="accelerometer; encrypted-media; picture-in-picture" allowfullscreen></iframe>`
  : `<div class="pend"><b>Video en preparación.</b><br>Aquí se publicará la presentación oral del grupo (8–10 min) en YouTube.</div>`;

/* ================= Compartir y encuesta ================= */
const url = location.origin.startsWith('http') ? location.origin + location.pathname : 'https://blogdpc-5g-g2.vercel.app/';
const titulo = '5G en 20 000 artículos: mapa bibliométrico y latencia URLLC (BlogDPC Grupo 2 UIS)';
const SH = { linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(titulo)}&url=${encodeURIComponent(url)}`,
  whatsapp: `https://wa.me/?text=${encodeURIComponent(titulo + ' ' + url)}`, facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, researchgate: 'https://www.researchgate.net/' };
$$('#share a').forEach(a => a.href = SH[a.dataset.net]);
const copiar = async () => { try { await navigator.clipboard.writeText(url); $('#copiar').textContent = 'Enlace copiado'; } catch { prompt('Copia este enlace:', url); } setTimeout(() => $('#copiar').textContent = 'Copiar enlace', 2000); };
$('#copiar').addEventListener('click', copiar);
$('#share a[data-net=researchgate]').addEventListener('click', () => { navigator.clipboard && navigator.clipboard.writeText(url).catch(() => {}); });
const POLL = ['Muy útil', 'Útil', 'Poco útil'];
const pollKey = 'encuesta-utilidad';
function pintarPoll() {
  const v = store.get(pollKey);
  $('#poll').innerHTML = `<span>¿Te ayudó este blog a entender qué pasa hoy con 5G?</span>` + POLL.map(o => `<button class="chip" aria-pressed="${v === o}" data-o="${o}">${o}</button>`).join('')
    + `<span class="res">${v ? `Respondiste «${v}». Gracias. Si quieres, cuéntanos por qué en los comentarios.` : 'Tu respuesta se guarda solo en este navegador.'}</span>`;
}
$('#poll').addEventListener('click', e => { const b = e.target.closest('.chip'); if (b) { store.set(pollKey, b.dataset.o); pintarPoll(); } });
pintarPoll();

/* Comentarios con Giscus (GitHub Discussions). Se completan los identificadores al crear el repositorio. */
const GISCUS = { repo: '', repoId: '', category: 'General', categoryId: '' };
if (GISCUS.repo && GISCUS.repoId && GISCUS.categoryId) {
  const s = document.createElement('script');
  Object.entries({ src: 'https://giscus.app/client.js', 'data-repo': GISCUS.repo, 'data-repo-id': GISCUS.repoId, 'data-category': GISCUS.category, 'data-category-id': GISCUS.categoryId,
    'data-mapping': 'pathname', 'data-reactions-enabled': '1', 'data-emit-metadata': '0', 'data-input-position': 'top', 'data-theme': 'preferred_color_scheme', 'data-lang': 'es', crossorigin: 'anonymous' })
    .forEach(([k, v]) => s.setAttribute(k, v));
  s.async = true; $('#comentarios').appendChild(s);
} else $('#comentarios').innerHTML = '<p class="note">Los comentarios se activarán cuando el blog quede publicado con su repositorio. Mientras tanto, comenta en el foro del aula virtual.</p>';

/* ================= Glosario emergente ================= */
const pop = $('#pop');
let popFor = null;
function mostrarPop(el) {
  const k = el.dataset.g, def = D.glosario[k]; if (!def) return;
  pop.innerHTML = `<b>${k}</b>${def}`; pop.hidden = false; popFor = el;
  el.setAttribute('aria-describedby', 'pop');
  const r = el.getBoundingClientRect(), pw = Math.min(320, innerWidth - 20);
  pop.style.left = Math.max(10, Math.min(scrollX + r.left, scrollX + innerWidth - pw - 10)) + 'px';
  pop.style.top = (scrollY + r.bottom + 8) + 'px';
}
function ocultarPop() { if (popFor) popFor.removeAttribute('aria-describedby'); pop.hidden = true; popFor = null; }
$$('abbr.g').forEach(a => { a.tabIndex = 0; a.setAttribute('role', 'button'); });
document.addEventListener('mouseover', e => { const a = e.target.closest('abbr.g'); if (a) mostrarPop(a); });
document.addEventListener('mouseout', e => { if (e.target.closest('abbr.g')) ocultarPop(); });
document.addEventListener('focusin', e => { const a = e.target.closest('abbr.g'); a ? mostrarPop(a) : ocultarPop(); });
document.addEventListener('click', e => { const a = e.target.closest('abbr.g'); if (a) mostrarPop(a); else if (!e.target.closest('#pop')) ocultarPop(); });

/* ================= Buscador ================= */
const panel = $('#buscador'), q = $('#q');
const CATS = ['Todas', ...new Set(secciones.map(s => s.dataset.cat))];
let catSel = 'Todas';
const indice = [
  ...secciones.map(s => ({ t: s.dataset.titulo, h: '#' + s.id, cat: s.dataset.cat, txt: s.innerText })),
  ...Object.entries(D.glosario).map(([k, v]) => ({ t: 'Glosario: ' + k, h: '#que-es', cat: 'Contexto', txt: k + ' ' + v })),
  ...D.palabras.map(p => ({ t: 'Palabra: ' + p.palabra, h: '#w-' + p.n, cat: 'Resultados', txt: p.palabra + ' ' + p.analisis, open: p.n }))
];
$('.tag-filter').innerHTML = CATS.map(c => `<button class="chip" aria-pressed="${c === 'Todas'}" data-c="${c}">${c}</button>`).join('');
$('.tag-filter').addEventListener('click', e => { const b = e.target.closest('.chip'); if (!b) return; catSel = b.dataset.c; $$('.tag-filter .chip').forEach(x => x.setAttribute('aria-pressed', x === b)); buscar(); });
function buscar() {
  const t = norm(q.value.trim()), ws = t.split(/\s+/).filter(Boolean);
  const res = indice.filter(i => (catSel === 'Todas' || i.cat === catSel) && ws.every(w => norm(i.txt).includes(w))).slice(0, 25);
  $('#resultados').innerHTML = !ws.length && catSel === 'Todas' ? '<li>Escribe para buscar en todo el blog.</li>' : res.length ? res.map(r => {
    const nt = norm(r.txt), pos = ws.length ? nt.indexOf(ws[0]) : 0, frag = r.txt.substr(Math.max(0, pos - 60), 160).replace(/\s+/g, ' ');
    return `<li><a href="${r.h}" ${r.open ? `data-open="${r.open}"` : ''}>${r.t}</a> <span class="tag">${r.cat}</span><small>…${frag}…</small></li>`; }).join('') : '<li>Sin resultados. Prueba con otro término, por ejemplo «latencia» o «umbral».</li>';
}
q.addEventListener('input', buscar);
const abrirBuscador = () => { panel.hidden = false; q.focus(); buscar(); };
$('#btn-buscar').addEventListener('click', () => panel.hidden ? abrirBuscador() : (panel.hidden = true));
panel.addEventListener('click', e => { if (e.target === panel || e.target.closest('a')) panel.hidden = true; });
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { panel.hidden = true; ocultarPop(); if (!$('#bot').hidden) cerrarBot(); }
  if (e.key === '/' && !/input|textarea/i.test(document.activeElement.tagName)) { e.preventDefault(); abrirBuscador(); }
});

/* ================= Lectura en voz alta (Text-to-Speech del navegador) ================= */
const ttsBtn = $('#btn-tts');
if (!('speechSynthesis' in window)) ttsBtn.hidden = true;
ttsBtn.addEventListener('click', () => {
  if (speechSynthesis.speaking) { speechSynthesis.cancel(); ttsBtn.setAttribute('aria-pressed', 'false'); return; }
  const s = document.getElementById(actual) || secciones[0];
  const texto = [...s.querySelectorAll('h1,h2,h3,p,li,blockquote')].filter(e => !e.closest('.table-wrap,.demo,.sim,.toc')).map(e => e.innerText).join('. ');
  const u = new SpeechSynthesisUtterance(texto.slice(0, 6000));
  const voces = speechSynthesis.getVoices(); u.voice = voces.find(v => /es-(CO|MX|US|419)/i.test(v.lang)) || voces.find(v => /^es/i.test(v.lang)) || null;
  u.lang = u.voice ? u.voice.lang : 'es-CO'; u.rate = 1;
  u.onend = () => ttsBtn.setAttribute('aria-pressed', 'false');
  ttsBtn.setAttribute('aria-pressed', 'true'); speechSynthesis.speak(u);
});

/* ================= Chatbot «Pregúntale al blog» (reglas, sin API externa) ================= */
const bot = $('#bot'), botBtn = $('#bot-btn'), log = $('#bot-log');
const decir = (t, quien = 'b') => { const d = document.createElement('div'); d.className = 'msg ' + quien; d.innerHTML = t; log.appendChild(d); log.scrollTop = log.scrollHeight; };
const SUG = ['¿Qué es URLLC?', '¿Cuántos documentos analizaron?', '¿Qué umbral usaron?', '¿Qué demostró el mini-caso?', '¿Cuáles son los clústeres?'];
function abrirBot() { bot.hidden = false; botBtn.setAttribute('aria-expanded', 'true'); if (!log.children.length) decir('Hola. Respondo preguntas sobre este blog: 5G, la metodología, el mapa, el análisis y el mini-caso.'); $('#bot-q').focus(); }
function cerrarBot() { bot.hidden = true; botBtn.setAttribute('aria-expanded', 'false'); botBtn.focus(); }
botBtn.addEventListener('click', () => bot.hidden ? abrirBot() : cerrarBot());
$('#bot-close').addEventListener('click', cerrarBot);
$('#bot-sug').innerHTML = SUG.map(s => `<button class="chip">${s}</button>`).join('');
$('#bot-sug').addEventListener('click', e => { const b = e.target.closest('.chip'); if (b) responder(b.textContent); });
function responder(pregunta) {
  decir(pregunta.replace(/</g, '&lt;'), 'u');
  const n = ' ' + norm(pregunta) + ' ';
  let mejor = null, pts = 0;
  D.faq.forEach(([claves, resp, h]) => { const s = claves.reduce((a, k) => a + (n.includes(' ' + norm(k) + ' ') || n.includes(norm(k)) ? k.length : 0), 0); if (s > pts) { pts = s; mejor = [resp, h]; } });
  const pal = D.palabras.find(p => n.includes(' ' + p.palabra + ' '));
  if (pal && (!mejor || pts < pal.palabra.length + 1)) mejor = [`«${pal.palabra}» (clúster ${pal.cluster}) aparece en ${fmt(pal.occ)} documentos. Su enlace más fuerte es con «${pal.enlaces[0].t}» (fuerza ${fmt(pal.enlaces[0].f)}).`, '#w-' + pal.n];
  const g = Object.keys(D.glosario).find(k => n.includes(' ' + norm(k) + ' '));
  if (!mejor && g) mejor = [D.glosario[g], '#que-es'];
  if (mejor) decir(`${mejor[0]} <a href="${mejor[1]}" ${mejor[1].startsWith('#w-') ? `data-open="${mejor[1].slice(3)}"` : ''}>Ver en el blog</a>`);
  else decir('No encontré eso en el blog. Prueba con palabras como «latencia», «clústeres», «umbral», «mini-caso» o el nombre de un término (por ejemplo «mimo»), o usa el buscador.');
}
$('#bot-form').addEventListener('submit', e => { e.preventDefault(); const v = $('#bot-q').value.trim(); if (v) { responder(v); $('#bot-q').value = ''; } });

/* ================= Números: separador de miles no partible ================= */
function nbspNumeros(el) {
  const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  let n; while ((n = w.nextNode())) { if (/\d \d{3}/.test(n.nodeValue)) n.nodeValue = n.nodeValue.replace(/(\d) (?=\d{3}(\D|$))/g, '$1\u202F'); }
}
nbspNumeros(document.body);

/* ================= Arranque de librerías externas ================= */
function cuandoListo() {
  if (window.Chart) { Chart.defaults.locale = 'fr-FR'; Chart.defaults.font.family = 'IBM Plex Sans, system-ui, sans-serif'; pintarSubtemas(); chAnios(); chSub(); simVer(); generar('compara 6G, IoT y seguridad en líneas'); }
  else simVer();
  grafo();
}
if (document.readyState === 'complete') cuandoListo(); else addEventListener('load', cuandoListo);
})();
