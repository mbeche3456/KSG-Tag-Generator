/* ════════════════════════════════════════════
   KSG TAG GENERATOR — TEXT STYLING PANEL
   Per-field text styling and drag functionality
   ════════════════════════════════════════════ */

(function(){
  const DEFAULTS = {
    'pt-name':    {ff:'Times New Roman', size:30, w:800, ls:0.5, top:195, left:257, color:'#000000', bg:false},
    'pt-position':{ff:'Times New Roman', size:24, w:700, ls:0.5, top:226, left:260, color:'#000000', bg:false},
    'pt-pno':     {ff:'Times New Roman', size:18, w:600, ls:0.3, top:226, left:260, color:'#000000', bg:false},
    'pt-idno':    {ff:'Times New Roman', size:18, w:600, ls:0.3, top:249, left:260, color:'#000000', bg:false},
    'pt-dept':    {ff:'Times New Roman', size:25, w:700, ls:0.5, top:249, left:264, color:'#000000', bg:false},
    'pt-orgname': {ff:'Arial',           size:22, w:700, ls:1.5, top:132, left:284, color:'#A2A825', bg:false},
  };

  const STAFF_DEFAULTS = {
    'pt-name':    {ff:'Times New Roman', size:22, w:800, ls:0.5, top:163, left:30, color:'#000000', bg:false},
    'pt-pno':     {ff:'Trebuchet MS', size:21, w:600, ls:0.3, top:218, left:33, color:'#000000', bg:false},
    'pt-idno':    {ff:'Trebuchet MS', size:21, w:600, ls:0.3, top:271, left:32, color:'#000000', bg:false},
  };

  const state = JSON.parse(JSON.stringify(DEFAULTS));

  window.TEXT_STYLE_STATE = state;
  window.TEXT_STYLE_DEFAULTS = DEFAULTS;
  window.TEXT_STYLE_STAFF_DEFAULTS = STAFF_DEFAULTS;
  window.STAFF_DEFAULTS = STAFF_DEFAULTS;

  function apply(id){
    const el = document.getElementById(id); if(!el) return;
    const s = state[id];
    const set = (p,v)=>el.style.setProperty(p,v,'important');

    set('font-family', `"${s.ff}", sans-serif`);
    set('font-size', s.size+'px');
    set('font-weight', s.w);
    set('letter-spacing', s.ls+'px');
    set('top', s.top+'px');
    set('left', s.left+'px');
    set('right','auto');

    // Check if Staff category is selected - if so, use left alignment to prevent prefix movement
    const catEl = document.getElementById('f-cat');
    const isStaff = catEl?.value === 'Staff';
    const isStaffField = isStaff && (id === 'pt-name' || id === 'pt-pno' || id === 'pt-idno');

    if (isStaffField) {
      set('transform','none');
      set('text-align','left');
    } else {
      set('transform','translate(-50%, -50%)');
      set('text-align','center');
    }

    set('color', s.color);
    set('background-color', s.bg ? 'rgba(255,255,255,0.92)' : 'transparent');
    set('padding', s.bg ? '2px 8px' : '0');
    set('white-space','nowrap');
    set('cursor','move');
  }

  function applyAll(){ Object.keys(state).forEach(apply); }

  window.applyCurrentStyles = applyAll;

  function applyStaffDefaults(){
    // Apply Staff-specific defaults to state
    Object.keys(STAFF_DEFAULTS).forEach(key => {
      state[key] = {...STAFF_DEFAULTS[key]};
      apply(key);
    });
    // Expose staff state to window for preview to use
    window.STAFF_STATE = {...state};
    window.TEXT_STYLE_STATE = state;
    // Update UI to reflect new values
    loadUI();
  }

  function resetToDefaults(){
    // Reset to general defaults
    Object.keys(DEFAULTS).forEach(key => {
      if (state[key]) {
        state[key] = {...DEFAULTS[key]};
        apply(key);
      }
    });
    loadUI();
  }

  // Expose functions to global scope for use by toggleStaffFields
  window.applyStaffDefaults = applyStaffDefaults;
  window.resetToDefaults = resetToDefaults;

  const $ = id=>document.getElementById(id);

  function loadUI(){
    const id = $('sp-target').value;
    const s = state[id];
    $('sp-ff').value = s.ff;
    $('sp-size').value = s.size; $('sp-size-v').textContent = s.size+'px';
    $('sp-w').value = s.w; $('sp-w-v').textContent = s.w;
    $('sp-ls').value = s.ls; $('sp-ls-v').textContent = s.ls+'px';
    $('sp-top').value = s.top; $('sp-top-v').textContent = s.top+'px';
    $('sp-left').value = s.left; $('sp-left-v').textContent = s.left+'px';
    $('sp-color').value = s.color;
    $('sp-bg').checked = s.bg;
  }

  function bind(){
    $('sp-target').addEventListener('change', loadUI);

    const upd = (key, parse, label)=>e=>{
      const id = $('sp-target').value;
      state[id][key] = parse(e.target.value);
      if(label) $(label).textContent = e.target.value + (label.endsWith('v')&&label!=='sp-w-v'?'px':'');
      apply(id);
    };

    $('sp-ff').addEventListener('change', e=>{ const id=$('sp-target').value; state[id].ff=e.target.value; apply(id); });
    $('sp-size').addEventListener('input', e=>{ const id=$('sp-target').value; state[id].size=+e.target.value; $('sp-size-v').textContent=e.target.value+'px'; apply(id); });
    $('sp-w').addEventListener('input', e=>{ const id=$('sp-target').value; state[id].w=+e.target.value; $('sp-w-v').textContent=e.target.value; apply(id); });
    $('sp-ls').addEventListener('input', e=>{ const id=$('sp-target').value; state[id].ls=+e.target.value; $('sp-ls-v').textContent=e.target.value+'px'; apply(id); });
    $('sp-top').addEventListener('input', e=>{ const id=$('sp-target').value; state[id].top=+e.target.value; $('sp-top-v').textContent=e.target.value+'px'; apply(id); });
    $('sp-left').addEventListener('input', e=>{ const id=$('sp-target').value; state[id].left=+e.target.value; $('sp-left-v').textContent=e.target.value+'px'; apply(id); });
    $('sp-color').addEventListener('input', e=>{ const id=$('sp-target').value; state[id].color=e.target.value; apply(id); });
    $('sp-bg').addEventListener('change', e=>{ const id=$('sp-target').value; state[id].bg=e.target.checked; apply(id); });
  }

  // Drag on preview
  const TAG_W = 526, TAG_H = 325;
  let dragId=null, ox=0, oy=0;

  function bindDrag(){
    const tag = document.getElementById('id-tag'); if(!tag) return;

    Object.keys(state).forEach(id=>{
      const el = document.getElementById(id); if(!el) return;
      el.addEventListener('mousedown', e=>{
        e.preventDefault();
        dragId = id;
        $('sp-target').value = id; loadUI();
        const r = tag.getBoundingClientRect();
        const sx = TAG_W/r.width, sy = TAG_H/r.height;
        ox = (e.clientX - r.left)*sx - state[id].left;
        oy = (e.clientY - r.top)*sy - state[id].top;
      });
    });

    document.addEventListener('mousemove', e=>{
      if(!dragId) return;
      const r = tag.getBoundingClientRect();
      const sx = TAG_W/r.width, sy = TAG_H/r.height;
      let nx = (e.clientX - r.left)*sx - ox;
      let ny = (e.clientY - r.top)*sy - oy;
      nx = Math.max(0, Math.min(TAG_W, nx));
      ny = Math.max(0, Math.min(TAG_H, ny));
      state[dragId].left = Math.round(nx);
      state[dragId].top = Math.round(ny);
      apply(dragId);
      if($('sp-target').value===dragId) loadUI();
    });

    document.addEventListener('mouseup', ()=>{ dragId=null; });
  }

  function init(){
    if(!document.getElementById('sp-target')) return;
    applyAll(); bind(); bindDrag(); loadUI();
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', init);
  else init();

})();
