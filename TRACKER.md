# Hidden Factor Race Tracking Feature — Implementation Complete ✅

## Feature Overview

Interactive tracking functionality that allows users to visualize which races can fulfill a specific hidden factor. When a hidden factor is being tracked, the Race Database calendar, Race Planner, and Picker Modal all highlight qualifying races and dates.

**Status:** ✅ Fully Implemented (2025-09-29)

**Commits:**
- Initial implementation with core tracking, highlighting, and filtering
- Added picker modal highlighting and tracked races filter button

## Feature Specification

### Implemented Features ✅

1. **Track Button on Hidden Factors** ✅
   - Each trackable factor has a 🔍 magnifying glass button
   - Clicking toggles tracking for that factor
   - Only ONE factor tracked at a time (auto un-tracks previous)
   - Active button shows blue background with visual feedback
   - Non-trackable factors (general/count-based) have no button

2. **Clear All Tracking Button** ✅
   - "✖ Clear / 追跡解除" button in progress panel header
   - Appears only when a factor is being tracked
   - Clears tracking and removes all highlights
   - Automatically hides when not tracking

3. **Race Highlighting in Database** ✅
   - Blue outline (3px solid #1890ff) on tracked races
   - 📍 Pin emoji indicator in top-left corner
   - Shadow effect for depth (rgba(24, 144, 255, 0.4))
   - Works with existing selected/won/lost states

4. **Planner Slot Highlighting** ✅
   - Blue gradient background for slots with tracked races
   - Highlights even if slot is empty but has qualifying races
   - 📍 Pin emoji in slot header
   - Thicker blue border (3px) for emphasis

5. **Picker Modal Highlighting** ✅
   - Tracked races show light blue background in picker
   - 📍 Pin emoji prefix before race name
   - Clear visual distinction from selected races

6. **Tracked Races Filter Button** ✅
   - "🔍 Tracked / 追跡中" button in race database filters
   - Appears dynamically when tracking is active
   - Filters to show ONLY tracked races
   - Hides automatically when tracking is cleared

### User Workflow

```
User clicks "Track" on "Newspaper Boy/Girl" factor
  ↓
Progress panel shows this factor as "Currently Tracking"
  ↓
Race Database highlights: Kyoto Shimbun Hai, Kobe Shimbun Hai, Chunichi Shimbun Hai, Tokyo Shimbun Hai
  ↓
Race Planner highlights the corresponding month/half slots for these races
  ↓
User can easily see which races to plan
  ↓
User clicks "Clear Tracking" or tracks a different factor
  ↓
All highlights are removed
```

## Technical Implementation Plan

### 1. Data Model Changes

#### New State Properties (in `UmaMusumeTracker`)

```javascript
// Add to constructor
this.trackedFactorId = null; // ID of currently tracked factor, or null
```

#### Hidden Factor Metadata

Each hidden factor needs a new property:
```javascript
{
    id: 'newspaper_boy',
    nameJP: '新聞屋さん',
    nameEN: 'Newspaper Boy/Girl',
    conditionJP: '...',
    conditionEN: '...',
    trackable: true,  // NEW: whether this factor should have a track button
    check: () => this.checkNewspaperCups(),
    getRaces: () => this.getRacesForNewspaperCups() // NEW: returns Set of race IDs
}
```

### 2. Hidden Factor Trackability Classification

#### Trackable Factors (specific races required)
- ✅ **Champion of the East** — specific GI races at eastern tracks
- ✅ **Champion of the West** — specific GI races at western tracks
- ✅ **Newspaper Boy/Girl** — specific 4 Shimbun Hai races
- ✅ **Summer Sprint/Mile/2000 Series** — specific series races
- ✅ **The Year's Plan** — Nakayama/Kyoto Kinen only
- ✅ **Wish Upon a Star** — specific star-themed races
- ✅ **Jewelry** — specific jewelry-themed races
- ✅ **Two-Sword Style** — needs at least one turf AND one dirt race
- ✅ **Perfect Crown** — specific triple crown + trials
- ✅ **Perfect Tiara** — specific triple tiara + trials
- ✅ **Right/Left Awakening** — races on specific direction
- ✅ **Spring/Summer/Autumn/Winter Awakening** — races in specific season

#### Non-Trackable Factors (general/count-based)
- ❌ **Consecutive Runs** — applies to any 2 consecutive races
- ❌ **Improves with Racing** — applies to any 3 consecutive races
- ❌ **Never-Give-Up Spirit** — requires any loss + any win (general pattern)
- ❌ **All Ranks Conquered** — need races in each distance category
- ❌ **Traveler** — need races at different racecourses (shows all unique tracks)
- ❌ **All Ranks Conquered** — need races in each distance category

### 3. New Methods to Implement

#### Core Tracking Logic

```javascript
/**
 * Set the currently tracked hidden factor
 * @param {string|null} factorId - The ID of the factor to track, or null to clear
 */
setTrackedFactor(factorId) {
    this.trackedFactorId = factorId;
    this.renderHiddenFactors(this.getFactorResults());
    this.renderRaces();
    this.renderPlannerGrid();
}

/**
 * Clear the currently tracked factor
 */
clearTrackedFactor() {
    this.setTrackedFactor(null);
}

/**
 * Get the set of race IDs that satisfy the currently tracked factor
 * @returns {Set<string>} Set of race IDs, or empty Set if no factor tracked
 */
getTrackedFactorRaceIds() {
    if (!this.trackedFactorId) return new Set();
    const factor = this.hiddenFactors.find(f => f.id === this.trackedFactorId);
    if (!factor || !factor.getRaces) return new Set();
    return factor.getRaces();
}

/**
 * Check if a race satisfies the currently tracked factor
 * @param {string} raceId - The race ID to check
 * @returns {boolean}
 */
isRaceTracked(raceId) {
    const trackedIds = this.getTrackedFactorRaceIds();
    return trackedIds.has(String(raceId));
}

/**
 * Check if a planner slot (month/half) has any races that satisfy the tracked factor
 * @param {string} month - Month name
 * @param {string} half - Half ('1st' or '2nd')
 * @param {string} yearKey - 'junior', 'classics', or 'senior'
 * @returns {boolean}
 */
isSlotTracked(month, half, yearKey) {
    if (!this.trackedFactorId) return false;
    const trackedIds = this.getTrackedFactorRaceIds();
    if (trackedIds.size === 0) return false;
    
    // Check if any tracked race matches this slot
    for (const id of trackedIds) {
        const race = this.raceById.get(String(id));
        if (race && race.month === month && race.half === half && race[yearKey]) {
            return true;
        }
    }
    return false;
}
```

#### Race Retrieval Methods (for each trackable factor)

Each trackable factor needs a corresponding `getRaces` method:

```javascript
// Example implementations:

getRacesForNewspaperCups() {
    const names = ['Kyoto Shimbun Hai', 'Kobe Shimbun Hai', 'Chunichi Shimbun Hai', 'Tokyo Shimbun Hai'];
    return this.getIdsForNames(names);
}

getRacesForEasternG1() {
    const result = new Set();
    this.races.forEach(race => {
        if (this.isGradeOne(race) && this.easternTracks.includes(race.racetrack)) {
            result.add(String(race.id));
        }
    });
    return result;
}

getRacesForWesternG1() {
    const result = new Set();
    this.races.forEach(race => {
        if (this.isGradeOne(race) && this.westernTracks.includes(race.racetrack)) {
            result.add(String(race.id));
        }
    });
    return result;
}

getRacesForAllDistances() {
    const result = new Set();
    this.races.forEach(race => {
        // Any race counts for this factor
        result.add(String(race.id));
    });
    return result;
}

getRacesForDualSurface() {
    const result = new Set();
    this.races.forEach(race => {
        if (race.surface === 'turf' || race.surface === 'dirt') {
            result.add(String(race.id));
        }
    });
    return result;
}

getRacesForDirectionalAwakening(direction) {
    const result = new Set();
    this.races.forEach(race => {
        if (race.direction === direction) {
            result.add(String(race.id));
        }
    });
    return result;
}

getRacesForSeasonalAwakening(season) {
    const result = new Set();
    this.races.forEach(race => {
        if (race.season === season) {
            result.add(String(race.id));
        }
    });
    return result;
}

// Similar methods for other trackable factors...
```

### 4. UI Changes

#### Progress Panel Header

Add a "Clear Tracking" button in the progress section header:

```html
<div class="progress-section" id="progress-panel">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <h2 class="section-title" style="margin-bottom: 0;">Progress Tracker<br><span style="font-size: 0.8em; font-weight: normal; color: #718096;">進捗トラッカー</span></h2>
        <button class="btn btn-clear-tracking" id="clear-tracking-btn" onclick="tracker.clearTrackedFactor()" style="display: none;">
            Clear Tracking<br><span style="font-size: 0.7em;">追跡解除</span>
        </button>
    </div>
    <!-- existing stats and factors -->
</div>
```

#### Hidden Factor Item

Modify `renderHiddenFactors` to add track buttons:

```javascript
renderHiddenFactors(results) {
    const container = document.getElementById('hidden-factors');
    
    container.innerHTML = results.map(factor => {
        const statusClass = factor.result.completed ? 'completed' : 
                           factor.result.progress > 0 ? 'partial' : '';
        const progressPercentage = Math.min(100, (factor.result.current / factor.result.required) * 100);
        const isTracked = this.trackedFactorId === factor.id;
        const showTrackButton = factor.trackable !== false; // Default to true if not specified
        
        return `
            <div class="factor-item ${statusClass} ${isTracked ? 'factor-tracked' : ''}">
                <div class="factor-header">
                    <div class="factor-name">
                        <div class="factor-name-en">${factor.nameEN}</div>
                        <div class="factor-name-jp">${factor.nameJP}</div>
                        ${factor.result.completed ? '<div class="completion-badge">✅</div>' : ''}
                    </div>
                    ${showTrackButton ? `
                        <button class="btn btn-track ${isTracked ? 'active' : ''}" 
                                onclick="tracker.setTrackedFactor('${factor.id}')">
                            ${isTracked ? '👁️ Tracking' : '🔍 Track'}
                        </button>
                    ` : ''}
                </div>
                <div class="factor-condition">
                    <div class="condition-en">${factor.conditionEN || factor.condition}</div>
                    ${factor.conditionJP ? `<div class="condition-jp">${factor.conditionJP}</div>` : ''}
                </div>
                <div class="factor-progress">
                    <div>Progress / 進捗: ${factor.result.current}/${factor.result.required}</div>
                    ${factor.result.details ? `<div style="margin-top: 2px; font-size: 0.75rem;">• ${factor.result.details}</div>` : ''}
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progressPercentage}%"></div>
                </div>
            </div>
        `;
    }).join('');
    
    // Show/hide clear tracking button
    const clearBtn = document.getElementById('clear-tracking-btn');
    if (clearBtn) {
        clearBtn.style.display = this.trackedFactorId ? 'block' : 'none';
    }
}
```

#### Race Card Highlighting

Modify `renderRaces` to add tracked class:

```javascript
grid.innerHTML = filteredRaces.map(race => {
    const isTracked = this.isRaceTracked(race.id);
    return `
        <div class="race-card ${this.selectedRaces.has(String(race.id)) ? 'selected' : ''} 
                              ${this.wonRaces.has(String(race.id)) ? 'won' : ''}
                              ${isTracked ? 'race-tracked' : ''}" 
             data-race-id="${race.id}" 
             onclick="tracker.toggleParticipationById('${race.id}')">
        <!-- existing card content -->
        </div>
    `;
}).join('');
```

#### Planner Slot Highlighting

Modify `renderPlannerGrid` to add tracked class to slots:

```javascript
const slots = [];
this.monthOrder.forEach(month => {
    this.halfOrder.forEach(half => {
        const key = this.cellKey(month, half);
        const isSlotTracked = this.isSlotTracked(month, half, this.plannerYear);
        // ... existing slot rendering logic ...
        slots.push(`
            <div class="planner-slot ${!selectedId && !hasAnyForSlot ? 'disabled' : ''} 
                                      ${isSummer ? 'summer' : ''}
                                      ${isSlotTracked ? 'slot-tracked' : ''}">
            <!-- existing slot content -->
            </div>
        `);
    });
});
```

### 5. CSS Styling

Add new styles to `styles.css`:

```css
/* Hidden Factor Tracking Styles */
.factor-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 10px;
    margin-bottom: 8px;
}

.factor-item.factor-tracked {
    background: #e6f7ff;
    border-left-color: #1890ff;
    box-shadow: 0 2px 8px rgba(24, 144, 255, 0.2);
}

.btn-track {
    font-size: 0.8rem;
    padding: 4px 10px;
    white-space: nowrap;
    flex-shrink: 0;
    background: #f0f0f0;
    border: 1px solid #d9d9d9;
    color: #595959;
}

.btn-track:hover {
    background: #1890ff;
    border-color: #1890ff;
    color: white;
}

.btn-track.active {
    background: #1890ff;
    border-color: #1890ff;
    color: white;
    font-weight: 700;
}

.btn-clear-tracking {
    font-size: 0.85rem;
    padding: 6px 12px;
    background: #ff4d4f;
    color: white;
    border: 1px solid #ff4d4f;
}

.btn-clear-tracking:hover {
    background: #cf1322;
    border-color: #cf1322;
}

/* Race Card Tracking Highlight */
.race-card.race-tracked {
    outline: 3px solid #1890ff;
    outline-offset: -3px;
    box-shadow: 0 0 12px rgba(24, 144, 255, 0.4);
}

.race-card.race-tracked::after {
    content: "📍";
    position: absolute;
    top: 8px;
    left: 8px;
    font-size: 1.1rem;
    filter: drop-shadow(0 1px 2px rgba(0,0,0,0.3));
}

/* Planner Slot Tracking Highlight */
.planner-slot.slot-tracked {
    background: linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%);
    border-color: #1890ff;
    border-width: 3px;
    box-shadow: 0 0 12px rgba(24, 144, 255, 0.3);
}

.planner-slot.slot-tracked .planner-slot-head {
    background: #91d5ff;
    color: #002766;
    border-bottom-color: #1890ff;
}

.planner-slot.slot-tracked .planner-slot-head::after {
    content: " 📍";
    font-size: 0.9rem;
}
```

### 6. Update `loadHiddenFactors()` Method

Add `trackable` and `getRaces` properties to each factor:

```javascript
loadHiddenFactors() {
    this.hiddenFactors = [
        {
            id: 'consecutive_run',
            nameJP: '連戦連勝',
            nameEN: 'Consecutive Runs',
            conditionJP: '2戦連続で出走する。',
            conditionEN: 'Race 2 races in a row.',
            trackable: false, // General factor
            check: () => this.checkConsecutiveRuns()
        },
        {
            id: 'champion_east',
            nameJP: '東の雄',
            nameEN: 'Champion of the East',
            conditionJP: '東日本（東京、中山など）のG1レースで7勝以上する。',
            conditionEN: 'Win 7 or more G1 races held at tracks in eastern Japan.',
            trackable: true,
            check: () => this.checkEasternG1Wins(),
            getRaces: () => this.getRacesForEasternG1()
        },
        // ... update all other factors with trackable and getRaces properties
    ];
}
```

## Implementation Steps

### Phase 1: Core Infrastructure (2-3 hours)
1. Add `trackedFactorId` state property
2. Implement `setTrackedFactor()`, `clearTrackedFactor()`, `getTrackedFactorRaceIds()`, `isRaceTracked()`, `isSlotTracked()` methods
3. Add helper method `getFactorResults()` to cache factor evaluation results

### Phase 2: Factor Metadata Updates (2-3 hours)
4. Add `trackable` property to all hidden factors
5. Implement `getRaces()` method for each trackable factor
6. Test that all `getRaces()` methods return correct race IDs

### Phase 3: UI Integration (3-4 hours)
7. Update `renderHiddenFactors()` to show track buttons
8. Add "Clear Tracking" button to progress panel header
9. Update `renderRaces()` to highlight tracked races
10. Update `renderPlannerGrid()` to highlight tracked slots

### Phase 4: Styling (1-2 hours)
11. Add CSS styles for tracked states
12. Ensure visual consistency across light/dark themes
13. Test accessibility and color contrast

### Phase 5: Testing & Polish (2-3 hours)
14. Test tracking each factor type
15. Test edge cases (empty results, all races, overlapping factors)
16. Test interaction with existing selection/won/lost states
17. Verify planner highlighting across all three years
18. Performance testing with full dataset

## Implementation Time: ~3 hours (vs 10-15 estimated)

## Testing Results ✅

### Functional Tests
- ✅ Only one factor can be tracked at a time
- ✅ Tracking a new factor clears the previous one
- ✅ "Clear Tracking" button works correctly
- ✅ Race cards are highlighted correctly
- ✅ Planner slots are highlighted correctly
- ✅ Empty slots (no race planned) still show tracking highlight
- ✅ Non-trackable factors don't show track button
- ✅ Tracking persists across filter changes in race database
- ✅ Tracking updates when switching planner year tabs
- ✅ Picker modal shows tracked races with highlighting
- ✅ Tracked filter button appears/disappears dynamically

### Visual Tests
- ✅ Track button visual states are clear (tracked vs not tracked)
- ✅ Race tracking highlight doesn't conflict with selected/won states
- ✅ Planner slot tracking highlight is visible across all themes
- ✅ Emoji indicators are visible and positioned correctly
- ✅ Progress panel shows which factor is currently tracked
- ✅ Picker modal tracked items stand out clearly
- ✅ Filter button integrates seamlessly with existing filters

### Edge Cases
- ✅ Tracking a factor with zero qualifying races
- ✅ Tracking a factor with all races (directional/seasonal)
- ✅ Tracking while planner is empty
- ✅ Tracking after clearing all selections
- ✅ Switching year tabs while tracking
- ✅ Opening picker while tracking shows correct highlights

## Usage Guide

### How to Use Tracking

1. **Start Tracking:**
   - Scroll to any trackable hidden factor in the Progress Tracker
   - Click the 🔍 button next to the factor name
   - Factor card turns blue, "✖ Clear" button appears in header
   - "🔍 Tracked" filter button appears in Race Database

2. **View Tracked Races:**
   - **Race Database:** Scroll through calendar to see blue-outlined races with 📍 emoji
   - **Race Planner:** Blue gradient on slots containing qualifying races
   - **Picker Modal:** Click any slot to see tracked races highlighted in blue
   - **Filter Button:** Click "🔍 Tracked" to show ONLY tracked races

3. **Switch Tracking:**
   - Click 🔍 on a different factor to track that one instead
   - Previous tracking automatically clears

4. **Stop Tracking:**
   - Click the "✖ Clear" button in Progress Tracker header
   - OR click 🔍 again on the currently tracked factor
   - All highlights disappear, filter button hides

### Tips
- Use tracking with the "🔍 Tracked" filter to focus on specific factor requirements
- Combine with planner to see which months have qualifying races
- Track seasonal awakenings to see all races in a specific season
- Track Perfect Crown/Tiara to see all required main races and trials

## Future Enhancements (Backlog)

### Multi-Factor Tracking (v2.0)
- Allow tracking multiple factors simultaneously
- Use different colors/icons for each tracked factor (e.g., 🔴 🟢 🔵)
- Combined filter to show races satisfying ANY or ALL tracked factors

### Smart Suggestions (v2.0)
- Analyze current selections and suggest next hidden factor to pursue
- Show "closest to completion" factors prominently
- Auto-track factor when user makes significant progress toward it
- "Recommended Next Race" feature based on incomplete factors

### Factor Details Modal (v2.0)
- Clicking a factor name opens a detailed modal
- Shows all qualifying races in a grid view
- Allows planning directly from the modal
- Visual progress breakdown by category (e.g., Crown trials by group)
- Export factor checklist

### Enhanced Filtering (v2.0)
- Combine tracked filter with other filters (e.g., "Tracked + G1 only")
- Save custom filter combinations
- Quick filters: "Almost Complete Factors", "Seasonal", "Series"

## Dependencies

- No external libraries required
- Uses existing `raceById` and `raceIdsByName` maps
- Relies on existing factor check methods
- Compatible with current planner and selection system

## Compatibility Notes

- Does not interfere with existing selection/won/lost functionality
- Works alongside current filter system
- Compatible with planner navigation and picker modal
- No breaking changes to existing code

## Technical Implementation Summary

### Files Modified
1. **app.js** (~200 lines added)
   - Core tracking state and methods (5 methods)
   - 16 `getRaces()` methods for trackable factors
   - Updated `loadHiddenFactors()` with `trackable` property
   - Modified `renderHiddenFactors()`, `renderRaces()`, `renderPlannerGrid()`, `renderPickerList()`
   - Added `tracked` case to `getFilteredRaces()`

2. **styles.css** (~80 lines added)
   - `.factor-header` - Flex layout for track buttons
   - `.factor-tracked` - Blue theme for tracked factors
   - `.btn-track` - Magnifying glass button styles
   - `.btn-clear-tracking` - Red clear button
   - `.race-tracked` - Blue outline for race cards
   - `.slot-tracked` - Blue gradient for planner slots
   - `.picker-item-tracked` - Blue background for picker items

3. **index.html** (5 lines modified)
   - Added Clear Tracking button to progress panel header
   - Added Tracked filter button to race database controls

### Key Design Decisions
- **Blue theme (#1890ff)** - Distinguishable from green (selected/won) and red (lost/clear)
- **Toggle behavior** - Clicking same button turns tracking off for quick UX
- **Dynamic UI elements** - Buttons appear/disappear based on tracking state
- **Non-intrusive** - Tracking works alongside existing features without conflicts
- **Performance** - O(n) filtering with Set lookups for instant response

### Documentation Status
- ✅ `TRACKER.md` — Updated with implementation details and usage guide
- ⏳ `PLANNING.md` — Needs update with tracking feature description
- ⏳ `README.md` — Needs user guide section for tracking
- ✅ Inline comments in `app.js` for all new methods

---

**Implementation Complete: 2025-09-29**
**Feature Status: Production Ready ✅**
