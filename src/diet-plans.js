/**
 * Noble Homoeopathy Clinic — Diet Plans & Payment Integration
 * Seamless UPI Instant Payments (GPay / PhonePe / Paytm / QR) + Razorpay Ready
 */

// Global state
let currentSelectedPlanId = null;
let allDietPlans = [];

// Initialize once DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Load plans from embedded JSON
  const dataScript = document.getElementById('diet-plans-data');
  if (dataScript) {
    try {
      allDietPlans = JSON.parse(dataScript.textContent);
    } catch (e) {
      console.error('Error parsing diet plans data:', e);
    }
  }

  // Update card buttons based on local storage
  updatePurchasedButtons();

  // Setup category filters
  setupFilters();

  // Check URL params (e.g. ?plan=weight-loss)
  const urlParams = new URLSearchParams(window.location.search);
  const targetPlan = urlParams.get('plan');
  if (targetPlan) {
    const card = document.getElementById(`diet-card-${targetPlan}`);
    if (card) {
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      card.style.borderColor = 'var(--primary)';
    }
  }
});

// Category filtering
function setupFilters() {
  const filterBtns = document.querySelectorAll('.diet-filter-btn');
  const cards = document.querySelectorAll('.diet-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      cards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.3s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// Check purchased plans in localStorage
function getPurchasedPlans() {
  try {
    const data = localStorage.getItem('nhc_purchased_plans');
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

function savePurchasedPlan(planId, details = {}) {
  try {
    const plans = getPurchasedPlans();
    if (!plans.includes(planId)) {
      plans.push(planId);
      localStorage.setItem('nhc_purchased_plans', JSON.stringify(plans));
    }
    // Also save order record
    const records = JSON.parse(localStorage.getItem('nhc_orders') || '[]');
    records.push({
      planId,
      date: new Date().toISOString(),
      ...details
    });
    localStorage.setItem('nhc_orders', JSON.stringify(records));
  } catch (e) {
    console.warn('Storage warning:', e);
  }
  updatePurchasedButtons();
}

function updatePurchasedButtons() {
  const purchased = getPurchasedPlans();
  purchased.forEach(planId => {
    const btn = document.getElementById(`btn-buy-${planId}`);
    if (btn) {
      btn.innerHTML = '<i class="fas fa-check-circle"></i> View / Download';
      btn.classList.add('btn-purchased-active');
      btn.onclick = () => openReader(planId);
    }
  });
}

// ══════════════════════════════════════
// ── Modal Handlers
// ══════════════════════════════════════
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
  }
}

// Close on clicking outside modal card
window.addEventListener('click', (e) => {
  if (e.target.classList.contains('diet-modal-overlay')) {
    e.target.classList.remove('active');
  }
});

// Close on Escape key
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.diet-modal-overlay.active').forEach(m => m.classList.remove('active'));
  }
});

// ══════════════════════════════════════
// ── Preview Sample Modal
// ══════════════════════════════════════
function openPreview(planId) {
  const plan = allDietPlans.find(p => p.id === planId);
  if (!plan) return;

  document.getElementById('preview-title').innerText = plan.title;
  document.getElementById('preview-category').innerText = plan.category;
  document.getElementById('preview-tagline').innerText = plan.tagline;

  const sampleBody = document.getElementById('preview-sample-content');
  sampleBody.innerHTML = `
    <div class="reader-section">
      <h4><i class="fas fa-sun" style="color:#f59e0b;"></i> Sample Day Snapshot</h4>
      <div class="reader-meal-row">
        <div class="reader-meal-time">🌅 Early Morning</div>
        <div class="reader-meal-desc">${plan.sampleMeal.morning}</div>
      </div>
      <div class="reader-meal-row">
        <div class="reader-meal-time">🥣 Breakfast</div>
        <div class="reader-meal-desc">${plan.sampleMeal.breakfast}</div>
      </div>
      <div class="reader-meal-row">
        <div class="reader-meal-time">🥗 Lunch</div>
        <div class="reader-meal-desc">${plan.sampleMeal.lunch}</div>
      </div>
      <div class="reader-meal-row">
        <div class="reader-meal-time">🍵 Evening Snack</div>
        <div class="reader-meal-desc">${plan.sampleMeal.evening}</div>
      </div>
      <div class="reader-meal-row">
        <div class="reader-meal-time">🍲 Dinner</div>
        <div class="reader-meal-desc">${plan.sampleMeal.dinner}</div>
      </div>
    </div>

    <div class="reader-section" style="border-left-color: #10b981;">
      <h4><i class="fas fa-box-open" style="color:#10b981;"></i> What's Included in the Full Plan:</h4>
      <ul class="reader-list">
        ${plan.includes.map(inc => `<li><i class="fas fa-check" style="color:#10b981; margin-right:6px;"></i> ${inc}</li>`).join('')}
      </ul>
    </div>
  `;

  // Setup CTA inside preview
  const previewBuyBtn = document.getElementById('preview-btn-buy');
  previewBuyBtn.onclick = () => {
    closeModal('diet-preview-modal');
    openCheckout(planId);
  };

  document.getElementById('diet-preview-modal').classList.add('active');
}

// ══════════════════════════════════════
// ── Checkout & Payment Modal
// ══════════════════════════════════════
function openCheckout(planId) {
  // If already purchased, go straight to reader
  const purchased = getPurchasedPlans();
  if (purchased.includes(planId)) {
    openReader(planId);
    return;
  }

  const plan = allDietPlans.find(p => p.id === planId);
  if (!plan) return;
  currentSelectedPlanId = planId;

  // Set modal texts
  document.getElementById('checkout-plan-title').innerText = plan.title;
  document.getElementById('checkout-plan-category').innerText = plan.category;
  document.getElementById('checkout-amount-pill').innerText = `₹${plan.price}`;

  // Reset views
  document.getElementById('checkout-step-pay').style.display = 'block';
  document.getElementById('checkout-step-success').style.display = 'none';

  // Config values (from site data)
  const upiId = window.NHC_CONFIG?.upi_id || '6383095276@upi';
  const upiName = window.NHC_CONFIG?.upi_name || 'Noble Homoeopathy Clinic';
  const amount = plan.price || 25;
  const note = `Diet Plan: ${plan.title.substring(0, 25)}`;

  // Update UPI display ID
  const upiIdEl = document.getElementById('display-upi-id');
  if (upiIdEl) upiIdEl.innerText = upiId;

  // Build standard UPI URI
  const upiUri = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(upiName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;

  // Generate dynamic QR code image via reliable public API
  const qrImg = document.getElementById('checkout-upi-qr');
  if (qrImg) {
    qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiUri)}`;
  }

  // Configure 1-Tap Mobile Intent Buttons
  const btnGpay = document.getElementById('btn-upi-gpay');
  const btnPhonepe = document.getElementById('btn-upi-phonepe');
  const btnPaytm = document.getElementById('btn-upi-paytm');
  const btnGeneric = document.getElementById('btn-upi-generic');

  if (btnGpay) btnGpay.href = `tez://upi/pay?pa=${upiId}&pn=${encodeURIComponent(upiName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;
  if (btnPhonepe) btnPhonepe.href = `phonepe://pay?pa=${upiId}&pn=${encodeURIComponent(upiName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;
  if (btnPaytm) btnPaytm.href = `paytmmp://pay?pa=${upiId}&pn=${encodeURIComponent(upiName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;
  if (btnGeneric) btnGeneric.href = upiUri;

  // Configure Razorpay toggle visibility
  const rzpTab = document.getElementById('tab-btn-razorpay');
  const rzpKey = window.NHC_CONFIG?.razorpay_key_id;
  if (rzpTab) {
    // If Razorpay key is present, show tab; otherwise keep Direct UPI active
    rzpTab.style.display = rzpKey ? 'flex' : 'none';
  }

  // Switch to UPI tab by default
  switchPaymentTab('upi');

  // Open modal
  document.getElementById('diet-checkout-modal').classList.add('active');
}

// Payment method tab switching
function switchPaymentTab(tabName) {
  const upiTabBtn = document.getElementById('tab-btn-upi');
  const rzpTabBtn = document.getElementById('tab-btn-razorpay');
  const upiView = document.getElementById('payment-view-upi');
  const rzpView = document.getElementById('payment-view-razorpay');

  if (tabName === 'upi') {
    if (upiTabBtn) upiTabBtn.classList.add('active');
    if (rzpTabBtn) rzpTabBtn.classList.remove('active');
    if (upiView) upiView.style.display = 'block';
    if (rzpView) rzpView.style.display = 'none';
  } else {
    if (upiTabBtn) upiTabBtn.classList.remove('active');
    if (rzpTabBtn) rzpTabBtn.classList.add('active');
    if (upiView) upiView.style.display = 'none';
    if (rzpView) rzpView.style.display = 'block';
  }
}

// Copy UPI ID to clipboard
function copyUpiId() {
  const upiId = window.NHC_CONFIG?.upi_id || '6383095276@upi';
  navigator.clipboard.writeText(upiId).then(() => {
    const copyBtn = document.getElementById('btn-copy-upi-text');
    if (copyBtn) {
      const orig = copyBtn.innerText;
      copyBtn.innerText = 'Copied!';
      setTimeout(() => { copyBtn.innerText = orig; }, 2000);
    }
  }).catch(err => {
    prompt('Copy UPI ID:', upiId);
  });
}

// Razorpay standard checkout trigger
function payWithRazorpay() {
  const plan = allDietPlans.find(p => p.id === currentSelectedPlanId);
  if (!plan) return;

  const rzpKey = window.NHC_CONFIG?.razorpay_key_id;
  if (!rzpKey) {
    alert('Razorpay Gateway is not configured with an API Key. Please use Instant UPI method above for direct zero-fee payment.');
    switchPaymentTab('upi');
    return;
  }

  const nameInput = document.getElementById('customer-name')?.value.trim() || 'Patient';
  const phoneInput = document.getElementById('customer-phone')?.value.trim() || '';

  if (!phoneInput || phoneInput.length < 10) {
    alert('Please enter your 10-digit Mobile / WhatsApp Number above before proceeding to payment.');
    const phoneEl = document.getElementById('customer-phone');
    if (phoneEl) phoneEl.focus();
    return;
  }

  const options = {
    key: rzpKey,
    amount: plan.price * 100, // paise
    currency: "INR",
    name: "Noble Homoeopathy Clinic",
    description: `Clinical Diet Plan: ${plan.title}`,
    image: "/images/logo.png",
    prefill: {
      name: nameInput,
      contact: phoneInput
    },
    theme: {
      color: "#0ea5e9"
    },
    handler: function (response) {
      handlePaymentSuccess(currentSelectedPlanId, {
        method: 'Razorpay',
        paymentId: response.razorpay_payment_id,
        name: nameInput,
        phone: phoneInput
      });
    }
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
}

// Direct UPI Confirmation handler
function confirmUpiPayment() {
  const nameInput = document.getElementById('customer-name');
  const phoneInput = document.getElementById('customer-phone');
  const utrInput = document.getElementById('customer-utr');

  const name = nameInput ? nameInput.value.trim() : '';
  const phone = phoneInput ? phoneInput.value.trim() : '';
  const utr = utrInput ? utrInput.value.trim() : '';

  if (!phone || phone.length < 10) {
    alert('Please enter your 10-digit Mobile / WhatsApp Number to unlock your diet plan.');
    if (phoneInput) phoneInput.focus();
    return;
  }

  // Unlock plan
  handlePaymentSuccess(currentSelectedPlanId, {
    method: 'UPI',
    name: name || 'Valued Patient',
    phone: phone,
    utr: utr || 'Direct UPI Verified'
  });
}

// Handle payment success
function handlePaymentSuccess(planId, details = {}) {
  const plan = allDietPlans.find(p => p.id === planId);
  if (!plan) return;

  // Save to localStorage
  savePurchasedPlan(planId, details);

  // Transition UI to success view
  document.getElementById('checkout-step-pay').style.display = 'none';
  document.getElementById('checkout-step-success').style.display = 'block';

  document.getElementById('success-plan-name').innerText = plan.title;

  // Configure success buttons
  const btnPdf = document.getElementById('btn-success-pdf');
  const btnView = document.getElementById('btn-success-view');
  const btnWa = document.getElementById('btn-success-whatsapp');

  if (btnPdf) btnPdf.onclick = () => printDietPlan(planId);
  if (btnView) btnView.onclick = () => {
    closeModal('diet-checkout-modal');
    openReader(planId);
  };

  if (btnWa) {
    const docPhone = window.NHC_CONFIG?.whatsapp_phone || '916383095276';
    const waText = `Hello Dr. Kokhila, I purchased the "${plan.title}" (₹25) for ${details.name || 'Patient'} (Mobile: ${details.phone || ''}). Please send me any additional clinic tips on WhatsApp.`;
    btnWa.href = `https://wa.me/${docPhone}?text=${encodeURIComponent(waText)}`;
  }

  // Trigger optional non-blocking serverless webhook
  fetch('/api/send-diet-plan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      planId,
      planTitle: plan.title,
      customerName: details.name,
      customerPhone: details.phone,
      method: details.method,
      utr: details.utr,
      timestamp: new Date().toISOString()
    })
  }).catch(() => {});
}

// ══════════════════════════════════════
// ── Full Plan Reader Modal
// ══════════════════════════════════════
function openReader(planId) {
  const plan = allDietPlans.find(p => p.id === planId);
  if (!plan) return;

  document.getElementById('reader-plan-title').innerText = plan.title;
  document.getElementById('reader-plan-category').innerText = plan.category;

  const contentDiv = document.getElementById('reader-plan-body');
  contentDiv.innerHTML = `
    <div class="reader-section">
      <h4><i class="fas fa-stethoscope" style="color:var(--primary);"></i> Clinical Overview & Mechanism</h4>
      <p style="color:#334155; line-height:1.6; margin:0;">${plan.fullPlan.overview}</p>
    </div>

    <div class="reader-section">
      <h4><i class="fas fa-clock" style="color:var(--primary);"></i> Complete Daily Meal & Routine Timetable</h4>
      <div class="reader-meal-row">
        <div class="reader-meal-time">🌅 Early Morning</div>
        <div class="reader-meal-desc">${plan.fullPlan.morningWakeup}</div>
      </div>
      ${plan.fullPlan.seedCyclingPhase ? `
      <div class="reader-meal-row" style="background:rgba(245, 158, 11, 0.08); padding:10px; border-radius:6px;">
        <div class="reader-meal-time" style="color:var(--accent-dark);">🌸 Seed Cycling</div>
        <div class="reader-meal-desc"><strong>${plan.fullPlan.seedCyclingPhase}</strong></div>
      </div>` : ''}
      <div class="reader-meal-row">
        <div class="reader-meal-time">🥣 Breakfast</div>
        <div class="reader-meal-desc">${plan.fullPlan.breakfast}</div>
      </div>
      <div class="reader-meal-row">
        <div class="reader-meal-time">🍎 Mid-Morning Snack</div>
        <div class="reader-meal-desc">${plan.fullPlan.midMorning}</div>
      </div>
      <div class="reader-meal-row">
        <div class="reader-meal-time">🥗 Lunch</div>
        <div class="reader-meal-desc">${plan.fullPlan.lunch}</div>
      </div>
      <div class="reader-meal-row">
        <div class="reader-meal-time">🥛 Post-Lunch Digestive</div>
        <div class="reader-meal-desc">${plan.fullPlan.postLunch}</div>
      </div>
      <div class="reader-meal-row">
        <div class="reader-meal-time">🍵 Evening Snack</div>
        <div class="reader-meal-desc">${plan.fullPlan.eveningSnack}</div>
      </div>
      <div class="reader-meal-row">
        <div class="reader-meal-time">🍲 Dinner (Early)</div>
        <div class="reader-meal-desc">${plan.fullPlan.dinner}</div>
      </div>
      <div class="reader-meal-row">
        <div class="reader-meal-time">🌙 Bedtime Routine</div>
        <div class="reader-meal-desc">${plan.fullPlan.bedtime}</div>
      </div>
    </div>

    <div class="reader-section" style="border-left-color: #10b981;">
      <h4><i class="fas fa-pills" style="color:#10b981;"></i> Homoeopathy Medicine Synergy & Rules</h4>
      <ul class="reader-list">
        ${plan.fullPlan.homoeopathyRules.map(r => `<li>${r}</li>`).join('')}
      </ul>
    </div>

    <div class="reader-section" style="border-left-color: #ef4444;">
      <h4><i class="fas fa-ban" style="color:#ef4444;"></i> Foods to Strictly Avoid</h4>
      <ul class="reader-list">
        ${plan.fullPlan.foodsToAvoid.map(f => `<li>${f}</li>`).join('')}
      </ul>
    </div>

    <div class="reader-section" style="border-left-color: #8b5cf6;">
      <h4><i class="fas fa-basket-shopping" style="color:#8b5cf6;"></i> Recommended Grocery List</h4>
      <ul class="reader-list">
        ${plan.fullPlan.groceryChecklist.map(g => `<li>${g}</li>`).join('')}
      </ul>
    </div>
  `;

  // Reader print button
  const readerPrintBtn = document.getElementById('btn-reader-print');
  if (readerPrintBtn) readerPrintBtn.onclick = () => printDietPlan(planId);

  document.getElementById('diet-reader-modal').classList.add('active');
}

// ══════════════════════════════════════
// ── Printable PDF Generator
// ══════════════════════════════════════
function printDietPlan(planId) {
  const plan = allDietPlans.find(p => p.id === planId);
  if (!plan) return;

  let printArea = document.getElementById('diet-print-area');
  if (!printArea) {
    printArea = document.createElement('div');
    printArea.id = 'diet-print-area';
    document.body.appendChild(printArea);
  }

  printArea.innerHTML = `
    <div style="font-family:'Inter', Arial, sans-serif; color:#0f172a; max-width:800px; margin:0 auto; padding:20px; line-height:1.5;">
      
      <!-- Clinic Header -->
      <div style="border-bottom: 2px solid #0ea5e9; padding-bottom: 15px; margin-bottom: 20px; display:flex; justify-content:space-between; align-items:center;">
        <div>
          <h1 style="color:#0a1628; margin:0; font-size:22px; text-transform:uppercase; letter-spacing:1px;">NOBLE HOMOEOPATHY CLINIC</h1>
          <p style="color:#0ea5e9; margin:3px 0 0; font-size:12px; font-weight:700;">Holistic Health & Wellness • Dr. Kokhila (B.H.M.S)</p>
          <p style="color:#64748b; margin:3px 0 0; font-size:11px;">Akshaya Adena, Ground Floor, Padur, Chennai • Tel: +91-6383095276</p>
        </div>
        <div style="text-align:right;">
          <span style="background:#e0f2fe; color:#0369a1; padding:4px 10px; border-radius:12px; font-size:11px; font-weight:bold;">CLINICAL DIET PROTOCOL</span>
          <p style="margin:5px 0 0; font-size:10px; color:#94a3b8;">Issued on: ${new Date().toLocaleDateString('en-IN')}</p>
        </div>
      </div>

      <!-- Plan Title Banner -->
      <div style="background:#f8fafc; border-left:4px solid #0ea5e9; padding:12px 15px; margin-bottom:18px; border-radius:4px;">
        <h2 style="margin:0 0 5px; color:#0a1628; font-size:18px;">${plan.title}</h2>
        <p style="margin:0; font-size:12px; color:#475569;">${plan.tagline}</p>
      </div>

      <!-- Overview -->
      <div style="margin-bottom:18px;">
        <h3 style="font-size:14px; color:#0284c7; margin:0 0 6px; text-transform:uppercase; letter-spacing:0.5px;">1. Clinical Objective</h3>
        <p style="font-size:12px; color:#334155; margin:0;">${plan.fullPlan.overview}</p>
      </div>

      <!-- Meal Schedule Table -->
      <div style="margin-bottom:20px;">
        <h3 style="font-size:14px; color:#0284c7; margin:0 0 8px; text-transform:uppercase; letter-spacing:0.5px;">2. Daily Meal & Nutrition Timetable</h3>
        <table style="width:100%; border-collapse:collapse; font-size:11px;">
          <thead>
            <tr style="background:#f1f5f9;">
              <th style="border:1px solid #cbd5e1; padding:8px; text-align:left; width:130px;">Time Window</th>
              <th style="border:1px solid #cbd5e1; padding:8px; text-align:left;">Recommended Diet & Fluids</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style="border:1px solid #cbd5e1; padding:7px; font-weight:bold; color:#0369a1;">Early Morning</td><td style="border:1px solid #cbd5e1; padding:7px;">${plan.fullPlan.morningWakeup}</td></tr>
            ${plan.fullPlan.seedCyclingPhase ? `<tr><td style="border:1px solid #cbd5e1; padding:7px; font-weight:bold; color:#d97706;">Seed Cycling</td><td style="border:1px solid #cbd5e1; padding:7px; font-weight:bold;">${plan.fullPlan.seedCyclingPhase}</td></tr>` : ''}
            <tr><td style="border:1px solid #cbd5e1; padding:7px; font-weight:bold; color:#0369a1;">Breakfast</td><td style="border:1px solid #cbd5e1; padding:7px;">${plan.fullPlan.breakfast}</td></tr>
            <tr><td style="border:1px solid #cbd5e1; padding:7px; font-weight:bold; color:#0369a1;">Mid-Morning</td><td style="border:1px solid #cbd5e1; padding:7px;">${plan.fullPlan.midMorning}</td></tr>
            <tr><td style="border:1px solid #cbd5e1; padding:7px; font-weight:bold; color:#0369a1;">Lunch</td><td style="border:1px solid #cbd5e1; padding:7px;">${plan.fullPlan.lunch}</td></tr>
            <tr><td style="border:1px solid #cbd5e1; padding:7px; font-weight:bold; color:#0369a1;">Post-Lunch</td><td style="border:1px solid #cbd5e1; padding:7px;">${plan.fullPlan.postLunch}</td></tr>
            <tr><td style="border:1px solid #cbd5e1; padding:7px; font-weight:bold; color:#0369a1;">Evening Snack</td><td style="border:1px solid #cbd5e1; padding:7px;">${plan.fullPlan.eveningSnack}</td></tr>
            <tr><td style="border:1px solid #cbd5e1; padding:7px; font-weight:bold; color:#0369a1;">Dinner</td><td style="border:1px solid #cbd5e1; padding:7px;">${plan.fullPlan.dinner}</td></tr>
            <tr><td style="border:1px solid #cbd5e1; padding:7px; font-weight:bold; color:#0369a1;">Bedtime</td><td style="border:1px solid #cbd5e1; padding:7px;">${plan.fullPlan.bedtime}</td></tr>
          </tbody>
        </table>
      </div>

      <!-- Homoeopathy Synergy Guidelines -->
      <div style="background:#f0fdf4; border:1px solid #bbf7d0; padding:12px; margin-bottom:16px; border-radius:4px;">
        <h4 style="margin:0 0 6px; color:#15803d; font-size:12px; text-transform:uppercase;">🌿 Homoeopathy Medicine Instructions</h4>
        <ul style="margin:0; padding-left:18px; font-size:11px; color:#166534;">
          ${plan.fullPlan.homoeopathyRules.map(r => `<li>${r}</li>`).join('')}
        </ul>
      </div>

      <!-- Foods to Avoid -->
      <div style="background:#fef2f2; border:1px solid #fecaca; padding:12px; margin-bottom:16px; border-radius:4px;">
        <h4 style="margin:0 0 6px; color:#b91c1c; font-size:12px; text-transform:uppercase;">🚫 Foods to Strictly Avoid</h4>
        <ul style="margin:0; padding-left:18px; font-size:11px; color:#991b1b;">
          ${plan.fullPlan.foodsToAvoid.map(f => `<li>${f}</li>`).join('')}
        </ul>
      </div>

      <!-- Grocery Checklist -->
      <div style="margin-bottom:20px;">
        <h4 style="margin:0 0 6px; color:#475569; font-size:12px; text-transform:uppercase;">🛒 Recommended Grocery List</h4>
        <ul style="margin:0; padding-left:18px; font-size:11px; color:#334155;">
          ${plan.fullPlan.groceryChecklist.map(g => `<li>${g}</li>`).join('')}
        </ul>
      </div>

      <!-- Doctor Signature / Footer -->
      <div style="border-top:1px dashed #cbd5e1; padding-top:15px; margin-top:25px; display:flex; justify-content:space-between; align-items:center;">
        <div>
          <p style="margin:0; font-size:11px; color:#64748b;">For questions or personalized homoeopathic consultation:</p>
          <p style="margin:2px 0 0; font-size:11px; font-weight:bold; color:#0a1628;">WhatsApp / Call: +91 6383095276 | noblehomoeopathyclinic@gmail.com</p>
        </div>
        <div style="text-align:right;">
          <p style="margin:0; font-size:12px; font-weight:bold; color:#0a1628;">Dr. Kokhila, B.H.M.S</p>
          <p style="margin:2px 0 0; font-size:10px; color:#64748b;">Noble Homoeopathy Clinic</p>
        </div>
      </div>

    </div>
  `;

  // Trigger print dialog
  setTimeout(() => {
    window.print();
  }, 200);
}
