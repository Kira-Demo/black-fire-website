// js/main.js
let cart = JSON.parse(localStorage.getItem('blackfire_cart')) || [];

function saveCart() {
    localStorage.setItem('blackfire_cart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const countElements = document.querySelectorAll('.cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    countElements.forEach(el => el.innerText = totalItems);
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    saveCart();
    alert(`${product.name} added to cart!`);
}

function setupMenu() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    if(hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
}

function renderShop() {
    const grid = document.getElementById('shop-grid');
    if (!grid) return;
    grid.innerHTML = products.map(p => `
        <div class="product-card">
            <a href="product.html?id=${p.id}"><img src="${p.image}" alt="${p.name}"></a>
            <div class="product-info">
                <h3>${p.name}</h3>
                <p>₹${p.price}</p>
                <button onclick="addToCart(${p.id})" class="btn">Add to Cart</button>
            </div>
        </div>
    `).join('');
}

function renderProductPage() {
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get('id'));
    const product = products.find(p => p.id === id);
    const container = document.getElementById('product-detail');
    
    if (!container || !product) return;

    container.innerHTML = `
        <div class="product-image"><img src="${product.image}" alt="${product.name}"></div>
        <div class="product-meta">
            <h1>${product.name}</h1>
            <p class="price">₹${product.price}</p>
            <p class="desc">${product.description}</p>
            <button onclick="addToCart(${product.id})" class="btn btn-large">Add to Cart</button>
        </div>
    `;
    document.title = `${product.name} | Black Fire`;
}

function renderCart() {
    const cartContainer = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    if (!cartContainer) return;

    if (cart.length === 0) {
        cartContainer.innerHTML = '<p>Your cart is empty.</p>';
        totalEl.innerText = '0';
        return;
    }

    cartContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>₹${item.price}</p>
                <div class="cart-controls">
                    <button onclick="updateQty(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQty(${item.id}, 1)">+</button>
                    <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
                </div>
            </div>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalEl.innerText = total;
}

function updateQty(id, change) {
    const item = cart.find(i => i.id === id);
    if(item) {
        item.quantity += change;
        if(item.quantity <= 0) removeFromCart(id);
        else { saveCart(); renderCart(); }
    }
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    renderCart();
}

function setupCheckout() {
    const form = document.getElementById('checkout-form');
    if(!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if(cart.length === 0) return alert("Cart is empty!");

        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const address = document.getElementById('address').value;
        const payment = document.getElementById('payment').value;

        let orderDetails = `*New Order - Black Fire* %0A%0A`;
        orderDetails += `*Name:* ${name}%0A*Phone:* ${phone}%0A*Address:* ${address}%0A*Payment:* ${payment}%0A%0A*Items:*%0A`;
        
        let total = 0;
        cart.forEach(item => {
            orderDetails += `- ${item.name} (x${item.quantity}) = ₹${item.price * item.quantity}%0A`;
            total += (item.price * item.quantity);
        });
        
        orderDetails += `%0A*Total:* ₹${total}`;

        const vendorPhone = "919876543210"; 
        const waLink = `https://wa.me/${vendorPhone}?text=${orderDetails}`;
        window.open(waLink, '_blank');
        
        cart = [];
        saveCart();
        renderCart();
    });
}

document.addEventListener('DOMContentLoaded', () => {
    setupMenu();
    updateCartCount();
    renderShop();
    renderProductPage();
    renderCart();
    setupCheckout();
});
