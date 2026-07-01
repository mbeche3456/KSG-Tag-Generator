/**
 * Supabase client configuration for KSG Tag Generator.
 *
 * Option A — edit these defaults (project URL + anon key from Supabase Dashboard):
 *   Project Settings → API → Project URL & anon public key
 *
 * Option B — leave blank and enter credentials in Settings → Supabase Integration
 *   (saved to localStorage as ksg_sb_url / ksg_sb_key)
 */
window.KSGSupabase = (function () {
  const DEFAULT_URL = 'https://omqzmhivuoxnawjdxhmm.supabase.co';
  const DEFAULT_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tcXptaGl2dW94bmF3amR4aG1tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI5MDM1MjMsImV4cCI6MjA5ODQ3OTUyM30.Fiy4WANQ4gGpXQupdRzLdMPtpx7ftI-za4n5pKKwzgg';

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
