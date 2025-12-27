I've reorganized your README into a clean, well-structured markdown format. Here's the fixed version:


# Universal Batoto Image Fixer

![Version](https://img.shields.io/badge/version-8.1+-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Platform](https://img.shields.io/badge/platform-Chrome%20|%20Firefox%20|%20Userscript-orange.svg)

Universal Batoto Image Fixer automatically repairs broken images on Bato.to and its mirrors by detecting failed image loads and instantly probing alternative mirror servers and subdomain prefixes to restore content without user intervention.

- **Author**: Sumon Kayal
- **License**: MIT
- **Current Stable**: v8.1+

---

## ✨ Features

- **Automatic Recovery**: No manual refreshing or clicking required
- **Smart Probing**: Cycles through multiple mirrors (mbdny.org, mbrtz.org, etc.) until a working image is found
- **Cross-Platform**: Available as Chrome Extension (MV3), Firefox Add-on, and Userscript
- **Lightweight**: Minimal code footprint with no external dependencies or tracking
- **Mobile Support**: Works on Android via Cromite, Kiwi, or Lemur browsers
- **Lazy Loading Compatible**: Seamlessly integrates with Bato's native lazy-loading and "Long Strip" reading modes

---

## 📋 Table of Contents

- [About](#about)
- [Repository Contents](#repository-contents)
- [Installation](#-installation)
- [Usage](#-usage)
- [Technical Details](#-technical-details)
- [Troubleshooting & FAQ](#-troubleshooting--faq)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## About

This project patches image URLs on Bato.to (and known mirrors) when images fail to load in the browser. It attempts alternative mirror domains and subdomain prefixes to recover images without user intervention.

---

## Repository Contents

- `manifest.json` — Chrome/Firefox Manifest V3 configuration
- `fixer.js` — Main content script (Latest version)
- `fixer_v8.0.js` — Legacy v8.0 reference
- `LICENSE` — MIT License
- `CHANGELOG.md` — Project history

---

## 🚀 Installation

### Browser Extension (Recommended)

#### Chrome / Chromium / Edge

> **Note**: Due to developer registration fees, this extension is not hosted on the official Chrome Web Store. Please use the manual installation method below or the Userscript version.

1. Download the latest ZIP file from [Releases](https://github.com/Sumon-Kayal/Universal-Batoto-Image-Fixer/releases/tag/v8.1)
3. Extract the folder to a **permanent location** on your PC (don't delete or move it later)
4. Open your browser's Extensions page (`chrome://extensions/`)
5. Enable **Developer mode** (top right toggle)
6. Click **Load unpacked** and select the extracted folder containing `manifest.json`

#### Firefox

**Official Store (Recommended)**:  
Install from [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/universal-batoto-image-fixer/)

**Manual Temporary Load**:
1. Go to `about:debugging#/runtime/this-firefox`
2. Click **Load Temporary Add-on...**
3. Select `manifest.json` from the project folder

> ⚠️ **Note**: Temporary extensions are removed on browser restart

**Firefox Unsigned Install** (Developer Edition/Nightly/ESR only):
1. Download the XPI file from [Releases](https://github.com/Sumon-Kayal/Universal-Batoto-Image-Fixer/releases/tag/v8.1)
3. Open Firefox and type `about:config` in the address bar
4. Accept the warning and search for `xpinstall.signatures.required`
5. Set it to `false` (double-click to toggle)
6. Restart Firefox
7. Open the downloaded `.xpi` file and approve installation

### Userscript (Tampermonkey / Violentmonkey / Greasemonkey)

#### Method A — Direct Install (Recommended):
1. Open Tampermonkey Dashboard → **Utilities**
2. Paste the Pastebin RAW script URL:  
   `https://pastebin.com/raw/c0mBHwtH`
3. Click **Install**

#### Method B — Import from File:
1. Download the raw userscript from the GitHub raw [link](https://github.com/Sumon-Kayal/Universal-Batoto-Image-Fixer/blob/d33f6ba6da8ce169d01911bf47cb25e88a4bea9b/Fixer%20v8.0.js)
2. In Tampermonkey → **Utilities** → **Import from file**, choose the file
download from this [Link](https://github.com/Sumon-Kayal/Universal-Batoto-Image-Fixer/blob/d33f6ba6da8ce169d01911bf47cb25e88a4bea9b/Fixer%20v8.0.js)
#### Method C — Manual Copy-Paste:
1. Create a **New Userscript** in Tampermonkey
2. Copy the code from [Fixer v8.0.js](https://github.com/Sumon-Kayal/Universal-Batoto-Image-Fixer/blob/d33f6ba6da8ce169d01911bf47cb25e88a4bea9b/Fixer%20v8.0.js) into the editor
3. Save

### Cromite & Mobile Support

**Cromite**:
1. **Settings** → **User Scripts** → **Activate User Scripts**
2. **Add script** → select the downloaded `.user.js`

**Mobile BrowsFor Visers** (Kiwi / Lemur):
1. Install Tampermonkey extension from Web Store
2. Use the Userscript installation methods above
3. For Via Browser on Android, go to Settings, add a new script, then copy and paste the script from [Fixer v8.0.js](https://github.com/Sumon-Kayal/Universal-Batoto-Image-Fixer/blob/d33f6ba6da8ce169d01911bf47cb25e88a4bea9b/Fixer%20v8.0.js)
---

## 📖 Usage

1. Install the extension or userscript
2. Navigate to **bato.to**, **bato.cc**, or any supported mirror
3. When images fail to load, the script will **automatically** try alternate roots and subdomains
4. **No additional configuration required**

**Example**: If an image URL on `mbdny.org` returns a 404 error, the script automatically attempts other configured domains and variant prefixes until a working image is found.

---

## ⚙️ Technical Details

### Fallback Roots

The script probes the following domains:

| Domain | Status |
|--------|--------|
| `mbdny.org` | Active |
| `mbrtz.org` | Active |
| `bato.to` | Active |
| `mbwbm.org` | Active |
| `mbznp.org` | Active |
| `mbqgu.org` | Active |

### How it Works

When an image fails to load, the algorithm:

1. **Identifies** the current broken domain/subdomain
2. **Cycles** through the Fallback Roots list
3. **Probes** candidate URLs by swapping subdomain prefixes (e.g., v3, v7, v3x)
4. **Replaces** the broken `src` with the first successful mirror found

### Compatibility & Requirements

- **Browser**: Chrome/Chromium/Edge (MV3) and Firefox (WebExtensions)
- **Manifest V3**: Fully compliant with latest Chrome standards
- **JavaScript**: Compatible with modern browsers (v8.1+ recommended)
- **Lazy Loading**: Works with Bato's native lazy-loading and "Long Strip" reading modes
- **Userscript**: Requires Tampermonkey or compatible manager

---

## 📦 Packaging for Distribution

**macOS / Linux:**
```bash
zip -r universal-batoto-image-fixer-v8.1.zip . -x "*.git*" "fixer_v8.0.js"

⸻

**Windows (PowerShell):**

Compress-Archive -Path manifest.json, fixer.js, LICENSE, CHANGELOG.md -DestinationPath universal-batoto-image-fixer-v8.1.zip

⸻

Before publishing:
• Ensure manifest version matches `fixer.js` version
• Keep host permissions minimal
• Provide privacy policy if publishing to official stores


⸻


❓ Troubleshooting & FAQ

**Q: Images still show as broken?**  
A: Ensure no other "Image Blocker" or "Data Saver" extensions are interfering. Try refreshing the page after installation.


**Q: Does this collect my data?**  
A: No. The script runs entirely locally in your browser. It only communicates with Batoto image mirrors.


**Q: Comment avatars are still broken?**  
A: Avatars use different server logic. Try using `bato.cc/v3x` or `bato.si` for better profile image support.


**Q: How do I debug issues?**  
A: Open DevTools (F12) → Console and look for logs prefixed by "Universal Batoto Image Fixer".


**Q: Found a bug?**  
A: Report it on the [Batoto Subreddit](https://www.reddit.com/r/batoto) or open an [Issue on GitHub](https://github.com/SumonKayal/universal-batoto-image-fixer/issues).


⸻


🤝 Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes with clear messages
4. Keep `manifest.json` and `fixer.js` versions in sync
5. Open a Pull Request with a clear description


For larger changes, open an issue first to discuss.


⸻


📜 License

Licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

• **Author**: Sumon Kayal
• **Disclaimer**: This project is not affiliated with Bato.to. It is a community-driven tool to improve accessibility.


⸻


Contact : sumankayalsuman4@proton.me

**Author**: Sumon Kayal  
**Repository**: [GitHub - Universal Batoto Image Fixer](https://github.com/SumonKayal/universal-batoto-image-fixer)
