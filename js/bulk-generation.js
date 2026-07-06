/* ════════════════════════════════════════════
   KSG TAG GENERATOR — BULK GENERATION PAGE
   CSV/Excel bulk upload and tag generation
   ════════════════════════════════════════════ */

// ─── DRAG AND DROP HANDLERS ───────────────────
function handleDragOver(e){ 
  e.preventDefault(); 
  document.getElementById('drop-zone').classList.add('dragover'); 
}

function handleDragLeave(){ 
  document.getElementById('drop-zone').classList.remove('dragover'); 
}

function handleDrop(e){ 
  e.preventDefault(); 
  document.getElementById('drop-zone').classList.remove('dragover'); 
  const f=e.dataTransfer.files[0]; 
  if(f) processBulkFile(f); 
}

function handleFileUpload(e){ 
  const f=e.target.files[0]; 
  if(f) processBulkFile(f); 
}

// ─── FILE PROCESSING ───────────────────────────
function normalizeBulkHeader(value){
  return String(value || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '');
}

function getBulkRowValue(row, aliases){
  const keys = Object.keys(row || {});
  for (const alias of aliases) {
    const normalizedAlias = normalizeBulkHeader(alias);
    const match = keys.find((key) => normalizeBulkHeader(key) === normalizedAlias);
    if (match !== undefined) return row[match];
  }
  return '';
}

function processBulkFile(file){
  if(!file.name.match(/\.(csv|xlsx|xls|xlsm)$/i)){ 
    toast('Please upload a valid CSV or Excel file (.csv, .xlsx, .xls)', 'error', 5000); 
    return; 
  }

  if (/\.(xlsx|xls|xlsm)$/i.test(file.name)) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: '' });
        STATE.bulkData = rows;
        renderBulkPreview(rows);
      } catch (err) {
        console.error('Excel read error:', err);
        toast('Could not read Excel file. Please try a simple worksheet or use CSV.', 'error', 6000);
      }
    };
    reader.onerror = () => toast('Failed to read file. Please try again.', 'error', 5000);
    reader.readAsArrayBuffer(file);
    return;
  }

  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete(results){
      if(results.errors && results.errors.length > 0){
        console.warn('CSV parse warnings:', results.errors);
      }
      STATE.bulkData = results.data || [];
      renderBulkPreview(results.data || []);
    },
    error: (err) => {
      console.error('CSV parse error:', err);
      toast('Failed to parse CSV file. Please check the file format.', 'error', 6000);
    }
  });
}

// ─── PREVIEW RENDERING ─────────────────────────
function renderBulkPreview(data){
  const tbody=document.getElementById('bulk-preview-body');
  document.getElementById('bulk-count').textContent=`${data.length} record${data.length !== 1 ? 's' : ''}`;
  document.getElementById('bulk-gen-actions').style.display='flex';
  const btnGen=document.getElementById('btn-bulk-gen');
  
  // Check if we have at least full name and category
  const hasRequiredData = data.some(row => {
    const n = getBulkRowValue(row, ['full_name','full name','fullname','name']);
    const cat = getBulkRowValue(row, ['category']);
    return n && cat;
  });

  if(!data.length){
    toast('No data found in file. Please check your file.', 'error', 5000);
    btnGen.disabled=true;
    return;
  }
  
  if(!hasRequiredData){ 
    toast('Missing required data: Please ensure your file has full name and category columns.', 'error', 6000); 
    btnGen.disabled=true; 
    return; 
  }

  btnGen.disabled=false;

  tbody.innerHTML=data.map((row)=>{
    const n=getBulkRowValue(row, ['full_name','full name','fullname','name']);
    const d=getBulkRowValue(row, ['department']);
    const cat=getBulkRowValue(row, ['category']);
    const pno=getBulkRowValue(row, ['p_no','p/no','pno','pnumber','p_number']);
    const idno=getBulkRowValue(row, ['id_no','id/no','idno','idnumber','id_number_value']);
    return `<tr><td>${n}</td><td>${d || '—'}</td><td><span class="badge badge-${(cat||'').toLowerCase()}">${cat}</span></td><td>${pno || '—'}</td><td>${idno || '—'}</td></tr>`;
  }).join('');
}

// ─── BULK GENERATION ─────────────────────────
async function generateBulk(){
  if(!STATE.bulkData?.length){
    toast('No data to generate. Please upload a CSV or Excel file first.', 'error', 5000);
    return;
  }

  const prog=document.getElementById('bulk-progress'); 
  const btnGen=document.getElementById('btn-bulk-gen');
  prog.style.display='block';
  const fill=document.getElementById('progress-fill');
  const status=document.getElementById('bulk-status');
  btnGen.disabled=true;
  btnGen.textContent='⏳ Generating Tags...';

  let gen=0;
  let skipped=0;
  let skippedReasons = { duplicate: 0, invalid: 0 };
  const total=STATE.bulkData.length;
  const batch=[];

  try {
    for (let i=0; i<total; i++) {
      const row=STATE.bulkData[i];
      const n=getBulkRowValue(row, ['full_name','full name','fullname','name']);
      const d=getBulkRowValue(row, ['department']);
      const p=getBulkRowValue(row, ['position']);
      const cat=getBulkRowValue(row, ['category']);
      const id=getBulkRowValue(row, ['id_number','id number','id']);
      const pno=getBulkRowValue(row, ['p_no','p/no','pno','pnumber','p_number']);
      const idno=getBulkRowValue(row, ['id_no','id/no','idno','idnumber','id_number_value']);

      if(n && cat){
        if(cat !== 'Staff' && !d){
          skipped++;
          skippedReasons.invalid++;
        } else {
          const generatedId = id || `${Date.now()}-${i}`;
          if(!STATE.settings.dup || !STATE.tags.find(t => t.id_number === generatedId)){
            const tag = {
              id: KSGDb.enabled() ? undefined : `${Date.now()}-${i}-${Math.random().toString(36).substr(2, 9)}`, // Unique ID even without DB
              reference_number: genRef(),
              full_name: n,
              department: cat === 'Staff' ? '' : (d || ''), // No department needed for Staff
              position: p || '',
              category: cat || '',
              id_number: generatedId,
              p_number: cat === 'Staff' ? (pno || '') : '',
              id_number_value: cat === 'Staff' ? (idno || '') : '',
              status: 'Active',
              date_generated: new Date().toISOString(),
              created_by: STATE.user?.email || 'system'
            };
            batch.push(tag);
            gen++;
          } else {
            skipped++;
            skippedReasons.duplicate++;
          }
        }
      } else {
        skipped++;
        skippedReasons.invalid++;
      }

      fill.style.width = `${((i+1)/total)*100}%`; 
      status.textContent = `Processing ${i+1}/${total}…`;
      await new Promise(resolve => setTimeout(resolve, 20));
    }

    if(KSGDb.enabled() && batch.length){
      await KSGDb.insertTags(batch, STATE.user?.email || 'system', STATE.user?.id || 'system');
      await loadFromSupabase();
    } else if(batch.length){
      STATE.tags.unshift(...batch); // Add new tags to beginning of array
      saveLocal();
    }

    fill.style.width='100%';
    if (gen > 0) {
      status.textContent = `✓ Successfully generated ${gen} tag${gen !== 1 ? 's' : ''}!`;
      
      // Reset table pagination to first page
      STATE.currentPage = 1;
      
      refreshTagDataViews();
      
      // Navigate to manage tags page
      const navItems = document.querySelectorAll('.nav-item');
      let manageBtn = null;
      navItems.forEach(item => {
        if(item.getAttribute('onclick')?.includes("'manage'")) {
          manageBtn = item;
        }
      });
      
      if (manageBtn) {
        gotoPage('manage', manageBtn);
      }
      
      // Build success message
      let successMsg = `✅ Successfully generated ${gen} tag${gen !== 1 ? 's' : ''}!`;
      if(skipped > 0){
        successMsg += ` (Skipped ${skipped}: ${skippedReasons.duplicate} duplicate${skippedReasons.duplicate !== 1 ? 's' : ''}, ${skippedReasons.invalid} invalid)`;
      }
      toast(successMsg,'success', 6000);
      logActivity(`Bulk generation: ${gen} tags from CSV/Excel file - Processed: ${total} records - Skipped: ${skipped}`, 'bulk_upload');
    } else {
      status.textContent='❌ No valid tags generated';
      let errorMsg = '❌ No valid tags were generated.';
      if(skipped > 0){
        errorMsg += ` Check your file: ${skippedReasons.duplicate} duplicate${skippedReasons.duplicate !== 1 ? 's' : ''}, ${skippedReasons.invalid} invalid row${skippedReasons.invalid !== 1 ? 's' : ''}.`;
      }
      errorMsg += ' Ensure you have full name and category columns, and department for non-Staff tags.';
      toast(errorMsg,'error', 8000);
      logActivity(`Bulk generation produced no valid tags - Processed: ${total} records - Skipped: ${skipped}`, 'bulk_upload');
    }
  } catch(e) {
    console.error('Bulk generation error:', e); // Log the full error to console
    status.textContent='❌ Error during generation';
    let errorMsg = '❌ Bulk generation failed: ';
    if(e.message){
      errorMsg += e.message;
    } else {
      errorMsg += 'Unknown error occurred. Check browser console for details.';
    }
    toast(errorMsg,'error', 10000);
    logActivity(`Bulk generation failed: ${e.message || 'Unknown error'} - Attempted: ${gen}/${total} tags`, 'bulk_upload');
  } finally {
    btnGen.disabled=false;
    btnGen.textContent='⚡ Generate All Tags in Bulk';
  }
}

function clearBulk(){ 
  STATE.bulkData=[]; 
  document.getElementById('bulk-preview-body').innerHTML='<tr><td colspan="5"><div class="empty-state"><div class="empty-icon">📤</div><p>Upload a file to preview data</p></div></td></tr>'; 
  document.getElementById('bulk-count').textContent='0 records'; 
  document.getElementById('bulk-progress').style.display='none'; 
  document.getElementById('bulk-file').value=''; 
}

function downloadTemplate(){
  const csv='full_name,department,category,p_no,id_no\nJohn Doe,ICT Department,Staff,12345,987654\nJane Smith,Finance & Accounts,Attachee,,\nBob Williams,Human Resources,Intern,,\n';
  const a=document.createElement('a'); 
  a.href='data:text/csv;charset=utf-8,'+encodeURIComponent(csv); 
  a.download='KSG_Bulk_Template.csv'; 
  a.click();
}

// Export functions for global access
window.handleDragOver = handleDragOver;
window.handleDragLeave = handleDragLeave;
window.handleDrop = handleDrop;
window.handleFileUpload = handleFileUpload;
window.generateBulk = generateBulk;
window.clearBulk = clearBulk;
window.downloadTemplate = downloadTemplate;
