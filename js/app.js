// ==== Instalação PWA ====
// Mostra botão "Instalar app" quando disponível no navegador
let deferredPrompt;
const btnInstall = document.getElementById('btnInstall');

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault(); // impede prompt automático
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

// ==== Compartilhar ====
// Adiciona botão 📤 pra compartilhar lembrete
// Dentro de renderLista, adicione o botão na área de ações:
// + '<button class="btn-icon share" title="Compartilhar" data-idx="'+idx+'">📤</button>'
// Depois, adicione este listener abaixo (fora do loop principal):

document.addEventListener('click', function (e) {
  if (!e.target.classList.contains('share')) return;
  const i = Number(e.target.getAttribute('data-idx'));
  const r = getAll()[i];
  if (!r) return;

  const texto = `💊 Lembrete: tomar ${r.nome}${r.dose ? ' ' + r.dose : ''} às ${r.hora}.`;
  const url = location.href;

  if (navigator.share) {
    navigator.share({
      title: 'MeuRemédio',
      text: texto,
      url: url
    }).catch(() => {});
  } else {
    const wa = 'https://wa.me/?text=' + encodeURIComponent(texto + ' ' + url);
    window.open(wa, '_blank');
  }
});

