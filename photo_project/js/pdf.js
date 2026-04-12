/* ═══════════════════════════════════════════════
   pdf.js — рендер PDF через PDF.js (Mozilla)
   Рендерит каждую страницу в <canvas>.
   Работает в Chrome, Firefox, Safari, iOS, Android.
   ═══════════════════════════════════════════════ */

(function () {
  'use strict';

  var PDF_PATH   = 'assets/SovetskoePhoto_1926-01.pdf';
  var PDFJS_CDN  = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
  var WORKER_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  function loadScript(src, cb) {
    var s = document.createElement('script');
    s.src = src;
    s.onload = cb;
    document.head.appendChild(s);
  }

  ready(function () {
    var canvas      = document.getElementById('pdf-canvas');
    var loader      = document.getElementById('pdf-loader');
    var pageNumEl   = document.getElementById('pdf-page-num');
    var pageTotalEl = document.getElementById('pdf-page-total');
    var btnPrev     = document.getElementById('pdf-prev');
    var btnNext     = document.getElementById('pdf-next');

    if (!canvas) return;

    var pdfDoc      = null;
    var currentPage = 1;
    var rendering   = false;
    var pendingPage = null;

    function renderPage(num) {
      if (rendering) { pendingPage = num; return; }
      rendering = true;
      loader.style.display = 'flex';

      pdfDoc.getPage(num).then(function (page) {
        var containerWidth = canvas.parentElement.clientWidth || 800;
        var viewport0      = page.getViewport({ scale: 1 });
        var scale          = containerWidth / viewport0.width;
        var dpr            = window.devicePixelRatio || 1;
        var viewport       = page.getViewport({ scale: scale * dpr });

        canvas.width  = viewport.width;
        canvas.height = viewport.height;
        canvas.style.width  = (viewport.width  / dpr) + 'px';
        canvas.style.height = (viewport.height / dpr) + 'px';

        var ctx = canvas.getContext('2d');
        page.render({ canvasContext: ctx, viewport: viewport }).promise.then(function () {
          rendering = false;
          loader.style.display = 'none';
          pageNumEl.textContent = num;
          updateButtons();
          if (pendingPage !== null) {
            var p = pendingPage; pendingPage = null; renderPage(p);
          }
        });
      });
    }

    function updateButtons() {
      btnPrev.disabled = currentPage <= 1;
      btnNext.disabled = currentPage >= pdfDoc.numPages;
      btnPrev.style.opacity = btnPrev.disabled ? '0.35' : '1';
      btnNext.style.opacity = btnNext.disabled ? '0.35' : '1';
    }

    btnPrev.addEventListener('click', function () {
      if (currentPage > 1) { currentPage--; renderPage(currentPage); }
    });
    btnNext.addEventListener('click', function () {
      if (currentPage < pdfDoc.numPages) { currentPage++; renderPage(currentPage); }
    });

    /* Свайп на мобиле */
    var touchStartX = 0;
    canvas.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });
    canvas.addEventListener('touchend', function (e) {
      var dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 50) {
        if (dx < 0 && currentPage < pdfDoc.numPages) { currentPage++; renderPage(currentPage); }
        if (dx > 0 && currentPage > 1)               { currentPage--; renderPage(currentPage); }
      }
    }, { passive: true });

    loadScript(PDFJS_CDN, function () {
      pdfjsLib.GlobalWorkerOptions.workerSrc = WORKER_CDN;
      pdfjsLib.getDocument(PDF_PATH).promise.then(function (doc) {
        pdfDoc = doc;
        pageTotalEl.textContent = doc.numPages;
        renderPage(currentPage);
      }).catch(function (err) {
        loader.textContent = 'Не удалось загрузить документ.';
        console.error('PDF.js error:', err);
      });
    });

    /* Перерисовать при ресайзе */
    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () { renderPage(currentPage); }, 200);
    });
  });
})();
