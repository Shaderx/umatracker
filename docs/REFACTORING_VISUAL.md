# 📊 Refactoring Visual Guide

## Current Structure (Monolithic)

```
┌─────────────────────────────────────────────────────────────┐
│                      index.html                             │
│                    (Main HTML Page)                         │
└────────────┬───────────────────────────┬────────────────────┘
             │                           │
             ▼                           ▼
    ┌────────────────┐         ┌────────────────┐
    │   app.js       │         │  styles.css    │
    │  2,927 lines   │         │  2,266 lines   │
    │                │         │                │
    │ • State        │         │ • Base         │
    │ • Data         │         │ • Components   │
    │ • UI           │         │ • Features     │
    │ • Features     │         │ • Responsive   │
    │ • Storage      │         │ • Utilities    │
    │ • Checks       │         │                │
    │                │         │                │
    │ ❌ Too large   │         │ ❌ Too large   │
    │ for AI agents  │         │ for AI agents  │
    └────────────────┘         └────────────────┘
```

---

## New Structure (Modular)

```
┌─────────────────────────────────────────────────────────────┐
│                      index.html                             │
│                    (Main HTML Page)                         │
└────────────┬───────────────────────────┬────────────────────┘
             │                           │
             ▼                           ▼
    ┌────────────────┐         ┌────────────────┐
    │   app.js       │         │  styles.css    │
    │   ~50 lines    │         │   ~50 lines    │
    │  (Entry Point) │         │ (Main Import)  │
    └────────┬───────┘         └────────┬───────┘
             │                           │
             │                           │
    ┌────────▼────────────────┐ ┌────────▼────────────────┐
    │   JavaScript Modules    │ │     CSS Modules         │
    │      (18 files)         │ │      (17 files)         │
    └─────────────────────────┘ └─────────────────────────┘
```

---

## JavaScript Module Architecture

```
app.js (Entry Point - 50 lines)
  │
  └─→ UmaMusumeTracker Class
        │
        ├─→ CORE MODULES (3 files, ~330 lines)
        │   ├─→ tracker.js      (~150 lines) - Main class shell
        │   ├─→ state.js        (~100 lines) - State management
        │   └─→ utils.js        (~80 lines)  - Utilities
        │
        ├─→ DATA MODULES (3 files, ~470 lines)
        │   ├─→ race-data.js    (~100 lines) - Race loading
        │   ├─→ hidden-factors.js (~250 lines) - 42 factors
        │   └─→ race-helpers.js (~120 lines) - Getters
        │
        ├─→ UI MODULES (4 files, ~900 lines)
        │   ├─→ race-renderer.js    (~200 lines) - Race grid
        │   ├─→ planner-renderer.js (~250 lines) - Planner
        │   ├─→ progress-renderer.js (~150 lines) - Progress
        │   └─→ event-listeners.js  (~300 lines) - Events
        │
        ├─→ FEATURE MODULES (5 files, ~900 lines)
        │   ├─→ filters.js       (~150 lines) - Filtering
        │   ├─→ planner.js       (~200 lines) - Planner logic
        │   ├─→ picker-modal.js  (~350 lines) - Modal/carousel
        │   ├─→ tracking.js      (~120 lines) - Factor tracking
        │   └─→ scroll-lock.js   (~80 lines)  - Scroll lock
        │
        ├─→ STORAGE MODULES (3 files, ~600 lines)
        │   ├─→ storage-manager.js (~200 lines) - Save/load
        │   ├─→ storage-ui.js     (~250 lines) - UI
        │   └─→ url-sharing.js    (~150 lines) - URL sharing
        │
        └─→ CHECK MODULES (3 files, ~570 lines)
            ├─→ check-race-based.js (~300 lines) - 12 checks
            ├─→ check-special.js    (~150 lines) - 5 checks
            └─→ check-awakening.js  (~120 lines) - 2 checks

Total: 18 files, ~2,770 lines (avg ~154 lines/file)
```

---

## CSS Module Architecture

```
styles.css (Main Import - 50 lines)
  │
  ├─→ BASE STYLES (3 files, ~200 lines)
  │   ├─→ reset.css       (~50 lines)  - Reset & box-sizing
  │   ├─→ layout.css      (~100 lines) - Grid & layout
  │   └─→ typography.css  (~50 lines)  - Fonts & text
  │
  ├─→ COMPONENTS (6 files, ~750 lines)
  │   ├─→ header.css      (~120 lines) - Header & logo
  │   ├─→ footer.css      (~80 lines)  - Footer
  │   ├─→ buttons.css     (~150 lines) - All buttons
  │   ├─→ race-cards.css  (~200 lines) - Race cards
  │   ├─→ filters.css     (~120 lines) - Filter buttons
  │   └─→ stats.css       (~80 lines)  - Stats grid
  │
  ├─→ FEATURES (5 files, ~1,150 lines)
  │   ├─→ planner.css     (~300 lines) - Planner grid
  │   ├─→ picker-modal.css (~350 lines) - Modal/carousel
  │   ├─→ progress.css    (~150 lines) - Progress panel
  │   ├─→ tracking.css    (~100 lines) - Tracking
  │   └─→ storage.css     (~250 lines) - Storage system
  │
  ├─→ RESPONSIVE (2 files, ~600 lines)
  │   ├─→ mobile.css      (~400 lines) - < 640px
  │   └─→ tablet.css      (~200 lines) - 641-900px
  │
  └─→ UTILITIES (2 files, ~130 lines)
      ├─→ animations.css  (~80 lines)  - Keyframes
      └─→ glass-effects.css (~50 lines) - Glass morphism

Total: 17 files, ~2,830 lines (avg ~166 lines/file)
```

---

## Module Size Comparison

### JavaScript Files

```
Before Refactoring:
┌────────────────────────────────────────────────┐
│ app.js                                         │ 2,927 lines
│ ████████████████████████████████████████████   │
└────────────────────────────────────────────────┘

After Refactoring (Top 5 Largest):
┌─────────────────┐
│ picker-modal.js │ 350 lines
│ ████████        │
├─────────────────┤
│ event-listeners │ 300 lines
│ ███████         │
├─────────────────┤
│ check-race-based│ 300 lines
│ ███████         │
├─────────────────┤
│ hidden-factors  │ 250 lines
│ ██████          │
├─────────────────┤
│ storage-ui      │ 250 lines
│ ██████          │
└─────────────────┘
```

### CSS Files

```
Before Refactoring:
┌────────────────────────────────────────────────┐
│ styles.css                                     │ 2,266 lines
│ ████████████████████████████████████████       │
└────────────────────────────────────────────────┘

After Refactoring (Top 5 Largest):
┌─────────────────┐
│ mobile.css      │ 400 lines
│ █████████       │
├─────────────────┤
│ picker-modal.css│ 350 lines
│ ████████        │
├─────────────────┤
│ planner.css     │ 300 lines
│ ███████         │
├─────────────────┤
│ storage.css     │ 250 lines
│ ██████          │
├─────────────────┤
│ race-cards.css  │ 200 lines
│ █████           │
└─────────────────┘
```

---

## Dependency Graph

### Core Dependencies

```
┌─────────────┐
│  tracker.js │ ◄─── Main entry point
└──────┬──────┘
       │
       ├──► state.js         (State management)
       ├──► utils.js         (Utilities)
       └──► All other modules depend on core
```

### Data Flow

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│ race-data.js│────►│ tracker.js   │────►│ UI Modules  │
└─────────────┘     │              │     └─────────────┘
                    │              │
┌─────────────┐     │              │     ┌─────────────┐
│hidden-factors│────►│              │────►│ Check Modules│
└─────────────┘     └──────────────┘     └─────────────┘
```

### UI Rendering Flow

```
User Action
    │
    ▼
┌─────────────────┐
│event-listeners.js│
└────────┬─────────┘
         │
         ├──► filters.js ──────┐
         ├──► planner.js ──────┤
         ├──► tracking.js ─────┤
         └──► storage-*.js ────┤
                               │
                               ▼
                    ┌──────────────────┐
                    │   state.js       │
                    │  (Update State)  │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │  Render Modules  │
                    ├──────────────────┤
                    │ race-renderer    │
                    │ planner-renderer │
                    │ progress-renderer│
                    └──────────────────┘
                             │
                             ▼
                          Update DOM
```

---

## File Size Distribution

### JavaScript

```
Lines    Count  Files
0-100      3    state.js, utils.js, race-data.js
101-150    6    tracker.js, filters.js, check-special.js, 
                check-awakening.js, url-sharing.js, tracking.js
151-200    3    race-renderer.js, planner.js, storage-manager.js
201-250    3    planner-renderer.js, progress-renderer.js, storage-ui.js
251-300    2    hidden-factors.js, event-listeners.js
301-400    2    check-race-based.js, picker-modal.js

✅ All files < 400 lines
✅ Average: ~154 lines
✅ AI-readable in single pass
```

### CSS

```
Lines    Count  Files
0-100      8    reset.css, typography.css, glass-effects.css,
                footer.css, animations.css, stats.css, tracking.css,
                layout.css
101-150    3    buttons.css, filters.css, header.css, progress.css
151-200    2    race-cards.css, tablet.css
201-300    3    storage.css, planner.css
301-400    2    picker-modal.css, mobile.css

✅ All files < 400 lines
✅ Average: ~166 lines
✅ AI-readable in single pass
```

---

## Benefits Visualization

### Before (Monolithic)

```
┌─────────────────────────────────────────┐
│           app.js (2,927 lines)          │
│                                         │
│  ❌ Hard to navigate                    │
│  ❌ Difficult to maintain               │
│  ❌ Can't read in one AI pass           │
│  ❌ Testing is complex                  │
│  ❌ Merge conflicts common              │
│  ❌ Hard to understand flow             │
└─────────────────────────────────────────┘
```

### After (Modular)

```
┌──────────┐ ┌──────────┐ ┌──────────┐
│ Core (3) │ │ Data (3) │ │  UI (4)  │
│ ~330 L   │ │ ~470 L   │ │ ~900 L   │
└──────────┘ └──────────┘ └──────────┘

┌──────────┐ ┌──────────┐ ┌──────────┐
│Features(5)│ │Storage(3)│ │Checks(3) │
│ ~900 L   │ │ ~600 L   │ │ ~570 L   │
└──────────┘ └──────────┘ └──────────┘

✅ Easy to navigate
✅ Simple to maintain
✅ AI can read each file
✅ Easy to test modules
✅ Fewer merge conflicts
✅ Clear code flow
```

---

## Implementation Progress Tracker

```
Phase 1: Preparation
├─ ✅ Create REFACTORING_PLAN.md
├─ ✅ Create REFACTORING_SUMMARY.md
├─ ✅ Create REFACTORING_VISUAL.md
├─ ✅ Update README.md
└─ ⏳ Create directory structure

Phase 2: JavaScript Extraction (18 files)
├─ ⏳ Core modules (3 files)
├─ ⏳ Data modules (3 files)
├─ ⏳ UI modules (4 files)
├─ ⏳ Feature modules (5 files)
├─ ⏳ Storage modules (3 files)
└─ ⏳ Check modules (3 files)

Phase 3: CSS Extraction (17 files)
├─ ⏳ Base styles (3 files)
├─ ⏳ Components (6 files)
├─ ⏳ Features (5 files)
├─ ⏳ Responsive (2 files)
└─ ⏳ Utilities (2 files)

Phase 4: Integration
├─ ⏳ Update index.html
├─ ⏳ Add ES6 imports
└─ ⏳ Test functionality

Phase 5: Cleanup
├─ ⏳ Archive old files
├─ ⏳ Update documentation
└─ ⏳ Final testing

Legend: ✅ Done | ⏳ Pending | 🔄 In Progress
```

---

## Quick Reference: Where to Find Things

### JavaScript Features

| Feature | Module | Lines |
|---------|--------|-------|
| Race selection | `ui/race-renderer.js` | ~200 |
| Race filtering | `features/filters.js` | ~150 |
| Planner grid | `ui/planner-renderer.js` | ~250 |
| Planner logic | `features/planner.js` | ~200 |
| Race picker modal | `features/picker-modal.js` | ~350 |
| Progress display | `ui/progress-renderer.js` | ~150 |
| Hidden factors | `data/hidden-factors.js` | ~250 |
| Factor checks | `checks/*.js` | ~570 |
| Save/Load | `storage/storage-manager.js` | ~200 |
| Storage UI | `storage/storage-ui.js` | ~250 |
| URL sharing | `storage/url-sharing.js` | ~150 |
| Event handlers | `ui/event-listeners.js` | ~300 |
| State management | `core/state.js` | ~100 |
| Utilities | `core/utils.js` | ~80 |

### CSS Features

| Feature | Module | Lines |
|---------|--------|-------|
| Layout | `base/layout.css` | ~100 |
| Buttons | `components/buttons.css` | ~150 |
| Race cards | `components/race-cards.css` | ~200 |
| Filters | `components/filters.css` | ~120 |
| Planner | `features/planner.css` | ~300 |
| Modal | `features/picker-modal.css` | ~350 |
| Progress | `features/progress.css` | ~150 |
| Tracking | `features/tracking.css` | ~100 |
| Storage | `features/storage.css` | ~250 |
| Mobile | `responsive/mobile.css` | ~400 |
| Tablet | `responsive/tablet.css` | ~200 |
| Animations | `utilities/animations.css` | ~80 |

---

*Generated: 2025-10-04*
*Visual guide for Uma Musume Hidden Factors Tracker refactoring*
*See REFACTORING_PLAN.md for complete details*
