(() => {
  const itemsEl = document.getElementById("cart-items");
  const summaryEl = document.getElementById("cart-summary");
  const countEl = document.getElementById("cart-count");
  const money = value => `₹${value.toLocaleString("en-IN")}`;
  const readCart = () => { try { return JSON.parse(localStorage.getItem("blackFireCart") || "[]"); } catch { return []; } };
  const writeCart = cart => { localStorage.setItem("blackFireCart", JSON.stringify(cart)); render(); };
  function render() {
    const cart = readCart();
    const count = cart.reduce((n, item) => n + item.quantity, 0);
    if (countEl) countEl.textContent = count;
    if (!itemsEl || !summaryEl) return;
    if (!cart.length) {
      itemsEl.innerHTML = '<div class="empty-cart"><h3>Your bag is empty.</h3><p>Find a fit that feels like you.</p><a class="button button-dark" href="index.html#new-arrivals">SHOP THE DROP <span>↗</span></a></div>';
      summaryEl.innerHTML = "";
      return;
    }
    itemsEl.innerHTML = cart.map(item => `
      <article class="cart-item">
        <img src="${item.image}" alt="${item.name}">
        <div class="cart-item-info"><h3>${item.name}</h3><p>${item.subtitle}</p><strong>${money(item.price)}</strong>
          <div class="quantity-controls"><button type="button" data-qty="-1" data-id="${item.id}" aria-label="Decrease quantity">−</button><span>${item.quantity}</span><button type="button" data-qty="1" data-id="${item.id}" aria-label="Increase quantity">+</button><button type="button" class="remove-item" data-remove="${item.id}">REMOVE</button></div>
        </div>
        <strong class="cart-line-total">${money(item.price * item.quantity)}</strong>
      </article>`).join("");
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    summaryEl.innerHTML = `<div><span>Subtotal</span><strong>${money(total)}</strong></div><div><span>Shipping</span><span>Calculated by store</span></div><div class="cart-total"><span>Total</span><strong>${money(total)}</strong></div>`;
  }
  itemsEl?.addEventListener("click", event => {
    const qtyButton = event.target.closest("[data-qty]");
    const removeButton = event.target.closest("[data-remove]");
    let cart = readCart();
    if (qtyButton) {
      const item = cart.find(p => p.id === qtyButton.dataset.id);
      if (item) item.quantity += Number(qtyButton.dataset.qty);
      cart = cart.filter(p => p.quantity > 0);
      writeCart(cart);
    }
    if (removeButton) writeCart(cart.filter(p => p.id !== removeButton.dataset.remove));
  });
  render();
})();