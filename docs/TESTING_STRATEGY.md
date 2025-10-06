# 🧪 ES6 Module Testing Strategy

**Date**: 2025-10-04
**Purpose**: Guide for testing extracted ES6 modules individually and in integration

---

## 🎯 Testing Approach Overview

Our hybrid architecture allows for **three testing levels**:

1. **Unit Testing** - Test individual module functions in isolation
2. **Integration Testing** - Test modules working together
3. **System Testing** - Test the full application with modules integrated

---

## 📋 Testing Levels

### Level 1: Browser Console Testing (Quick & Simple)

**Purpose**: Verify module syntax and basic functionality
**When**: After creating/extracting a new module
**Time**: 1-2 minutes per module

#### How to Test:

1. **Open Browser Dev Tools** (F12)
2. **Navigate to Console tab**
3. **Import and test the module**

```javascript
// Example: Testing race-helpers.js
const module = await import('./js/data/race-helpers.js');

// Test a function
const races = module.getRacesForEasternG1();
console.log('Eastern G1 races:', races);

// Verify it returns a Set
console.log('Is Set:', races instanceof Set);
console.log('Count:', races.size);
```

#### Test Each Module Type:

**Data Modules:**
```javascript
// Test race-helpers.js
const helpers = await import('./js/data/race-helpers.js');
console.log('Eastern G1:', helpers.getRacesForEasternG1());
console.log('Western G1:', helpers.getRacesForWesternG1());

// Test race-data.js
const data = await import('./js/data/race-data.js');
data.initializeRaceData();
console.log('Initialized successfully');
```

**Feature Modules:**
```javascript
// Test tracking.js
const tracking = await import('./js/features/tracking.js');
tracking.setTrackedFactor('factor_id');
console.log('Tracked races:', tracking.getTrackedFactorRaceIds());

// Test filters.js
const filters = await import('./js/features/filters.js');
// Note: This requires DOM elements, so test with button clicks
```

**Core Modules:**
```javascript
// Test utils.js
const utils = await import('./js/core/utils.js');
console.log('Is mobile:', utils.isMobileOrTablet());
utils.showToast('Test message', 'success');

// Test state.js
const { state } = await import('./js/core/state.js');
console.log('State object:', state);
console.log('Races:', state.races.length);
```

---

### Level 2: Test HTML Page (Comprehensive)

**Purpose**: Test modules in isolation with controlled inputs
**When**: Before integrating into main app
**Time**: 5-10 minutes per module

#### Create Test Page: `test-modules.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Module Testing - Uma Musume Tracker</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            max-width: 1200px;
            margin: 20px auto;
            padding: 20px;
            background: #f5f5f5;
        }
        .test-section {
            background: white;
            padding: 20px;
            margin: 20px 0;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .test-section h2 {
            color: #667eea;
            margin-bottom: 15px;
        }
        button {
            background: #667eea;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            margin: 5px;
        }
        button:hover {
            background: #5568d3;
        }
        .result {
            background: #f8f9fa;
            padding: 10px;
            margin: 10px 0;
            border-left: 4px solid #667eea;
            font-family: monospace;
        }
        .success { border-left-color: #28a745; }
        .error { border-left-color: #dc3545; }
    </style>
</head>
<body>
    <h1>🧪 Uma Musume Module Testing</h1>
    
    <!-- Test Section Template -->
    <div class="test-section">
        <h2>Core Modules</h2>
        <button onclick="testUtils()">Test Utils</button>
        <button onclick="testState()">Test State</button>
        <div id="core-results"></div>
    </div>

    <div class="test-section">
        <h2>Data Modules</h2>
        <button onclick="testRaceData()">Test Race Data</button>
        <button onclick="testRaceHelpers()">Test Race Helpers</button>
        <div id="data-results"></div>
    </div>

    <div class="test-section">
        <h2>Feature Modules</h2>
        <button onclick="testTracking()">Test Tracking</button>
        <button onclick="testFilters()">Test Filters</button>
        <button onclick="testScrollLock()">Test Scroll Lock</button>
        <div id="feature-results"></div>
    </div>

    <div class="test-section">
        <h2>Check Modules (Future)</h2>
        <button onclick="testCheckAwakening()">Test Awakening Checks</button>
        <button onclick="testCheckSpecial()">Test Special Checks</button>
        <button onclick="testCheckRaceBased()">Test Race-Based Checks</button>
        <div id="check-results"></div>
    </div>

    <!-- Load races.js first -->
    <script src="races.js"></script>

    <script type="module">
        // Import modules
        import * as utils from './js/core/utils.js';
        import { state, createEmptyPlannerData } from './js/core/state.js';
        import { initializeRaceData, isGradeOne } from './js/data/race-data.js';
        import * as raceHelpers from './js/data/race-helpers.js';
        import * as tracking from './js/features/tracking.js';
        import { lockBodyScroll, unlockBodyScroll } from './js/features/scroll-lock.js';

        // Make modules available globally for testing
        window.modules = {
            utils,
            state,
            raceHelpers,
            tracking,
            scrollLock: { lockBodyScroll, unlockBodyScroll },
            initializeRaceData,
            isGradeOne,
            createEmptyPlannerData
        };

        // Helper function to display results
        window.displayResult = function(targetId, message, success = true) {
            const target = document.getElementById(targetId);
            const div = document.createElement('div');
            div.className = `result ${success ? 'success' : 'error'}`;
            div.innerHTML = message;
            target.appendChild(div);
        };

        // Test Functions
        window.testUtils = function() {
            const results = document.getElementById('core-results');
            results.innerHTML = '';
            
            try {
                // Test isMobileOrTablet
                const isMobile = window.modules.utils.isMobileOrTablet();
                displayResult('core-results', `✓ isMobileOrTablet: ${isMobile}`, true);
                
                // Test showToast
                window.modules.utils.showToast('Test Toast Message', 'success');
                displayResult('core-results', `✓ showToast executed`, true);
                
            } catch (error) {
                displayResult('core-results', `✗ Error: ${error.message}`, false);
            }
        };

        window.testState = function() {
            const results = document.getElementById('core-results');
            
            try {
                // Test state object
                displayResult('core-results', `✓ State has ${window.modules.state.races.length} races`, true);
                displayResult('core-results', `✓ Current filters: ${window.modules.state.currentFilters.size}`, true);
                
                // Test createEmptyPlannerData
                const plannerData = window.modules.createEmptyPlannerData();
                displayResult('core-results', `✓ Empty planner data created: ${Object.keys(plannerData).length} years`, true);
                
            } catch (error) {
                displayResult('core-results', `✗ Error: ${error.message}`, false);
            }
        };

        window.testRaceData = function() {
            const results = document.getElementById('data-results');
            results.innerHTML = '';
            
            try {
                // Initialize race data
                window.modules.initializeRaceData();
                displayResult('data-results', `✓ Race data initialized`, true);
                
                // Test state after initialization
                displayResult('data-results', `✓ Loaded ${window.modules.state.races.length} races`, true);
                displayResult('data-results', `✓ Distance categories: ${Object.keys(window.modules.state.distanceCategories).length}`, true);
                displayResult('data-results', `✓ Eastern tracks: ${window.modules.state.easternTracks.length}`, true);
                displayResult('data-results', `✓ Western tracks: ${window.modules.state.westernTracks.length}`, true);
                
                // Test isGradeOne
                if (window.modules.state.races.length > 0) {
                    const firstRace = window.modules.state.races[0];
                    const isG1 = window.modules.isGradeOne(firstRace);
                    displayResult('data-results', `✓ isGradeOne(${firstRace.name}): ${isG1}`, true);
                }
                
            } catch (error) {
                displayResult('data-results', `✗ Error: ${error.message}`, false);
            }
        };

        window.testRaceHelpers = function() {
            const results = document.getElementById('data-results');
            
            try {
                // Test Eastern G1
                const easternG1 = window.modules.raceHelpers.getRacesForEasternG1();
                displayResult('data-results', `✓ Eastern G1 races: ${easternG1.size}`, true);
                
                // Test Western G1
                const westernG1 = window.modules.raceHelpers.getRacesForWesternG1();
                displayResult('data-results', `✓ Western G1 races: ${westernG1.size}`, true);
                
                // Test Newspaper Cups
                const newspapers = window.modules.raceHelpers.getRacesForNewspaperCups();
                displayResult('data-results', `✓ Newspaper cup races: ${newspapers.size}`, true);
                
                // Test Summer Series
                const summerSprint = window.modules.raceHelpers.getRacesForSummerSeries('sprint');
                displayResult('data-results', `✓ Summer Sprint races: ${summerSprint.size}`, true);
                
                // Test Directional Awakening
                const rightTracks = window.modules.raceHelpers.getRacesForDirectionalAwakening('right');
                displayResult('data-results', `✓ Right direction races: ${rightTracks.size}`, true);
                
                // Test Seasonal Awakening
                const springRaces = window.modules.raceHelpers.getRacesForSeasonalAwakening('spring');
                displayResult('data-results', `✓ Spring races: ${springRaces.size}`, true);
                
            } catch (error) {
                displayResult('data-results', `✗ Error: ${error.message}`, false);
            }
        };

        window.testTracking = function() {
            const results = document.getElementById('feature-results');
            results.innerHTML = '';
            
            try {
                // Test set/clear tracked factor
                window.modules.tracking.setTrackedFactor('test_factor');
                displayResult('feature-results', `✓ Set tracked factor`, true);
                
                window.modules.tracking.clearTrackedFactor();
                displayResult('feature-results', `✓ Cleared tracked factor`, true);
                
                // Test getTrackedFactorRaceIds
                const raceIds = window.modules.tracking.getTrackedFactorRaceIds();
                displayResult('feature-results', `✓ Tracked race IDs: ${raceIds.size}`, true);
                
                // Test isRaceTracked
                const isTracked = window.modules.tracking.isRaceTracked('test_id');
                displayResult('feature-results', `✓ isRaceTracked: ${isTracked}`, true);
                
            } catch (error) {
                displayResult('feature-results', `✗ Error: ${error.message}`, false);
            }
        };

        window.testFilters = function() {
            const results = document.getElementById('feature-results');
            
            try {
                // Note: Filter testing requires DOM elements
                displayResult('feature-results', `⚠ Filter module requires DOM elements to test fully`, true);
                displayResult('feature-results', `✓ Use the main app to test filter functionality`, true);
                
            } catch (error) {
                displayResult('feature-results', `✗ Error: ${error.message}`, false);
            }
        };

        window.testScrollLock = function() {
            const results = document.getElementById('feature-results');
            
            try {
                // Test lock
                window.modules.scrollLock.lockBodyScroll(document.body);
                displayResult('feature-results', `✓ Body scroll locked`, true);
                
                // Test unlock after 1 second
                setTimeout(() => {
                    window.modules.scrollLock.unlockBodyScroll(document.body);
                    displayResult('feature-results', `✓ Body scroll unlocked`, true);
                }, 1000);
                
            } catch (error) {
                displayResult('feature-results', `✗ Error: ${error.message}`, false);
            }
        };

        // Placeholder test functions for future modules
        window.testCheckAwakening = function() {
            displayResult('check-results', `⏳ Module not yet extracted`, true);
        };

        window.testCheckSpecial = function() {
            displayResult('check-results', `⏳ Module not yet extracted`, true);
        };

        window.testCheckRaceBased = function() {
            displayResult('check-results', `⏳ Module not yet extracted`, true);
        };

        // Auto-initialize on page load
        window.addEventListener('DOMContentLoaded', () => {
            console.log('Module testing page loaded');
            console.log('Modules available:', Object.keys(window.modules));
        });
    </script>
</body>
</html>
```

---

### Level 3: Integration Testing (Main App)

**Purpose**: Test modules work correctly in the actual application
**When**: After several modules are extracted
**Time**: 10-15 minutes per integration

#### Integration Testing Process:

1. **Create Test Branch** (Optional but recommended)
```bash
git checkout -b test-integration
```

2. **Update app.js to Import Modules**
```javascript
// Add at top of app.js
import { getRacesForEasternG1, getRacesForWesternG1 } from './js/data/race-helpers.js';
import { setTrackedFactor, clearTrackedFactor, getTrackedFactorRaceIds } from './js/features/tracking.js';
import { isMobileOrTablet, showToast } from './js/core/utils.js';

// In UmaMusumeTracker class, replace methods with delegations:
getRacesForEasternG1() {
    return getRacesForEasternG1(); // Use imported function
}
```

3. **Update index.html to Use Modules**
```html
<!-- Replace -->
<script src="app.js"></script>

<!-- With -->
<script type="module" src="app.js"></script>
```

4. **Test in Browser**
- Open http://localhost:8000/
- Check console for errors
- Test each feature that uses extracted modules
- Verify functionality matches original

5. **Test Checklist** ✅

**For Race Helpers:**
- [ ] Hidden factors show correct race counts
- [ ] Track feature highlights correct races
- [ ] Filter by series (SSS, SMS, S2000) works

**For Tracking:**
- [ ] Click track button on hidden factor
- [ ] Verify races highlighted in blue
- [ ] Verify planner slots highlighted
- [ ] Clear tracking works

**For Filters:**
- [ ] All filter buttons work
- [ ] Grade filters (OR logic) work
- [ ] Exclusive filters work
- [ ] Summer series filters work
- [ ] Clear All button works

**For Utils:**
- [ ] Toast notifications appear
- [ ] Device detection correct
- [ ] Contact Discord link works

**For Scroll Lock:**
- [ ] Open race picker modal
- [ ] Body scroll disabled
- [ ] Close modal
- [ ] Body scroll restored

---

## 🔍 Debugging Tools

### Browser Dev Tools

**Console Tab:**
- View errors and logs
- Test module imports
- Inspect returned values

**Network Tab:**
- Verify modules load correctly
- Check 404 errors for missing files
- Monitor load times

**Sources Tab:**
- Set breakpoints in modules
- Step through execution
- Inspect variables

**Application Tab:**
- Check localStorage
- Verify state persistence

---

## 📝 Testing Workflow for Each Module

### Step-by-Step Testing Process:

#### 1. **After Extraction** (Immediately)
```bash
# 1. Create the module file
New-Item -Path "js/checks/check-awakening.js" -ItemType File

# 2. Add content with exports

# 3. Save file
```

#### 2. **Console Test** (1-2 minutes)
```javascript
// Open browser console (F12)
const module = await import('./js/checks/check-awakening.js');
console.log('Module loaded:', module);

// Test each exported function
const result = module.checkDirectionalAwakening('right');
console.log('Result:', result);
```

#### 3. **Test Page Test** (5 minutes)
```bash
# Open test-modules.html in browser
# Click appropriate test button
# Verify results displayed
```

#### 4. **Integration Test** (10 minutes)
```javascript
// Update app.js to use the module
// Test in main application
// Verify full functionality
```

#### 5. **Commit** (If all tests pass)
```bash
git add js/checks/check-awakening.js
git commit -m "refactor: extract check-awakening.js module (tested)"
```

---

## ⚠️ Common Issues & Solutions

### Issue 1: Module Not Found
**Error**: `Failed to load module script: Expected a JavaScript module script`

**Solution:**
- Verify file path is correct
- Check file extension is `.js`
- Ensure `<script type="module">` is used

### Issue 2: Import Fails
**Error**: `Uncaught SyntaxError: Cannot use import statement outside a module`

**Solution:**
- Add `type="module"` to script tag
- Verify browser supports ES6 modules
- Check for syntax errors in module

### Issue 3: State Not Updated
**Error**: Module runs but state doesn't update

**Solution:**
- Verify state is imported from correct module
- Check module returns correct data type
- Ensure UI rendering functions are called

### Issue 4: Circular Dependencies
**Error**: Module imports itself indirectly

**Solution:**
- Review dependency chain
- Extract shared code to separate module
- Use dependency injection

---

## 🎯 Testing Best Practices

1. **Test Early** - Test immediately after extraction
2. **Test Often** - Test after each change
3. **Test Incrementally** - Don't extract multiple modules without testing
4. **Use Console First** - Quick verification before detailed tests
5. **Keep Test Page** - Reuse for all modules
6. **Document Issues** - Note any bugs found during testing
7. **Test on Multiple Browsers** - Verify cross-browser compatibility
8. **Test Responsive** - Check mobile and desktop
9. **Performance Test** - Check module load times
10. **Regression Test** - Verify old features still work

---

## 📊 Testing Checklist

Create this checklist for each module:

```markdown
## Module: [Name] Testing Checklist

### Pre-Test
- [ ] File created in correct location
- [ ] Exports added to all functions/classes
- [ ] Imports added for dependencies
- [ ] No syntax errors

### Console Test
- [ ] Module loads without errors
- [ ] Functions can be called
- [ ] Returns expected data types
- [ ] No console errors

### Integration Test
- [ ] Imported in app.js
- [ ] Methods delegated correctly
- [ ] UI updates correctly
- [ ] No regressions

### Feature Test
- [ ] Feature works as before
- [ ] Edge cases handled
- [ ] Mobile responsive
- [ ] Cross-browser compatible

### Performance
- [ ] Module loads quickly
- [ ] No memory leaks
- [ ] Smooth transitions
- [ ] No lag or freezing
```

---

## 🚀 Next Steps

After creating this testing strategy:

1. **Create `test-modules.html`** in project root
2. **Open in browser** alongside main app
3. **Test each extracted module** using console first
4. **Use test page** for comprehensive tests
5. **Document results** in module comments
6. **Update testing checklist** as you go

---

*Created: 2025-10-04*
*Last Updated: 2025-10-04*
*Status: Ready for use*
