# Universal Batoto Image Fixer

![Version](https://img.shields.io/badge/version-8.1-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Platform](https://img.shields.io/badge/platform-Chrome%20|%20Firefox%20|%20Userscript-orange.svg)

Universal Batoto Image Fixer automatically repairs broken images on Bato.to and its mirrors. It detects failed image loads and instantly probes alternative mirror servers and subdomain prefixes to restore content without user intervention.

- **Author**: Sumon Kayal
- **License**: MIT
- **Current Stable Version**: v8.2

---

## ✨ Features

- **Automatic Recovery**: No manual refreshing or clicking required.
- **Smart Probing**: Cycles through multiple mirrors (mbdny.org, mbrtz.org, etc.) until a working image is found.
- **Cross-Platform**: Available as a Chrome Extension (MV3), Firefox Add-on, and Userscript.
- **Lightweight**: Minimal code footprint with no external dependencies or tracking.
- **Mobile Support**: Works on Android via Cromite, Kiwi, or Lemur browsers.
- **Lazy Loading Compatible**: Seamlessly integrates with Bato's native lazy-loading and "Long Strip" reading modes.

---

## 📋 Table of Contents

- [About](#about)
- [Repository Contents](#repository-contents)
- [Changelog](#Changelog)
- [Installation](#-installation)
- [Usage](#-usage)
- [Technical Details](#-technical-details)
- [Troubleshooting & FAQ](#-troubleshooting--faq)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## About

This project patches image URLs on Bato.to (and known mirrors) when images fail to load in the browser. It attempts to fetch content from alternative mirror domains and subdomain prefixes to recover images automatically.

---

## Repository Contents

- `manifest.json` — Chrome/Firefox Manifest V3 configuration
- `fixer.js` — **Extension Source Code** (Main content script for extensions)
- `Fixer v8.0.js` — **Userscript Version** (For Tampermonkey/GreasyFork)
- `LICENSE` — MIT License
- `CHANGELOG.md` — Project history

---

## Changelog

All notable changes to this project are documented in the [CHANGELOG.md](https://github.com/Sumon-Kayal/Universal-Batoto-Image-Fixer/blob/main/CHANGELOG.md) file.

## 🚀 Installation

### Browser Extension (Recommended)

#### Chrome / Chromium / Edge

> **Note**: Due to developer registration fees, this extension is not hosted on the official Chrome Web Store. Please use the manual installation method below or the Userscript version.

1. Download the latest ZIP file from [Releases](https://github.com/Sumon-Kayal/Universal-Batoto-Image-Fixer/releases/tag/v8.1).
2. Extract the folder to a **permanent location** on your PC (do not delete or move it later).
3. Open your browser's Extensions page (`chrome://extensions/`).
4. Enable **Developer mode** (toggle in the top right).
5. Click **Load unpacked** and select the extracted folder containing `manifest.json`.

#### Firefox

**Official Store (Temporarily Unavailable/Pending Review):**  
[Check the Firefox Add-ons Page](https://addons.mozilla.org/en-US/android/addon/Universal-Batoto-Image-Fixer/)

**Manual Temporary Load**:
1. Go to `about:debugging#/runtime/this-firefox`.
2. Click **Load Temporary Add-on...**
3. Select `manifest.json` from the project folder.

> ⚠️ **Note**: Temporary extensions are removed when the browser restarts.

**Firefox Unsigned Install** (Developer Edition/Nightly/ESR only):
1. Download the XPI file from [Releases](https://github.com/Sumon-Kayal/Universal-Batoto-Image-Fixer/releases/tag/v8.1).
2. Open Firefox and type `about:config` in the address bar.
3. Accept the warning and search for `xpinstall.signatures.required`.
4. Set it to `false` (double-click to toggle).
5. Restart Firefox.
6. Open the downloaded `.xpi` file and approve the installation.

### Userscript (Tampermonkey / Violentmonkey / Greasemonkey)

> **Note**: For Userscript managers, use **v8.0**.

#### Method A — Direct Install (Recommended):
1. Open the Tampermonkey Dashboard → **Utilities**.
2. Paste one of the following URLs into the input box:
   *   **GitHub Raw [Primary](https://raw.githubusercontent.com/Sumon-Kayal/Universal-Batoto-Image-Fixer/2e67e82bbedff45aa15b973c0d422d18afca46e9/Fixer%20v8.0.js)
   
   *   **Pastebin Raw [Alternative](https://pastebin.com/raw/c0mBHwtH)
   
   3. Click **Install**.

#### Method B — Import from File:
1. Download `Fixer v8.0.js` from the [GitHub Link](https://github.com/Sumon-Kayal/Universal-Batoto-Image-Fixer/blob/2e67e82bbedff45aa15b973c0d422d18afca46e9/Fixer%20v8.0.js) or [Pastebin Link](https://pastebin.com/c0mBHwtH).
2. In Tampermonkey → **Utilities** → **Import from file**, choose the downloaded file.

#### Method C — Manual Copy-Paste:
1. Create a **New Userscript** in Tampermonkey.
2. Copy the code from one of the following sources:
   *   [GitHub Raw Code](https://github.com/Sumon-Kayal/Universal-Batoto-Image-Fixer/blob/2e67e82bbedff45aa15b973c0d422d18afca46e9/Fixer%20v8.0.js)
   *   [Pastebin Raw Code](https://pastebin.com/raw/c0mBHwtH)
3. Paste into the editor and **Save**.

### Cromite & Mobile Support

**Cromite**:
1. Go to **Settings** → **User Scripts** → **Activate User Scripts**.
2. Tap **Add script**. You can download the file or copy the code directly from either [GitHub](https://github.com/Sumon-Kayal/Universal-Batoto-Image-Fixer/blob/2e67e82bbedff45aa15b973c0d422d18afca46e9/Fixer%20v8.0.js) or [Pastebin](https://pastebin.com/raw/c0mBHwtH).

**Mobile Browsers** (Kiwi / Lemur):
1. Install the Tampermonkey extension from the Web Store.
2. Use the Userscript installation methods above (Method A is easiest).

**Via Browser Settings (Generic)**:
1. Go to **Settings** → **Scripts** → **Add New**.
2. Copy and paste the script code from:
   *   [GitHub Raw](https://raw.githubusercontent.com/Sumon-Kayal/Universal-Batoto-Image-Fixer/2e67e82bbedff45aa15b973c0d422d18afca46e9/Fixer%20v8.0.js)
   *   **OR**
   *   [Pastebin Raw](https://pastebin.com/raw/c0mBHwtH)

---

## 📖 Usage

1. Install the extension or userscript.
2. Navigate to **bato.to**, **bato.cc**, or any supported mirror.
3. When images fail to load, the script will **automatically** try alternate roots and subdomains.
4. **No additional configuration is required.**

**Example**: If an image URL on `mbdny.org` returns a 404 error, the script automatically attempts other configured domains and variant prefixes until a working image is found.

---

## ⚙️ Technical Details

### Fallback Roots

The script probes the following domains:

| Domain | Status |
|--------|--------|
| `bato.to` | Active |
| `mbdny.org` | Active |
| `mbrtz.org` | Active |
| `mbwbm.org` | Active |
| `mbznp.org` | Active |
| `mbqgu.org` | Active |
| `mpfip.org` | Active |
| `mpizz.org` | Active |
| `mpmok.org` | Active |
| `mpqom.org` | Active |
| `mpqsc.org` | Active |
| `mprnm.org` | Active |
| `mpubn.org` | Active |
| `mpujj.org` | Active |
| `mpvim.org` | Active |
| `mpypl.org` | Active |

### How It Works

When an image fails to load, the algorithm:

1. **Identifies** the current broken domain/subdomain.
2. **Cycles** through the Fallback Roots list.
3. **Probes** candidate URLs by swapping subdomain prefixes (e.g., v3, v7, v3x).
4. **Replaces** the broken `src` with the first successful mirror found.

### Compatibility & Requirements

- **Browser**: Chrome/Chromium/Edge (MV3) and Firefox (WebExtensions).
- **Manifest V3**: Fully compliant with the latest Chrome standards.
- **JavaScript**: Compatible with modern browsers (v8.1 recommended).
- **Lazy Loading**: Works with Bato's native lazy-loading and "Long Strip" reading modes.
- **Userscript**: Requires Tampermonkey or a compatible manager.

---

## ❓ Troubleshooting & FAQ

**Q: Images still show as broken?**  
A: Ensure no other "Image Blocker" or "Data Saver" extensions are interfering. Try refreshing the page after installation.

**Q: Does this collect my data?**  
A: No. The script runs entirely locally in your browser. It only communicates with Batoto image mirrors.

**Q: Comment avatars are still broken?**  
A: Avatars use different server logic. Try using `bato.cc/v3x` or `bato.si` for better profile image support.

**Q: The website shows "404 Not Found" (nginx/1.20.1) or similar errors?**
A: This is often due to regional blocking, ISP restrictions, or temporary mirror issues on Batoto. Try switching to alternative mirrors like bato.si or bato.ing. If that doesn't work, use a third-party VPN (such as Proton VPN) and avoid connecting to Japanese servers, as they may trigger additional restrictions or blocks.

**Q: How do I debug issues?**  
A: Open DevTools (F12) → Console and look for logs prefixed by "Universal Batoto Image Fixer".

**Q: Found a bug?**  
A: Report it on the [Batoto Subreddit](https://www.reddit.com/r/batoto) or open an [Issue on GitHub](https://github.com/Sumon-Kayal/Universal-Batoto-Image-Fixer/issues).

---

## 🤝 Contributing
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/YourFeature`).
3. Commit your changes with clear messages.
4. Keep `manifest.json` and `fixer.js` versions in sync.
5. Open a Pull Request with a clear description.

For larger changes, open an issue first to discuss.

---

## 📜 License

Licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

• **Author**: Sumon Kayal
• **Disclaimer**: This project is not affiliated with Bato.to. It is a community-driven tool to improve accessibility.

---

## 📇 Contact

**Email**: sumankayalsuman4@proton.me  
**Author**: Sumon Kayal  
**Repository**: [GitHub - Universal Batoto Image Fixer](https://github.com/Sumon-Kayal/Universal-Batoto-Image-Fixer)
