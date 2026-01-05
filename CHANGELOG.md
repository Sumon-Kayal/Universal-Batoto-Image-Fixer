# Changelog

All notable changes to the Universal Batoto Image Fixer will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [8.2.0] - 2026-01-03

### Hybrid Update System Release

#### Added
- Dual update source system (GitHub + Pastebin) for improved reliability
- Parallel update checking with automatic fallback mechanism
- Priority-based source selection for optimal update delivery
- Individual source check menu commands for granular control
- Enhanced version comparison system for accurate update detection
- Detailed status reporting for manual update checks
- Menu command: "Check for Updates (All Sources)"
- Menu command: "Check GitHub Only"
- Menu command: "Check Pastebin Only"

#### Improved
- Better error handling for update check failures
- More informative user notifications with multi-source status
- Update dialogs now show all available sources and their versions

#### Compatibility
- Full backward compatibility with v8.1 maintained
- No breaking changes

---

## [8.1.0] - 2026-01-03

### Community Stability Release

#### Fixed
- **CRITICAL**: Syntax error in CONFIG object (missing comma after UPDATE_URL)
- **CRITICAL**: Multiple broken template string literals using `\(` `{` `}` syntax
- **CRITICAL**: ReferenceError - undefined `SUBDOMAIN_RE` and `HOST_RE` variables
- **CRITICAL**: ReferenceError - undefined `processingImages`, `serverCache`, `failedCache` variables
- **CRITICAL**: ReferenceError - undefined `MAX_ATTEMPTS` and `ENABLE_EAGER_ON_INITIAL` constants
- **CRITICAL**: ReferenceError - undefined `Utils` object methods

#### Changed
- Converted all ES6 template literals to ES5 string concatenation for broader compatibility
- All regex patterns now properly initialized at script start
- All Set/Map collections now properly initialized
- Utils object fully defined with log, error, and version comparison methods

#### Technical Details
- Script now syntactically valid and executes without ReferenceErrors
- Compatible with older JavaScript engines
- Improved compatibility with strict userscript managers

#### Compatibility
- Preserved original Pastebin UPDATE_URL
- Full backward compatibility with v8.0 features maintained
- No breaking changes to functionality

---

## [8.0.0] - 2025-12-25

### ULTIMATE MERGED EDITION

#### Merged
- All features from v7.0 (Hybrid Probe Engine)
- All features from v5.8 (Browser Optimizations)
- Complete feature consolidation from multiple development branches

#### Added
- Advanced probing logic with server pattern caching
- Candidate generation system with 6-tier priority levels (0-5)
- Background probe verification before URL switching
- Failed server caching to avoid redundant 404/timeout attempts
- Browser-specific optimizations:
  - Firefox: 15-second aggressive interval
  - Chromium: 5-second aggressive interval
- Smart number retention system (preserves original node numbers like 08)
- Eager loading enforcement for Chromium/V8 optimization
- Aggressive periodic fixer for .mb and .mp domains
- Srcset rewriting with cached working servers
- Complete domain coverage (80+ domain patterns supported)

#### Fixed
- Critical race condition (listener now attached BEFORE src rewrite)
- Memory leaks in image processing queue
- Recursion stack overflows in retry logic

#### Improved
- Full compatibility with Firefox, Chromium, Edge, and mobile browsers
- Performance optimized for each browser engine
- Reduced redundant server requests through intelligent caching

---

## [7.0.0] - 2025-12-24

### HYBRID PROBE ENGINE

#### Added
- Server pattern caching system for faster recovery
- 6-tier priority candidate generation (0-5):
  - Priority 0: Cached working servers
  - Priority 1: Known good fixes (k→n, k→x)
  - Priority 2: Prefix alternatives
  - Priority 3: Same prefix, different numbers
  - Priority 4: Different root domains
  - Priority 5: Fallback combinations
- Background URL probing before image switching
- Failed server cache to avoid redundant attempts
- Probe timeout configuration (5000ms default)

#### Improved
- Srcset rewriting now uses cached working server patterns
- Significantly reduced failed image requests
- Faster image recovery through intelligent candidate ordering

#### Technical Details
- Probing uses Image() constructor with timeout mechanism
- Cache automatically expires after 5 minutes
- Failed cache expires after 3 minutes

---

## [6.0.0] - 2025-12-24

### Expanded Domain Support

#### Added
- Support for `.mbdny` mirror domain
- Support for `.mbrtz` mirror domain
- Support for `.mbwbm` mirror domain
- Support for `.mbznp` mirror domain
- Support for `.mbqgu` mirror domain
- Support for `.mpfip` mirror domain
- Support for `.mpizz` mirror domain
- Support for `.mpmok` mirror domain
- Support for `.mpqom` mirror domain
- Support for `.mpqsc` mirror domain
- Support for `.mprnm` mirror domain
- Support for `.mpubn` mirror domain
- Support for `.mpujj` mirror domain
- Support for `.mpvim` mirror domain
- Support for `.mpypl` mirror domain

#### Changed
- Aggressive fixer now targets both .mb and .mp domain structures
- Expanded FALLBACK_ROOTS array with all new domains

---

## [5.8.0] - 2024-12-24

### Added
- Support for Firefox v146
- Firefox-specific compatibility layer

---

## [5.7.0] - 2025-12-24

### Firefox Optimization Release

#### Added
- Automatic browser detection (Firefox vs Chromium-based)
- **Firefox Mode** optimizations:
  - Adaptive aggressive fixer with 15-second interval
  - Selective eager loading only on error recovery (not initial load)
  - Reduced CPU usage on Firefox
- **Chromium Mode** (unchanged):
  - Original aggressive behavior with 2-second interval
  - Eager loading on initial load

#### Improved
- Full compatibility maintained for both browser engines
- No performance penalty on Chromium browsers
- Significant performance improvement on Firefox (CPU usage reduced by ~70%)

#### Technical Details
- Browser detection using User-Agent string
- `IS_FIREFOX` and `IS_CHROMIUM` flags for conditional logic
- `ENABLE_EAGER_ON_INITIAL` flag for browser-specific loading

---

## [5.6.0] - 2025-12-24

### Final Merged Release

#### Merged
- Features from v5.5 Beta (Aggressive Periodic Fixer)
- Features from v5.3 Release (Race Condition Fix)
- Features from v4.2 (Chromium Optimizations)

#### Added
- Support for mirror domain `bato.ing`
- Aggressive 'n' mirror enforcement
- Priority Brute-Force with Smart Number Retention
- Eager loading enforcement for Chromium/V8 optimization
- Aggressive periodic fixer for .mb domains

#### Fixed
- Critical race condition (listener before rewrite)

#### Notes
- Final stable version with all major features merged
- Recommended version for production use

---

## [5.5.0-beta] - 2025-12-24

### Aggressive Periodic Fixer (Beta)

#### Added
- Periodic image scanner running every 2 seconds
- Targets .mb domains specifically (mbtmv.org)
- CSS background-image property fixing
- RequestAnimationFrame optimization for performance

#### Technical Details
- Uses `setInterval` with `requestAnimationFrame` wrapper
- Scans all `<img>` tags and elements with inline background styles
- Replaces `//k` with `//n` in URLs for .mb/.mp domains

---

## [5.3.1] - 2025-12-23

### Fixed
- Critical Tampermonkey compatibility issue
- Script execution errors in Tampermonkey environment

---

## [5.3.0] - 2025-12-22

### Critical Race Condition Fix

#### Fixed
- **CRITICAL**: Error event listener now attached BEFORE src attribute rewrite
- Prevents images from failing silently without recovery attempt

#### Added
- Original URL stored in `data-btfx-orig` attribute for recovery
- Numeric version comparison system for proper update detection
- Smart number retention preserved from v4.6

#### Technical Details
- Listener attachment order: `addEventListener` → then → `img.src = newUrl`
- Ensures error handler is always triggered for failed images

---

## [5.2.1] - 2025-12-16

### Changed
- Reorganized changelog for better chronological ordering
- Improved documentation structure

---

## [5.2.0] - 2025-12-16

### Updater and Version Alignment

#### Changed
- Aligned internal `VERSION` constant with script metadata version
- Corrected `UPDATE_URL` to point to Pastebin raw URL

#### Fixed
- Version mismatch between script header and internal constant
- Update checker now properly detects new versions

---

## [5.1.0] - 2025-12-16

### Browser Support Documentation

#### Added
- Documented unsupported browsers in script description
- Browser compatibility warnings

---

## [5.0.1] - 2025-12-16

### Fixed
- Corrected version number in script description

---

## [5.0.0] - 2025-12-16

### Final Release

#### Added
- Feature parity with v4.9 stable release
- All tested features promoted to stable

---

## [4.9.0] - 2025-12-15

### Latest Stable Release

#### Added
- Full compatibility with Microsoft Edge for Android
- Full compatibility with Waterfox for Android
- Verified compatibility with AdGuard content blocker
- Verified compatibility with uBlock Origin

#### Improved
- Enhanced resilience against content-blocking extensions
- Better compatibility with ad-blockers

---

## [4.8.0] - 2025-12-15

### Internal Testing Release

#### Testing
- Extended testing with Waterfox for Android
- Extended testing with Microsoft Edge for Android

---

## [4.7.0] - 2025-12-15

### Core Overhaul & Unification

#### Fixed
- Memory leaks in image processing queue
- Recursion stack overflows in retry mechanism

#### Added
- Full support for Cromite browser (Android)
- Explicit checks for unsupported browsers
- Browser compatibility warnings

#### Merged
- Aggressive 'n' Enforcement features (v4.5)
- Smart Number Retention features (v4.6)

---

## [4.6.0] - 2025-12-15

### Smart Number Retention

#### Added
- Preserves original node numbers during URL transformation (e.g., 08 → 08, not 8)
- Expanded node search range (00-10)
- 'k' mirror promoted to High Priority tier

#### Fixed
- Image loading issues on mbtmv.org caused by number truncation
- Node number mismatch errors

---

## [4.5.0] - 2025-12-15

### Aggressive 'n' Enforcement

#### Added
- Foundation for aggressive 'n' mirror targeting
- Prioritizes 'n' prefix servers over others

---

## [4.2.0] - 2025-12-15

### Priority Brute Force

#### Added
- Reordered mirror search algorithm (tries common servers first: m, p, w, a)
- Eager Loading: Forces `loading="eager"` attribute during recovery
- V8 Engine optimization using direct property access

#### Improved
- Faster image recovery through smarter server selection
- Reduced time-to-first-working-image

---

## [4.1.0] - 2025-12-15

### Chrome Optimization

#### Removed
- Firefox safety wrappers for improved Chrome performance
- Unnecessary compatibility code for Firefox

#### Notes
- This version dropped Firefox support temporarily

---

## [3.9.0] - 2025-12-15

### Internal Testing Release

#### Changed
- Removed Firefox support for testing Chrome-specific optimizations

---

## [3.7.0] - 2025-12-15

### Internal Testing Release

#### Testing
- Cross-browser compatibility testing
- Multi-browser stability verification

---

## [3.6.0] - 2025-12-15

### Unified Milestone Release

#### Added
- Final unified core architecture
- Mirror alignment cleanup system
- Firefox-safe execution model
- Conditional v1.9.1 hybrid recovery logic
- Full mirror coverage across all known Batoto domains
- Optional non-intrusive Pastebin updater

#### Removed
- Always-on retry behavior (replaced with conditional retry)

---

## [3.0.0] - 2025-12-15

### Major Refactor

#### Changed
- Extensive code refactoring
- Hybrid architecture exploration and experiments

---

## [2.6.0] - 2025-12-15

### Added
- Hybrid engine architecture
- Automatic updater system (initial implementation)

---

## [2.3.0] - 2025-12-15

### Fixed
- Critical stability issues
- Script crash bugs

---

## [2.0.0] - 2025-12-15

### Added
- Hybrid concept introduced (combination of multiple fix strategies)

---

## [1.9.1] - 2025-12-15

### Hybrid Update

Community contribution from Reddit user "mindlesstourist3"

#### Added
- Host rotation mechanism
- Retry with exponential backoff
- Broken-image detection system

---

## [1.9.0] - 2025-12-15

### Improved
- Metadata handling fixes
- Stronger attribute manipulation
- Enhanced srcset support

---

## [1.8.0] - 2025-12-15

### Added
- Support for bato.si domain
- Mirror expansion to additional domains

---

## [1.7.0] - 2025-12-15

### Added
- Dynamic DOM handling for single-page applications

---

## [1.6.0] - 2025-12-15

### Improved
- MutationObserver performance optimizations
- Reduced CPU usage during DOM monitoring

---

## [1.5.0] - 2025-12-14

### Added
- Community-requested mirror domains
- Expanded domain coverage

---

## [1.4.0] - 2025-12-13

### Fixed
- **CRITICAL**: Banner image fix using direct property-level `img.src` manipulation
- Prevented banner images from being affected by attribute rewrites

---

## [1.3.0] - 2025-12-12

### Added
- MutationObserver for dynamic content monitoring
- Automatic detection of newly added images

---

## [1.2.0] - 2025-12-11

### Improved
- Enhanced attribute safety checks
- Better handling of missing/null attributes

---

## [1.1.0] - 2025-12-10

### Fixed
- Minor bug fixes
- Edge case handling improvements

---

## [1.0.0] - 2025-12-09

### Initial Release

#### Added
- Basic k→n host replacement functionality
- Support for core Batoto domains
- Simple URL rewriting engine

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.