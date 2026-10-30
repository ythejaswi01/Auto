"use strict";

(() => {
  const header = document.getElementById("site-header");
  if (!header) return;

  const icons = {
    search: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="m20 20-4-4"></path></svg>',
    cart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3h2l2.4 12.1a2 2 0 0 0 2 1.6h8.9a2 2 0 0 0 2-1.6L22 8H6"></path><circle cx="10" cy="21" r="1"></circle><circle cx="18" cy="21" r="1"></circle></svg>',
    menu: '<svg class="menu-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"></path></svg><svg class="close-icon" viewBox="0 0 24 24" aria-hidden="true" hidden><path d="m18 6-12 12M6 6l12 12"></path></svg>',
    bag: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h14l1 13H4L5 8Z"></path><path d="M9 9V6a3 3 0 0 1 6 0v3"></path></svg>',
    check: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="m8 12 3 3 5-6"></path></svg>'
  };

  header.innerHTML = `
    <div class="header-inner">
      <a class="brand" href="index.html" aria-label="Auto Care home">
        <img src="logo.png" alt="" width="25" height="25">
        <span>Auto Care</span>
      </a>
      <button class="icon-button mobile-menu-button" type="button" aria-label="Open menu" aria-expanded="false" id="menu-button">${icons.menu}</button>
      <nav class="main-nav" id="main-nav" aria-label="Main navigation">
        <a href="index.html" data-nav="home">Home</a>
        <a href="services.html" data-nav="services">Services</a>
        <a href="shop.html" data-nav="shop">Shop</a>
        <a href="about.html" data-nav="about">About</a>
        <a href="contact.html" data-nav="contact">Contact</a>
      </nav>
      <div class="header-actions">
        <button class="icon-button" id="search-button" type="button" aria-label="Search parts">${icons.search}</button>
        <a class="icon-button cart-button" href="cart.html" aria-label="Shopping cart">${icons.cart}<span class="cart-count" id="cart-count" hidden>0</span></a>
        <a class="login-button" href="login.html">Login / Sign Up</a>
      </div>
    </div>
    <form class="search-panel" id="search-panel" hidden>
      <label class="sr-only" for="site-search">Search auto parts</label>
      ${icons.search}
      <input id="site-search" name="q" placeholder="Search parts and accessories..." autocomplete="off">
      <button class="button button-primary" type="submit">Search</button>
    </form>`;

  const menuButton = document.getElementById("menu-button");
  const nav = document.getElementById("main-nav");
  const menuIcon = menuButton.querySelector(".menu-icon");
  const closeIcon = menuButton.querySelector(".close-icon");
  const searchPanel = document.getElementById("search-panel");
  const searchButton = document.getElementById("search-button");
  const searchInput = document.getElementById("site-search");
  const cartCount = document.getElementById("cart-count");
  const cartStorageKey = "auto-care-cart";

  function getCart() {
    try {
      const saved = localStorage.getItem(cartStorageKey);
      if (!saved) return [];
      const cart = JSON.parse(saved);
      return Array.isArray(cart) ? cart.filter((item) =>
        item && typeof item.id === "string" && typeof item.name === "string" &&
        Number.isFinite(item.price) && Number.isInteger(item.quantity) && item.quantity > 0
      ) : [];
    } catch (error) {
      console.error("Could not read the saved cart.", error);
      return [];
    }
  }

  function saveCart(cart) {
    try {
      localStorage.setItem(cartStorageKey, JSON.stringify(cart));
    } catch (error) {
      console.error("Could not save the cart in this browser.", error);
    }
  }

  function updateCartCount() {
    const quantity = getCart().reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = String(quantity);
    cartCount.hidden = quantity === 0;
    document.querySelector(".cart-button").setAttribute("aria-label", `Shopping cart, ${quantity} items`);
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (character) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[character]);
  }

  function setActiveNavigation() {
    const page = document.body.dataset.page;
    const currentPage = page === "booking" ? "services" : page;
    nav.querySelectorAll("[data-nav]").forEach((link) => {
      if (link.dataset.nav === currentPage) link.setAttribute("aria-current", "page");
    });
  }

  function showFormMessage(form, message) {
    const status = document.createElement("p");
    status.className = "form-notice";
    status.setAttribute("role", "status");
    status.textContent = message;
    form.replaceChildren(status);
  }

  function renderCart() {
    const cartContent = document.getElementById("cart-content");
    if (!cartContent) return;
    const cart = getCart();
    if (cart.length === 0) {
      cartContent.innerHTML = `<div class="empty-state">${icons.bag}<h2>Your cart is empty</h2><p>Browse our selection of trusted parts and accessories.</p><a class="button button-primary" href="shop.html">Explore the shop</a></div>`;
      return;
    }
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cartContent.innerHTML = `
      <div class="cart-list">${cart.map((item) => `
        <div class="cart-row">
          <span class="cart-product-icon">${icons.bag}</span>
          <div class="cart-product-copy"><h2>${escapeHtml(item.name)}</h2><p>Quantity: ${item.quantity}</p></div>
          <strong>$${(item.price * item.quantity).toFixed(2)}</strong>
          <button class="text-button" type="button" data-remove="${escapeHtml(item.id)}" aria-label="Remove ${escapeHtml(item.name)}">Remove</button>
        </div>`).join("")}</div>
      <div class="cart-total"><span>Subtotal</span><strong>$${total.toFixed(2)}</strong></div>
      <button class="button button-primary checkout-button" type="button" data-checkout>Place order</button>`;
  }

  function applyShopSearch() {
    if (document.body.dataset.page !== "shop") return;
    const query = new URLSearchParams(window.location.search).get("q")?.trim() || "";
    const label = document.getElementById("search-result-label");
    if (query) {
      label.textContent = `Showing results for “${query}”`;
      label.hidden = false;
    }
    let matchingProducts = 0;
    document.querySelectorAll("[data-product-card]").forEach((card) => {
      const matches = card.dataset.search.toLowerCase().includes(query.toLowerCase());
      card.hidden = !matches;
      if (matches) matchingProducts += 1;
    });
    if (query && matchingProducts === 0) {
      const grid = document.querySelector(".product-grid");
      grid.insertAdjacentHTML("afterend", `<div class="empty-state search-empty"><h2>No parts found</h2><p>Try a different search term.</p></div>`);
    }
  }

  menuButton.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    menuIcon.hidden = isOpen;
    closeIcon.hidden = !isOpen;
  });

  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      nav.classList.remove("is-open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Open menu");
      menuIcon.hidden = false;
      closeIcon.hidden = true;
    }
  });

  searchButton.addEventListener("click", () => {
    searchPanel.hidden = !searchPanel.hidden;
    if (!searchPanel.hidden) searchInput.focus();
  });

  searchPanel.addEventListener("submit", (event) => {
    event.preventDefault();
    const query = searchInput.value.trim();
    window.location.href = `shop.html${query ? `?q=${encodeURIComponent(query)}` : ""}`;
  });

  document.addEventListener("click", (event) => {
    const addButton = event.target.closest("[data-add-to-cart]");
    if (addButton) {
      const cart = getCart();
      const item = cart.find((entry) => entry.id === addButton.dataset.id);
      if (item) item.quantity += 1;
      else cart.push({
        id: addButton.dataset.id,
        name: addButton.dataset.name,
        price: Number(addButton.dataset.price),
        quantity: 1
      });
      saveCart(cart);
      updateCartCount();
      const originalLabel = addButton.textContent;
      addButton.textContent = "Added";
      window.setTimeout(() => {
        if (addButton.isConnected) addButton.textContent = originalLabel;
      }, 1000);
      return;
    }

    const removeButton = event.target.closest("[data-remove]");
    if (removeButton) {
      saveCart(getCart().filter((item) => item.id !== removeButton.dataset.remove));
      updateCartCount();
      renderCart();
      return;
    }

    if (event.target.closest("[data-checkout]")) {
      saveCart([]);
      updateCartCount();
      const content = document.getElementById("cart-content");
      content.innerHTML = `<div class="form-notice" role="status">Thanks! Your order has been placed. This demo does not process payments.</div>`;
    }
  });

  document.addEventListener("submit", (event) => {
    const form = event.target.closest("[data-form]");
    if (!form) return;
    event.preventDefault();
    const messages = {
      booking: "Your service request is ready. This demo does not send appointments to a service center.",
      contact: "Your message is ready. This demo does not send messages to a service center.",
      login: "Account sign-in is a demo only; no account or password was sent."
    };
    showFormMessage(form, messages[form.dataset.form]);
  });

  function prefillBookingForm() {
    if (document.body.dataset.page !== "booking") return;
    const requestedService = new URLSearchParams(window.location.search).get("service");
    const serviceSelect = document.querySelector('select[name="service"]');
    if (!requestedService || !serviceSelect) return;
    const option = [...serviceSelect.options].find((item) => item.value === requestedService || item.textContent === requestedService);
    if (option) serviceSelect.value = option.value;
  }

  setActiveNavigation();
  updateCartCount();
  applyShopSearch();
  renderCart();
  prefillBookingForm();
  renderFooter();
})();

function renderFooter() {
  const footer = document.getElementById("site-footer");
  if (!footer) return;

  footer.innerHTML = `
    <div class="footer-content">
      <div class="footer-section">
        <h4>Auto Care</h4>
        <p>Your trusted automotive partner for all your vehicle needs.</p>
      </div>
      <div class="footer-section">
        <h4>Quick Links</h4>
        <ul>
          <li><a href="index.html">Home</a></li>
          <li><a href="services.html">Services</a></li>
          <li><a href="shop.html">Shop</a></li>
          <li><a href="about.html">About</a></li>
        </ul>
      </div>
      <div class="footer-section">
        <h4>Services</h4>
        <ul>
          <li><a href="book-service.html?service=Routine%20Maintenance">Routine Maintenance</a></li>
          <li><a href="book-service.html?service=Brake%20Service">Brake Service</a></li>
          <li><a href="book-service.html?service=Engine%20Repair">Engine Repair</a></li>
          <li><a href="book-service.html?service=AC%20Service">AC Service</a></li>
        </ul>
      </div>
      <div class="footer-section">
        <h4>Contact</h4>
        <ul>
          <li><a href="contact.html">Get in Touch</a></li>
          <li><a href="tel:+1234567890">+1 234 567 890</a></li>
          <li><a href="mailto:info@autocare.com">info@autocare.com</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>&copy; 2024 Auto Care. All rights reserved.</span>
      <span>
        <a href="login.html">Login</a> | <a href="register.html">Sign Up</a>
      </span>
    </div>
  `;
}
