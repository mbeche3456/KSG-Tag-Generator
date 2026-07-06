/* ════════════════════════════════════════════
   KSG TAG GENERATOR — DASHBOARD PAGE
   Dashboard statistics and charts
   ════════════════════════════════════════════ */

// ─── CONSTANTS ─────────────────────────────────
const TAG_CATEGORIES = ['Staff','Intern','Attachee','Visitor','Student','Trainer'];

// ─── DASHBOARD FUNCTIONS ───────────────────────
function summarizeTagData(tags = STATE.tags){
  const now = new Date();
  const todayKey = now.toDateString();
  const month = now.getMonth();
  const year = now.getFullYear();

  const categoryCounts = {};
  const departmentCounts = {};
  const dateCounts = {};
  let active = 0;
  let today = 0;
  let thisMonth = 0;

  tags.forEach(t => {
    if(!t.status || t.status === 'Active') active++;

    const generatedAt = new Date(t.date_generated);
    const dateKey = generatedAt.toDateString();

    if(dateKey === todayKey) today++;
    if(generatedAt.getMonth() === month && generatedAt.getFullYear() === year) thisMonth++;

    const category = t.category || 'Unknown';
    categoryCounts[category] = (categoryCounts[category] || 0) + 1;

    if(t.department) {
      departmentCounts[t.department] = (departmentCounts[t.department] || 0) + 1;
    }

    dateCounts[dateKey] = (dateCounts[dateKey] || 0) + 1;
  });

  return {
    total: tags.length,
    active,
    today,
    thisMonth,
    departments: Object.keys(departmentCounts).length,
    categoryCounts,
    departmentCounts,
    dateCounts,
  };
}

function getTagStats(tags = STATE.tags){
  return summarizeTagData(tags);
}

function updateDashboard(){
  const stats = getTagStats();

  document.getElementById('stat-total').textContent = stats.total;
  document.getElementById('stat-active').textContent = stats.active;
  document.getElementById('stat-today').textContent = stats.today;
  document.getElementById('nav-tag-count').textContent = stats.total;

  const tbody = document.getElementById('recent-tags-body');
  const recent = STATE.tags.slice(0, 5);

  if(!recent.length){
    tbody.innerHTML = '<tr><td colspan="4"><div class="empty-state"><div class="empty-icon">🏷️</div><p>No tags generated yet</p></div></td></tr>';
  } else {
    tbody.innerHTML = recent.map(t => `
      <tr>
        <td><strong>${t.full_name}</strong></td>
        <td><span class="badge badge-${(t.category||'').toLowerCase()}">${t.category||''}</span></td>
        <td>${t.department||'—'}</td>
        <td>${new Date(t.date_generated).toLocaleDateString('en-GB')}</td>
      </tr>
    `).join('');
  }

  renderCategoryChart('dash-category-chart', stats.categoryCounts);
}

function renderCategoryChart(elId, counts = {}){
  const cats = TAG_CATEGORIES;
  const colors = ['#1A3A6B','#27AE60','#8E44AD','#B7770D','#2980B9','#922B21'];
  const values = cats.map(c => counts[c] || 0);
  const max = Math.max(...values, 1);
  const el = document.getElementById(elId);

  if(!el) return;

  el.innerHTML = cats.map((c, i) => `
    <div class="chart-bar-item">
      <div class="chart-bar-label">${c}</div>
      <div class="chart-bar-track"><div class="chart-bar-fill" style="width:${(values[i] / max) * 100}%;background:${colors[i]}"></div></div>
      <div class="chart-bar-val">${values[i]}</div>
    </div>
  `).join('');
}

function refreshDashboard(){
  updateDashboard();
}

// Export functions for global access
window.refreshDashboard = refreshDashboard;
window.updateDashboard = updateDashboard;
window.getTagStats = getTagStats;
