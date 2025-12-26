# Changelog

All notable changes to this project are documented here.

## [v8.1] - 2025-12-26
- Release: GitHub release automation, packaging, and CHANGELOG integration.

## [v8.0] - ULTIMATE MERGED EDITION (2025-12-25)
- MERGED: All features from v7.0 (Hybrid Probe) and v5.8 (Browser Optimizations).
- INCLUDES: Advanced probing logic with server pattern caching.
- INCLUDES: Candidate generation with smart priority levels.
- INCLUDES: Background probe verification before URL switching.
- INCLUDES: Failed server caching to avoid redundant attempts.
- INCLUDES: Browser-specific optimizations (Firefox 15s / Chromium 2s intervals).
- INCLUDES: Smart number retention from v5.8.
- INCLUDES: Critical race condition fixes (listener before rewrite).
- INCLUDES: Eager loading enforcement for Chromium optimization.
- INCLUDES: Aggressive periodic fixer for .mb and .mp domains.
- INCLUDES: Srcset rewriting with cached working servers.
- INCLUDES: Complete domain coverage (80+ domain patterns).
- Full compatibility with Firefox, Chromium, Edge, and mobile browsers.

## [v7.0] - HYBRID PROBE ENGINE (2025-12-24)
- MERGED: Advanced Probing Logic with server pattern caching.
- NEW: Candidate generation with priority levels (0-5).
- NEW: Background "Probe" verification (tests URLs before switching).
- NEW: Failed server caching to avoid redundant 404/timeout attempts.
- IMPROVED: Srcset rewriting now uses cached working server patterns.

## [v6.0] - Expanded Domain Support (2025-12-24)
- ADDED: Support for .mbdny, .mbrtz, .mbwbm, .mbznp, .mbqgu.
- ADDED: Support for .mpfip, .mpizz, .mpmok, .mpqom, .mpqsc, .mprnm, .mpubn, .mpujj, .mpvim, .mpypl.
- UPDATED: Aggressive fixer targets both .mb and .mp domain structures.

## [v5.8] - Add support for Firefox v146 (2024-12-24)

## [v5.7] - Firefox Optimization Release (2025-12-24)
- NEW: Browser detection for Firefox vs Chromium-based.
- Firefox Mode: Adaptive aggressive fixer with 15s interval (vs 2s for Chromium).
- Firefox Mode: Selective eager loading only on error recovery (not initial).
- Chromium Mode: Original aggressive behavior unchanged.
- Maintains full compatibility with both browser engines.
- No performance penalty on Chromium; significant improvement on Firefox.

## [v5.6] - Final Merged Release (2025-12-24)
- Combined features from v5.5 Beta, v5.3 Release, and v4.2 Chromium Tuned.
- INCLUDES: Aggressive 'n' mirror enforcement (from v5.5).
- INCLUDES: Priority Brute-Force with Smart Number Retention (from v5.3).
- INCLUDES: Critical race condition fix (listener before rewrite).
- INCLUDES: Eager loading enforcement for Chromium/V8 optimization.
- INCLUDES: Aggressive periodic fixer for .mb domains.
- ADDED: Support for new mirror domain bato.ing.
- Final stable version with all features merged.

## [v5.5] - Aggressive Periodic Fixer (2025-12-24 Beta)
- Runs every 2 seconds to catch missed images.
- Targets .mb domains specifically (mbtmv.org).
- Fixes background-image CSS properties.

## [v5.3.1] - Critical fix for tamperonkey (2025-12-23)

## [v5.3] - Critical Race Condition Fix (2025-12-22)
- CRITICAL: Listener now attached BEFORE src rewrite.
- Original URL stored in data-btfx-orig for recovery.
- Numeric version comparison for updates.
- Smart number retention preserved.

## [v5.2.1] - Changelog Rearrangement (2025-12-16)

## [v5.2] - Updater and Version Alignment (2025-12-16)
- Aligned internal version constant.
- Corrected UPDATE_URL to Pastebin.

## [v5.1] - Browser Support Documentation (2025-12-16)
- Added list of unsupported browsers in description.

## [v5.0.1] - Version Description Fix (2025-12-16)

## [v5.0] - Final Release (2025-12-16)
- Full feature parity with v4.9.

## [v4.9] - Latest Stable Release (2025-12-15)
- Full compatibility with Microsoft Edge for Android.
- Full compatibility with Waterfox for Android.
- Confirmed no breakage with AdGuard and uBlock Origin.
- Improved resilience against content-blocking.

## [v4.8] - Internal Testing (2025-12-15)
- Testing with Waterfox and Microsoft Edge for Android.

## [v4.7] - Core Overhaul & Unification (2025-12-15)
1. OPTIMIZED: Fixed memory leaks and recursion stack overflows.
2. ADDED: Full support for Cromite (Android).
3. MERGED: Aggressive 'n' Enforcement (v4.5) with Smart Number Retention (v4.6).
4. SAFETY: Added explicit checks for unsupported browsers.

## [v4.6] - Smart Number Retention (2025-12-15)
1. Preserves original node numbers (e.g., 08) during swaps (Fixes mbtmv.org).
2. Expanded node search (00-10).
3. 'k' mirror promoted to High Priority.

## [v4.5] - Aggressive 'n' Enforcement (2025-12-15)
- Foundation for aggressive 'n' mirror targeting.

## [v4.2] - Priority Brute Force (2025-12-15)
- Reordered mirror search to try common servers (m, p, w, a) first.
- Eager Loading: Forces `loading="eager"` during recovery.
- V8 Optimization: Direct property access for max speed.

## [v4.1] - Chrome Opt (2025-12-15)
- Removed Firefox safety wrappers.

## [v3.9] - Internal Testing & removed firefox support (2025-12-15)

## [v3.7] - Internal testing across multiple browser (2025-12-15)

## [v3.6] - Unified milestone release (2025-12-15)
- Incorporates final unified core architecture.
- Mirror alignment cleanup.
- Firefox-safe execution model.
- Conditional v1.9.1 hybrid recovery logic.
- Full mirror coverage.
- Optional non-intrusive Pastebin updater.
- Removal of always-on retry behavior.

## [v3.0] - Major refactor experiments and hybrid architecture exploration (2025-12-15)

## [v2.6] - Hybrid engine + updater attempts (2025-12-15)

## [v2.3] - Stability fixes (2025-12-15)

## [v2.0] - Hybrid concept introduced (2025-12-15)

## [v1.9.1] - Hybrid update integrating fixes from redditor "mindlesstourist3" (2025-12-15)
- Host rotation.
- Retry/backoff.
- Broken-image detection.

## [v1.9] - Metadata fixes, stronger attribute handling, improved srcset support (2025-12-15)

## [v1.8] - bato.si + mirror expansion (2025-12-15)

## [v1.7] - Dynamic DOM handling (2025-12-15)

## [v1.6] - Observer optimizations (2025-12-15)

## [v1.5] - Community mirror expansion (2025-12-14)

## [v1.4] - Critical banner fix (property-level img.src) (2025-12-13)

## [v1.3] - MutationObserver introduced (2025-12-12)

## [v1.2] - Attribute safety (2025-12-11)

## [v1.1] - Minor fixes (2025-12-10)

## [v1.0] - Initial k→n replacement (2025-12-09)