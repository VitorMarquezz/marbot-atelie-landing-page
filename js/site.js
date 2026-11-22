/* Marbot Ateliê · carrossel de doces e vídeo do Tropical (JavaScript puro, sem dependências) */
(function () {
  'use strict';

  // Safari e iPhone não exibem WebM com transparência: usam o WebP animado
  var ua = navigator.userAgent || '';
  var semAlfa = /iP(hone|ad|od)/.test(ua) || /^((?!chrome|chromium|crios|fxios|android|edg).)*safari/i.test(ua);
  if (semAlfa) {
    document.documentElement.classList.add('sem-alfa');
    // só o Safari/iPhone baixa a animação em WebP
    var anim = document.querySelector('img.mb-so-safari');
    if (anim) anim.src = anim.getAttribute('data-src');
  }

  // garante o vídeo tocando mudo e em loop
  var video = document.querySelector('video.mb-so-alfa');
  if (video && !semAlfa) {
    // só os navegadores que mostram vídeo transparente baixam o WebM
    video.src = video.getAttribute('data-src');
    video.muted = true;
    var tocar = function () { var p = video.play(); if (p && p.catch) p.catch(function () {}); };
    video.addEventListener('canplay', tocar);
    video.addEventListener('pause', function () { if (!document.hidden) tocar(); });
    tocar();
  }

  // ---- dados dos doces ----
  const P = {
        laranja: { bg: '#d46336', titulo: '#0f1a36', texto: '#0f1a36', foto: 'rgba(15,26,54,0.18)', botaoBg: '#0f1a36', botaoTexto: '#f3efe9' },
        azul:    { bg: '#1d395e', titulo: '#f3efe9', texto: '#f3efe9', foto: 'rgba(243,239,233,0.12)', botaoBg: '#d46336', botaoTexto: '#0f1a36' },
        noite:   { bg: '#0f1a36', titulo: '#f3efe9', texto: '#f3efe9', foto: 'rgba(243,239,233,0.12)', botaoBg: '#d46336', botaoTexto: '#0f1a36' },
        creme:   { bg: '#f3efe9', titulo: '#1d395e', texto: '#2b2a2d', foto: 'rgba(29,57,94,0.12)', botaoBg: '#1d395e', botaoTexto: '#f3efe9' },
        lilas:   { bg: '#c9bcc1', titulo: '#1d395e', texto: '#2b2a2d', foto: 'rgba(29,57,94,0.14)', botaoBg: '#1d395e', botaoTexto: '#f3efe9' }
      };
      const doces = [
        Object.assign({ nome: 'Bombom Tropical', linha: 'Bombons',
          midia: 'assets/img/doces/foto-20.webp', fotoAberto: 'assets/img/doces/foto-45.webp',
          desc: 'Bombom de maracujá com manga e coco.',
          camadas: ['Maracujá', 'Manga', 'Coco'], tecnica: '[Técnica da casca e da pintura]' }, P.laranja),
        Object.assign({ nome: 'Bombom Mundo', linha: 'Bombons',
          midia: 'assets/img/doces/foto-1.webp', fotoAberto: 'assets/img/doces/foto-44.webp',
          desc: '[Sabor e recheio do Bombom Mundo]',
          camadas: ['[Casca]', '[Recheio]', '[Acabamento]'], tecnica: '[Técnica da casca e da pintura]' }, P.azul),
        Object.assign({ nome: 'Bombom Galáxia', linha: 'Bombons',
          midia: 'assets/img/doces/foto-8.webp', fotoAberto: 'assets/img/doces/foto-46.webp',
          desc: '[Sabor e recheio do Bombom Galáxia]',
          camadas: ['[Casca]', '[Recheio]', '[Acabamento]'], tecnica: '[Técnica da casca]' }, P.creme),
        Object.assign({ nome: 'Bombom Aurora', linha: 'Bombons',
          midia: 'assets/img/doces/foto-6.webp', fotoAberto: 'assets/img/doces/foto-41.webp',
          desc: 'Chocolate meio amargo e ganache de laranja com infusão de alecrim.',
          camadas: ['Chocolate meio amargo', 'Ganache de laranja', 'Infusão de alecrim'], tecnica: '[Técnica da casca]' }, P.noite),
        Object.assign({ nome: '[Nome do bombom vermelho]', linha: 'Bombons',
          midia: 'assets/img/doces/foto-12.webp', fotoAberto: 'assets/img/doces/foto-43.webp',
          desc: '[Sabor e recheio]',
          camadas: ['[Casca]', '[Recheio]', '[Base]'], tecnica: '[Técnica da casca]' }, P.lilas),
        Object.assign({ nome: '[Nome do bombom cacau]', linha: 'Bombons',
          midia: 'assets/img/doces/foto-48.webp', fotoAberto: 'assets/img/doces/foto-42.webp',
          desc: '[Sabor e recheio]',
          camadas: ['[Casca]', '[Recheio]', '[Crocante]'], tecnica: '[Técnica da casca]' }, P.azul),
        Object.assign({ nome: 'Choux', linha: 'Doces finos',
          midia: 'assets/img/doces/foto-27.webp', fotoAberto: 'assets/img/doces/foto-27.webp',
          desc: '[Nome e sabor do choux]',
          camadas: ['[Massa choux]', '[Creme]', '[Recheio]', '[Decoração]'], tecnica: '[Confirmar]' }, P.laranja),
        Object.assign({ nome: 'Tartelete', linha: 'Doces finos',
          midia: 'assets/img/doces/foto-28.webp', fotoAberto: 'assets/img/doces/foto-28.webp',
          desc: '[Nome e sabor da tartelete]',
          camadas: ['[Massa]', '[Creme]', '[Recheio]', '[Decoração]'], tecnica: '[Confirmar]' }, P.noite)
      ];

  var WPP = 'https://wa.me/5534993357189?text=';
  doces.forEach(function (d) {
    d.temMidia = !!d.midia; d.semMidia = !d.midia;
    d.temAberto = !!d.fotoAberto; d.semAberto = !d.fotoAberto;
    d.wpp = WPP + encodeURIComponent('Olá, Marbot! Vi o ' + d.nome + ' no site e gostaria de conversar sobre um evento.');
  });

  var raiz = document.getElementById('carrossel');
  if (!raiz) return;
  var estado = { i: 0, aberto: false };
  var n = doces.length;

  function molde(cur, prev, next, aberto, fechado, pontos, contador) {
    return `<div style="display: flex; min-height: 620px; overflow: hidden; border: 8px solid #1d395e; touch-action: pan-y">

${ fechado ? `
<button type="button" class="mb-textura mb-espiar" data-acao="anterior" aria-label="Doce anterior: ${prev.nome}" style="flex: 0 0 16%; position: relative; overflow: hidden; border: 0; border-right: 4px solid #f3efe9; padding: 0; margin: 0; cursor: pointer; background-color: ${prev.bg}">
<span style="position: absolute; top: 48px; right: 16px; font-family: 'Herr Von Muellerhoff', 'Brush Script MT', cursive; font-size: 56px; line-height: 1; white-space: nowrap; color: ${prev.titulo}; opacity: 0.4">${prev.nome}</span>
<span aria-hidden="true" style="position: absolute; top: 50%; right: -130px; width: 260px; height: 260px; margin-top: -130px; border-radius: 50%; background: ${prev.foto}"></span>
</button>
` : '' }

<div class="mb-textura mb-painel-doce" style="flex: 1 1 auto; min-width: 0; position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 56px clamp(16px, 3vw, 32px); box-sizing: border-box; background-color: ${cur.bg}; color: ${cur.texto}">

${ fechado ? `
<div style="display: flex; flex-direction: column; align-items: center; gap: 8px; text-align: center">
<h3 style="margin: 0; font-family: 'Herr Von Muellerhoff', 'Brush Script MT', cursive; font-weight: 400; font-size: clamp(44px, 11vw, 88px); line-height: 1; color: ${cur.titulo}; overflow-wrap: anywhere">${cur.nome}</h3>
${ cur.temMidia ? `
<img src="${cur.midia}" alt="${cur.nome}" style="margin-top: 20px; display: block; width: min(100%, clamp(260px, 34vw, 460px)); box-sizing: border-box; aspect-ratio: 4 / 3; object-fit: cover; border: 8px solid #f3efe9; box-shadow: 0 18px 40px rgba(15,26,54,0.3)">
` : '' }
${ cur.semMidia ? `
<div role="img" aria-label="Espaço para foto: ${cur.nome} recortado" style="margin-top: 24px; width: clamp(200px, 24vw, 300px); aspect-ratio: 1 / 1; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: ${cur.foto}; animation: mb-flutuar 7s ease-in-out infinite">
<span style="font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; text-align: center; padding: 0 40px; line-height: 1.6">Foto: ${cur.nome} recortado</span>
</div>
` : '' }
<p style="margin: 24px 0 0; font-size: 16px; line-height: 1.6; max-width: 26em">${cur.desc}</p>
<button type="button" data-acao="abrir" style="margin-top: 24px; min-height: 48px; padding: 0 28px; border: 0; border-radius: 999px; cursor: pointer; font-family: Montserrat, 'Helvetica Neue', Arial, sans-serif; font-size: 13px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; background: ${cur.botaoBg}; color: ${cur.botaoTexto}">Ver por dentro</button>
</div>
` : '' }

${ aberto ? `
<div class="mb-aberto" style="width: 100%; max-width: 1040px; display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 48px; padding-top: 24px">
<div class="mb-ficha" style="flex: 0 1 340px; min-width: 0; background: #f3efe9; color: #2b2a2d; box-sizing: border-box; transform: rotate(-2deg); box-shadow: 0 18px 40px rgba(15,26,54,0.3); font-size: 13px; line-height: 1.5">
<div class="mb-friso" aria-hidden="true" style="height: 24px; background-size: 72px 72px"></div>
<div style="padding: 24px 28px 28px">
<p style="margin: 0 0 4px; font-size: 12px; letter-spacing: 0.22em; text-transform: uppercase; font-weight: 600; color: #1d395e; text-align: center">Ficha da peça</p>
<p style="margin: 0 0 20px; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: #6b6668; text-align: center">Marbot Ateliê</p>
<div style="display: flex; justify-content: space-between; gap: 16px; padding: 10px 0; border-top: 1px dashed #6b6668">
<span style="color: #6b6668">Peça</span><span style="font-weight: 500; text-align: right">${cur.nome}</span>
</div>
<div style="display: flex; justify-content: space-between; gap: 16px; padding: 10px 0; border-top: 1px dashed #6b6668">
<span style="color: #6b6668">Linha</span><span style="text-align: right">${cur.linha}</span>
</div>
<div style="padding: 10px 0; border-top: 1px dashed #6b6668; display: flex; flex-direction: column; gap: 6px">
<span style="color: #6b6668">Sabores</span>
${ cur.camadas.map((camada, idx) => `
<span style="display: flex; gap: 10px"><span aria-hidden="true" style="color: #d46336; font-weight: 600">·</span>${camada}</span>
`).join('') }
</div>
<div style="display: flex; justify-content: space-between; gap: 16px; padding: 10px 0; border-top: 1px dashed #6b6668">
<span style="color: #6b6668">Técnica</span><span style="text-align: right">${cur.tecnica}</span>
</div>
<div style="display: flex; justify-content: space-between; gap: 16px; padding: 10px 0; border-top: 1px dashed #6b6668; border-bottom: 1px dashed #6b6668">
<span style="color: #6b6668">Alergênicos</span><span style="text-align: right">[Confirmar]</span>
</div>
<p style="margin: 20px 0 0; font-family: 'Herr Von Muellerhoff', 'Brush Script MT', cursive; font-size: 40px; line-height: 1; color: #d46336; text-align: center">feito à mão</p>
</div>
</div>
<div style="flex: 1 1 300px; min-width: 0; display: flex; flex-direction: column; align-items: center; gap: 20px; text-align: center">
<h3 style="margin: 0; font-family: 'Herr Von Muellerhoff', 'Brush Script MT', cursive; font-weight: 400; font-size: clamp(44px, 10vw, 76px); line-height: 1; color: ${cur.titulo}; overflow-wrap: anywhere">${cur.nome}</h3>
${ cur.temAberto ? `
<img src="${cur.fotoAberto}" alt="${cur.nome} aberto, mostrando o recheio" style="display: block; width: min(100%, 460px); box-sizing: border-box; aspect-ratio: 4 / 3; object-fit: cover; border: 8px solid #f3efe9; box-shadow: 0 18px 40px rgba(15,26,54,0.3)">
` : '' }
${ cur.semAberto ? `
<div role="img" aria-label="Espaço para foto: ${cur.nome} cortado ao meio" style="width: min(100%, 380px); aspect-ratio: 4 / 3; display: flex; align-items: center; justify-content: center; background: ${cur.foto}">
<span style="font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; text-align: center; padding: 0 40px; line-height: 1.6">Foto: ${cur.nome} cortado ao meio, mostrando o recheio</span>
</div>
` : '' }
<p style="margin: 0; font-size: 16px; line-height: 1.6; max-width: 24em">${cur.desc}</p>
<a href="${cur.wpp}" style="display: inline-flex; align-items: center; min-height: 48px; padding: 0 26px; border-radius: 999px; text-decoration: none; font-size: 13px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; background: ${cur.botaoBg}; color: ${cur.botaoTexto}">Quero no meu evento</a>
</div>
</div>
<button type="button" data-acao="fechar" aria-label="Fechar e voltar aos doces" style="position: absolute; top: 16px; right: 16px; width: 44px; height: 44px; border-radius: 50%; border: 1px solid currentColor; background: transparent; color: inherit; cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 0">
<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M2 2l10 10M12 2L2 12" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"></path></svg>
</button>
` : '' }

</div>

${ fechado ? `
<button type="button" class="mb-textura mb-espiar" data-acao="proximo" aria-label="Próximo doce: ${next.nome}" style="flex: 0 0 16%; position: relative; overflow: hidden; border: 0; border-left: 4px solid #f3efe9; padding: 0; margin: 0; cursor: pointer; background-color: ${next.bg}">
<span style="position: absolute; top: 48px; left: 16px; font-family: 'Herr Von Muellerhoff', 'Brush Script MT', cursive; font-size: 56px; line-height: 1; white-space: nowrap; color: ${next.titulo}; opacity: 0.4">${next.nome}</span>
<span aria-hidden="true" style="position: absolute; top: 50%; left: -130px; width: 260px; height: 260px; margin-top: -130px; border-radius: 50%; background: ${next.foto}"></span>
</button>
` : '' }

</div>

<div style="display: flex; align-items: center; justify-content: center; gap: 20px">
<button type="button" data-acao="anterior" aria-label="Doce anterior" style="width: 52px; height: 44px; border-radius: 999px; border: 1px solid #1d395e; background: transparent; color: #1d395e; cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 0">
<svg width="24" height="10" viewBox="0 0 24 10" aria-hidden="true"><path d="M23 5H2M6 1L2 5l4 4" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
</button>
<div class="mb-pontos" style="display: flex; align-items: center; gap: 4px">
${ pontos.map((ponto, idx) => `
<button type="button" data-ir="${idx}" aria-label="Ver ${ponto.nome}" style="width: 44px; height: 44px; border: 0; background: transparent; cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 0">
<span aria-hidden="true" style="display: block; height: 8px; border-radius: 999px; ${ponto.estilo}"></span>
</button>
`).join('') }
</div>
<button type="button" data-acao="proximo" aria-label="Próximo doce" style="width: 52px; height: 44px; border-radius: 999px; border: 1px solid #1d395e; background: transparent; color: #1d395e; cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 0">
<svg width="24" height="10" viewBox="0 0 24 10" aria-hidden="true"><path d="M1 5h21M18 1l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
</button>
</div>
<p aria-live="polite" style="margin: 0; text-align: center; font-size: 13px; letter-spacing: 0.14em; text-transform: uppercase; color: #6b6668">${contador}</p>`;
  }

  function render() {
    var i = estado.i;
    var pontos = doces.map(function (d, k) {
      return { nome: d.nome, estilo: k === i ? 'width: 28px; background: #d46336;' : 'width: 8px; background: #1d395e;' };
    });
    raiz.innerHTML = molde(doces[i], doces[(i + n - 1) % n], doces[(i + 1) % n],
      estado.aberto, !estado.aberto, pontos, (i + 1) + ' de ' + n + ' · ' + doces[i].nome);
  }
  function ir(k) { estado.i = (k + n) % n; estado.aberto = false; render(); }

  raiz.addEventListener('click', function (e) {
    var el = e.target.closest('[data-acao],[data-ir]');
    if (!el) return;
    if (el.hasAttribute('data-ir')) return ir(+el.getAttribute('data-ir'));
    var a = el.getAttribute('data-acao');
    if (a === 'anterior') ir(estado.i - 1);
    else if (a === 'proximo') ir(estado.i + 1);
    else if (a === 'abrir') { estado.aberto = true; render(); }
    else if (a === 'fechar') { estado.aberto = false; render(); }
  });

  // deslizar o dedo para trocar de doce (só movimento claramente horizontal)
  var x0 = null, y0 = null;
  raiz.addEventListener('touchstart', function (e) { var t = e.touches[0]; x0 = t.clientX; y0 = t.clientY; }, { passive: true });
  raiz.addEventListener('touchend', function (e) {
    if (x0 === null || estado.aberto) return;
    var t = e.changedTouches[0], dx = t.clientX - x0, dy = t.clientY - y0; x0 = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) ir(dx < 0 ? estado.i + 1 : estado.i - 1);
  }, { passive: true });

  // setas do teclado quando o foco está no carrossel
  raiz.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') ir(estado.i + 1);
    if (e.key === 'ArrowLeft') ir(estado.i - 1);
  });

  render();
})();
