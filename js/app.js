// --- ACESSIBILIDADE (INTEGRAÇÃO DO PROJETO MODELO) ---
const painelAcessibilidade = document.getElementById('painelAcessibilidade');
const btnAbrirPainel = document.getElementById('btnAbrirPainel');
const btnFecharPainel = document.getElementById('fecharPainel');
const toggleModoEscuro = document.getElementById('toggleModoEscuro');
const toggleAltoContraste = document.getElementById('toggleAltoContraste');
const btnLerPagina = document.getElementById('btnLerPagina');
const body = document.body; // Referência ao body para aplicar classes

// 1. Persistência de Acessibilidade
function getAcessibilidade() {
    return JSON.parse(localStorage.getItem('mr_acessibilidade') || '{}');
}
function saveAcessibilidade(config) {
    localStorage.setItem('mr_acessibilidade', JSON.stringify(config));
}

// 2. Aplica as classes salvas ao iniciar
function aplicarAcessibilidade() {
    const config = getAcessibilidade();
    body.classList.toggle('modo-escuro', config.modoEscuro || false);
    body.classList.toggle('alto-contraste', config.altoContraste || false);

    toggleModoEscuro.textContent = config.modoEscuro ? 'Modo Escuro (Desativar)' : 'Modo Escuro (Ativar)';
    toggleAltoContraste.textContent = config.altoContraste ? 'Alto Contraste (Desativar)' : 'Alto Contraste (Ativar)';
}
document.addEventListener('DOMContentLoaded', aplicarAcessibilidade);


// 3. Listeners do Painel
btnAbrirPainel?.addEventListener('click', () => {
    painelAcessibilidade.classList.remove('hidden');
    // Foco no painel para acessibilidade por teclado/leitores de tela
    setTimeout(() => { painelAcessibilidade.focus(); }, 100); 
});
btnFecharPainel?.addEventListener('click', () => {
    painelAcessibilidade.classList.add('hidden');
});

// 4. Toggle Modo Escuro
toggleModoEscuro?.addEventListener('click', () => {
    const config = getAcessibilidade();
    config.modoEscuro = !config.modoEscuro;
    config.altoContraste = false; // Desativa o Alto Contraste ao ligar/desligar o Modo Escuro
    saveAcessibilidade(config);
    aplicarAcessibilidade();
});

// 5. Toggle Alto Contraste
toggleAltoContraste?.addEventListener('click', () => {
    const config = getAcessibilidade();
    config.altoContraste = !config.altoContraste;
    config.modoEscuro = false; // Desativa o Modo Escuro ao ligar/desligar o Alto Contraste
    saveAcessibilidade(config);
    aplicarAcessibilidade();
});


// 6. Text-to-Speech (Leitura da Página)
function lerPagina() {
    if (!('speechSynthesis' in window)) {
        alert('Seu navegador não suporta leitura de voz. Tente Chrome ou Edge.');
        return;
    }
    window.speechSynthesis.cancel();
    // Seleciona o texto principal para leitura
    const textoCompleto = document.title + '. ' + Array.from(document.querySelectorAll('h1, h2, h3, p, label, button.tabbtn, strong')).map(el => el.textContent.trim()).join('. ');
    
    // Filtra textos duplicados ou vazios e remove emojis para leitura
    const textoUnico = Array.from(new Set(textoCompleto.split('. ')))
                        .filter(t => t.length > 5 && !t.includes('Instalar app') && !t.includes('instalar'))
                        .join('. ');

    const utterance = new SpeechSynthesisUtterance(textoUnico);
    utterance.lang = 'pt-BR';
    window.speechSynthesis.speak(utterance);
}
btnLerPagina?.addEventListener('click', lerPagina);


// 7. Voice Input (simulado)
document.querySelectorAll('.btn-voz').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const inputId = e.currentTarget.getAttribute('data-para');
        const input = document.getElementById(inputId);
        if (!input) return;

        // Esta é uma simulação da funcionalidade de voz.
        // A implementação real requer a Web Speech API (SpeechRecognition) e tratamento de permissões.
        alert(`🎤 Função de entrada por voz ativada para o campo: ${input.placeholder || input.labels?.[0]?.textContent.trim() || input.id}.\nNo seu projeto, você precisará de JavaScript avançado (SpeechRecognition API) para a integração real.`);
        input.focus();
    });
});
// --- FIM ACESSIBILIDADE ---


/* =========================
   MeuRemédio – app.js (CÓDIGO ORIGINAL)
========================= */

// ---------- Abas ----------
const tabL = document.getElementById('tabLembretes');
const tabC = document.getElementById('tabCalendario');
const tabR = document.getElementById('tabReceitas');

const viewL = document.getElementById('viewLembretes');
const viewC = document.getElementById('viewCalendario');
const viewR = document.getElementById('viewReceitas');

function show(view, isActive) {
  if (!view) return;
  if (isActive) view.classList.remove('hidden');
  else view.classList.add('hidden');
}

function ativarAba(alvo) {
  show(viewL, alvo === 'L');
  show(viewC, alvo === 'C');
  show(viewR, alvo === 'R');

  tabL?.classList.toggle('active', alvo === 'L');
  tabC?.classList.toggle('active', alvo === 'C');
  tabR?.classList.toggle('active', alvo === 'R');
}

// listeners
tabL?.addEventListener('click', () => ativarAba('L'));
tabC?.addEventListener('click', () => ativarAba('C'));
tabR?.addEventListener('click', () => ativarAba('R'));

// estado inicial
ativarAba('L');


// ---------- Persistência ----------
const DB_KEY='mr_remedios', CAL_KEY='mr_calendar', FOTOS_KEY='mr_fotos';
const getAll=()=>JSON.parse(localStorage.getItem(DB_KEY)||'[]');
const saveAll=(a)=>localStorage.setItem(DB_KEY,JSON.stringify(a));
const getCal=()=>JSON.parse(localStorage.getItem(CAL_KEY)||'{}');
const saveCal=(o)=>localStorage.setItem(CAL_KEY,JSON.stringify(o));
const getFotos=()=>JSON.parse(localStorage.getItem(FOTOS_KEY)||'[]');
const saveFotos=(a)=>localStorage.setItem(FOTOS_KEY,JSON.stringify(a));

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

// ---------- Upload/Prévia fotos (helpers) ----------
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
      +'</div>'
      +'<div class="actions">'
      +'<button class="btn-icon toggle" title="Pausar/Ativar" data-idx="'+idx+'">'+(r.ativo?'🔔':'🔕')+'</button> '
      +'<button class="btn-icon edit" title="Editar" data-idx="'+idx+'">✏️</button> '
      +'<button class="btn-icon del" title="Excluir" data-idx="'+idx+'">❌</button> '
      +'<button class="btn-icon share" title="Compartilhar" data-idx="'+idx+'">📤</button>'
      +'</div>';
    listaDiv.appendChild(el);
  });

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
    btnCancelarEdicao.classList.remove('hidden'); btnSalvar.textContent='Salvar alterações';
    window.scrollTo({top:0,behavior:'smooth'});
  }));

  // compartilhar
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
    ativo: true
  };
  if(isEditing){ const idx=arr.findIndex(x=>x.id===editIdInput.value); if(idx>=0){ item.ativo=arr[idx].ativo; arr[idx]=item; } }
  else arr.push(item);
  saveAll(arr); renderLista();
  formMed.reset(); document.querySelectorAll('.chip.selected').forEach(c=>c.classList.remove('selected'));
  btnCancelarEdicao.classList.add('hidden'); btnSalvar.textContent='Salvar';
  notificar('Lembrete salvo para '+item.nome+' às '+item.hora); tocarSom();
});

// ---------- Alerta sonoro + Notificação ----------
function tocarSom(){
  try{
    const ctx=new (window.AudioContext||window.webkitAudioContext)();
    const o=ctx.createOscillator(); const g=ctx.createGain();
    o.type='sine'; o.frequency.value=880; g.gain.value=0.1;
    o.connect(g); g.connect(ctx.destination); o.start(); setTimeout(()=>{o.stop();ctx.close();},250);
  }catch(e){}
}
function notificar(txt){
  if(window.Notification && Notification.permission==='granted'){
    new Notification('MeuRemédio',{ body: txt });
  }
}
Notification?.requestPermission?.();

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

// ---------- Receitas e Fotos (nova aba) ----------
const formFoto = document.getElementById('formFoto');
const fotoId = document.getElementById('fotoId');
const fotoNome = document.getElementById('fotoNome');
const fotoData = document.getElementById('fotoData');
const fotoObs  = document.getElementById('fotoObs');
const galeria  = document.getElementById('galeria');
const inpRec2  = document.getElementById('inpFotoReceita2');
const inpMed2  = document.getElementById('inpFotoMed2');
const prevRec2 = document.getElementById('prevRec2');
const prevMed2 = document.getElementById('prevMed2');
const btnCancelFoto = document.getElementById('btnCancelFoto');

let recData2='', medData2='';
inpRec2?.addEventListener('change',(e)=>{ const f=e.target.files?.[0]; if(!f) return; fileToDataURL(f,(d)=>{ recData2=d; prevRec2.src=d; prevRec2.classList.remove('hidden'); }); });
inpMed2?.addEventListener('change',(e)=>{ const f=e.target.files?.[0]; if(!f) return; fileToDataURL(f,(d)=>{ medData2=d; prevMed2.src=d; prevMed2.classList.remove('hidden'); }); });

function renderGaleria(){
  const arr = getFotos();
  if(!arr.length){ galeria.innerHTML='<p class="note">Nenhum registro salvo.</p>'; return; }
  galeria.innerHTML='';
  arr.forEach((it,idx)=>{
    const card=document.createElement('div');
    card.className='list-item';
    let imgs='';
    if(it.rec){ imgs+=`<a target="_blank" href="${it.rec}">📄 Receita</a>  `; }
    if(it.med){ imgs+=`<a target="_blank" href="${it.med}">💊 Foto medicamento</a>`; }
    card.innerHTML = `
      <div>
        <div><strong>${it.nome}</strong> ${it.data?`<span class="badge">${it.data}</span>`:''}</div>
        ${it.obs? `<div class="note">${it.obs}</div>`:''}
        <div class="thumbs">${imgs}</div>
      </div>
      <div class="actions">
        <button class="btn-icon editR" data-idx="${idx}">✏️</button>
        <button class="btn-icon delR"  data-idx="${idx}">❌</button>
      </div>
    `;
    galeria.appendChild(card);
  });
  galeria.querySelectorAll('.delR').forEach(b=>b.addEventListener('click',(ev)=>{
    const i=+ev.currentTarget.getAttribute('data-idx'); const arr=getFotos(); arr.splice(i,1); saveFotos(arr); renderGaleria();
  }));
  galeria.querySelectorAll('.editR').forEach(b=>b.addEventListener('click',(ev)=>{
    const i=+ev.currentTarget.getAttribute('data-idx'); const arr=getFotos(); const it=arr[i];
    fotoId.value=it.id; fotoNome.value=it.nome||''; fotoData.value=it.data||''; fotoObs.value=it.obs||'';
    if(it.rec){ prevRec2.src=it.rec; prevRec2.classList.remove('hidden'); recData2=it.rec; }
    if(it.med){ prevMed2.src=it.med; prevMed2.classList.remove('hidden'); medData2=it.med; }
    btnCancelFoto?.classList.remove('hidden');
    window.scrollTo({top:0,behavior:'smooth'});
  }));
}
btnCancelFoto?.addEventListener('click',()=>{
  fotoId.value=''; formFoto.reset(); btnCancelFoto.classList.add('hidden');
  prevRec2?.classList.add('hidden'); prevMed2?.classList.add('hidden'); recData2=''; medData2='';
});
formFoto?.addEventListener('submit',(e)=>{
  e.preventDefault();
  const arr=getFotos();
  const isEdit=!!fotoId.value;
  const item={
    id: isEdit? fotoId.value : String(Date.now()),
    nome: fotoNome.value.trim(),
    data: fotoData.value||'',
    obs:  fotoObs.value.trim(),
    rec:  recData2,
    med:  medData2
  };
  if(isEdit){ const idx=arr.findIndex(x=>x.id===fotoId.value); if(idx>=0) arr[idx]=item; }
  else arr.push(item);
  saveFotos(arr); renderGaleria();
  formFoto.reset(); fotoId.value=''; btnCancelFoto.classList.add('hidden');
  prevRec2?.classList.add('hidden'); prevMed2?.classList.add('hidden'); recData2=''; medData2='';
});

renderGaleria();

// ---------- Service Worker (PWA) ----------
if('serviceWorker' in navigator){
  window.addEventListener('load', ()=>{
    navigator.serviceWorker.register('service-worker.js');
  });
}

// ---------- Botão "Instalar app" ----------
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
