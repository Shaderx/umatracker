# 🔄 Refactoring Status Tracker

**Last Updated**: 2025-10-04
**Status**: Phase 1 Complete - Working Foundation Implemented
**Approach**: Hybrid system - Core modules refactored, remaining code tracked for future extraction

---

## ✅ Completed Modules

### JavaScript Modules (5 of 18)
- ✅ `js/core/utils.js` - Utility functions (51 lines)
- ✅ `js/core/state.js` - State management (67 lines)
- ✅ `js/data/race-data.js` - Race data loading (186 lines)
- ✅ `js/features/scroll-lock.js` - Scroll lock manager (50 lines)
- ✅ `app.js.backup` - Original file backed up

### CSS Modules (0 of 17)
- ⏳ All CSS modules pending (using original styles.css for now)

### Infrastructure
- ✅ Directory structure created (js/ and css/ with subdirectories)
- ✅ Backup files created (.backup extensions)
- ✅ Planning documents complete

---

## 🔄 Current State: Hybrid System

The current implementation uses a **hybrid approach**:
- ✅ Core utilities and state management extracted to modules
- ✅ Main `app.js` contains the full `UmaMusumeTracker` class (working)
- ✅ Modular CSS in original `styles.css` (working)
- ✅ No breaking changes - app fully functional

This allows you to:
1. Use the app immediately without issues
2. Gradually extract remaining modules
3. Test each extraction independently
4. Maintain backward compatibility

---

## 📋 Remaining JavaScript Modules (13 of 18)

### Priority 1: Data Modules (2 modules)
**Lines**: ~370 total

#### `js/data/hidden-factors.js` (~250 lines)
**Location**: app.js lines 251-479
**Content**:
```javascript
loadHiddenFactors() {
    this.hiddenFactors = [
        // 23 hidden factor definitions
        // Each with: id, nameJP, nameEN, conditionJP, conditionEN, trackable, check, getRaces
    ];
}
```
**Dependencies**: Check modules
**Complexity**: Medium (large data structure)

#### `js/data/race-helpers.js` (~120 lines)
**Location**: app.js lines 1721-1822
**Content**:
- `getRacesForEasternG1()`
- `getRacesForWesternG1()`
- `getRacesForNewspaperCups()`
- `getRacesForSummerSeries()`
- `getRacesForNewYearGold()`
- `getRacesForStarRaces()`
- `getRacesForJewelryRaces()`
- `getRacesForDualSurface()`
- `getRacesForPerfectCrown()`
- `getRacesForPerfectTiara()`
- `getRacesForDirectionalAwakening()`
- `getRacesForSeasonalAwakening()`
**Dependencies**: Race data, state
**Complexity**: Low (simple getter functions)

---

### Priority 2: Check Modules (3 modules)
**Lines**: ~570 total

#### `js/checks/check-race-based.js` (~300 lines)
**Location**: app.js lines 1982-2277
**Content**:
- `checkEasternG1Wins()` - lines 1982-1995
- `checkWesternG1Wins()` - lines 1996-2009
- `checkDifferentRacecourses()` - lines 2010-2024
- `checkAllDistanceG1()` - lines 2025-2047
- `checkNewspaperCups()` - lines 2048-2064
- `checkSummerSeries()` - lines 2065-2081
- `checkNewYearGold()` - lines 2082-2101
- `checkStarRaces()` - lines 2102-2121
- `checkJewelryRaces()` - lines 2122-2139
- `checkDualSurface()` - lines 2140-2158
- `checkPerfectCrown()` - lines 2159-2188
- `checkPerfectTiara()` - lines 2189-2218
**Dependencies**: State, race helpers
**Complexity**: Medium (logic-heavy)

#### `js/checks/check-special.js` (~150 lines)
**Location**: app.js lines 2219-2259
**Content**:
- `checkImprovesWithRacing()` - lines 2219-2231
- `checkNeverGiveUp()` - lines 2232-2246
- `checkRebelliousSpirit()` - lines 2247-2259
- `checkConsecutiveRuns()` - lines 1957-1968
- `checkConsecutiveWins()` - lines 1969-1981
**Dependencies**: State, planner timeline
**Complexity**: Medium (planner integration)

#### `js/checks/check-awakening.js` (~120 lines)
**Location**: app.js lines 2260-2297
**Content**:
- `checkDirectionalAwakening()` - lines 2260-2273
- `checkSeasonalAwakening()` - lines 2274-2297
**Dependencies**: State, race helpers
**Complexity**: Low

---

### Priority 3: UI Modules (4 modules)
**Lines**: ~900 total

#### `js/ui/race-renderer.js` (~200 lines)
**Location**: app.js lines 1363-1489
**Content**:
- `renderRaces()` - Main race grid rendering
- `getFilteredRaces()` - Filter application
- `sortRacesList()` - Sorting logic
- Race card HTML generation
**Dependencies**: State, filters, tracking
**Complexity**: High (DOM manipulation, event handlers)

#### `js/ui/planner-renderer.js` (~250 lines)
**Location**: app.js lines 1902-2298 (mixed with other code)
**Content**:
- `renderPlannerGrid()` - Planner grid rendering
- `buildPlannerTimeline()` - Timeline generation
- Planner slot HTML generation
- Year tab rendering
**Dependencies**: State, planner module
**Complexity**: High (complex DOM, game-like UI)

#### `js/ui/progress-renderer.js` (~150 lines)
**Location**: app.js lines 1575-1651, 1823-1901
**Content**:
- `renderHiddenFactors()` - Factor list rendering
- `updateProgress()` - Progress calculation
- `syncProgressHeightToPlanner()` - Height sync
- `toggleFactorsExpanded()` - Mobile expansion
- Factor item HTML generation
**Dependencies**: State, check modules
**Complexity**: Medium (DOM updates, mobile handling)

#### `js/ui/event-listeners.js` (~300 lines)
**Location**: app.js lines 481-902
**Content**:
- `setupEventListeners()` - All event binding
- Filter button handlers
- Race card click handlers
- Planner interaction handlers
- Modal handlers
- Resize handlers
- Picker modal handlers
**Dependencies**: All other modules
**Complexity**: Very High (central coordination)

---

### Priority 4: Feature Modules (4 modules)
**Lines**: ~850 total

#### `js/features/filters.js` (~150 lines)
**Location**: app.js lines 481-902 (mixed in setupEventListeners)
**Content**:
- Filter application logic
- Grade filters (OR logic)
- Surface/Distance/Year filters (exclusive)
- Summer series filters
- Selected filter
- `clearAll()` - lines 1558-1574
**Dependencies**: State, race renderer
**Complexity**: Medium (multiple filter types)

#### `js/features/planner.js` (~200 lines)
**Location**: app.js lines 1239-1361
**Content**:
- `addRaceToCurrentCell()` - lines 1239-1265
- `addRaceToCurrentCellById()` - lines 1266-1303
- `removeRaceEverywhereFromPlanner()` - lines 1354-1362
- `toggleWinFromPlanner()` - lines 1304-1326
- `isPlannedAnywhere()` - lines 1327-1332
- `planRaceIntoPlanner()` - lines 1333-1353
- `getMaxConsecutiveRunsFromPlanner()` - lines 1925-1934
- `getMaxConsecutiveWinsFromPlanner()` - lines 1935-1944
- `hasLossThenWinFromPlanner()` - lines 1945-1956
**Dependencies**: State, planner renderer
**Complexity**: Medium (planner state manipulation)

#### `js/features/picker-modal.js` (~350 lines)
**Location**: app.js lines 903-1238
**Content**:
- `onPickerBackdrop()` - lines 903-911
- `navigatePicker()` - lines 1024-1038
- `updatePickerPagination()` - lines 1039-1058
- `jumpToPickerPosition()` - lines 1059-1081
- `attachPickerSwipeHandlers()` - lines 1082-1208
- `navigatePickerWithAnimation()` - lines 1209-1222
- `positionPickerNavs()` - lines 1223-1238
- Modal open/close logic (in setupEventListeners)
- Carousel navigation
- Swipe gesture handling
- Pagination
- Mobile navigation
**Dependencies**: State, scroll-lock, planner
**Complexity**: Very High (complex interaction)

#### `js/features/tracking.js` (~120 lines)
**Location**: app.js lines 1652-1720
**Content**:
- `setTrackedFactor()` - lines 1652-1666
- `clearTrackedFactor()` - lines 1667-1677
- `getTrackedFactorRaceIds()` - lines 1678-1689
- `isRaceTracked()` - lines 1690-1701
- `isSlotTracked()` - lines 1702-1720
- Tracking UI updates
**Dependencies**: State, progress renderer
**Complexity**: Low

---

### Priority 5: Storage Modules (3 modules)
**Lines**: ~600 total

#### `js/storage/storage-manager.js` (~200 lines)
**Location**: app.js lines 2428-2643
**Content**:
- `saveToSlot()` - lines 2428-2474
- `loadFromSlot()` - lines 2489-2505
- `loadSaveData()` - lines 2506-2511
- `getAllSaves()` - lines 2562-2573
- `captureCurrentState()` - lines 2574-2606
- `restoreState()` - lines 2607-2629
- `getCompletedFactorCount()` - lines 2630-2636
- `isCompatibleVersion()` - lines 2637-2643
**Dependencies**: State
**Complexity**: Medium (localStorage handling)

#### `js/storage/storage-ui.js` (~250 lines)
**Location**: app.js lines 2298-2511, 2790-2924
**Content**:
- `openSaveDialog()` - lines 2298-2307
- `closeSaveDialog()` - lines 2308-2316
- `openLoadDialog()` - lines 2317-2326
- `closeLoadDialog()` - lines 2327-2335
- `openShareDialog()` - lines 2336-2345
- `closeShareDialog()` - lines 2346-2354
- `openNameDialog()` - lines 2355-2380
- `closeNameDialog()` - lines 2381-2390
- `openDeleteDialog()` - lines 2391-2402
- `closeDeleteDialog()` - lines 2403-2413
- `promptSaveName()` - lines 2414-2417
- `confirmSaveName()` - lines 2418-2427
- `renameSlot()` - lines 2512-2541
- `confirmDeleteSlot()` - lines 2542-2549
- `executeDelete()` - lines 2550-2561
- `renderSaveSlots()` - lines 2790-2799
- `renderLoadSlots()` - lines 2800-2809
- `renderSaveSlot()` - lines 2810-2849
- `renderLoadSlot()` - lines 2850-2924
**Dependencies**: State, storage-manager
**Complexity**: High (complex UI, many modals)

#### `js/storage/url-sharing.js` (~150 lines)
**Location**: app.js lines 2644-2789
**Content**:
- `generateShareURL()` - lines 2644-2696
- `copyShareURL()` - lines 2697-2739
- `decodeURLState()` - lines 2740-2769
- `initializeFromURL()` - lines 2770-2789
**Dependencies**: State, storage-manager, LZString library
**Complexity**: Medium (URL encoding/decoding)

---

### Priority 6: Core Tracker Module (1 module)
**Lines**: ~150 total

#### `js/core/tracker.js` (~150 lines)
**Location**: app.js lines 7-44, 97-250
**Content**:
- Constructor and initialization
- Main class shell that coordinates all modules
- Module delegation
- Initialization flow
**Dependencies**: ALL other modules
**Complexity**: Very High (central coordinator)
**Note**: Extract this LAST after all other modules are working

---

## 📋 Remaining CSS Modules (17 of 17)

All CSS currently in `styles.css` (2,267 lines). Extract in this order:

### Base Styles (3 modules, ~200 lines)
- ⏳ `css/base/reset.css` - Lines 1-32
- ⏳ `css/base/layout.css` - Lines 28-233
- ⏳ `css/base/typography.css` - Lines 174-184

### Components (6 modules, ~750 lines)
- ⏳ `css/components/header.css` - Lines 34-73, 174-184
- ⏳ `css/components/footer.css` - Lines 124-173
- ⏳ `css/components/buttons.css` - Lines 234-327, 548-673, 827-911, 1119-1163, 1634-1675
- ⏳ `css/components/race-cards.css` - Lines 731-826, 1165-1208
- ⏳ `css/components/filters.css` - Lines 234-329
- ⏳ `css/components/stats.css` - Lines 1090-1117

### Features (5 modules, ~1,150 lines)
- ⏳ `css/features/planner.css` - Lines 339-458
- ⏳ `css/features/picker-modal.css` - Lines 459-730
- ⏳ `css/features/progress.css` - Lines 959-1089
- ⏳ `css/features/tracking.css` - Lines 1118-1254
- ⏳ `css/features/storage.css` - Lines 1255-1712

### Responsive (2 modules, ~600 lines)
- ⏳ `css/responsive/mobile.css` - Lines 1716-2084
- ⏳ `css/responsive/tablet.css` - Lines 2085-2266

### Utilities (2 modules, ~130 lines)
- ⏳ `css/utilities/animations.css` - Lines 69-72, 163-172, 622-625
- ⏳ `css/utilities/glass-effects.css` - Lines 200-214

---

## 🎯 Extraction Guide

### How to Extract a Module

1. **Identify the code section** using line numbers above
2. **Copy the code** to new module file
3. **Convert to ES6 module**:
   - Add `export` to functions/classes
   - Add `import` statements for dependencies
4. **Update references** in main file:
   - Replace `this.functionName()` with imported function
   - Pass `this` or state as parameter if needed
5. **Test** the functionality
6. **Update this tracker** - mark as ✅

### Template for JavaScript Modules

```javascript
/**
 * Module Name
 * Description of what this module does
 */

import { dependency1 } from './other-module.js';

/**
 * Function description
 * @param {type} param - Parameter description
 * @returns {type} Return description
 */
export function functionName(param) {
    // Implementation
}

export class ClassName {
    constructor() {
        // Setup
    }
    
    method() {
        // Implementation
    }
}
```

### Template for CSS Modules

```css
/**
 * Module Name
 * Description of what this module styles
 */

/* Main styles */
.selector {
    property: value;
}

/* Hover states */
.selector:hover {
    property: value;
}

/* Responsive adjustments (if needed) */
@media (max-width: 640px) {
    .selector {
        property: value;
    }
}
```

---

## 🔗 Module Dependencies Graph

```
tracker.js (EXTRACT LAST)
  ├─→ state.js ✅
  ├─→ utils.js ✅
  ├─→ race-data.js ✅
  ├─→ scroll-lock.js ✅
  │
  ├─→ hidden-factors.js ⏳
  │     └─→ check modules
  ├─→ race-helpers.js ⏳
  │
  ├─→ check-race-based.js ⏳
  ├─→ check-special.js ⏳
  ├─→ check-awakening.js ⏳
  │
  ├─→ race-renderer.js ⏳
  ├─→ planner-renderer.js ⏳
  ├─→ progress-renderer.js ⏳
  ├─→ event-listeners.js ⏳ (EXTRACT NEAR END)
  │
  ├─→ filters.js ⏳
  ├─→ planner.js ⏳
  ├─→ picker-modal.js ⏳
  ├─→ tracking.js ⏳
  │
  ├─→ storage-manager.js ⏳
  ├─→ storage-ui.js ⏳
  └─→ storage/url-sharing.js ⏳
```

---

## 📊 Progress Summary

### JavaScript
- ✅ Complete: 5 modules (28%)
- ⏳ Remaining: 13 modules (72%)
- 📝 Total: 18 modules

### CSS
- ✅ Complete: 0 modules (0%)
- ⏳ Remaining: 17 modules (100%)
- 📝 Total: 17 modules

### Overall
- ✅ Complete: 5 modules (14%)
- ⏳ Remaining: 30 modules (86%)
- 📝 Total: 35 modules

---

## 💡 Tips for Continuing

1. **Start with data modules** - They're independent and easy
2. **Then do check modules** - They depend on data modules
3. **Extract UI renderers** - They use data and checks
4. **Handle features** - They coordinate UI and state
5. **Do storage last** - They're mostly independent
6. **Extract event-listeners second-to-last** - It touches everything
7. **Extract tracker.js LAST** - It's the main coordinator

8. **Test after each extraction** - Don't extract multiple modules at once
9. **Use git commits** - Commit after each working module
10. **Keep backups** - Don't delete old code until fully working

---

## 🚀 Next Steps

### Immediate (Do These First)
1. Extract `js/data/race-helpers.js` (easy, ~120 lines)
2. Extract `js/data/hidden-factors.js` (data structure, ~250 lines)
3. Extract `js/features/tracking.js` (simple, ~120 lines)

### Short Term (Do These Next)
4. Extract check modules (3 files, ~570 lines total)
5. Extract `js/features/filters.js` (~150 lines)
6. Extract `js/features/planner.js` (~200 lines)

### Medium Term
7. Extract UI renderers (3 files, ~600 lines)
8. Extract storage modules (3 files, ~600 lines)
9. Extract `js/features/picker-modal.js` (~350 lines)

### Long Term (Do These Last)
10. Extract `js/ui/event-listeners.js` (~300 lines) - Complex!
11. Extract `js/core/tracker.js` (~150 lines) - Coordinator!
12. Extract all CSS modules (17 files)

---

## ✅ When Complete

After extracting all modules:
1. Update `index.html` to use module imports
2. Create new slim `app.js` entry point (~50 lines)
3. Create new slim `styles.css` with imports (~50 lines)
4. Remove `.backup` files
5. Update this tracker to mark all ✅
6. Celebrate! 🎉

---

*Last Updated: 2025-10-04*
*Status: Foundation complete, ready for continued extraction*
*See REFACTORING_PLAN.md for detailed architecture*
