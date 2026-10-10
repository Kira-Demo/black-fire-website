
(() => {
  const products = window.BLACK_FIRE_PRODUCTS || [];
  const grid = document.getElementById("product-grid");

  if (!grid) {
    console.error("Product grid not found!");
    return;
  }

  if (products.length === 0) {
    console.error("No products found!");
    return;
  }

  grid.innerHTML = products.map(product => `
    <article class="product-card">
      <div class="product-image-wrap">
        <img
          class="product-image"
          src="${product.image}"
          alt="${product.name}"
        >
        <span class="product-tag">${product.tag}</span>
      </div>

      <div class="product-info">
        <h3 class="product-name">${product.name}</h3>
        <p class="product-subtitle">${product.subtitle}</p>

        <div class="product-bottom">
          <span class="product-price">₹${product.price}</span>
          <button
            class="add-button"
            type="button"
            data-add="${product.id}"
          >
            ADD TO BAG +
          </button>
        </div>
      </div>
    </article>
  `).join("");

  console.log("Products rendered:", products.length);

  grid.addEventListener("click", event => {
    const button = event.target.closest("[data-add]");
    if (!button) return;

    const product = products.find(
      item => item.id === button.dataset.add
    );

    if (!product) return;

    const cart = JSON.parse(
      localStorage.getItem("blackFireCart") || "[]"
    );

    const existing = cart.find(item => item.id === product.id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("blackFireCart", JSON.stringify(cart));

    const count = document.getElementById("cart-count");
    if (count) {
      count.textContent = cart.reduce(
        (total, item) => total + item.quantity, 0
      );
    }

    alert(`${product.name} added to your bag!`);
  });

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();

(() => {
  const slides = document.querySelectorAll(".hero-slide");
  const dotsContainer = document.getElementById("slider-dots");
  const counter = document.getElementById("slide-counter");
  const previous = document.getElementById("slide-prev");
  const next = document.getElementById("slide-next");

  if (!slides.length) {
    console.error("No hero slides found.");
    return;
  }

  let current = 0;
  let timer;

  function showSlide(index) {
    current = (index + slides.length) % slides.length;

    slides.forEach((slide, i) => {
      slide.classList.toggle("is-active", i === current);
    });

    if (dotsContainer) {
      dotsContainer.querySelectorAll("button").forEach((dot, i) => {
        dot.setAttribute("aria-current", String(i === current));
      });
    }

    if (counter) {
      counter.textContent =
        `${String(current + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
    }
  }

  function startAutoSlide() {
    clearInterval(timer);
    timer = setInterval(() => showSlide(current + 1), 4000);
  }

  if (dotsContainer) {
    dotsContainer.innerHTML = "";

    slides.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.className = "slider-dot";
      dot.type = "button";
      dot.setAttribute("aria-label", `Show slide ${i + 1}`);

      dot.addEventListener("click", () => {
        showSlide(i);
        startAutoSlide();
      });

      dotsContainer.appendChild(dot);
    });
  }

  previous?.addEventListener("click", () => {
    showSlide(current - 1);
    startAutoSlide();
  });

  next?.addEventListener("click", () => {
    showSlide(current + 1);
    startAutoSlide();
  });

  showSlide(0);
  startAutoSlide();
})();

