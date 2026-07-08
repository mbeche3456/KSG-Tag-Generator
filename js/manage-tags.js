/* ════════════════════════════════════════════
   KSG TAG GENERATOR — MANAGE TAGS PAGE
   Tag management, viewing, editing, and deletion
   ════════════════════════════════════════════ */

// ─── FILTER STATE ─────────────────────────────
let filteredTags = [];
let filterCache = { q: '', cat: '', status: '', tagsHash: '' };

// ─── TAG HTML GENERATION ───────────────────────
function buildTagHTML(t){
  const cat = t.category || '';
  const p_number = t.p_number || '';
  const id_number_value = t.id_number_value || '';

  let nameTop, deptTop, categoryHtml, pnoHtml = '', idnoHtml = '', deptHtml, nameDisplay, nameStyle; 

  if (cat === 'Staff') {
    const staffState = window.STAFF_STATE || STAFF_DEFAULTS;
    const nameStyleObj = staffState['pt-name'] || STAFF_DEFAULTS['pt-name'];
    const pnoStyleObj = staffState['pt-pno'] || STAFF_DEFAULTS['pt-pno'];
    const idnoStyleObj = staffState['pt-idno'] || STAFF_DEFAULTS['pt-idno'];

    nameTop = nameStyleObj.top + 'px';
    deptTop = '269px';
    categoryHtml = '';

    pnoHtml = `<div class="tag-pno" style="top: ${pnoStyleObj.top}px !important; left: ${pnoStyleObj.left}px !important; font-size: ${pnoStyleObj.size}px !important; font-weight: ${pnoStyleObj.w} !important; letter-spacing: ${pnoStyleObj.ls}px !important; font-family: ${pnoStyleObj.ff} !important; transform: none !important; text-align: left !important;">P/No: <span style="margin-left: 2px;">${p_number || ''}</span></div>`;
    idnoHtml = `<div class="tag-idno" style="top: ${idnoStyleObj.top}px !important; left: ${idnoStyleObj.left}px !important; font-size: ${idnoStyleObj.size}px !important; font-weight: ${idnoStyleObj.w} !important; letter-spacing: ${idnoStyleObj.ls}px !important; font-family: ${idnoStyleObj.ff} !important; transform: none !important; text-align: left !important;">ID/No: <span style="margin-left: 2px;">${id_number_value || ''}</span></div>`;
    deptHtml = '';
    nameDisplay = `Name: ${(t.full_name||'').toUpperCase()}`;
    nameStyle = `top: ${nameStyleObj.top}px !important; left: ${nameStyleObj.left}px !important; font-size: ${nameStyleObj.size}px !important; font-weight: ${nameStyleObj.w} !important; letter-spacing: ${nameStyleObj.ls}px !important; transform: none !important; text-align: left !important;`;

  } else if (cat === 'Attachee') {
    nameTop = '183px';
    deptTop = '269px';
    categoryHtml = `<div class="tag-position">${cat.toUpperCase()}</div>`;
 
    deptHtml = `<div class="tag-dept" style="top: ${deptTop} !important">${(t.department||'—').toUpperCase()}</div>`;
    nameDisplay = (t.full_name||'').toUpperCase();
    nameStyle = `top: ${nameTop} !important;`;

  } else if (cat === 'Intern') {
    nameTop = '195px';
    deptTop = '249px';
    categoryHtml = '';
 
    deptHtml = `<div class="tag-dept" style="top: ${deptTop} !important">${(t.department||'—').toUpperCase()}</div>`;
    nameDisplay = (t.full_name||'').toUpperCase();
    nameStyle = `top: ${nameTop} !important;`;

  } else if (cat) {
    nameTop = '183px';
    deptTop = '269px';
    categoryHtml = `<div class="tag-position">${cat.toUpperCase()}</div>`;
 
    deptHtml = `<div class="tag-dept" style="top: ${deptTop} !important">${(t.department||'—').toUpperCase()}</div>`;
    nameDisplay = (t.full_name||'').toUpperCase();
    nameStyle = `top: ${nameTop} !important;`;

  } else {
    nameTop = '195px';
    deptTop = '249px';
    categoryHtml = '';
 
    deptHtml = `<div class="tag-dept" style="top: ${deptTop} !important">${(t.department||'—').toUpperCase()}</div>`;
    nameDisplay = (t.full_name||'').toUpperCase();
    nameStyle = `top: ${nameTop} !important;`;
  }

  return `<div class="id-tag">
    <div>${WAVE_SVG_MARKUP}</div>
    <div class="tag-content">
      <div class="tag-coa"><img src="${COA_LOGO}" alt="Kenya Coat of Arms"></div>
      <div class="tag-ksg"><img src="${KSG_LOGO}" alt="KSG Logo"></div>
      <div class="tag-org-name">${(STATE.settings.org||'KENYA SCHOOL OF GOVERNMENT').toUpperCase()}</div>
      <div class="tag-name" style="${nameStyle}">${nameDisplay}</div>
      ${categoryHtml}
      ${pnoHtml}
      ${idnoHtml}
      ${deptHtml}
      <div class="tag-meta-strip">
        <span class="tag-ref">${t.reference_number}</span>
        <span class="tag-date">${new Date(t.date_generated).toLocaleDateString('en-GB')}</span>
      </div>
    </div>
  </div>`;
}

// ─── VIEW TAG ─────────────────────────────────
function viewTag(id){
  const t=STATE.tags.find(x=>x.id==id);
  if(!t) return;
  STATE.modalTag=t;
  document.getElementById('modal-tag-wrap').innerHTML=buildTagHTML(t);
  document.getElementById('modal-view').classList.add('open');
}

// ─── EDIT TAG ─────────────────────────────────
function editTag(id){
  const t=STATE.tags.find(x=>x.id==id);
  if(!t) return;

  document.getElementById('edit-id').value=id;
  document.getElementById('edit-name').value=t.full_name;
  document.getElementById('edit-dept').value=t.department;
  document.getElementById('edit-pos').value=t.position;
  document.getElementById('edit-status').value=t.status||'Active';

  // Show P/No and ID/No fields for Staff category
  const staffFields = document.getElementById('edit-staff-fields');
  const staffFields2 = document.getElementById('edit-staff-fields-2');
  const deptField = document.getElementById('edit-dept').closest('.form-group');

  if (t.category === 'Staff') {
    staffFields.style.display = 'block';
    staffFields2.style.display = 'block';
    deptField.style.display = 'none';
    document.getElementById('edit-pno').value = t.p_number || '';
    document.getElementById('edit-idno').value = t.id_number_value || '';
  } else {
    staffFields.style.display = 'none';
    staffFields2.style.display = 'none';
    deptField.style.display = 'block';
    document.getElementById('edit-pno').value = '';
    document.getElementById('edit-idno').value = '';
  }

  document.getElementById('modal-edit').classList.add('open');
}

async function saveEdit(){
  const idEl = document.getElementById('edit-id');
  const nameEl = document.getElementById('edit-name');
  const deptEl = document.getElementById('edit-dept');
  const posEl = document.getElementById('edit-pos');
  const statusEl = document.getElementById('edit-status');
  const pnoEl = document.getElementById('edit-pno');
  const idnoEl = document.getElementById('edit-idno');

  if (!idEl || !nameEl || !deptEl || !posEl || !statusEl) return;

  const id = idEl.value;
  const t = STATE.tags.find(x => x.id == id);
  if (!t) return;

  const oldName = t.full_name;

  t.full_name = nameEl.value;
  t.department = deptEl.value;
  t.position = posEl.value;
  t.status = statusEl.value;

  // Save P/No and ID/No for Staff category
  if (t.category === 'Staff') {
    t.p_number = pnoEl?.value.trim() || '';
    t.id_number_value = idnoEl?.value.trim() || '';
  }

  t.updated_at = new Date().toISOString();

  try {
    await KSGDb.updateTag(t);
    await loadFromSupabase();
    saveLocal();
    refreshTagDataViews();
    logActivity(`Tag edited: ${oldName} → ${t.full_name} (${t.reference_number}) - Status: ${t.status}`, 'tag_edited');
    closeModal('modal-edit');
    toast('Tag updated successfully!','success');
  }catch(e){
    toast('Failed to update tag: '+e.message, 'error');
  }
}

// ─── DELETE TAG ───────────────────────────────
function deleteTag(id){
  const t=STATE.tags.find(x=>x.id==id);
  if(!t) return;
  STATE.deleteTarget=id;
  document.getElementById('delete-confirm-name').textContent=t.full_name;
  document.getElementById('modal-delete').classList.add('open');
}

async function confirmDelete(){
  const id=STATE.deleteTarget;
  if(!id) return;
  
  try{
    await KSGDb.deleteTag(id);
    STATE.tags=STATE.tags.filter(x=>x.id!==id);
    saveLocal();
    refreshTagDataViews();
    logActivity(`Tag deleted: ${id}`, 'tag_deleted');
    closeModal('modal-delete');
    toast('Tag deleted successfully','success');
  }catch(e){
    toast('Failed to delete tag: '+e.message,'error');
  }
}

// ─── REPRINT TAG ─────────────────────────────
function reprintTag(id){
  viewTag(id);
  setTimeout(()=>{ if(STATE.modalTag) toast('Use the Print or PDF button in the preview.'); },300);
}

// ─── FILTERING ───────────────────────────────
function filterTags(query) {
  // If query is provided, update the search input
  if (query !== undefined) {
    const searchInput = document.querySelector('#page-manage .search-box input');
    if (searchInput) {
      searchInput.value = query;
    }
  }
  
  // Reset to first page when filtering
  STATE.currentPage = 1;
  
  // Apply filters and re-render
  renderManageTable();
}

function applyTagFilters(){
  const q = (document.querySelector('#page-manage .search-box input')?.value || '').toLowerCase();
  const cat = document.getElementById('filter-cat')?.value || '';
  const status = document.getElementById('filter-status')?.value || '';

  const tagsHash = STATE.tags.length + '-' + STATE.tags[0]?.id;
  const cacheKey = `${q}|${cat}|${status}|${tagsHash}`;

  if(filterCache.q === q && filterCache.cat === cat && filterCache.status === status && filterCache.tagsHash === tagsHash){
    return;
  }

  filterCache = { q, cat, status, tagsHash };

  filteredTags = STATE.tags.filter(t=>{
    const matchQ = !q || t.full_name.toLowerCase().includes(q) || t.id_number.toLowerCase().includes(q) || (t.department||'').toLowerCase().includes(q) || t.reference_number.toLowerCase().includes(q);
    const matchCat = !cat || t.category===cat;
    const matchStatus = !status || t.status===status;
    return matchQ && matchCat && matchStatus;
  });
}

function syncSelectedTags(){
  const validIds = new Set(STATE.tags.map((t) => t.id));
  STATE.selectedTagIds = (STATE.selectedTagIds || []).filter((id) => validIds.has(id));
}

function updateBulkButtons() {
  const downloadBtn = document.getElementById('bulk-download-btn');
  const deleteBtn = document.getElementById('bulk-delete-btn');
  const count = (STATE.selectedTagIds || []).length;
  
  if (downloadBtn) {
    downloadBtn.disabled = count === 0;
    downloadBtn.textContent = count ? `📄 Download Selected Tags (${count})` : '📄 Download Selected Tags (PDF)';
  }
  
  if (deleteBtn) {
    deleteBtn.disabled = count === 0;
    deleteBtn.textContent = count ? `🗑️ Delete Selected Tags (${count})` : '🗑️ Delete Selected Tags';
  }
}

function toggleTagSelection(id, checked){
  const selected = new Set(STATE.selectedTagIds || []);
  if (checked) selected.add(id); else selected.delete(id);
  STATE.selectedTagIds = Array.from(selected);
  updateBulkButtons();

  const selectAllCheckbox = document.getElementById('select-all-visible');
  if (selectAllCheckbox) {
    selectAllCheckbox.checked = filteredTags.length > 0 && filteredTags.every((t) => selected.has(t.id));
  }
}

function toggleSelectAll(checked) {
  if(checked){
    filteredTags.forEach(t => {
      if(!STATE.selectedTagIds.includes(t.id)){
        STATE.selectedTagIds.push(t.id);
      }
    });
  } else {
    STATE.selectedTagIds = STATE.selectedTagIds.filter(id => !filteredTags.find(t => t.id === id));
  }
  updateBulkButtons();
}

function toggleSelectVisible(checked) {
  toggleSelectAll(checked);
  renderManageTable();
}

// ─── TABLE RENDERING ─────────────────────────
function renderManageTable(){
  syncSelectedTags();
  applyTagFilters();

  const tbody = document.getElementById('manage-tbody');
  if(!tbody) return;

  const selectedIds = new Set(STATE.selectedTagIds || []);
  const totalVisible = filteredTags.length;
  const tableCountEl = document.getElementById('table-count');
  const navTagCountEl = document.getElementById('nav-tag-count');

  if(tableCountEl) tableCountEl.textContent = `${totalVisible} record${totalVisible !== 1 ? 's' : ''}`;
  if(navTagCountEl) navTagCountEl.textContent = STATE.tags.length;

  const selectAllCheckbox = document.getElementById('select-all-visible');
  if(selectAllCheckbox){
    selectAllCheckbox.checked = totalVisible > 0 && filteredTags.every((t) => selectedIds.has(t.id));
  }

  updateBulkButtons();

  if(!totalVisible){
    tbody.innerHTML = '<tr><td colspan="10"><div class="empty-state"><div class="empty-icon">📋</div><p>No tags found</p></div></td></tr>';
    renderPagination(0);
    return;
  }

  const start = (STATE.currentPage - 1) * STATE.perPage;
  const page = filteredTags.slice(start, start + STATE.perPage);

  const fragment = document.createDocumentFragment();

  for(let i = 0; i < page.length; i++){
    const t = page[i];
    const statusClass = t.status === 'Active' ? 'badge-status-active' : t.status === 'Inactive' ? 'badge-status-inactive' : 'badge-status-expired';

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><input type="checkbox" data-tag-id="${t.id}" ${selectedIds.has(t.id) ? 'checked' : ''} onchange="toggleTagSelection('${t.id}', this.checked)"></td>
      <td>${start + i + 1}</td>
      <td><code style="font-family:'DM Mono',monospace;font-size:0.78rem;color:var(--ksg-gold)">${t.reference_number}</code></td>
      <td><strong>${t.full_name}</strong></td>
      <td>${t.department || '—'}</td>
      <td><span class="badge badge-${(t.category||'').toLowerCase()}">${t.category || ''}</span></td>
      <td><code style="font-size:0.8rem;font-family:'DM Mono',monospace">${t.id_number}</code></td>
      <td>${new Date(t.date_generated).toLocaleDateString('en-GB')}</td>
      <td><span class="badge ${statusClass}">${t.status || 'Active'}</span></td>
      <td>
        <div class="action-btns">
          <button class="btn btn-icon btn-outline btn-sm" onclick="viewTag('${t.id}')" title="View">👁️</button>
          <button class="btn btn-icon btn-outline btn-sm" onclick="editTag('${t.id}')" title="Edit">✏️</button>
          <button class="btn btn-icon btn-outline btn-sm" onclick="reprintTag('${t.id}')" title="Reprint">🖨️</button>
          <button class="btn btn-icon btn-danger btn-sm" onclick="deleteTag('${t.id}')" title="Delete">🗑️</button>
        </div>
      </td>`;
    fragment.appendChild(tr);
  }

  tbody.innerHTML = '';
  tbody.appendChild(fragment);
  renderPagination(totalVisible);
}

function renderPagination(total){
  const pages=Math.ceil(total/STATE.perPage);
  const el=document.getElementById('pagination');

  if(pages<=1){
    el.innerHTML='';
    return;
  }

  const fragment = document.createDocumentFragment();
  for(let i=1;i<=pages;i++){
    const btn = document.createElement('button');
    btn.className = `pg-btn${i===STATE.currentPage?' active':''}`;
    btn.textContent = i;
    btn.onclick = () => goPage(i);
    fragment.appendChild(btn);
  }
  el.innerHTML = '';
  el.appendChild(fragment);
}

function goPage(p){ 
  STATE.currentPage=p; 
  renderManageTable(); 
}

function refreshManageTags(){
  renderManageTable();
}

 
// ─── DELETE SELECTED TAGS ────────────────────
async function deleteSelectedTags() {
  const selectedIds = STATE.selectedTagIds || [];
  
  console.log('Selected tag IDs to delete:', selectedIds);
  
  if(selectedIds.length === 0){
    toast('Please select at least one tag to delete.', 'warning');
    return;
  }

  // Confirm deletion
  if(!confirm(`Are you sure you want to delete ${selectedIds.length} tag${selectedIds.length !== 1 ? 's' : ''}? This action cannot be undone.`)){
    return;
  }

  try{
    // Delete from Supabase if enabled
    if (window.KSGDb && window.KSGDb.enabled()) {
      console.log('Calling KSGDb.deleteTags');
      await KSGDb.deleteTags(selectedIds);
      console.log('Deleted from Supabase');
    }
    
    // Always update local state
    console.log('Updating local state');
    STATE.tags = STATE.tags.filter(t => !selectedIds.includes(t.id));
    
    // Clear selected IDs
    STATE.selectedTagIds = [];
    
    // Save to localStorage
    saveLocal();
    
    // Refresh views
    console.log('Refreshing views');
    refreshTagDataViews();
    
    logActivity(`Deleted ${selectedIds.length} tag(s)`, 'tags_deleted');
    toast(`✅ Deleted ${selectedIds.length} tag${selectedIds.length !== 1 ? 's' : ''} successfully!`, 'success');
    
  }catch(e){
    console.error('Error in deleteSelectedTags:', e);
    toast('Failed to delete tags: ' + (e.message || 'Unknown error'), 'error');
  }
}

// ─── DOWNLOAD SELECTED TAGS ──────────────────
async function downloadSelectedTags() {
  const selectedIds = STATE.selectedTagIds || [];
  
  if(selectedIds.length === 0){
    toast('Please select at least one tag to download.', 'warning');
    return;
  }

  const btn = document.getElementById('bulk-download-btn');
  const originalText = btn?.textContent;
  if(btn){
    btn.disabled = true;
    btn.textContent = '⏳ Generating PDF...';
  }

  try{
    // Get selected tags
    const selectedTags = STATE.tags.filter(t => selectedIds.includes(t.id));
    
    if(selectedTags.length === 0){
      toast('Selected tags not found.', 'error');
      return;
    }

    // Get jsPDF library
    const JsPDF = window.jspdf?.jsPDF || window.jsPDF;
    if(!JsPDF) throw new Error('PDF library failed to load. Check your internet connection.');
    
    if(!window.html2canvas) throw new Error('Image capture library failed to load.');

    // Create PDF - Landscape A4 for 3x3 grid
    const pdf = new JsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    const pageWidth = pdf.internal.pageSize.getWidth();  // 297mm
    const pageHeight = pdf.internal.pageSize.getHeight(); // 210mm
    
    // Grid settings: 3 columns, 3 rows
    const cols = 3;
    const rows = 3;
    const margin = 10; // mm
    const colGap = 8;  // Gap between columns
    const rowGap = 8;  // Gap between rows
    
    // Calculate tag dimensions
    const availableWidth = pageWidth - (margin * 2);
    const availableHeight = pageHeight - (margin * 2);
    const tagWidth = (availableWidth - (colGap * (cols - 1))) / cols;
    const estimatedTagHeight = (tagWidth / 510) * 317; // Maintain aspect ratio of 510x317

    // Create temporary container for rendering tags
    const tempContainer = document.createElement('div');
    tempContainer.style.cssText = 'position:fixed;left:-9999px;top:-9999px;width:510px;height:317px;';
    document.body.appendChild(tempContainer);

    // Store canvas images for layout
    const canvases = [];
    let firstCanvasHeight = 0;

    // Process each selected tag and capture to canvas
    for(let i = 0; i < selectedTags.length; i++){
      const t = selectedTags[i];
      
      // Build tag HTML
      const tagHTML = buildTagHTML(t);
      tempContainer.innerHTML = tagHTML;
      
      // Wait for rendering
      await new Promise(r => setTimeout(r, 50));
      
      // Capture tag element
      const tagEl = tempContainer.querySelector('.id-tag');
      if(!tagEl) continue;

      const canvas = await html2canvas(tagEl, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
        allowTaint: true,
        logging: false,
        width: 510,
        height: 317,
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

      canvases.push(canvas);
      
      // Calculate height from first canvas to maintain aspect ratio
      if(i === 0){
        firstCanvasHeight = (canvas.height / canvas.width) * tagWidth;
      }
    }

    // Arrange canvases in 3x3 grid on PDF pages
    const tagsPerPage = cols * rows; // 9 tags per page
    for(let i = 0; i < canvases.length; i++){
      // Add new page if needed (except for the first tag)
      if(i > 0 && i % tagsPerPage === 0){
        pdf.addPage();
      }

      // Calculate position in grid
      const positionOnPage = i % tagsPerPage;
      const colIndex = positionOnPage % cols;
      const rowIndex = Math.floor(positionOnPage / cols);

      // Calculate x and y coordinates
      const x = margin + (colIndex * (tagWidth + colGap));
      const y = margin + (rowIndex * (firstCanvasHeight + rowGap));

      // Add image to PDF
      const imgData = canvases[i].toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', x, y, tagWidth, firstCanvasHeight);
    }

    // Clean up
    document.body.removeChild(tempContainer);

    // Generate filename with count
    const timestamp = new Date().toISOString().slice(0, 10);
    const filename = `KSG-Tags-Batch-${selectedTags.length}-${timestamp}.pdf`;
    
    pdf.save(filename);
    
    logActivity(`Downloaded ${selectedTags.length} tag(s) as PDF (${Math.ceil(selectedTags.length / 9)} page${Math.ceil(selectedTags.length / 9) !== 1 ? 's' : ''})`, 'tags_downloaded');
    toast(`✅ Downloaded ${selectedTags.length} tag${selectedTags.length !== 1 ? 's' : ''} in ${Math.ceil(selectedTags.length / 9)} page${Math.ceil(selectedTags.length / 9) !== 1 ? 's' : ''}!`, 'success');
    
  }catch(e){
    toast('Failed to download tags: ' + (e.message || 'Unknown error'), 'error');
    console.error('Download error:', e);
  } finally {
    if(btn){
      btn.disabled = selectedIds.length === 0;
      btn.textContent = originalText || '📄 Download Selected Tags (PDF)';
    }
  }
}

// Export functions for global access
window.viewTag = viewTag;
window.editTag = editTag;
window.saveEdit = saveEdit;
window.deleteTag = deleteTag;
window.confirmDelete = confirmDelete;
window.reprintTag = reprintTag;
window.filterTags = filterTags;
window.applyTagFilters = applyTagFilters;
window.toggleTagSelection = toggleTagSelection;
window.toggleSelectAll = toggleSelectAll;
window.toggleSelectVisible = toggleSelectVisible;
window.renderManageTable = renderManageTable;
window.goPage = goPage;
window.refreshManageTags = refreshManageTags;
window.buildTagHTML = buildTagHTML;
window.downloadSelectedTags = downloadSelectedTags;
window.deleteSelectedTags = deleteSelectedTags;
 
