// js/ui/overview-modal.js
// Compact overview modal showing all 3 years of the race planner

import { state } from '../core/state.js';
import { cellKey } from './planner-renderer.js';

const enShort = {
    January: 'Jan', February: 'Feb', March: 'Mar', April: 'Apr',
    May: 'May', June: 'Jun', July: 'Jul', August: 'Aug',
    September: 'Sep', October: 'Oct', November: 'Nov', December: 'Dec'
};

const yearLabels = {
    junior: { en: 'Junior', jp: 'ジュニア級' },
    classics: { en: 'Classic', jp: 'クラシック級' },
    senior: { en: 'Senior', jp: 'シニア級' }
};

/**
 * Build compact HTML for one planner year
 */
function buildYearOverview(yearKey) {
    const yearCells = state.plannerData[yearKey] || {};
    const t = state.translations;
    const label = yearLabels[yearKey];

    let slotsHtml = '';
    state.monthOrder.forEach(month => {
        state.halfOrder.forEach(half => {
            const key = cellKey(month, half);
            const raw = yearCells[key];
            const selectedId = (typeof raw === 'string' && raw) ? String(raw) : null;
            const isSummer = month === 'July' || month === 'August';

            let bodyHtml = '';
            if (selectedId) {
                const r = state.raceById ? state.raceById.get(selectedId) : null;
                const imgSrc = r && r.image ? r.image : '';
                const name = r ? r.name : '';
                const nameJP = r && r.nameJP ? r.nameJP : '';
                const isWon = state.wonRaces.has(selectedId);
                const isLost = state.lostRaces.has(selectedId);
                const statusIcon = isLost ? '👎' : (isWon ? '🏆' : '');
                const statusClass = isLost ? 'overview-lost' : (isWon ? 'overview-won' : '');

                bodyHtml = `
                    <div class="overview-race ${statusClass}">
                        ${imgSrc ? `<img class="overview-race-img" src="${imgSrc}" alt="" loading="lazy">` : ''}
                        <div class="overview-race-info">
                            <div class="overview-race-name">${name}</div>
                            <div class="overview-race-name-jp">${nameJP}</div>
                        </div>
                        ${statusIcon ? `<span class="overview-status">${statusIcon}</span>` : ''}
                    </div>
                `;
            } else {
                bodyHtml = `<div class="overview-empty">—</div>`;
            }

            const monthJP = t.months?.[month] || month;
            const halfJP = t.halves?.[half] || half;

            slotsHtml += `
                <div class="overview-slot ${isSummer ? 'summer' : ''} year-${yearKey}">
                    <div class="overview-slot-head">${enShort[month]} ${half} / ${monthJP} ${halfJP}</div>
                    <div class="overview-slot-body">${bodyHtml}</div>
                </div>
            `;
        });
    });

    return `
        <div class="overview-year">
            <div class="overview-year-title year-${yearKey}">${label.jp} / ${label.en}</div>
            <div class="overview-year-grid">${slotsHtml}</div>
        </div>
    `;
}

export function openOverviewModal() {
    let modal = document.getElementById('overview-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'overview-modal';
        modal.className = 'storage-modal hidden';
        modal.innerHTML = `
            <div class="storage-backdrop" onclick="window.closeOverviewModal()"></div>
            <div class="storage-panel overview-panel">
                <div class="storage-header">
                    <h3>📋 Race Plan Overview / レース計画一覧</h3>
                    <button class="close-btn" onclick="window.closeOverviewModal()">×</button>
                </div>
                <div class="storage-body overview-body" id="overview-modal-content"></div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    const content = document.getElementById('overview-modal-content');
    content.innerHTML = ['junior', 'classics', 'senior'].map(buildYearOverview).join('');
    modal.classList.remove('hidden');
}

export function closeOverviewModal() {
    const modal = document.getElementById('overview-modal');
    if (modal) modal.classList.add('hidden');
}

export function setupOverviewCallbacks() {
    window.closeOverviewModal = closeOverviewModal;
}
