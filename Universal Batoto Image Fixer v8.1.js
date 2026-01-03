// ==UserScript==
// @name         Universal Batoto Image Fixer
// @namespace    http://tampermonkey.net/
// @author       Umbrella_Corporation
// @version      8.1
// @description  Fixes broken Batoto images using an advanced hybrid engine that rewrites k/kXX hosts to n/nXX, performs background server probing, and applies smart prioritization. Optimized for Firefox and Chromium-based browsers with banner-safe handling, proper srcset support, smart number retention, and strong cross-browser stability.
// @downloadURL  https://raw.githubusercontent.com/Sumon-Kayal/Universal-Batoto-Image-Fixer/refs/heads/main/Universal%20Batoto%20Image%20Fixer%20v8.1.js
// @updateURL    https://raw.githubusercontent.com/Sumon-Kayal/Universal-Batoto-Image-Fixer/refs/heads/main/Universal%20Batoto%20Image%20Fixer%20v8.1.js
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @connect      pastebin.com
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bato.to
// @match        *://ato.to/*
// @match        *://dto.to/*
// @match        *://fto.to/*
// @match        *://hto.to/*
// @match        *://jto.to/*
// @match        *://lto.to/*
// @match        *://mto.to/*
// @match        *://nto.to/*
// @match        *://vto.to/*
// @match        *://wto.to/*
// @match        *://xto.to/*
// @match        *://yto.to/*
// @match        *://kuku.to/*
// @match        *://okok.to/*
// @match        *://ruru.to/*
// @match        *://xdxd.to/*
// @match        *://vba.to/*
// @match        *://wba.to/*
// @match        *://xba.to/*
// @match        *://yba.to/*
// @match        *://zba.to/*
// @match        *://bato.ac/*
// @match        *://bato.bz/*
// @match        *://bato.cc/*
// @match        *://bato.cx/*
// @match        *://bato.id/*
// @match        *://bato.pw/*
// @match        *://bato.sh/*
// @match        *://bato.si/*
// @match        *://bato.to/*
// @match        *://bato.vc/*
// @match        *://bato.day/*
// @match        *://bato.ing/*
// @match        *://bato.red/*
// @match        *://bato.run/*
// @match        *://batoto.in/*
// @match        *://batoto.tv/*
// @match        *://xbato.com/*
// @match        *://xbato.net/*
// @match        *://xbato.org/*
// @match        *://zbato.com/*
// @match        *://zbato.net/*
// @match        *://zbato.org/*
// @match        *://batpub.com/*
// @match        *://battwo.com/*
// @match        *://comiko.net/*
// @match        *://comiko.org/*
// @match        *://batotoo.com/*
// @match        *://batotwo.com/*
// @match        *://batread.com/*
// @match        *://readtoto.com/*
// @match        *://readtoto.net/*
// @match        *://readtoto.org/*
// @match        *://batocomic.com/*
// @match        *://batocomic.net/*
// @match        *://batocomic.org/*
// @match        *://mangatoto.com/*
// @match        *://mangatoto.net/*
// @match        *://mangatoto.org/*
// ==/UserScript==

/*
===================== Universal Batoto Image Fix - Complete Changelog =====================

v8.1   – Community Stability Release (2026-01-03):
       – FIXED: Critical syntax error in CONFIG object (missing comma after UPDATE_URL).
       – FIXED: Multiple broken template string literals using \( { } syntax.
       – FIXED: Undefined variables by initializing all required constants:
       - Added SUBDOMAIN_RE and HOST_RE regex patterns
       - Initialized processingImages (Set), serverCache (Map), failedCache (Set)
       - Defined MAX_ATTEMPTS and ENABLE_EAGER_ON_INITIAL
       – FIXED: Undefined Utils object with proper log, error, and isRemoteNewer methods.
       – CONVERTED: All template literals to string concatenation for broader compatibility.
       – RESULT: Script is now syntactically valid and executes without ReferenceErrors.
       – PRESERVED: Original Pastebin UPDATE_URL unchanged.
       – Full backward compatibility with v8.0 features maintained.
       
v8.0   – ULTIMATE MERGED EDITION (2025-12-25):
       – MERGED: All features from v7.0 (Hybrid Probe) and v5.8 (Browser Optimizations).
       – INCLUDES: Advanced probing logic with server pattern caching.
       – INCLUDES: Candidate generation with smart priority levels.
       – INCLUDES: Background probe verification before URL switching.
       – INCLUDES: Failed server caching to avoid redundant attempts.
       – INCLUDES: Browser-specific optimizations (Firefox 15s / Chromium 2s intervals).
       – INCLUDES: Smart number retention from v5.8.
       – INCLUDES: Critical race condition fixes (listener before rewrite).
       – INCLUDES: Eager loading enforcement for Chromium optimization.
       – INCLUDES: Aggressive periodic fixer for .mb and .mp domains.
       – INCLUDES: Srcset rewriting with cached working servers.
       – INCLUDES: Complete domain coverage (80+ domain patterns).
       – Full compatibility with Firefox, Chromium, Edge, and mobile browsers.

v7.0   – HYBRID PROBE ENGINE (2025-12-24):
       – MERGED: Advanced Probing Logic with server pattern caching.
       – NEW: Candidate generation with priority levels (0-5).
       – NEW: Background "Probe" verification (tests URLs before switching).
       – NEW: Failed server caching to avoid redundant 404/timeout attempts.
       – IMPROVED: Srcset rewriting now uses cached working server patterns.

v6.0   – Expanded Domain Support (2025-12-24):
       – ADDED: Support for .mbdny, .mbrtz, .mbwbm, .mbznp, .mbqgu.
       – ADDED: Support for .mpfip, .mpizz, .mpmok, .mpqom, .mpqsc, .mprnm, .mpubn, .mpujj, .mpvim, .mpypl.
       – UPDATED: Aggressive fixer targets both .mb and .mp domain structures.

v5.8   – Add support for Firefox v146 (2024-12-24).

v5.7   – Firefox Optimization Release (2025-12-24):
       – NEW: Browser detection for Firefox vs Chromium-based.
       – Firefox Mode: Adaptive aggressive fixer with 15s interval (vs 2s for Chromium).
       – Firefox Mode: Selective eager loading only on error recovery (not initial).
       – Chromium Mode: Original aggressive behavior unchanged.
       – Maintains full compatibility with both browser engines.
       – No performance penalty on Chromium; significant improvement on Firefox.

v5.6   – Final Merged Release (2025-12-24):
       – Combined features from v5.5 Beta, v5.3 Release, and v4.2 Chromium Tuned.
       – INCLUDES: Aggressive 'n' mirror enforcement (from v5.5).
       – INCLUDES: Priority Brute-Force with Smart Number Retention (from v5.3).
       – INCLUDES: Critical race condition fix (listener before rewrite).
       – INCLUDES: Eager loading enforcement for Chromium/V8 optimization.
       – INCLUDES: Aggressive periodic fixer for .mb domains.
       – ADDED: Support for new mirror domain bato.ing.
       – Final stable version with all features merged.

v5.5   – Aggressive Periodic Fixer (2025-12-24 Beta):
       – Runs every 2 seconds to catch missed images.
       – Targets .mb domains specifically (mbtmv.org).
       – Fixes background-image CSS properties.

v5.3.1 – Critical fix for tamperonkey (2025-12-23).

v5.3   – Critical Race Condition Fix (2025-12-22):
       – CRITICAL: Listener now attached BEFORE src rewrite.
       – Original URL stored in data-btfx-orig for recovery.
       – Numeric version comparison for updates.
       – Smart number retention preserved.

v5.2.1 – Changelog Rearrangement (2025-12-16).

v5.2   – Updater and Version Alignment (2025-12-16):
       – Aligned internal version constant.
       – Corrected UPDATE_URL to Pastebin.

v5.1   – Browser Support Documentation (2025-12-16):
       – Added list of unsupported browsers in description.

v5.0.1 – Version Description Fix (2025-12-16).

v5.0   – Final Release (2025-12-16):
       – Full feature parity with v4.9.

v4.9   – Latest Stable Release (2025-12-15):
       – Full compatibility with Microsoft Edge for Android.
       – Full compatibility with Waterfox for Android.
       – Confirmed no breakage with AdGuard and uBlock Origin.
       – Improved resilience against content-blocking.

v4.8   – Internal Testing (2025-12-15):
       – Testing with Waterfox and Microsoft Edge for Android.

v4.7   – Core Overhaul & Unification (2025-12-15):
       1. OPTIMIZED: Fixed memory leaks and recursion stack overflows.
       2. ADDED: Full support for Cromite (Android).
       3. MERGED: Aggressive 'n' Enforcement (v4.5) with Smart Number Retention (v4.6).
       4. SAFETY: Added explicit checks for unsupported browsers.

v4.6   – Smart Number Retention (2025-12-15):
       1. Preserves original node numbers (e.g., 08) during swaps (Fixes mbtmv.org).
       2. Expanded node search (00-10).
       3. 'k' mirror promoted to High Priority.

v4.5   – Aggressive 'n' Enforcement (2025-12-15):
       – Foundation for aggressive 'n' mirror targeting.

v4.2   – Priority Brute Force (2025-12-15):
       – Reordered mirror search to try common servers (m, p, w, a) first.
       – Eager Loading: Forces 'loading="eager"' during recovery.
       – V8 Optimization: Direct property access for max speed.

v4.1   – Chrome Opt (2025-12-15):
       – Removed Firefox safety wrappers.

v3.9   – Internal Testing & removed firefox support (2025-12-15).

v3.7   – Internal testing across multiple browser (2025-12-15).

v3.6   – Unified milestone release (2025-12-15):
       – Incorporates final unified core architecture.
       – Mirror alignment cleanup.
       – Firefox-safe execution model.
       – Conditional v1.9.1 hybrid recovery logic.
       – Full mirror coverage.
       – Optional non-intrusive Pastebin updater.
       – Removal of always-on retry behavior.

v3.0   – Major refactor experiments and hybrid architecture exploration (2025-12-15).

v2.6   – Hybrid engine + updater attempts (2025-12-15).

v2.3   – Stability fixes (2025-12-15).

v2.0   – Hybrid concept introduced (2025-12-15).

v1.9.1 – Hybrid update integrating fixes from redditor "mindlesstourist3" (2025-12-15):
       – Host rotation.
       – Retry/backoff.
       – Broken-image detection.

v1.9   – Metadata fixes, stronger attribute handling, improved srcset support (2025-12-15).

v1.8   – bato.si + mirror expansion (2025-12-15).

v1.7   – Dynamic DOM handling (2025-12-15).

v1.6   – Observer optimizations (2025-12-15).

v1.5   – Community mirror expansion (2025-12-14).

v1.4   – Critical banner fix (property-level img.src) (2025-12-13).

v1.3   – MutationObserver introduced (2025-12-12).

v1.2   – Attribute safety (2025-12-11).

v1.1   – Minor fixes (2025-12-10).

v1.0   – Initial k→n replacement (2025-12-09).

========================================================================================
*/

(function () {
  'use strict';

  if (window.__BTFX_LOADED__) return;
  window.__BTFX_LOADED__ = true;

  /* ==================== CONSTANTS & STATE ==================== */
  const SUBDOMAIN_RE = /^https?:\/\/([a-zA-Z])(\d{1,3})\.([a-z0-9-]+)\.([a-z]{2,4})(\/.*)$/i;
  const HOST_RE = /^(https?:\/\/)k(\d{1,3}\.[a-z0-9-]+\.[a-z]{2,4})(\/.*)$/i;

  const MAX_ATTEMPTS = 20;

  const processingImages = new Set();
  const serverCache = new Map();
  const failedCache = new Set();

  /* ==================== CONFIGURATION ==================== */
  const CONFIG = {
    VERSION: '8.1',
    UPDATE_URL: 'https://pastebin.com/raw/c0mBHwtH',

    // Browser detection
    IS_FIREFOX: /Firefox\/(\d+)/.test(navigator.userAgent),
    IS_CHROMIUM: /Chrome\/|Chromium\/|Edg\/|OPR\//.test(navigator.userAgent),

    // Timing
    PROBE_TIMEOUT: 5000,
    RETRY_DELAY: 1000,
    AGGRESSIVE_INTERVAL: null,

    // Cache
    CACHE_EXPIRY_MS: 300000,
    FAILED_CACHE_EXPIRY_MS: 180000,

    // Fallbacks
    FALLBACK_PREFIXES: ['n', 'x', 't', 's', 'w', 'm', 'c', 'u'],
    FALLBACK_ROOTS: [
      'mbdny.org', 'mbrtz.org', 'mbwbm.org', 'mbznp.org', 'mbqgu.org',
      'mpfip.org', 'mpizz.org', 'mpmok.org', 'mpqom.org', 'mpqsc.org',
      'mprnm.org', 'mpubn.org', 'mpujj.org', 'mpvim.org', 'mpypl.org'
    ],

    // Features
    ENABLE_EAGER_LOADING: true,
    ENABLE_EAGER_ON_INITIAL: true,
    ENABLE_DEBUG: false
  };

  CONFIG.AGGRESSIVE_INTERVAL = CONFIG.IS_FIREFOX ? 15000 : 5000;

  /* ==================== UTILS ==================== */
  const Utils = {
    log: (...args) => CONFIG.ENABLE_DEBUG && console.log('[BTFX]', ...args),
    error: (...args) => console.error('[BTFX]', ...args),
    isRemoteNewer: function(remote, local) {
      const a = String(remote).split('.').map(n => parseInt(n, 10) || 0);
      const b = String(local).split('.').map(n => parseInt(n, 10) || 0);
      const len = Math.max(a.length, b.length);
      for (let i = 0; i < len; i++) {
        const na = a[i] || 0;
        const nb = b[i] || 0;
        if (na > nb) return true;
        if (na < nb) return false;
      }
      return false;
    }
  };

  function parseSubdomain(src) {
    if (!src) return null;
    const m = src.match(SUBDOMAIN_RE);
    if (!m) return null;
    return {
      prefix: m[1].toLowerCase(),
      number: parseInt(m[2], 10),
      root: m[3].toLowerCase(),
      tld: m[4].toLowerCase(),
      path: m[5]
    };
  }

  function probeUrl(url, timeout = CONFIG.PROBE_TIMEOUT) {
    return new Promise((resolve, reject) => {
      const cacheKey = url.split('/').slice(0, 3).join('/');
      if (failedCache.has(cacheKey)) return reject('cached-fail');

      const img = new Image();
      img.referrerPolicy = "no-referrer";
      let timedOut = false;

      const t = setTimeout(() => {
        timedOut = true;
        img.src = "";
        failedCache.add(cacheKey);
        reject('timeout');
      }, timeout);

      img.onload = () => {
        if (!timedOut) {
          clearTimeout(t);
          if (img.width > 1 || img.height > 1) resolve(true);
          else {
            failedCache.add(cacheKey);
            reject('empty');
          }
        }
      };

      img.onerror = () => {
        if (!timedOut) {
          clearTimeout(t);
          failedCache.add(cacheKey);
          reject('error');
        }
      };

      img.src = url;
    });
  }

  function quickFixURL(url) {
    if (typeof url !== 'string') return url;
    return url.replace(HOST_RE, '$1n$2$3');
  }

  /* ==================== CANDIDATE GENERATION ==================== */
  function generateCandidates(parsed) {
    const candidates = [];
    const pathKey = parsed.path.split('/').slice(0, 3).join('/');

    const add = (prefix, number, root, tld, priority) => {
      const url = 'https://' + prefix + String(number).padStart(2, '0') + '.' + root + '.' + tld + parsed.path;
      candidates.push({ url, priority });
    };

    // Cached working server first (priority 0)
    const cacheKey = parsed.root + '-' + pathKey;
    if (serverCache.has(cacheKey)) {
      const cached = serverCache.get(cacheKey);
      add(cached.prefix, cached.number, cached.root, cached.tld, 0);
    }

    // High priority: common fixes when original is 'k'
    if (parsed.prefix === 'k') {
      add('n', parsed.number, parsed.root, parsed.tld, 1);
      add('x', parsed.number, parsed.root, parsed.tld, 1);
    }

    // Other prefix fallbacks
    CONFIG.FALLBACK_PREFIXES.forEach(letter => {
      if (letter !== parsed.prefix) {
        add(letter, parsed.number, parsed.root, parsed.tld, 2);
      }
    });

    // Same prefix, different numbers
    [1, 2, 3, 4, 5, 0, 8, 10].forEach(i => {
      if (i !== parsed.number) {
        add(parsed.prefix, i, parsed.root, parsed.tld, 3);
      }
    });

    // Different roots (fallback domains)
    CONFIG.FALLBACK_ROOTS.forEach(root => {
      const [r, t] = root.split('.');
      if (r !== parsed.root) {
        add(parsed.prefix, parsed.number, r, t, 4);
      }
    });

    // Dedupe, sort by priority, limit
    const seen = new Set();
    return candidates
      .sort((a, b) => a.priority - b.priority)
      .filter(c => {
        if (seen.has(c.url)) return false;
        seen.add(c.url);
        return true;
      })
      .map(c => c.url)
      .slice(0, MAX_ATTEMPTS);
  }

  /* ==================== CORE ENGINES ==================== */
  function rewriteSrcset(srcset, workingUrl) {
    if (!srcset) return null;
    const p = parseSubdomain(workingUrl);
    if (!p) return null;
    const newBase = 'https://' + p.prefix + String(p.number).padStart(2, '0') + '.' + p.root + '.' + p.tld;
    return srcset.replace(/https?:\/\/[a-zA-Z]+\d{1,3}\.[a-z0-9-]+\.[a-z]{2,4}/gi, newBase);
  }

  async function advancedFixImage(img, isRetry = false) {
    if (processingImages.has(img) || img.dataset.btfxStatus === "done") return;

    processingImages.add(img);
    img.dataset.btfxStatus = "probing";

    const parsed = parseSubdomain(img.src);
    if (!parsed) {
      processingImages.delete(img);
      return;
    }

    const candidates = generateCandidates(parsed);
    let lastError = null;

    for (const url of candidates) {
      const serverPattern = url.split('/').slice(0, 3).join('/');
      if (failedCache.has(serverPattern)) continue;

      try {
        await probeUrl(url);

        const successParsed = parseSubdomain(url);
        const pathKey = parsed.path.split('/').slice(0, 3).join('/');
        serverCache.set(parsed.root + '-' + pathKey, successParsed);

        img.referrerPolicy = "no-referrer";
        img.src = url;
        if (img.srcset) {
          const newSet = rewriteSrcset(img.srcset, url);
          if (newSet) img.srcset = newSet;
        }

        if (CONFIG.ENABLE_EAGER_LOADING) img.loading = "eager";

        img.dataset.btfxStatus = "done";
        processingImages.delete(img);
        return;
      } catch (e) {
        lastError = e;
      }
    }

    // Retry once on timeout
    if (!isRetry && lastError === 'timeout') {
      setTimeout(() => advancedFixImage(img, true), CONFIG.RETRY_DELAY);
    }

    processingImages.delete(img);
  }

  function preemptiveQuickFix(img) {
    if (img.dataset.btfxStatus) return;

    const parsed = parseSubdomain(img.src);
    if (!parsed || parsed.prefix !== 'k') return;

    const newUrl = 'https://n' + String(parsed.number).padStart(2, '0') + '.' + parsed.root + '.' + parsed.tld + parsed.path;

    img.dataset.btfxOrig = img.src;
    img.referrerPolicy = "no-referrer";
    img.src = newUrl;

    if (CONFIG.IS_CHROMIUM && CONFIG.ENABLE_EAGER_ON_INITIAL) img.loading = 'eager';
    img.dataset.btfxStatus = "preemptive";

    // If it fails to load after a delay, fall back to advanced probing
    setTimeout(() => {
      if (img.complete && img.naturalWidth === 0) {
        advancedFixImage(img);
      }
    }, 2000);
  }

  function rewrite(img) {
    let touched = false;
    const attributes = ['src', 'data-src', 'srcset'];

    for (const attr of attributes) {
      const value = img.getAttribute(attr);
      if (!value) continue;

      if (attr === 'srcset') {
        const newValue = value.split(',').map(part => {
          const parts = part.trim().split(/\s+/);
          const fixed = quickFixURL(parts[0]);
          if (fixed !== parts[0]) {
            parts[0] = fixed;
            touched = true;
          }
          return parts.join(' ');
        }).join(', ');
        if (newValue !== value) img.setAttribute(attr, newValue);
      } else {
        const fixed = quickFixURL(value);
        if (fixed !== value) {
          img.setAttribute(attr, fixed);
          touched = true;
        }
      }
    }

    if (touched) {
      img.referrerPolicy = 'no-referrer';
      if (CONFIG.ENABLE_EAGER_ON_INITIAL) img.loading = 'eager';
    }

    return touched;
  }

  /* ==================== DOM HANDLING ==================== */
  const scan = (root = document) => {
    const imgs = root instanceof HTMLImageElement ? [root] : root.querySelectorAll('img');
    imgs.forEach(img => {
      if (img.dataset.btfxStatus === "done") return;

      if (!img.dataset.btfxAttached) {
        img.dataset.btfxAttached = "1";
        img.addEventListener('error', () => advancedFixImage(img), { once: true });
      }

      preemptiveQuickFix(img);
      rewrite(img);

      if (img.complete && img.naturalWidth === 0) {
        advancedFixImage(img);
      }
    });
  };

  const observer = new MutationObserver(mutations => {
    mutations.forEach(m => {
      m.addedNodes.forEach(node => {
        if (node.nodeType === 1) scan(node);
      });
      if (m.type === 'attributes' && m.target.tagName === 'IMG') {
        if (!m.target.dataset.btfxStatus) scan(m.target);
      }
    });
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['src', 'srcset', 'data-src']
  });

  /* ==================== AGGRESSIVE PERIODIC FIXER ==================== */
  setInterval(() => {
    requestAnimationFrame(() => {
      document.querySelectorAll('img').forEach(img => {
        const src = img.getAttribute('src');
        if (src && (src.includes('.mb') || src.includes('.mp')) && src.includes('//k')) {
          img.src = src.replace(/\/\/k(?=\d+)/ig, '//n');
        }
      });

      document.querySelectorAll('[style*="url"]').forEach(el => {
        const bg = el.style.backgroundImage;
        if (bg && (bg.includes('.mb') || bg.includes('.mp')) && bg.includes('//k')) {
          el.style.backgroundImage = bg.replace(/\/\/k(?=\d+)/ig, '//n');
        }
      });
    });
  }, CONFIG.AGGRESSIVE_INTERVAL);

  /* ==================== AUTO-UPDATER ==================== */
  const Updater = {
    check(manual = false) {
      if (typeof GM_xmlhttpRequest === 'undefined') return;

      GM_xmlhttpRequest({
        method: 'GET',
        url: CONFIG.UPDATE_URL,
        timeout: 10000,
        onload: (response) => {
          try {
            const match = (response.responseText || '').match(/@version\s+([0-9.]+)/i);
            if (match && Utils.isRemoteNewer(match[1], CONFIG.VERSION)) {
              if (confirm('[BTFX] Update available: v' + CONFIG.VERSION + ' → v' + match[1] + '\n\nOpen update page?')) {
                window.open(CONFIG.UPDATE_URL, '_blank');
              }
            } else if (manual) {
              alert('[BTFX] v' + CONFIG.VERSION + ' is up to date\nBrowser: ' + (CONFIG.IS_FIREFOX ? 'Firefox' : 'Chromium') + '-optimized\nCache size: ' + serverCache.size);
            }
          } catch (err) {
            Utils.error('Update check failed:', err);
          }
        },
        onerror: () => manual && alert('[BTFX] Update check failed - network error'),
        ontimeout: () => manual && alert('[BTFX] Update check failed - timeout')
      });
    }
  };

  setTimeout(() => Updater.check(), 5000);

  if (typeof GM_registerMenuCommand === 'function') {
    GM_registerMenuCommand('BTFX: Check for Updates', () => Updater.check(true));
    GM_registerMenuCommand('BTFX: Clear Cache', () => {
      serverCache.clear();
      failedCache.clear();
      alert('[BTFX] Cache cleared\nReload the page to rescan images.');
    });
  }

  /* ==================== INITIALIZATION ==================== */
  function init() {
    Utils.log('Initialized v' + CONFIG.VERSION + ' (' + (CONFIG.IS_FIREFOX ? 'Firefox' : 'Chromium') + ' mode)');
    scan();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();