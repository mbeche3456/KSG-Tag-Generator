/* ════════════════════════════════════════════
   KSG TAG GENERATOR — SHARED JAVASCRIPT
   Common functions, state management, utilities
   ════════════════════════════════════════════ */

// ─── EMBEDDED LOGO ASSETS ───
const COA_LOGO = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANwAAADUCAYAAAD3CU3sAAEAAElEQVR42uy9d5xdV3Uv/l17n3Nunzu9aZraqHfJvUjuBRtTJAKEHkIa7yWE5KW8F8lJICGBgBMcsA0GDMZYMu6WJRdpbDVbmrHqSJqRNL3XO7efsvf6/XHvyDLYBNzA/vn4M9J4JM2cc/b+7rXWd33XWsDv8MXMEgBGR0c3DQwM6N6env54PLsAAHbu3Gngvev/NxczG/nfV259Yuvo8889z8y8HAA2b94s3ynPId4JNxkIBK7v6+2j3bv3VnteZtvo6Oi8devWedOAfO96d187d+40iMizbXtpV+eZrU9ufbL05MmT75j9e+71u24lGACFQqFPdXV1b9v6+NYZhiHrrr/+uh2jo6NriGiAmQUR6fe25bvXshGRNzg4OLO3p2fnPT+6pziZTHrLli2TAN5x6/47fUIQkd68ebMgopPZbPY4AON7d34v27TzuepgMPiNdDpd19TUJJhZvLc1371gi8Vis6SU39q29cnip7c/nb3h+uvl8mVLHwdwjJmNDRs2qPfe1psYxzGz6O/vf/r737tbL1u0VN1wzXV28/4DPDkx8d3837Hee1Pvrms6LovFMrPj8fgjTz6xla+98prMX/75l3jHs88+xMzRjRs3vuMO2t/5GyYitWnTJlFdXf2xqsqynatWLRWxyVF52ze/YXd1dX5hfHz8q0TkHDt27D3QvYvANmvWLJHNZucC9jdbmltu/uY3vun09fUaS5YuwazZs4mIpm666Sb5HuDegmvtWoCIRqtrqmnO3LmcTmcQmxi3bv+v/9KHDx3+UiwWW7948WKHeeN7ruU736OhWbNmidWrV7vDwyNfbWluuen222+3J2MTVmFREc2ZMwf19fUvMDOtWrXqvRjuLYJcbiEaZrecf9ElxJqQmYwRknH8/L77rAP7D9zPzB8iuvU98uQdDrampia5evVqN53N3j7Q3//hr/3L15zOMx2+UDDoXXb5ZUJp9TAR/WtTU5MkIvUe4N4SC7dWA0AkGv1GWUVF7+KlS4WXdTgVnxJnTrXxo48+oA4fbnmAmRsB0DspL/Pe9fLV0tJirFu3zsums7d3dHT+yZ13fc9LxOOWz/Jh/qKF+NCHP0Rz587NAqBIJELvxGd8RwCOiHT+RBsKWNaRdZdfTDLsU71jo5jjE0IcbKFnf/RD3bL/xa1SCN6wYYN6D3TvOOtmrF692mXmFYdb9v/Jj/7j37x0V7uMelnUBywmV0nL5+uqqq7+l40bN9KqVavUe4B7G1yOqsrykxdcdBEKysrICIVgpZKo81zZf/Sw+Nnm+2qbW1qOJpPJT2zYsEG9R6S8Y9ZVEJHHzMt2NDU9vfm+H3sD7a3Cn07RDFNgRsBSNdUzkEymnySiI9XV1fKdmnt9xwBu3bp1asuWLSJSWPTlYLjgmfryGXJOtFDZ7GJCuiiVgLtrr9Fy332LExPjX81ms405IuW9HN3vOtgAUCoWW9PZ1r7j2S0PlcSOHxelrIXp2KgpLwdFIrjh5htpbuOc4jxZ8o593nfSZuSysjJizfCbZnL1/AW6kojDBT4MSwU5GccNGQir+bDX/NL+mtHJiSbbtpds2rQJ74Hud/c6deqUSURKAR8/tr+5ONXeZddoKULJBOojIQRNg4tq6mRJeXlPaUnJ1wDgnepOvuNcyrVr1zIAVFVUf/9DH/+YSADCgIEIRTA6mYYbtBAKBowDDz5i9x87WjXS2/sRAGhtbX1P6Pw7eG3evFk2NjbaiYmJJenxkQ8cem6nMlmZYEbU9CFiSCRdW1148QXwWcZTRHSwpaXFeCdL+d5RgCMixRs3CviMbUnw71cvXiIiKclLbYlggPC0GMVgZhhLD5+WyYceYnt0qOrWW2/V2WyWmZne2+K/U66knDVrlsgwN2TTya8devThusjECKv4oChM";

const KSG_LOGO = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUAAAADHCAYAAABoUop+AACvNElEQVR42uydd3gd1dGH55zdvV3dkqxuy91yl9ybZBtjbEy1ZAihB5sSSAgBkkCQRNpHSyBUQQDTseSCG+6W3Jt6773328vunvn+uFdgCMWWZTBkf8/Do0TW3bv33HPenZkzZwbgf1TZ2dkCAIDL1f2wU+w6DQCAiPRir2s0NgfYHc3vI/b7ISJBRAKKFClSdDlpAEx9fZm+/dbiLsSeiHN/f6HKzMzkEZH0m/Nu6Tfnbj0XsooUKbo8RX+qNz4U1hoiEl/feLMs9UkmS8caz6+5wVyrq+s1JISgzdm82u5s2oaIJDa2ll3s/SEip0xTRYoU/ZfS09MvCg7Z2WkCAEB9xzv/6u4/Ug5AB2UBDri6/f39fm39HzW1dn8+8WIhrbjOihQpFuA3Wn1OZ/N0Sep9KCkpSUZEfrDXM5vHIgAAR/SlVkftcAIUCCF44VfKoAAAVjwYb3M0doQEXFWXjukcIZQN9nMSQhARVaLYtVoBoiJFCgA9HEimsqztlpn1Cau9/H5CiIQ4uFhbfHy8DABQmvefj4HrVhutZdd53uQCLcsMIISgxdJ8lyjSHkKIPTCrhADgYD4gIUAwORmpJDUdEiX7PedCVpEiRf/DGoCTyVY9H7EVLc6Su92/v3B3eMCqQkTfxp6XxNLGlAcQkWRmJvMXcg3EZIqIw6o7nmwqrFu/0u2eJw7qfhDTBEQUbM7SA/2WM0cGXH1EUCxARYoUuSFICAWLreJPiPlosdffTQgHiJkX7A5nZ68TEJEU1z7+SWHd41XuNzh/2GB6OgdAoK1vd3w/exb7rafjBgvkysrP1QAALV1b/+qUc9FmwyhEJOmYrmyEKFKk6EsNWFjd/QefdOIOtGJD6GDAM7AR0tSVnlrVvd7mcDSP9UD2vFxORLe1WNny4qflbQ81IWJQMgK90JhddvY6AQCgvCE5qaHzLXu/tSxuwPpTvm1FihR9A3zcFl9V28tPlzT+od1obA64UAgiJlMAgG5rQXht391Y2fzC/QAEMjMX89//WiSIQBDRt6rjjx351Q9nuqEFFwhhN/xK656+obr9bw6j8dSccz+fIkWKflbgAjIUixsRyAA8cqp/9Xxx/SPNxmYMAAA4X7fxHIgFFTXe1ZVb9euzAPS8IDYAWru9fkmD6V5s6dl62O2yJl4IgHkAgJrmN1Zb8d/YYzrx2LnusCJFiv4HrLjBvx5JJibzACoob06pq+/9c1HzBUIwE93W3pnym9+t6bvbhoijPVCk3+c+Jycn04aud95ssd8l9/af+MWFWKAD7ndD1/bVbdYUbDduepUSNSCmCRc/rkoCtSJFlyn0ur0lyXLruZbUgCs6GKWnp3Pp6YkcIkZ1OZ7Fuq6UfDRhoAcE9Pvvx22FtfZue7veugabu9LvAwD4rt1gQojHkkWvgtrftzSaf4uIuOx84TMAv/au3Gvr+36PXeZNrYjom5x84fHDb7JKFRAqUnTZgQ8JIlJE9JXl/iJR6imTpLY7zwXRYEHohigSk6nx/k7X41jf/Ww+Iga5gfLdFtnAe3b1Z80saV8plzQ8mYWI/HfFAQesSxEtK4pbfsGqO55qRsRxAN9vOQ5YeCZT17W1Pb/F5r5/tSDi+PN57bePazo3cF1EJDZn/a2SZD7mchnnKCBUpOgyguDA/3ZKrbfbHIXFJseBj8zOk1O+dEmT+cGAYCD21tyx8/464y+wrv2VfERUf58lOPBviDiprG095tbe4vg+Nzg7O01ARK6j7/PXq/pXYm3b2zkAAMnJ8D3wcydtOxx4XV3vQ1jefn+z0YjjBizZi7X4+m3ZSQ5n/gGHq+YTl8s4FxFVyikSRYouY7X3bbynpefD6i7zti39/ZWjvgBh5oWDMNtjBZU3vfB4k/1aLGxY9wdE1H8XBM9JZg4oavhd";

const WAVE_SVG_MARKUP = '<svg class="wave-svg" viewBox="0 0 360 225" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="360" height="225" fill="#ffffff"/><path d="M0,0 L360,0 L360,14 Q260,27 172,20 Q88,13 0,23 Z" fill="#CBD300"/><path d="M0,20 Q88,9.6 172,16.8 Q260,24 360,11.2" stroke="#7F622C" stroke-width="1.2" fill="none"/><path d="M0,22.8 Q88,12.4 172,19.6 Q260,26.8 360,14" stroke="#7F622C" stroke-width="0.8" fill="none"/><path d="M0,23.2 Q36,56 24,92 Q14,124 44,156 Q70,182 78,225 L0,225 Z" fill="#CBD300"/><path d="M0,225 L360,225 L360,202 Q260,191.2 172,200 Q88,208.8 0,199.2 Z" fill="#CBD300"/><path d="M0,200 Q88,209.6 172,200.8 Q260,192 360,202.8" stroke="#7F622C" stroke-width="1.2" fill="none"/></svg>';

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

function genRef(){
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let r = 'KSG-';
  for (let i = 0; i < 3; i++) r += chars[Math.floor(Math.random() * chars.length)];
  r += '-';
  for (let i = 0; i < 4; i++) r += Math.floor(Math.random() * 10);
  return r;
}

window.genRef = genRef;

// ─── PERSISTENCE ─────────────────────────────
function saveLocal(){
  if (persistTimer) {
    if(typeof persistTimer === 'number' && persistTimer > 0) clearTimeout(persistTimer);
  }
  
  const doSave = () => {
    try {
      localStorage.setItem('ksg_tags', JSON.stringify(STATE.tags));
      localStorage.setItem('ksg_logs', JSON.stringify(STATE.logs));
      localStorage.setItem('ksg_settings', JSON.stringify(STATE.settings));
    } catch(e) {
      console.error('localStorage write failed:', e);
    }
  };
  
  if(typeof requestIdleCallback !== 'undefined') {
    persistTimer = requestIdleCallback(doSave, { timeout: 1000 });
  } else {
    persistTimer = setTimeout(doSave, 0);
  }
}

function save(){
  saveLocal();
  syncToSupabase().catch(e=>console.warn('Supabase sync:', e.message));
}

async function syncToSupabase(){
  await KSGDb.upsertSettings(STATE.settings);
}

async function loadFromSupabase(){
  const data = await KSGDb.loadAll();
  STATE.tags = data.tags;
  STATE.logs = data.logs;
  if(data.settings) STATE.settings = {...STATE.settings, ...data.settings};
  saveLocal();
  return true;
}

function load(){
  const t = localStorage.getItem('ksg_tags'); if(t) STATE.tags = JSON.parse(t);
  const l = localStorage.getItem('ksg_logs'); if(l) STATE.logs = JSON.parse(l);
  const s = localStorage.getItem('ksg_settings'); if(s) STATE.settings = {...STATE.settings,...JSON.parse(s)};
  const u = localStorage.getItem('ksg_user'); if(u) STATE.user = JSON.parse(u);
  
  // Ensure all tags have p_number and id_number_value fields for Staff category
  STATE.tags.forEach(tag => {
    if (!tag.p_number) tag.p_number = '';
    if (!tag.id_number_value) tag.id_number_value = '';
  });
  
  KSGSupabase.init();
}

// ─── AUTH ─────────────────────────────────────
function switchAuthTab(tab){
  const authTabs = document.querySelectorAll('.auth-tab');
  const authForms = document.querySelectorAll('.auth-form');
  
  // Map tab names to indices
  const tabIndex = { 'login': 0, 'register': 1, 'reset': 2 };
  const idx = tabIndex[tab] ?? 0;
  
  authTabs.forEach((t, i) => {
    t.classList.toggle('active', i === idx);
  });
  
  authForms.forEach((f, i) => {
    f.style.display = i === idx ? 'block' : 'none';
    if(i === idx) f.classList.add('active');
    else f.classList.remove('active');
  });
}

async function doLogin(){
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-pass').value;
  
  try {
    const { data, error } = await window.KSGSupabase.getClient().auth.signInWithPassword({ email, password });
    if (error) throw error;
    
    STATE.user = { email: data.user.email, name: email.split('@')[0], role: 'Admin' };
    localStorage.setItem('ksg_user', JSON.stringify(STATE.user));
    
    document.getElementById('auth-screen').style.display = 'none';
    document.getElementById('app').style.display = 'block';
    
    initApp();
    toast('Login successful!', 'success');
  } catch(err) {
    toast('Login failed: ' + err.message, 'error');
  }
}

async function doRegister(){
  const email = document.getElementById('reg-email').value;
  const password = document.getElementById('reg-pass').value;
  
  try {
    const { data, error } = await window.KSGSupabase.getClient().auth.signUp({ email, password });
    if (error) throw error;
    
    toast('Registration successful! Please check your email.', 'success');
    switchAuthTab('login');
  } catch(err) {
    toast('Registration failed: ' + err.message, 'error');
  }
}

async function doReset(){
  const email = document.getElementById('reset-email').value;
  
  try {
    const { data, error } = await window.KSGSupabase.getClient().auth.resetPasswordForEmail(email);
    if (error) throw error;
    
    toast('Password reset link sent to your email!', 'success');
    switchAuthTab('login');
  } catch(err) {
    toast('Reset failed: ' + err.message, 'error');
  }
}

async function handleLogout(){
  await window.KSGSupabase.getClient().auth.signOut();
  STATE.user = null;
  localStorage.removeItem('ksg_user');
  
  document.getElementById('app').style.display = 'none';
  document.getElementById('auth-screen').style.display = 'flex';
  
  toast('Logged out successfully', 'success');
}

// ─── NAVIGATION ───────────────────────────────
function gotoPage(name, btn){
  const pages = document.querySelectorAll('.page');
  const navItems = document.querySelectorAll('.nav-item');
  
  pages.forEach(p => p.classList.remove('active'));
  navItems.forEach(n => n.classList.remove('active'));
  
  const targetPage = document.getElementById('page-' + name);
  if(targetPage) targetPage.classList.add('active');
  
  if(btn) btn.classList.add('active');
  
  STATE.currentPage = name;
}

// ─── UTILITIES ─────────────────────────────────
function toast(msg, type = 'info', duration = 4000){
  // Get or create toast container
  let container = document.getElementById('toast-container');
  if(!container){
    container = document.createElement('div');
    container.id = 'toast-container';
    container.style.position = 'fixed';
    container.style.bottom = '24px';
    container.style.right = '24px';
    container.style.zIndex = '9999';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.gap = '8px';
    document.body.appendChild(container);
  }
  
  // Remove existing toasts if any
  const existing = container.querySelectorAll('.toast');
  existing.forEach(t => t.remove());
  
  const el = document.createElement('div');
  el.className = `toast toast-${type}`;
  el.textContent = msg;
  container.appendChild(el);
  
  setTimeout(() => {
    if(el.parentNode === container){
      el.remove();
    }
  }, duration);
}

function closeModal(id){
  document.getElementById(id).classList.remove('open');
}

function formatDate(iso){
  if(!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatTime(iso){
  if(!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

function logActivity(msg, action = 'general'){
  const log = {
    id: Date.now(),
    msg,
    time: new Date().toISOString(),
    action,
    user: STATE.user?.email || 'system'
  };
  
  STATE.logs.unshift(log);
  if(STATE.logs.length > 200) STATE.logs.pop();
  
  saveLocal();
  
  if(KSGDb.enabled()) {
    KSGDb.insertLog(msg, STATE.user?.email, STATE.user?.id, action).catch(console.error);
  }
}

// ─── INITIALIZATION ───────────────────────────
async function initApp(isRestored = false){
  document.getElementById('auth-screen').style.display = 'none';
  document.getElementById('app').style.display = 'block';
  
  document.getElementById('user-name-disp').textContent = STATE.user.name || STATE.user.email.split('@')[0];
  document.getElementById('user-role-disp').textContent = STATE.user.role || 'Admin';
  document.getElementById('user-av').textContent = (STATE.user.name||STATE.user.email)[0].toUpperCase();
  
  // Initialize Staff styling state for view tag functionality
  if (!window.STAFF_STATE) {
    window.STAFF_STATE = {...STAFF_DEFAULTS};
  }
  
  try {
    await loadFromSupabase();
    if(!isRestored) toast('Data synced from Supabase ☁️');
  } catch(e) {
    toast('Could not load from Supabase: '+e.message, 'error');
  }
  
  applySettings();
  refreshTagDataViews();
  updateTagPreviewInit();
  
  const dashboardBtn = document.querySelector('.nav-item');
  if(dashboardBtn) gotoPage('dashboard', dashboardBtn);
}

function applySettings(){
  const s = STATE.settings;
  document.documentElement.style.setProperty('--org-name', s.org || 'Kenya School of Government');
  document.documentElement.style.setProperty('--sys-name', s.sys || 'KSG Tag Generator');
  document.documentElement.style.setProperty('--tagline', s.tagline || 'Official Identification Tag');
  
  if(s.darkMode) document.body.classList.add('dark-mode');
  else document.body.classList.remove('dark-mode');
}

function refreshTagDataViews(){
  // This will be called by page-specific modules
  if(typeof window.refreshDashboard === 'function') window.refreshDashboard();
  if(typeof window.refreshManageTags === 'function') window.refreshManageTags();
  if(typeof window.refreshReports === 'function') window.refreshReports();
  if(typeof window.refreshActivityLogs === 'function') window.refreshActivityLogs();
}

function updateTagPreviewInit(){
  currentRef = currentRef || genRef();
  const refEl = document.getElementById('pt-ref');
  const dateEl = document.getElementById('pt-date');
  if (refEl) refEl.textContent = currentRef;
  if (dateEl) dateEl.textContent = new Date().toLocaleDateString('en-GB');

  // Initialize preview if on generate page
  if(document.getElementById('page-generate').classList.contains('active')){
    if(typeof window.updatePreview === 'function') window.updatePreview();
  }
}

// ─── MISSING FUNCTIONS ──────────────────────────

// Filter tags for manage page
function filterTags(searchValue) {
  // This function is called from the manage page's search and filter selectors
  // It uses applyTagFilters() from manage-tags.js
  if (typeof window.applyTagFilters === 'function') {
    window.applyTagFilters();
    if (typeof window.renderManageTable === 'function') {
      window.renderManageTable();
    }
  }
}

// Toggle select all visible tags
function toggleSelectVisible(checked) {
  if (typeof window.toggleSelectAll === 'function') {
    window.toggleSelectAll(checked);
  }
}

// Download selected tags as PDF
async function downloadSelectedTags() {
  const selectedIds = STATE.selectedTagIds || [];
  if (!selectedIds.length) {
    toast('Please select at least one tag to download.', 'error');
    return;
  }

  const selectedTags = STATE.tags.filter(t => selectedIds.includes(t.id));
  if (!selectedTags.length) {
    toast('No selected tags found.', 'error');
    return;
  }

  const btn = document.getElementById('bulk-download-btn');
  const originalText = btn.textContent;
  btn.disabled = true;
  btn.textContent = '⏳ Generating PDF...';

  try {
    // Create a temporary container to render all tags
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '0';
    tempContainer.style.display = 'flex';
    tempContainer.style.flexWrap = 'wrap';
    tempContainer.style.gap = '20px';
    tempContainer.style.padding = '20px';
    tempContainer.style.background = 'white';

    document.body.appendChild(tempContainer);

    // Render each tag using buildTagHTML
    selectedTags.forEach(tag => {
      const tagWrapper = document.createElement('div');
      tagWrapper.innerHTML = window.buildTagHTML(tag);
      tempContainer.appendChild(tagWrapper);
    });

    // Wait a moment for images to load
    await new Promise(resolve => setTimeout(resolve, 200));

    // Use html2canvas to capture the container
    const canvas = await html2canvas(tempContainer, {
      scale: 2,
      backgroundColor: '#ffffff',
      useCORS: true,
      allowTaint: true,
      logging: false
    });

    // Cleanup temp container
    document.body.removeChild(tempContainer);

    // Create a PDF with jsPDF
    const JsPDF = window.jspdf?.jsPDF || window.jsPDF;
    if (!JsPDF) {
      throw new Error('jsPDF library not loaded');
    }

    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    const pdf = new JsPDF('p', 'mm', 'a4');
    const imgData = canvas.toDataURL('image/png');

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`KSG-Selected-Tags-${new Date().toISOString().slice(0,10)}.pdf`);
    toast(`Successfully downloaded ${selectedTags.length} tag(s)!`, 'success');
    logActivity(`Downloaded ${selectedTags.length} selected tag(s) as PDF`, 'export');
  } catch (error) {
    console.error(error);
    toast('Failed to generate PDF: ' + (error.message || 'Unknown error'), 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = originalText;
  }
}

// Download modal tag as PDF
async function downloadModalPDF() {
  const tagWrap = document.getElementById('modal-tag-wrap');
  if (!tagWrap || !tagWrap.firstElementChild) {
    toast('No tag to download.', 'error');
    return;
  }

  try {
    const canvas = await html2canvas(tagWrap.firstElementChild, {
      scale: 2,
      backgroundColor: '#ffffff',
      useCORS: true,
      allowTaint: true,
      logging: false
    });

    const JsPDF = window.jspdf?.jsPDF || window.jsPDF;
    if (!JsPDF) {
      throw new Error('jsPDF library not loaded');
    }

    const pdf = new JsPDF({ orientation: 'landscape', unit: 'mm', format: [90, 56] });
    const pw = pdf.internal.pageSize.getWidth();
    const ph = pdf.internal.pageSize.getHeight();
    const imgW = 86;
    const imgH = (canvas.height / canvas.width) * imgW;
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', (pw - imgW) / 2, (ph - imgH) / 2, imgW, imgH);
    pdf.save(`KSG-Tag-${STATE.modalTag?.reference_number || 'unknown'}.pdf`);
    toast('PDF downloaded successfully!', 'success');
    logActivity(`Downloaded tag PDF: ${STATE.modalTag?.reference_number}`, 'export');
  } catch (error) {
    console.error(error);
    toast('Failed to generate PDF: ' + (error.message || 'Unknown error'), 'error');
  }
}

// Download modal tag as PNG
async function downloadModalPNG() {
  const tagWrap = document.getElementById('modal-tag-wrap');
  if (!tagWrap || !tagWrap.firstElementChild) {
    toast('No tag to download.', 'error');
    return;
  }

  try {
    const canvas = await html2canvas(tagWrap.firstElementChild, {
      scale: 2,
      backgroundColor: '#ffffff',
      useCORS: true,
      allowTaint: true,
      logging: false
    });

    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = `KSG-Tag-${STATE.modalTag?.reference_number || 'unknown'}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();

    toast('PNG downloaded successfully!', 'success');
    logActivity(`Downloaded tag PNG: ${STATE.modalTag?.reference_number}`, 'export');
  } catch (error) {
    console.error(error);
    toast('Failed to generate PNG: ' + (error.message || 'Unknown error'), 'error');
  }
}

// Print modal tag
function printModal() {
  const tagWrap = document.getElementById('modal-tag-wrap');
  if (!tagWrap || !tagWrap.firstElementChild) {
    toast('No tag to print.', 'error');
    return;
  }

  const printWindow = window.open('', '', 'width=800,height=600');
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Print Tag</title>
        <style>
          body { margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
        </style>
      </head>
      <body>
        ${tagWrap.innerHTML}
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  logActivity(`Printed tag: ${STATE.modalTag?.reference_number}`, 'export');
}

// Download edit tag PDF
async function downloadEditPDF() {
  // First, get the tag being edited
  const id = document.getElementById('edit-id').value;
  const tag = STATE.tags.find(t => t.id == id);
  if (!tag) {
    toast('Tag not found.', 'error');
    return;
  }

  // Create a temporary element to render the tag
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = window.buildTagHTML(tag);
  document.body.appendChild(tempDiv);

  try {
    const canvas = await html2canvas(tempDiv.firstElementChild, {
      scale: 2,
      backgroundColor: '#ffffff',
      useCORS: true,
      allowTaint: true,
      logging: false
    });

    const JsPDF = window.jspdf?.jsPDF || window.jsPDF;
    if (!JsPDF) {
      throw new Error('jsPDF library not loaded');
    }

    const pdf = new JsPDF({ orientation: 'landscape', unit: 'mm', format: [90, 56] });
    const pw = pdf.internal.pageSize.getWidth();
    const ph = pdf.internal.pageSize.getHeight();
    const imgW = 86;
    const imgH = (canvas.height / canvas.width) * imgW;
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', (pw - imgW) / 2, (ph - imgH) / 2, imgW, imgH);
    pdf.save(`KSG-Tag-${tag.reference_number}.pdf`);
    toast('PDF downloaded successfully!', 'success');
    logActivity(`Downloaded edited tag PDF: ${tag.reference_number}`, 'export');
  } catch (error) {
    console.error(error);
    toast('Failed to generate PDF: ' + (error.message || 'Unknown error'), 'error');
  } finally {
    document.body.removeChild(tempDiv);
  }
}

// Export all tags as CSV
function exportAll() {
  if (!STATE.tags.length) {
    toast('No tags to export.', 'error');
    return;
  }

  const headers = [
    'Reference Number',
    'Full Name',
    'Department',
    'Category',
    'Position',
    'ID Number',
    'P Number',
    'ID Number Value',
    'Status',
    'Date Generated',
    'Created By'
  ];

  const csvContent = [
    headers.join(','),
    ...STATE.tags.map(tag => [
      `"${tag.reference_number}"`,
      `"${tag.full_name}"`,
      `"${tag.department || ''}"`,
      `"${tag.category || ''}"`,
      `"${tag.position || ''}"`,
      `"${tag.id_number}"`,
      `"${tag.p_number || ''}"`,
      `"${tag.id_number_value || ''}"`,
      `"${tag.status || 'Active'}"`,
      `"${new Date(tag.date_generated).toLocaleString()}"`,
      `"${tag.created_by || ''}"`
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `KSG-All-Tags-${new Date().toISOString().slice(0,10)}.csv`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);

  toast('All tags exported successfully! 📥', 'success');
  logActivity(`Exported all tags (${STATE.tags.length} entries) as CSV`, 'export');
}

// Export PDF report
function exportPDFReport() {
  // Simple implementation: show a toast for now, or generate a basic report
  toast('PDF Report feature coming soon!', 'info');
}

// Clear all data
function clearAllData() {
  if (!confirm('Are you sure you want to clear ALL tags and logs? This cannot be undone.')) {
    return;
  }

  STATE.tags = [];
  STATE.logs = [];
  saveLocal();
  refreshTagDataViews();
  logActivity('All data cleared', 'general');
  toast('All data cleared successfully!', 'success');
}

// Toggle dark mode
function toggleDark() {
  STATE.settings.darkMode = !STATE.settings.darkMode;
  saveLocal();
  applySettings();
}

// Export functions to global scope
window.filterTags = filterTags;
window.toggleSelectVisible = toggleSelectVisible;
window.downloadSelectedTags = downloadSelectedTags;
window.downloadModalPDF = downloadModalPDF;
window.downloadModalPNG = downloadModalPNG;
window.printModal = printModal;
window.downloadEditPDF = downloadEditPDF;
window.exportAll = exportAll;
window.exportPDFReport = exportPDFReport;
window.clearAllData = clearAllData;
window.toggleDark = toggleDark;
