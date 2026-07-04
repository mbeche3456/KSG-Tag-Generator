/**
 * Supabase client configuration for KSG Tag Generator.
 *
 * SECURITY NOTE: For production, do NOT hardcode credentials.
 * Enter them in Settings → Supabase Integration instead.
 *
 * For development, you can add defaults below from:
 *   Project Settings → API → Project URL & anon public key
 */
window.KSGSupabase = (function () {
  // Remove hardcoded credentials for production security
  const DEFAULT_URL = '';
  const DEFAULT_ANON_KEY = '';

  let client = null;

  function getCredentials() {
    const url =
      localStorage.getItem('ksg_sb_url') ||
      DEFAULT_URL ||
      '';
    const key =
      localStorage.getItem('ksg_sb_key') ||
      DEFAULT_ANON_KEY ||
      '';
    return { url: url.trim(), key: key.trim() };
  }

  function init(url, key) {
    const creds = {
      url: (url || getCredentials().url).trim(),
      key: (key || getCredentials().key).trim(),
    };
    if (!creds.url || !creds.key) {
      client = null;
      return null;
    }
    if (!window.supabase?.createClient) {
      console.error('Supabase JS library not loaded.');
      return null;
    }
    client = window.supabase.createClient(creds.url, creds.key);
    return client;
  }

  function getClient() {
    if (!client) init();
    return client;
  }

  function isConfigured() {
    const { url, key } = getCredentials();
    return !!(url && key);
  }

  function isConnected() {
    return !!client;
  }

  return { init, getClient, isConfigured, isConnected, getCredentials };
})();

window.KSGDb = (function () {
  function enabled() {
    return KSGSupabase.isConfigured();
  }

  function getClient() {
    return KSGSupabase.getClient();
  }

  async function loadAll() {
    const client = getClient();
    if (!client) return { tags: [], logs: [], settings: {} };

    const [tagsRes, logsRes, settingsRes] = await Promise.all([
      client.from('tags').select('*').order('date_generated', { ascending: false }),
      client.from('activity_logs').select('*').order('time', { ascending: false }).limit(500),
      client.from('app_settings').select('*').eq('id', 'default').single()
    ]);

    return {
      tags: tagsRes.data || [],
      logs: logsRes.data || [],
      settings: settingsRes.data || {}
    };
  }

  async function insertTag(tag, userEmail, userId) {
    const client = getClient();
    const { data, error } = await client.from('tags').insert({
      ...tag,
      created_by: userId,
      created_by_email: userEmail
    }).select().single();
    if (error) throw error;
    return data;
  }

  async function insertTags(tags, userEmail, userId) {
    const client = getClient();
    const tagsWithCreator = tags.map(t => ({
      ...t,
      created_by: userId,
      created_by_email: userEmail
    }));
    const { data, error } = await client.from('tags').insert(tagsWithCreator).select();
    if (error) throw error;
    return data || [];
  }

  async function updateTag(tag) {
    const client = getClient();
    const { data, error } = await client.from('tags').update(tag).eq('id', tag.id).select().single();
    if (error) throw error;
    return data;
  }

  async function deleteTag(id) {
    const client = getClient();
    const { error } = await client.from('tags').delete().eq('id', id);
    if (error) throw error;
  }

  async function deleteAllTags() {
    const client = getClient();
    const { error } = await client.from('tags').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (error) throw error;
  }

  async function insertLog(msg, userEmail, userId, action) {
    const client = getClient();
    const { error } = await client.from('activity_logs').insert({
      msg,
      user_email: userEmail
    });
    if (error) console.warn('Log insert failed:', error.message);
  }

  async function clearLogs(userRole) {
    const client = getClient();
    if (userRole !== 'superadmin') throw new Error('Only superadmins can clear logs');
    const { error } = await client.from('activity_logs').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (error) throw error;
  }

  async function upsertSettings(settings) {
    const client = getClient();
    const { error } = await client.from('app_settings').upsert(settings).eq('id', 'default');
    if (error) throw error;
  }

  async function getProfile(userId) {
    const client = getClient();
    const { data, error } = await client.from('profiles').select('*').eq('id', userId).single();
    if (error) throw error;
    return data;
  }

  async function getPendingUsers() {
    const client = getClient();
    const { data, error } = await client.from('profiles').select('*').eq('status', 'pending');
    if (error) throw error;
    return data || [];
  }

  async function updateUserStatus(userId, status) {
    const client = getClient();
    const { data, error } = await client.from('profiles').update({ status }).eq('id', userId).select().single();
    if (error) throw error;
    return data;
  }

  async function testConnection() {
    try {
      const client = getClient();
      const { error } = await client.from('tags').select('id').limit(1);
      return { ok: !error, message: error ? error.message : 'Connected' };
    } catch (e) {
      return { ok: false, message: e.message };
    }
  }

  return {
    enabled,
    loadAll,
    insertTag,
    insertTags,
    updateTag,
    deleteTag,
    deleteAllTags,
    insertLog,
    clearLogs,
    upsertSettings,
    getProfile,
    getPendingUsers,
    updateUserStatus,
    testConnection
  };
})();
