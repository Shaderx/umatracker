# Year Color Reference

## Color Palette Overview

This document provides a quick reference for the pastel color scheme used across the year pagination system.

## Year Colors

### 🌱 Junior Year (Mint Green)
```
Primary Color:   #B8E6D5  ████████
Light Variant:   #E8F5F0  ████████
Dark Border:     #8fd4bd  ████████
Dark Text:       #1a4032  ████████
Light Text:      #2d5f4d  ████████
```

**Usage:**
- Year badge background: `#B8E6D5`
- Tab inactive background: `#E8F5F0`
- Tab active background: `#B8E6D5`
- Active dot color: `#B8E6D5`

### 🌸 Classic Year (Pink)
```
Primary Color:   #FFD4E5  ████████
Light Variant:   #FFF0F5  ████████
Dark Border:     #ffb3d1  ████████
Dark Text:       #4a1f31  ████████
Light Text:      #6b2d45  ████████
```

**Usage:**
- Year badge background: `#FFD4E5`
- Tab inactive background: `#FFF0F5`
- Tab active background: `#FFD4E5`
- Active dot color: `#FFD4E5`

### 💙 Senior Year (Blue)
```
Primary Color:   #D4E5FF  ████████
Light Variant:   #EEF3FF  ████████
Dark Border:     #b3d1ff  ████████
Dark Text:       #1a2f4a  ████████
Light Text:      #2d4a6b  ████████
```

**Usage:**
- Year badge background: `#D4E5FF`
- Tab inactive background: `#EEF3FF`
- Tab active background: `#D4E5FF`
- Active dot color: `#D4E5FF`

## Component Mapping

### Main Planner Tabs
```html
<button class="year-tab" data-year="junior">
  ジュニア級<br>Junior
</button>
```

**States:**
- **Inactive**: Light variant background, light text
- **Active**: Primary color background, dark text
- **Hover**: Primary color background, dark text

### Picker Modal - Year Badge
```html
<div class="pagination-year-indicator" style="background: #B8E6D5;">
  <span class="year-indicator-en">Junior</span>
  <span class="year-indicator-jp">ジュニア</span>
</div>
```

### Pagination Dots
```html
<div class="pagination-dot active" 
     style="background: #B8E6D5;">
</div>
```

**States:**
- **Inactive**: `#cbd5e0` (neutral gray)
- **Active**: Year-specific primary color

## Accessibility

All color combinations meet **WCAG 2.1 Level AA** standards:

- **Light text on light background**: 4.5:1 minimum contrast
- **Dark text on primary background**: 7:1+ contrast
- **Inactive dots**: Distinguishable from active state

## Design Rationale

### Why Pastel Colors?
1. **Gentle on Eyes**: Suitable for extended use
2. **Professional**: Not garish or distracting
3. **Thematic**: Matches Uma Musume's cheerful aesthetic
4. **Distinct**: Each year clearly identifiable
5. **Scalable**: Works across light/dark UI elements

### Color Psychology
- **Green (Junior)**: Growth, freshness, new beginnings
- **Pink (Classic)**: Energy, youth, prime performance
- **Blue (Senior)**: Wisdom, maturity, mastery

## Browser Compatibility

All colors use standard hex notation supported by:
- ✅ Chrome/Edge (all versions)
- ✅ Firefox (all versions)
- ✅ Safari (all versions)
- ✅ Mobile browsers (iOS/Android)

No fallbacks needed.

## Quick Copy-Paste

```css
/* Junior */
background: #B8E6D5;  /* Active */
background: #E8F5F0;  /* Inactive */

/* Classic */
background: #FFD4E5;  /* Active */
background: #FFF0F5;  /* Inactive */

/* Senior */
background: #D4E5FF;  /* Active */
background: #EEF3FF;  /* Inactive */
```

## JavaScript Constants

```javascript
const yearColors = {
  junior: '#B8E6D5',
  classics: '#FFD4E5',
  senior: '#D4E5FF'
};

const yearLabels = {
  junior: { en: 'Junior', jp: 'ジュニア' },
  classics: { en: 'Classic', jp: 'クラシック' },
  senior: { en: 'Senior', jp: 'シニア' }
};
```

Located in: `js/features/picker-modal.js` (lines 320-331)

