/* ═══════════════════════════════════════════════════
   THAMAQ RESTAURANT — Main JavaScript
   Features: Navbar, Cart, Chatbot, Animations,
             Counter, Slider, QR Code, Dark Mode
═══════════════════════════════════════════════════ */

'use strict';

// ── CART STATE ──
const cart = [];

// ── CHATBOT RESPONSES ──
const botReplies = {
  biryani: "🍛 Our Biryani is a must-try! We have Chicken (₹320), Mutton (₹380), and Veg Biryani options. Slow-cooked dum style!",
  tandoori: "🔥 The Tandoori Mixed Platter (₹560) is our most popular dish — seekh kebab, chicken tikka & reshmi kebab all in one!",
  alfaham: "🍗 Our signature Alfaham Grilled Chicken (₹450) is marinated in Arabian spices and charcoal grilled to perfection!",
  menu: "📋 You can browse our full menu on this page! We serve Indian, Arabian, Chinese & Continental. Shall I highlight any section?",
  hours: "🕐 We're open every day from 12:00 PM to 1:00 AM (midnight). Come in anytime!",
  location: "📍 We're at Bagalur Main Rd, opp. Indian Oil Petrol Pump, Bengaluru 560064. Near Yelahanka. Easy to find!",
  phone: "📞 You can call us at +91 07902227103 for reservations or queries!",
  reservation: "📅 You can book a table using the 'Reserve a Table' form on this page, or call us at 07902227103!",
  order: "🛒 Click '+ Add' on any dish to add it to your cart. You can also order via Zomato or Swiggy!",
  offer: "🎉 Current offer: 20% off on orders above ₹500! Use code THAMAQ20. Also check our Family Feast Deal!",
  parking: "🅿️ Yes, we have parking available near the restaurant. We're opposite the Indian Oil Petrol Pump on Bagalur Main Road.",
  veg: "🌱 Yes! We have several vegetarian options including Paneer Tikka, Veg Biryani, Hakka Noodles, and Penne Arrabiata.",
  delivery: "🚴 We're available on Zomato and Swiggy for delivery! Links are in the footer.",
  price: "💰 Our prices range from ₹180 (soups) to ₹560 (platters). Great value for the quality!",
  hi: "👋 Hi there! Welcome to Thamaq! How can I help you today? You can ask about our menu, hours, location, reservations, or offers!",
  hello: "👋 Hello! Welcome to Thamaq Restaurant! What would you like to know?",
  thanks: "😊 You're welcome! Enjoy your meal at Thamaq! Is there anything else I can help you with?",
  default: "🤔 I'm not sure about that, but I'd love to help! You can ask me about our menu, hours (12 PM–1 AM), location, reservations, or current offers. Or call us at 07902227103!"
};

// ── DOM READY ──
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHeroParticles();
  initCounters();
  initTestimonialSlider();
  initMenuFilter();
  initScrollAnimations();
  initImageFallbacks();
  setMinDate();
  generateQRCode();
  initParallax();
});

function initImageFallbacks() {
  document.querySelectorAll('img[data-fallback]').forEach(img => {
    if (img.dataset.fallbackReady === 'true') return;
    img.dataset.fallbackReady = 'true';
    img.addEventListener('error', () => {
      const fallback = img.dataset.fallback;
      if (fallback && img.src.indexOf(fallback) === -1) {
        img.src = fallback;
      }
    }, { once: true });
  });
}

initImageFallbacks();

// ══════════════════════ NAVBAR ══════════════════════
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const links = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveLink();
  });

  links.forEach(link => {
    link.addEventListener('click', () => {
      document.getElementById('navLinks').classList.remove('open');
    });
  });
}

function updateActiveLink() {
  const sections = ['home', 'menu', 'about', 'reservation', 'contact'];
  const links = document.querySelectorAll('.nav-link');
  const scrollPos = window.scrollY + 100;

  sections.forEach((id, i) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.offsetTop;
      const bottom = top + el.offsetHeight;
      if (scrollPos >= top && scrollPos < bottom) {
        links.forEach(l => l.classList.remove('active'));
        if (links[i]) links[i].classList.add('active');
      }
    }
  });
}

function toggleMenu() {
  const navLinks = document.getElementById('navLinks');
  const hamburger = document.getElementById('hamburger');
  navLinks.classList.toggle('open');
  hamburger.classList.toggle('open');
}

// ══════════════════════ DARK / LIGHT MODE ══════════════════════
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');

themeToggle.addEventListener('click', () => {
  const html = document.documentElement;
  const isDark = html.getAttribute('data-theme') === 'dark';
  html.setAttribute('data-theme', isDark ? 'light' : 'dark');
  themeIcon.className = isDark ? 'fas fa-moon' : 'fas fa-sun';
  localStorage.setItem('thamaq-theme', isDark ? 'light' : 'dark');
});

// Load saved theme
const savedTheme = localStorage.getItem('thamaq-theme');
if (savedTheme) {
  document.documentElement.setAttribute('data-theme', savedTheme);
  themeIcon.className = savedTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
}

// ══════════════════════ SMOOTH SCROLL ══════════════════════
function scrollTo(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

// ══════════════════════ HERO PARTICLES ══════════════════════
function initHeroParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      width: ${Math.random() * 3 + 1}px;
      height: ${Math.random() * 3 + 1}px;
      animation-duration: ${Math.random() * 12 + 8}s;
      animation-delay: ${Math.random() * 8}s;
      opacity: ${Math.random() * 0.6};
    `;
    container.appendChild(p);
  }
}

// ══════════════════════ PARALLAX ══════════════════════
function initParallax() {
  const heroBg = document.querySelector('.hero-bg');
  window.addEventListener('scroll', () => {
    if (heroBg && window.scrollY < window.innerHeight) {
      heroBg.style.transform = `translateY(${window.scrollY * 0.35}px)`;
    }
  }, { passive: true });
}

// ══════════════════════ COUNTERS ══════════════════════
function initCounters() {
  const counters = document.querySelectorAll('.stat-num');
  let started = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !started) {
        started = true;
        counters.forEach(counter => animateCounter(counter));
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'));
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;

  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current).toLocaleString();
  }, 16);
}

// ══════════════════════ CART ══════════════════════
function addToCart(name, price) {
  const existing = cart.find(item => item.name === name);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ name, price, qty: 1 });
  }
  updateCartUI();
  showToast(`✅ ${name} added to cart!`);
}

function removeFromCart(name) {
  const idx = cart.findIndex(item => item.name === name);
  if (idx > -1) {
    if (cart[idx].qty > 1) {
      cart[idx].qty--;
    } else {
      cart.splice(idx, 1);
    }
  }
  updateCartUI();
}

function updateCartUI() {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  
  document.getElementById('cartCount').textContent = count;
  document.getElementById('cartTotal').textContent = `₹ ${total.toLocaleString()}`;
  
  const cartItems = document.getElementById('cartItems');
  const cartFooter = document.getElementById('cartFooter');

  if (cart.length === 0) {
    cartItems.innerHTML = '<div class="cart-empty"><i class="fas fa-shopping-bag"></i><p>Your cart is empty</p></div>';
    cartFooter.style.display = 'none';
  } else {
    cartFooter.style.display = 'block';
    cartItems.innerHTML = cart.map(item => `
      <div class="cart-item">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-qty">
          <button class="qty-btn" onclick="removeFromCart('${item.name}')">−</button>
          <span>${item.qty}</span>
          <button class="qty-btn" onclick="addToCart('${item.name}', ${item.price})">+</button>
        </div>
        <div class="cart-item-price">₹${(item.price * item.qty).toLocaleString()}</div>
      </div>
    `).join('');
  }
}

function toggleCart() {
  const sidebar = document.getElementById('cartSidebar');
  const overlay = document.getElementById('cartOverlay');
  sidebar.classList.toggle('active');
  overlay.classList.toggle('active');
  document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
}

function checkout() {
  if (cart.length === 0) { showToast('Your cart is empty!'); return; }
  showToast('🎉 Order placed! We\'ll confirm shortly.');
  cart.length = 0;
  updateCartUI();
  toggleCart();
}

// ══════════════════════ MENU FILTER ══════════════════════
function initMenuFilter() {
  // already handled via inline handlers
}

function filterMenu() {
  const query = document.getElementById('menuSearch').value.toLowerCase();
  const cards = document.querySelectorAll('.menu-card');
  const activeCat = document.querySelector('.cat-tab.active')?.dataset?.cat || 'all';
  let visibleCount = 0;

  cards.forEach(card => {
    const name = card.dataset.name || '';
    const cat = card.dataset.cat || '';
    const matchesSearch = name.includes(query);
    const matchesCat = activeCat === 'all' || cat === activeCat;

    if (matchesSearch && matchesCat) {
      card.style.display = '';
      visibleCount++;
    } else {
      card.style.display = 'none';
    }
  });

  const emptyEl = document.getElementById('menuEmpty');
  emptyEl.classList.toggle('hidden', visibleCount > 0);
}

function filterCat(cat, btn) {
  document.querySelectorAll('.cat-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  btn.dataset.cat = cat;
  filterMenu();
}

// Fix: store cat on button for filterMenu to read
document.querySelectorAll && document.querySelectorAll('.cat-tab').forEach(btn => {
  btn.addEventListener('click', function() {
    // cat is passed via onclick param, already stored
  });
});

// ══════════════════════ TESTIMONIALS SLIDER ══════════════════════
function initTestimonialSlider() {
  const track = document.getElementById('testimonialTrack');
  const dotsContainer = document.getElementById('sliderDots');
  if (!track || !dotsContainer) return;

  const cards = track.querySelectorAll('.testimonial-card');
  const cardWidth = 100 / 3; // percentage
  let current = 0;
  const max = Math.max(0, cards.length - 3);

  // Create dots
  for (let i = 0; i <= max; i++) {
    const dot = document.createElement('div');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  }

  function goTo(idx) {
    current = Math.max(0, Math.min(idx, max));
    track.style.transform = `translateX(-${current * (cardWidth + 1.5)}%)`;
    dotsContainer.querySelectorAll('.dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  // Auto-advance
  const autoPlay = setInterval(() => {
    goTo(current >= max ? 0 : current + 1);
  }, 4000);

  // Touch/drag support
  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) goTo(diff > 0 ? current + 1 : current - 1);
  });

  // Responsive: show 1 card on mobile
  function updateSlider() {
    const isMobile = window.innerWidth < 768;
    cards.forEach(c => {
      c.style.flex = isMobile ? '0 0 85%' : '0 0 calc(33.333% - 1rem)';
    });
  }
  updateSlider();
  window.addEventListener('resize', updateSlider);
}

// ══════════════════════ SCROLL ANIMATIONS ══════════════════════
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('aos-animate');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('[data-aos]').forEach(el => {
    const delay = el.dataset.aosDelay || 0;
    el.style.transitionDelay = `${delay}ms`;
    observer.observe(el);
  });
}

// ══════════════════════ CHATBOT ══════════════════════
function toggleChatbot() {
  const widget = document.getElementById('chatbotWidget');
  const fab = document.getElementById('chatbotFab');
  widget.classList.toggle('open');
  fab.innerHTML = widget.classList.contains('open')
    ? '<i class="fas fa-times"></i>'
    : '<i class="fas fa-comments"></i>';
}

function sendChat() {
  const input = document.getElementById('chatInput');
  const msg = input.value.trim();
  if (!msg) return;

  appendChat(msg, 'user');
  input.value = '';

  // Determine response
  const lower = msg.toLowerCase();
  let reply = botReplies.default;

  for (const [key, response] of Object.entries(botReplies)) {
    if (lower.includes(key)) {
      reply = response;
      break;
    }
  }

  // Simulate typing
  setTimeout(() => appendChat(reply, 'bot'), 700);
}

function appendChat(text, type) {
  const messages = document.getElementById('chatMessages');
  const div = document.createElement('div');
  div.className = `chat-msg ${type}`;
  div.innerHTML = `<span>${text}</span>`;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

// ══════════════════════ RESERVATION ══════════════════════
async function postJson(url, payload) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.success === false) {
    throw new Error(data.error || 'Request failed');
  }
  return data;
}

async function submitReservation(e) {
  e.preventDefault();
  const form = e.target;
  const inputs = form.querySelectorAll('input, select, textarea');
  const payload = {
    name: inputs[0].value.trim(),
    phone: inputs[1].value.trim(),
    date: inputs[2].value,
    time: inputs[3].value,
    guests: inputs[4].value,
    occasion: inputs[5].value,
    requests: inputs[6].value.trim()
  };

  try {
    const data = await postJson('/api/reservations', payload);
    showToast(data.message || '🎉 Reservation confirmed! We\'ll call you shortly to confirm.');
    form.reset();
  } catch (err) {
    showToast(`Reservation not saved: ${err.message}`);
  }
}

function setMinDate() {
  const dateInput = document.getElementById('resDate');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }
}

// ══════════════════════ CONTACT ══════════════════════
async function submitContact(e) {
  e.preventDefault();
  const form = e.target;
  const inputs = form.querySelectorAll('input, textarea');
  const payload = {
    name: inputs[0].value.trim(),
    email: inputs[1].value.trim(),
    phone: inputs[2].value.trim(),
    message: inputs[3].value.trim()
  };

  try {
    const data = await postJson('/api/contact', payload);
    showToast(data.message || '✅ Message sent! We\'ll get back to you within 24 hours.');
    form.reset();
  } catch (err) {
    showToast(`Message not saved: ${err.message}`);
  }
}

// ══════════════════════ TOAST ══════════════════════
let toastTimer;
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}

// ══════════════════════ MODAL ══════════════════════
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) { modal.classList.add('open'); document.body.style.overflow = 'hidden'; }
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) { modal.classList.remove('open'); document.body.style.overflow = ''; }
}

function switchTab(tab, btn) {
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  document.querySelectorAll('.modal-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');

  if (tab === 'login') {
    loginForm.classList.remove('hidden');
    signupForm.classList.add('hidden');
  } else {
    loginForm.classList.add('hidden');
    signupForm.classList.remove('hidden');
  }
}

async function submitSignup() {
  const inputs = document.querySelectorAll('#signupForm input');
  const payload = {
    name: inputs[0].value.trim(),
    email: inputs[1].value.trim(),
    password: inputs[2].value
  };

  try {
    const data = await postJson('/api/auth/signup', payload);
    showToast(data.message || 'Account created! Welcome to Thamaq 🎉');
    document.querySelectorAll('#signupForm input').forEach(input => { input.value = ''; });
    closeModal('loginModal');
  } catch (err) {
    showToast(`Signup failed: ${err.message}`);
  }
}

async function submitLogin() {
  const inputs = document.querySelectorAll('#loginForm input');
  const payload = {
    email: inputs[0].value.trim(),
    password: inputs[1].value
  };

  try {
    const data = await postJson('/api/auth/login', payload);
    if (data.user) {
      localStorage.setItem('thamaq-user', JSON.stringify(data.user));
    }
    showToast('Logged in successfully! 🎉');
    document.querySelectorAll('#loginForm input').forEach(input => { input.value = ''; });
    closeModal('loginModal');
  } catch (err) {
    showToast(`Login failed: ${err.message}`);
  }
}

// ══════════════════════ QR CODE (SVG-based) ══════════════════════
function generateQRCode() {
  const el = document.getElementById('qrCode');
  if (!el) return;

  // Simple QR-like pattern SVG (representative; for real QR use a library)
  const size = 104;
  const cells = 21;
  const cellSize = size / cells;

  // Deterministic pseudo-random pattern seeded for Thamaq URL
  const url = 'https://www.zomato.com/bangalore/thamaq-restaurant-yelahanka-bangalore/order';
  let seed = url.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const rand = () => { seed = (seed * 1664525 + 1013904223) & 0xffffffff; return (seed >>> 0) / 0xffffffff; };

  // Finder pattern positions to always be dark
  const finderCells = new Set();
  const addFinder = (r, c) => {
    for (let dr = 0; dr < 7; dr++)
      for (let dc = 0; dc < 7; dc++)
        if ((dr === 0 || dr === 6 || dc === 0 || dc === 6) || (dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4))
          finderCells.add(`${r+dr},${c+dc}`);
  };
  addFinder(0,0); addFinder(0,14); addFinder(14,0);

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <rect width="${size}" height="${size}" fill="white"/>`;

  for (let r = 0; r < cells; r++) {
    for (let c = 0; c < cells; c++) {
      const isFinder = finderCells.has(`${r},${c}`);
      const isData = isFinder || rand() > 0.5;
      if (isData) {
        svg += `<rect x="${c*cellSize}" y="${r*cellSize}" width="${cellSize}" height="${cellSize}" fill="black"/>`;
      }
    }
  }

  svg += `</svg>`;
  el.innerHTML = svg;
}

// ══════════════════════ KEYBOARD & ACCESSIBILITY ══════════════════════
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.open').forEach(m => m.classList.remove('open'));
    document.getElementById('cartSidebar').classList.remove('active');
    document.getElementById('cartOverlay').classList.remove('active');
    document.body.style.overflow = '';
  }
});

// ══════════════════════ SMOOTH NAV LINK SCROLL ══════════════════════
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ══════════════════════ CATEGORY TAB DATA FIX ══════════════════════
// Ensure cat tab active reads the correct filter value
(function fixCatTabs() {
  const catMap = ['all','indian','arabian','chinese','continental'];
  document.querySelectorAll('.cat-tab').forEach((btn, i) => {
    if (catMap[i]) btn.setAttribute('data-cat', catMap[i]);
  });
})();

console.log('🍽️ Thamaq Restaurant — Loaded Successfully!');
