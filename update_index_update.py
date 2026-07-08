
with open("index.html", "r", encoding="utf-8") as f:
    content = f.read()

# Step 1: Add id to footer
content = content.replace(
    '<footer style="position: sticky; bottom: 0; margin-left: var(--sidebar-w); padding: 8px; text-align: center; font-size: 0.75rem; color: var(--ksg-gold); border-top: 1px solid var(--ksg-navy); background: var(--ksg-dark); z-index: 1000;">',
    '<footer id="main-footer" style="position: sticky; bottom: 0; margin-left: var(--sidebar-w); padding: 8px; text-align: center; font-size: 0.75rem; color: var(--ksg-gold); border-top: 1px solid var(--ksg-navy); background: var(--ksg-dark); z-index: 1000;">'
)

# Step 2: Update bootAuth function
old_boot_auth = """// Boot auth
(async function bootAuth(){
  // Try to restore user from local storage first
  const storedUser = localStorage.getItem('ksg_user');
  if (storedUser) {
    try {
      STATE.user = JSON.parse(storedUser);
      // Load data from supabase if possible
      if (KSGDb.enabled()) {
        await loadFromSupabase();
      }
      // Show app
      document.getElementById('auth-screen').style.display='none';
      document.getElementById('app').style.display='block';
      applySettings();
      updateUserUI();
      refreshTagDataViews();
      return;
    } catch (e) {
      console.error('Failed to restore session:', e);
    }
  }
  
  // Show auth screen
  STATE.user = null;
  localStorage.removeItem('ksg_user');
  document.getElementById('auth-screen').style.display='flex';
  document.getElementById('app').style.display='none';
})();"""

new_boot_auth = """// Boot auth
(async function bootAuth(){
  // Try to restore user from local storage first
  const storedUser = localStorage.getItem('ksg_user');
  if (storedUser) {
    try {
      STATE.user = JSON.parse(storedUser);
      // Load data from supabase if possible
      if (KSGDb.enabled()) {
        await loadFromSupabase();
      }
      // Show app
      document.getElementById('auth-screen').style.display='none';
      document.getElementById('app').style.display='block';
      document.getElementById('main-footer').style.display='block';
      applySettings();
      updateUserUI();
      refreshTagDataViews();
      return;
    } catch (e) {
      console.error('Failed to restore session:', e);
    }
  }
  
  // Show auth screen
  STATE.user = null;
  localStorage.removeItem('ksg_user');
  document.getElementById('auth-screen').style.display='flex';
  document.getElementById('app').style.display='none';
  document.getElementById('main-footer').style.display='none';
})();"""

content = content.replace(old_boot_auth, new_boot_auth)

with open("index.html", "w", encoding="utf-8") as f:
    f.write(content)

print("Updated index.html!")
