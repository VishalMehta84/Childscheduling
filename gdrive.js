/**
 * gdrive.js — Google Drive Picker integration
 *
 * Uses Google Identity Services (GIS) + Google Picker API.
 * User clicks a button → Google OAuth popup → Drive file picker UI →
 * selected file is downloaded to the device and stored in IndexedDB.
 *
 * SETUP REQUIRED (one-time, free):
 *   1. Go to https://console.cloud.google.com
 *   2. Create a project (or use existing)
 *   3. Enable "Google Drive API" and "Google Picker API"
 *   4. Create OAuth 2.0 credentials → Web application
 *      - Authorised JavaScript origins: your site URL (e.g. https://yourapp.netlify.app)
 *   5. Create an API key (restrict to Picker API + your domain)
 *   6. Paste CLIENT_ID and API_KEY below
 */

// ── Configuration — fill these in ─────────────────────────────────────────────
export const GDRIVE_CONFIG = {
  CLIENT_ID: '131290314452-n8kc0tic7lrq62sp1qsf08n1s70rnv7u.apps.googleusercontent.com',   // e.g. '123456789-abc.apps.googleusercontent.com'
  API_KEY:   'AIzaSyCNRT__kpE2VQndkPEUXOPsD0U6m4Jdlyw',   // e.g. 'AIzaSy...'
  SCOPE:     'https://www.googleapis.com/auth/drive.readonly',
};

let _tokenClient = null;
let _accessToken  = null;
let _pickerInited = false;
let _gapiInited   = false;

/** Returns true if credentials have been configured */
export function isDriveConfigured() {
  return Boolean(GDRIVE_CONFIG.CLIENT_ID && GDRIVE_CONFIG.API_KEY);
}

/** Load both gapi and GIS scripts dynamically */
export function loadDriveScripts() {
  return new Promise((resolve, reject) => {
    let gapiDone = false, gisDone = false;
    function check() { if (gapiDone && gisDone) resolve(); }

    if (!document.getElementById('gapi-script')) {
      const s = document.createElement('script');
      s.id  = 'gapi-script';
      s.src = 'https://apis.google.com/js/api.js';
      s.onload = () => {
        gapi.load('picker', () => { _pickerInited = true; gapiDone = true; check(); });
      };
      s.onerror = reject;
      document.head.appendChild(s);
    } else { gapiDone = true; check(); }

    if (!document.getElementById('gis-script')) {
      const s = document.createElement('script');
      s.id  = 'gis-script';
      s.src = 'https://accounts.google.com/gsi/client';
      s.onload = () => {
        _tokenClient = google.accounts.oauth2.initTokenClient({
          client_id: GDRIVE_CONFIG.CLIENT_ID,
          scope:      GDRIVE_CONFIG.SCOPE,
          callback:   () => {},   // overridden per-call
        });
        _gapiInited = true; gisDone = true; check();
      };
      s.onerror = reject;
      document.head.appendChild(s);
    } else { gisDone = true; check(); }
  });
}

/** Request an OAuth token (shows Google consent if needed) */
function getToken() {
  return new Promise((resolve, reject) => {
    _tokenClient.callback = resp => {
      if (resp.error) reject(new Error(resp.error));
      else { _accessToken = resp.access_token; resolve(_accessToken); }
    };
    if (_accessToken) resolve(_accessToken);
    else _tokenClient.requestAccessToken({ prompt: 'consent' });
  });
}

/**
 * Open the Google Drive file picker.
 * @param {object} options
 * @param {string[]} options.mimeTypes  - e.g. ['application/pdf','image/*']
 * @param {boolean}  options.multiselect
 * @returns {Promise<DriveFile[]>} array of { id, name, mimeType, size }
 */
export async function openDrivePicker(options = {}) {
  if (!isDriveConfigured()) throw new Error('Google Drive not configured. Add CLIENT_ID and API_KEY to gdrive.js');
  if (!_gapiInited || !_pickerInited) await loadDriveScripts();
  const token = await getToken();

  return new Promise((resolve, reject) => {
    const view = new google.picker.DocsView()
      .setIncludeFolders(true)
      .setSelectFolderEnabled(false);

    if (options.mimeTypes?.length) {
      view.setMimeTypes(options.mimeTypes.join(','));
    }

    const builder = new google.picker.PickerBuilder()
      .addView(view)
      .addView(new google.picker.DocsUploadView())
      .setOAuthToken(token)
      .setDeveloperKey(GDRIVE_CONFIG.API_KEY)
      .setTitle('Choose files from Google Drive')
      .setCallback(data => {
        if (data.action === google.picker.Action.PICKED) {
          resolve(data.docs.map(d => ({
            id:       d.id,
            name:     d.name,
            mimeType: d.mimeType,
            size:     d.sizeBytes || 0,
          })));
        } else if (data.action === google.picker.Action.CANCEL) {
          resolve([]);
        }
      });

    if (options.multiselect) {
      builder.enableFeature(google.picker.Feature.MULTISELECT_ENABLED);
    }

    builder.build().setVisible(true);
  });
}

/**
 * Download a Drive file and return its binary as ArrayBuffer.
 * Uses the Drive v3 export/download endpoint.
 */
export async function downloadDriveFile(driveFile) {
  if (!_accessToken) throw new Error('Not authenticated');

  let url;
  // Google Workspace files (Docs, Sheets…) must be exported
  const exportMap = {
    'application/vnd.google-apps.document':     'application/pdf',
    'application/vnd.google-apps.spreadsheet':  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.google-apps.presentation': 'application/pdf',
  };
  const exportMime = exportMap[driveFile.mimeType];

  if (exportMime) {
    url = `https://www.googleapis.com/drive/v3/files/${driveFile.id}/export?mimeType=${encodeURIComponent(exportMime)}`;
    driveFile = { ...driveFile, mimeType: exportMime };
  } else {
    url = `https://www.googleapis.com/drive/v3/files/${driveFile.id}?alt=media`;
  }

  const resp = await fetch(url, {
    headers: { Authorization: `Bearer ${_accessToken}` },
  });
  if (!resp.ok) throw new Error(`Drive download failed: ${resp.status} ${resp.statusText}`);
  return { buffer: await resp.arrayBuffer(), mimeType: driveFile.mimeType, name: driveFile.name };
}

/** Sign out and clear token */
export function signOutDrive() {
  if (_accessToken) {
    google.accounts.oauth2.revoke(_accessToken, () => {});
    _accessToken = null;
  }
}
