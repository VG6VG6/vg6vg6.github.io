document.addEventListener('DOMContentLoaded', () => {
    let currentPdfPage = 1;
    const totalPdfPages = 36;
    const container = document.getElementById('pdf-iframe-container');
    const pageNumDisplay = document.getElementById('pdf-page-num');
    const pdfPrev = document.getElementById('pdf-prev');
    const pdfNext = document.getElementById('pdf-next');

    // Only run if the pdf widget is actually on the page
    if (!container || !pageNumDisplay || !pdfPrev || !pdfNext) return;

    function updatePdfPage() {
      // Create a new iframe
      const newIframe = document.createElement('iframe');
      newIframe.src = `assets/SovetskoePhoto_1926-01.pdf#page=${currentPdfPage}&toolbar=0&navpanes=0&scrollbar=0&view=Fit`;
      newIframe.style.width = '100%';
      newIframe.style.height = '100%';
      newIframe.style.border = 'none';
      newIframe.style.display = 'block';
      newIframe.style.position = 'absolute';
      newIframe.style.top = '0';
      newIframe.style.left = '0';
      newIframe.style.zIndex = '1'; // Put it behind the current one

      container.appendChild(newIframe);

      // Wait a moment for PDF to render, then bring to front and remove old ones
      setTimeout(() => {
        newIframe.style.zIndex = '2';
        const iframes = container.querySelectorAll('iframe');
        iframes.forEach(ifr => {
          if (ifr !== newIframe) ifr.remove();
        });
      }, 300); // 300ms is usually enough to hide the rendering flicker

      pageNumDisplay.textContent = currentPdfPage;
      pdfPrev.style.opacity = currentPdfPage === 1 ? '0.3' : '1';
      pdfPrev.style.pointerEvents = currentPdfPage === 1 ? 'none' : 'auto';
      pdfNext.style.opacity = currentPdfPage === totalPdfPages ? '0.3' : '1';
      pdfNext.style.pointerEvents = currentPdfPage === totalPdfPages ? 'none' : 'auto';
    }

    pdfPrev.addEventListener('click', () => {
      if (currentPdfPage > 1) {
        currentPdfPage--;
        updatePdfPage();
      }
    });

    pdfNext.addEventListener('click', () => {
      if (currentPdfPage < totalPdfPages) {
        currentPdfPage++;
        updatePdfPage();
      }
    });
});
