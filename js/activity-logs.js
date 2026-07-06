/* ════════════════════════════════════════════
   KSG TAG GENERATOR — ACTIVITY LOGS PAGE
   Activity logging and export functions
   ════════════════════════════════════════════ */

// ─── ACTIVITY LOGS RENDERING ───────────────────
function renderLogs(){
  const el = document.getElementById('logs-body');
  const searchTerm = document.getElementById('logs-search')?.value.toLowerCase() || '';

  // Update stats
  document.getElementById('log-total').textContent = STATE.logs.length;
  document.getElementById('log-role').textContent = (STATE.user?.role || 'admin').charAt(0).toUpperCase() + (STATE.user?.role || 'admin').slice(1);

  const today = new Date().toDateString();
  const todayLogs = STATE.logs.filter(l => new Date(l.time).toDateString() === today);
  document.getElementById('log-today').textContent = todayLogs.length;

  const uniqueUsers = [...new Set(STATE.logs.map(l => l.user))].length;
  document.getElementById('log-users').textContent = uniqueUsers;

  // Show/hide clear button based on role
  const clearBtn = document.getElementById('clear-logs-btn');
  if(clearBtn){
    if(STATE.user?.role === 'superadmin'){
      clearBtn.style.display = 'block';
      clearBtn.title = 'Clear all activity logs (Superadmin only)';
    } else {
      clearBtn.style.display = 'none';
    }
  }

  if(!STATE.logs.length){ 
    el.innerHTML = '<div class="empty-state"><div class="empty-icon">📝</div><p>No activity logged yet</p></div>'; 
    return; 
  }

  // Filter based on search
  let filteredLogs = STATE.logs;
  if(searchTerm){
    filteredLogs = STATE.logs.filter(l => 
      l.msg.toLowerCase().includes(searchTerm) || 
      l.user.toLowerCase().includes(searchTerm) ||
      l.action.toLowerCase().includes(searchTerm)
    );
  }

  if(!filteredLogs.length){
    el.innerHTML = '<div class="empty-state" style="padding: 40px;"><p>No logs matching your search</p></div>';
    return;
  }

  // Display logs with icons based on action type
  const actionIcons = {
    'login': '🔓', 'logout': '🔐', 'tag_generated': '🏷️', 'tag_edited': '✏️', 
    'tag_deleted': '🗑️', 'bulk_upload': '📤', 'settings_changed': '⚙️', 
    'logs_cleared': '🧹', 'export': '📥', 'general': '📝', 'security_alert': '⚠️'
  };

  el.innerHTML = filteredLogs.slice(0, 200).map(l => {
    const icon = actionIcons[l.action] || '📝';
    const time = new Date(l.time).toLocaleString();
    const timeAgo = getTimeAgo(new Date(l.time));
    return `<div class="log-item"><div class="log-dot" style="background: var(--ksg-gold); font-size: 10px; display: flex; align-items: center; justify-content: center; color: white; text-align: center; padding: 1px;">${icon}</div><div style="flex:1;"><div class="log-text"><strong>${l.action.replace(/_/g, ' ').toUpperCase()}</strong> — ${l.msg}</div><div class="log-time">${time} (${timeAgo}) · ${l.user}</div></div></div>`;
  }).join('');
}

function getTimeAgo(date){
  const seconds = Math.floor((new Date() - date) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + 'y ago';
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + 'mo ago';
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + 'd ago';
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + 'h ago';
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + 'm ago';
  return Math.floor(seconds) + 's ago';
}

function exportLogs(){
  if(!STATE.logs.length){
    toast('No logs to export.', 'error');
    return;
  }

  const csv = [
    ['Time', 'User', 'Action', 'Message'].join(','),
    ...STATE.logs.map(l => [
      new Date(l.time).toLocaleString(),
      l.user,
      l.action,
      '"' + l.msg.replace(/"/g, '""') + '"'
    ].join(','))
  ].join('\n');

  const blob = new Blob([csv], {type: 'text/csv'});
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `KSG-Activity-Logs-${new Date().toISOString().slice(0,10)}.csv`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);

  logActivity(`Logs exported (${STATE.logs.length} entries)`, 'export');
  toast('Logs exported successfully! 📥', 'success');
}

function clearLogs(){
  if(STATE.user?.role !== 'superadmin'){
    toast('Only superadmins can clear logs.', 'error');
    return;
  }
  
  if(!confirm('Are you sure you want to clear all activity logs? This cannot be undone.')){
    return;
  }

  STATE.logs = [];
  saveLocal();
  renderLogs();
  logActivity('Activity logs cleared by superadmin', 'logs_cleared');
  toast('Activity logs cleared.', 'success');
}

function refreshActivityLogs(){
  renderLogs();
}

// Add search listener for logs with debounce
document.addEventListener('DOMContentLoaded', () => {
  const logsSearch = document.getElementById('logs-search');
  if(logsSearch){
    let debounceTimer;
    logsSearch.addEventListener('input', () => {
      if(debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => renderLogs(), 300);
    });
  }
});

// Export functions for global access
window.renderLogs = renderLogs;
window.exportLogs = exportLogs;
window.clearLogs = clearLogs;
window.refreshActivityLogs = refreshActivityLogs;
