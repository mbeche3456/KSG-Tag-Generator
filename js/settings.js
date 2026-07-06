/* ════════════════════════════════════════════
   KSG TAG GENERATOR — SETTINGS PAGE
   System settings and configuration
   ════════════════════════════════════════════ */

// ─── SETTINGS FUNCTIONS ─────────────────────────
async function saveSettings(){
  STATE.settings.org=document.getElementById('set-org').value;
  STATE.settings.sys=document.getElementById('set-sys').value;
  STATE.settings.tagline=document.getElementById('set-tagline').value;
  STATE.settings.gov=document.getElementById('set-gov').value;

  try{
    await KSGDb.upsertSettings(STATE.settings);
    saveLocal(); 
    applySettings(); 
    toast('Settings saved!','success');
    logActivity(`System settings updated: ${STATE.settings.sys}`, 'settings_changed');
  }catch(e){ 
    toast('Failed to save settings: '+e.message, 'error'); 
    logActivity(`Settings save failed: ${e.message}`, 'settings_changed');
  }
}

function applySettings(){
  document.getElementById('pt-orgname').textContent=(STATE.settings.org||'KENYA SCHOOL OF GOVERNMENT').toUpperCase();
  
  if(STATE.settings.darkMode) document.documentElement.style.setProperty('--ksg-light','#1a2535');

  document.getElementById('set-org').value=STATE.settings.org;
  document.getElementById('set-sys').value=STATE.settings.sys;
  document.getElementById('set-tagline').value=STATE.settings.tagline;
  document.getElementById('set-gov').value=STATE.settings.gov;

  ['dark','qr','email','dup','log'].forEach(k=>{ 
    const el=document.getElementById('tgl-'+k); 
    if(el) el.classList.toggle('on',!!STATE.settings[k]); 
  });
}

function toggleSetting(key){
  STATE.settings[key]=!STATE.settings[key];
  const el=document.getElementById('tgl-'+key);
  if(el) el.classList.toggle('on',!!STATE.settings[key]);
  saveLocal();
  applySettings();
}

// Export functions for global access
window.saveSettings = saveSettings;
window.applySettings = applySettings;
window.toggleSetting = toggleSetting;
