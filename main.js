// ─── CONFIG ───────────────────────────────────────────────────────────────────
const CONFIG = {
  // REPLACE with your actual Google Apps Script Web App URL after deployment
  GOOGLE_SHEET_URL: 'https://script.google.com/macros/s/AKfycbzTe_jLQ97jBWWtTQ-kJ6MoiyViHZFbSlE73uq5nCwIC8D4jl-2KBgx3V7l2KcCxwGM/exec',

  // Your WhatsApp number (Bangladesh format: country code + number, no +)
  WHATSAPP_NUMBER: '8801680849030',

  // bKash / Nagad merchant number
  BKASH_NUMBER: '01680849030',
  NAGAD_NUMBER: '01680849030',

  PRODUCTS: [
    {
      id: 'nak-10kg',
      name: 'Nak Fazli Mango',
      variant: '10 kg Box',
      price: 1400,
      emoji: '🥭',
      desc: 'Standard family box — freshly harvested, tree-ripened Nak Fazli mangoes.',
      badge: 'Popular'
    },
    {
      id: 'nak-20kg',
      name: 'Nak Fazli Mango',
      variant: '20 kg Box',
      price: 2500,
      emoji: '🥭',
      desc: 'Bulk family pack — best value per kg for large families or gifting.',
      badge: 'Best Value'
    },
    {
      id: 'nak-dozen',
      name: 'Nak Fazli Mango',
      variant: 'Premium Dozen',
      price: 650,
      emoji: '🥭',
      desc: 'Handpicked premium dozen — gift-ready, perfectly sized golden mangoes.',
      badge: 'Gift Ready'
    }
  ]
};

// ─── CART ─────────────────────────────────────────────────────────────────────
let cart = JSON.parse(localStorage.getItem('fruitology_cart') || 'null');

function saveCart() {
  localStorage.setItem('fruitology_cart', JSON.stringify(cart));
}

function addToCart(productId) {
  const product = CONFIG.PRODUCTS.find(p => p.id === productId);
  if (!product) return;
  cart = { ...product };
  saveCart();
  showToast('Added to cart! 🛒');
  updateCartBadge();
}

function updateCartBadge() {
  const badge = document.getElementById('cart-badge');
  if (badge) {
    badge.textContent = cart ? '1' : '0';
    badge.style.display = cart ? 'flex' : 'none';
  }
}

function showToast(msg) {
  let t = document.getElementById('toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    t.style.cssText = `position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#1a3a2a;color:#fff;padding:12px 24px;border-radius:40px;font-size:14px;z-index:9999;transition:opacity 0.3s;white-space:nowrap;`;
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.opacity = '1';
  clearTimeout(t._tid);
  t._tid = setTimeout(() => { t.style.opacity = '0'; }, 2500);
}

// ─── GOOGLE SHEETS SUBMIT ─────────────────────────────────────────────────────
async function submitToGoogleSheets(data) {
  try {
    const response = await fetch(CONFIG.GOOGLE_SHEET_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return true;
  } catch (err) {
    console.warn('Sheet submit failed:', err);
    return false;
  }
}

// ─── WHATSAPP ORDER ───────────────────────────────────────────────────────────
function buildWhatsAppMessage(order) {
  const lines = [
    '🥭 *New Order — Fruitology*',
    '━━━━━━━━━━━━━━━━',
    `📦 Product: ${order.product} (${order.variant})`,
    `💰 Amount: ৳${order.price.toLocaleString()}`,
    `👤 Name: ${order.name}`,
    `📱 Mobile: ${order.mobile}`,
    `📍 Address: ${order.address}`,
    `🚚 Courier: ${order.courier}`,
    `💳 Payment: ${order.paymentMethod}`,
    `🔖 Ref: ${order.ref}`,
    '━━━━━━━━━━━━━━━━',
    '_Please confirm this order. Thank you!_'
  ];
  return encodeURIComponent(lines.join('\n'));
}

function openWhatsApp(order) {
  const msg = buildWhatsAppMessage(order);
  const url = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${msg}`;
  window.open(url, '_blank');
}

// ─── QR CODE GENERATOR (pure JS, no library) ─────────────────────────────────
function generateQRCodeSVG(url, size = 150) {
  // Simplified visual QR placeholder that links to actual URL
  // In production, use a real QR library
  const encoded = encodeURIComponent(url);
  return `
    <div style="position:relative;width:${size}px;height:${size}px;cursor:pointer;" onclick="window.open('${url}','_blank')" title="Click to open: ${url}">
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
        <rect width="${size}" height="${size}" fill="#fff"/>
        <!-- Top-left finder -->
        <rect x="10" y="10" width="35" height="35" fill="#1a3a2a" rx="3"/>
        <rect x="14" y="14" width="27" height="27" fill="#fff" rx="2"/>
        <rect x="18" y="18" width="19" height="19" fill="#1a3a2a" rx="1"/>
        <!-- Top-right finder -->
        <rect x="${size-45}" y="10" width="35" height="35" fill="#1a3a2a" rx="3"/>
        <rect x="${size-41}" y="14" width="27" height="27" fill="#fff" rx="2"/>
        <rect x="${size-37}" y="18" width="19" height="19" fill="#1a3a2a" rx="1"/>
        <!-- Bottom-left finder -->
        <rect x="10" y="${size-45}" width="35" height="35" fill="#1a3a2a" rx="3"/>
        <rect x="14" y="${size-41}" width="27" height="27" fill="#fff" rx="2"/>
        <rect x="18" y="${size-37}" width="19" height="19" fill="#1a3a2a" rx="1"/>
        <!-- Data dots -->
        <rect x="52" y="10" width="5" height="5" fill="#1a3a2a"/>
        <rect x="60" y="10" width="5" height="5" fill="#1a3a2a"/>
        <rect x="72" y="10" width="5" height="5" fill="#1a3a2a"/>
        <rect x="80" y="10" width="5" height="5" fill="#1a3a2a"/>
        <rect x="52" y="18" width="5" height="5" fill="#1a3a2a"/>
        <rect x="68" y="18" width="5" height="5" fill="#1a3a2a"/>
        <rect x="80" y="18" width="5" height="5" fill="#1a3a2a"/>
        <rect x="56" y="26" width="5" height="5" fill="#1a3a2a"/>
        <rect x="64" y="26" width="5" height="5" fill="#1a3a2a"/>
        <rect x="76" y="26" width="5" height="5" fill="#1a3a2a"/>
        <rect x="10" y="52" width="5" height="5" fill="#1a3a2a"/>
        <rect x="18" y="52" width="5" height="5" fill="#1a3a2a"/>
        <rect x="30" y="52" width="5" height="5" fill="#1a3a2a"/>
        <rect x="38" y="52" width="5" height="5" fill="#1a3a2a"/>
        <rect x="52" y="52" width="5" height="5" fill="#1a3a2a"/>
        <rect x="64" y="52" width="5" height="5" fill="#1a3a2a"/>
        <rect x="76" y="52" width="5" height="5" fill="#1a3a2a"/>
        <rect x="88" y="52" width="5" height="5" fill="#1a3a2a"/>
        <rect x="14" y="60" width="5" height="5" fill="#1a3a2a"/>
        <rect x="26" y="60" width="5" height="5" fill="#1a3a2a"/>
        <rect x="56" y="60" width="5" height="5" fill="#1a3a2a"/>
        <rect x="72" y="60" width="5" height="5" fill="#1a3a2a"/>
        <rect x="84" y="60" width="5" height="5" fill="#1a3a2a"/>
        <rect x="10" y="68" width="5" height="5" fill="#1a3a2a"/>
        <rect x="22" y="68" width="5" height="5" fill="#1a3a2a"/>
        <rect x="34" y="68" width="5" height="5" fill="#1a3a2a"/>
        <rect x="52" y="68" width="5" height="5" fill="#1a3a2a"/>
        <rect x="60" y="68" width="5" height="5" fill="#1a3a2a"/>
        <rect x="80" y="68" width="5" height="5" fill="#1a3a2a"/>
        <rect x="88" y="68" width="5" height="5" fill="#1a3a2a"/>
        <rect x="${size-45}" y="52" width="5" height="5" fill="#1a3a2a"/>
        <rect x="${size-37}" y="52" width="5" height="5" fill="#1a3a2a"/>
        <rect x="${size-25}" y="52" width="5" height="5" fill="#1a3a2a"/>
        <rect x="${size-45}" y="60" width="5" height="5" fill="#1a3a2a"/>
        <rect x="${size-29}" y="60" width="5" height="5" fill="#1a3a2a"/>
        <rect x="${size-13}" y="60" width="5" height="5" fill="#1a3a2a"/>
        <rect x="${size-41}" y="68" width="5" height="5" fill="#1a3a2a"/>
        <rect x="${size-25}" y="68" width="5" height="5" fill="#1a3a2a"/>
        <rect x="${size-13}" y="68" width="5" height="5" fill="#1a3a2a"/>
        <rect x="10" y="${size-45}" width="5" height="5" fill="#1a3a2a"/>
        <rect x="26" y="${size-45}" width="5" height="5" fill="#1a3a2a"/>
        <rect x="38" y="${size-45}" width="5" height="5" fill="#1a3a2a"/>
        <rect x="52" y="${size-45}" width="5" height="5" fill="#1a3a2a"/>
        <rect x="64" y="${size-45}" width="5" height="5" fill="#1a3a2a"/>
        <rect x="76" y="${size-45}" width="5" height="5" fill="#1a3a2a"/>
        <rect x="88" y="${size-45}" width="5" height="5" fill="#1a3a2a"/>
        <rect x="18" y="${size-37}" width="5" height="5" fill="#1a3a2a"/>
        <rect x="34" y="${size-37}" width="5" height="5" fill="#1a3a2a"/>
        <rect x="56" y="${size-37}" width="5" height="5" fill="#1a3a2a"/>
        <rect x="72" y="${size-37}" width="5" height="5" fill="#1a3a2a"/>
        <rect x="84" y="${size-37}" width="5" height="5" fill="#1a3a2a"/>
        <rect x="10" y="${size-29}" width="5" height="5" fill="#1a3a2a"/>
        <rect x="22" y="${size-29}" width="5" height="5" fill="#1a3a2a"/>
        <rect x="60" y="${size-29}" width="5" height="5" fill="#1a3a2a"/>
        <rect x="76" y="${size-29}" width="5" height="5" fill="#1a3a2a"/>
        <rect x="88" y="${size-29}" width="5" height="5" fill="#1a3a2a"/>
        <!-- WhatsApp green dot center -->
        <circle cx="${size/2}" cy="${size/2}" r="12" fill="#25D366"/>
        <text x="${size/2}" y="${size/2+5}" text-anchor="middle" fill="white" font-size="14">✓</text>
      </svg>
      <div style="position:absolute;bottom:-22px;left:50%;transform:translateX(-50%);font-size:10px;color:#888;white-space:nowrap;">Tap to open WhatsApp</div>
    </div>
  `;
}

// ─── UTILITY ──────────────────────────────────────────────────────────────────
function generateRef() {
  return 'FRT-' + Date.now().toString(36).toUpperCase().slice(-6);
}

function validateBD(mobile) {
  return /^01[3-9]\d{8}$/.test(mobile.trim());
}
