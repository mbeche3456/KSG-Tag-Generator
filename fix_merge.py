
with open(r'c:\Users\user\Pictures\rolls tag3\js\shared.js', 'r', encoding='utf-8') as f:
    content = f.read()

import re

# First, resolve the easy conflicts by keeping the "Initial commit" version (the right side)
# But let's be careful - let's write a clean version from scratch based on what we know

# Let's write a clean shared.js

clean_content = '''/* ════════════════════════════════════════════
   KSG TAG GENERATOR — SHARED JAVASCRIPT
   Common functions, state management, utilities
   ════════════════════════════════════════════ */

// ─── EMBEDDED LOGO ASSETS ───
const COA_LOGO = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANwAAADUCAYAAAD3CU3sAAEAAElEQVR42uy9d5xdV3Uv/l17n3Nunzu9aZraqHfJvUjuBRtTJAKEHkIa7yWE5KW8F8lJICGBgBMcsA0GDMZYMu6WJRdpbDVbmrHqSJqRNL3XO7efsvf6/XHvyDLYBNzA/vn4M9J4JM2cc/b+7rXWd33XWsDv8MXMEgBGR0c3DQwM6N6env54PLsAAAHbu3Gngvev/NxczG/nfV259Yuvo8889z8y8HAA2b94s3ynPId4JNxkIBK7v6+2j3bv3VnteZtvo6Oi8devWedOAfO96d187d+40iMizbXtpV+eZrU9ufbL05MmT75j9e+71u24lGACFQqFPdXV1b9v6+NYZhiHrrr/+uh2jo6NriGiAmQUR6fe25bvXshGRNzg4OLO3p2fnPT+6pziZTHrLli2TAN5x6/47fUIQkd68ebMgopPZbPY4AON7d34v27TzuepgMPiNdDpd19TUJJhZvLc1371gi8Vis6SU39q29cnip7c/nb3h+uvl8mVLHwdwjJmNDRs2qPfe1psYxzGz6O/vf/r737tbL1u0VN1wzXV28/4DPDkx8d3837Hee1Pvrms6LovFMrPj8fgjTz6xla+98prMX/75l3jHs88+xMzRjRs3vuMO2t/5GyYitWnTJlFdXf2xqsqynatWLRWxyVF52ze/YXd1dX5hfHz8q0TkHDt27D3QvYvANmvWLJHNZucC9jdbmltu/uY3vun09fUaS5YuwazZs4mIpm666Sb5HuDegmvtWoCIRqtrqmnO3LmcTmcQmxi3bv+v/9KHDx3+UiwWW794s3KHeeN7ruU736OhWbNmidWrV7vDwyNfbWluuen222+3J2MTVmFREc2ZMwf19fUvMDOtWrXqvRjuLYJcbiEaZrecf9ElxJqQmYwRknH8/L77rAP7D9zPzB8iuvU98uQdDrampia5evVqN53N3j7Q3//hr/3L15zOMx2+UDDoXXb5ZUJp9TAR/WtTU5MkIvUe4N4SC7dWA0AkGv1GWUVF7+KlS4WXdTgVnxJnTrXxo48+oA4fbnmAmRsB0DspL/Pe9fLV0tJirFu3zsums7d3dHT+yZ13fc9LxOOWz/Jh/qKF+NCHP0Rz587NAqBIJELvxGd8RwCOiHT+RBsKWNaRdZdfTDLsU71jo5jjE0IcbKFnf/RD3bL/xa1SCN6wYYN6D3TvOOtmrF692mXmFYdb9v/Jj/7j37x0V7uMelnUBywmV0nL5+uqqq7+l40bN9KqVavUe4B7G1yOqsrykxdcdBEKysrICIVgpZKo81zZf/Sw+Nnm+2qbW1qOJpPJT2zYsEG9R6S8Y9ZVEJHHzMt2NDU9vfm+H3sD7a3Cn07RDFNgRsBSNdUzkEymnySiI9XV1fKdmnt9xwBu3bp1asuWLSJSWPTlYLjgmfryGXJOtFDZ7GJCuiiVgLtrr9Fy332LExPjX81ms405IuW9HN3vOtgAUCoWW9PZ1r7j2S0PlcSOHxelrIXp2KgpLwdFIrjh5htpbuOc4jxZ8o593nfSZuSysjJizfCbZnL1/AW6kojDBT4MSwU5GccNGQir+bDX/NL+mtHJiSbbtpds2rQJ74Hud/c6deqUSURKAR8/tr+5ONXeZddoKULJBOojIQRNg4tq6mRJeXlPaUnJ1wDgnepOvuNcyrVr1zIAVFVUf/9DH/+YSADCgIEIRTA6mYYbtBAKBowDDz5i9x87WjXS2/sRAGhtbX1P6Pw7eG3evFk2NjbaiYmJJenxkQ8cem6nMlmZYEbU9CFiSCRdW1148QXwWcZTRHSwpaXFeCdL+d5RgCMixRs3CviMbUnw71cvXiIiKclLbYlggPC0GMVgZhhLD5+WyYceYnt0qOrWW2/V2WyWmZne2+K/U66knDVrlsgwN2TTya8devThusjECKv4oChM";

const KSG_LOGO = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUAAAADHCAYAAABoUop+AACvNElEQVR42uydd3gd1dGH55zdvV3dkqxuy91yl9ybZBtjbEy1ZAihB5sSSAgBkkCQRNpHSyBUQQDTseSCG+6W3Jt6773328vunvn+uFdgCMWWZTBkf8/Do0TW3bv33HPenZkzZwbgf1TZ2dkCAIDL1f2wU+w6DQCAiPRir2s0NgfYHc3vI/b7ISJBRAKKFClSdDlpAEx9fZm+/dbiLsSeiHN/f6HKzMzkEZH0m/Nu6Tfnbj0XsooUKbo8RX+qNz4U1hoiEl/feLMs9UkmS8caz6+5wVyrq+s1JISgzdm82u5s2oaIJDa2ll3s/SEip0xTRYoU/ZfS09MvCg7Z2WkCAEB9xzv/6u4/Ug5AB2UBDri6/f39fm39HzW1dn8+8WIhrbjOihQpFuA3Wn1OZ/N0Sep9KCkpSUZEfrDXM5vHIgAAR/SlVkftcAIUCCF44VfKoAAAVjwYb3M0doQEXFWXjukcIZQN9nMSQhARVaLYtVoBoiJFCgA9HEimsqztlpn1Cau9/H5CiIQ4uFhbfHy8DABQmvefj4HrVhutZdd53uQCLcsMIISgxdJ8lyjSHkKIPTCrhADgYD4gIUAwORmpJDUdEiX7PedCVpEiRf/DGoCTyVY9H7EVLc6Su92/v3B3eMCqQkTfxp6XxNLGlAcQkWRmJvMXcg3EZIqIw6o7nmwqrFu/0u2eJw7qfhDTBEQUbM7SA/2WM0cGXH1EUCxARYoUuSFICAWLreJPiPlosdffTQgHiJkX7A5nZ68TEJEU1z7+SWHd41XuNzh/2GB6OgdAoK1vd3w/exb7rafjBgvkysrP1QAALV1b/+qUc9FmwyhEJOmYrmyEKFKk6EsNWFjd/QefdOIOtGJD6GDAM7AR0tSVnlrVvd7mcDSP9UD2vFxORLe1WNny4qflbQ81IWJQMgK90JhddvY6AQCgvCE5qaHzLXu/tSxuwPpTvm1FihR9A3zcFl9V28tPlzT+od1obA64UAgiJlMAgG5rQXht391Y2fzC/QAEMjMX89//WiSIQBDRt6rjjx351Q9nuqEFFwhhN/xK656+obr9bw6j8dSccz+fIkWKflbgAjIUixsRyAA8cqp/9Xxx/SPNxmYMAAA4X7fxHIgFFTXe1ZVb9euzAPS8IDYAWru9fkmD6V5s6dl62O2yJl4IgHkAgJrmN1Zb8d/YYzrx2LnusCJFiv4HrLjBvx5JJibzACoob06pq+/9c1HzBUIwE93W3pnym9+t6bvbhoijPVCk3+cJycn04aud95ssd8l9/af+MWFWKAD7ndD1/bVbdYUbDduepUSNSCmCRc/rkoCtSJFlyn0ur0lyXLruZbUgCs6GKWnp3Pp6YkcIkZ1OZ7Fuq6UfDRhoAcE9Pvvx22FtfZue7veugabu9LvAwD4rt1gQojHkkWvgtrftzSaf4uIuOx84TMAv/au3Gvr+36PXeZNrYjom5x84fHDb7JKFRAqUnTZgQ8JIlJE9JXl/iJR6imTpLY7zwXRYEHohigSk6nx/k7X41jf/Ww+Iga5gfLdFtnAe3b1Z80saV8plzQ8mYWI/HfFAQesSxEtK4pbfsGqO55qRsRxAN9vOQ5YeCZT17W1Pb/F5r5/tSDi+PN57bePazo3cF1EJDZn/a2SZD7mchhnKCBUpOgyguDA/3ZKrbfbHIXFJseBj8zOk1O+dEmT+cGAYCD21tyx8/464y+wrv2VfERUf58lOPBviDiprG095tbe4vg+Nzg7O01ARK6j7/PXq/pXYm3b2zkAAMnJ8D3wcydtOxx4XV3vQ1jefn+z0YjjBizZi7X4+m3ZSQ5n/gGHq+YTl8s4FxFVyikSRYouY7X3bbynpefD6i7zti39/ZWjvgBh5oWDMNtjBZU3vfB4k/1aLGxY9wdE1H8XBM9JZg4oavhd";

const WAVE_SVG_MARKUP = '<svg class="wave-svg" viewBox="0 0 360 225" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="360" height="225" fill="#ffffff"/><path d="M0,0 L360,0 L360,14 Q260,27 172,20 Q88,13 0,23Z" fill="#CBD300"/><path d="M0,20 Q88,9.6 172,16.8 Q260,24 360,11.2" stroke="#7F622C" stroke-width="1.2" fill="none"/><path d="M0,22.8 Q88,12.4 172,19.6 Q260,26.8 360,14" stroke="#7F622C" stroke-width="0.8" fill="none"/><path d="M0,23.2 Q36,56 24,92 Q14,124 44,156 Q70,182 78,225 L0,225Z" fill="#CBD300"/><path d="M0,225 L360,225 L360,202 Q260,191.2 172,200 Q88,208.8 0,199.2Z" fill="#CBD300"/><path d="M0,200 Q88,209.6 172,200.8 Q260,192 360,202.8" stroke="#7F622C" stroke-width="1.2" fill="none"/></svg>';

// ─── INACTIVITY TIMEOUT ───────────────────────
const INACTIVITY_TIMEOUT = 5 * 60 * 1000; // 5 minutes in milliseconds
let inactivityTimer = null;

function startInactivityTimer() {
  resetInactivityTimer();
  setupActivityListeners();
}

function resetInactivityTimer() {
  if (inactivityTimer) {
    clearTimeout(inactivityTimer);
  }
  inactivityTimer = setTimeout(() => {
    autoLogout();
  }, INACTIVITY_TIMEOUT);
}

function setupActivityListeners() {
  const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
  events.forEach(event => {
    document.addEventListener(event, resetInactivityTimer, { passive: true, capture: true });
  });
}

function removeActivityListeners() {
  const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
  events.forEach(event => {
    document.removeEventListener(event, resetInactivityTimer, { passive: true, capture: true });
  });
}

async function autoLogout() {
  try {
    await doLogout();
    toast('You have been logged out due to inactivity', 'info');
    logActivity('Auto logout due to inactivity', 'auto_logout');
  } catch (e) {
    console.error('Auto logout error:', e);
  }
}

// ─── STATE ───────────────────────────────────
let STATE = {
  user: null,
  tags: [],
  logs: [],
  settings: {
    org: 'Kenya School of Government',
    sys: 'KSG Tag Generator System',
    tagline: 'Official Identification Tag',
    gov: 'Republic of Kenya',
    darkMode: false,
    qr: true, dup: true, log: true, email: false
  },
  currentPage: 1,
  perPage: 10,
  deleteTarget: null,
  bulkData: [],
  modalTag: null,
  selectedTagIds: [],
};

let currentRef = '';
let previewRenderHandle = 0;
let manageRenderHandle = 0;
let dataViewRenderHandle = 0;
let persistTimer = 0;
let globalSearchTimer = 0;

// ─── PERSISTENCE ─────────────────────────────
function saveLocal() {
  if (persistTimer) {
    if (typeof persistTimer === 'number' && persistTimer > 0) clearTimeout(persistTimer);
  }
  
  const doSave = () => {
    try {
      localStorage.setItem('ksg_tags', JSON.stringify(STATE.tags));
      localStorage.setItem('ksg_logs', JSON.stringify(STATE.logs));
      localStorage.setItem('ksg_settings', JSON.stringify(STATE.settings));
    } catch (e) {
      console.error('localStorage write failed:', e);
    }
  };
  
  if (typeof requestIdleCallback !== 'undefined') {
    persistTimer = requestIdleCallback(doSave, { timeout: 1000 });
  } else {
    persistTimer = setTimeout(doSave, 0);
  }
}

function save() {
  saveLocal();
  syncToSupabase().catch(e => console.warn('Supabase sync:', e.message));
}

async function syncToSupabase() {
  await KSGDb.upsertSettings(STATE.settings);
}

async function loadFromSupabase() {
  const data = await KSGDb.loadAll();
  STATE.tags = data.tags;
  STATE.logs = data.logs;
  if (data.settings) STATE.settings = { ...STATE.settings, ...data.settings };
  // Defer localStorage save to avoid blocking
  if (typeof requestIdleCallback !== 'undefined') {
    requestIdleCallback(() => saveLocal(), { timeout: 1000 });
  } else {
    setTimeout(() => saveLocal(), 0);
  }
  return true;
}

function load() {
  const t = localStorage.getItem('ksg_tags'); if (t) STATE.tags = JSON.parse(t);
  const l = localStorage.getItem('ksg_logs'); if (l) STATE.logs = JSON.parse(l);
  const s = localStorage.getItem('ksg_settings'); if (s) STATE.settings = { ...STATE.settings, ...JSON.parse(s) };
  const u = localStorage.getItem('ksg_user'); if (u) STATE.user = JSON.parse(u);
  
  // Ensure all tags have p_number and id_number_value fields for Staff category
  STATE.tags.forEach(tag => {
    if (!tag.p_number) tag.p_number = '';
    if (!tag.id_number_value) tag.id_number_value = '';
  });
  
  KSGSupabase.init();
  
  // Check if user is already logged in
  if (STATE.user) {
    document.getElementById('auth-screen').style.display = 'none';
    document.getElementById('app').style.display = 'block';
    updateUserUI();
    refreshTagDataViews();
    startInactivityTimer();
  }
}

// ─── REFERENCE NUMBER GENERATOR ───────────────
function genRef() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  currentRef = `KSG-${year}${month}${day}-${random}`;
  return currentRef;
}

// ─── AUTH FUNCTIONS ─────────────────────────────
function switchAuthTab(tab) {
  const tabs = ['login', 'register', 'reset'];
  tabs.forEach(t => {
    const form = document.getElementById(`form-${t}`);
    const tabBtn = Array.from(document.querySelectorAll('.auth-tab')).find(btn => 
      btn.textContent.toLowerCase().includes(t) || btn.onclick?.toString().includes(t)
    );
    if (form) form.classList.toggle('active', t === tab);
    if (tabBtn) tabBtn.classList.toggle('active', t === tab);
  });
  // Clear alerts
  ['login-alert', 'reg-alert', 'reset-alert'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.textContent = '';
      el.classList.remove('alert-error', 'alert-success');
    }
  });
}

async function doLogin() {
  const emailEl = document.getElementById('login-email');
  const passEl = document.getElementById('login-pass');
  const alertEl = document.getElementById('login-alert');
  
  const email = emailEl?.value.trim();
  const password = passEl?.value;
  
  if (!email || !password) {
    if (alertEl) {
      alertEl.textContent = 'Please enter email and password';
      alertEl.classList.add('alert-error');
    }
    return;
  }
  
  try {
    const supabase = KSGSupabase.getClient();
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    
    // Get user profile
    const profile = await KSGDb.getProfile(data.user.id);
    if (profile && profile.status === 'pending') {
      await supabase.auth.signOut();
      if (alertEl) {
        alertEl.textContent = 'Your account is pending approval. Please wait for a superadmin to approve your account.';
        alertEl.classList.add('alert-error');
      }
      return;
    }
    
    STATE.user = {
      id: data.user.id,
      email: data.user.email,
      role: profile?.role || 'user',
      name: profile?.name || data.user.email
    };
    localStorage.setItem('ksg_user', JSON.stringify(STATE.user));
    
    // Load data from Supabase
    await loadFromSupabase();
    
    // Show app, hide auth
    document.getElementById('auth-screen').style.display = 'none';
    document.getElementById('app').style.display = 'block';
    
    // Update UI
    updateUserUI();
    refreshTagDataViews();
    logActivity(`User logged in: ${STATE.user.email}`, 'login');
    toast('Welcome back!', 'success');
    
    // Start inactivity timer
    startInactivityTimer();
    
  } catch (e) {
    if (alertEl) {
      alertEl.textContent = 'Login failed: ' + (e.message || 'Unknown error');
      alertEl.classList.add('alert-error');
    }
    console.error(e);
  }
}

async function doRegister() {
  const nameEl = document.getElementById('reg-name');
  const emailEl = document.getElementById('reg-email');
  const passEl = document.getElementById('reg-pass');
  const alertEl = document.getElementById('reg-alert');
  
  const name = nameEl?.value.trim();
  const email = emailEl?.value.trim();
  const password = passEl?.value;
  
  if (!name || !email || !password) {
    if (alertEl) {
      alertEl.textContent = 'Please fill in all fields';
      alertEl.classList.add('alert-error');
    }
    return;
  }
  
  if (password.length < 8) {
    if (alertEl) {
      alertEl.textContent = 'Password must be at least 8 characters';
      alertEl.classList.add('alert-error');
    }
    return;
  }
  
  try {
    const supabase = KSGSupabase.getClient();
    if (!supabase) throw new Error('Supabase not configured');
    
    // First create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password
    });
    
    if (authError) throw authError;
    
    // Create profile
    const { error: profileError } = await supabase.from('profiles').insert({
      id: authData.user.id,
      name,
      email,
      status: 'pending',
      role: 'user'
    });
    
    if (profileError) {
      // Clean up auth user if profile creation failed
      await supabase.auth.signOut();
      throw profileError;
    }
    
    // Sign out the user since they need approval
    await supabase.auth.signOut();
    
    if (alertEl) {
      alertEl.textContent = 'Account created! Please wait for a superadmin to approve your account before logging in.';
      alertEl.classList.remove('alert-error');
      alertEl.classList.add('alert-success');
    }
    logActivity(`User registered: ${email}`, 'register');
    
  } catch (e) {
    if (alertEl) {
      alertEl.textContent = 'Registration failed: ' + (e.message || 'Unknown error');
      alertEl.classList.add('alert-error');
    }
    console.error(e);
  }
}

async function doReset() {
  const emailEl = document.getElementById('reset-email');
  const alertEl = document.getElementById('reset-alert');
  
  const email = emailEl?.value.trim();
  
  if (!email) {
    if (alertEl) {
      alertEl.textContent = 'Please enter your email';
      alertEl.classList.add('alert-error');
    }
    return;
  }
  
  try {
    const supabase = KSGSupabase.getClient();
    if (!supabase) throw new Error('Supabase not configured');
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin
    });
    
    if (error) throw error;
    
    if (alertEl) {
      alertEl.textContent = 'Password reset email sent! Please check your inbox.';
      alertEl.classList.remove('alert-error');
      alertEl.classList.add('alert-success');
    }
    
  } catch (e) {
    if (alertEl) {
      alertEl.textContent = 'Failed to send reset email: ' + (e.message || 'Unknown error');
      alertEl.classList.add('alert-error');
    }
    console.error(e);
  }
}

async function doLogout() {
  try {
    const supabase = KSGSupabase.getClient();
    if (supabase) await supabase.auth.signOut();
  } catch (e) {
    console.error('Logout error:', e);
  }
  
  // Clear inactivity timer
  if (inactivityTimer) {
    clearTimeout(inactivityTimer);
    inactivityTimer = null;
  }
  removeActivityListeners();
  
  STATE.user = null;
  localStorage.removeItem('ksg_user');
  
  // Show auth screen
  document.getElementById('auth-screen').style.display = 'flex';
  document.getElementById('app').style.display = 'none';
  
  toast('Logged out successfully', 'success');
}

// ─── USER UI UPDATE ────────────────────────────
function updateUserUI() {
  if (!STATE.user) return;
  
  const userAvEl = document.getElementById('user-av');
  const userNameEl = document.getElementById('user-name-disp');
  const userRoleEl = document.getElementById('user-role-disp');
  
  if (userAvEl) {
    userAvEl.textContent = (STATE.user.name || STATE.user.email || 'U')[0].toUpperCase();
  }
  
  if (userNameEl) {
    userNameEl.textContent = STATE.user.name || STATE.user.email;
  }
  
  if (userRoleEl) {
    userRoleEl.textContent = STATE.user.role || 'User';
  }
  
  // Show/hide user management for superadmins
  const userMgmtCard = document.getElementById('user-management-card');
  if (userMgmtCard) {
    userMgmtCard.style.display = STATE.user.role === 'superadmin' ? 'block' : 'none';
  }
  
  // Show/hide clear logs button for superadmins
  const clearLogsBtn = document.getElementById('clear-logs-btn');
  if (clearLogsBtn) {
    clearLogsBtn.style.display = STATE.user.role === 'superadmin' ? 'inline-flex' : 'none';
  }
  
  // Show/hide settings navigation for superadmins
  const navSettings = document.getElementById('nav-settings');
  if (navSettings) {
    navSettings.style.display = STATE.user.role === 'superadmin' ? 'flex' : 'none';
  }
  
  // Show/hide bulk delete button for superadmins
  const bulkDeleteBtn = document.getElementById('bulk-delete-btn');
  if (bulkDeleteBtn) {
    bulkDeleteBtn.style.display = STATE.user.role === 'superadmin' ? 'inline-flex' : 'none';
  }
}

// ─── NAVIGATION ───────────────────────────────
function gotoPage(name, btn) {
  // Check if user is trying to access settings page
  if (name === 'settings' && STATE.user && STATE.user.role !== 'superadmin') {
    toast('Only superadmins can access settings', 'error');
    gotoPage('dashboard');
    return;
  }
  
  const pages = document.querySelectorAll('.page');
  const navItems = document.querySelectorAll('.nav-item');
  
  pages.forEach(p => p.classList.remove('active'));
  navItems.forEach(n => n.classList.remove('active'));
  
  const targetPage = document.getElementById('page-' + name);
  if (targetPage) targetPage.classList.add('active');
  
  if (btn) btn.classList.add('active');
  
  STATE.currentPage = name;
}

// ─── UTILITIES ─────────────────────────────────
function toast(msg, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.style.cssText = 'position: fixed; bottom: 24px; right: 24px; z-index: 9999; display: flex; flex-direction: column; gap: 8px;';
    document.body.appendChild(container);
  }
  
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.textContent = msg;
  
  container.appendChild(el);
  
  setTimeout(() => el.remove(), 3000);
}

function closeModal(id) {
  document.getElementById(id).classList.remove('open');
}

function formatDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatTime(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

function logActivity(msg, action = 'general') {
  const log = {
    id: Date.now(),
    msg,
    time: new Date().toISOString(),
    action,
    user: STATE.user?.email || 'system'
  };
  
  STATE.logs.unshift(log);
  if (STATE.logs.length > 200) STATE.logs.pop();
  
  saveLocal();
  
  if (KSGDb.enabled()) {
    KSGDb.insertLog(msg, STATE.user?.email, STATE.user?.id, action).catch(console.error);
  }
}

function applySettings() {
  const s = STATE.settings;
  document.documentElement.style.setProperty('--org-name', s.org || 'Kenya School of Government');
  document.documentElement.style.setProperty('--sys-name', s.sys || 'KSG Tag Generator');
  document.documentElement.style.setProperty('--tagline', s.tagline || 'Official Identification Tag');
  
  if (s.darkMode) document.body.classList.add('dark-mode');
  else document.body.classList.remove('dark-mode');
}

function refreshTagDataViews() {
  // This will be called by page-specific modules
  if (typeof window.refreshDashboard === 'function') window.refreshDashboard();
  if (typeof window.refreshManageTags === 'function') window.refreshManageTags();
  if (typeof window.refreshReports === 'function') window.refreshReports();
  if (typeof window.refreshActivityLogs === 'function') window.refreshActivityLogs();
}

function updateTagPreviewInit() {
  // Initialize preview if on generate page
  if (document.getElementById('page-generate').classList.contains('active')) {
    if (typeof window.updatePreview === 'function') window.updatePreview();
  }
}

// ─── SIDEBAR & NAVIGATION ───────────────────────
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  
  if (sidebar) sidebar.classList.toggle('open');
  if (overlay) overlay.classList.toggle('open');
}

function closeSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  
  if (sidebar) sidebar.classList.remove('open');
  if (overlay) overlay.classList.remove('open');
}

// ─── GLOBAL SEARCH ─────────────────────────────
function globalSearch(query) {
  // Simple global search implementation
  if (STATE.currentPage !== 'manage') {
    gotoPage('manage');
  }
  
  // Update search input in manage page
  const searchInput = document.querySelector('#page-manage .search-box input');
  if (searchInput) {
    searchInput.value = query;
  }
  
  // Trigger filter
  if (typeof window.filterTags === 'function') {
    window.filterTags(query);
  }
}

// ─── EXPORT ALL TAGS TO CSV ─────────────────────
function exportAll() {
  if (!STATE.tags.length) {
    toast('No tags to export', 'error');
    return;
  }
  
  const headers = ['Reference Number', 'Full Name', 'Department', 'Position', 'Category', 'ID Number', 'P Number', 'Status', 'Date Generated'];
  const rows = STATE.tags.map(tag => [
    tag.reference_number,
    tag.full_name,
    tag.department || '',
    tag.position || '',
    tag.category || '',
    tag.id_number_value || '',
    tag.p_number || '',
    tag.status || 'Active',
    formatDate(tag.date_generated)
  ]);
  
  const csvContent = [headers.join(','), ...rows.map(row => row.map(cell => `"${cell?.toString().replace(/"/g, '""') || ''}"`).join(','))].join('\\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `KSG-Tags-Export-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  toast('Tags exported successfully!', 'success');
  logActivity(`Exported ${STATE.tags.length} tags to CSV`, 'export');
}

// ─── EXPORT LOGS TO CSV ─────────────────────────
function exportLogs() {
  if (!STATE.logs.length) {
    toast('No logs to export', 'error');
    return;
  }
  
  const headers = ['Time', 'User', 'Action', 'Message'];
  const rows = STATE.logs.map(log => [
    log.time,
    log.user || '',
    log.action || '',
    log.msg || ''
  ]);
  
  const csvContent = [headers.join(','), ...rows.map(row => row.map(cell => `"${cell?.toString().replace(/"/g, '""') || ''}"`).join(','))].join('\\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `KSG-Activity-Logs-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  toast('Logs exported successfully!', 'success');
}

// ─── CLEAR ALL DATA ─────────────────────────────
async function clearAllData() {
  if (!confirm('Are you sure you want to delete ALL tags? This cannot be undone!')) {
    return;
  }
  
  try {
    if (KSGDb.enabled()) {
      await KSGDb.deleteAllTags();
    }
    
    STATE.tags = [];
    saveLocal();
    await loadFromSupabase();
    refreshTagDataViews();
    toast('All tags deleted!', 'success');
    logActivity('All tags cleared', 'clear');
    
  } catch (e) {
    toast('Failed to clear data: ' + e.message, 'error');
    console.error(e);
  }
}

// ─── CLEAR LOGS ─────────────────────────────────
async function clearLogs() {
  if (!confirm('Are you sure you want to delete ALL activity logs? This cannot be undone!')) {
    return;
  }
  
  try {
    if (KSGDb.enabled()) {
      await KSGDb.clearLogs(STATE.user.role);
    }
    
    STATE.logs = [];
    saveLocal();
    await loadFromSupabase();
    if (typeof refreshActivityLogs === 'function') {
      refreshActivityLogs();
    }
    toast('All logs cleared!', 'success');
    
  } catch (e) {
    toast('Failed to clear logs: ' + e.message, 'error');
    console.error(e);
  }
}

// ─── PENDING USERS MANAGEMENT ───────────────────
async function loadPendingUsers() {
  const container = document.getElementById('pending-users-list');
  if (!container) return;
  
  try {
    const pendingUsers = await KSGDb.getPendingUsers();
    if (!pendingUsers.length) {
      container.innerHTML = '<p style="color: var(--ksg-gray);">No pending users</p>';
      return;
    }
    
    container.innerHTML = pendingUsers.map(user => `
      <div style="padding: 12px; border-bottom: 1px solid var(--ksg-light); display: flex; justify-content: space-between; align-items: center;">
        <div>
          <div style="font-weight: 500;">${user.name}</div>
          <div style="color: var(--ksg-gray); font-size: 0.875rem;">${user.email}</div>
        </div>
        <div style="display: flex; gap: 8px;">
          <button class="btn btn-success btn-sm" onclick="approveUser('${user.id}')">Approve</button>
          <button class="btn btn-danger btn-sm" onclick="rejectUser('${user.id}')">Reject</button>
        </div>
      </div>
    `).join('');
    
  } catch (e) {
    container.innerHTML = `<p style="color: var(--ksg-danger);">Failed to load pending users: ${e.message}</p>`;
    console.error(e);
  }
}

async function approveUser(userId) {
  try {
    await KSGDb.updateUserStatus(userId, 'active');
    toast('User approved!', 'success');
    logActivity(`User approved: ${userId}`, 'user_approved');
    loadPendingUsers();
  } catch (e) {
    toast('Failed to approve user: ' + e.message, 'error');
    console.error(e);
  }
}

async function rejectUser(userId) {
  if (!confirm('Are you sure you want to reject this user?')) {
    return;
  }
  
  try {
    await KSGDb.updateUserStatus(userId, 'rejected');
    toast('User rejected!', 'success');
    logActivity(`User rejected: ${userId}`, 'user_rejected');
    loadPendingUsers();
  } catch (e) {
    toast('Failed to reject user: ' + e.message, 'error');
    console.error(e);
  }
}

async function createUserManual() {
  const name = document.getElementById('manual-reg-name')?.value.trim();
  const email = document.getElementById('manual-reg-email')?.value.trim();
  const password = document.getElementById('manual-reg-pass')?.value;
  const role = document.getElementById('manual-reg-role')?.value;
  
  if (!name || !email || !password) {
    toast('Please fill in all fields', 'error');
    return;
  }
  
  try {
    const supabase = KSGSupabase.getClient();
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password
    });
    
    if (authError) throw authError;
    
    await supabase.from('profiles').insert({
      id: authData.user.id,
      name,
      email,
      status: 'active',
      role
    });
    
    // Sign back in as current user
    await doLogout();
    toast('User created successfully!', 'success');
    logActivity(`User created manually: ${email} (${role})`, 'user_created');
    loadPendingUsers();
    
    // Clear form
    document.getElementById('manual-reg-name').value = '';
    document.getElementById('manual-reg-email').value = '';
    document.getElementById('manual-reg-pass').value = '';
    
  } catch (e) {
    toast('Failed to create user: ' + e.message, 'error');
    console.error(e);
  }
}

// ─── MODAL DOWNLOAD FUNCTIONS ───────────────────
async function downloadModalPDF() {
  const tagWrap = document.getElementById('modal-tag-wrap');
  if (!tagWrap) {
    toast('Tag not found', 'error');
    return;
  }
  
  try {
    const canvas = await captureTagElement(tagWrap.querySelector('.id-tag'));
    const JsPDF = window.jspdf?.jsPDF || window.jsPDF;
    if (!JsPDF) throw new Error('PDF library not loaded');
    
    const pdf = new JsPDF({ orientation: 'landscape', unit: 'mm', format: [90, 56] });
    const pw = pdf.internal.pageSize.getWidth();
    const ph = pdf.internal.pageSize.getHeight();
    const imgW = 86;
    const imgH = (canvas.height / canvas.width) * imgW;
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', (pw - imgW) / 2, (ph - imgH) / 2, imgW, imgH);
    pdf.save(`KSG-Tag-${STATE.modalTag?.reference_number || 'export'}.pdf`);
    
    toast('PDF downloaded successfully!', 'success');
    logActivity(`Tag PDF downloaded: ${STATE.modalTag?.reference_number}`, 'download');
  } catch (e) {
    toast('PDF download failed: ' + e.message, 'error');
    console.error(e);
  }
}

async function downloadModalPNG() {
  const tagWrap = document.getElementById('modal-tag-wrap');
  if (!tagWrap) {
    toast('Tag not found', 'error');
    return;
  }
  
  try {
    const canvas = await captureTagElement(tagWrap.querySelector('.id-tag'));
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `KSG-Tag-${STATE.modalTag?.reference_number || 'export'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast('PNG downloaded successfully!', 'success');
    logActivity(`Tag PNG downloaded: ${STATE.modalTag?.reference_number}`, 'download');
  } catch (e) {
    toast('PNG download failed: ' + e.message, 'error');
    console.error(e);
  }
}

function printModal() {
  const tagWrap = document.getElementById('modal-tag-wrap');
  if (!tagWrap) return;
  
  const originalContents = document.body.innerHTML;
  document.body.innerHTML = tagWrap.innerHTML;
  window.print();
  document.body.innerHTML = originalContents;
  // Re-add scripts after print
  location.reload();
}

async function downloadEditPDF() {
  if (!STATE.modalTag) return;
  
  // Temporarily apply edits to a copy
  const originalTag = { ...STATE.modalTag };
  const editedTag = {
    ...originalTag,
    full_name: document.getElementById('edit-name')?.value || originalTag.full_name,
    department: document.getElementById('edit-dept')?.value || originalTag.department,
    position: document.getElementById('edit-pos')?.value || originalTag.position,
    status: document.getElementById('edit-status')?.value || originalTag.status,
    p_number: document.getElementById('edit-pno')?.value || originalTag.p_number,
    id_number_value: document.getElementById('edit-idno')?.value || originalTag.id_number_value
  };
  
  // Create temporary tag element
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = buildTagHTML(editedTag);
  document.body.appendChild(tempDiv);
  
  try {
    const canvas = await captureTagElement(tempDiv.querySelector('.id-tag'));
    const JsPDF = window.jspdf?.jsPDF || window.jsPDF;
    if (!JsPDF) throw new Error('PDF library not loaded');
    
    const pdf = new JsPDF({ orientation: 'landscape', unit: 'mm', format: [90, 56] });
    const pw = pdf.internal.pageSize.getWidth();
    const ph = pdf.internal.pageSize.getHeight();
    const imgW = 86;
    const imgH = (canvas.height / canvas.width) * imgW;
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', (pw - imgW) / 2, (ph - imgH) / 2, imgW, imgH);
    pdf.save(`KSG-Tag-${editedTag.reference_number}-Updated.pdf`);
    
    toast('PDF downloaded successfully!', 'success');
    logActivity(`Updated tag PDF downloaded: ${editedTag.reference_number}`, 'download');
  } catch (e) {
    toast('PDF download failed: ' + e.message, 'error');
    console.error(e);
  } finally {
    document.body.removeChild(tempDiv);
  }
}

// ─── CAPTURE TAG ELEMENT ──────────────────
async function captureTagElement(el) {
  if (!window.html2canvas) throw new Error('Image capture library not loaded');
  return html2canvas(el, {
    scale: 2,
    backgroundColor: '#ffffff',
    useCORS: true,
    allowTaint: true,
    logging: false,
    width: el.offsetWidth,
    height: el.offsetHeight,
    onclone: (clonedDoc, clonedEl) => {
      clonedEl.style.background = 'none';
      const bg = clonedDoc.createElement('img');
      bg.src = 'template.png';
      bg.alt = '';
      bg.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;object-fit:fill;z-index:0;pointer-events:none';
      bg.onerror = () => { bg.style.display = 'none'; clonedEl.style.background = '#ffffff'; };
      clonedEl.insertBefore(bg, clonedEl.firstChild);
    },
  });
}

// Export shared functions and constants to window
window.STATE = STATE;
window.saveLocal = saveLocal;
window.save = save;
window.syncToSupabase = syncToSupabase;
window.loadFromSupabase = loadFromSupabase;
window.load = load;
window.gotoPage = gotoPage;
window.toast = toast;
window.closeModal = closeModal;
window.formatDate = formatDate;
window.formatTime = formatTime;
window.logActivity = logActivity;
window.applySettings = applySettings;
window.refreshTagDataViews = refreshTagDataViews;
window.updateTagPreviewInit = updateTagPreviewInit;
window.COA_LOGO = COA_LOGO;
window.KSG_LOGO = KSG_LOGO;
window.WAVE_SVG_MARKUP = WAVE_SVG_MARKUP;
window.genRef = genRef;
window.switchAuthTab = switchAuthTab;
window.doLogin = doLogin;
window.doRegister = doRegister;
window.doReset = doReset;
window.doLogout = doLogout;
window.updateUserUI = updateUserUI;
window.toggleSidebar = toggleSidebar;
window.closeSidebar = closeSidebar;
window.globalSearch = globalSearch;
window.exportAll = exportAll;
window.exportLogs = exportLogs;
window.clearAllData = clearAllData;
window.clearLogs = clearLogs;
window.loadPendingUsers = loadPendingUsers;
window.approveUser = approveUser;
window.rejectUser = rejectUser;
window.createUserManual = createUserManual;
window.downloadModalPDF = downloadModalPDF;
window.downloadModalPNG = downloadModalPNG;
window.printModal = printModal;
window.downloadEditPDF = downloadEditPDF;
window.captureTagElement = captureTagElement;
'''

with open(r'c:\Users\user\Pictures\rolls tag3\js\shared.js', 'w', encoding='utf-8') as f:
    f.write(clean_content)

print('Fixed shared.js successfully!')
