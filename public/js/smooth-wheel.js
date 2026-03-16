/**
 * Suaviza el scroll de rueda (mouse) en desktop.
 * No aplica en touch, respeta "prefers-reduced-motion"
 * y evita interferir con áreas de scroll internas.
 */
(function () {
  'use strict';

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) return;
  var isHomePage = document.body && document.body.classList.contains('page-home');

  var targetY = window.scrollY || window.pageYOffset;
  var currentY = targetY;
  var ticking = false;
  var maxStep = 200;
  var ease = 0.1;

  function getDeltaInPixels(event) {
    var d = event.deltaY;
    // 0: pixel, 1: line, 2: page
    if (event.deltaMode === 1) return d * 16;
    if (event.deltaMode === 2) return d * window.innerHeight;
    return d;
  }

  function findScrollableParent(node) {
    var el = node;
    while (el && el !== document.body && el !== document.documentElement) {
      var style = window.getComputedStyle(el);
      var overflowY = style.overflowY;
      var canScroll =
        (overflowY === 'auto' || overflowY === 'scroll') &&
        el.scrollHeight > el.clientHeight;
      if (canScroll) return el;
      el = el.parentElement;
    }
    return null;
  }

  function animate() {
    var diff = targetY - currentY;
    if (Math.abs(diff) < 0.5) {
      currentY = targetY;
      window.scrollTo(0, Math.round(currentY));
      ticking = false;
      return;
    }
    currentY += diff * ease;
    window.scrollTo(0, Math.round(currentY));
    requestAnimationFrame(animate);
  }

  window.addEventListener(
    'wheel',
    function (event) {
      if (event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return;
      if (!document.body) return;
      // En home, cerca del top mantenemos scroll nativo para evitar cualquier salto visual del hero/navbar.
      if (isHomePage && (window.scrollY || window.pageYOffset) < 140) return;

      var active = document.activeElement;
      if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable)) {
        return;
      }

      var scrollableParent = findScrollableParent(event.target);
      if (scrollableParent) return;

      var delta = getDeltaInPixels(event);
      if (!delta) return;
      // Damping para reducir "saltos" por cada paso de rueda.
      delta *= 0.8;
      if (delta > maxStep) delta = maxStep;
      if (delta < -maxStep) delta = -maxStep;

      event.preventDefault();

      var maxY = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      targetY = Math.max(0, Math.min(targetY + delta, maxY));

      if (!ticking) {
        ticking = true;
        requestAnimationFrame(animate);
      }
    },
    { passive: false }
  );

  window.addEventListener(
    'scroll',
    function () {
      if (!ticking) {
        targetY = window.scrollY || window.pageYOffset;
        currentY = targetY;
      }
    },
    { passive: true }
  );
})();
