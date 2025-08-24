// js/cart.js
import {
  ProductStore,
  money,
  readCart,
  writeCart,
  setQty,
  removeItem,
  countItems
} from './products.js';

const itemsRoot   = document.getElementById('cart-items');
const subtotalEl  = document.getElementById('subtotal');
const taxEl       = document.getElementById('tax');
const itemCountEl = document.getElementById('item-count');
const badge       = document.getElementById('cart-count');

const TAX_RATE = 0.08; // demo tax rate

function updateBadge() {
  if (badge) badge.textContent = String(countItems());
}

function lineTotal(p, qty) {
  return p.price * qty;
}

function render() {
  const cart = readCart();
  itemsRoot.innerHTML = '';

  if (cart.items.length === 0) {
    itemsRoot.innerHTML =
      `<div class="empty">Your cart is empty. <a href="index.html">Continue shopping</a>.</div>`;
    subtotalEl.textContent = money(0);
    taxEl.textContent = money(0);
    itemCountEl.textContent = '0';
    updateBadge();
    return;
  }

  let subtotal = 0;
  let count = 0;

  cart.items.forEach(({ id, qty }) => {
    const p = ProductStore.byId(id);
    if (!p) return;

    subtotal += lineTotal(p, qty);
    count += qty;

    const card = document.createElement('article');
    card.className = 'cart-card';
    card.innerHTML = `
      <div class="product-media img-skeleton" aria-hidden="true">Product</div>
      <div class="cart-body">
        <div class="cart-head">
          <h3 class="cart-title">${p.title}</h3>
          <div class="cart-price">${money(p.price)}</div>
        </div>
        <p class="product-desc">${p.description}</p>
        <div class="cart-actions">
          <div class="qty" data-id="${p.id}">
            <button class="dec" aria-label="Decrease quantity">−</button>
            <div class="value" aria-live="polite">${qty}</div>
            <button class="inc" aria-label="Increase quantity">+</button>
          </div>
          <button class="remove-btn" data-remove="${p.id}">Remove</button>
        </div>
      </div>
    `;


    card.querySelector('.dec').addEventListener('click', () => {
      setQty(p.id, Math.max(1, qty - 1));
      render();
    });
    card.querySelector('.inc').addEventListener('click', () => {
      setQty(p.id, qty + 1);
      render();
    });


    card.querySelector('[data-remove]').addEventListener('click', () => {
      removeItem(p.id);
      render();
    });

    itemsRoot.appendChild(card);
  });

  const tax = subtotal * TAX_RATE;

  subtotalEl.textContent = money(subtotal);
  taxEl.textContent = money(tax);
  itemCountEl.textContent = String(count);
  updateBadge();
}


render();


document.getElementById('checkout').addEventListener('click', () => {
  alert('Proceeding to checkout (demo).');
});
