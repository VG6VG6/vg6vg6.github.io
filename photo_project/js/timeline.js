/* ═══════════════════════════════════════════════
   timeline.js — логика таймлайна:
   · клик → плавная прокрутка к секции
   · скролл → автовыделение текущего периода
   · автоскролл таймлайна к активной точке
   ═══════════════════════════════════════════════ */

(function () {
  var items    = document.querySelectorAll('.ph-tl-item');
  var bar      = document.getElementById('ph-timeline');
  var sections = [];

  /* Собираем пары [секция → элемент таймлайна] */
  items.forEach(function (item) {
    var sec = document.querySelector(item.getAttribute('href'));
    if (sec) sections.push({ el: sec, item: item });
  });

  /* ── Подсветить активный элемент ── */
  function setActive(el) {
    items.forEach(function (i) { i.classList.remove('is-active'); });
    el.classList.add('is-active');

    /* Прокрутить таймлайн так, чтобы активная точка была по центру */
    if (bar) {
      var elRect  = el.getBoundingClientRect();
      var barRect = bar.getBoundingClientRect();
      var offset  = elRect.left - barRect.left - barRect.width / 2 + elRect.width / 2;
      bar.scrollLeft += offset;
    }
  }

  /* ── Клик по точке таймлайна ── */
  items.forEach(function (item) {
    item.addEventListener('click', function (e) {
      e.preventDefault();
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        var navH = bar ? bar.offsetHeight : 88;
        var top  = target.getBoundingClientRect().top + window.pageYOffset - navH - 8;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
      setActive(this);
    });
  });

  /* ── Автовыделение при скролле ── */
  window.addEventListener('scroll', function () {
    var navH    = (bar ? bar.offsetHeight : 88) + 20;
    var current = null;

    sections.forEach(function (s) {
      if (s.el.getBoundingClientRect().top <= navH) current = s;
    });

    if (current) setActive(current.item);
  }, { passive: true });

  /* Выделить первый элемент при загрузке */
  if (items.length) setActive(items[0]);
})();
