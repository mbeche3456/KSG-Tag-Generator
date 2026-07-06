/**
 * Supabase data layer for KSG Tag Generator.
 * Maps DB rows ↔ app STATE shape.
 */
window.KSGDb = (function () {
  const cache = {
    tags: null,
    logs: null,
    settings: null,
    timestamp: null
  };
  const CACHE_DURATION = 30000; // 30 seconds

  function db() {
    return window.KSGSupabase.getClient();
  }

  function enabled() {
    return window.KSGSupabase.isConfigured() && !!db();
  }

  function isCacheValid() {
    return cache.timestamp && (Date.now() - cache.timestamp < CACHE_DURATION);
  }

  function invalidateCache() {
    cache.tags = null;
    cache.logs = null;
    cache.settings = null;
    cache.timestamp = null;
  }

  function mapTag(row) {
    if (!row) return null;
    return {
      id: row.id,
      reference_number: row.reference_number,
      full_name: row.full_name,
      department: row.department,
      position: row.position,
      category: row.category,
      id_number: row.id_number,
      p_number: row.p_number,
      id_number_value: row.id_number_value,
      status: row.status || 'Active',
      date_generated: row.date_generated,
      updated_at: row.updated_at,
      created_by: row.created_by_email || row.created_by,
    };
  }

  function mapLog(row) {
    return {
      id: row.id,
      msg: row.msg,
      time: row.time,
      user: row.user_email,
      action: row.action || 'general',
      userId: row.user_id,
    };
  }

  function mapSettings(row) {
    if (!row) return null;
    return {
      org: row.org,
      sys: row.sys,
      tagline: row.tagline,
      gov: row.gov,
      darkMode: row.dark_mode,
      qr: row.qr,
      dup: row.dup,
      log: row.log,
      email: row.email,
      tagLayout: row.tag_layout || {},
    };
  }

  function settingsToRow(settings) {
    return {
      id: 'default',
      org: settings.org,
      sys: settings.sys,
      tagline: settings.tagline,
      gov: settings.gov,
      dark_mode: !!settings.darkMode,
      qr: !!settings.qr,
      dup: settings.dup !== false,
      log: settings.log !== false,
      email: !!settings.email,
      tag_layout: settings.tagLayout || {},
      updated_at: new Date().toISOString(),
    };
  }

  function tagToRow(tag, userEmail, userId) {
    const row = {
      reference_number: tag.reference_number,
      full_name: tag.full_name,
      department: tag.department,
      position: tag.position,
      category: tag.category,
      id_number: tag.id_number,
      p_number: tag.p_number,
      id_number_value: tag.id_number_value,
      status: tag.status || 'Active',
      date_generated: tag.date_generated || new Date().toISOString(),
      updated_at: tag.updated_at || null,
      created_by: (userId && userId !== 'system') ? userId : null,
      created_by_email: tag.created_by || userEmail,
    };

    if (tag.id) {
      row.id = tag.id;
    }

    return row;
  }

  async function loadAll() {
    if (isCacheValid() && cache.tags && cache.logs && cache.settings) {
      return {
        tags: cache.tags,
        logs: cache.logs,
        settings: cache.settings
      };
    }

    const sb = db();
    if (!sb) throw new Error('Supabase not configured');

    const [tagsRes, logsRes, settingsRes] = await Promise.all([
      sb.from('tags').select('*').order('date_generated', { ascending: false }),
      sb.from('activity_logs').select('*').order('time', { ascending: false }).limit(200),
      sb.from('app_settings').select('*').eq('id', 'default').maybeSingle(),
    ]);

    if (tagsRes.error) throw tagsRes.error;
    if (logsRes.error) throw logsRes.error;
    if (settingsRes.error) throw settingsRes.error;

    const result = {
      tags: (tagsRes.data || []).map(mapTag),
      logs: (logsRes.data || []).map(mapLog),
      settings: mapSettings(settingsRes.data),
    };
    
    // Update cache
    cache.tags = result.tags;
    cache.logs = result.logs;
    cache.settings = result.settings;
    cache.timestamp = Date.now();
    
    return result;
  }

  async function insertTag(tag, userEmail, userId) {
    const sb = db();
    const { data, error } = await sb
      .from('tags')
      .insert(tagToRow(tag, userEmail, userId))
      .select('*')
      .single();
    if (error) throw error;
    invalidateCache();
    return mapTag(data);
  }

  async function insertTags(tags, userEmail, userId) {
    const sb = db();
    const rows = tags.map((t) => tagToRow(t, userEmail, userId));
    const { data, error } = await sb.from('tags').insert(rows).select('*');
    if (error) throw error;
    invalidateCache();
    return (data || []).map(mapTag);
  }

  async function updateTag(tag) {
    const sb = db();
    const { data, error } = await sb
      .from('tags')
      .update({
        full_name: tag.full_name,
        department: tag.department,
        position: tag.position,
        status: tag.status,
        p_number: tag.p_number,
        id_number_value: tag.id_number_value,
        updated_at: new Date().toISOString(),
      })
      .eq('id', tag.id)
      .select('*')
      .single();
    if (error) throw error;
    invalidateCache();
    return mapTag(data);
  }

  async function deleteTag(id) {
    const sb = db();
    const { error } = await sb.from('tags').delete().eq('id', id);
    if (error) throw error;
    invalidateCache();
  }

  async function deleteAllTags() {
    const sb = db();
    const { error } = await sb.from('tags').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (error) throw error;
    invalidateCache();
  }

  async function insertLog(msg, userEmail, userId, action = 'general') {
    const sb = db();
    const { error } = await sb.from('activity_logs').insert({
      msg,
      user_email: userEmail || 'system',
      time: new Date().toISOString(),
      action: action,
      user_id: (userId && userId !== 'system') ? userId : null,
    });
    if (error) throw error;
  }

  async function getLogs(limit = 200) {
    const sb = db();
    const { data, error } = await sb
      .from('activity_logs')
      .select('*')
      .order('time', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return (data || []).map(mapLog);
  }

  async function clearLogs(userRole) {
    if (userRole !== 'superadmin') {
      throw new Error('Only superadmins can clear logs');
    }
    const sb = db();
    const { error } = await sb.from('activity_logs').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (error) throw error;
  }

  async function upsertSettings(settings) {
    const sb = db();
    const { data, error } = await sb
      .from('app_settings')
      .upsert(settingsToRow(settings), { onConflict: 'id' })
      .select('*')
      .single();
    if (error) throw error;
    return mapSettings(data);
  }

  async function getProfile(userId) {
    const sb = db();
    const { data, error } = await sb.from('profiles').select('*').eq('id', userId).maybeSingle();
    if (error) throw error;
    return data;
  }

  async function getPendingUsers() {
    const sb = db();
    const { data, error } = await sb.from('profiles').select('*').eq('status', 'pending');
    if (error) throw error;
    return data || [];
  }

  async function updateUserStatus(userId, status) {
    const sb = db();
    const { data, error } = await sb.from('profiles').update({ status }).eq('id', userId).select().single();
    if (error) throw error;
    return data;
  }

  async function testConnection() {
    const sb = db();
    if (!sb) return { ok: false, message: 'Not configured' };
    
    try {
      const { error } = await sb.from('app_settings').select('id').limit(1);
      if (error) {
        // Provide more specific error messages
        if (error.message.includes('Invalid API key') || error.message.includes('JWT')) {
          return { ok: false, message: 'Invalid anon key. Please check you are using the ANON key (not service role key) from Supabase Dashboard → Project Settings → API.' };
        }
        if (error.message.includes('schema') || error.message.includes('relation')) {
          return { ok: false, message: 'Database schema not found. Please run the schema.sql file in Supabase SQL Editor.' };
        }
        return { ok: false, message: error.message };
      }
      return { ok: true };
    } catch (e) {
      return { ok: false, message: e.message || 'Connection failed' };
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
    getLogs,
    clearLogs,
    upsertSettings,
    getProfile,
    getPendingUsers,
    updateUserStatus,
    testConnection,
    mapTag,
    invalidateCache,
  };
})();
