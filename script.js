let registros = JSON.parse(localStorage.getItem('registros') || '[]');

const form = document.getElementById('registroForm'), btnFiltrar = document.getElementById('btnFiltrar');
const fechas = { desde: document.getElementById('fechaDesde'), hasta: document.getElementById('fechaHasta') };

const ctxC = document.getElementById('grafCintura').getContext('2d');
const ctxG = document.getElementById('grafGluteos').getContext('2d');
const ctxP = document.getElementById('grafPeso').getContext('2d');

const cfg = (label, color, bg) => ({
  label, borderColor: color, backgroundColor: bg, data: [], tension: 0.3
});
const chartC = new Chart(ctxC, { type: 'line', data: { labels: [], datasets: [cfg('Cintura (cm)', '#f7b6d2','#fdeaf5')] } });
const chartG = new Chart(ctxG, { type: 'line', data: { labels: [], datasets: [cfg('Glúteos (cm)', '#a0c4ff','#e7f0ff')] } });
const chartP = new Chart(ctxP, { type: 'line', data: { labels: [], datasets: [cfg('Peso (kg)', '#bdb2ff','#ecebfe')] } });

form.addEventListener('submit', e => {
  e.preventDefault();
  const d = {
    fecha: form.fecha.value,
    parte: form.parteCuerpo.value,
    medidas: ['antesDesayuno','despuesDesayuno','antesAlmuerzo','despuesAlmuerzo','antesPilates','despuesPilates','antesCena','despuesCena','antesMasajes','despuesMasajes','horaDormir']
      .map(id => +form[id].value),
    peso: +form.pesoFinal.value
  };
  registros.push(d);
  localStorage.setItem('registros', JSON.stringify(registros));
  form.reset();
  filtrarYActualizar();
});

btnFiltrar.addEventListener('click', filtrarYActualizar);

function filtrarYActualizar(){
  const desde = fechas.desde.value, hasta = fechas.hasta.value;
  const data = registros.filter(r => (!desde || r.fecha>=desde) && (!hasta || r.fecha<=hasta));
  const dias = [...new Set(data.map(r=>r.fecha))].sort();
  chartC.data.labels = dias;
  chartG.data.labels = dias;
  chartP.data.labels = dias;
  chartC.data.datasets[0].data = dias.map(dia => avg(data.filter(r=>r.fecha===dia && r.parte==='cintura').map(r=>avg(r.medidas))));
  chartG.data.datasets[0].data = dias.map(dia => avg(data.filter(r=>r.fecha===dia && r.parte==='gluteos').map(r=>avg(r.medidas))));
  chartP.data.datasets[0].data = dias.map(dia => avg(data.filter(r=>r.fecha===dia).map(r=>r.peso)));
  chartC.update(); chartG.update(); chartP.update();
}

function avg(arr){ return arr.length ? +(arr.reduce((s,v)=>s+v,0)/arr.length).toFixed(1) : null; }

filtrarYActualizar();
