// js/ui/overview-modal.js
// Compact overview modal emulating the in-game 3-year race planner view

import { state } from '../core/state.js';
import { cellKey } from './planner-renderer.js';

const enShort = {
    January: 'Jan', February: 'Feb', March: 'Mar', April: 'Apr',
    May: 'May', June: 'Jun', July: 'Jul', August: 'Aug',
    September: 'Sep', October: 'Oct', November: 'Nov', December: 'Dec'
};

const halfLabel = { '1st': 'Early', '2nd': 'Late' };

const yearConfig = {
    junior:   { en: 'Junior Year',  jp: 'ジュニア級', startMonth: 6 },
    classics: { en: 'Classic Year', jp: 'クラシック級', startMonth: 0 },
    senior:   { en: 'Senior Year',  jp: 'シニア級', startMonth: 0 }
};

const fullMonthOrder = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

function buildCell(yearKey, month, half) {
    const key = cellKey(month, half);
    const yearCells = state.plannerData[yearKey] || {};
    const raw = yearCells[key];
    const selectedId = (typeof raw === 'string' && raw) ? String(raw) : null;
    const isSummer = month === 'July' || month === 'August';
    const period = `${halfLabel[half]} ${enShort[month]}`;

    let inner = '';
    if (selectedId) {
        const r = state.raceById ? state.raceById.get(selectedId) : null;
        const imgSrc = r && r.image ? r.image : '';
        const name = r ? r.name : '';
        const isWon = state.wonRaces.has(selectedId);
        const isLost = state.lostRaces.has(selectedId);
        const cls = isLost ? 'ov-lost' : (isWon ? 'ov-won' : '');
        const badge = isLost ? '<span class="ov-badge ov-badge-lost">👎</span>'
                    : (isWon ? '<span class="ov-badge ov-badge-won">🏆</span>' : '');

        inner = `<div class="ov-inner ${cls}">
            ${imgSrc ? `<img class="ov-img" src="${imgSrc}" alt="" loading="lazy">` : '<div class="ov-img ov-img-ph"></div>'}
            <div class="ov-name" title="${name}">${name}</div>
            ${badge}
        </div>`;
    } else {
        inner = '<div class="ov-inner ov-empty"><span class="ov-plus">+</span></div>';
    }

    return `<div class="ov-cell ${isSummer ? 'ov-summer' : ''} ov-y-${yearKey}">
        ${inner}
        <div class="ov-period">${period}</div>
    </div>`;
}

function buildYearColumn(yearKey) {
    const cfg = yearConfig[yearKey];
    const months = fullMonthOrder.slice(cfg.startMonth);

    let cells = '';
    for (const month of months) {
        cells += buildCell(yearKey, month, '1st');
        cells += buildCell(yearKey, month, '2nd');
    }

    return `<div class="ov-col ov-col-${yearKey}">
        <div class="ov-hdr ov-hdr-${yearKey}">${cfg.en}<br><span class="ov-hdr-jp">${cfg.jp}</span></div>
        <div class="ov-grid">${cells}</div>
    </div>`;
}

export function openOverviewModal() {
    let modal = document.getElementById('overview-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'overview-modal';
        modal.className = 'storage-modal hidden';
        modal.innerHTML = `
            <div class="storage-backdrop" onclick="window.closeOverviewModal()"></div>
            <div class="ov-panel">
                <div class="ov-title-bar">
                    <h3>📋 Overview <span class="ov-title-jp">レース計画一覧</span></h3>
                    <button class="close-btn" onclick="window.closeOverviewModal()">×</button>
                </div>
                <div class="ov-scroll" id="overview-modal-content"></div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    const content = document.getElementById('overview-modal-content');
    content.innerHTML = `<div class="ov-wrap">
        ${buildYearColumn('junior')}
        ${buildYearColumn('classics')}
        ${buildYearColumn('senior')}
    </div>`;
    modal.classList.remove('hidden');
}

export function closeOverviewModal() {
    const modal = document.getElementById('overview-modal');
    if (modal) modal.classList.add('hidden');
}

export function setupOverviewCallbacks() {
    window.closeOverviewModal = closeOverviewModal;
}
