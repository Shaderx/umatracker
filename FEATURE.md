## Hidden Factor → Race Cell Highlighting (Spec)

### Summary
Clicking a hidden factor in the progress panel toggles a highlight mode that visually marks all races that apply to that factor by changing their cell/card border. Works across both the planner cells and the calendar race cards. Single active factor at a time; click again (or press Esc) to clear.

### Goals
- Make factor → race relationships discoverable at a glance
- Reduce guesswork when planning which races satisfy a factor
- Keep the UI unobtrusive: purely visual, zero data loss, no modal dialogs

### Non‑Goals
- Do not modify selection (run/win/loss) state when highlighting
- Do not add new factor logic beyond mapping races that "count" toward the factor

## UX Behavior

### Interactions
- Click on a factor row (anywhere within its list item) → activate highlight for that factor
- Clicking the same factor again → clears highlight
- Clicking a different factor → switches highlight to the new factor
- Keyboard: when a factor has focus, Enter/Space toggles highlight; Esc clears any highlight

### Visuals
- Add an accent border to all applicable race UI elements:
  - Planner cells that currently contain an applicable race
  - Calendar race cards whose race is applicable
- Optional nuance (future): show dotted border for "applicable but not yet satisfied" vs solid for "already contributes".

### Accessibility
- Factor buttons use `aria-pressed="true|false"` to indicate highlight state
- Announce highlight activation via `aria-live="polite"` region (e.g., "Highlighting races for: Perfect Crown")

## Data Mapping (What is "applicable")

We support two mapping modes per factor:
1) Explicit race list: factor is satisfied by wins/participation in specific named races
2) Predicate: factor applies to races matching a property (e.g., direction, season, surface, distance category)

Examples (non-exhaustive):
- Perfect Crown: explicit list — Triple Crown races and trial groups (A/B/C)
- Perfect Tiara: explicit list — Triple Tiara races and trial groups (A/B/C)
- Newspaper Boy/Girl: explicit list — 京都新聞杯 / 神戸新聞杯 / 中日新聞杯 / 東京新聞杯
- The Year's Plan: explicit list — 中山記念 / 京都記念 (also time window Senior/Jan/1st-half, but for mapping we still flag those race names)
- Right/Left Awakening: predicate — `race.direction === 'right' | 'left'`
- Seasonal Awakening: predicate — `race.season === 'spring' | 'summer' | 'autumn' | 'winter'`
- Two-Sword Style: predicate — surface `turf` or `dirt`
- All Ranks Conquered: predicate — distance category `short|mile|medium|long`
- Traveler: predicate — all races (but highlighting every race is noisy; default to off unless explicitly enabled later)

Note: Highlighting is about potential applicability, not current completion. We can optionally add a second style to indicate which applicable races would still move the needle given current progress (see "Future Enhancements").

## DOM & Styling Contract

### Markup hooks
- Hidden factor items: add `data-factor-id` on each rendered factor row
- Calendar race cards: ensure each `.race-card` has `data-race-name="<exact race name>"`
- Planner cells (buttons): ensure each selected cell button has `data-race-name` for the placed race

These unify selection across both views without coupling to internal IDs.

### CSS
Add a shared highlight class consumed by both views:

```css
/* Accent can be tuned or themed later */
:root { --factor-accent: #ff8c00; }

.highlight-factor {
  outline: 3px solid var(--factor-accent);
  outline-offset: -3px; /* preserves layout; sits on border */
  border-radius: 8px;   /* match existing card/cell radius */
}

/* Optional nuance if we separate satisfied vs missing later */
.highlight-factor--missing { outline-style: dashed; }
```

Apply `.highlight-factor` to:
- Calendar: the root element of each race card
- Planner: the slot button element representing the race in that cell

## App State & API

### New State
- `activeFactorHighlightId: string | null` — currently highlighted factor (null when inactive)

### New Methods (in `app.js`)
- `toggleFactorHighlight(factorId: string): void`
  - Sets/clears `activeFactorHighlightId`
  - Re-applies highlight classes across the DOM
- `getApplicableRacesForFactor(factorId: string): Set<string>`
  - Returns canonical race names that are considered applicable for the factor
  - Implementation may delegate to explicit lists or predicates
- `applyHighlightToDom(applicable: Set<string>): void`
  - Finds elements with `data-race-name` matching any name in `applicable`
  - Adds/removes `.highlight-factor`
- `indexDomByRaceName(): Map<string, HTMLElement[]>`
  - Optional micro-cache to avoid repeated DOM queries; update after each render

### Hidden Factor Model Extension
For maintainability, prefer to extend each factor definition with a `getApplicable(races)` or `appliesTo(race)` helper alongside `check()`:

```js
{
  id: 'perfectCrown',
  name: { en: 'Perfect Crown', jp: 'パーフェクトクラウン' },
  check: (state) => { /* existing */ },
  getApplicable: (races) => new Set([
    '皐月賞','日本ダービー','菊花賞',
    '弥生賞','スプリングステークス','若葉ステークス',
    '青葉賞','プリンシパルステークス',
    '神戸新聞杯','セントライト記念',
  ])
}
```

For predicate factors, provide a function:

```js
{
  id: 'rightAwakening',
  name: { en: 'Right Awakening', jp: '右の目覚め' },
  check: (state) => { /* existing */ },
  appliesTo: (race) => race.direction === 'right'
}
```

`getApplicableRacesForFactor` can unify both variants by:
- If `getApplicable` exists, return it
- Else if `appliesTo` exists, filter all `races`

## Wiring & Event Flow

1) Rendering hidden factors (`renderHiddenFactors()`):
   - Add `data-factor-id` and `role="button"` to each row; wire click/keydown handlers
   - Maintain `aria-pressed` based on `activeFactorHighlightId`

2) On activation:
   - Compute `applicable = getApplicableRacesForFactor(factorId)`
   - Call `applyHighlightToDom(applicable)`

3) On deactivation:
   - Remove `.highlight-factor` from all previously highlighted elements

4) After any re-render of planner or calendar:
   - If `activeFactorHighlightId` is set, re-run `applyHighlightToDom` to restore highlights

## Edge Cases
- No applicable races found: clear highlight and announce "No races to highlight for this factor"
- Very broad factors (e.g., Traveler): avoid enabling by default to prevent visual overload
- Name normalization: ensure `data-race-name` matches the canonical `race.name` used in factor lists and predicates

## Future Enhancements (Optional)
- Distinguish races that would still advance progress (dashed border) vs already satisfied (solid)
- Legend pill in the factor row showing how many races are highlighted
- Multi-select (Shift+Click) to highlight union of multiple factors
- Color-coding by factor family with per-factor `--factor-accent`

## Acceptance Criteria
- Clicking a factor toggles a visible border highlight on all applicable races in both planner and calendar views
- Exactly one factor can be active at a time; switches correctly between factors
- Esc clears the current highlight
- Highlight is resilient to re-renders (persists until cleared)
- No changes occur to selection or win/loss state
- Keyboard and screen reader users can toggle the highlight with appropriate ARIA states

## Implementation Checklist (dev-facing)
- Add `data-factor-id` to factor rows in `renderHiddenFactors()`
- Ensure planner cells and calendar cards render `data-race-name`
- Add new state `activeFactorHighlightId` to `UmaMusumeTracker`
- Implement `getApplicableRacesForFactor`, `toggleFactorHighlight`, `applyHighlightToDom`, and (optional) `indexDomByRaceName`
- Add CSS for `.highlight-factor` (shared across views)
- Re-apply highlight after `renderRaces()` and planner updates
- Test with: Perfect Crown, Newspaper, Right Awakening, The Year's Plan

## QA Notes
Manual passes:
- Click "Perfect Crown" → Satsuki Sho, Japanese Derby, Kikuka Sho and trial races all receive an accent border
- Click "Right Awakening" → all right-handed track races gain a border in both views
- Select/deselect races while a factor is active → highlight remains appropriately applied
- Press Esc → highlight clears everywhere


