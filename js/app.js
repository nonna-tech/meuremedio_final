/* =========================
   MeuRemédio – app.js COMPLETO
   (lembretes + calendário bônus + fotos + alarmes + compartilhar + PWA)
========================= */

// ---------- Abas ----------
const tabL = document.getElementById('tabLembretes');
const tabC = document.getElementById('tabCalendario');
const viewL = document.getElementById('viewLembretes');
const viewC = document.getElementById('viewCalendario');
function ativarAba(alvo){
  if(alvo==='L'){ viewL.classList.remove('hidden'); viewC.classList.add('hidden'); tabL?.classList.add('active'); tabC?.classList.remove('active'); }
  else { viewC.classList.remove('hidden'); viewL.classList.add('hidden'); tabC?.classList.add('active'); tabL?.classList.remove('active'); }
}
tabL?.addEventListener('click',()=>ativarAba('L'));
tabC?.addEventListener('click',()=>ativarAba('C'));

// ---------- Persistência ----------
const DB_KEY='mr_remedios', CAL_KEY='mr_calendar';
const getAll=()=>JSON.parse(localStorage.getItem(DB_KEY)||'[]');
const saveAll=(a)=>localStorage.setItem(DB_KEY,JSON.stringify(a));
const getCal=()=>JSON.parse(localStorage.getItem(CAL_KEY)||'{}');
const saveCal=(o)=>localStorage.setItem(CAL_KEY,JSON.stringify(o));

// ---------- Perfil ----------
const boasVindas=document.getElementById('boasVindas');
const nomeInput=document.getElementById('nomeUsuario');
document.addEventListener('DOMContentLoaded',()=>{
  const nome=localStorage.getItem('mr_usuario')||'';
  if(nomeInput) nomeInput.value=nome;
  if(boasVindas && nome) boasVindas.textContent='Olá, '+nome+'!';
});
document.getElementById('formUser')?.addEventListener('submit',(e)=>{
  e.preventDefault();
  const nome=nomeInput.value.trim();
  localStorage.setItem('mr_usuario',nome);
  if(boasVindas) boasVindas.textContent='Olá, '+nome+'!';
});

// ---------- Chips ----------
function setupChips(){
  document.querySelectorAll('.chips').forEach(g=>{
    g.addEventListener('click',(ev)=>{
      const b=ev.target.closest('.chip'); if(!b) return;
      const isOutro = /Outro$/.test(b.dataset.value||'');
      if(isOutro){
        const id=b.dataset.value; const el=document.getElementById(id);
        if(el){ el.classList.toggle('hidden'); el.focus(); }
        return;
      }
      g.querySelectorAll('.chip').forEach(c=>c.classList.remove('selected'));
      b.classList.add('selected');
    });
  });
}
setupChips();
function chipValue(group){
  const g=document.querySelector('.chips[data-group="'+group+'"]');
  const sel=g?.querySelector('.chip.selected');
  if(sel) return sel.dataset.value;
  const outro=document.getElementById(group+'Outro');
  if(outro && !outro.classList.contains('hidden') && outro.value.trim()) return outro.value.trim();
  return '';
}

// ---------- Upload/Prévia fotos ----------
function fileToDataURL(f,cb){ const r=new FileReader(); r.onload=()=>cb(r.result); r.readAsDataURL(f); }
const fotoReceita=document.getElementById('fotoReceita');
const fotoMedicamento=document.getElementById('fotoMedicamento');
const prevReceita=document.getElementById('prevReceita');
const prevMedicamento=document.getElementById('prevMedicamento');
let fotoReceitaData='', fotoMedicamentoData='';
fotoReceita?.addEventListener('change',(e)=>{ const f=e.target.files?.[0]; if(!f) return; fileToDataURL(f,(d)=>{ fotoReceitaData=d; prevReceita.src=d; prevReceita.classList.remove('hidden'); }); });
fotoMedicamento?.addEventListener('change',(e)=>{ const f=e.target.files?.[0]; if(!f) return; fileToDataURL(f,(d)=>{ fotoMedicamentoData=d; prevMedicamento.src=d; prevMedicamento.classList.remove('hidden'); }); });

// ---------- CRUD Remédios ----------
const formMed=document.getElementById('formMed');
const listaDiv=document.getElementById('lista');
const editIdInput=document.getElementById('editId');
const btnCancelarEdicao=document.getElementById('btnCancelarEdicao');
const btnSalvar=document.getElementById('btnSalvar');

function renderLista(){
  const dados=getAll();
  if(!dados.length){ listaDiv.innerHTML='<p>Nenhum remédio cadastrado.</p>'; return; }
  listaDiv.innerHTML='';
  dados.forEach((r,idx)=>{
    const el=document.createElement('div');
    el.className='list-item'+(r.ativo?'':' item-paused');
    el.innerHTML='<div>'
      +'<div><strong>'+r.nome+'</strong> <span class="badge '+(r.ativo?'':'badge-paused')+'">'+(r.tipo||'')+'</span></div>'
      +'<div>'+(r.dose? r.dose+' · ' :'')+(r.qtd? r.qtd+' un · ' :'')+'horário: <strong>'+(r.hora||'--:--')+'</strong></div>'
      +'<div class="thumbs">'+(r.fotoReceita?'<a target="_blank" href="'+r.fotoReceita+'">📄 Receita</a>':'')+(r.fotoMedicamento?' <a target="_blank" href="'+r.fotoMedicamento+'">💊 Foto</a>':'')+'</div>'
      +'</div>'
      +'<div class="actions">'
      +'<button class="btn-icon toggle" title="Pausar/Ativar" data-idx="'+idx+'">'+(r.ativo?'🔔':'🔕')+'</button> '
      +'<button class="btn-icon edit" title="Editar" data-idx="'+idx+'">✏️</button> '
      +'<button class="btn-icon del" title="Excluir" data-idx="'+idx+'">❌</button> '
      +'<button class="btn-icon share" title="Compartilhar" data-idx="'+idx+'">📤</button>'
      +'</div>';
    listaDiv.appendChild(el);
  });

  // listeners de ação
  listaDiv.querySelectorAll('.toggle').forEach(b=>b.addEventListener('click',(ev)=>{
    const i=Number(ev.currentTarget.getAttribute('data-idx'));
    const arr=getAll(); arr[i].ativo=!arr[i].ativo; saveAll(arr); renderLista();
  }));
  listaDiv.querySelectorAll('.del').forEach(b=>b.addEventListener('click',(ev)=>{
    const i=Number(ev.currentTarget.getAttribute('data-idx'));
    const arr=getAll(); arr.splice(i,1); saveAll(arr); renderLista();
  }));
  listaDiv.querySelectorAll('.edit').forEach(b=>b.addEventListener('click',(ev)=>{
    const i=Number(ev.currentTarget.getAttribute('data-idx'));
    const arr=getAll(); const r=arr[i];
    editIdInput.value=r.id;
    document.getElementById('medNome').value=r.nome||'';
    document.getElementById('medHora').value=r.hora||'';
    document.querySelectorAll('.chip.selected').forEach(c=>c.classList.remove('selected'));
    selectChip('tipo',r.tipo); selectChip('dose',r.dose); selectChip('qtd',r.qtd);
    if(r.fotoReceita){ prevReceita.src=r.fotoReceita; prevReceita.classList.remove('hidden'); fotoReceitaData=r.fotoReceita; }
    if(r.fotoMedicamento){ prevMedicamento.src=r.fotoMedicamento; prevMedicamento.classList.remove('hidden'); fotoMedicamentoData=r.fotoMedicamento; }
    btnCancelarEdicao.classList.remove('hidden'); btnSalvar.textContent='Salvar alterações';
    window.scrollTo({top:0,behavior:'smooth'});
  }));

  // compartilhar (Web Share API ou WhatsApp)
  listaDiv.querySelectorAll('.share').forEach(b => b.addEventListener('click', ev => {
    const i = Number(ev.currentTarget.getAttribute('data-idx'));
    const r = getAll()[i]; if(!r) return;
    const texto = `💊 Lembrete: tomar ${r.nome}${r.dose ? ' ' + r.dose : ''} às ${r.hora}.`;
    const url = location.href;
    if (navigator.share) {
      navigator.share({ title: 'MeuRemédio', text: texto, url }).catch(()=>{});
    } else {
      const wa = 'https://wa.me/?text=' + encodeURIComponent(texto + ' ' + url);
      window.open(wa, '_blank');
    }
  }));
}
function selectChip(group,val){
  const g=document.querySelector('.chips[data-group="'+group+'"]'); if(!g) return;
  let ok=false;
  g.querySelectorAll('.chip').forEach(ch=>{ if(ch.dataset.value===val){ ch.classList.add('selected'); ok=true; } else ch.classList.remove('selected'); });
  if(!ok && val){ const outro=document.getElementById(group+'Outro'); if(outro){ outro.classList.remove('hidden'); outro.value=val; } }
}
btnCancelarEdicao?.addEventListener('click',()=>{
  editIdInput.value=''; formMed.reset();
  document.querySelectorAll('.chip.selected').forEach(c=>c.classList.remove('selected'));
  btnCancelarEdicao.classList.add('hidden'); btnSalvar.textContent='Salvar';
  if(prevReceita){ prevReceita.src=''; prevReceita.classList.add('hidden'); }
  if(prevMedicamento){ prevMedicamento.src=''; prevMedicamento.classList.add('hidden'); }
  fotoReceitaData=''; fotoMedicamentoData='';
});

formMed?.addEventListener('submit',(e)=>{
  e.preventDefault();
  const arr=getAll();
  const isEditing=!!editIdInput.value;
  const item={
    id: isEditing? editIdInput.value : String(Date.now()),
    nome: document.getElementById('medNome').value.trim(),
    tipo: chipValue('tipo')||'pílula',
    dose: chipValue('dose'),
    qtd: chipValue('qtd'),
    hora: document.getElementById('medHora').value,
    fotoReceita: fotoReceitaData,
    fotoMedicamento: fotoMedicamentoData,
    ativo: true
  };
  if(isEditing){ const idx=arr.findIndex(x=>x.id===editIdInput.value); if(idx>=0){ item.ativo=arr[idx].ativo; arr[idx]=item; } }
  else arr.push(item);
  saveAll(arr); renderLista();
  formMed.reset(); document.querySelectorAll('.chip.selected').forEach(c=>c.classList.remove('selected'));
  btnCancelarEdicao.classList.add('hidden'); btnSalvar.textContent='Salvar';
  if(prevReceita){ prevReceita.src=''; prevReceita.classList.add('hidden'); }
  if(prevMedicamento){ prevMedicamento.src=''; prevMedicamento.classList.add('hidden'); }
  fotoReceitaData=''; fotoMedicamentoData=''; editIdInput.value='';
  notificar('Lembrete salvo para '+item.nome+' às '+item.hora); tocarSom();
});

// ---------- Alerta sonoro + Notificação ----------
function tocarSom(){
  try{
    const ctx=new (window.AudioContext||window.webkitAudioContext)();
    const o=ctx.createOscillator(); const g=ctx.createGain();
    o.type='sine'; o.frequency.value=880; g.gain.value=0.1;
    o.connect(g); g.connect(ctx.destination); o.start(); setTimeout(()=>{o.stop();ctx.close();},250);
  }catch(e){ /* fallback silencioso */ }
}
function notificar(txt){
  if(window.Notification && Notification.permission==='granted'){
    new Notification('MeuRemédio',{ body: txt });
  }
}
Notification?.requestPermission?.();

// checagem por minuto
function checarAlarmes(){
  const arr=getAll(), d=new Date(), hh=String(d.getHours()).padStart(2,'0'), mm=String(d.getMinutes()).padStart(2,'0'), hhmm=hh+':'+mm;
  arr.forEach(r=>{ if(r.ativo && r.hora===hhmm){ notificar('Hora de tomar '+r.nome); tocarSom(); } });
  setTimeout(checarAlarmes,60000);
}
checarAlarmes(); renderLista();

// ---------- Calendário (bônus) ----------
const calDiv=document.getElementById('calendario');
const mesAnoEl=document.getElementById('mesAno');
const prevBtn=document.getElementById('prevMes');
const nextBtn=document.getElementById('proxMes');
const calData=document.getElementById('calData');
const calTexto=document.getElementById('calTexto');
const btnAddCal=document.getElementById('btnAddCal');
const calEventos=document.getElementById('calEventos');
let ref = new Date(); ref.setDate(1);

function desenharCal(){
  if(!calDiv) return;
  calDiv.innerHTML='';
  const ano=ref.getFullYear(), mes=ref.getMonth();
  mesAnoEl.textContent=ref.toLocaleDateString('pt-BR',{month:'long',year:'numeric'});
  const primeiro=new Date(ano,mes,1), inicioIdx=(primeiro.getDay()+6)%7, ultimoDia=new Date(ano,mes+1,0).getDate();
  const nomes=['S','T','Q','Q','S','S','D']; nomes.forEach(n=>{ const h=document.createElement('div'); h.className='dia'; h.style.fontWeight='bold'; h.textContent=n; calDiv.appendChild(h); });
  for(let i=0;i<inicioIdx;i++){ const b=document.createElement('div'); b.className='dia'; calDiv.appendChild(b); }
  const calObj=getCal();
  for(let d=1; d<=ultimoDia; d++){
    const cell=document.createElement('div'); cell.className='dia';
    const num=document.createElement('div'); num.className='num'; num.textContent=d; cell.appendChild(num);
    const dataStr=ano+'-'+String(mes+1).padStart(2,'0')+'-'+String(d).padStart(2,'0');
    const eventos=calObj[dataStr]||[];
    if(eventos.length){ const m=document.createElement('div'); m.className='marcado'; m.textContent=eventos.length+' ev.'; cell.appendChild(m); }
    cell.addEventListener('click',()=>{ calData.value=dataStr; listarEventosDia(dataStr); });
    calDiv.appendChild(cell);
  }
}
function listarEventosDia(dataStr){
  const all=getCal(); const evs=all[dataStr]||[];
  calEventos.innerHTML='<h4>Eventos em '+dataStr+'</h4>'+(evs.length?'':'<p>Nenhum evento.</p>');
  evs.forEach((e,i)=>{
    const div=document.createElement('div'); div.className='dia ev'; div.style.padding='8px'; div.style.borderRadius='10px'; div.style.border='1px solid #bbf7d0'; div.textContent=e;
    const bt=document.createElement('button'); bt.textContent='Excluir'; bt.className='btn-icon'; bt.style.marginLeft='8px';
    bt.addEventListener('click',()=>{ evs.splice(i,1); all[dataStr]=evs; saveCal(all); listarEventosDia(dataStr); desenharCal(); });
    div.appendChild(bt); calEventos.appendChild(div);
  });
}
prevBtn?.addEventListener('click',()=>{ ref.setMonth(ref.getMonth()-1); desenharCal(); });
nextBtn?.addEventListener('click',()=>{ ref.setMonth(ref.getMonth()+1); desenharCal(); });
btnAddCal?.addEventListener('click',()=>{
  const d=calData.value; const t=calTexto.value.trim(); if(!d||!t) return;
  const all=getCal(); all[d]=all[d]||[]; all[d].push(t); saveCal(all);
  calTexto.value=''; listarEventosDia(d); desenharCal();
});
desenharCal();

// ---------- Service Worker (PWA) ----------
if('serviceWorker' in navigator){
  window.addEventListener('load', ()=>{
    navigator.serviceWorker.register('service-worker.js');
  });
}

// ---------- Botão "Instalar app" (precisa existir no HTML) ----------
let deferredPrompt;
const btnInstall = document.getElementById('btnInstall');
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  if (btnInstall) btnInstall.style.display = 'inline-block';
});
btnInstall?.addEventListener('click', async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
  btnInstall.style.display = 'none';
});

