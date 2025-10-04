# 🔨 Refactoring Plan: Breaking Down app.js and styles.css

## 📊 Current State Analysis

### Current Files
- **app.js**: ~2,927 lines (single monolithic class)
- **styles.css**: ~2,266 lines (all styles in one file)
- **Total**: ~5,193 lines to refactor

### Problem
- Files exceed AI agent's single-read token limit (25,000 tokens)
- Difficult to maintain and understand
- No clear separation of concerns
- Hard to test individual components

---

## 🎯 Refactoring Goals

1. **Break files into logical, focused modules** (< 500 lines each)
2. **Maintain backward compatibility** (no breaking changes)
3. **Enable AI agents to read entire files** in one pass
4. **Improve maintainability** and testability
5. **Keep clear separation of concerns**

---

## 📁 Proposed File Structure

### JavaScript Files (Breaking down app.js → 2,927 lines)

```
js/
├── core/
│   ├── tracker.js              (~150 lines) - Main UmaMusumeTracker class shell & initialization
│   ├── state.js                (~100 lines) - State management (races, filters, planner data)
│   └── utils.js                (~80 lines)  - Utility functions (isMobileOrTablet, toast, etc.)
│
├── data/
│   ├── race-data.js            (~100 lines) - Race data loading & parsing
│   ├── hidden-factors.js       (~250 lines) - Hidden factors definitions
│   └── race-helpers.js         (~120 lines) - Race getter functions (getEasternG1, etc.)
│
├── ui/
│   ├── race-renderer.js        (~200 lines) - Race grid rendering
│   ├── planner-renderer.js     (~250 lines) - Planner grid & timeline rendering
│   ├── progress-renderer.js    (~150 lines) - Progress panel & hidden factors display
│   └── event-listeners.js      (~300 lines) - All event listener setup
│
├── features/
│   ├── filters.js              (~150 lines) - Filter logic & application
│   ├── planner.js              (~200 lines) - Planner state & manipulation
│   ├── picker-modal.js         (~350 lines) - Race picker modal (carousel, swipe, navigation)
│   ├── tracking.js             (~120 lines) - Hidden factor tracking system
│   └── scroll-lock.js          (~80 lines)  - Body scroll lock for modals
│
├── storage/
│   ├── storage-manager.js      (~200 lines) - Save/load system
│   ├── storage-ui.js           (~250 lines) - Storage modals & dialogs
│   └── url-sharing.js          (~150 lines) - URL encoding/decoding for sharing
│
└── checks/
    ├── check-race-based.js     (~300 lines) - Race-based hidden factor checks
    ├── check-special.js        (~150 lines) - Special condition checks (consecutive, etc.)
    └── check-awakening.js      (~120 lines) - Awakening checks (directional, seasonal)

app.js                          (~50 lines)  - Entry point that imports & initializes everything
```

**Total JS Files**: 17 files + main app.js = 18 files
**Average**: ~165 lines per file (well within AI token limits)

---

### CSS Files (Breaking down styles.css → 2,266 lines)

```
css/
├── base/
│   ├── reset.css               (~50 lines)  - Reset & base styles
│   ├── layout.css              (~100 lines) - Container, grid, main layout
│   └── typography.css          (~50 lines)  - Fonts, text styles
│
├── components/
│   ├── header.css              (~120 lines) - Header, logo, discord button
│   ├── footer.css              (~80 lines)  - Footer styles
│   ├── buttons.css             (~150 lines) - All button styles
│   ├── race-cards.css          (~200 lines) - Race card styles
│   ├── filters.css             (~120 lines) - Filter button styles
│   └── stats.css               (~80 lines)  - Stats grid styles
│
├── features/
│   ├── planner.css             (~300 lines) - Planner grid, slots, tabs
│   ├── picker-modal.css        (~350 lines) - Picker modal, carousel, swipe
│   ├── progress.css            (~150 lines) - Progress panel, hidden factors
│   ├── tracking.css            (~100 lines) - Tracking highlights & indicators
│   └── storage.css             (~250 lines) - Storage modals, slots, dialogs
│
├── responsive/
│   ├── mobile.css              (~400 lines) - Mobile styles (< 640px)
│   └── tablet.css              (~200 lines) - Tablet styles (641px - 900px)
│
└── utilities/
    ├── animations.css          (~80 lines)  - Keyframes & animations
    └── glass-effects.css       (~50 lines)  - Glass morphism effects

styles.css                      (~50 lines)  - Main import file
```

**Total CSS Files**: 16 files + main styles.css = 17 files
**Average**: ~133 lines per file (well within AI token limits)

---

## 🔄 Migration Strategy

### Phase 1: Create New File Structure (No Breaking Changes)
1. Create all new directories (`js/`, `css/` with subdirectories)
2. Extract code into new files
3. Add proper imports/exports (ES6 modules)
4. Keep original `app.js` and `styles.css` as imports

### Phase 2: Update HTML
1. Update `index.html` to use new module structure
2. Add `type="module"` to script tags
3. Import CSS files in proper order

### Phase 3: Testing
1. Test all functionality works identically
2. Verify mobile/tablet responsive behavior
3. Test storage system, modals, filters
4. Verify no console errors

### Phase 4: Cleanup
1. Archive old `app.js` and `styles.css` (rename to `.backup`)
2. Update documentation
3. Update README.md

---

## 📋 Detailed File Breakdown

### JavaScript Modules

#### `js/core/tracker.js` (~150 lines)
```javascript
// Main UmaMusumeTracker class shell
// - Constructor
// - initializeData()
// - Main initialization flow
// - Delegates to other modules
```

#### `js/core/state.js` (~100 lines)
```javascript
// State management
// - races, hiddenFactors arrays
// - selectedRaces, wonRaces, lostRaces Sets
// - currentFilters Set
// - plannerData object
// - trackedFactorId
// - State getters/setters
```

#### `js/core/utils.js` (~80 lines)
```javascript
// Utility functions
// - isMobileOrTablet()
// - showToast()
// - Date/time helpers
// - contactOnDiscord()
```

#### `js/data/race-data.js` (~100 lines)
```javascript
// Race data loading
// - loadRaceData()
// - buildRaceMaps()
// - isGradeOne()
// - Distance categories
// - Region definitions
```

#### `js/data/hidden-factors.js` (~250 lines)
```javascript
// Hidden factors definitions
// - loadHiddenFactors()
// - All 42 hidden factor definitions
// - Factor metadata (EN/JP names, conditions)
```

#### `js/data/race-helpers.js` (~120 lines)
```javascript
// Race getter functions
// - getRacesForEasternG1()
// - getRacesForWesternG1()
// - getRacesForNewspaperCups()
// - getRacesForSummerSeries()
// - getRacesForNewYearGold()
// - getRacesForStarRaces()
// - getRacesForJewelryRaces()
// - getRacesForDualSurface()
// - getRacesForPerfectCrown()
// - getRacesForPerfectTiara()
// - getRacesForDirectionalAwakening()
// - getRacesForSeasonalAwakening()
```

#### `js/ui/race-renderer.js` (~200 lines)
```javascript
// Race grid rendering
// - renderRaces()
// - getFilteredRaces()
// - sortRacesList()
// - Race card HTML generation
```

#### `js/ui/planner-renderer.js` (~250 lines)
```javascript
// Planner rendering
// - renderPlannerGrid()
// - buildPlannerTimeline()
// - createEmptyPlannerData()
// - Planner slot HTML generation
// - Year tab rendering
```

#### `js/ui/progress-renderer.js` (~150 lines)
```javascript
// Progress panel rendering
// - renderHiddenFactors()
// - updateProgress()
// - syncProgressHeightToPlanner()
// - toggleFactorsExpanded()
// - Factor item HTML generation
```

#### `js/ui/event-listeners.js` (~300 lines)
```javascript
// Event listener setup
// - setupEventListeners()
// - Filter button handlers
// - Race card click handlers
// - Planner interaction handlers
// - Modal handlers
// - Resize handlers
```

#### `js/features/filters.js` (~150 lines)
```javascript
// Filter logic
// - Filter application
// - Grade filters (OR logic)
// - Surface/Distance/Year filters (exclusive)
// - Summer series filters
// - Selected filter
// - clearAll()
```

#### `js/features/planner.js` (~200 lines)
```javascript
// Planner state management
// - addRaceToCurrentCell()
// - addRaceToCurrentCellById()
// - removeRaceEverywhereFromPlanner()
// - toggleWinFromPlanner()
// - isPlannedAnywhere()
// - planRaceIntoPlanner()
// - getMaxConsecutiveRunsFromPlanner()
// - getMaxConsecutiveWinsFromPlanner()
// - hasLossThenWinFromPlanner()
```

#### `js/features/picker-modal.js` (~350 lines)
```javascript
// Race picker modal
// - Modal open/close
// - Carousel navigation
// - Swipe gesture handling
// - Pagination
// - Mobile navigation
// - onPickerBackdrop()
// - navigatePicker()
// - updatePickerPagination()
// - jumpToPickerPosition()
// - attachPickerSwipeHandlers()
// - navigatePickerWithAnimation()
// - positionPickerNavs()
```

#### `js/features/tracking.js` (~120 lines)
```javascript
// Hidden factor tracking
// - setTrackedFactor()
// - clearTrackedFactor()
// - getTrackedFactorRaceIds()
// - isRaceTracked()
// - isSlotTracked()
// - Tracking UI updates
```

#### `js/features/scroll-lock.js` (~80 lines)
```javascript
// Body scroll lock for modals
// - lockBodyScroll()
// - unlockBodyScroll()
// - scrollPosition tracking
// - lockCount management
```

#### `js/storage/storage-manager.js` (~200 lines)
```javascript
// Save/load system core
// - saveToSlot()
// - loadFromSlot()
// - getAllSaves()
// - captureCurrentState()
// - restoreState()
// - getCompletedFactorCount()
// - isCompatibleVersion()
```

#### `js/storage/storage-ui.js` (~250 lines)
```javascript
// Storage UI
// - openSaveDialog()
// - closeSaveDialog()
// - openLoadDialog()
// - closeLoadDialog()
// - openNameDialog()
// - closeNameDialog()
// - openDeleteDialog()
// - closeDeleteDialog()
// - renderSaveSlots()
// - renderLoadSlots()
// - renderSaveSlot()
// - renderLoadSlot()
```

#### `js/storage/url-sharing.js` (~150 lines)
```javascript
// URL sharing
// - generateShareURL()
// - copyShareURL()
// - decodeURLState()
// - initializeFromURL()
// - openShareDialog()
// - closeShareDialog()
```

#### `js/checks/check-race-based.js` (~300 lines)
```javascript
// Race-based checks
// - checkEasternG1Wins()
// - checkWesternG1Wins()
// - checkDifferentRacecourses()
// - checkAllDistanceG1()
// - checkNewspaperCups()
// - checkSummerSeries()
// - checkNewYearGold()
// - checkStarRaces()
// - checkJewelryRaces()
// - checkDualSurface()
// - checkPerfectCrown()
// - checkPerfectTiara()
```

#### `js/checks/check-special.js` (~150 lines)
```javascript
// Special condition checks
// - checkConsecutiveRuns()
// - checkConsecutiveWins()
// - checkImprovesWithRacing()
// - checkNeverGiveUp()
// - checkRebelliousSpirit()
```

#### `js/checks/check-awakening.js` (~120 lines)
```javascript
// Awakening checks
// - checkDirectionalAwakening()
// - checkSeasonalAwakening()
```

#### `app.js` (~50 lines)
```javascript
// Entry point
// - Import all modules
// - Initialize tracker
// - Export for global access
```

---

### CSS Modules

#### `css/base/reset.css` (~50 lines)
- Universal reset
- Box-sizing
- Body base styles

#### `css/base/layout.css` (~100 lines)
- Container
- Main content grid
- Section layouts
- Races/progress sections

#### `css/base/typography.css` (~50 lines)
- Font families
- Headings
- Text styles

#### `css/components/header.css` (~120 lines)
- Header styles
- Logo container & animations
- Title & subtitle

#### `css/components/footer.css` (~80 lines)
- Footer layout
- Footer content
- Heart animation

#### `css/components/buttons.css` (~150 lines)
- Base button styles
- Primary/secondary/danger buttons
- Win buttons
- Toggle buttons

#### `css/components/race-cards.css` (~200 lines)
- Race card layout
- Race thumbnails
- Race details
- Race grades
- Selected/won states
- Tracking indicators

#### `css/components/filters.css` (~120 lines)
- Filter button styles
- Active states
- Summer series styling
- Selected filter styling
- Clear all button

#### `css/components/stats.css` (~80 lines)
- Stats grid
- Stat items
- Stat numbers & labels

#### `css/features/planner.css` (~300 lines)
- Year tabs
- Planner grid
- Planner slots
- Slot headers & bodies
- Plus button
- Slot buttons with images
- Remove button
- Summer styling
- Disabled states

#### `css/features/picker-modal.css` (~350 lines)
- Modal backdrop & panel
- Carousel container
- Carousel cards
- Navigation arrows
- Swipe indicators
- Pagination dots
- Mobile navigation
- Picker list & items

#### `css/features/progress.css` (~150 lines)
- Progress section
- Hidden factors list
- Factor items
- Factor headers
- Progress bars
- Show more button
- Completion badges

#### `css/features/tracking.css` (~100 lines)
- Track button
- Clear tracking button
- Race tracked highlights
- Planner tracked highlights
- Filter match highlights
- Combined indicators

#### `css/features/storage.css` (~250 lines)
- Storage toolbar
- Storage modals
- Save/load slots
- Slot cards
- Naming dialog
- Delete confirmation
- Share dialog
- Toast notifications

#### `css/responsive/mobile.css` (~400 lines)
- Mobile layout (< 640px)
- Stacked layout
- Compact planner
- 2-column race grid
- Mobile modals
- Mobile navigation
- Collapsible factors

#### `css/responsive/tablet.css` (~200 lines)
- Tablet layout (641px - 900px)
- Stacked layout
- Tablet planner
- 3-column race grid
- Tablet modals

#### `css/utilities/animations.css` (~80 lines)
- @keyframes definitions
- logoHop
- heartbeat
- swipeHintPulse
- modalSlideIn
- slideInUp
- fadeOut

#### `css/utilities/glass-effects.css` (~50 lines)
- Glass morphism
- Backdrop filters
- Transparency effects

#### `styles.css` (~50 lines)
```css
/* Main import file */
@import url('css/base/reset.css');
@import url('css/base/layout.css');
@import url('css/base/typography.css');
/* ... etc */
```

---

## 🚀 Implementation Steps

### Step 1: Create Directory Structure
```bash
mkdir -p js/{core,data,ui,features,storage,checks}
mkdir -p css/{base,components,features,responsive,utilities}
```

### Step 2: Extract JavaScript Modules
- Start with independent modules (utils, state)
- Move to data modules (race-data, hidden-factors)
- Extract UI renderers
- Extract feature modules
- Extract check functions
- Create main app.js that imports everything

### Step 3: Extract CSS Modules
- Start with base styles
- Extract components
- Extract features
- Extract responsive styles
- Extract utilities
- Create main styles.css with imports

### Step 4: Update index.html
- Update script tag to use modules
- Update CSS imports

### Step 5: Test & Verify
- Test all functionality
- Verify no regressions
- Check console for errors

---

## 📝 Benefits After Refactoring

### For AI Agents
✅ Each file < 400 lines (easily readable in one pass)
✅ Clear file names indicate purpose
✅ Logical organization by concern
✅ Easy to locate specific functionality

### For Developers
✅ Better code organization
✅ Easier to maintain
✅ Easier to test individual modules
✅ Clearer separation of concerns
✅ Easier to add new features

### For the Project
✅ More scalable architecture
✅ Better performance (can lazy-load modules)
✅ Easier collaboration
✅ Reduced merge conflicts

---

## ⚠️ Important Notes

1. **Maintain Backward Compatibility**: All existing functionality must work exactly the same
2. **No Breaking Changes**: External APIs (if any) remain unchanged
3. **Progressive Enhancement**: Can be done incrementally
4. **Testing**: Thoroughly test after each module extraction
5. **Documentation**: Update README.md with new structure

---

## 📅 Estimated Timeline

- **Phase 1** (File Creation): 2-3 hours
- **Phase 2** (HTML Updates): 30 minutes
- **Phase 3** (Testing): 1-2 hours
- **Phase 4** (Cleanup & Docs): 1 hour

**Total**: ~5-7 hours of focused work

---

## 🎯 Success Criteria

✅ All files < 500 lines
✅ AI agents can read any file in one pass
✅ All functionality works identically
✅ No console errors
✅ Mobile/tablet responsive works
✅ Storage system works
✅ Modals work correctly
✅ Filters work correctly
✅ Planner works correctly
✅ Hidden factor checks work correctly
✅ README.md updated with new structure

---

*Generated: 2025-10-04*
*For: Uma Musume Hidden Factors Tracker Refactoring*
