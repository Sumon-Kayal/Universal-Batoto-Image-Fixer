/**
 * Universal Batoto Image Fixer v8.2
 * MIT License
 * 
 * Advanced hybrid engine with intelligent probing, caching, and browser optimization
 * Optimized for Firefox and Chromium with comprehensive domain support
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

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

(() => {
  'use strict';

  // Prevent multiple injections
  if (window.__BATO_IMAGE_FIXER_LOADED__) return;
  window.__BATO_IMAGE_FIXER_LOADED__ = true;

  /* ==================== CONFIGURATION ==================== */
  const CONFIG = {
    VERSION: '8.2',
    
    // Browser detection
    IS_FIREFOX: /Firefox\/(\d+)/.test(navigator.userAgent),
    IS_CHROMIUM: /Chrome\/|Chromium\/|Edg\/|OPR\//.test(navigator.userAgent),

    // Timing optimizations
    PROBE_TIMEOUT: 5000,
    RETRY_DELAY: 1000,
    get AGGRESSIVE_INTERVAL() {
      return this.IS_FIREFOX ? 15000 : 5000;
    },

    // Limits
    MAX_ATTEMPTS: 20,
    MAX_SERVER_NUM: 15,

    // Cache settings
    CACHE_EXPIRY_MS: 300000,
    FAILED_CACHE_EXPIRY_MS: 180000,

    // Fallback configurations
    FALLBACK_PREFIXES: ['n', 'x', 't', 's', 'w', 'm', 'c', 'u'],
    FALLBACK_ROOTS: [
      'mbdny.org', 'mbrtz.org', 'mbwbm.org', 'mbznp.org', 'mbqgu.org',
      'mpfip.org', 'mpizz.org', 'mpmok.org', 'mpqom.org', 'mpqsc.org',
      'mprnm.org', 'mpubn.org', 'mpujj.org', 'mpvim.org', 'mpypl.org',
      'bato.to'
    ],

    // Features
    ENABLE_EAGER_LOADING: true,
    ENABLE_EAGER_ON_INITIAL: true,
    ENABLE_DEBUG: false
  };

  /* ==================== REGEX PATTERNS ==================== */
  const SUBDOMAIN_RE = /^https?:\/\/([a-zA-Z])(\d{1,3})\.([a-z0-9-]+)\.([a-z]{2,6})(\/.*)$/i;
  const HOST_RE = /^(https?:\/\/)k(\d{1,3}\.[a-z0-9-]+\.[a-z]{2,6})(\/.*)$/i;

  /* ==================== STATE MANAGEMENT ==================== */
  const state = {
    processingImages: new WeakSet(),
    serverCache: new Map(),
    failedCache: new Set(),
    cacheTimestamps: new Map()
  };

  /* ==================== UTILITIES ==================== */
  const Utils = {
    log(...args) {
      if (CONFIG.ENABLE_DEBUG) {
        console.log(`[BTFX v${CONFIG.VERSION}]`, ...args);
      }
    },
    
    error(...args) {
      console.error(`[BTFX v${CONFIG.VERSION}]`, ...args);
    },

    warn(...args) {
      console.warn(`[BTFX v${CONFIG.VERSION}]`, ...args);
    },
    
    parseSubdomain(src) {
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
    },

    quickFixURL(url) {
      if (typeof url !== 'string') return url;
      return url.replace(HOST_RE, '$1n$2$3');
    },

    makePathKey(parsed) {
      if (!parsed || !parsed.path) return '';
      return parsed.path.split('/').slice(0, 3).join('/');
    },

    padNumber(num) {
      return String(num).padStart(2, '0');
    },

    cleanExpiredCache() {
      const now = Date.now();
      
      // Clean failed cache
      for (const key of state.failedCache) {
        const timestamp = state.cacheTimestamps.get(key);
        if (timestamp && now - timestamp > CONFIG.FAILED_CACHE_EXPIRY_MS) {
          state.failedCache.delete(key);
          state.cacheTimestamps.delete(key);
        }
      }

      // Clean server cache
      for (const [key, value] of state.serverCache.entries()) {
        const timestamp = state.cacheTimestamps.get(key);
        if (timestamp && now - timestamp > CONFIG.CACHE_EXPIRY_MS) {
          state.serverCache.delete(key);
          state.cacheTimestamps.delete(key);
        }
      }
    }
  };

  /* ==================== PROBING ENGINE ==================== */
  const ProbeEngine = {
    async probe(url, timeout = CONFIG.PROBE_TIMEOUT) {
      return new Promise((resolve, reject) => {
        const serverBase = url.split('/').slice(0, 3).join('/');
        
        // Check failed cache
        if (state.failedCache.has(serverBase)) {
          return reject('cached-fail');
        }

        const img = new Image();
        img.referrerPolicy = 'no-referrer';
        let timedOut = false;

        const timer = setTimeout(() => {
          timedOut = true;
          img.src = '';
          state.failedCache.add(serverBase);
          state.cacheTimestamps.set(serverBase, Date.now());
          reject('timeout');
        }, timeout);

        img.onload = () => {
          if (!timedOut) {
            clearTimeout(timer);
            // Validate actual image (avoid 1x1 trackers)
            if (img.naturalWidth > 1 || img.naturalHeight > 1) {
              resolve(true);
            } else {
              state.failedCache.add(serverBase);
              state.cacheTimestamps.set(serverBase, Date.now());
              reject('empty-image');
            }
          }
        };

        img.onerror = () => {
          if (!timedOut) {
            clearTimeout(timer);
            state.failedCache.add(serverBase);
            state.cacheTimestamps.set(serverBase, Date.now());
            reject('load-error');
          }
        };

        try {
          img.src = url;
        } catch (e) {
          clearTimeout(timer);
          reject('exception');
        }
      });
    },

    generateCandidates(parsed) {
      if (!parsed) return [];
      
      const candidates = [];
      const pathKey = Utils.makePathKey(parsed);
      const cacheKey = `${parsed.root}-${pathKey}`;

      const add = (prefix, number, root, tld, priority) => {
        if (!prefix || !/^[a-z]+$/i.test(prefix)) return;
        const numStr = Utils.padNumber(number);
        const url = `https://${prefix}${numStr}.${root}.${tld}${parsed.path}`;
        candidates.push({ url, priority });
      };

      // Priority 0: Cached working server for this path
      if (state.serverCache.has(cacheKey)) {
        const cached = state.serverCache.get(cacheKey);
        add(cached.prefix, cached.number, cached.root, cached.tld, 0);
      }

      // Priority 1: Direct k→n replacement (most common fix)
      if (parsed.prefix === 'k') {
        add('n', parsed.number, parsed.root, parsed.tld, 1);
        add('x', parsed.number, parsed.root, parsed.tld, 1);
      } else if (parsed.prefix !== 'n') {
        add('n', parsed.number, parsed.root, parsed.tld, 1);
      }

      // Priority 2: Same prefix, different numbers (load balancing)
      const numbers = [1, 2, 3, 4, 5, 0, 8, 10, ...Array.from({length: CONFIG.MAX_SERVER_NUM + 1}, (_, i) => i)];
      for (const num of numbers) {
        if (num !== parsed.number) {
          add('n', num, parsed.root, parsed.tld, 2);
        }
      }

      // Priority 3: Other fallback prefixes
      for (const prefix of CONFIG.FALLBACK_PREFIXES) {
        if (prefix !== parsed.prefix && prefix !== 'n') {
          add(prefix, parsed.number, parsed.root, parsed.tld, 3);
        }
      }

      // Priority 4: Fallback roots (mirror domains)
      for (const fallbackRoot of CONFIG.FALLBACK_ROOTS) {
        const parts = fallbackRoot.split('.');
        if (parts.length === 2 && parts[0] !== parsed.root) {
          add('n', parsed.number, parts[0], parts[1], 4);
        }
      }

      // Priority 5: Cross combinations for resilience
      for (const prefix of CONFIG.FALLBACK_PREFIXES.slice(0, 3)) {
        for (const fallbackRoot of CONFIG.FALLBACK_ROOTS.slice(0, 3)) {
          const parts = fallbackRoot.split('.');
          if (parts.length === 2) {
            add(prefix, parsed.number, parts[0], parts[1], 5);
          }
        }
      }

      // Deduplicate and sort by priority
      const seen = new Set();
      return candidates
        .sort((a, b) => a.priority - b.priority)
        .filter(c => {
          if (seen.has(c.url)) return false;
          seen.add(c.url);
          return true;
        })
        .map(c => c.url)
        .slice(0, CONFIG.MAX_ATTEMPTS);
    }
  };

  /* ==================== SRCSET HANDLING ==================== */
  const SrcsetHandler = {
    rewrite(srcset, workingUrl) {
      if (!srcset || !workingUrl) return null;
      
      const parsed = Utils.parseSubdomain(workingUrl);
      if (!parsed) return null;
      
      const numStr = Utils.padNumber(parsed.number);
      const newBase = `https://${parsed.prefix}${numStr}.${parsed.root}.${parsed.tld}`;
      
      return srcset.replace(
        /https?:\/\/[a-zA-Z]+\d{1,3}\.[a-z0-9-]+\.[a-z]{2,6}/gi,
        newBase
      );
    }
  };

  /* ==================== IMAGE FIXING ENGINE ==================== */
  const ImageFixer = {
    async fix(img, isRetry = false) {
      if (!img || state.processingImages.has(img)) return;
      if (img.dataset.batoFixStatus === 'done') return;

      state.processingImages.add(img);
      img.dataset.batoFixStatus = 'probing';

      const parsed = Utils.parseSubdomain(img.src);
      if (!parsed) {
        state.processingImages.delete(img);
        return;
      }

      const candidates = ProbeEngine.generateCandidates(parsed);
      let lastError = null;

      for (let i = 0; i < candidates.length; i++) {
        const url = candidates[i];
        const serverBase = url.split('/').slice(0, 3).join('/');
        
        if (state.failedCache.has(serverBase)) continue;

        try {
          await ProbeEngine.probe(url);

          // Success - cache the working server
          const successParsed = Utils.parseSubdomain(url);
          if (successParsed) {
            const pathKey = Utils.makePathKey(parsed);
            const cacheKey = `${parsed.root}-${pathKey}`;
            state.serverCache.set(cacheKey, successParsed);
            state.cacheTimestamps.set(cacheKey, Date.now());
          }

          // Apply the fix
          this.applyFix(img, url);
          return;

        } catch (e) {
          lastError = e;
          // Early bailout on repeated timeouts
          if (e === 'timeout' && i > 6) break;
        }
      }

      // Retry logic for timeouts
      if (!isRetry && lastError === 'timeout') {
        img.dataset.batoFixStatus = 'retry';
        state.processingImages.delete(img);
        
        setTimeout(() => {
          if (img.complete && img.naturalWidth === 0) {
            this.fix(img, true);
          }
        }, CONFIG.RETRY_DELAY);
        return;
      }

      img.dataset.batoFixStatus = 'failed';
      state.processingImages.delete(img);
      Utils.warn('Failed to fix image after all attempts:', img.src);
    },

    applyFix(img, workingUrl) {
      // Store original for recovery
      if (!img.dataset.batoOrigSrc) {
        img.dataset.batoOrigSrc = img.src;
      }

      img.referrerPolicy = 'no-referrer';
      img.src = workingUrl;

      // Handle srcset
      if (img.srcset) {
        if (!img.dataset.batoOrigSrcset) {
          img.dataset.batoOrigSrcset = img.srcset;
        }
        const newSrcset = SrcsetHandler.rewrite(img.srcset, workingUrl);
        if (newSrcset) img.srcset = newSrcset;
      }

      // Optimize loading
      if (CONFIG.ENABLE_EAGER_LOADING) {
        img.loading = 'eager';
      }

      img.dataset.batoFixStatus = 'done';
      state.processingImages.delete(img);
      Utils.log('Successfully fixed image:', workingUrl);
    },

    preemptiveFix(img) {
      if (!img || img.dataset.batoFixStatus) return false;

      const parsed = Utils.parseSubdomain(img.src);
      if (!parsed || parsed.prefix !== 'k') return false;

      const pathKey = Utils.makePathKey(parsed);
      const cacheKey = `${parsed.root}-${pathKey}`;

      let targetPrefix = 'n';
      let targetNumber = parsed.number;
      let targetRoot = parsed.root;
      let targetTld = parsed.tld;

      // Use cached server if available
      if (state.serverCache.has(cacheKey)) {
        const cached = state.serverCache.get(cacheKey);
        targetPrefix = cached.prefix;
        targetNumber = cached.number;
        targetRoot = cached.root;
        targetTld = cached.tld;
      }

      const numStr = Utils.padNumber(targetNumber);
      const newUrl = `https://${targetPrefix}${numStr}.${targetRoot}.${targetTld}${parsed.path}`;

      // Store originals
      if (!img.dataset.batoOrigSrc) img.dataset.batoOrigSrc = img.src;
      if (img.srcset && !img.dataset.batoOrigSrcset) {
        img.dataset.batoOrigSrcset = img.srcset;
      }

      img.referrerPolicy = 'no-referrer';
      img.src = newUrl;

      if (img.srcset) {
        const newSrcset = SrcsetHandler.rewrite(img.srcset, newUrl);
        if (newSrcset) img.srcset = newSrcset;
      }

      if (CONFIG.IS_CHROMIUM && CONFIG.ENABLE_EAGER_ON_INITIAL) {
        img.loading = 'eager';
      }

      img.dataset.batoFixStatus = 'preemptive';

      // Verify after delay
      setTimeout(() => {
        if (img.complete && img.naturalWidth === 0) {
          // Revert and do full probe
          if (img.dataset.batoOrigSrc) {
            img.src = img.dataset.batoOrigSrc;
            if (img.dataset.batoOrigSrcset) {
              img.srcset = img.dataset.batoOrigSrcset;
            }
          }
          img.dataset.batoFixStatus = '';
          this.fix(img);
        }
      }, 2000);

      return true;
    }
  };

  /* ==================== DOM MANAGEMENT ==================== */
  const DOMManager = {
    processImage(img) {
      if (!img || !(img instanceof HTMLImageElement)) return;

      // Attach error listener once
      if (!img.dataset.batoListenerAttached) {
        img.dataset.batoListenerAttached = '1';
        img.addEventListener('error', () => {
          setTimeout(() => {
            if (img.dataset.batoFixStatus !== 'done') {
              ImageFixer.fix(img);
            }
          }, 100);
        }, { once: false });
      }

      const parsed = Utils.parseSubdomain(img.src);
      if (!parsed) return;

      // Preemptive fix for 'k' prefix
      if (parsed.prefix === 'k') {
        ImageFixer.preemptiveFix(img);
      }

      // Check if already broken
      setTimeout(() => {
        if (img.complete && img.naturalWidth === 0 && img.dataset.batoFixStatus !== 'done') {
          ImageFixer.fix(img);
        }
      }, 1000);
    },

    scan(root = document) {
      if (!root) return;

      try {
        if (root instanceof HTMLImageElement) {
          this.processImage(root);
        } else {
          const imgs = root.querySelectorAll ? root.querySelectorAll('img') : [];
          imgs.forEach(img => this.processImage(img));
        }
      } catch (e) {
        Utils.error('Scan error:', e);
      }
    },

    aggressiveScan() {
      requestAnimationFrame(() => {
        // Fix broken images
        document.querySelectorAll('img').forEach(img => {
          const src = img.getAttribute('src');
          
          // Quick fix for k-prefix images
          if (src && src.includes('//k') && (src.includes('.mb') || src.includes('.mp'))) {
            if (!img.dataset.batoFixStatus || img.dataset.batoFixStatus === '') {
              ImageFixer.preemptiveFix(img);
            }
          }

          // Fix broken images
          if (img.complete && img.naturalWidth === 0 && 
              !state.processingImages.has(img) && 
              img.dataset.batoFixStatus !== 'done') {
            const parsed = Utils.parseSubdomain(img.src);
            if (parsed) ImageFixer.fix(img);
          }
        });

        // Fix background images
        document.querySelectorAll('[style*="url("]').forEach(el => {
          try {
            const bg = el.style.backgroundImage;
            if (!bg) return;
            
            const fixed = bg.replace(/\/\/k(?=\d+)/gi, '//n');
            if (fixed !== bg) {
              el.style.backgroundImage = fixed;
            }
          } catch (e) {}
        });
      });
    }
  };

  /* ==================== MUTATION OBSERVER ==================== */
  const observer = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
      // Handle added nodes
      mutation.addedNodes.forEach(node => {
        if (node.nodeType !== 1) return;
        
        if (node.tagName === 'IMG') {
          DOMManager.processImage(node);
        } else if (node.querySelectorAll) {
          node.querySelectorAll('img').forEach(img => {
            if (!img.dataset.batoListenerAttached) {
              DOMManager.processImage(img);
            }
          });
        }
      });

      // Handle attribute changes
      if (mutation.type === 'attributes' && 
          mutation.target.tagName === 'IMG' &&
          (mutation.attributeName === 'src' || mutation.attributeName === 'srcset')) {
        const img = mutation.target;
        
        if (img.dataset.batoFixStatus !== 'done' && 
            img.dataset.batoFixStatus !== 'preemptive') {
          img.dataset.batoFixStatus = '';
          setTimeout(() => {
            DOMManager.processImage(img);
          }, 500);
        }
      }
    });
  });

  /* ==================== INITIALIZATION ==================== */
  function initialize() {
    Utils.log(`Initialized v${CONFIG.VERSION} (${CONFIG.IS_FIREFOX ? 'Firefox' : 'Chromium'} mode)`);
    
    // Initial scan
    DOMManager.scan(document);

    // Setup observer
    try {
      observer.observe(document.documentElement || document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['src', 'srcset']
      });
    } catch (e) {
      Utils.error('Observer setup failed:', e);
    }

    // Periodic aggressive scan
    setInterval(() => {
      DOMManager.aggressiveScan();
      Utils.cleanExpiredCache();
    }, CONFIG.AGGRESSIVE_INTERVAL);

    // Periodic cache cleanup
    setInterval(() => {
      Utils.cleanExpiredCache();
    }, 60000);
  }

  // Start when ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }

  // Expose API for debugging
  if (CONFIG.ENABLE_DEBUG) {
    window.__BTFX__ = {
      config: CONFIG,
      state,
      utils: Utils,
      clearCache: () => {
        state.serverCache.clear();
        state.failedCache.clear();
        state.cacheTimestamps.clear();
        Utils.log('Cache cleared');
      },
      stats: () => ({
        version: CONFIG.VERSION,
        serverCache: state.serverCache.size,
        failedCache: state.failedCache.size,
        browser: CONFIG.IS_FIREFOX ? 'Firefox' : 'Chromium'
      })
    };
  }

})();