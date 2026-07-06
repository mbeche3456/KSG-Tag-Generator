/* ════════════════════════════════════════════
   KSG TAG GENERATOR — GENERATE TAG PAGE
   Tag generation, preview, and export functions
   ════════════════════════════════════════════ */

// ─── PREVIEW REFERENCES ─────────────────────────
const PREVIEW_REFS = {
  nameEl: null,
  deptEl: null,
  posEl: null,
  catEl: null,
  pnoEl: null,
  idnoEl: null,
  ptName: null,
  ptDept: null,
  ptPos: null,
  ptPno: null,
  ptIdno: null,
};

// ─── STAFF DEFAULTS ─────────────────────────────
const STAFF_DEFAULTS = {
  'pt-name':    {ff:'Times New Roman', size:22, w:800, ls:0.5, top:163, left:30, color:'#000000', bg:false},
  'pt-pno':     {ff:'Trebuchet MS', size:21, w:600, ls:0.3, top:218, left:33, color:'#000000', bg:false},
  'pt-idno':    {ff:'Trebuchet MS', size:21, w:600, ls:0.3, top:271, left:32, color:'#000000', bg:false},
};

function applyLivePreviewStyles(){
  const styleState = window.TEXT_STYLE_STATE || window.STAFF_STATE;
  if (!styleState) return;

  const catEl = document.getElementById('f-cat');
  const isStaff = catEl?.value === 'Staff';

  const applyStyle = (id) => {
    const el = document.getElementById(id);
    const style = styleState[id];
    if (!el || !style) return;

    el.style.fontFamily = `"${style.ff}", sans-serif`;
    el.style.fontSize = style.size + 'px';
    el.style.fontWeight = style.w;
    el.style.letterSpacing = style.ls + 'px';
    el.style.top = style.top + 'px';
    el.style.left = style.left + 'px';
    el.style.right = 'auto';
    el.style.color = style.color || '#000000';
    el.style.backgroundColor = style.bg ? 'rgba(255,255,255,0.92)' : 'transparent';
    el.style.padding = style.bg ? '2px 8px' : '0';
    el.style.whiteSpace = 'nowrap';

    const isStaffField = isStaff && (id === 'pt-name' || id === 'pt-pno' || id === 'pt-idno');
    if (isStaffField) {
      el.style.transform = 'none';
      el.style.textAlign = 'left';
    } else {
      el.style.transform = 'translate(-50%, -50%)';
      el.style.textAlign = 'center';
    }
  };

  ['pt-name', 'pt-position', 'pt-pno', 'pt-idno', 'pt-dept', 'pt-orgname'].forEach(applyStyle);
}

// ─── PREVIEW UPDATE ─────────────────────────────
function updatePreview(){
  if (previewRenderHandle) {
    cancelAnimationFrame(previewRenderHandle);
  }
  previewRenderHandle = requestAnimationFrame(() => {
    previewRenderHandle = 0;

    if (!PREVIEW_REFS.nameEl) {
      PREVIEW_REFS.nameEl = document.getElementById('f-name');
      PREVIEW_REFS.deptEl = document.getElementById('f-dept');
      PREVIEW_REFS.posEl = document.getElementById('f-position');
      PREVIEW_REFS.catEl = document.getElementById('f-cat');
      PREVIEW_REFS.pnoEl = document.getElementById('f-pno');
      PREVIEW_REFS.idnoEl = document.getElementById('f-idno');
      PREVIEW_REFS.ptName = document.getElementById('pt-name');
      PREVIEW_REFS.ptDept = document.getElementById('pt-dept');
      PREVIEW_REFS.ptPos = document.getElementById('pt-position');
      PREVIEW_REFS.ptPno = document.getElementById('pt-pno');
      PREVIEW_REFS.ptIdno = document.getElementById('pt-idno');
    }

    const { nameEl, deptEl, posEl, catEl, pnoEl, idnoEl, ptName, ptDept, ptPos, ptPno, ptIdno } = PREVIEW_REFS;
    if(!nameEl || !deptEl || !posEl || !catEl || !ptName || !ptDept || !ptPos) return;

    applyLivePreviewStyles();

    const name = nameEl.value.trim();
    const dept = deptEl.value || 'DEPARTMENT';
    const pos = posEl.value.trim();
    const cat = catEl.value || '';
    const pno = pnoEl?.value.trim() || '';
    const idno = idnoEl?.value.trim() || '';

    // If no category selected, clear preview
    if (!cat) {
      ptName.textContent = '';
      ptDept.textContent = '';
      ptPos.textContent = '';
      ptPno.textContent = '';
      ptIdno.textContent = '';
      ptPno.style.display = 'none';
      ptIdno.style.display = 'none';
      ptPos.style.display = 'none';
      ptDept.style.display = 'none';
      return;
    }

    // Handle Staff category - show "Name:" prefix with the actual name (no placeholder)
    if (cat === 'Staff') {
      ptName.textContent = name ? `Name: ${name.toUpperCase()}` : 'Name:';
    } else {
      ptName.textContent = name ? name.toUpperCase() : 'FULL NAME';
    }

    ptDept.textContent = dept.toUpperCase();

    // Handle Staff category with P/No and ID/No
    if (cat === 'Staff') {
      ptPos.textContent = '';
      ptPos.style.display = 'none';

      // Always show prefixes for Staff category, even with empty values
      ptPno.innerHTML = `P/No: <span style="margin-left: 2px;">${pno || ''}</span>`;
      ptPno.style.display = 'block';
      ptIdno.innerHTML = `ID/No: <span style="margin-left: 2px;">${idno || ''}</span>`;
      ptIdno.style.display = 'block';

      ptDept.style.display = 'none';
    } else if (cat === 'Attachee') {
      ptPos.textContent = cat.toUpperCase();
      ptPos.style.display = 'block';
      ptPno.style.display = 'none';
      ptIdno.style.display = 'none';
      ptDept.style.display = 'block';
    } else if (cat === 'Intern') {
      ptPos.textContent = '';
      ptPos.style.display = 'none';
      ptPno.style.display = 'none';
      ptIdno.style.display = 'none';
      ptDept.style.display = 'block';
    } else if (cat) {
      ptPos.textContent = cat.toUpperCase();
      ptPos.style.display = 'block';
      ptPno.style.display = 'none';
      ptIdno.style.display = 'none';
    } else {
      ptPos.textContent = '';
      ptPos.style.display = 'none';
      ptPno.style.display = 'none';
      ptIdno.style.display = 'none';
    }
  });
}

// ─── FORM DATA ─────────────────────────────────
function getTagFormData(){
  const nameEl = document.getElementById('f-name');
  const deptEl = document.getElementById('f-dept');
  const catEl = document.getElementById('f-cat');
  const posEl = document.getElementById('f-position');
  const idEl = document.getElementById('f-idnum');
  const pnoEl = document.getElementById('f-pno');
  const idnoEl = document.getElementById('f-idno');

  if (!currentRef) {
    currentRef = typeof window.genRef === 'function' ? window.genRef() : (typeof genRef === 'function' ? genRef() : 'KSG-0001');
  }

  const full_name = nameEl?.value.trim() || '';
  const department = deptEl?.value || '';
  const category = catEl?.value || '';
  let position = posEl?.value.trim() || '';
  let id_number = idEl?.value.trim() || '';
  const p_number = pnoEl?.value.trim() || '';
  const id_number_value = idnoEl?.value.trim() || '';

  if(!position) position = category;
  if(!id_number) id_number = currentRef;

  return {
    reference_number: currentRef,
    full_name,
    department,
    category,
    position,
    id_number,
    p_number,
    id_number_value,
    status: document.getElementById('f-status').value || 'Active',
    date_generated: new Date().toISOString(),
    created_by: STATE.user?.email || 'system',
  };
}

// ─── FORM VALIDATION ──────────────────────────
function validateForm(){
  let ok=true;
  const catEl = document.getElementById('f-cat');
  const category = catEl?.value || '';

  const fields=[
    {id:'f-name',err:'err-name',msg:'Full name is required'}
  ];

  // Only require department if not Staff category
  if (category !== 'Staff') {
    fields.push({id:'f-dept',err:'err-dept',msg:'Department is required'});
  }

  // Require P/No and ID/No for Staff category
  if (category === 'Staff') {
    fields.push({id:'f-pno',err:'err-pno',msg:'P/No is required for Staff'});
    fields.push({id:'f-idno',err:'err-idno',msg:'ID/No is required for Staff'});
  }

  fields.forEach(f=>{
    const inputEl=document.getElementById(f.id);
    const errEl=document.getElementById(f.err);
    if(!inputEl||!errEl) return;

    const val=inputEl.value.trim();
    if(!val){
      errEl.textContent=f.msg;
      inputEl.classList.add('error');
      ok=false;
    } else {
      errEl.textContent='';
      inputEl.classList.remove('error');
    }
  });

  if(ok && STATE.settings.dup){
    const idnum=getTagFormData().id_number;
    if(STATE.tags.find(t=>t.id_number===idnum)){
      const errEl=document.getElementById('err-idnum');
      if(errEl) errEl.textContent='This ID number already exists!';
      ok=false;
    }
  }

  return ok;
}

// ─── STAFF FIELD TOGGLE ─────────────────────────
function toggleStaffFields(){
  const catEl = document.getElementById('f-cat');
  const staffFieldsRow = document.getElementById('staff-fields-row');
  const deptRow = document.getElementById('f-dept').closest('.form-row');
  const cat = catEl?.value || '';

  if (cat === 'Staff') {
    staffFieldsRow.style.display = 'flex';
    deptRow.style.display = 'none';
    applyStaffDefaults();
    updatePreview();
  } else {
    staffFieldsRow.style.display = 'none';
    deptRow.style.display = 'flex';
    resetToDefaults();
    updatePreview();
  }
}

// ─── SAVE TAG ─────────────────────────────────
async function persistCurrentTag(){
  const data = getTagFormData();
  const ref = data.reference_number;
  const tag={ ...data };
  delete tag.id;

  let saved;
  if (KSGDb.enabled()) {
    saved = await KSGDb.insertTag(tag, STATE.user?.email, STATE.user?.id);
    await loadFromSupabase();
  } else {
    saved = { ...tag, id: `${Date.now()}-${Math.random().toString(36).slice(2,8)}` };
    STATE.tags.unshift(saved);
    saveLocal();
  }

  STATE.currentPage = 1;
  refreshTagDataViews();
  logActivity(`Tag generated: ${tag.full_name} (${ref}) - Category: ${tag.category}`, 'tag_generated');

  return { tag: saved, ref, name: tag.full_name };
}

async function saveTagOnly(){
  if(!validateForm()) return;
  const saveBtn = document.getElementById('btn-generate-tag');
  if(saveBtn) {
    saveBtn.disabled = true;
    saveBtn.textContent = '⏳ Generating...';
  }

  try{
    const saved = await persistCurrentTag();
    updateTagPreviewInit();
    updatePreview();
    toast(`Tag saved: ${saved.name} (${saved.ref}). View in Manage Tags & Reports.`, 'success');
    clearForm();
  }catch(e){
    toast('Failed to save tag: ' + (e.message || 'Unknown error'), 'error');
    console.error(e);
  } finally {
    if(saveBtn) {
      saveBtn.disabled = false;
      saveBtn.textContent = '🏷️ Generate Tag';
    }
  }
}

// ─── PDF GENERATION ───────────────────────────
function getJsPDF(){
  const lib = window.jspdf?.jsPDF || window.jsPDF;
  if(!lib) throw new Error('PDF library failed to load. Check your internet connection.');
  return lib;
}

async function captureTagElement(el){
  if(!window.html2canvas) throw new Error('Image capture library failed to load.');
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
      clonedEl.querySelectorAll('.tag-content, [id^="pt-"], .tag-name, .tag-dept, .tag-position, .tag-org-name').forEach(node=>{
        node.style.position = node.style.position || 'absolute';
        node.style.zIndex = '2';
      });
    },
  });
}

async function exportTagCanvas(el){
  updatePreview();
  await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
  return captureTagElement(el);
}

async function generateTagPDF(){
  if(!validateForm()) return;
  const ref = currentRef;
  const el = document.getElementById('id-tag');
  if(!el){ toast('Tag preview not found.', 'error'); return; }

  const pdfBtn = document.querySelector('button[onclick="generateTagPDF()"]');
  if(pdfBtn) {
    pdfBtn.disabled = true;
    pdfBtn.textContent = '⏳ Generating...';
  }

  updatePreview();

  try{
    const canvas = await exportTagCanvas(el);
    const JsPDF = getJsPDF();
    const pdf = new JsPDF({ orientation: 'landscape', unit: 'mm', format: [90, 56] });
    const pw = pdf.internal.pageSize.getWidth();
    const ph = pdf.internal.pageSize.getHeight();
    const imgW = 86;
    const imgH = (canvas.height / canvas.width) * imgW;
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', (pw - imgW) / 2, (ph - imgH) / 2, imgW, imgH);
    pdf.save(`KSG-Tag-${ref}.pdf`);

    try{
      const saved = await persistCurrentTag();
      updateTagPreviewInit();
      updatePreview();
      toast(`PDF generated for ${saved.name}. Updated in Manage Tags & Reports.`, 'success');
    }catch(e){
      toast('PDF downloaded but tag could not be saved: ' + e.message, 'error');
    }
  }catch(e){
    toast('PDF generation failed: ' + (e.message || 'Unknown error'), 'error');
    console.error(e);
  } finally {
    if(pdfBtn) {
      pdfBtn.disabled = false;
      pdfBtn.textContent = '📄 Download PDF';
    }
  }
}

async function generateTagWord(){
  return generateTagPDF();
}

async function generateTagPNG(){
  if(!validateForm()) return;
  const ref = currentRef;
  const el = document.getElementById('id-tag');
  if(!el){ toast('Tag preview not found.', 'error'); return; }

  try{
    const canvas = await exportTagCanvas(el);
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = `KSG-Tag-${ref}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();

    try{
      const saved = await persistCurrentTag();
      updateTagPreviewInit();
      updatePreview();
      toast(`PNG generated for ${saved.name}. Updated in Manage Tags & Reports.`, 'success');
    }catch(e){
      toast('PNG downloaded but tag could not be saved: ' + e.message, 'error');
    }
  }catch(e){
    toast('PNG generation failed: ' + (e.message || 'Unknown error'), 'error');
    console.error(e);
  }
}

// ─── FORM CLEARING ─────────────────────────────
function clearForm(){
  const ids=['f-name','f-idnum','f-position','f-pno','f-idno'];
  const selects=['f-dept','f-cat'];

  ids.forEach(id=>{
    const el=document.getElementById(id);
    if(el) el.value='';
  });

  selects.forEach(id=>{
    const el=document.getElementById(id);
    if(el) el.selectedIndex=0;
  });

  const statusEl=document.getElementById('f-status');
  if(statusEl) statusEl.selectedIndex=0;

  const errs=['err-name','err-idnum','err-dept','err-position','err-cat','err-pno','err-idno'];
  errs.forEach(id=>{
    const el=document.getElementById(id);
    if(el) el.textContent='';
  });

  const inputEls=document.querySelectorAll('.gen-form input, .gen-form select');
  inputEls.forEach(el=>el.classList.remove('error'));

  updatePreview();
  updateTagPreviewInit();
}

// ─── STYLING PANEL FUNCTIONS ───────────────────
// These are placeholder functions - actual implementation would be in a separate styling module
function applyStaffDefaults(){
  if (typeof window.applyCurrentStyles === 'function') {
    window.applyCurrentStyles();
  }
  if (typeof window.applyStaffDefaults === 'function' && window.applyStaffDefaults !== applyStaffDefaults) {
    window.applyStaffDefaults();
    return;
  }
  if (!window.STAFF_STATE) {
    window.STAFF_STATE = {...STAFF_DEFAULTS};
  }
}

function resetToDefaults(){
  if (typeof window.resetToDefaults === 'function' && window.resetToDefaults !== resetToDefaults) {
    window.resetToDefaults();
    return;
  }
  if (typeof window.applyCurrentStyles === 'function') {
    window.applyCurrentStyles();
  }
}

// Export functions for global access
window.updatePreview = updatePreview;
window.toggleStaffFields = toggleStaffFields;
window.validateForm = validateForm;
window.getTagFormData = getTagFormData;
window.saveTagOnly = saveTagOnly;
window.generateTagPDF = generateTagPDF;
window.generateTagWord = generateTagWord;
window.generateTagPNG = generateTagPNG;
window.clearForm = clearForm;
window.applyStaffDefaults = applyStaffDefaults;
window.resetToDefaults = resetToDefaults;
