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
    const title = document.getElementById('picker-title');
    if (title) {
        const yearMap = { junior: 'ジュニア級', classics: 'クラシック級', senior: 'シニア級' };
        const jpYear = yearMap[state.plannerYear] || '';
        const m = state.translations.months[month] || month;
        const h = state.translations.halves[half] || half;
        title.textContent = `${jpYear} • ${m} ${h}`;
    }
    renderPickerCarousel(t);
    const modal = document.getElementById('picker-modal');
    if (modal) modal.classList.remove('hidden');
    positionPickerNavs(t);
    const plannerSection = document.getElementById('planner-section');
    lockBodyScroll(plannerSection);
}

export function closePicker(t) {
    const modal = document.getElementById('picker-modal');
    if (modal) modal.classList.add('hidden');
    t.currentPickerSlot = null;
    const plannerSection = document.getElementById('planner-section');
    unlockBodyScroll(plannerSection);
}

export function navigatePicker(t, direction) {
    t.currentPickerSlot = getAdjacentSlot(t, direction === 'prev' ? -1 : 1) || t.currentPickerSlot;
    renderPickerCarousel(t);
}

export function navigatePickerWithAnimation(t, direction) {
    const carousel = document.getElementById('picker-carousel');
    if (!carousel) return;
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
                navigatePicker(t, direction < 0 ? 'prev' : 'next');
                requestAnimationFrame(() => carousel.classList.remove('no-transition'));
            });
        }, 270);
    });
}

export function getAdjacentSlot(t, step) {
    if (!t.currentPickerSlot) return null;
    const { month, half } = t.currentPickerSlot;
    const months = state.monthOrder;
    const halves = state.halfOrder;
    const mIndex = months.indexOf(month);
    const hIndex = halves.indexOf(half);
    const linearIndex = mIndex * 2 + hIndex + step;
    if (linearIndex < 0 || linearIndex >= months.length * halves.length) return t.currentPickerSlot;
    const newM = months[Math.floor(linearIndex / 2)];
    const newH = halves[linearIndex % 2];
    return { year: state.plannerYear, month: newM, half: newH };
}

export function renderPickerCarousel(t) {
    if (!t.currentPickerSlot) return;
    const { month, half } = t.currentPickerSlot;
    renderPickerCard(t, 'current', { month, half });
    renderPickerCard(t, 'prev', getAdjacentSlot(t, -1));
    renderPickerCard(t, 'next', getAdjacentSlot(t, 1));
    updateAllPickerToggleButtons(t);
    attachPickerSwipeHandlers(t);
    positionPickerNavs(t);
}

export function updatePickerToggleCloseButton(t) {
    const btn = document.getElementById('toggle-close-btn');
    if (btn) {
        if (t.closeOnSelection) btn.classList.add('active'); else btn.classList.remove('active');
    }
}

// Apply the auto-close visual state to all carousel cards (prev/current/next)
export function updateAllPickerToggleButtons(t) {
    const buttons = document.querySelectorAll('.picker-card .toggle-close-on-selection');
    buttons.forEach((btn) => {
        if (t.closeOnSelection) btn.classList.add('active'); else btn.classList.remove('active');
    });
}

export function renderPickerCard(t, position, slot) {
    const suffix = position === 'current' ? '' : `-${position}`;
    const listEl = document.getElementById(`picker-list${suffix}`);
    const titleEl = document.getElementById(`picker-title${suffix}`);
    if (!listEl || !slot) return;
    const { month, half } = slot;
    const tmap = state.translations;
    const monthLabel = tmap.months[month] || month;
    const halfLabel = tmap.halves[half] || half;
    if (titleEl) titleEl.textContent = `${monthLabel} ${halfLabel}`;

    const available = state.races.filter(r => r.month === month && r.half === half && r[state.plannerYear]);
    const trackedIds = getTrackedFactorRaceIds(state, loadHiddenFactors());
    const cellValue = state.plannerData[state.plannerYear][cellKey(month, half)];
    listEl.innerHTML = available.map(r => {
        const selected = String(cellValue) === String(r.id);
        const tracked = trackedIds.has(String(r.id));
        // Only highlight filtered races when filters are actually active (not "All Races")
        const filtered = state.currentFilters.size > 0 && raceMatchesFilters(r, state.currentFilters);
        const imageUrl = r.image || '';
        return `
            <div class="picker-item ${selected ? 'selected' : ''} ${tracked ? 'picker-item-tracked' : ''} ${filtered ? 'picker-item-filtered' : ''}" data-race-id="${r.id}">
                ${imageUrl ? `<img src="${imageUrl}" alt="${(r.name || '').replace(/"/g, '&quot;')}">` : ''}
                <div>
                    <h4>${r.name}</h4>
                    <div class="sub">${r.length} • ${r.surface} • ${r.racetrack}</div>
                    <div class="sub">${(tmap.tracks[r.racetrack] || r.racetrack)} • ${(tmap.months[r.month] || r.month)} ${(tmap.halves[r.half] || r.half)} ${(r.direction ? `• ${(tmap.directions[r.direction] || r.direction)}` : '')}</div>
                    <div class="sub">${r.type}${r.series ? ` • ${r.series}` : ''}${r.junior ? ' • Junior' : ''}${r.classics ? ' • Classic' : ''}${r.senior ? ' • Senior' : ''}</div>
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


