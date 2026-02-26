/* ============================================================
   HERBAL APOTHECARY – MAIN JS
   ============================================================ */

/* ── THEME ─────────────────────────────────────────────── */
const getTheme = () => localStorage.getItem('ha-theme') || (matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light');
const applyTheme = t => { document.body.classList.toggle('dark', t === 'dark'); localStorage.setItem('ha-theme', t); };
applyTheme(getTheme());
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('theme-toggle');
  if (btn) btn.addEventListener('click', () => applyTheme(getTheme() === 'dark' ? 'light' : 'dark'));
});

/* ── RTL ────────────────────────────────────────────────── */
const getDir = () => localStorage.getItem('ha-dir') || 'ltr';
const applyDir = d => { document.documentElement.setAttribute('dir', d); localStorage.setItem('ha-dir', d); };
applyDir(getDir());
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('rtl-toggle');
  if (btn) btn.addEventListener('click', () => applyDir(getDir() === 'rtl' ? 'ltr' : 'rtl'));
});

/* ── MOBILE NAV ─────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const ham = document.getElementById('hamburger');
  const links = document.getElementById('nav-links');

  /* Helper: build the injected mobile action rows */
  function buildMobileActions() {
    // Only inject if not already present
    if (links.querySelector('.mobile-divider')) return;

    const cartCount = document.querySelector('.cart-count')?.textContent || '0';

    // Collect href bases for Dashboard and SignIn from the actual nav-actions (if present in DOM)
    const dashHref = document.querySelector('.nav-actions .btn-outline')?.getAttribute('href') || 'pages/user-dashboard.html';
    const signInHref = document.querySelector('.nav-actions .btn-primary')?.getAttribute('href') || 'pages/login.html';
    const wishHref = document.querySelector('.nav-actions [aria-label="Wishlist"]')?.getAttribute('href') || 'pages/wishlist.html';
    const cartHref = document.querySelector('.nav-actions [aria-label="Cart"]')?.getAttribute('href') || 'pages/cart.html';

    const div = document.createElement('div');
    div.className = 'mobile-divider';

    const wishItem = document.createElement('a');
    wishItem.href = wishHref;
    wishItem.className = 'mobile-action-item';
    wishItem.innerHTML = '<i class="fas fa-heart"></i> Wishlist';

    const cartItem = document.createElement('a');
    cartItem.href = cartHref;
    cartItem.className = 'mobile-action-item';
    cartItem.innerHTML = `<i class="fas fa-shopping-bag"></i> Cart <span style="margin-left:auto;background:var(--accent);color:#fff;border-radius:50%;width:20px;height:20px;display:inline-flex;align-items:center;justify-content:center;font-size:.7rem;font-weight:700" class="cart-count-mobile">${cartCount}</span>`;

    const dashItem = document.createElement('a');
    dashItem.href = dashHref;
    dashItem.className = 'mobile-action-item';
    dashItem.innerHTML = '<i class="fas fa-th-large"></i> Dashboard';

    const themeItem = document.createElement('button');
    themeItem.type = 'button';
    themeItem.className = 'mobile-action-item';
    const isDark = document.body.classList.contains('dark');
    themeItem.innerHTML = isDark ? '<i class="fas fa-sun"></i> Switch to Light Mode' : '<i class="fas fa-moon"></i> Switch to Dark Mode';
    themeItem.addEventListener('click', () => {
      const t = getTheme() === 'dark' ? 'light' : 'dark';
      applyTheme(t);
      themeItem.innerHTML = t === 'dark' ? '<i class="fas fa-sun"></i> Switch to Light Mode' : '<i class="fas fa-moon"></i> Switch to Dark Mode';
    });

    const rtlItem = document.createElement('button');
    rtlItem.type = 'button';
    rtlItem.className = 'mobile-action-item';
    const isRtl = document.documentElement.getAttribute('dir') === 'rtl';
    rtlItem.innerHTML = isRtl ? '<i class="fas fa-language"></i> Switch to LTR' : '<i class="fas fa-language"></i> Switch to RTL';
    rtlItem.addEventListener('click', () => {
      const d = getDir() === 'rtl' ? 'ltr' : 'rtl';
      applyDir(d);
      rtlItem.innerHTML = d === 'rtl' ? '<i class="fas fa-language"></i> Switch to LTR' : '<i class="fas fa-language"></i> Switch to RTL';
    });

    const signInItem = document.createElement('a');
    signInItem.href = signInHref;
    signInItem.className = 'mobile-signin';
    signInItem.textContent = 'Sign In';

    links.appendChild(div);
    links.appendChild(themeItem);
    links.appendChild(rtlItem);
    links.appendChild(wishItem);
    links.appendChild(cartItem);
    links.appendChild(dashItem);
    links.appendChild(signInItem);
  }

  function removeMobileActions() {
    links.querySelectorAll('.mobile-divider, .mobile-action-item, .mobile-signin').forEach(el => el.remove());
  }

  if (ham && links) {
    ham.addEventListener('click', () => {
      const open = links.classList.toggle('mobile-open');
      ham.setAttribute('aria-expanded', open);
      if (open) {
        buildMobileActions();
        // Sync cart count in mobile menu
        const n = (typeof Cart !== 'undefined') ? Cart.count() : 0;
        links.querySelectorAll('.cart-count-mobile').forEach(el => { el.textContent = n; el.style.display = n ? '' : 'none'; });
      } else {
        removeMobileActions();
      }
    });

    /* Close menu on outside click */
    document.addEventListener('click', e => {
      if (!ham.contains(e.target) && !links.contains(e.target)) {
        links.classList.remove('mobile-open');
        ham.setAttribute('aria-expanded', 'false');
        removeMobileActions();
      }
    });
  }

  /* Mark active nav link */
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') && a.getAttribute('href').includes(path)) a.classList.add('active');
  });

  /* Home select dropdown navigation */
  const homeSelect = document.getElementById('home');
  if (homeSelect) {
    homeSelect.addEventListener('change', (e) => {
      window.location.href = e.target.value;
    });
  }
});

/* ── SCROLL TO TOP ──────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('scroll-top');
  if (!btn) return;
  window.addEventListener('scroll', () => btn.classList.toggle('show', scrollY > 400), { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
});

/* ── NAVBAR SCROLL SHADOW ───────────────────────────────── */
window.addEventListener('scroll', () => {
  const nav = document.querySelector('.navbar');
  if (nav) nav.classList.toggle('scrolled', scrollY > 10);
}, { passive: true });

/* ── TOAST ──────────────────────────────────────────────── */
function showToast(msg, type = 'success', duration = 3000) {
  let c = document.getElementById('toast-container');
  if (!c) { c = document.createElement('div'); c.id = 'toast-container'; document.body.appendChild(c); }
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : '⚠️';
  t.innerHTML = `<span>${icon}</span><span>${msg}</span>`;
  c.appendChild(t);
  setTimeout(() => { t.style.animation = 'slideUp .3s reverse'; setTimeout(() => t.remove(), 300); }, duration);
}

/* ── CART ───────────────────────────────────────────────── */
const Cart = {
  get() { try { return JSON.parse(localStorage.getItem('ha-cart') || '[]'); } catch { return []; } },
  save(c) { localStorage.setItem('ha-cart', JSON.stringify(c)); this.updateBadge(); },
  add(item) {
    const c = this.get(); const idx = c.findIndex(i => i.id === item.id && i.variant === item.variant);
    if (idx > -1) c[idx].qty = (c[idx].qty || 1) + 1; else c.push({ ...item, qty: 1 });
    this.save(c); showToast(`${item.name} added to cart 🛒`);
  },
  remove(id, variant = '') { this.save(this.get().filter(i => !(i.id === id && i.variant === variant))); },
  updateQty(id, variant, qty) {
    const c = this.get(); const idx = c.findIndex(i => i.id === id && i.variant === variant);
    if (idx > -1) { if (qty < 1) this.remove(id, variant); else { c[idx].qty = qty; this.save(c); } }
  },
  total() { return this.get().reduce((s, i) => s + (i.price * (i.qty || 1)), 0); },
  count() { return this.get().reduce((s, i) => s + (i.qty || 1), 0); },
  clear() { localStorage.removeItem('ha-cart'); this.updateBadge(); },
  updateBadge() {
    const n = this.count();
    document.querySelectorAll('.cart-count').forEach(el => { el.textContent = n; el.style.display = n ? '' : 'none'; });
  }
};
document.addEventListener('DOMContentLoaded', () => Cart.updateBadge());

/* ── WISHLIST ───────────────────────────────────────────── */
const Wishlist = {
  get() { try { return JSON.parse(localStorage.getItem('ha-wishlist') || '[]'); } catch { return []; } },
  save(w) { localStorage.setItem('ha-wishlist', JSON.stringify(w)); },
  toggle(id, name) {
    const w = this.get(); const idx = w.indexOf(id);
    if (idx > -1) { w.splice(idx, 1); showToast(`Removed from wishlist`, 'warning'); }
    else { w.push(id); showToast(`${name} saved to wishlist ❤️`); }
    this.save(w); this.syncButtons();
  },
  has(id) { return this.get().includes(id); },
  syncButtons() {
    document.querySelectorAll('[data-wishlist]').forEach(btn => {
      const id = btn.dataset.wishlist;
      btn.classList.toggle('active', this.has(id));
      btn.setAttribute('aria-pressed', this.has(id));
    });
  }
};
document.addEventListener('DOMContentLoaded', () => {
  Wishlist.syncButtons();
  document.addEventListener('click', e => {
    const btn = e.target.closest('[data-wishlist]');
    if (btn) Wishlist.toggle(btn.dataset.wishlist, btn.dataset.name || 'Item');
  });
});

/* ── ADD TO CART BUTTONS ────────────────────────────────── */
document.addEventListener('click', e => {
  const btn = e.target.closest('[data-add-cart]');
  if (!btn) return;
  Cart.add({ id: btn.dataset.id || 'p1', name: btn.dataset.name || 'Product', price: parseFloat(btn.dataset.price || 0), image: btn.dataset.image || '', variant: btn.dataset.variant || '' });
});

/* ── ACCORDION ──────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.accordion-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const body = btn.nextElementSibling;
      const isOpen = btn.classList.contains('open');
      btn.closest('.accordion, .accordion-wrap')?.querySelectorAll('.accordion-btn').forEach(b => {
        b.classList.remove('open'); const bd = b.nextElementSibling; if (bd) bd.style.maxHeight = '0';
      });
      if (!isOpen) { btn.classList.add('open'); body.style.maxHeight = body.scrollHeight + 'px'; }
    });
  });
});

/* ── TABS ───────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.tab-nav').forEach(nav => {
    nav.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.tab;
        nav.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const panels = nav.closest('.tab-wrapper')?.querySelectorAll('.tab-panel') || document.querySelectorAll('.tab-panel');
        panels.forEach(p => p.classList.toggle('active', p.dataset.panel === target));
      });
    });
  });
});

/* ── SHOP FILTER + SORT ─────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('product-grid');
  if (!grid) return;
  const cards = () => [...grid.querySelectorAll('.product-card')];

  /* Search */
  const searchInp = document.getElementById('shop-search');
  if (searchInp) searchInp.addEventListener('input', applyFilters);

  /* Price range */
  const priceRange = document.getElementById('price-range');
  if (priceRange) { priceRange.addEventListener('input', () => { const el = document.getElementById('price-val'); if (el) el.textContent = '$' + priceRange.value; applyFilters(); }); }

  /* Category tags */
  document.querySelectorAll('[data-filter-cat]').forEach(el => el.addEventListener('click', () => {
    document.querySelectorAll('[data-filter-cat]').forEach(t => t.classList.remove('active'));
    el.classList.toggle('active', true); applyFilters();
  }));

  /* Sort */
  const sort = document.getElementById('sort-select');
  if (sort) sort.addEventListener('change', applyFilters);

  function applyFilters() {
    let items = cards();
    const q = searchInp?.value.toLowerCase() || '';
    const cat = document.querySelector('[data-filter-cat].active')?.dataset.filterCat || 'all';
    const maxP = priceRange ? parseFloat(priceRange.value) : Infinity;
    items.forEach(c => {
      const name = (c.querySelector('.product-name')?.textContent || '').toLowerCase();
      const cardCat = c.dataset.cat || 'all';
      const price = parseFloat(c.dataset.price || 0);
      const show = (!q || name.includes(q)) && (cat === 'all' || cardCat === cat) && price <= maxP;
      c.style.display = show ? '' : 'none';
    });
    /* Sort visible */
    if (sort) {
      const visible = items.filter(c => c.style.display !== 'none');
      const val = sort.value;
      visible.sort((a, b) => {
        if (val === 'price-asc') return parseFloat(a.dataset.price) - parseFloat(b.dataset.price);
        if (val === 'price-desc') return parseFloat(b.dataset.price) - parseFloat(a.dataset.price);
        if (val === 'name') return (a.querySelector('.product-name')?.textContent || '').localeCompare(b.querySelector('.product-name')?.textContent || '');
        return 0;
      });
      visible.forEach(c => grid.appendChild(c));
    }
  }
});

/* ── SKELETON LOADER ────────────────────────────────────── */
function showSkeletons(gridId, n = 8) {
  const g = document.getElementById(gridId);
  if (!g) return;
  g.innerHTML = Array(n).fill(`<div class="skeleton skeleton-card"></div>`).join('');
}
function clearSkeletons(gridId) {
  document.getElementById(gridId)?.querySelectorAll('.skeleton').forEach(el => el.remove());
}

/* ── GALLERY ────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.gallery-thumb').forEach(th => {
    th.addEventListener('click', () => {
      const src = th.querySelector('img')?.src;
      const main = th.closest('.product-gallery')?.querySelector('.gallery-main img');
      if (main && src) main.src = src;
      th.closest('.gallery-thumbs')?.querySelectorAll('.gallery-thumb').forEach(t => t.classList.remove('active'));
      th.classList.add('active');
    });
  });
});

/* ── STAR RATING ────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.star-rating').forEach(sr => {
    const stars = sr.querySelectorAll('i');
    stars.forEach((s, i) => {
      s.addEventListener('mouseover', () => stars.forEach((x, j) => x.classList.toggle('active', j <= i)));
      s.addEventListener('click', () => { sr.dataset.rating = i + 1; });
      s.addEventListener('mouseout', () => { const r = parseInt(sr.dataset.rating || 0); stars.forEach((x, j) => x.classList.toggle('active', j < r)); });
    });
  });
});

/* ── CART PAGE RENDER ───────────────────────────────────── */
function renderCart() {
  const container = document.getElementById('cart-items');
  if (!container) return;
  const items = Cart.get();
  if (!items.length) {
    container.innerHTML = `<div style="text-align:center;padding:60px 0"><div style="font-size:3rem;margin-bottom:16px">🌿</div><h3>Your cart is empty</h3><p style="margin:12px 0 24px">Discover our herbal collections</p><a href="shop.html" class="btn btn-primary">Shop Now</a></div>`;
    updateOrderSummary(0, 0); return;
  }
  container.innerHTML = items.map(item => `
    <div class="cart-item" data-id="${item.id}" data-variant="${item.variant || ''}">
      <img src="${item.image || 'assets/images/placeholder.jpg'}" alt="${item.name}" class="cart-item-img">
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        ${item.variant ? `<div class="cart-item-variant">${item.variant}</div>` : ''}
      </div>
      <div class="qty-control">
        <button class="qty-btn" onclick="Cart.updateQty('${item.id}','${item.variant || ''}',${(item.qty || 1) - 1});renderCart()">−</button>
        <input class="qty-val" value="${item.qty || 1}" readonly>
        <button class="qty-btn" onclick="Cart.updateQty('${item.id}','${item.variant || ''}',${(item.qty || 1) + 1});renderCart()">+</button>
      </div>
      <div class="cart-item-price">$${(item.price * (item.qty || 1)).toFixed(2)}</div>
      <button class="cart-remove" onclick="Cart.remove('${item.id}','${item.variant || ''}');renderCart()" aria-label="Remove"><i class="fas fa-trash-alt"></i></button>
    </div>`).join('');
  const subtotal = Cart.total();
  const shipping = subtotal > 50 ? 0 : 5.99;
  updateOrderSummary(subtotal, shipping);
}

function updateOrderSummary(sub, ship) {
  const el = id => document.getElementById(id);
  if (el('summary-subtotal')) el('summary-subtotal').textContent = '$' + sub.toFixed(2);
  if (el('summary-shipping')) el('summary-shipping').textContent = ship === 0 ? 'FREE' : '$' + ship.toFixed(2);
  if (el('summary-total')) el('summary-total').textContent = '$' + (sub + ship).toFixed(2);
}
document.addEventListener('DOMContentLoaded', renderCart);

/* ── CHECKOUT FORM ──────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('checkout-form');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!validateForm(form)) return;
    const btn = form.querySelector('[type=submit]');
    btn.innerHTML = `<div class="spinner"></div> Processing…`;
    btn.classList.add('btn-loading');
    setTimeout(() => { Cart.clear(); location.href = 'order-confirmation.html'; }, 2200);
  });
});

/* ── FORM VALIDATION ────────────────────────────────────── */
function validateForm(form) {
  let ok = true;
  form.querySelectorAll('[required]').forEach(f => {
    const err = f.parentElement.querySelector('.form-error');
    const empty = !f.value.trim();
    const emailBad = f.type === 'email' && f.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value);
    f.classList.toggle('error', empty || emailBad);
    if (err) { err.textContent = empty ? 'This field is required.' : emailBad ? 'Please enter a valid email.' : ''; err.classList.toggle('show', empty || emailBad); }
    if (empty || emailBad) ok = false;
  });
  return ok;
}
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.form-control[required]').forEach(f => {
    f.addEventListener('blur', () => {
      const err = f.parentElement.querySelector('.form-error');
      const empty = !f.value.trim();
      f.classList.toggle('error', empty);
      if (err) { err.textContent = empty ? 'This field is required.' : ''; err.classList.toggle('show', empty); }
    });
    f.addEventListener('input', () => { if (f.value.trim()) { f.classList.remove('error'); const err = f.parentElement.querySelector('.form-error'); if (err) err.classList.remove('show'); } });
  });
});

/* ── COUNTDOWN ──────────────────────────────────────────── */
function startCountdown(targetDate) {
  function update() {
    const diff = new Date(targetDate) - Date.now();
    if (diff <= 0) { document.querySelectorAll('.countdown-num').forEach(el => el.textContent = '00'); return; }
    const d = Math.floor(diff / 86400000), h = Math.floor(diff % 86400000 / 3600000), m = Math.floor(diff % 3600000 / 60000), s = Math.floor(diff % 60000 / 1000);
    const pad = n => String(n).padStart(2, '0');
    const els = { days: pad(d), hours: pad(h), minutes: pad(m), seconds: pad(s) };
    Object.entries(els).forEach(([k, v]) => { const el = document.getElementById('cd-' + k); if (el) el.textContent = v; });
  }
  update(); setInterval(update, 1000);
}

/* ── CONTACT FORM ───────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const cf = document.getElementById('contact-form');
  if (!cf) return;
  cf.addEventListener('submit', e => {
    e.preventDefault();
    if (!validateForm(cf)) return;
    const btn = cf.querySelector('[type=submit]');
    btn.innerHTML = '<div class="spinner"></div> Sending…'; btn.classList.add('btn-loading');
    setTimeout(() => { btn.textContent = 'Message Sent ✅'; btn.classList.remove('btn-loading'); cf.reset(); showToast('Message sent successfully! We\'ll respond within 24h.'); }, 1800);
  });
});

/* ── NEWSLETTER ─────────────────────────────────────────── */
document.addEventListener('click', e => {
  const btn = e.target.closest('[data-newsletter]');
  if (!btn) return;
  const form = btn.closest('form');
  const input = form?.querySelector('input[type=email]');
  if (!input?.value || !/\S+@\S+\.\S+/.test(input.value)) { showToast('Please enter a valid email', 'error'); return; }
  btn.textContent = 'Subscribed! 🌿'; showToast('Welcome to the Herbal community! 🌿');
  input.value = '';
  setTimeout(() => { btn.textContent = 'Subscribe'; }, 3000);
});

/* ── UTILS ────────────────────────────────────────────────── */
function formatPrice(n) { return '$' + parseFloat(n).toFixed(2); }
