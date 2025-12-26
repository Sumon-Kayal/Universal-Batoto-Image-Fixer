/**
 * Universal Batoto Image Fixer — Merged Final (v8.1)
 * MIT License header included below — see LICENSE file in repo.
 *
 * Features:
 * - Prevents multiple injections
 * - Preemptive 'k' -> 'n' swap to reduce flicker
 * - Background probing of candidate mirrors (with timeout & caching)
 * - Remember working servers per chapter/path to speed future fixes
 * - Handles srcset rewriting and background-image fixes
 * - MutationObserver + periodic aggressive scan for infinite scroll
 *
 * Dataset key used: img.dataset.batoFixStatus
 * Status values: "probing", "preemptive", "done", "failed", "retry"
 */

/*
MIT License

Copyright (c) 2025 Sumon-Kayal

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
[...full MIT text present in LICENSE file...]
*/

(() => {
  'use strict';

  // Prevent multiple injections
  if (window.__BATO_IMAGE_FIXER_LOADED__) return;
  window.__BATO_IMAGE_FIXER_LOADED__ = true;

  // --- CONFIGURATION ---
  const PROBE_TIMEOUT = 3500;      // ms to wait for a probe image to load
  const MAX_ATTEMPTS = 20;         // max candidate probe attempts
  const MAX_SERVER_NUM = 15;       // server numbers to iterate 00-15
  const RETRY_DELAY = 1000;        // ms before a retry attempt
  const IS_FIREFOX = navigator.userAgent.includes('Firefox');
  const AGGRESSIVE_INTERVAL = IS_FIREFOX ? 8000 : 2000;

  // The only fallback roots (as requested)
  const FALLBACK_ROOTS = [
    'mbdny.org',
    'mbrtz.org',
    'bato.to',
    'mbwbm.org',
    'mbznp.org',
    'mbqgu.org'
  ];

  // Other prefixes to try after primary 'n' attempts (less priority)
  const FALLBACK_PREFIXES = ['x', 't', 'w', 'm', 'c'];

  // Regex to parse subdomain-based image URLs:
  // captures: prefix, number, root, tld, path
  const SUBDOMAIN_RE = /^https?:\/\/([a-z]+)(\d{1,3})\.([a-z0-9\-]+)\.([a-z]{2,6})(\/.*)$/i;

  // --- CACHES & STATE ---
  const serverCache = new Map(); // key: `${root}-${pathKey}` -> { prefix, number, root, tld }
  const failedCache = new Set(); // stores known-dead server base strings like "https://n03.mbxxx.org"
  const processingImages = new WeakSet();

  // --- UTILITIES ---
  function parseSubdomain(src) {
    if (!src || typeof src !== 'string') return null;
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

  function makeServerBase(parsed) {
    return `https://${parsed.prefix}${String(parsed.number).padStart(2, '0')}.${parsed.root}.${parsed.tld}`;
  }

  // Probe a URL by loading it into an Image object (no-referrer)
  function probeUrl(url, timeout = PROBE_TIMEOUT) {
    return new Promise((resolve, reject) => {
      try {
        const serverBase = url.split('/').slice(0, 3).join('/');
        if (failedCache.has(serverBase)) return reject('cached-fail');

        const img = new Image();
        img.referrerPolicy = 'no-referrer';
        let timedOut = false;

        const t = setTimeout(() => {
          timedOut = true;
          img.src = '';
          failedCache.add(serverBase);
          reject('timeout');
        }, timeout);

        img.onload = () => {
          if (!timedOut) {
            clearTimeout(t);
            // Avoid 1x1 trackers / error placeholders
            if (img.width > 1 || img.height > 1) resolve(true);
            else {
              failedCache.add(serverBase);
              reject('empty');
            }
          }
        };

        img.onerror = () => {
          if (!timedOut) {
            clearTimeout(t);
            failedCache.add(serverBase);
            reject('error');
          }
        };

        img.src = url;
      } catch (ex) {
        reject('exception');
      }
    });
  }

  // Create a path key grouping (useful to cache working server per chapter)
  function makePathKey(parsed) {
    if (!parsed || !parsed.path) return '';
    return parsed.path.split('/').slice(0, 3).join('/');
  }

  // Rewrite srcset attributes to match a working server base
  function rewriteSrcset(srcset, workingUrl) {
    if (!srcset || !workingUrl) return null;
    const p = parseSubdomain(workingUrl);
    if (!p) return null;
    const newBase = `https://${p.prefix}${String(p.number).padStart(2, '0')}.${p.root}.${p.tld}`;
    // Replace any full-url bases with the new base
    return srcset.replace(/https?:\/\/[a-z]+\d{1,3}\.[a-z0-9\-]+\.[a-z]{2,6}/gi, newBase);
  }

  // --- CANDIDATE GENERATION ---
  function generateCandidates(parsed) {
    if (!parsed) return [];
    const candidates = [];
    const pathKey = makePathKey(parsed);

    const add = (p, n, r, t, priority = 5) => {
      // Strict: ensure prefix is alphabetical, but we allow broader prefixes after initial attempts
      if (!p || !/^[a-z]+$/.test(p)) return;
      const url = `https://${p}${String(n).padStart(2, '0')}.${r}.${t}${parsed.path}`;
      candidates.push({ url, priority });
    };

    const cacheKey = `${parsed.root}-${pathKey}`;
    // Priority 0: cached working server for this chapter/path
    if (serverCache.has(cacheKey)) {
      const cached = serverCache.get(cacheKey);
      add(cached.prefix, cached.number, cached.root, cached.tld, 0);
    }

    // Priority 1: simple prefix swap between 'k' and 'n'
    if (parsed.prefix === 'k') {
      add('n', parsed.number, parsed.root, parsed.tld, 1);
    } else {
      add('k', parsed.number, parsed.root, parsed.tld, 1);
      add('n', parsed.number, parsed.root, parsed.tld, 1);
    }

    // Priority 2: load-balance across 'n' servers (00..MAX_SERVER_NUM)
    for (let i = 0; i <= MAX_SERVER_NUM; i++) {
      if (i !== parsed.number) {
        add('n', i, parsed.root, parsed.tld, 2);
      }
    }

    // Priority 3: try other fallback prefixes on same root (lesser priority)
    for (const p of FALLBACK_PREFIXES) {
      if (p !== parsed.prefix && p !== 'n') {
        add(p, parsed.number, parsed.root, parsed.tld, 3);
      }
    }

    // Priority 4: try fallback roots with 'n' prefix (mirrors) - only the listed FALLBACK_ROOTS
    FALLBACK_ROOTS.forEach(root => {
      const parts = root.split('.');
      if (parts.length === 2 && parts[0] !== parsed.root) {
        add('n', parsed.number, parts[0], parts[1], 4);
      }
    });

    // Consolidate and sort by priority, remove duplicates
    const seen = new Set();
    const sorted = candidates
      .sort((a, b) => a.priority - b.priority)
      .map(c => c.url)
      .filter(url => {
        if (seen.has(url)) return false;
        seen.add(url);
        return true;
      });

    return sorted.slice(0, MAX_ATTEMPTS);
  }

  // --- FIXING LOGIC ---
  async function fixImage(img, isRetry = false) {
    if (!img || processingImages.has(img)) return;
    // If already marked done, don't redo
    if (img.dataset.batoFixStatus === 'done') return;

    processingImages.add(img);
    img.dataset.batoFixStatus = 'probing';

    const parsed = parseSubdomain(img.src);
    if (!parsed) {
      processingImages.delete(img);
      return;
    }

    const candidates = generateCandidates(parsed);
    let lastError = null;

    for (let i = 0; i < candidates.length; i++) {
      const url = candidates[i];
      const serverBase = url.split('/').slice(0, 3).join('/');

      if (failedCache.has(serverBase)) continue;

      try {
        await probeUrl(url, PROBE_TIMEOUT);

        // success: cache this server for the chapter/path
        const successParsed = parseSubdomain(url);
        if (successParsed) {
          const pathKey = makePathKey(parsed);
          const cacheKey = `${parsed.root}-${pathKey}`;
          serverCache.set(cacheKey, {
            prefix: successParsed.prefix,
            number: successParsed.number,
            root: successParsed.root,
            tld: successParsed.tld
          });
        }

        // Apply changes
        img.referrerPolicy = 'no-referrer';
        // Preserve original for possible revert
        if (!img.dataset.batoOrigSrc) img.dataset.batoOrigSrc = img.src;
        img.src = url;

        if (img.srcset) {
          if (!img.dataset.batoOrigSrcset) img.dataset.batoOrigSrcset = img.srcset;
          const newSet = rewriteSrcset(img.srcset, url);
          if (newSet) img.srcset = newSet;
        }

        img.dataset.batoFixStatus = 'done';
        processingImages.delete(img);
        return;
      } catch (e) {
        lastError = e;
        // If many timeouts occur, bail early to avoid long hangs
        if (e === 'timeout' && i > 6) break;
      }
    }

    // If timed out and not yet retried, schedule a retry
    if (!isRetry && lastError === 'timeout') {
      img.dataset.batoFixStatus = 'retry';
      processingImages.delete(img);
      setTimeout(() => {
        // Only retry if still broken
        if (img.complete && img.naturalWidth === 0) {
          fixImage(img, true);
        }
      }, RETRY_DELAY);
      return;
    }

    img.dataset.batoFixStatus = 'failed';
    processingImages.delete(img);
  }

  // Preemptive quick swap for 'k' prefix to minimize flicker
  function preemptiveFix(img) {
    if (!img || img.dataset.batoFixStatus) return false; // skip if already touched
    const parsed = parseSubdomain(img.src);
    if (!parsed || parsed.prefix !== 'k') return false;

    const pathKey = makePathKey(parsed);
    const cacheKey = `${parsed.root}-${pathKey}`;

    let newPrefix = 'n';
    let newNumber = parsed.number;
    let newRoot = parsed.root;
    let newTld = parsed.tld;

    // Prefer cached working server if available
    if (serverCache.has(cacheKey)) {
      const cached = serverCache.get(cacheKey);
      if (cached && typeof cached.prefix === 'string') {
        newPrefix = cached.prefix;
        newNumber = cached.number;
        newRoot = cached.root;
        newTld = cached.tld;
      }
    }

    // Strict guard: only allow 'k' or 'n' as immediate switches; other prefixes are later priority
    if (newPrefix !== 'k' && newPrefix !== 'n') newPrefix = 'n';

    const newUrl = `https://${newPrefix}${String(newNumber).padStart(2, '0')}.${newRoot}.${newTld}${parsed.path}`;

    // Save originals to revert if necessary
    if (!img.dataset.batoOrigSrc) img.dataset.batoOrigSrc = img.src;
    if (img.srcset && !img.dataset.batoOrigSrcset) img.dataset.batoOrigSrcset = img.srcset;

    img.referrerPolicy = 'no-referrer';
    img.src = newUrl;
    if (img.srcset) {
      const newSet = rewriteSrcset(img.srcset, newUrl);
      if (newSet) img.srcset = newSet;
    }

    img.dataset.batoFixStatus = 'preemptive';

    // After a short delay, if it's still broken, trigger the full probe
    setTimeout(() => {
      if (img.complete && img.naturalWidth === 0) {
        // revert immediate swap before probing to avoid polluting caches
        if (img.dataset.batoOrigSrc) {
          img.src = img.dataset.batoOrigSrc;
          if (img.dataset.batoOrigSrcset) img.srcset = img.dataset.batoOrigSrcset;
        }
        img.dataset.batoFixStatus = '';
        fixImage(img);
      }
    }, 2000);

    return true;
  }

  // Check image status and trigger fixes where necessary
  function checkImage(img) {
    if (!img) return;

    // If preemptive fix was applied and still broken, proceed to full probe
    if (img.dataset.batoFixStatus === 'preemptive' && img.complete && img.naturalWidth === 0) {
      // revert then probe
      if (img.dataset.batoOrigSrc) {
        img.src = img.dataset.batoOrigSrc;
        if (img.dataset.batoOrigSrcset) img.srcset = img.dataset.batoOrigSrcset;
      }
      img.dataset.batoFixStatus = '';
      fixImage(img);
      return;
    }

    // Standard broken-image detection
    if (img.complete && img.naturalWidth === 0 && img.dataset.batoFixStatus !== 'done') {
      fixImage(img);
    }
  }

  // Process new images: attach listeners and apply preemptive fixes if appropriate
  function processNewImage(img) {
    if (!img || !(img instanceof HTMLImageElement)) return;
    // Avoid attaching multiple listeners
    if (!img.dataset.batoListenerAttached) {
      img.dataset.batoListenerAttached = '1';
      img.addEventListener('error', () => {
        // Slight delay to allow the browser to settle
        setTimeout(() => {
          if (img.dataset.batoFixStatus !== 'done') fixImage(img);
        }, 100);
      });
    }

    const parsed = parseSubdomain(img.src);
    if (!parsed) return;

    // Preemptive quick swap for 'k' prefix
    if (parsed.prefix === 'k') {
      preemptiveFix(img);
      // Also schedule a verification shortly after
      setTimeout(() => checkImage(img), 1500);
    } else {
      // If already complete but broken (e.g., loaded before script), check immediately
      setTimeout(() => checkImage(img), 1000);
    }
  }

  // Scan a subtree or a single image
  function scan(root = document) {
    if (!root) return;
    try {
      if (root instanceof HTMLImageElement) {
        processNewImage(root);
      } else {
        const imgs = root.querySelectorAll ? root.querySelectorAll('img') : [];
        imgs.forEach(img => processNewImage(img));
      }
    } catch (e) {
      // ignore potential cross-origin DOM issues
    }
  }

  // MutationObserver callback to handle dynamically added images and attribute changes
  const observer = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
      // Added nodes
      mutation.addedNodes.forEach(node => {
        if (node.nodeType !== 1) return;
        if (node.tagName === 'IMG') {
          processNewImage(node);
          setTimeout(() => checkImage(node), 1000);
        } else {
          // scan for nested imgs
          try {
            node.querySelectorAll && node.querySelectorAll('img').forEach(img => {
              if (!img.dataset.batoListenerAttached) {
                processNewImage(img);
                setTimeout(() => checkImage(img), 1000);
              }
            });
          } catch (e) {}
        }
      });

      // Attribute changes (src, srcset)
      if (mutation.type === 'attributes' &&
          (mutation.attributeName === 'src' || mutation.attributeName === 'srcset') &&
          mutation.target && mutation.target.tagName === 'IMG') {
        const img = mutation.target;
        // If the change was not made by this script, reset status and reprocess
        if (img.dataset.batoFixStatus !== 'done' && img.dataset.batoFixStatus !== 'preemptive') {
          img.dataset.batoFixStatus = '';
          setTimeout(() => {
            processNewImage(img);
            checkImage(img);
          }, 500);
        }
      }
    });
  });

  // Aggressive periodic scan to catch things MutationObserver misses (infinite scroll, delayed loads)
  const aggressiveScan = () => {
    requestAnimationFrame(() => {
      document.querySelectorAll('img').forEach(img => {
        // If it's a 'k' server on known mirror patterns, attempt preemptive or probes
        if (img.src && img.src.includes('//k') && (img.src.includes('.mb') || img.src.includes('.mp') || img.src.includes('.bato'))) {
          if (!img.dataset.batoFixStatus || img.dataset.batoFixStatus === '') preemptiveFix(img);
        }
        // Broken images that weren't yet fixed
        if (img.complete && img.naturalWidth === 0 && !processingImages.has(img) && img.dataset.batoFixStatus !== 'done') {
          const parsed = parseSubdomain(img.src);
          if (parsed) fixImage(img);
        }
      });

      // Background images that include 'k' prefix and mirror patterns
      document.querySelectorAll('[style*="url("]').forEach(el => {
        try {
          const bg = el.style.backgroundImage;
          if (!bg) return;
          // Replace //kNN.domain.tld with //nNN.domain.tld as a quick heuristic
          const replaced = bg.replace(/\/\/k(?=\d+)/ig, '//n');
          if (replaced !== bg) el.style.backgroundImage = replaced;
        } catch (e) {}
      });
    });
  };

  // Initialization
  function init() {
    // Initial scan of existing images
    scan(document);

    // Set up observer
    try {
      observer.observe(document.documentElement || document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['src', 'srcset']
      });
    } catch (e) {
      // fallback: observe body if documentElement not available
      try {
        observer.observe(document.body, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ['src', 'srcset']
        });
      } catch (e2) {}
    }

    // Periodic aggressive fixer
    setInterval(aggressiveScan, AGGRESSIVE_INTERVAL);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();