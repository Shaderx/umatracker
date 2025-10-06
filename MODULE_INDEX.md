# Module Index - Quick Reference

**Last Updated**: October 4, 2025  
**Total Modules**: 18 (16 JS, 2 CSS)  
**Status**: ✅ Core extraction complete

---

## 📋 Quick Navigation

- [Core Modules](#core-modules)
- [Data Modules](#data-modules)
- [Feature Modules](#feature-modules)
- [Check Modules](#check-modules)
- [UI Modules](#ui-modules)
- [CSS Modules](#css-modules)
- [Usage Examples](#usage-examples)
- [Import Patterns](#import-patterns)

---

## Core Modules

### `js/core/utils.js`
**Lines**: 51 | **Complexity**: Low | **Dependencies**: None

```javascript
import { isMobileOrTablet, showToast } from './js/core/utils.js';
```

**Exports**:
- `isMobileOrTablet()` → `boolean` - Detects mobile/tablet devices
- `showToast(message, duration?)` → `void` - Shows toast notification

**Use Cases**:
- Device detection for responsive behavior
- User feedback notifications

---

### `js/core/state.js`
**Lines**: 99 | **Complexity**: Low | **Dependencies**: None

```javascript
import { state, createEmptyPlannerData, resetState } from './js/core/state.js';
```

**Exports**:
- `state` → `Object` - Global application state
- `createEmptyPlannerData()` → `Object` - Creates empty planner structure
- `resetState()` → `void` - Resets state to defaults

**State Structure**:
```javascript
{
  races: [],                    // All race data
  raceById: Map,               // Race lookup by ID
  raceIdsByName: Map,          // Race IDs by name
  selectedRaces: Set,          // User-selected races
  wonRaces: Set,               // Races marked as won
  lostRaces: Set,              // Races marked as lost
  plannerData: {               // Planner calendar data
    junior: {},
    classics: {},
    senior: {}
  },
  plannerYear: 'junior',       // Active planner year
  trackedFactorId: null,       // Currently tracked hidden factor
  filters: {                   // Active filters
    distance: 'all',
    surface: 'all',
    grade: 'all',
    // ... etc
  }
}
```

---

## Data Modules

### `js/data/race-data.js`
**Lines**: 211 | **Complexity**: Medium | **Dependencies**: `state`

```javascript
import { 
  distanceCategories, 
  easternTracks, 
  westernTracks, 
  summerSeries, 
  translations,
  initializeRaceData 
} from './js/data/race-data.js';
```

**Exports**:
- `distanceCategories` → `Object` - Distance classification
- `easternTracks` → `Array<string>` - Eastern racecourses
- `westernTracks` → `Array<string>` - Western racecourses
- `summerSeries` → `Array<string>` - Summer series races
- `translations` → `Object` - UI translations
- `initializeRaceData()` → `void` - Loads races into state

**Usage**:
```javascript
// Initialize race data first
await initializeRaceData();

// Then access data
console.log(state.races.length); // All races loaded
console.log(easternTracks); // ['東京', '中山', ...]
```

---

### `js/data/race-helpers.js`
**Lines**: 175 | **Complexity**: Medium | **Dependencies**: `state`

```javascript
import { 
  getRacesForEasternG1,
  getRacesForWesternG1,
  getRacesForNewspaperCups,
  // ... etc
} from './js/data/race-helpers.js';
```

**Exports**: 12 race getter functions
- `getRacesForEasternG1()` → `Array<string>`
- `getRacesForWesternG1()` → `Array<string>`
- `getRacesForNewspaperCups()` → `Array<string>`
- `getRacesForSummerSeries()` → `Array<string>`
- `getRacesForNewYearGold()` → `Array<string>`
- `getRacesForStarRaces()` → `Array<string>`
- `getRacesForJewelryRaces()` → `Array<string>`
- `getRacesForDualSurface()` → `Array<string>`
- `getRacesForPerfectCrown()` → `Array<string>`
- `getRacesForPerfectTiara()` → `Array<string>`
- `getRacesForDirectionalAwakening()` → `Array<string>`
- `getRacesForSeasonalAwakening()` → `Array<string>`

**Usage**:
```javascript
const easternG1s = getRacesForEasternG1();
console.log(easternG1s); // ['東京優駿（日本ダービー）', ...]
```

---

### `js/data/hidden-factors.js`
**Lines**: 330 | **Complexity**: High | **Dependencies**: `check-*`, `race-helpers`

```javascript
import { hiddenFactors } from './js/data/hidden-factors.js';
```

**Exports**:
- `hiddenFactors` → `Array<Object>` - All 24 hidden factors

**Hidden Factor Structure**:
```javascript
{
  id: 'eastern_g1',
  name: '東のG1制覇',
  condition: '東のG1レースを5つ以上勝利',
  checkFunction: checkEasternG1Wins,
  getRaces: getRacesForEasternG1
}
```

**All 24 Hidden Factors**:
1. `eastern_g1` - Eastern G1 Mastery
2. `western_g1` - Western G1 Mastery
3. `different_racecourses` - Different Racecourses
4. `all_distance_g1` - All Distance G1
5. `newspaper_cups` - Newspaper Cups
6. `summer_series` - Summer Series
7. `new_year_gold` - New Year Gold
8. `star_races` - Star Races
9. `jewelry_races` - Jewelry Races
10. `dual_surface` - Dual Surface
11. `perfect_crown` - Perfect Crown
12. `perfect_tiara` - Perfect Tiara
13. `consecutive_runs` - Consecutive Runs
14. `consecutive_wins` - Consecutive Wins
15. `improves_with_racing` - Improves With Racing
16. `never_give_up` - Never Give Up
17. `rebellious_spirit` - Rebellious Spirit
18. `directional_awakening` - Directional Awakening
19. `seasonal_awakening` - Seasonal Awakening
20. `directional_awakening_turf` - Directional Awakening (Turf)
21. `directional_awakening_dirt` - Directional Awakening (Dirt)
22. `seasonal_awakening_spring` - Seasonal Awakening (Spring)
23. `seasonal_awakening_autumn` - Seasonal Awakening (Autumn)
24. `seasonal_awakening_winter` - Seasonal Awakening (Winter)

---

## Feature Modules

### `js/features/tracking.js`
**Lines**: 95 | **Complexity**: Low | **Dependencies**: `state`, `hidden-factors`

```javascript
import { 
  setTrackedFactor,
  clearTrackedFactor,
  getTrackedFactorRaceIds,
  isRaceTracked,
  isSlotTracked
} from './js/features/tracking.js';
```

**Exports**:
- `setTrackedFactor(factorId)` → `void` - Set active tracking
- `clearTrackedFactor()` → `void` - Clear tracking
- `getTrackedFactorRaceIds()` → `Set<string>` - Get tracked race IDs
- `isRaceTracked(raceId)` → `boolean` - Check if race is tracked
- `isSlotTracked(month, half, ...)` → `boolean` - Check if planner slot is tracked

**Usage**:
```javascript
setTrackedFactor('eastern_g1');
const trackedIds = getTrackedFactorRaceIds();
console.log(isRaceTracked('123')); // true/false
```

---

### `js/features/filters.js`
**Lines**: 150 | **Complexity**: Medium | **Dependencies**: `state`, `race-data`

```javascript
import { 
  applyFilters,
  updateFilterUI,
  setupFilterListeners
} from './js/features/filters.js';
```

**Exports**:
- `applyFilters(races)` → `Array<Race>` - Apply all active filters
- `updateFilterUI()` → `void` - Update filter button states
- `setupFilterListeners(callbacks)` → `void` - Initialize filter event listeners

**Callbacks**:
- `onFilterChange()` - Called when filters change

**Usage**:
```javascript
const filtered = applyFilters(state.races);
setupFilterListeners({
  onFilterChange: () => renderRaces()
});
```

---

### `js/features/scroll-lock.js`
**Lines**: 57 | **Complexity**: Low | **Dependencies**: `state`

```javascript
import { lockBodyScroll, unlockBodyScroll } from './js/features/scroll-lock.js';
```

**Exports**:
- `lockBodyScroll()` → `void` - Prevent body scrolling
- `unlockBodyScroll()` → `void` - Restore body scrolling

**Usage**:
```javascript
// When opening modal
lockBodyScroll();

// When closing modal
unlockBodyScroll();
```

---

### `js/features/planner-helpers.js`
**Lines**: 95 | **Complexity**: Low | **Dependencies**: `state`

```javascript
import { 
  buildPlannerTimeline,
  getMaxConsecutiveRunsFromPlanner,
  getMaxConsecutiveWinsFromPlanner,
  hasLossThenWinFromPlanner
} from './js/features/planner-helpers.js';
```

**Exports**:
- `buildPlannerTimeline()` → `Array<Object>` - Build race timeline
- `getMaxConsecutiveRunsFromPlanner()` → `number` - Calculate run streaks
- `getMaxConsecutiveWinsFromPlanner()` → `number` - Calculate win streaks
- `hasLossThenWinFromPlanner()` → `boolean` - Check loss→win pattern

**Usage**:
```javascript
const timeline = buildPlannerTimeline();
const maxRuns = getMaxConsecutiveRunsFromPlanner();
console.log(`Max consecutive runs: ${maxRuns}`);
```

---

### `js/features/planner.js`
**Lines**: 217 | **Complexity**: Medium | **Dependencies**: `state`, `planner-renderer`

```javascript
import { 
  setPlannerYear,
  clearPlannerYear,
  removeRaceFromPlanner,
  toggleWinFromPlanner,
  syncSelectionsFromPlanner,
  isPlannedAnywhere,
  planRaceIntoPlanner,
  removeRaceEverywhereFromPlanner,
  toggleParticipationById,
  toggleWinById,
  setupPlannerEventListeners
} from './js/features/planner.js';
```

**Exports**: 11 planner functions (see above)

**Usage**:
```javascript
// Set active year
setPlannerYear('junior', renderPlannerGrid);

// Toggle race participation
toggleParticipationById('123', 
  removeRaceEverywhereFromPlanner,
  planRaceIntoPlanner,
  renderRaces,
  renderPlannerGrid,
  updateProgress
);
```

---

## Check Modules

### `js/checks/check-awakening.js`
**Lines**: 50 | **Complexity**: Low | **Dependencies**: `state`, `race-helpers`

```javascript
import { 
  checkDirectionalAwakening,
  checkSeasonalAwakening
} from './js/checks/check-awakening.js';
```

**Exports**:
- `checkDirectionalAwakening()` → `Object` - Check directional awakening
- `checkSeasonalAwakening()` → `Object` - Check seasonal awakening

**Return Structure**:
```javascript
{
  unlocked: boolean,
  current: number,
  required: number,
  details: string
}
```

---

### `js/checks/check-special.js`
**Lines**: 110 | **Complexity**: Medium | **Dependencies**: `state`, `planner-helpers`

```javascript
import { 
  checkConsecutiveRuns,
  checkConsecutiveWins,
  checkImprovesWithRacing,
  checkNeverGiveUp,
  checkRebelliousSpirit
} from './js/checks/check-special.js';
```

**Exports**: 5 special check functions (see above)

**Usage**:
```javascript
const result = checkConsecutiveRuns();
console.log(result.unlocked); // true/false
console.log(result.current); // 5
console.log(result.required); // 10
```

---

### `js/checks/check-race-based.js`
**Lines**: 350 | **Complexity**: High | **Dependencies**: `state`, `race-helpers`, `race-data`

```javascript
import { 
  checkEasternG1Wins,
  checkWesternG1Wins,
  checkDifferentRacecourses,
  checkAllDistanceG1,
  checkNewspaperCups,
  checkSummerSeries,
  checkNewYearGold,
  checkStarRaces,
  checkJewelryRaces,
  checkDualSurface,
  checkPerfectCrown,
  checkPerfectTiara,
  checkDirectionalAwakeningSurface,
  checkSeasonalAwakeningSurface
} from './js/checks/check-race-based.js';
```

**Exports**: 14 race-based check functions (see above)

**Usage**:
```javascript
const result = checkEasternG1Wins();
if (result.unlocked) {
  console.log('Eastern G1 Mastery unlocked!');
}
```

---

## UI Modules

### `js/ui/progress-renderer.js`
**Lines**: 120 | **Complexity**: Low | **Dependencies**: `hidden-factors`

```javascript
import { renderHiddenFactors } from './js/ui/progress-renderer.js';
```

**Exports**:
- `renderHiddenFactors(results, callbacks)` → `void` - Render progress panel

**Callbacks**:
- `onTrackClick(factorId)` - Handle track button clicks

**Usage**:
```javascript
renderHiddenFactors(checkResults, {
  onTrackClick: (factorId) => {
    setTrackedFactor(factorId);
    renderRaces();
  }
});
```

---

### `js/ui/race-renderer.js`
**Lines**: 180 | **Complexity**: Medium | **Dependencies**: `state`, `tracking`

```javascript
import { renderRaces } from './js/ui/race-renderer.js';
```

**Exports**:
- `renderRaces(races, callbacks)` → `void` - Render race grid

**Callbacks**:
- `onToggleParticipation(raceId)` - Handle participation toggle
- `onToggleWin(raceId)` - Handle win/loss toggle

**Usage**:
```javascript
renderRaces(filteredRaces, {
  onToggleParticipation: (raceId) => {
    toggleParticipationById(raceId, ...);
  },
  onToggleWin: (raceId) => {
    toggleWinById(raceId);
    renderPlannerGrid();
  }
});
```

---

### `js/ui/planner-renderer.js`
**Lines**: 185 | **Complexity**: Medium | **Dependencies**: `state`, `tracking`

```javascript
import { renderPlannerGrid, cellKey } from './js/ui/planner-renderer.js';
```

**Exports**:
- `renderPlannerGrid(callbacks)` → `void` - Render planner calendar
- `cellKey(month, half)` → `string` - Generate cell key

**Callbacks**:
- `onOpenPicker(month, half)` - Handle cell click
- `onRemoveRace(month, half)` - Handle race removal
- `onToggleWin(month, half)` - Handle win/loss toggle

**Usage**:
```javascript
renderPlannerGrid({
  onOpenPicker: (month, half) => {
    openPicker(month, half);
  },
  onRemoveRace: (month, half) => {
    removeRaceFromPlanner(month, half, ...);
  },
  onToggleWin: (month, half) => {
    toggleWinFromPlanner(month, half, ...);
  }
});
```

---

## CSS Modules

### `css/base/reset.css`
**Lines**: 45 | **Complexity**: Low

```html
<link rel="stylesheet" href="css/base/reset.css">
```

**Content**:
- Universal box-sizing
- Body base styles
- Modal scroll lock styles

---

### `css/utilities/animations.css`
**Lines**: 60 | **Complexity**: Low

```html
<link rel="stylesheet" href="css/utilities/animations.css">
```

**Animations**:
- `logoHop` - Logo bounce animation
- `heartbeat` - Heartbeat pulse
- `swipeHintPulse` - Swipe hint animation
- `modalSlideIn` - Modal entrance
- `fadeOut` - Fade out effect

---

## Usage Examples

### Complete Initialization Flow

```javascript
// 1. Import all modules
import { state, createEmptyPlannerData } from './js/core/state.js';
import { initializeRaceData } from './js/data/race-data.js';
import { hiddenFactors } from './js/data/hidden-factors.js';
import { setTrackedFactor } from './js/features/tracking.js';
import { applyFilters, setupFilterListeners } from './js/features/filters.js';
import { renderHiddenFactors } from './js/ui/progress-renderer.js';
import { renderRaces } from './js/ui/race-renderer.js';
import { renderPlannerGrid } from './js/ui/planner-renderer.js';

// 2. Initialize data
await initializeRaceData();

// 3. Run all checks
const checkResults = hiddenFactors.map(factor => ({
  ...factor,
  result: factor.checkFunction()
}));

// 4. Render UI
renderHiddenFactors(checkResults, {
  onTrackClick: (factorId) => {
    setTrackedFactor(factorId);
    renderRaces(applyFilters(state.races), callbacks);
  }
});

renderRaces(applyFilters(state.races), {
  onToggleParticipation: (raceId) => {
    // Handle participation toggle
  },
  onToggleWin: (raceId) => {
    // Handle win/loss toggle
  }
});

renderPlannerGrid({
  onOpenPicker: (month, half) => {
    // Handle picker open
  }
});

// 5. Setup filters
setupFilterListeners({
  onFilterChange: () => {
    renderRaces(applyFilters(state.races), callbacks);
  }
});
```

### Check Hidden Factors

```javascript
import { hiddenFactors } from './js/data/hidden-factors.js';

// Run all checks
const results = hiddenFactors.map(factor => {
  const result = factor.checkFunction();
  return {
    id: factor.id,
    name: factor.name,
    unlocked: result.unlocked,
    progress: `${result.current}/${result.required}`
  };
});

// Filter unlocked factors
const unlocked = results.filter(r => r.unlocked);
console.log(`Unlocked: ${unlocked.length}/24`);
```

### Track a Hidden Factor

```javascript
import { setTrackedFactor, getTrackedFactorRaceIds } from './js/features/tracking.js';
import { renderRaces } from './js/ui/race-renderer.js';
import { applyFilters } from './js/features/filters.js';

// Track Eastern G1
setTrackedFactor('eastern_g1');

// Get relevant races
const trackedIds = getTrackedFactorRaceIds();
console.log(`Tracking ${trackedIds.size} races`);

// Re-render with highlighting
renderRaces(applyFilters(state.races), callbacks);
```

---

## Import Patterns

### Pattern 1: Core Initialization
```javascript
import { state } from './js/core/state.js';
import { initializeRaceData } from './js/data/race-data.js';
import { hiddenFactors } from './js/data/hidden-factors.js';
```

### Pattern 2: Feature Usage
```javascript
import { setTrackedFactor } from './js/features/tracking.js';
import { applyFilters } from './js/features/filters.js';
import { toggleParticipationById } from './js/features/planner.js';
```

### Pattern 3: UI Rendering
```javascript
import { renderHiddenFactors } from './js/ui/progress-renderer.js';
import { renderRaces } from './js/ui/race-renderer.js';
import { renderPlannerGrid } from './js/ui/planner-renderer.js';
```

### Pattern 4: Complete App
```javascript
// All imports in one place
import { state, createEmptyPlannerData } from './js/core/state.js';
import { isMobileOrTablet, showToast } from './js/core/utils.js';
import { initializeRaceData, translations } from './js/data/race-data.js';
import { hiddenFactors } from './js/data/hidden-factors.js';
import { setTrackedFactor, clearTrackedFactor } from './js/features/tracking.js';
import { applyFilters, setupFilterListeners } from './js/features/filters.js';
import { lockBodyScroll, unlockBodyScroll } from './js/features/scroll-lock.js';
import { 
  setPlannerYear, 
  toggleParticipationById, 
  toggleWinById 
} from './js/features/planner.js';
import { renderHiddenFactors } from './js/ui/progress-renderer.js';
import { renderRaces } from './js/ui/race-renderer.js';
import { renderPlannerGrid } from './js/ui/planner-renderer.js';
```

---

## Module Loading Order

**Critical**: Modules must be loaded in dependency order:

1. **Core** (no dependencies)
   - `utils.js`
   - `state.js`

2. **Data** (depends on core)
   - `race-data.js`
   - `race-helpers.js`

3. **Features** (depends on core + data)
   - `tracking.js`
   - `filters.js`
   - `scroll-lock.js`
   - `planner-helpers.js`

4. **Checks** (depends on data + features)
   - `check-awakening.js`
   - `check-special.js`
   - `check-race-based.js`

5. **Hidden Factors** (depends on checks)
   - `hidden-factors.js`

6. **Planner** (depends on features)
   - `planner.js`

7. **UI** (depends on all above)
   - `progress-renderer.js`
   - `race-renderer.js`
   - `planner-renderer.js`

---

## Quick Reference Table

| Module | Lines | Exports | Dependencies | Complexity |
|--------|-------|---------|--------------|------------|
| utils.js | 51 | 2 | 0 | Low |
| state.js | 99 | 3 | 0 | Low |
| race-data.js | 211 | 6 | 1 | Medium |
| race-helpers.js | 175 | 12 | 1 | Medium |
| hidden-factors.js | 330 | 1 | 4 | High |
| tracking.js | 95 | 5 | 2 | Low |
| filters.js | 150 | 3 | 2 | Medium |
| scroll-lock.js | 57 | 2 | 1 | Low |
| planner-helpers.js | 95 | 4 | 1 | Low |
| planner.js | 217 | 11 | 2 | Medium |
| check-awakening.js | 50 | 2 | 2 | Low |
| check-special.js | 110 | 5 | 2 | Medium |
| check-race-based.js | 350 | 14 | 3 | High |
| progress-renderer.js | 120 | 1 | 1 | Low |
| race-renderer.js | 180 | 1 | 2 | Medium |
| planner-renderer.js | 185 | 2 | 2 | Medium |
| reset.css | 45 | - | 0 | Low |
| animations.css | 60 | - | 0 | Low |

---

**Total**: 18 modules, 2,580 lines, 78 exports

---

*Last Updated: October 4, 2025*  
*For detailed documentation, see REFACTORING_COMPLETE_SUMMARY.md*
