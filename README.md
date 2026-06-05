# My Child's Planner — PWA

A fully offline-capable Progressive Web App for managing your child's timetable, study tracker, sports, clubs, tests, and files.

**Version 2.0** — Now with IndexedDB, Google Drive integration, and files manager.

---

## 🎯 Features

| Feature | Details |
|---------|---------|
| **Timetable** | Weekly grid (Mon–Sun, 7am–8pm), colour-coded events |
| **Study Tracker** | Topics per subject, completion %, status, notes, weak areas, revision dates |
| **Tests & Exams** | Schedule tests, track topics, log results |
| **Files Manager** | Upload files, import from Google Drive, link to topics/tests, full preview support |
| **Data Export/Import** | Backup as JSON, restore anytime |
| **Offline-first** | Works fully offline after install, no account needed |
| **Dark mode** | Automatic, follows system preference |
| **Local storage** | All data on-device in IndexedDB, private and secure |

---

## 📁 Files

```
child-planner-pwa/
├── index.html          ← Main app (timetable, tracker, tests, overview + Files link)
├── files.html          ← Files manager (upload, Google Drive, preview)
├── db.js              ← IndexedDB database (CRUD operations)
├── gdrive.js          ← Google Drive Picker API
├── sw.js              ← Service worker (offline + caching)
├── manifest.json      ← PWA manifest
├── SETUP.md           ← Complete setup & Google Drive config guide
├── README.md          ← This file
└── icons/
    ├── icon-192.png
    └── icon-512.png
```

---

## 🚀 Deploy (choose one)

### Netlify (easiest, 30 seconds)
1. Go to https://netlify.com → Sign up
2. Drag the `child-planner-pwa` folder onto dashboard
3. Done! Your app is live

### GitHub Pages (free)
1. Create repo `child-planner`
2. Upload all files
3. Settings → Pages → Source → main branch (root)
4. Live at `https://yourusername.github.io/child-planner`

### Local (Python)
```bash
cd child-planner-pwa
python3 -m http.server 8080
```
Open http://localhost:8080 in Chrome.

---

## 📱 Install on Phone

**Android (Chrome):**
1. Open the live URL in Chrome
2. Tap "Install app" banner (or menu ⋮ → Add to Home Screen)
3. Done — app icon on home screen, works offline

**iPhone (Safari):**
1. Open the live URL in Safari
2. Tap Share → "Add to Home Screen"
3. Tap Add

---

## 🔐 Google Drive Setup (One-time, Free)

To enable "Import from Google Drive" button:

1. Go to https://console.cloud.google.com
2. Create a new project
3. Enable **Google Drive API** and **Google Picker API**
4. Create **OAuth 2.0 Client ID** (Web app, add your site as authorized origin)
5. Create **API Key** (restrict to Picker + Drive APIs)
6. Open `gdrive.js` and paste:
   ```javascript
   CLIENT_ID: 'your-client-id-here',
   API_KEY:   'your-api-key-here'
   ```

**Full instructions in SETUP.md** ← Read this for detailed steps.

---

## 🗄️ Data Storage

All data lives on your device in **IndexedDB** (browser's local database):
- **Events** — timetable slots
- **Topics** — study progress & notes
- **Tests** — exam schedule & results
- **Files** — PDFs, images, audio, video (with binary storage)

Nothing goes to any server. You own your data.

### Backup Your Data
Files tab → **Export** → saves `.json` file  
Files tab → **Import JSON** → restore from backup

---

## 🎨 Customisation

**Change the child's name:**
Edit `index.html`:
```html
<h1>My Child's Planner</h1>  ← Change this
```

**Change theme colour:**
Edit CSS in `index.html` (default: forest green):
```css
--green: #2d4a3e;  ← Change to your colour
```
Update `manifest.json` theme_color to match.

Popular options: Purple `#5c35a0` · Teal `#0d6e6e` · Navy `#1a4a8a`

---

## 📖 Full Documentation

- **SETUP.md** — Complete setup, Google Drive, customisation, data structure
- **db.js** — Database functions (getAll, upsert, remove, saveFile, etc.)
- **gdrive.js** — Drive Picker integration
- **files.html** — Files manager UI & features

---

## ⚖️ License

Free to use, modify, distribute. No restrictions.

---

**Questions?** Check SETUP.md first — it covers 99% of issues.
