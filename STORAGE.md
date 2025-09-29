# Save/Load/Share System — Implementation Plan

## Feature Overview

Add persistent storage functionality that allows users to save their race planning progress locally using browser storage (localStorage/cookies) and share their plans via URL. The system provides multiple save slots for managing different planning scenarios and enables easy sharing with other users.

**Status:** 📋 Planning Phase

## Feature Specification

### Core Requirements

1. **Save System**
   - Save current state to browser localStorage
   - At least 3 save slots (expandable)
   - Auto-save on critical actions (optional)
   - Save includes: selected races, won/lost status, planner data, tracking state
   - Timestamped saves with metadata (date, race count, completion %)

2. **Load System**
   - Load from any saved slot
   - Visual preview of save slot contents
   - Confirmation prompt before overwriting current state
   - Clear individual save slots

3. **Share System**
   - Generate shareable URL with encoded state
   - URL parameters contain compressed state data
   - Parse URL on page load and restore state automatically
   - Copy-to-clipboard functionality
   - Optional: Generate QR code for mobile sharing

4. **UI Design**
   - Compact icon-based toolbar at top of Progress Tracker
   - Icons: 💾 Save, 📂 Load, 🔗 Share
   - Save slots dialog with preview cards
   - Non-intrusive, collapsible design

5. **Data Persistence**
   - localStorage for long-term browser storage
   - sessionStorage for temporary states (optional)
   - URL parameters for sharing (base64 encoded JSON)
   - Graceful degradation if storage unavailable

### User Workflows

#### Save Workflow
```
User clicks 💾 Save button
  ↓
Modal shows 3 save slots with previews
  ↓
User clicks empty slot or overwrites existing
  ↓
Current state saved with timestamp
  ↓
Confirmation toast appears
  ↓
Modal closes
```

#### Load Workflow
```
User clicks 📂 Load button
  ↓
Modal shows saved slots with metadata
  ↓
User clicks a slot to preview details
  ↓
"Load this save?" confirmation appears
  ↓
User confirms, state is restored
  ↓
Page updates with loaded data
  ↓
Success notification appears
```

#### Share Workflow
```
User clicks 🔗 Share button
  ↓
System generates shareable URL
  ↓
Modal shows URL with "Copy" button
  ↓
User clicks Copy (URL copied to clipboard)
  ↓
Success notification appears
  ↓
User shares URL via any platform
  ↓
Recipient opens URL
  ↓
Page auto-loads shared state
  ↓
Welcome message shows share details
```

## Technical Implementation Plan

### 1. Data Model

#### State Object Structure
```javascript
{
  version: "1.0",          // Schema version for future compatibility
  timestamp: 1727644800000, // Unix timestamp
  metadata: {
    racesRun: 45,
    wins: 38,
    losses: 7,
    factorsCompleted: 12,
    lastModified: "2025-09-29T12:00:00Z"
  },
  selections: {
    selectedRaces: ["race_id_1", "race_id_2", ...],
    wonRaces: ["race_id_1", "race_id_3", ...],
    lostRaces: ["race_id_2", ...]
  },
  planner: {
    junior: { "January|1st": "race_id_5", ... },
    classics: { ... },
    senior: { ... }
  },
  tracking: {
    trackedFactorId: "newspaper_boy" // or null
  }
}
```

#### Compression Strategy
- Use JSON.stringify for serialization
- Apply LZString compression for URL encoding
- Base64 encode for URL safety
- Estimated compressed size: ~500-1000 chars for typical state

### 2. Storage Implementation

#### localStorage Management
```javascript
// Save to slot
saveToSlot(slotId, state) {
  const key = `uma_save_slot_${slotId}`;
  const saveData = {
    ...state,
    timestamp: Date.now(),
    slotId: slotId
  };
  localStorage.setItem(key, JSON.stringify(saveData));
}

// Load from slot
loadFromSlot(slotId) {
  const key = `uma_save_slot_${slotId}`;
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
}

// List all saves
getAllSaves() {
  const saves = [];
  for (let i = 1; i <= 3; i++) {
    const save = loadFromSlot(i);
    if (save) saves.push({ slotId: i, ...save });
  }
  return saves;
}

// Delete slot
deleteSlot(slotId) {
  const key = `uma_save_slot_${slotId}`;
  localStorage.removeItem(key);
}
```

#### URL Parameter Handling
```javascript
// Encode state to URL
encodeStateToURL() {
  const state = this.captureCurrentState();
  const json = JSON.stringify(state);
  const compressed = LZString.compressToEncodedURIComponent(json);
  const baseUrl = window.location.origin + window.location.pathname;
  return `${baseUrl}?state=${compressed}`;
}

// Decode URL on page load
decodeURLState() {
  const params = new URLSearchParams(window.location.search);
  const compressed = params.get('state');
  if (!compressed) return null;
  
  try {
    const json = LZString.decompressFromEncodedURIComponent(compressed);
    return JSON.parse(json);
  } catch (e) {
    console.error('Failed to decode shared state:', e);
    return null;
  }
}

// Initialize from URL on page load
initializeFromURL() {
  const sharedState = this.decodeURLState();
  if (sharedState) {
    this.restoreState(sharedState);
    this.showSharedStateNotification(sharedState);
    // Clean URL after loading
    window.history.replaceState({}, document.title, window.location.pathname);
  }
}
```

### 3. State Capture and Restoration

```javascript
// Capture current state
captureCurrentState() {
  return {
    version: "1.0",
    timestamp: Date.now(),
    metadata: {
      racesRun: this.selectedRaces.size,
      wins: this.wonRaces.size,
      losses: this.lostRaces.size,
      factorsCompleted: this.getCompletedFactorCount(),
      lastModified: new Date().toISOString()
    },
    selections: {
      selectedRaces: Array.from(this.selectedRaces),
      wonRaces: Array.from(this.wonRaces),
      lostRaces: Array.from(this.lostRaces)
    },
    planner: this.plannerData,
    tracking: {
      trackedFactorId: this.trackedFactorId
    }
  };
}

// Restore state
restoreState(state) {
  // Validate version compatibility
  if (!this.isCompatibleVersion(state.version)) {
    throw new Error('Incompatible save version');
  }
  
  // Restore selections
  this.selectedRaces = new Set(state.selections.selectedRaces);
  this.wonRaces = new Set(state.selections.wonRaces);
  this.lostRaces = new Set(state.selections.lostRaces);
  
  // Restore planner
  this.plannerData = state.planner;
  
  // Restore tracking
  this.trackedFactorId = state.tracking.trackedFactorId || null;
  
  // Re-render everything
  this.renderRaces();
  this.renderPlannerGrid();
  this.updateProgress();
}

// Check version compatibility
isCompatibleVersion(version) {
  const [major] = version.split('.');
  const [currentMajor] = this.STORAGE_VERSION.split('.');
  return major === currentMajor;
}
```

### 4. UI Implementation

#### HTML Structure (in index.html)
```html
<div class="progress-section" id="progress-panel">
    <!-- Storage Controls Toolbar -->
    <div class="storage-toolbar">
        <button class="btn-storage" id="btn-save" onclick="tracker.openSaveDialog()" title="Save / 保存">
            💾 <span class="btn-label">Save</span>
        </button>
        <button class="btn-storage" id="btn-load" onclick="tracker.openLoadDialog()" title="Load / 読み込み">
            📂 <span class="btn-label">Load</span>
        </button>
        <button class="btn-storage" id="btn-share" onclick="tracker.openShareDialog()" title="Share / 共有">
            🔗 <span class="btn-label">Share</span>
        </button>
    </div>
    
    <!-- Existing progress tracker content -->
    <div style="display: flex; justify-content: space-between; ...">
        ...
    </div>
</div>

<!-- Save Dialog Modal -->
<div id="save-modal" class="storage-modal hidden">
    <div class="storage-backdrop" onclick="tracker.closeSaveDialog()"></div>
    <div class="storage-panel">
        <div class="storage-header">
            <h3>💾 Save Progress / 進捗を保存</h3>
            <button class="close-btn" onclick="tracker.closeSaveDialog()">×</button>
        </div>
        <div class="storage-body">
            <div class="save-slots-grid">
                <!-- Dynamically generated save slots -->
            </div>
        </div>
    </div>
</div>

<!-- Load Dialog Modal -->
<div id="load-modal" class="storage-modal hidden">
    <div class="storage-backdrop" onclick="tracker.closeLoadDialog()"></div>
    <div class="storage-panel">
        <div class="storage-header">
            <h3>📂 Load Progress / 進捗を読み込み</h3>
            <button class="close-btn" onclick="tracker.closeLoadDialog()">×</button>
        </div>
        <div class="storage-body">
            <div class="load-slots-grid">
                <!-- Dynamically generated load slots -->
            </div>
        </div>
    </div>
</div>

<!-- Share Dialog Modal -->
<div id="share-modal" class="storage-modal hidden">
    <div class="storage-backdrop" onclick="tracker.closeShareDialog()"></div>
    <div class="storage-panel">
        <div class="storage-header">
            <h3>🔗 Share Progress / 進捗を共有</h3>
            <button class="close-btn" onclick="tracker.closeShareDialog()">×</button>
        </div>
        <div class="storage-body">
            <div class="share-content">
                <p>Share this URL to let others see your race plan:</p>
                <p>このURLを共有して、他の人にレース計画を見せましょう：</p>
                <div class="share-url-container">
                    <input type="text" id="share-url-input" readonly />
                    <button class="btn-copy" onclick="tracker.copyShareURL()">📋 Copy</button>
                </div>
                <div class="share-stats">
                    <div>Races Run / 出走: <strong id="share-stat-races">0</strong></div>
                    <div>Wins / 勝利: <strong id="share-stat-wins">0</strong></div>
                    <div>Factors / 因子: <strong id="share-stat-factors">0</strong></div>
                </div>
            </div>
        </div>
    </div>
</div>
```

#### Save Slot Card Template
```javascript
renderSaveSlot(slotId, saveData) {
  const isEmpty = !saveData;
  const timestamp = saveData ? new Date(saveData.timestamp).toLocaleString() : '';
  const meta = saveData ? saveData.metadata : null;
  
  return `
    <div class="save-slot-card ${isEmpty ? 'empty' : 'filled'}" data-slot="${slotId}">
      <div class="slot-header">
        <span class="slot-number">Slot ${slotId}</span>
        ${!isEmpty ? `<button class="btn-delete-slot" onclick="tracker.deleteSlot(${slotId}); event.stopPropagation();">🗑️</button>` : ''}
      </div>
      <div class="slot-body" onclick="tracker.saveToSlot(${slotId})">
        ${isEmpty ? `
          <div class="empty-slot">
            <div class="plus-icon">＋</div>
            <div>Click to save here</div>
            <div class="jp-text">ここに保存</div>
          </div>
        ` : `
          <div class="slot-info">
            <div class="slot-timestamp">${timestamp}</div>
            <div class="slot-stats">
              <span>🏇 ${meta.racesRun}</span>
              <span>🏆 ${meta.wins}</span>
              <span>✅ ${meta.factorsCompleted}</span>
            </div>
          </div>
        `}
      </div>
    </div>
  `;
}
```

### 5. CSS Styling

```css
/* Storage Toolbar */
.storage-toolbar {
    display: flex;
    gap: 8px;
    padding: 10px 0;
    border-bottom: 1px solid #e2e8f0;
    margin-bottom: 12px;
}

.btn-storage {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 14px;
    background: #f7fafc;
    border: 2px solid #cbd5e0;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 600;
    transition: all 0.2s ease;
}

.btn-storage:hover {
    background: #667eea;
    border-color: #667eea;
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
}

.btn-storage .btn-label {
    font-size: 0.85rem;
}

/* Storage Modal */
.storage-modal {
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
}

.storage-backdrop {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
}

.storage-panel {
    position: relative;
    background: white;
    border-radius: 12px;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
    max-width: 600px;
    width: 90vw;
    max-height: 80vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.storage-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
}

.storage-header h3 {
    margin: 0;
    font-size: 1.2rem;
}

.close-btn {
    background: transparent;
    border: none;
    color: white;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
}

.close-btn:hover {
    background: rgba(255, 255, 255, 0.2);
}

.storage-body {
    padding: 20px;
    overflow-y: auto;
}

/* Save Slots Grid */
.save-slots-grid,
.load-slots-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 15px;
}

.save-slot-card {
    border: 2px solid #e2e8f0;
    border-radius: 10px;
    overflow: hidden;
    transition: all 0.2s ease;
    cursor: pointer;
}

.save-slot-card:hover {
    border-color: #667eea;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
    transform: translateY(-2px);
}

.save-slot-card.empty {
    border-style: dashed;
    background: #f7fafc;
}

.save-slot-card.filled {
    background: white;
}

.slot-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    background: #edf2f7;
    border-bottom: 1px solid #e2e8f0;
}

.slot-number {
    font-weight: 700;
    color: #4a5568;
    font-size: 0.85rem;
}

.btn-delete-slot {
    background: transparent;
    border: none;
    cursor: pointer;
    font-size: 1rem;
    padding: 2px 6px;
    border-radius: 4px;
    transition: all 0.2s ease;
}

.btn-delete-slot:hover {
    background: #fc8181;
}

.slot-body {
    padding: 16px;
    min-height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.empty-slot {
    text-align: center;
    color: #a0aec0;
}

.empty-slot .plus-icon {
    font-size: 2rem;
    margin-bottom: 8px;
}

.empty-slot .jp-text {
    font-size: 0.75rem;
    margin-top: 4px;
}

.slot-info {
    width: 100%;
}

.slot-timestamp {
    font-size: 0.75rem;
    color: #718096;
    margin-bottom: 8px;
}

.slot-stats {
    display: flex;
    gap: 12px;
    font-size: 0.9rem;
    color: #2d3748;
    font-weight: 600;
}

/* Share Dialog */
.share-content {
    text-align: center;
}

.share-content p {
    margin-bottom: 8px;
    color: #4a5568;
    font-size: 0.9rem;
}

.share-url-container {
    display: flex;
    gap: 8px;
    margin: 16px 0;
}

.share-url-container input {
    flex: 1;
    padding: 10px 12px;
    border: 2px solid #cbd5e0;
    border-radius: 6px;
    font-family: monospace;
    font-size: 0.85rem;
    background: #f7fafc;
}

.btn-copy {
    padding: 10px 16px;
    background: #48bb78;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.2s ease;
}

.btn-copy:hover {
    background: #38a169;
    transform: scale(1.05);
}

.share-stats {
    display: flex;
    justify-content: space-around;
    margin-top: 20px;
    padding: 16px;
    background: #f7fafc;
    border-radius: 8px;
    font-size: 0.9rem;
}

.share-stats strong {
    color: #667eea;
    font-size: 1.1rem;
}

/* Toast Notification */
.toast-notification {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #48bb78;
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    z-index: 3000;
    animation: slideInUp 0.3s ease, fadeOut 0.3s ease 2.7s;
    pointer-events: none;
}

.toast-notification.error {
    background: #fc8181;
}

@keyframes slideInUp {
    from {
        transform: translateY(100px);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}

@keyframes fadeOut {
    to {
        opacity: 0;
        transform: translateY(-20px);
    }
}
```

### 6. New Methods in app.js

```javascript
// Storage System Methods

// Dialog controls
openSaveDialog() { /* Show save modal */ }
closeSaveDialog() { /* Hide save modal */ }
openLoadDialog() { /* Show load modal */ }
closeLoadDialog() { /* Hide load modal */ }
openShareDialog() { /* Show share modal */ }
closeShareDialog() { /* Hide share modal */ }

// Save/Load operations
saveToSlot(slotId) { /* Save current state to slot */ }
loadFromSlot(slotId) { /* Load state from slot */ }
deleteSlot(slotId) { /* Delete save slot */ }
getAllSaves() { /* Get all saved slots */ }

// State management
captureCurrentState() { /* Capture current state as JSON */ }
restoreState(state) { /* Restore state from JSON */ }
getCompletedFactorCount() { /* Count completed factors */ }

// Share functionality
generateShareURL() { /* Create shareable URL */ }
copyShareURL() { /* Copy URL to clipboard */ }
decodeURLState() { /* Parse URL parameters */ }
initializeFromURL() { /* Load shared state on init */ }

// Utilities
showToast(message, type) { /* Show toast notification */ }
confirmLoad(slotId, saveData) { /* Confirmation dialog */ }
isCompatibleVersion(version) { /* Version check */ }
```

### 7. External Dependencies

#### LZ-String Library
For URL compression, include lightweight compression library:

```html
<!-- Add to index.html -->
<script src="https://cdn.jsdelivr.net/npm/lz-string@1.5.0/libs/lz-string.min.js"></script>
```

Alternative: Implement simple base64 encoding without compression if URLs stay under 2000 chars.

## Implementation Phases

### Phase 1: Core Storage (4-5 hours)
1. Implement `captureCurrentState()` and `restoreState()` methods
2. Add localStorage save/load functionality
3. Create basic save slot management (3 slots)
4. Test state persistence across page reloads

### Phase 2: UI Implementation (4-5 hours)
5. Add storage toolbar to progress panel
6. Create save/load/share modal dialogs
7. Implement save slot cards with metadata display
8. Add delete slot functionality
9. Style all storage UI components

### Phase 3: Share System (3-4 hours)
10. Implement URL encoding/decoding with compression
11. Add URL parameter parsing on page load
12. Create share dialog with copy-to-clipboard
13. Test URL sharing across browsers
14. Handle edge cases (invalid URLs, version mismatches)

### Phase 4: Polish & UX (2-3 hours)
15. Add toast notifications for all actions
16. Implement confirmation dialogs
17. Add loading states and animations
18. Test on mobile devices
19. Handle localStorage quota errors gracefully
20. Add keyboard shortcuts (Ctrl+S to save, etc.)

### Phase 5: Testing & Documentation (2-3 hours)
21. Test all save/load scenarios
22. Test URL sharing with large states
23. Test browser compatibility (Chrome, Firefox, Safari, Edge)
24. Test localStorage limits and fallbacks
25. Update README with storage feature guide

## Total Estimated Time: 15-20 hours

## Testing Checklist

### Functional Tests
- [ ] Save to empty slot creates new save
- [ ] Save to filled slot overwrites with confirmation
- [ ] Load restores exact state (selections, planner, tracking)
- [ ] Delete slot removes save permanently
- [ ] Share generates working URL
- [ ] Shared URL loads correctly in new tab/browser
- [ ] URL state overrides localStorage on load
- [ ] Multiple slots work independently

### Edge Cases
- [ ] Save/load with empty state
- [ ] Save/load with maximum races selected
- [ ] Share URL with special characters in race names
- [ ] Load invalid/corrupted save data
- [ ] localStorage quota exceeded (graceful error)
- [ ] URL too long (>2000 chars) warning
- [ ] Browser with disabled localStorage
- [ ] Browser with disabled cookies

### Cross-Browser Tests
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (macOS/iOS)
- [ ] Mobile browsers

### Performance Tests
- [ ] State capture < 100ms
- [ ] State restoration < 200ms
- [ ] URL generation < 500ms
- [ ] URL decode on load < 500ms

## Data Size Estimates

### Uncompressed State
- Typical state: ~2-3 KB JSON
- Maximum state (all races): ~8-10 KB JSON

### Compressed State
- Typical compressed: ~500-800 chars
- Maximum compressed: ~1500-2000 chars

### Browser Limits
- localStorage: 5-10 MB (ample space)
- URL length: 2000 chars (safe limit)
- Cookies: 4KB per cookie (not using for state)

## Security & Privacy

### Considerations
- No personal data stored
- All data client-side only
- Shared URLs contain only race selections (no account data)
- localStorage isolated per domain
- No server-side storage required

### Best Practices
- Validate all loaded data before restoration
- Version checking for schema compatibility
- Sanitize any user-facing error messages
- Clear URL parameters after loading shared state
- Implement undo/redo for accidental overwrites (future)

## Future Enhancements (v2.0)

### Advanced Features
- Import/Export to JSON file
- Auto-save every N minutes
- Save slot naming/renaming
- Save slot categories/tags
- Unlimited save slots (pagination)
- Cloud sync with optional account
- Share with password protection
- Share expiration dates
- QR code generation for mobile
- Conflict resolution for concurrent edits
- Version history per slot
- Compare two save slots side-by-side

### UI Improvements
- Drag-and-drop save slot reordering
- Save slot thumbnails (mini planner preview)
- Search/filter save slots
- Keyboard shortcuts
- Undo/Redo system
- Recent saves quick access
- Pin favorite saves

## Compatibility Notes

- Works on all modern browsers (ES6+)
- Degrades gracefully without localStorage
- Mobile-friendly touch interactions
- No server/database required
- Works offline after initial load

## Documentation Updates

After implementation:
- Update `README.md` with storage guide
- Update `PLANNING.md` with storage feature
- Add inline comments for all storage methods
- Create user guide with screenshots

---

**End of Implementation Plan**
