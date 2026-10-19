(() => {
  const products = window.BLACK_FIRE_PRODUCTS || [];
  const money = value => `₹${Number(value).toLocaleString("en-IN")}`;
  const readCart = () => {
    try { return JSON.parse(localStorage.getItem("blackFireCart") || "[]"); }
    catch { return []; }
  };
  const updateCartCount = () => {
    const countEl = document.getElementById("cart-count");
    if (countEl) countEl.textContent = readCart().reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  };
  const showToast = message => {
    const toast = document.getElementById("toast");
    if (!toast) { window.alert(message); return; }
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove("show"), 2600);
  };
  function addToCart(product, size = "M") {
    const cart = readCart();
    const existing = cart.find(item => item.id === product.id && (item.size || "M") === size);
    if (existing) existing.quantity = Number(existing.quantity || 0) + 1;
    else cart.push({ ...product, size, quantity: 1 });
    localStorage.setItem("blackFireCart", JSON.stringify(cart));
    updateCartCount();
    showToast(`${product.name} · Size ${size} added to your bag`);
  }

  // Home/shop product cards: product details link plus wishlist heart only (no Add to Bag button).
  const grid = document.getElementById("product-grid");
  const readWishlist = () => {
    try { return JSON.parse(localStorage.getItem("blackFireWishlist") || "[]"); }
    catch { return []; }
  };
  const saveWishlist = list => localStorage.setItem("blackFireWishlist", JSON.stringify(list));
  const toggleWishlist = (productId, button) => {
    const saved = readWishlist();
    const index = saved.indexOf(productId);
    const isSaved = index === -1;
    if (isSaved) saved.push(productId); else saved.splice(index, 1);
    saveWishlist(saved);
    if (button) {
      button.classList.toggle("is-saved", isSaved);
      button.setAttribute("aria-pressed", String(isSaved));
      button.setAttribute("aria-label", isSaved ? "Remove from wishlist" : "Add to wishlist");
    }
    showToast(isSaved ? "Added to wishlist" : "Removed from wishlist");
  };
  if (grid && products.length) {
    const saved = readWishlist();
    grid.innerHTML = products.map(product => `
      <article class="product-card">
        <div class="product-image-wrap">
          <a class="product-card-link product-image-link" href="product.html?id=${encodeURIComponent(product.id)}" aria-label="View ${product.name}">
            <img class="product-image" src="${product.image}" alt="${product.name}" loading="lazy">
            <span class="product-tag">${product.tag || "BLACK FIRE"}</span>
          </a>
          <button class="card-wishlist${saved.includes(product.id) ? " is-saved" : ""}" type="button" data-wishlist="${product.id}" aria-label="${saved.includes(product.id) ? "Remove from wishlist" : "Add to wishlist"}" aria-pressed="${saved.includes(product.id)}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 4.8a5.4 5.4 0 0 0-7.6 0L12 6l-1.2-1.2a5.4 5.4 0 0 0-7.6 7.6L12 21l8.8-8.6a5.4 5.4 0 0 0 0-7.6Z"/></svg></button>
        </div>
        <a class="product-card-link" href="product.html?id=${encodeURIComponent(product.id)}" aria-label="View details for ${product.name}">
          <div class="product-info"><h3 class="product-name">${product.name}</h3><p class="product-subtitle">${product.subtitle}</p><div class="product-bottom price-promo"><span class="product-price">${money(product.price)}</span><del class="old-price">${money(product.originalPrice || 800)}</del><strong class="discount-label">38% OFF</strong></div><div class="emi-note">Get it for as low as ₹350</div><div class="bundle-note">✿ Buy 3 get 10% off</div></div>
        </a>
      </article>`).join("");
    grid.addEventListener("click", event => {
      const button = event.target.closest("[data-wishlist]");
      if (!button) return;
      event.preventDefault();
      event.stopPropagation();
      toggleWishlist(button.dataset.wishlist, button);
    });
  }

  // Bewakoof-inspired product details page, styled for BLACK FIRE.
  const detail = document.getElementById("product-detail");
  if (detail) {
    const id = new URLSearchParams(window.location.search).get("id");
    const product = products.find(item => item.id === id) || products[0];
    if (!product) {
      detail.innerHTML = '<div class="product-not-found"><h1>Product not found</h1><a class="button button-dark" href="index.html#new-arrivals">BACK TO SHOP ↗</a></div>';
    } else {
      document.title = `${product.name} — BLACK FIRE`;
      detail.innerHTML = `
        <div class="breadcrumbs"><a href="index.html">Home</a><span>/</span><a href="index.html#new-arrivals">Shop</a><span>/</span><span>${product.name}</span></div>
        <div class="product-detail-grid">
          <section class="product-gallery" aria-label="Product images">
            <div class="detail-image-main"><img src="${product.image}" alt="${product.name}" id="detail-main-image"><span class="detail-image-tag">${product.tag || "BLACK FIRE DROP"}</span></div>
            <div class="gallery-caption"><span>BLACK FIRE / THE STREETWEAR EDIT</span><span>01 / 01</span></div>
          </section>
          <section class="product-purchase-panel">
            <p class="detail-kicker">BLACK FIRE ORIGINALS</p>
            <h1 class="detail-product-title">${product.name}</h1>
            <p class="detail-subtitle">${product.subtitle}</p>
            <div class="detail-price-row"><div class="detail-price">${money(product.price)} <del class="old-price">${money(product.originalPrice || 800)}</del> <strong class="discount-label">38% OFF</strong><span>Inclusive of all taxes</span></div></div><div class="emi-note detail-emi">Get it for as low as ₹350</div><div class="bundle-note detail-bundle">✿ Buy 3 get 10% off</div>
            <div class="detail-divider"></div>
            <div class="size-heading"><h2>Select Size</h2><a class="text-link" href="#garment-measurements">Size guide ›</a></div>
            <div class="size-options" role="group" aria-label="Select size">${["XS","S","M","L","XL","2XL","3XL"].map((size, index) => `<button type="button" class="size-option${size === "M" ? " selected" : ""}" data-size="${size}" aria-pressed="${size === "M"}">${size}</button>`).join("")}</div>
            <div class="garment-measurements" id="garment-measurements"><strong>Garment (In Inches)</strong> <span>Chest : <b id="measure-chest">44</b> |</span> <span>Front Length : <b id="measure-length">29.5</b> |</span> <span>Sleeve Length : <b id="measure-sleeve">9.75</b></span></div>
            <div class="delivery-panel"><h2>Check for Delivery Details</h2><form id="pincode-form" class="pincode-form"><label class="sr-only" for="pincode">6-digit PIN code</label><input id="pincode" name="pincode" inputmode="numeric" pattern="[0-9]{6}" maxlength="6" placeholder="Enter 6-digit PIN code" required><button type="submit">Check</button></form><p class="delivery-result" id="delivery-result" aria-live="polite">Enter your PIN code to check the format.</p><div class="delivery-feature"><span class="feature-icon">↗</span><div><strong>Shipping information</strong><p>Delivery timelines and charges will be confirmed by the store.</p></div></div><div class="delivery-banner">✦ &nbsp; SHIPPING DETAILS CONFIRMED AT ORDER</div></div>
            <div class="detail-actions"><button type="button" class="detail-add-button" id="detail-add-button">ADD TO BAG — ${money(product.price)}</button><button type="button" class="detail-wishlist" id="detail-wishlist" aria-label="Add to wishlist" aria-pressed="false"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 4.8a5.4 5.4 0 0 0-7.6 0L12 6l-1.2-1.2a5.4 5.4 0 0 0-7.6 7.6L12 21l8.8-8.6a5.4 5.4 0 0 0 0-7.6Z"/></svg></button></div>
            <p class="secure-note">Please confirm payment, delivery and exchange terms with the store before placing an order.</p>
          </section>
        </div>
        <section class="product-information">
          <div class="highlights-block"><h2>Key Highlights</h2><div class="highlights-grid"><div><span>Style</span><strong>${product.subtitle}</strong></div><div><span>Collection</span><strong>${product.tag || "BLACK FIRE"}</strong></div><div><span>Fit</span><strong>Everyday streetwear</strong></div><div><span>Price</span><strong>${money(product.price)}</strong></div><div><span>Design</span><strong>Graphic / utility style</strong></div><div><span>Occasion</span><strong>Casual wear</strong></div></div></div>
          <div class="product-accordions"><details open><summary><span class="accordion-icon">☷</span><span><strong>Product Description</strong><small>Style, details and care</small></span><b>⌄</b></summary><div class="accordion-content">${product.name} is part of the BLACK FIRE collection. Please check the product photos and contact the store if you need exact fabric composition, garment measurements or care instructions.</div></details><details><summary><span class="accordion-icon">↶</span><span><strong>Returns & Exchange</strong><small>Review the store policy before ordering</small></span><b>⌄</b></summary><div class="accordion-content">Returns and exchanges are subject to the store's confirmed policy. Contact BLACK FIRE before purchase to confirm eligibility, time limits and who pays return shipping.</div></details><details><summary><span class="accordion-icon">□</span><span><strong>Payment & Shipping</strong><small>Confirm available options with the store</small></span><b>⌄</b></summary><div class="accordion-content">Online payments, Cash on Delivery, shipping fees and delivery dates are not verified by this demo page. Confirm the available options with the seller before paying.</div></details></div>
          <div class="trust-strip"><div><span class="trust-icon">✳</span><strong>Distinctive Style</strong></div><div><span class="trust-icon">◇</span><strong>Clear Pricing</strong></div><div><span class="trust-icon">↗</span><strong>Store Support</strong></div></div>
        </section>`;

      let selectedSize = "M";
      detail.querySelectorAll("[data-size]").forEach(button => button.addEventListener("click", () => {
        selectedSize = button.dataset.size;
        detail.querySelectorAll("[data-size]").forEach(option => {
          const selected = option === button;
          option.classList.toggle("selected", selected);
          option.setAttribute("aria-pressed", String(selected));
        });
        const help = document.getElementById("size-help");
        if (help) help.textContent = `Selected size: ${selectedSize}`;
        if (typeof updateMeasurements === "function") updateMeasurements();
      }));
      document.getElementById("detail-add-button")?.addEventListener("click", () => addToCart(product, selectedSize));
      const wishlist = document.getElementById("detail-wishlist");
      wishlist?.addEventListener("click", () => {
        const saved = JSON.parse(localStorage.getItem("blackFireWishlist") || "[]");
        const index = saved.indexOf(product.id);
        if (index >= 0) { saved.splice(index, 1); wishlist.classList.remove("is-saved"); wishlist.setAttribute("aria-pressed", "false"); wishlist.setAttribute("aria-label", "Add to wishlist"); showToast("Removed from wishlist"); }
        else { saved.push(product.id); wishlist.classList.add("is-saved"); wishlist.setAttribute("aria-pressed", "true"); wishlist.setAttribute("aria-label", "Remove from wishlist"); showToast("Added to wishlist"); }
        localStorage.setItem("blackFireWishlist", JSON.stringify(saved));
      });
      const saved = JSON.parse(localStorage.getItem("blackFireWishlist") || "[]");
      if (saved.includes(product.id)) { wishlist?.classList.add("is-saved"); wishlist?.setAttribute("aria-pressed", "true"); wishlist?.setAttribute("aria-label", "Remove from wishlist"); }
      // Inline garment measurements update when a size is selected.
      // L values match the supplied screenshot.
      const measurements = {
        XS: null,
        S: { chest: "42", length: "28.5", sleeve: "9.25" },
        M: { chest: "44", length: "29.5", sleeve: "9.75" },
        L: { chest: "46", length: "30.5", sleeve: "10.25" },
        XL: { chest: "48", length: "31.5", sleeve: "10.5" },
        "2XL": { chest: "50", length: "32.5", sleeve: "10.75" },
        "3XL": { chest: "52", length: "33.5", sleeve: "11" }
      };
      const updateMeasurements = () => {
        const m = measurements[selectedSize];
        const box = document.getElementById("garment-measurements");
        if (!box) return;
        if (!m) {
          box.innerHTML = "<strong>Garment (In Inches)</strong> <span>Measurements unavailable for XS</span>";
          return;
        }
        box.innerHTML = `<strong>Garment (In Inches)</strong> <span>Chest : <b>${m.chest}</b> |</span> <span>Front Length : <b>${m.length}</b> |</span> <span>Sleeve Length : <b>${m.sleeve}</b></span>`;
      };
      updateMeasurements();
      document.getElementById("pincode-form")?.addEventListener("submit", event => {
        event.preventDefault();
        const pin = document.getElementById("pincode").value.trim();
        const result = document.getElementById("delivery-result");
        if (!/^[1-9][0-9]{5}$/.test(pin)) result.textContent = "Enter a valid 6-digit Indian PIN code.";
        else result.textContent = `PIN ${pin} entered. Actual serviceability and delivery date need confirmation from the store.`;
      });
    }
  }

  // Hero carousel on the home page
  const slides = document.querySelectorAll(".hero-slide");
  const dotsContainer = document.getElementById("slider-dots");
  const counter = document.getElementById("slide-counter");
  const previous = document.getElementById("slide-prev");
  const next = document.getElementById("slide-next");
  if (slides.length) {
    let current = 0;
    let timer;
    const showSlide = index => {
      current = (index + slides.length) % slides.length;
      slides.forEach((slide, i) => slide.classList.toggle("is-active", i === current));
      dotsContainer?.querySelectorAll("button").forEach((dot, i) => dot.setAttribute("aria-current", String(i === current)));
      if (counter) counter.textContent = `${String(current + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
    };
    const startAutoSlide = () => { clearInterval(timer); timer = setInterval(() => showSlide(current + 1), 4500); };
    if (dotsContainer) {
      dotsContainer.innerHTML = "";
      slides.forEach((_, i) => {
        const dot = document.createElement("button"); dot.className = "slider-dot"; dot.type = "button"; dot.setAttribute("aria-label", `Show slide ${i + 1}`);
        dot.addEventListener("click", () => { showSlide(i); startAutoSlide(); }); dotsContainer.appendChild(dot);
      });
    }
    previous?.addEventListener("click", () => { showSlide(current - 1); startAutoSlide(); });
    next?.addEventListener("click", () => { showSlide(current + 1); startAutoSlide(); });
    showSlide(0); startAutoSlide();
  }
  // Wishlist and account icons are normal links to their pages.
  updateCartCount();
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
