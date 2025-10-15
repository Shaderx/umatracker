// js/features/picker-modal.js
// Picker modal logic extracted from app-new.js

import { state } from '../core/state.js';
import { cellKey } from '../ui/planner-renderer.js';
import { planRaceIntoPlanner } from './planner.js';
import { lockBodyScroll, unlockBodyScroll } from './scroll-lock.js';
import { getTrackedFactorRaceIds } from './tracking.js';
import { loadHiddenFactors } from '../data/hidden-factors.js';
import { raceMatchesFilters } from './filters.js';

export function openPicker(t, month, half) {
    t.currentPickerSlot = { year: state.plannerYear, month, half };
    updatePickerTitle(month, half);
    renderPickerCarousel(t);
    const modal = document.getElementById('picker-modal');
    if (modal) modal.classList.remove('hidden');
    positionPickerNavs(t);
    const plannerSection = document.getElementById('planner-section');
    lockBodyScroll(plannerSection);
}

export function updatePickerTitle(month, half) {
    const title = document.getElementById('picker-title');
    if (title) {
        const yearMap = { 
            junior: { en: 'Junior', jp: 'ジュニア級' },
            classics: { en: 'Classic', jp: 'クラシック級' },
            senior: { en: 'Senior', jp: 'シニア級' }
        };
        const year = yearMap[state.plannerYear] || { en: '', jp: '' };
        const jpMonth = state.translations.months[month] || month;
        const jpHalf = state.translations.halves[half] || half;
        
        // Format: [English] on top, [Japanese] below
        const enText = `${year.en} • ${month} ${half}`;
        const jpText = `${year.jp} • ${jpMonth} ${jpHalf}`;
        
        title.innerHTML = `<div class="picker-title-en">${enText}</div><div class="picker-title-jp">${jpText}</div>`;
    }
}

export function closePicker(t) {
    const modal = document.getElementById('picker-modal');
    if (modal) modal.classList.add('hidden');
    t.currentPickerSlot = null;
    const plannerSection = document.getElementById('planner-section');
    unlockBodyScroll(plannerSection);
}

export function navigatePicker(t, direction, skipAnimation = false) {
    console.log('🔵 navigatePicker called:', { direction, skipAnimation });
    
    const previousYear = t.currentPickerSlot?.year;
    const nextSlot = getAdjacentSlot(t, direction === 'prev' ? -1 : 1);
    if (!nextSlot) return;
    
    const yearChanged = previousYear !== nextSlot.year;
    console.log('🔍 Year check:', { previousYear, nextYear: nextSlot.year, yearChanged });
    
    t.currentPickerSlot = nextSlot;
    
    // Update global planner year if year changed
    if (yearChanged) {
        state.plannerYear = nextSlot.year;
        // Update year tabs visual state
        document.querySelectorAll('.year-tab').forEach(tab => {
            if (tab.dataset.year === nextSlot.year) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
        
        // Only trigger animation if not already triggered by navigatePickerWithAnimation
        if (!skipAnimation) {
            console.log('🎬 navigatePicker triggering animation');
            animateYearTransition(direction === 'prev' ? -1 : 1);
        } else {
            console.log('⏭️ navigatePicker SKIPPING animation (already triggered)');
        }
    }
    
    // Fade title transition
    const title = document.getElementById('picker-title');
    if (title) {
        title.classList.add('fading');
        setTimeout(() => {
            updatePickerTitle(t.currentPickerSlot.month, t.currentPickerSlot.half);
            title.classList.remove('fading');
        }, 150); // Half of the 300ms transition
    }
    
    renderPickerCarousel(t);
}

export function navigatePickerWithAnimation(t, direction) {
    console.log('🟢 navigatePickerWithAnimation called:', { direction });
    
    const carousel = document.getElementById('picker-carousel');
    if (!carousel) return;
    
    // Check if year will change BEFORE navigation
    const nextSlot = getAdjacentSlot(t, direction);
    const willChangeYear = nextSlot && t.currentPickerSlot && nextSlot.year !== t.currentPickerSlot.year;
    
    console.log('🔍 Pre-check:', { 
        currentYear: t.currentPickerSlot?.year, 
        nextYear: nextSlot?.year, 
        willChangeYear 
    });
    
    // Start pagination animation immediately if year will change
    if (willChangeYear) {
        console.log('🎬 navigatePickerWithAnimation triggering animation EARLY');
        animateYearTransition(direction);
    }
    
    // Sync toggle state to avoid visual mismatch during slide
    updateAllPickerToggleButtons(t);
    carousel.style.transition = 'none';
    carousel.style.transform = 'translate3d(-33.333%, 0, 0)';
    requestAnimationFrame(() => {
        carousel.style.transition = 'transform 260ms cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        const delta = direction < 0 ? '0%' : '-66.666%';
        carousel.style.transform = `translate3d(${delta}, 0, 0)`;
        setTimeout(() => {
            carousel.classList.add('no-transition');
            carousel.style.transition = 'none';
            carousel.style.transform = 'translate3d(-33.333%, 0, 0)';
            requestAnimationFrame(() => {
                console.log('🔄 Calling navigatePicker with skipAnimation =', willChangeYear);
                // Pass skipAnimation=true since we already triggered it above
                navigatePicker(t, direction < 0 ? 'prev' : 'next', willChangeYear);
                requestAnimationFrame(() => carousel.classList.remove('no-transition'));
            });
        }, 270);
    });
}

export function getAdjacentSlot(t, step) {
    if (!t.currentPickerSlot) return null;
    const { year, month, half } = t.currentPickerSlot;
    const months = state.monthOrder;
    const halves = state.halfOrder;
    const mIndex = months.indexOf(month);
    const hIndex = halves.indexOf(half);
    const linearIndex = mIndex * 2 + hIndex + step;
    
    // Handle year transitions
    const years = ['junior', 'classics', 'senior'];
    const currentYearIndex = years.indexOf(year);
    
    // Going past end of year - transition to next year
    if (linearIndex >= months.length * halves.length) {
        const nextYearIndex = currentYearIndex + 1;
        if (nextYearIndex >= years.length) return t.currentPickerSlot; // At senior end
        return { year: years[nextYearIndex], month: months[0], half: halves[0] };
    }
    
    // Going before start of year - transition to previous year
    if (linearIndex < 0) {
        const prevYearIndex = currentYearIndex - 1;
        if (prevYearIndex < 0) return t.currentPickerSlot; // At junior start
        return { year: years[prevYearIndex], month: months[months.length - 1], half: halves[halves.length - 1] };
    }
    
    const newM = months[Math.floor(linearIndex / 2)];
    const newH = halves[linearIndex % 2];
    return { year: year, month: newM, half: newH };
}

export function renderPickerCarousel(t) {
    if (!t.currentPickerSlot) return;
    const { year, month, half } = t.currentPickerSlot;
    renderPickerCard(t, 'current', { year, month, half });
    renderPickerCard(t, 'prev', getAdjacentSlot(t, -1));
    renderPickerCard(t, 'next', getAdjacentSlot(t, 1));
    updateAllPickerToggleButtons(t);
    attachPickerSwipeHandlers(t);
    positionPickerNavs(t);
    updatePaginationDots(t);
}

export function updatePickerToggleCloseButton(t) {
    const btn = document.getElementById('toggle-close-btn');
    if (btn) {
        if (t.closeOnSelection) btn.classList.add('active'); else btn.classList.remove('active');
    }
}

// Apply the auto-close visual state to the toggle button
export function updateAllPickerToggleButtons(t) {
    updatePickerToggleCloseButton(t);
}

export function renderPickerCard(t, position, slot) {
    const suffix = position === 'current' ? '' : `-${position}`;
    const listEl = document.getElementById(`picker-list${suffix}`);
    if (!listEl || !slot) return;
    const { year, month, half } = slot;
    const tmap = state.translations;

    const available = state.races.filter(r => r.month === month && r.half === half && r[year || state.plannerYear]);
    const trackedIds = getTrackedFactorRaceIds(state, loadHiddenFactors());
    const yearToUse = year || state.plannerYear;
    const cellValue = state.plannerData[yearToUse][cellKey(month, half)];
    listEl.innerHTML = available.map(r => {
        const selected = String(cellValue) === String(r.id);
        const tracked = trackedIds.has(String(r.id));
        // Only highlight filtered races when filters are actually active (not "All Races")
        const filtered = state.currentFilters.size > 0 && raceMatchesFilters(r, state.currentFilters);
        const imageUrl = r.image || '';
        return `
            <div class="picker-item ${selected ? 'selected' : ''} ${tracked ? 'picker-item-tracked' : ''} ${filtered ? 'picker-item-filtered' : ''}" data-race-id="${r.id}">
                ${imageUrl ? `<img src="${imageUrl}" alt="${(r.name || '').replace(/"/g, '&quot;')}">` : ''}
                <div class="picker-item-content">
                    <div class="picker-item-header">
                        <div class="race-name">
                            <div class="race-name-en">${r.name}</div>
                            <div class="race-name-jp">${r.nameJP}</div>
                            <span class="race-grade grade-${r.type}">${r.type}</span>
                        </div>
                    </div>
                    <div class="picker-item-info">
                        <div class="race-details">
                            ${r.length} • ${r.surface}/${tmap.surfaces[r.surface] || r.surface}
                        </div>
                        <div class="race-details">
                            ${r.racetrack}/${tmap.tracks[r.racetrack] || r.racetrack}
                            • ${tmap.months[r.month] || r.month} ${tmap.halves[r.half] || r.half} / ${r.month} ${r.half}
                            ${r.direction ? `• ${tmap.directions[r.direction]} / ${r.direction}` : ''}
                            ${(() => {
                                const years = [];
                                if (r.junior) years.push('Junior');
                                if (r.classics) years.push('Classic');
                                if (r.senior) years.push('Senior');
                                return years.length ? ` • ${years.join(' • ')}` : '';
                            })()}
                        </div>
                        ${r.series ? `<div class="race-details">${r.series}</div>` : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');

    if (position === 'current') {
        listEl.onclick = (e) => {
            const item = e.target.closest('.picker-item');
            if (!item) return;
            const raceId = item.getAttribute('data-race-id');
            if (!raceId) return;
            const r = state.raceById.get(String(raceId));
            if (r) {
                planRaceIntoPlanner(r, state.plannerYear);
                state.selectedRaces.add(String(raceId));
                state.wonRaces.add(String(raceId));
            }
            t.renderPlannerGrid();
            t.renderRaces();
            t.updateProgress();
            if (t.closeOnSelection) closePicker(t); else renderPickerCarousel(t);
        };
    }
}

export function toggleCloseOnSelection(t) {
    t.closeOnSelection = !t.closeOnSelection;
    updateAllPickerToggleButtons(t);
}

export function positionPickerNavs(t) {
    const panel = document.getElementById('picker-panel');
    const leftBtn = document.querySelector('.picker-nav-left');
    const rightBtn = document.querySelector('.picker-nav-right');
    if (!panel || !leftBtn || !rightBtn) return;
    const rect = panel.getBoundingClientRect();
    const gutter = 12;
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
    const leftX = Math.max(8, rect.left - leftBtn.offsetWidth - gutter);
    const rightX = Math.min(viewportWidth - rightBtn.offsetWidth - 8, rect.right + gutter);
    const centerY = rect.top + rect.height / 2 - (leftBtn.offsetHeight / 2);
    [leftBtn, rightBtn].forEach(btn => { btn.style.position = 'fixed'; btn.style.top = `${centerY}px`; });
    leftBtn.style.left = `${leftX}px`;
    rightBtn.style.left = `${rightX}px`;
}

export function attachPickerSwipeHandlers(t) {
    const panel = document.getElementById('picker-panel');
    const carousel = document.getElementById('picker-carousel');
    if (!panel || !carousel) return;
    let startX = 0; let startY = 0; let dragging = false; let moved = false;
    const onStart = (x, y) => { startX = x; startY = y; dragging = true; moved = false; carousel.style.transition = 'none'; updateAllPickerToggleButtons(t); };
    const onMove = (x, y) => {
        if (!dragging) return;
        const dx = x - startX; const dy = y - startY;
        if (!moved && Math.abs(dx) < 10 && Math.abs(dy) < 10) return;
        if (Math.abs(dx) > Math.abs(dy) * 1.2) {
            moved = true;
            const percent = (-33.333) + (dx / panel.offsetWidth) * 33.333;
            carousel.style.transform = `translate3d(${percent}%, 0, 0)`;
        }
    };
    const onEnd = (x) => {
        if (!dragging) return;
        dragging = false;
        const dx = x - startX;
        carousel.style.transition = 'transform 200ms ease';
        if (moved && Math.abs(dx) > panel.offsetWidth * 0.15) {
            const direction = dx > 0 ? -1 : 1;
            const target = direction < 0 ? '0%' : '-66.666%';
            carousel.style.transform = `translate3d(${target}, 0, 0)`;
            setTimeout(() => {
                carousel.classList.add('no-transition');
                carousel.style.transition = 'none';
                carousel.style.transform = 'translate3d(-33.333%, 0, 0)';
                requestAnimationFrame(() => {
                    navigatePicker(t, direction < 0 ? 'prev' : 'next');
                    requestAnimationFrame(() => carousel.classList.remove('no-transition'));
                });
            }, 210);
        } else {
            carousel.style.transform = 'translate3d(-33.333%, 0, 0)';
        }
    };
    // Touch
    panel.ontouchstart = (e) => onStart(e.touches[0].clientX, e.touches[0].clientY);
    panel.ontouchmove = (e) => onMove(e.touches[0].clientX, e.touches[0].clientY);
    panel.ontouchend = (e) => onEnd((e.changedTouches && e.changedTouches[0] ? e.changedTouches[0].clientX : startX));
    // Mouse
    panel.onmousedown = (e) => onStart(e.clientX, e.clientY);
    panel.onmousemove = (e) => onMove(e.clientX, e.clientY);
    panel.onmouseup = (e) => onEnd(e.clientX);
    panel.onmouseleave = (e) => { if (dragging) onEnd(e.clientX || startX); };
}

export function updatePaginationDots(t) {
    console.log('📍 updatePaginationDots called');
    
    const paginationEl = document.getElementById('picker-pagination');
    if (!paginationEl || !t.currentPickerSlot) return;

    const months = state.monthOrder;
    const halves = state.halfOrder;
    const totalSlots = months.length * halves.length;

    const { year, month, half } = t.currentPickerSlot;
    const currentIndex = months.indexOf(month) * halves.length + halves.indexOf(half);
    
    console.log('📍 Updating dots for:', { year, month, half, currentIndex });

    // Year color mapping - pastel colors
    const yearColors = {
        junior: '#B8E6D5',    // Pastel mint green
        classics: '#FFD4E5',   // Pastel pink
        senior: '#D4E5FF'      // Pastel blue
    };
    
    const yearLabels = {
        junior: { en: 'Junior', jp: 'ジュニア' },
        classics: { en: 'Classic', jp: 'クラシック' },
        senior: { en: 'Senior', jp: 'シニア' }
    };

    // Check if animation is currently running
    const hasForwardAnim = paginationEl.classList.contains('year-transition-forward');
    const hasBackwardAnim = paginationEl.classList.contains('year-transition-backward');
    console.log('💾 Animation state check:', { hasForwardAnim, hasBackwardAnim });

    // Generate year indicator and dots
    const yearColor = yearColors[year] || '#cbd5e0';
    const yearLabel = yearLabels[year] || { en: '', jp: '' };
    
    // Get existing wrapper and indicator to update them instead of replacing
    let yearIndicator = paginationEl.querySelector('.pagination-year-indicator');
    let dotsWrapper = paginationEl.querySelector('.pagination-dots-wrapper');
    
    // Update year indicator
    if (yearIndicator) {
        console.log('🔄 Updating existing year indicator');
        yearIndicator.style.background = yearColor;
        yearIndicator.querySelector('.year-indicator-en').textContent = yearLabel.en;
        yearIndicator.querySelector('.year-indicator-jp').textContent = yearLabel.jp;
    } else {
        console.log('➕ Creating new year indicator');
        yearIndicator = document.createElement('div');
        yearIndicator.className = 'pagination-year-indicator';
        yearIndicator.style.background = yearColor;
        yearIndicator.innerHTML = `
            <span class="year-indicator-en">${yearLabel.en}</span>
            <span class="year-indicator-jp">${yearLabel.jp}</span>
        `;
        paginationEl.insertBefore(yearIndicator, paginationEl.firstChild);
    }
    
    // Update dots wrapper
    if (dotsWrapper) {
        console.log('🔄 Updating existing dots wrapper');
        dotsWrapper.innerHTML = Array.from({ length: totalSlots }, (_, i) => {
            const isActive = i === currentIndex;
            const monthIdx = Math.floor(i / halves.length);
            const halfIdx = i % halves.length;
            const targetMonth = months[monthIdx];
            const targetHalf = halves[halfIdx];
            return `<div class="pagination-dot ${isActive ? 'active' : ''}" 
                         data-index="${i}" 
                         data-month="${targetMonth}" 
                         data-half="${targetHalf}"
                         style="background: ${isActive ? yearColor : '#cbd5e0'};"
                         title="${state.translations.months[targetMonth] || targetMonth} ${state.translations.halves[targetHalf] || targetHalf}">
                    </div>`;
        }).join('');
    } else {
        console.log('➕ Creating new dots wrapper');
        dotsWrapper = document.createElement('div');
        dotsWrapper.className = 'pagination-dots-wrapper';
        dotsWrapper.innerHTML = Array.from({ length: totalSlots }, (_, i) => {
            const isActive = i === currentIndex;
            const monthIdx = Math.floor(i / halves.length);
            const halfIdx = i % halves.length;
            const targetMonth = months[monthIdx];
            const targetHalf = halves[halfIdx];
            return `<div class="pagination-dot ${isActive ? 'active' : ''}" 
                         data-index="${i}" 
                         data-month="${targetMonth}" 
                         data-half="${targetHalf}"
                         style="background: ${isActive ? yearColor : '#cbd5e0'};"
                         title="${state.translations.months[targetMonth] || targetMonth} ${state.translations.halves[targetHalf] || targetHalf}">
                    </div>`;
        }).join('');
        paginationEl.appendChild(dotsWrapper);
    }

    // Attach click handlers to dots
    const dots = paginationEl.querySelectorAll('.pagination-dot');
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const targetMonth = dot.getAttribute('data-month');
            const targetHalf = dot.getAttribute('data-half');
            if (targetMonth && targetHalf) {
                animateToSlot(t, year, targetMonth, targetHalf, currentIndex, parseInt(dot.getAttribute('data-index')));
            }
        });
    });
}

// Animation for year transition
export function animateYearTransition(direction) {
    console.log('🎬 animateYearTransition called:', { direction });
    
    const paginationEl = document.getElementById('picker-pagination');
    if (!paginationEl) {
        console.log('❌ No pagination element found');
        return;
    }
    
    const animClass = direction > 0 ? 'year-transition-forward' : 'year-transition-backward';
    console.log('➕ Adding animation class:', animClass);
    
    // Add animation class based on direction
    paginationEl.classList.add(animClass);
    
    // Remove animation class after animation completes (550ms to match card timing better)
    setTimeout(() => {
        console.log('➖ Removing animation classes');
        paginationEl.classList.remove('year-transition-forward', 'year-transition-backward');
    }, 550);
}

export function animateToSlot(t, year, targetMonth, targetHalf, currentIndex, targetIndex) {
    if (currentIndex === targetIndex) return;

    const direction = targetIndex > currentIndex ? 1 : -1;

    // Update current slot
    t.currentPickerSlot = { year: year, month: targetMonth, half: targetHalf };
    
    // Fade title transition
    const title = document.getElementById('picker-title');
    if (title) {
        title.classList.add('fading');
        setTimeout(() => {
            updatePickerTitle(targetMonth, targetHalf);
            title.classList.remove('fading');
        }, 150);
    }
    
    // Animate carousel transition
    const carousel = document.getElementById('picker-carousel');
    if (!carousel) {
        renderPickerCarousel(t);
        return;
    }

    // Use the same animation as navigation
    carousel.style.transition = 'none';
    carousel.style.transform = 'translate3d(-33.333%, 0, 0)';
    requestAnimationFrame(() => {
        carousel.style.transition = 'transform 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        const delta = direction > 0 ? '-66.666%' : '0%';
        carousel.style.transform = `translate3d(${delta}, 0, 0)`;
        setTimeout(() => {
            carousel.classList.add('no-transition');
            carousel.style.transition = 'none';
            carousel.style.transform = 'translate3d(-33.333%, 0, 0)';
            requestAnimationFrame(() => {
                renderPickerCarousel(t);
                requestAnimationFrame(() => carousel.classList.remove('no-transition'));
            });
        }, 310);
    });
}


