# Universal Batoto Image Fixer

Universal Batoto Image Fixer automatically repairs broken images on Bato.to and its mirrors by probing alternative mirror servers and swapping subdomain prefixes when images fail to load.

Badges: (add store/badge images as needed)

- Author: Sumon Kayal
- License: MIT
- Current stable: v8.1+

---

Table of Contents
- [About](#about)
- [Repository Contents](#repository-contents)
- [Installation](#installation)
  - [Browser Extension (Recommended)](#browser-extension-recommended)
  - [Userscript (Tampermonkey / Compatible)](#userscript-tampermonkey--compatible)
  - [Cromite & Mobile Support](#cromite--mobile-support)
- [Usage](#usage)
- [Technical Details](#technical-details)
  - [Fallback Roots](#fallback-roots)
  - [Compatibility & Requirements](#compatibility--requirements)
- [Packaging for Distribution](#packaging-for-distribution)
- [Store Submission Notes](#store-submission-notes)
- [Troubleshooting & FAQ](#troubleshooting--faq)
- [Contributing](#contributing)
- [Changelog & License](#changelog--license)
- [Contact](#contact)

---

## About
This project patches image URLs on Bato.to (and known mirrors) when images fail to load in the browser. It attempts alternative mirror domains and subdomain prefixes to recover images without user intervention.

## Repository Contents
- `manifest.json` — Chrome/Firefox MV3 manifest.
- `fixer.js` — Main content script (v8.1+).
- `fixer_v8.0.js` — Legacy v8.0 reference (also available via Pastebin).
- `LICENSE` — MIT License.
- `CHANGELOG.md` — Project history.

---

## Installation

### Browser Extension (Recommended)

#### Chrome / Chromium / Edge
- Official Store: Install "Universal Batoto Image Fixer by Sumon Kayal" from the Chrome Web Store (when published).
- Manual (Developer mode):
  1. Clone or download the repository.
  2. Open `chrome://extensions/`.
  3. Enable "Developer mode".
  4. Click "Load unpacked" and select the folder containing `manifest.json`.

#### Firefox
- Official Store: Install from Firefox Add-ons when available: [Universal Batoto Image Fixer by Sumon Kayal](https://addons.mozilla.org/en-US/firefox/addon/universal-batoto-image-fixer/).
- Manual (Temporary Load):
  1. Go to `about:debugging#/runtime/this-firefox`.
  2. Click "Load Temporary Add-on...".
  3. Select `manifest.json` from the project folder.
  Note: Temporary extensions are removed on restart.

### Userscript (Tampermonkey / Violentmonkey / Greasemonkey)
- Method A — Import via URL:
  1. Open Tampermonkey Dashboard → Utilities.
  2. Paste the raw script URL: `https://pastebin.com/raw/c0mBHwtH`.
  3. Click Install.

- Method B — Import from file:
  1. Download the raw userscript from the Pastebin raw link and save as `universal-batoto-image-fixer.user.js`.
  2. In Tampermonkey → Utilities → Import from file, choose the file.

- Method C — Manual copy-paste:
  1. Create a New Userscript in Tampermonkey.
  2. Copy the code from `fixer.js` (or pastebin raw) into the editor.
  3. Save.

### Cromite & Mobile Support
- Cromite supports userscripts natively:
  1. Settings → User Scripts → Activate User Scripts.
  2. Add script → select the downloaded `.user.js`.

- Via mobile browsers supporting userscripts:
  - Direct install: visit `https://pastebin.com/raw/c0mBHwtH` (if supported).
  - Manual: copy script into browser's script manager as above.

---

## Usage
- Install the extension or userscript.
- Navigate to the bato.to /bato.cc page or mirror. When images fail to load, the script will automatically try alternate roots and subdomains to restore the images.
- No additional configuration required.

Example: If an image URL on `mbdny.org` 404s, the script will attempt the other configured domains and variant prefixes until a working image is found, then update the image `src`.

---

## Technical Details

### Fallback Roots
The script probes the following domains (current list — keep updated in `fixer.js`):
- `mbdny.org`
- `mbrtz.org`
- `bato.to`
- `mbwbm.org`
- `mbznp.org`
- `mbqgu.org`

The algorithm:
1. Detect broken/errored images (error event / failing load).
2. Generate candidate hostnames by swapping subdomain prefixes and using the above roots.
3. Probe candidates (HEAD or image test).
4. Replace `img.src` with the first successful candidate.

### Compatibility & Requirements
- Browser: Chrome/Chromium/Edge (MV3) and Firefox (WebExtensions).
- JavaScript: content script compatible with modern browsers (v8.1+ recommended).
- For userscript installs, Tampermonkey or comparable manager required.

---

## Packaging for Distribution

macOS / Linux:
```bash
zip -r universal-batoto-image-fixer-v8.1.zip . -x "*.git*"
```

Windows (PowerShell):
```powershell
Compress-Archive -Path manifest.json, fixer.js, LICENSE, CHANGELOG.md -DestinationPath universal-batoto-image-fixer-v8.1.zip
```

Before publishing:
- Ensure manifest version matches `fixer.js` header/version note.
- Keep host permissions minimal (see Store Submission Notes).

---

## Store Submission Notes
- Host permissions: Request the smallest scope necessary (e.g., only the domains you need or `<all_urls>` only if unavoidable).
- Privacy Policy: Chrome Web Store requires a privacy policy URL (even if no data is collected). Provide a short policy page if publishing.
- Review: Provide clear extension description and screenshots demonstrating the fix in action.
- Versioning: Increment `manifest.json` and `fixer.js` version numbers together to avoid review confusion.

---

## Troubleshooting & FAQ

Q: Images still don’t load after installing?
- A: Ensure the userscript/extension is active and allowed on the target site. Disable other extensions/userscripts that may rewrite images.

Q: Is this accessing or storing user data?
- A: No user data is collected or stored by the script. It only attempts alternate URLs for images loaded in-page.

Q: Can I add more mirror domains?
- A: Yes — edit the fallback list in `fixer.js` and reload the extension / reinstall the userscript.

Q: How do I debug?
- A: Open DevTools → Console and look for logs prefixed by "Universal Batoto Image Fixer". You can also add temporary console statements in `fixer.js`.

Q: What if the script/extension fails to fix images or behaves unexpectedly?
- A: First try disabling and re-enabling the extension/userscript and ensure it's allowed on the site. If the problem persists, report the issue on the Batoto subreddit: [https://www.reddit.com/r/batoto](https://www.reddit.com/r/batoto). Include steps to reproduce, browser/version, and any console logs or screenshots.

Q: Some users' avatar thumbnails are broken in the comment section (I can't see their profile image). What can I do?
- A: Use bato.cc/v3x or `bato.si.

---

## Contributing
Thanks for your interest! A small checklist:
1. Open an issue to discuss larger changes before coding.
2. Fork the repo and create a feature branch.
3. Keep `manifest.json` and `fixer.js` version numbers in sync.
4. Submit a PR with a clear description and changelog entry.

Reporting issues: use the GitHub Issue tracker and include steps to reproduce and browser/version details.

---

## Changelog & License
- See `CHANGELOG.md` for release history.
- Licensed under the MIT License. See `LICENSE` for details.

---

## Contact
Author: Sumon Kayal
Repository maintainer: (use GitHub profile/contact)

