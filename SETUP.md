# Child Planner PWA — Complete Setup Guide

## 📦 What's New

This PWA now includes:
- **IndexedDB database** — All data stored on-device, not in the cloud
- **Google Drive integration** — Import files directly without link pasting
- **Files manager** — Upload, organize, preview, and link files to topics/tests
- **Export/Import** — Backup your data as JSON files

---

## 📁 File Structure

```
child-planner-pwa/
├── index.html          ← Main app (timetable, tracker, tests, overview)
├── files.html          ← Files manager (upload, Google Drive, local storage)
├── manifest.json       ← PWA manifest
├── db.js              ← IndexedDB database layer (CRUD)
├── gdrive.js          ← Google Drive Picker API integration
├── sw.js              ← Service worker (offline + caching)
├── icons/             ← App icons (192px, 512px)
└── README.md          ← This file
```

---

## 🚀 Quick Start (Choose One)

### Option A — Deploy on Netlify (5 minutes, free)

1. Go to **https://netlify.com** → Sign up with GitHub/Google
2. Download the PWA folder (or clone from GitHub)
3. Drag the `child-planner-pwa` folder onto the Netlify dashboard
4. Your app is live at `https://xyz.netlify.app` ✨

### Option B — Deploy on GitHub Pages (free)

1. Create a GitHub repo called `child-planner`
2. Upload all files to the repo
3. Go to **Settings → Pages → Source → main (root)**
4. Your app is live at `https://yourusername.github.io/child-planner`

### Option C — Test Locally

```bash
cd child-planner-pwa
python3 -m http.server 8080
```
Open http://localhost:8080 in Chrome.

> ⚠️ Google Drive requires HTTPS (or localhost) to work.

---

## 🔐 Google Drive Setup (One-time, Free)

To enable Google Drive file imports:

### Step 1 — Create a Google Cloud Project

1. Go to **https://console.cloud.google.com**
2. Create a new project (e.g. "Child Planner")
3. Search for **"Google Drive API"** → Click → Enable
4. Search for **"Google Picker API"** → Click → Enable

### Step 2 — Create OAuth Credentials

1. Go to **Credentials** (left sidebar)
2. Click **+ Create Credentials → OAuth 2.0 Client ID**
3. Choose **Web application**
4. Add **Authorised JavaScript origins:**
   - If using Netlify: `https://xyz.netlify.app`
   - If using GitHub Pages: `https://yourusername.github.io`
   - If testing locally: `http://localhost:8080`
5. Click **Create** → Copy your **Client ID**

### Step 3 — Create an API Key

1. Still in **Credentials**, click **+ Create Credentials → API Key**
2. Restrict it to these APIs:
   - Google Picker API
   - Google Drive API
3. Copy the **API Key**

### Step 4 — Update gdrive.js

Open `gdrive.js` and paste your credentials:

```javascript
export const GDRIVE_CONFIG = {
  CLIENT_ID: 'YOUR_CLIENT_ID_HERE',   // from OAuth credentials
  API_KEY:   'YOUR_API_KEY_HERE',     // from API key
  SCOPE:     'https://www.googleapis.com/auth/drive.readonly',
};
```

Deploy again. Done! 🎉

---

## 📱 Install on Android

1. Open the live URL in **Chrome** (not Safari)
2. A banner appears: **"Install app"** → Tap it
3. Or: Chrome menu (⋮) → **"Add to Home Screen"**
4. App installs with its own icon, works offline

## 📱 Install on iPhone (iOS)

1. Open the live URL in **Safari** (not Chrome)
2. Tap the **Share** button (box with arrow)
3. Scroll down → **"Add to Home Screen"**
4. Tap **Add**

---

## 🗄️ Database & Files

### What Gets Stored

- **Events** — Timetable (sports, clubs, study, tuition, tests)
- **Topics** — Study tracker (subject, progress, notes, areas to improve)
- **Tests** — Upcoming tests & exam schedule
- **Files** — Images, PDFs, documents linked to topics/tests

All stored locally in **IndexedDB** on your device. Nothing goes to a server.

### Files Manager

Click the **Files** tab (or open `files.html`) to:
- **Upload files** from your device
- **Import from Google Drive** (picker UI, no link pasting)
- **Preview** images, PDFs, audio, video
- **Link files to topics or tests** (e.g. "attach a diagram to Biology > Photosynthesis")
- **View on-device storage** usage
- **Export/Import** all data as JSON backups

### Backup Your Data

1. Open **Files** tab → **Export** button
2. A `.json` file downloads
3. Save it somewhere safe (Google Drive, email, USB stick)

### Restore from Backup

1. Open **Files** tab → **Import JSON** button
2. Choose the `.json` file from your backup
3. All data is restored

---

## ⚙️ Customisation

### Change the App Name

Open `index.html`, find this line:
```html
<h1>My Child's Planner</h1>
```
Change it to whatever you want.

### Change the Theme Color

The default colour is forest green (`#2d4a3e`). To change it:

**In index.html**, update the CSS variable:
```css
:root {
  --green: #2d4a3e;  ← Change this to your colour
  ...
}
```

**In manifest.json:**
```json
"theme_color": "#2d4a3e"  ← Same colour here
```

**In files.html**, same CSS change.

Popular options:
- Purple: `#5c35a0`
- Teal: `#0d6e6e`
- Navy: `#1a4a8a`

---

## 🔄 Offline First

The PWA uses a **service worker** to cache everything:
- ✅ Works **completely offline** after first visit
- ✅ Syncs data when back online
- ✅ No server required

---

## 📊 Data Structure (for developers)

### Events
```javascript
{
  id: "unique-id",
  name: "Football training",
  type: "sport",          // sport | study | club | tutor | test
  day: 0,                 // 0=Mon, 1=Tue, … 6=Sun
  start: "15:00",
  end: "16:00",
  venue: "Sports hall",
  notes: "Bring boots",
  createdAt: "2025-01-15T10:30:00Z",
  updatedAt: "2025-01-15T10:30:00Z"
}
```

### Topics
```javascript
{
  id: "unique-id",
  subject: "Maths",
  topic: "Quadratic equations",
  status: "in-progress",  // not-started | in-progress | needs-review | confident
  pct: 65,                // completion %
  notes: "Covered factorisation…",
  areas: "Completing the square still tricky",
  testDate: "2025-02-10", // optional
  createdAt: "2025-01-10T09:00:00Z",
  updatedAt: "2025-01-15T10:30:00Z"
}
```

### Tests
```javascript
{
  id: "unique-id",
  subject: "Biology",
  name: "Unit 2 test",
  date: "2025-02-05",
  topics: "Photosynthesis, respiration, ecosystems",
  prep: "Revise notes + past paper",
  result: "85%",          // optional, filled in after test
  createdAt: "2025-01-10T09:00:00Z",
  updatedAt: "2025-01-15T10:30:00Z"
}
```

### Files
```javascript
{
  id: "unique-id",
  name: "photosynthesis-diagram.png",
  mimeType: "image/png",
  size: 125440,           // bytes
  linkedTo: "topic-id",   // optional, links to a topic or test
  source: "local" | "google-drive",
  driveId: null,          // set if from Drive
  data: ArrayBuffer,      // binary file content (in IndexedDB)
  createdAt: "2025-01-15T10:30:00Z",
  updatedAt: "2025-01-15T10:30:00Z"
}
```

---

## 🐛 Troubleshooting

### "Google Drive not configured" banner appears
→ Follow the **Google Drive Setup** section above to add CLIENT_ID and API_KEY.

### Service worker not updating
→ In Chrome DevTools (F12) → Application → Service Workers → Unregister, then refresh.

### Files won't upload
→ Check browser storage quota. PWAs typically get 50% of available device storage. Older files you can delete to free space.

### Google Drive import fails
→ Ensure your client ID is valid and your site is in the "Authorised origins". Check your Google Cloud Console.

### Data not persisting
→ Check browser privacy settings. Some browsers block localStorage/IndexedDB in private mode.

---

## 📞 Support

- **PWA Installation**: https://web.dev/install-criteria/
- **IndexedDB**: https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API
- **Google Drive API**: https://developers.google.com/drive/api
- **Google Picker**: https://developers.google.com/picker/docs

---

## 📝 License

Free to use, modify, and distribute. No restrictions.

---

**Version:** 2.0 (with Database + Google Drive)  
**Last updated:** January 2025
