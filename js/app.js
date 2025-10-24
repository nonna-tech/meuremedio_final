/* MeuRemédio – upgrade orientado por acessibilidade */
// Tabs
const tabL = document.getElementById('tabLembretes');
const tabC = document.getElementById('tabCalendario');
const tabR = document.getElementById('tabReceitas');
const viewL = document.getElementById('viewLembretes');
const viewC = document.getElementById('viewCalendario');
const viewR = document.getElementById('viewReceitas');

function show(view, ok){ if(!view) return; view.classList.toggle('hidden', !ok); }
function ativa(qual){ show(viewL, qual==='L'); show(viewC, qual==='C'); show(viewR, qual==='R');
  tabL.classList.toggle('active', qual==='L'); tabC.classList.toggle('active', qual==='C'); tabR.classList.toggle('active', qual==='R'); }
tabL.addEventListener('click',()=>ativa('L'));
tabC.addEventListener('click',()=>ativa('C'));
tabR.addEventListener('click',()=>ativa('R'));
ativa('L');

/* ========= Acessibilidade ========= */
const painel = document.getElementById('painelA11y');
document.getElementById('btnOpenA11y').onclick = ()=> painel.classList.add('aberto');
document.getElementById('btnFecharA11y').onclick = ()=> painel.classList.remove('aberto');

const LS = (k,v)=> v===undefined ? JSON.parse(localStorage.getItem(k)||'null') : localStorage.setItem(k, JSON.stringify(v));
const optSimplificada = document.getElementById('optSimplificada');
const optAltoContraste = document.getElementById('optAltoContraste');
const optModoEscuro = document.getElementById('optModoEscuro');
const fontRange = document.getElementById('fontRange');

function applyPrefs(){
  document.body.classList.toggle('simplificada', !!LS('mr_simplificada'));
  document.body.classList.toggle('altocontraste', !!LS('mr_altocontraste'));
  document.body.classList.toggle('modoescuro', !!LS('mr_modoescuro'));
  document.documentElement.style.fontSize = (LS('mr_fontsize')||18) + 'px';
  optSimplificada.checked = !!LS('mr_simplificada');
  optAltoContraste.checked = !!LS('mr_altocontraste');
  optModoEscuro.checked = !!LS('mr_modoescuro');
  fontRange.value = LS('mr_fontsize')||18;
}
applyPrefs();
optSimplificada.onchange = ()=>{ LS('mr_simplificada', optSimplificada.checked); applyPrefs(); }
optAltoContraste.onchange = ()=>{ LS('mr_altocontraste', optAltoContraste.checked); applyPrefs(); }
optModoEscuro.onchange = ()=>{ LS('mr_modoescuro', optModoEscuro.checked); applyPrefs(); }
fontRange.oninput = ()=>{ LS('mr_fontsize', +fontRange.value); applyPrefs(); }

// Ler página (TTS)
document.getElementById('btnReadPage').onclick = ()=>{
  try{
    const utter = new SpeechSynthesisUtterance(document.querySelector('main').innerText);
    utter.lang = 'pt-BR';
    speechSynthesis.cancel(); speechSynthesis.speak(utter);
  }catch(e){ alert('Leitura por voz não suportada neste dispositivo.'); }
};

// Ditado de voz (SpeechRecognition)
function attachVoiceButtons(){
  document.querySelectorAll('.btn-voice').forEach(btn=>{
    const targetId = btn.dataset.para;
    btn.onclick = ()=>{
      const input = document.getElementById(targetId);
      if(!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)){
        alert('Ditado por voz não suportado neste dispositivo.'); return;
      }
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      const rec = new SR(); rec.lang='pt-BR'; rec.interimResults=false; rec.maxAlternatives=1;
      rec.onresult = (e)=>{ input.value = e.results[0][0].transcript; input.focus(); };
      rec.start();
    };
  });
}
attachVoiceButtons();

/* ========= Dados ========= */
const DB_KEY='mr_remedios', CAL_KEY='mr_calendar', FOTOS_KEY='mr_fotos';
const getAll=()=>JSON.parse(localStorage.getItem(DB_KEY)||'[]');
const saveAll=(a)=>localStorage.setItem(DB_KEY,JSON.stringify(a));
const getCal=()=>JSON.parse(localStorage.getItem(CAL_KEY)||'{}');
const saveCal=(o)=>localStorage.setItem(CAL_KEY,JSON.stringify(o));
const getFotos=()=>JSON.parse(localStorage.getItem(FOTOS_KEY)||'[]');
const saveFotos=(a)=>localStorage.setItem(FOTOS_KEY,JSON.stringify(a));

/* ========= Perfil ========= */
const boasVindas=document.getElementById('boasVindas');
const nomeInput=document.getElementById('nomeUsuario');
document.addEventListener('DOMContentLoaded',()=>{
  const nome=localStorage.getItem('mr_usuario')||'';
  if(nomeInput) nomeInput.value=nome;
  if(boasVindas && nome) boasVindas.textContent='Olá, '+nome+'!';
});
document.getElementById('formUser').addEventListener('submit',(e)=>{
  e.preventDefault();
  const nome=nomeInput.value.trim();
  localStorage.setItem('mr_usuario',nome);
  boasVindas.textContent='Olá, '+nome+'!';
});

/* ========= Chips (seleção) ========= */
function setupChips(){
  document.querySelectorAll('.chips').forEach(g=>{
    g.addEventListener('click',(ev)=>{
      const b=ev.target.closest('.chip'); if(!b) return;
      const isOutro = /Outro$/.test(b.dataset.value||'');
      if(isOutro){ const id=b.dataset.value; const el=document.getElementById(id);
        if(el){ el.classList.toggle('hidden'); el.focus(); } return; }
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

/* ========= Upload/Compressão de fotos ========= */
function fileToDataURL(file, cb, maxW = 1024, quality = 0.8) {
  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.onload = () => {
      if (img.width <= maxW) return cb(reader.result);
      const scale = maxW / img.width;
      const canvas = document.createElement('canvas');
      canvas.width = maxW; canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext('2d'); ctx.drawImage(img,0,0,canvas.width,canvas.height);
      cb(canvas.toDataURL('image/jpeg', quality));
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
}
let recData2='', medData2='';
document.getElementById('inpFotoReceita2').addEventListener('change',(e)=>{
  const f=e.target.files?.[0]; if(!f) return; fileToDataURL(f,(d)=>{ recData2=d; const img=document.getElementById('prevRec2'); img.src=d; img.classList.remove('hidden'); });
});
document.getElementById('inpFotoMed2').addEventListener('change',(e)=>{
  const f=e.target.files?.[0]; if(!f) return; fileToDataURL(f,(d)=>{ medData2=d; const img=document.getElementById('prevMed2'); img.src=d; img.classList.remove('hidden'); });
});

/* ========= CRUD Lembretes ========= */
const formMed=document.getElementById('formMed');
const listaDiv=document.getElementById('lista');
const editIdInput=document.getElementById('editId');
const btnCancelarEdicao=document.getElementById('btnCancelarEdicao');
const btnSalvar=document.getElementById('btnSalvar');

function renderLista(){
  const dados=getAll();
  if(!dados.length){ listaDiv.innerHTML='<p class="note">Nenhum remédio cadastrado.</p>'; return; }
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
      +'</div>';
    listaDiv.appendChild(el);
  });
  listaDiv.querySelectorAll('.toggle').forEach(b=>b.addEventListener('click',(ev)=>{
    const i=+ev.currentTarget.getAttribute('data-idx'); const arr=getAll(); arr[i].ativo=!arr[i].ativo; saveAll(arr); renderLista();
  }));
  listaDiv.querySelectorAll('.del').forEach(b=>b.addEventListener('click',(ev)=>{
    const i=+ev.currentTarget.getAttribute('data-idx'); const arr=getAll(); arr.splice(i,1); saveAll(arr); renderLista();
  }));
  listaDiv.querySelectorAll('.edit').forEach(b=>b.addEventListener('click',(ev)=>{
    const i=+ev.currentTarget.getAttribute('data-idx'); const arr=getAll(); const r=arr[i];
    editIdInput.value=r.id;
    document.getElementById('medNome').value=r.nome||'';
    document.getElementById('medHora').value=r.hora||'';
    document.querySelectorAll('.chip.selected').forEach(c=>c.classList.remove('selected'));
    selectChip('tipo',r.tipo); selectChip('dose',r.dose); selectChip('qtd',r.qtd);
    btnCancelarEdicao.classList.remove('hidden'); btnSalvar.textContent='Salvar alterações';
    window.scrollTo({top:0,behavior:'smooth'});
  }));
}
function selectChip(group,val){
  const g=document.querySelector('.chips[data-group="'+group+'"]'); if(!g) return;
  let ok=false; g.querySelectorAll('.chip').forEach(ch=>{ if(ch.dataset.value===val){ ch.classList.add('selected'); ok=true; } else ch.classList.remove('selected'); });
  if(!ok && val){ const outro=document.getElementById(group+'Outro'); if(outro){ outro.classList.remove('hidden'); outro.value=val; } }
}
btnCancelarEdicao.addEventListener('click',()=>{
  editIdInput.value=''; formMed.reset();
  document.querySelectorAll('.chip.selected').forEach(c=>c.classList.remove('selected'));
  btnCancelarEdicao.classList.add('hidden'); btnSalvar.textContent='Salvar';
});
formMed.addEventListener('submit',(e)=>{
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
});

/* ========= Lembretes – alerta sonoro + notificação ========= */
function tocarSom(){
  try{
    const ctx=new (window.AudioContext||window.webkitAudioContext)();
    const o=ctx.createOscillator(); const g=ctx.createGain();
    o.type='sine'; o.frequency.value=880; g.gain.value=0.1;
    o.connect(g); g.connect(ctx.destination); o.start(); setTimeout(()=>{o.stop();ctx.close();},250);
  }catch(e){}
}
function notificar(txt){ if('Notification' in window && Notification.permission==='granted'){ new Notification('MeuRemédio',{ body: txt }); } }
Notification?.requestPermission?.();

function checarAlarmes(){
  const arr=getAll(), d=new Date(), hh=String(d.getHours()).padStart(2,'0'), mm=String(d.getMinutes()).padStart(2,'0'), hhmm=hh+':'+mm;
  arr.forEach(r=>{ if(r.ativo && r.hora===hhmm){ notificar('Hora de tomar '+r.nome); tocarSom(); } });
  setTimeout(checarAlarmes,60000);
}
checarAlarmes(); renderLista();

/* ========= Calendário ========= */
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
  calEventos.innerHTML='<h4>Eventos em '+dataStr+'</h4>'+(evs.length?'':'<p class="note">Nenhum evento.</p>');
  evs.forEach((e,i)=>{
    const div=document.createElement('div'); div.className='dia ev'; div.style.padding='8px'; div.style.borderRadius='10px'; div.style.border='1px solid #bbf7d0'; div.textContent=e;
    const bt=document.createElement('button'); bt.textContent='Excluir'; bt.className='btn-icon'; bt.style.marginLeft='8px';
    bt.addEventListener('click',()=>{ evs.splice(i,1); all[dataStr]=evs; saveCal(all); listarEventosDia(dataStr); desenharCal(); });
    div.appendChild(bt); calEventos.appendChild(div);
  });
}
prevBtn.addEventListener('click',()=>{ ref.setMonth(ref.getMonth()-1); desenharCal(); });
nextBtn.addEventListener('click',()=>{ ref.setMonth(ref.getMonth()+1); desenharCal(); });
btnAddCal.addEventListener('click',()=>{
  const d=calData.value; const t=calTexto.value.trim(); if(!d||!t) return;
  const all=getCal(); all[d]=all[d]||[]; all[d].push(t); saveCal(all);
  calTexto.value=''; listarEventosDia(d); desenharCal();
});
desenharCal();

/* ========= Receitas ========= */
const formFoto = document.getElementById('formFoto');
const fotoId = document.getElementById('fotoId');
const fotoNome = document.getElementById('fotoNome');
const fotoData = document.getElementById('fotoData');
const fotoObs  = document.getElementById('fotoObs');
const galeria  = document.getElementById('galeria');
const btnCancelFoto = document.getElementById('btnCancelFoto');
function renderGaleria(){
  const arr = getFotos();
  if(!arr.length){ galeria.innerHTML='<p class="note">Nenhum registro salvo.</p>'; return; }
  galeria.innerHTML='';
  arr.forEach((it,idx)=>{
    const card=document.createElement('div');
    card.className='list-item';
    let thumbs='';
    if(it.rec){ thumbs+=`<img src="${it.rec}" alt="Receita" style="width:72px;height:72px;object-fit:cover;border:1px solid #bbf7d0;border-radius:10px;margin-right:6px" />`; }
    if(it.med){ thumbs+=`<img src="${it.med}" alt="Medicamento" style="width:72px;height:72px;object-fit:cover;border:1px solid #bbf7d0;border-radius:10px;margin-right:6px" />`; }
    const links = `${it.rec? `<a target="_blank" href="${it.rec}">📄 Receita</a>`:''}${it.med? ` <a target="_blank" href="${it.med}">💊 Foto medicamento</a>`:''}`;
    card.innerHTML = `<div>
        <div><strong>${it.nome||'Sem título'}</strong> ${it.data?`<span class="badge">${it.data}</span>`:''}</div>
        ${it.obs? `<div class="note">${it.obs}</div>`:''}
        <div class="thumbs" style="display:flex;align-items:center;margin:6px 0">${thumbs}</div>
        <div class="links">${links}</div>
      </div>
      <div class="actions">
        <button class="btn-icon editR" data-idx="${idx}">✏️</button>
        <button class="btn-icon delR"  data-idx="${idx}">❌</button>
      </div>`;
    galeria.appendChild(card);
  });
  galeria.querySelectorAll('.delR').forEach(b=>b.addEventListener('click',(ev)=>{
    const i=+ev.currentTarget.getAttribute('data-idx'); const arr=getFotos(); arr.splice(i,1); saveFotos(arr); renderGaleria();
  }));
  galeria.querySelectorAll('.editR').forEach(b=>b.addEventListener('click',(ev)=>{
    const i=+ev.currentTarget.getAttribute('data-idx'); const arr=getFotos(); const it=arr[i];
    fotoId.value=it.id; fotoNome.value=it.nome||''; fotoData.value=it.data||''; fotoObs.value=it.obs||'';
    if(it.rec){ const img=document.getElementById('prevRec2'); img.src=it.rec; img.classList.remove('hidden'); recData2=it.rec; }
    if(it.med){ const img=document.getElementById('prevMed2'); img.src=it.med; img.classList.remove('hidden'); medData2=it.med; }
    btnCancelFoto.classList.remove('hidden'); window.scrollTo({top:0,behavior:'smooth'});
  }));
}
btnCancelFoto.addEventListener('click',()=>{
  fotoId.value=''; formFoto.reset(); btnCancelFoto.classList.add('hidden');
  document.getElementById('prevRec2').classList.add('hidden'); document.getElementById('prevMed2').classList.add('hidden');
  recData2=''; medData2='';
});
formFoto.addEventListener('submit',(e)=>{
  e.preventDefault();
  const arr=getFotos();
  const isEdit=!!fotoId.value;
  const item={ id: isEdit? fotoId.value : String(Date.now()), nome: fotoNome.value.trim(), data: fotoData.value||'', obs:  fotoObs.value.trim(), rec:  recData2, med:  medData2 };
  if(isEdit){ const idx=arr.findIndex(x=>x.id===fotoId.value); if(idx>=0) arr[idx]=item; } else arr.push(item);
  saveFotos(arr); renderGaleria();
  formFoto.reset(); fotoId.value=''; btnCancelFoto.classList.add('hidden');
  document.getElementById('prevRec2').classList.add('hidden'); document.getElementById('prevMed2').classList.add('hidden'); recData2=''; medData2='';
});
renderGaleria();

/* ========= Assistente (wizard) ========= */
const overlay = document.getElementById('assistente');
const steps = overlay.querySelectorAll('.passo');
function openAssistente(){ overlay.classList.remove('hidden'); setStep(1); }
function setStep(n){ steps.forEach(s=>s.classList.toggle('ativo', +s.dataset.step===n)); }
document.getElementById('btnAssistente').onclick = openAssistente;
document.getElementById('assistenteFechar').onclick = ()=> overlay.classList.add('hidden');
overlay.querySelectorAll('.next').forEach(b=> b.onclick = ()=> setStep([...steps].find(s=>s.classList.contains('ativo')) ? ( +[...steps].find(s=>s.classList.contains('ativo')).dataset.step + 1 ) : 1 ));
overlay.querySelectorAll('.prev').forEach(b=> b.onclick = ()=> setStep(Math.max(1, +[...steps].find(s=>s.classList.contains('ativo')).dataset.step - 1)));
document.getElementById('assistSalvar').onclick = ()=>{
  const nome = document.getElementById('aNome').value.trim();
  let dose = overlay.querySelector('.chips[data-group="aDose"] .chip.selected')?.dataset.value || document.getElementById('aDoseOutro').value.trim() || '';
  const hora = document.getElementById('aHora').value;
  if(!nome || !hora){ alert('Preencha nome e horário.'); return; }
  const arr=getAll(); arr.push({ id:String(Date.now()), nome, tipo:'pílula', dose, qtd:'1', hora, ativo:true }); saveAll(arr);
  overlay.classList.add('hidden'); renderLista(); ativa('L');
};
// seleção chips no assistente
overlay.querySelector('.chips[data-group="aDose"]').addEventListener('click', (ev)=>{
  const b=ev.target.closest('.chip'); if(!b) return;
  overlay.querySelectorAll('.chips[data-group="aDose"] .chip').forEach(x=>x.classList.remove('selected'));
  b.classList.add('selected');
});

/* ========= PWA Install ========= */
let deferredPrompt; const btnInstall = document.getElementById('btnInstall');
window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); deferredPrompt = e; btnInstall.style.display='inline-block'; });
btnInstall?.addEventListener('click', async () => { if (!deferredPrompt) return; deferredPrompt.prompt(); await deferredPrompt.userChoice; deferredPrompt = null; btnInstall.style.display = 'none'; });

/* ========= SW ========= */
if('serviceWorker' in navigator){
  window.addEventListener('load', ()=>{ navigator.serviceWorker.register('service-worker.js'); });
}
