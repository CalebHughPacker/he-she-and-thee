import { ProductStore, money, addItem, countItems } from './products.js';

const badge = document.getElementById('cart-count');
const updateBadge = () => { if (badge) badge.textContent = String(countItems()); };
updateBadge();


async function renderPDFAsImage(url, container) {
  if (!window.pdfjsLib) {
    console.error('PDF.js not loaded');
    return;
  }
  try {
    const pdf = await pdfjsLib.getDocument(url).promise;
    const page = await pdf.getPage(1);

    const containerWidth = container.clientWidth || 600;
    const viewport = page.getViewport({ scale: 1 });
    const scale = containerWidth / viewport.width;
    const scaledViewport = page.getViewport({ scale });

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = Math.ceil(scaledViewport.width);
    canvas.height = Math.ceil(scaledViewport.height);

    await page.render({ canvasContext: ctx, viewport: scaledViewport }).promise;

    const img = document.createElement('img');
    img.src = canvas.toDataURL('image/png');
    img.alt = `Sun-Up: ${url.split('/').pop()}`;
    img.style.width = '100%';
    img.style.height = 'auto';

    container.appendChild(img);
  } catch (err) {
    console.error('Failed to render PDF:', url, err);
  }
}

(function renderSunUpPDFs(){
  const sunup = document.getElementById('sunup');
  if (!sunup) return;

  const titleEl = sunup.querySelector('.sunup-title');
  [...sunup.children].forEach(ch => { if (ch !== titleEl) ch.remove(); });

  const gallery = document.createElement('div');
  gallery.id = 'sunup-gallery';
  sunup.appendChild(gallery);

  const pdfs = Array.isArray(window.SUNUP_PDFS) ? window.SUNUP_PDFS : [];
  pdfs.forEach(url => renderPDFAsImage(url, gallery));
})();


function productCard(p){
  const el = document.createElement('article');
  el.className = 'product-card';
  el.innerHTML = `
    <div class="product-media img-skeleton" aria-hidden="true">Product</div>
    <h3 class="product-title">${p.title}</h3>
    <div class="product-price">${money(p.price)}</div>
    <p class="product-desc">${p.description}</p>
    <div class="btn-row">
      <button class="btn-primary" data-id="${p.id}">Add to Cart</button>
      <a class="btn-secondary" href="#">See more</a>
    </div>
  `;
  el.querySelector('[data-id]').addEventListener('click', (e)=>{
    const id = e.currentTarget.getAttribute('data-id');
    addItem(id, 1);
    updateBadge();
  });
  return el;
}

function renderFeatured(targetId, count=3){
  const target = document.getElementById(targetId);
  if(!target) return;
  const picks = ProductStore.random(count);
  picks.forEach(p => target.appendChild(productCard(p)));
}

renderFeatured('products', 3);
renderFeatured('more-products', 3);
