(function() {
  var root = document.querySelector('[data-trabaja-carousel]');
  if (!root) return;

  var cards = root.querySelectorAll('.trabaja-stack-cards .trabaja-vacancy-card');
  var prevBtn = root.querySelector('.trabaja-carousel-btn--prev');
  var nextBtn = root.querySelector('.trabaja-carousel-btn--next');
  var dotsWrap = root.querySelector('.trabaja-carousel-dots');
  var toast = root.querySelector('.trabaja-carousel-toast');
  var heroInner = root.closest('.trabaja-hero-inner');
  var heroCopy = heroInner ? heroInner.querySelector('.trabaja-hero-copy') : null;

  if (!cards.length || !prevBtn || !nextBtn) return;

  var mqDetailModal = typeof window.matchMedia === 'function'
    ? window.matchMedia('(max-width: 900px)')
    : { matches: false, addEventListener: function() {} };

  var modalBackFace = null;
  var modalFlipHost = null;
  var lastFocusEl = null;

  function prefersDetailModal() {
    return mqDetailModal.matches;
  }

  function setHeroCopyExpanded(on) {
    if (!heroCopy) return;
    if (on) {
      heroCopy.setAttribute('aria-hidden', 'true');
    } else {
      heroCopy.removeAttribute('aria-hidden');
    }
  }

  function setBackDialogA11y(backEl, on) {
    if (!backEl) return;
    if (on) {
      backEl.setAttribute('role', 'dialog');
      backEl.setAttribute('aria-modal', 'true');
      var heading = backEl.querySelector('#trabaja-vacancy-dialog-heading');
      if (heading) backEl.setAttribute('aria-labelledby', 'trabaja-vacancy-dialog-heading');
    } else {
      backEl.removeAttribute('role');
      backEl.removeAttribute('aria-modal');
      backEl.removeAttribute('aria-labelledby');
    }
  }

  function closeMobileModal() {
    if (!modalBackFace || !modalFlipHost) return;
    modalBackFace.classList.remove('is-modal-mounted');
    setBackDialogA11y(modalBackFace, false);
    modalFlipHost.appendChild(modalBackFace);
    modalBackFace = null;
    modalFlipHost = null;
    root.classList.remove('trabaja-carousel--vacancy-modal-open');
    document.body.classList.remove('trabaja-vacancy-modal-open');
    setHeroCopyExpanded(false);
    document.removeEventListener('keydown', onModalKeydown, true);
    if (lastFocusEl && typeof lastFocusEl.focus === 'function') {
      try {
        lastFocusEl.focus();
      } catch (e) { /* ignore */ }
    }
    lastFocusEl = null;
  }

  function onModalKeydown(e) {
    if (e.key === 'Escape' || e.key === 'Esc') {
      e.preventDefault();
      closeMobileModal();
    }
  }

  function openMobileModal(card, triggerBtn) {
    var flip = card.querySelector('.trabaja-vacancy-flip');
    var back = card.querySelector('.trabaja-vacancy-face--back');
    if (!flip || !back || modalBackFace) return;
    lastFocusEl = triggerBtn || document.activeElement;
    modalFlipHost = flip;
    modalBackFace = back;
    back.classList.add('is-modal-mounted');
    document.body.appendChild(back);
    root.classList.add('trabaja-carousel--vacancy-modal-open');
    document.body.classList.add('trabaja-vacancy-modal-open');
    setHeroCopyExpanded(true);
    setBackDialogA11y(back, true);
    document.addEventListener('keydown', onModalKeydown, true);

    var scrollEl = back.querySelector('.trabaja-vacancy-back-scroll');
    function scrollModalToTop() {
      if (scrollEl) scrollEl.scrollTop = 0;
    }
    scrollModalToTop();
    requestAnimationFrame(function() {
      scrollModalToTop();
      var heading = back.querySelector('#trabaja-vacancy-dialog-heading');
      if (heading && typeof heading.focus === 'function') {
        try {
          heading.focus({ preventScroll: true });
        } catch (e) {
          try {
            heading.focus();
          } catch (e2) { /* ignore */ }
        }
      } else if (scrollEl && typeof scrollEl.focus === 'function') {
        try {
          scrollEl.focus({ preventScroll: true });
        } catch (e) {
          try {
            scrollEl.focus();
          } catch (e2) { /* ignore */ }
        }
      }
      requestAnimationFrame(scrollModalToTop);
    });
  }

  function onMqDetailModalChange() {
    if (!prefersDetailModal() && root.classList.contains('trabaja-carousel--vacancy-modal-open')) {
      closeMobileModal();
    }
  }

  if (typeof mqDetailModal.addEventListener === 'function') {
    mqDetailModal.addEventListener('change', onMqDetailModalChange);
  } else if (typeof mqDetailModal.addListener === 'function') {
    mqDetailModal.addListener(onMqDetailModalChange);
  }

  var n = cards.length;
  var index = 0;
  var toastTimer;

  function rel(j) {
    return (j - index + n * 10) % n;
  }

  function render() {
    closeMobileModal();
    root.classList.remove('trabaja-carousel--flip-expanded');
    setHeroCopyExpanded(false);
    cards.forEach(function(card, j) {
      var r = rel(j);
      card.classList.remove('is-front', 'is-behind-right', 'is-behind-left', 'is-hidden-back', 'is-flipped');
      if (r === 0) {
        card.classList.add('is-front');
      } else if (r === 1) {
        card.classList.add('is-behind-right');
      } else if (n > 1 && r === n - 1) {
        card.classList.add('is-behind-left');
      } else {
        card.classList.add('is-hidden-back');
      }
    });

    if (dotsWrap) {
      var dots = dotsWrap.querySelectorAll('.trabaja-carousel-dot');
      dots.forEach(function(d, i) {
        d.setAttribute('aria-current', i === index ? 'true' : 'false');
      });
    }
  }

  function go(delta) {
    index = (index + delta + n) % n;
    render();
  }

  function showNoMoreVacanciesToast() {
    if (!toast) return;
    toast.removeAttribute('hidden');
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function() {
      toast.classList.remove('is-visible');
      toast.setAttribute('hidden', '');
    }, 3200);
  }

  prevBtn.addEventListener('click', function() {
    if (n <= 1) {
      showNoMoreVacanciesToast();
      return;
    }
    go(-1);
  });
  nextBtn.addEventListener('click', function() {
    if (n <= 1) {
      showNoMoreVacanciesToast();
      return;
    }
    go(1);
  });

  if (dotsWrap) {
    dotsWrap.addEventListener('click', function(e) {
      var t = e.target.closest('.trabaja-carousel-dot');
      if (!t || t.dataset.slide === undefined) return;
      var i = parseInt(t.dataset.slide, 10);
      if (isNaN(i) || i < 0 || i >= n) return;
      index = i;
      render();
    });
  }

  document.addEventListener('click', function(e) {
    var flipBtn = e.target.closest('.trabaja-vacancy-btn--flip');
    var unflipBtn = e.target.closest('.trabaja-vacancy-btn--unflip');
    if (flipBtn) {
      if (!root.contains(flipBtn)) return;
      e.preventDefault();
      var card = flipBtn.closest('.trabaja-vacancy-card');
      if (!card || !card.classList.contains('is-front')) return;
      if (prefersDetailModal()) {
        openMobileModal(card, flipBtn);
        return;
      }
      card.classList.add('is-flipped');
      root.classList.add('trabaja-carousel--flip-expanded');
      setHeroCopyExpanded(true);
      return;
    }
    if (unflipBtn) {
      if (root.classList.contains('trabaja-carousel--vacancy-modal-open')) {
        if (modalBackFace && modalBackFace.contains(unflipBtn)) {
          e.preventDefault();
          closeMobileModal();
          return;
        }
      }
      if (!root.contains(unflipBtn)) return;
      e.preventDefault();
      var c = unflipBtn.closest('.trabaja-vacancy-card');
      if (c) c.classList.remove('is-flipped');
      root.classList.remove('trabaja-carousel--flip-expanded');
      setHeroCopyExpanded(false);
    }
  });

  function init() {
    render();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function onReady() {
      document.removeEventListener('DOMContentLoaded', onReady);
      requestAnimationFrame(init);
    });
  } else {
    requestAnimationFrame(init);
  }
})();
