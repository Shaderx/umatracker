## Uma Musume Race Planner — Current Feature Spec and File Map

### Purpose
This document describes the current capabilities of the web app, how files link together, the runtime flow, and the internal data model. It is written for AI agents and developers to understand requirements, constraints, and where to extend next.

### Top-level Files and Roles
- `index.html`: Single-page UI that renders the race grid, filters, stats, hidden factor progress, and a data source indicator. Loads `races.js` (if present) before `app.js`.
- `races.js`: Generated static dataset (`window.RACES`) plus metadata (`window.RACES_META`) built from `RaceComplete.csv`.
- `app.js`: Implements `UmaMusumeTracker` which initializes data, manages UI state, evaluates hidden factors, and updates the DOM. Prefers `window.RACES` when available; otherwise falls back to an embedded sample.
- `CompleteDual.xml`: Reference catalog of hidden factors (more comprehensive than what the app currently evaluates). Not parsed by the app yet.
- `RaceComplete.csv`: Canonical CSV source used by the generator to produce `races.js` (not fetched at runtime).
- `generate_races_js.py`: Script that converts `RaceComplete.csv` to `races.js`, adding a generation timestamp and race count.
- `race_images/` and `download_race_images.py`: Assets and script for race images (images referenced in race objects but not yet rendered in UI).
- `README.md`, `README_images.md`: Project notes and image-related documentation.

### Execution Flow and File Linkage
1. The browser loads `index.html`, which includes `<script src="races.js"></script>` (if present) followed by `<script src="app.js"></script>`.
2. On `DOMContentLoaded`, `new UmaMusumeTracker()` runs:
   - `initializeData()` sets translation maps and categorization helpers, then calls `loadRaceData()` and `loadHiddenFactors()`.
   - `setupEventListeners()` wires filter buttons and the clear action.
   - `renderRaces()` draws the race cards.
   - `updateProgress()` computes and renders hidden factor progress.
3. UI interactions:
   - Clicking a race card calls `toggleParticipationById(id)` (bound inline in card HTML), toggling selection and defaulting to Won.
   - A small `loss-toggle-btn` on selected cards calls `toggleWinById(id)` to flip Won ↔ Lost.
   - Filter buttons set `currentFilter` and re-render the grid.
4. Hidden factor evaluation:
   - `updateProgress()` maps over `hiddenFactors`, invoking each `check()` method to produce a result {completed, current, required, progress, details}.
   - `renderHiddenFactors()` renders bilingual names, conditions, progress numbers, a progress bar, and a completion badge.

### Data Model (in-memory)
- Races (array): Sourced from `window.RACES` (preferred) or produced by `parseCSVData()` using an embedded CSV subset. Each race has:
  - `name`, `nameJP`, `type` (GI/GII/GIII/Open), `length` (e.g., "1600m"), `surface` ("turf"|"dirt"), `racetrack` (English), `junior`/`classics`/`senior` (booleans), `month` (English), `half` (1st|2nd), `direction` (left|right), `season` (spring|summer|autumn|winter).
  - Derived helpers: distance category predicates (`short`/`mile`/`medium`/`long`), region sets (east/west).
  - Optional image metadata: `image` (local path under `race_images/`), `imageRemote` (original URL).
- App state (sets):
  - `selectedRaces`: string IDs of races marked as run.
  - `wonRaces`: string IDs marked as Won.
  - `lostRaces`: string IDs marked as Lost.
- Lookup maps:
  - `raceById: Map<string, Race>` for quick property checks from IDs.
  - `raceIdsByName: Map<string, Set<string>>` to support name-based factor conditions across years.
- Hidden factors (array): Each has `id`, bilingual names/conditions, and a `check()` that inspects the sets/races.

Note: The race object currently does not store a chronological index or year-stage order; checks that require sequence are simplified.

### UI/UX Surface
- Race Calendar grid with cards showing bilingual names, grade, distance, surface, track, month/half, direction, season, and flags for class year.
- Filters: All, GI, Classic, Senior, Selected; plus a `Clear All` action.
- Selection model:
  - Click card → toggle in/out of `selectedRaces`. Newly selected defaults to Won (added to `wonRaces`).
  - On a selected card, a compact `loss-toggle-btn` flips Won ↔ Lost.
- Stats: Four live counters — `Races Run`, `Wins`, `Losses`, `Factors` (completed count).
- Hidden Factors panel: Bilingual names/conditions, textual progress (current/required), optional details list, progress bar, and a ✅ badge when completed.
 - Data source indicator: Shows whether data is loaded from `races.js` (with generated date and count) or from the embedded fallback sample.

### Implemented Features (working today)
- Rendering and filtering of races from the embedded dataset.
- Selection and result toggling per race (Won/Lost) with visual states.
- Live stats for runs, wins, losses, and completed factor count.
- Bilingual display via translation maps for tracks, surfaces, months/halves, directions, and year types.
- Hidden factor evaluation for these categories:
  - Consecutive Runs (CSV-aligned): participate in ≥ 2 races (chronology simplified).
  - Champion of the East (GI wins at eastern tracks ≥ 7).
  - Champion of the West (GI wins at western tracks ≥ 7).
  - Traveler (participate at ≥ 7 different racecourses; win not required).
  - All Ranks Conquered (CSV-aligned): win at least one race in each distance category (short, mile, medium, long). No GI restriction.
  - Newspaper Boy/Girl (win Kyoto/Kobe/Chunichi/Tokyo Shimbun Hai).
  - The Year's Plan (CSV-aligned): Senior year, January first half, win Nakayama Kinen or Kyoto Kinen.
  - Wish Upon a Star (win ≥ 3 from the star/constellation list).
  - Jewelry (CSV-aligned target ≥ 3; dataset currently includes 2: Diamond, Turquoise — progress shown, completion may be gated by data).
  - Two-Sword Style / Dual Wielder (win at least once on both turf and dirt; aptitude system not modeled).
  - Perfect Crown (CSV-aligned groups):
    - Main: 皐月賞 / 日本ダービー / 菊花賞; and one trial from each group:
      - A: 弥生賞 / スプリングステークス / 若葉ステークス
      - B: 青葉賞 / プリンシパルステークス
      - C: 神戸新聞杯 / セントライト記念
  - Perfect Tiara (CSV-aligned groups):
    - Main: 桜花賞 / オークス / 秋華賞; and one trial from each group:
      - A: フィリーズレビュー / チューリップ賞 / アネモネステークス
      - B: フローラステークス / スイートピーステークス
      - C: ローズステークス / 紫苑ステークス
  - Improves with Racing (CSV-aligned threshold): participate in ≥ 3 races (consecutive simplified).
  - Never-Give-Up Spirit (CSV-aligned, simplified ordering): have at least one loss and at least one win.
  - Rebellious Spirit (CSV text says C or lower; currently simplified to any win until aptitude data exists).
  - Right/Left Awakening (≥ 6 wins on right-/left-handed tracks).
  - Seasonal Awakening (≥ 6 wins in each of spring/summer/autumn/winter).

### Known Limitations and Assumptions
- Chronology not tracked: No explicit race order across months/years; “consecutive” logic is simplified.
- Aptitudes and skills are not modeled: Factors that depend on A-rank aptitudes or named skills are not evaluable yet.
- Embedded dataset: Races come from a representative subset inside `app.js`. `RaceComplete.csv` is present but not parsed at runtime.
- Partial field usage: UI templates reference `trial_for`/`series`, but current race objects do not populate these fields.
- Images are surfaced on race cards and planner slots. Planner uses layered backgrounds (local `image` first, then `imageRemote` as fallback) with a gradient overlay for legibility.
 - CSV alignment scope: Where the CSV specifies exact groupings (Crown/Tiara), groups are enforced; where data is missing (e.g., some trial races or jewelry items), progress reflects available entries and may not reach completion.

### Future Features (backlog placeholders)
- Data ingestion
  - Preferred: Generate a static `races.js` from `RaceComplete.csv` via `generate_races_js.py` and load it before `app.js` for instant, offline parsing.
  - Alternative: Load full races directly from `RaceComplete.csv` at runtime (requires fetch + CSV parser; slower and blocked by file://).
  - Normalize race metadata: series membership, trial mappings, canonical IDs, year index, and calendar order.
  - Parse `CompleteDual.xml` to auto-generate hidden factor definitions and conditions.
- Mechanics and evaluation
  - Implement true chronological modeling to enforce “consecutive” constraints and year-specific conditions.
  - Add aptitude and skill systems (inputs, storage, and evaluators) to unlock XML-defined skill-based factors.
  - Implement Summer Series (SSS/SMS/S2000), All-Weather, training-count-based awakenings, and additional XML factors.
  - Enforce “unique race per year” constraints where applicable (e.g., Jewelry duplicates across years).
- UI/UX
  - Search, sort, and more filters (distance, surface, direction, season, region, series).
  - Per-year calendar view with timeline and conflict warnings.
  - Surfaces/aptitudes/skills editors; quick toggles and validation hints.
  - Use `race_images/` for richer cards; lightbox and track logos.
  - Language toggle (EN/JA) and accessibility improvements.
- Persistence and shareability
  - Save/load plan to localStorage; import/export JSON.
  - Shareable URLs or file export.
- Quality
  - Unit tests for each `check*` function and dataset validators.
  - Type annotations or migration to TypeScript for safer data handling.

### How to Run and Extend
- Run: Open `index.html` in any modern browser. No server required.
- Develop:
  - Races: Edit the embedded CSV in `app.js` within `parseCSVData()` or wire a loader for `RaceComplete.csv`.
  - Factors: Add to `loadHiddenFactors()` and implement a corresponding `check*` method.
  - UI: Adjust templates in `renderRaces()` and `renderHiddenFactors()` to display new fields.
  - Images: If desired, serve via a local static server and reference paths under `race_images/`.

### Implementation Notes (mapping to code)
- Initialization: `initializeData()` → translations, categories, `loadRaceData()`, `loadHiddenFactors()`.
- DOM wiring: `setupEventListeners()` attaches `.filter-btn` clicks and uses `data-filter` attributes; `Clear All` calls `clearAll()`.
- Rendering: `renderRaces()` fills `#races-grid`; `renderHiddenFactors()` fills `#hidden-factors`; `renderPlannerGrid()` draws the game-style planner.
- State transitions: `toggleParticipationById(id)` updates `selectedRaces`/`wonRaces`/`lostRaces`; `toggleWinById(id)` flips Won ↔ Lost.
- Planner: slots store IDs, render EN/JP titles by resolving `raceById`, carry `data-race-id`, and use layered background images (local then remote) with a gradient overlay. Picker compares and selects by ID via `addRaceToCurrentCellById(id)` and supports Auto-close toggle and year-wrapping navigation.
- Stats and progress: `updateProgress()` sets `#total-*` and computes factor results.
 - CSV-aligned checks in `app.js`:
   - `checkAllDistanceG1()` now counts any race wins per distance category.
   - `checkNewYearGold()` validates Senior/January/1st-half and race name.
   - `checkPerfectCrown()` and `checkPerfectTiara()` enforce per-group trial wins.
   - `checkImprovesWithRacing()` requires ≥ 3 participations.
   - `checkConsecutiveRuns()` requires ≥ 2 participations.
   - `checkNeverGiveUp()` requires a loss and a win.
 - Races data loading order:
   - If `window.RACES` exists (from `races.js`), use it; else fallback to embedded sample parser.
- Generator: Run `python generate_races_js.py` to produce `races.js` from `RaceComplete.csv`. The generator also emits `window.RACES_META` with `generatedAt` (UTC ISO8601), `source`, and `count`.
- Data source indicator: `#data-source-indicator` shows "races.js — generated <local date> (<count> races)" or "embedded fallback dataset" accordingly.

### Session Changelog (2025-09-28)
- Added CSV → JS generator (`generate_races_js.py`) producing:
  - `window.RACES`: full race list; `window.RACES_META`: `{generatedAt, source, count}`
- Updated `index.html` to load `races.js` before `app.js` and added `#data-source-indicator` below the race grid.
- `app.js` enhancements:
  - `loadRaceData()` now prefers `window.RACES` and sets the data source indicator; falls back to embedded sample otherwise.
  - Embedded sample CSV expanded to include additional trial races (e.g., アネモネステークス, フィリーズレビュー, 若葉ステークス, 青葉賞, スイートピーステークス, プリンシパルステークス, 紫苑ステークス).
  - `createRaceObject()` accepts image fields from CSV and enriches `image`/`imageRemote`; derives local paths from remote filenames; includes a small fallback mapping for sample entries.
- Factor logic alignment with `Updatedhiddenconditions.csv` (previous step in this session):
  - Consecutive runs ≥ 2, improves-with-racing ≥ 3, New Year’s Plan timing enforced, Perfect Crown/Tiara trial groups enforced, Never-Give-Up added; Rebellious Spirit text aligned (aptitude modeling pending).

### Session Changelog (2025-09-28 — later UI/UX pass)
- Game-style Planner added and refined:
  - Year tabs (`junior`, `classics`, `senior`) with per-month-half grid (12 months × 2 halves) displayed as a 4-column planner grid.
  - One selection per slot enforced; picker replaces existing selection. Slots render as background-image buttons with bottom gradient and EN/JP titles.
  - Planner ↔ calendar linkage: selecting/deselecting in one view syncs the other; win/loss toggles update both.
  - Clear actions: per-year reset and global `Clear All` fully clear planner cells and selections.
- Loss toggle rework for clarity:
  - Icon-only state: 🏆 (win) ↔ 👎 (loss). Planner overlay gets a semi-opaque backdrop for legibility.
- Calendar split and compaction:
  - Calendar moved to a full-width section at bottom; cards compacted (smaller spacing/fonts), showing only essential hidden-factor info:
    - Row 1: grade + distance + surface
    - Row 2: track + month/half + direction
- Layout/height behavior:
  - Planner column grows to content without inner scrollbars.
  - Progress panel scrolls internally and now caps with `max-height` synced dynamically to planner height.
- Visual polish:
  - Page background uses `background.jpg` with a soft gradient overlay for readability.

### Session Changelog (2025-09-29 — ID-based linkage and planner image fix)
- Migrated selection/state to use race IDs across the app (planner, calendar, win/loss).
- Added `raceById` and `raceIdsByName` maps to support ID-based state while preserving name-based factor conditions.
- Updated hidden factor checks to iterate IDs and resolve races via `raceById`; name-based lists (e.g., Newspaper, Crown/Tiara, star/jewelry series) match by translating names → IDs via `raceIdsByName`.
- Planner slots now resolve IDs to show English/Japanese titles, add `data-race-id`, and render layered background images with remote fallback for reliability.
- Picker highlights and selection operate by ID; new `addRaceToCurrentCellById(id)` added; selection Auto-close toggle preserved.

### Notes on Implementation
- New IDs: `planner-section` (planner container) and `progress-panel` (right panel) used by `syncProgressHeightToPlanner()`.
- New methods in `app.js`:
  - `planRaceIntoPlanner()`, `removeRaceEverywhereFromPlanner()`, `syncProgressHeightToPlanner()`
  - Planner data model changed to a single race per slot (string or null).
- Accessibility/legibility:
  - Text stroke and shadows on overlay titles and loss toggle for contrast over images.

### Appendix: Reference Inputs Not Yet Wired
- `CompleteDual.xml`: Contains many factors beyond the implemented subset (e.g., skill- and training-based). Treat as canonical source for future implementation.
- `RaceComplete.csv`: Likely the complete race calendar. Integrate to improve coverage and correctness of checks.

### CSV Implementability Matrix (excerpt)
- Implemented now (simplified where noted):
  - 連戦連勝, 東の雄, 西の雄, 旅人, 全階級制覇, 新聞屋さん, 一年の計は, 星に願いを, パーフェクトクラウン, パーフェクトティアラ, 叩き良化型, 諦めない心, 右/左/季節の目覚め
- Partially blocked by missing data or mechanics:
  - ジュエリー (needs 3+ qualifying races; dataset includes 2)
  - 反骨精神 (needs aptitude modeling)
- Not implementable without skills/aptitudes/training/persistence:
  - 甲斐性なし, 健闘, 太陽系, ノーブレーキ, 山娘, ピカピカ, ビュービュー, 全天候型, 出たとこ勝負, 企画上手, 策略家, 大志, 大肺活量, 東奔西走, 想いの継ぎ手, 信頼の証, リフレッシュ, 二刀流 (aptitudes), SMILE, 自由自在, ジャックポット, スピード/スタミナ/パワー/根性/賢さの目覚め


### Hidden Factor Implementation Status

This section tracks which hidden factors are implemented in `app.js` today, which are not, and what is needed to make them fully faithful to the reference data.

| Factor (EN / JP) | Status | Needs for full implementation |
| --- | --- | --- |
| Consecutive Wins / 連戦連勝 | Implemented (simplified: participation ≥ 2, order ignored) | Add chronological modeling to enforce true consecutiveness and, if desired, require wins not just runs |
| Champion of the East / 東の雄 | Implemented | Ensure complete GI coverage and accurate east/west track mapping in dataset |
| Champion of the West / 西の雄 | Implemented | Ensure complete GI coverage and accurate east/west track mapping in dataset |
| Traveler / 旅人 | Implemented | None beyond racetrack normalization |
| All Ranks Conquered / 全階級制覇 | Implemented (GI restriction relaxed to any race) | Restrict to GI-only wins once full race data is integrated |
| Newspaper Boy/Girl / 新聞屋さん | Implemented | Confirm all four Shimbun Hai races exist in dataset |
| The Year's Plan / 一年の計は | Implemented | Accurate `senior`/month/half metadata across races |
| Wish Upon a Star / 星に願いを | Implemented | Validate themed race list against canonical source; ensure dataset coverage |
| Jewelry / ジュエリー | Implemented (data-limited; cannot reach 3) | Add additional jewelry-themed races in dataset to reach target ≥ 3 |
| Two-Sword Style (Dual Wielder) / 二刀流 | Implemented (proxy via wins on both surfaces) | Implement aptitude system and require A-rank on Turf and Dirt |
| Perfect Crown / パーフェクトクラウン | Implemented | Ensure all triple crown trials are present and correctly mapped |
| Perfect Tiara / パーフェクトティアラ | Implemented | Ensure all triple tiara trials are present and correctly mapped |
| Improves with Racing / 叩き良化型 | Implemented (simplified: count ≥ 3) | Chronological modeling to enforce consecutiveness and reporter-event nuances |
| Never-Give-Up Spirit / 諦めない心 | Implemented (order-agnostic) | Chronological modeling to enforce lose-then-win ordering |
| Rebellious Spirit / 反骨精神 | Implemented (placeholder: any win) | Aptitude modeling to detect wins with C-or-lower aptitude |
| Right Awakening / 右の目覚め | Implemented | None |
| Left Awakening / 左の目覚め | Implemented | None |
| Spring Awakening / 春の目覚め | Implemented | None |
| Summer Awakening / 夏の目覚め | Implemented | None |
| Autumn Awakening / 秋の目覚め | Implemented | None |
| Winter Awakening / 冬の目覚め | Implemented | None |

Not yet implemented (from `CompleteDual.xml`, skills/aptitudes/training-based):

- Requires aptitudes/skills/training systems and/or persistence: 甲斐性なし, 健闘, 太陽系, ノーブレーキ, 山娘, ピカピカ, ビュービュー, 全天候型, 出たとこ勝負, 企画上手, 策略家, 大志, 大肺活量, 東奔西走, 想いの継ぎ手, 信頼の証, リフレッシュ, SMILE, 自由自在, ジャックポット, スピード/スタミナ/パワー/根性/賢さの目覚め, ほか。

To fully unlock the above:

- Parse `CompleteDual.xml` to auto-generate factor definitions and conditions
- Integrate `RaceComplete.csv` via `generate_races_js.py` to ensure full race coverage
- Add chronological modeling (per-year calendar order) for sequence- and “consecutive”-based checks
- Implement aptitude and skill systems (inputs, storage, and evaluators)
- Add training counters/persistence where conditions depend on training or cumulative stats


