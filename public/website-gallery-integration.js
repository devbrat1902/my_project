
(function () {
  'use strict';

  const API_ENDPOINT = '/api/gallery';
  const GALLERY_CONTAINER_ID = 'jfk-gallery';

  async function initGallery() {
    const container = document.getElementById(GALLERY_CONTAINER_ID);
    if (!container) {
      console.warn(`Gallery container with id "${GALLERY_CONTAINER_ID}" not found.`);
      return;
    }

    // Add header
    container.innerHTML = `
            <div class="gallery-header">
                <h2>Our Gallery</h2>
                <p>A glimpse into the joyful learning and fun-filled activities at Just For Kidz. Experience the magic through these moments captured with love.</p>
            </div>
            <div class="gallery-grid" id="galleryGrid">
                <div class="gallery-skeleton"></div>
                <div class="gallery-skeleton"></div>
                <div class="gallery-skeleton"></div>
            </div>
        `;

    try {
      const response = await fetch(API_ENDPOINT);
      const data = await response.json();

      renderGallery(data);
    } catch (error) {
      console.error('Failed to load gallery:', error);
      container.innerHTML = `<p class="error-message">Unable to load the gallery at this time. Please try again later.</p>`;
    }
  }

  function renderGallery(images) {
    const grid = document.getElementById('galleryGrid');
    if (!grid) return;

    if (!images || images.length === 0) {
      grid.innerHTML = '<p class="info-message">No gallery images found. Check back soon for new updates!</p>';
      grid.style.display = 'block';
      grid.style.textAlign = 'center';
      return;
    }

    grid.innerHTML = '';
    images.forEach(image => {
      const card = document.createElement('div');
      card.className = 'gallery-card';

      card.innerHTML = `
                <div class="gallery-image-container">
                    <img src="${image.url}" alt="${image.title}" loading="lazy">
                </div>
                <div class="gallery-content">
                    <h3 class="gallery-title">${image.title}</h3>
                    <p class="gallery-description">${image.description || ''}</p>
                </div>
            `;

      grid.appendChild(card);
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGallery);
  } else {
    initGallery();
  }
})();
