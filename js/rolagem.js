/* Marbot Ateliê · rolagem suave
   Usa a biblioteca Lenis (js/lenis.min.js, versão 1.3.27) para dar inércia à rolagem
   do mouse e do trackpad. No celular a rolagem continua a nativa do aparelho,
   que já é suave e é a que a pessoa conhece. */
(function () {
  'use strict';

  // Quem pediu ao sistema para reduzir movimento continua com a rolagem normal
  var reduzir = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduzir || typeof window.Lenis !== 'function') return;

  var lenis = new window.Lenis({
    lerp: 0.085,          // quanto menor, mais "deslizante" (0.1 é o padrão da biblioteca)
    wheelMultiplier: 0.9, // cada giro da roda anda um pouco menos, para não pular seções
    smoothWheel: true,
    syncTouch: false,     // toque no celular: rolagem nativa
    anchors: { duration: 1.4, easing: function (t) { return 1 - Math.pow(1 - t, 4); } },
    autoRaf: true
  });

  window.marbotRolagem = lenis;
})();
