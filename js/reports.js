/* ════════════════════════════════════════════
   KSG TAG GENERATOR — REPORTS PAGE
   Analytics and reporting functions
   ════════════════════════════════════════════ */

// ─── REPORT RENDERING ─────────────────────────
function renderReports(){
  const stats = getTagStats();
  renderCategoryChart('rpt-category', stats.categoryCounts);

  const deptEntries = Object.entries(stats.departmentCounts)
    .sort((a,b) => b[1] - a[1])
    .slice(0, 6);
  const dColors = ['#C9A84C','#1A3A6B','#2ECC71','#E74C3C','#9B59B6','#3498DB'];
  const maxD = Math.max(...deptEntries.map(([_, count]) => count), 1);

  document.getElementById('rpt-dept').innerHTML = deptEntries.map(([dept, count], i) => `
    <div class="chart-bar-item">
      <div class="chart-bar-label" style="width:90px;font-size:0.75rem">${dept.split(' ')[0]}</div>
      <div class="chart-bar-track"><div class="chart-bar-fill" style="width:${(count / maxD) * 100}%;background:${dColors[i % dColors.length]}"></div></div>
      <div class="chart-bar-val">${count}</div>
    </div>
  `).join('');

  const days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - 6 + i);
    return d;
  });

  const dateCounts = stats.dateCounts;
  const trendValues = days.map(d => dateCounts[d.toDateString()] || 0);
  const maxT = Math.max(...trendValues, 1);

  document.getElementById('rpt-trend').innerHTML = days.map((d, i) => {
    const count = trendValues[i];
    return `
      <div class="chart-bar-item">
        <div class="chart-bar-label" style="font-size:0.75rem">${d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric' })}</div>
        <div class="chart-bar-track"><div class="chart-bar-fill" style="width:${(count / maxT) * 100}%;background:var(--ksg-gold)"></div></div>
        <div class="chart-bar-val">${count}</div>
      </div>
    `;
  }).join('');

  document.getElementById('report-stats').innerHTML = `
    <div class="stat-card gold"><div class="stat-icon">🏷️</div><div class="stat-value">${stats.total}</div><div class="stat-label">Total Tags</div></div>
    <div class="stat-card green"><div class="stat-icon">✅</div><div class="stat-value">${stats.active}</div><div class="stat-label">Active</div></div>
    <div class="stat-card blue"><div class="stat-icon">🏢</div><div class="stat-value">${stats.departments}</div><div class="stat-label">Departments</div></div>
    <div class="stat-card red"><div class="stat-icon">📅</div><div class="stat-value">${stats.thisMonth}</div><div class="stat-label">This Month</div></div>`;
}

function refreshReports(){
  renderReports();
}

// Export functions for global access
window.renderReports = renderReports;
window.refreshReports = refreshReports;
