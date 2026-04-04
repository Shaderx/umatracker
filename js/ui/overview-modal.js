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

const REFERENCE_WIDTH = 1044;

let exportOrientation = 'landscape';
let resizeHandler = null;

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

function buildSpacerCell() {
    return '<div class="ov-cell ov-cell-spacer"><div class="ov-inner ov-empty"></div><div class="ov-period"></div></div>';
}

function buildYearColumn(yearKey) {
    const cfg = yearConfig[yearKey];
    const months = fullMonthOrder.slice(cfg.startMonth);
    const spacerCount = cfg.startMonth * 2;

    let cells = '';
    for (let i = 0; i < spacerCount; i++) {
        cells += buildSpacerCell();
    }
    for (const month of months) {
        cells += buildCell(yearKey, month, '1st');
        cells += buildCell(yearKey, month, '2nd');
    }

    return `<div class="ov-col ov-col-${yearKey}">
        <div class="ov-hdr ov-hdr-${yearKey}">${cfg.en}<br><span class="ov-hdr-jp">${cfg.jp}</span></div>
        <div class="ov-grid">${cells}</div>
    </div>`;
}

function updateOrientationButtons() {
    const lBtn = document.getElementById('ov-orient-landscape');
    const pBtn = document.getElementById('ov-orient-portrait');
    if (!lBtn || !pBtn) return;
    lBtn.classList.toggle('ov-orient-active', exportOrientation === 'landscape');
    pBtn.classList.toggle('ov-orient-active', exportOrientation === 'portrait');
}

function updateOverviewZoom() {
    const scroll = document.getElementById('overview-modal-content');
    const wrap = scroll?.querySelector('.ov-wrap');
    if (!scroll || !wrap) return;

    if (window.innerWidth <= 700) {
        wrap.style.zoom = '';
        wrap.style.width = '';
        return;
    }

    wrap.style.zoom = '';
    wrap.style.width = REFERENCE_WIDTH + 'px';

    const cs = getComputedStyle(scroll);
    const padL = parseFloat(cs.paddingLeft) || 0;
    const padR = parseFloat(cs.paddingRight) || 0;
    const available = scroll.clientWidth - padL - padR;
    const zoom = Math.max(0.3, available / REFERENCE_WIDTH);
    wrap.style.zoom = zoom;
}

function setMargin(pct) {
    const panel = document.querySelector('.ov-panel');
    if (!panel) return;
    panel.style.setProperty('--ov-side-pct', pct);
    document.querySelectorAll('.ov-margin-btn').forEach(btn => {
        btn.classList.toggle('ov-margin-active', btn.dataset.margin === String(pct));
    });
    requestAnimationFrame(() => updateOverviewZoom());
}

async function exportOverviewAsImage() {
    if (typeof html2canvas === 'undefined') {
        alert('Image export library is still loading. Please try again.');
        return;
    }

    const exportBtn = document.getElementById('ov-export-btn');
    if (exportBtn) {
        exportBtn.disabled = true;
        exportBtn.textContent = '⏳ Exporting…';
    }

    try {
        const isPortrait = exportOrientation === 'portrait';
        const targetWidth = isPortrait ? 540 : 960;

        const container = document.createElement('div');
        container.className = 'ov-export-container';
        container.style.cssText = `
            position: fixed; left: -9999px; top: 0; z-index: -1;
            width: ${targetWidth}px;
            background: #fff;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        `;

        const header = document.createElement('div');
        header.className = 'ov-export-header';
        header.innerHTML = '<div class="ov-export-header-text">Race overview created from https://uma.pwnation.net/</div>';
        container.appendChild(header);

        const wrap = document.createElement('div');
        wrap.className = 'ov-wrap';
        if (isPortrait) wrap.classList.add('ov-wrap-portrait');
        wrap.innerHTML =
            buildYearColumn('junior') +
            buildYearColumn('classics') +
            buildYearColumn('senior');
        container.appendChild(wrap);

        document.body.appendChild(container);

        const images = container.querySelectorAll('img.ov-img');
        if (images.length > 0) {
            await Promise.all(Array.from(images).map(img => {
                if (img.complete) return Promise.resolve();
                return new Promise(resolve => {
                    img.onload = resolve;
                    img.onerror = resolve;
                });
            }));
        }

        const canvas = await html2canvas(container, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            logging: false
        });

        document.body.removeChild(container);

        const link = document.createElement('a');
        link.download = `race-overview-${exportOrientation}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    } catch (err) {
        console.error('Overview export failed:', err);
        alert('Export failed. Please try again.');
    } finally {
        if (exportBtn) {
            exportBtn.disabled = false;
            exportBtn.textContent = '📷 Export';
        }
    }
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
                    <div class="ov-export-controls">
                        <div class="ov-margin-control">
                            <span class="ov-margin-label">Margin</span>
                            <button class="ov-margin-btn" data-margin="5">5%</button>
                            <button class="ov-margin-btn ov-margin-active" data-margin="10">10%</button>
                            <button class="ov-margin-btn" data-margin="20">20%</button>
                            <button class="ov-margin-btn" data-margin="40">40%</button>
                        </div>
                        <div class="ov-orient-toggle">
                            <button id="ov-orient-landscape" class="ov-orient-btn ov-orient-active" title="Landscape">▬</button>
                            <button id="ov-orient-portrait" class="ov-orient-btn" title="Portrait">▮</button>
                        </div>
                        <button id="ov-export-btn" class="ov-export-btn">📷 Export</button>
                        <button class="close-btn" onclick="window.closeOverviewModal()">×</button>
                    </div>
                </div>
                <div class="ov-scroll" id="overview-modal-content"></div>
            </div>
        `;
        document.body.appendChild(modal);

        document.getElementById('ov-orient-landscape').addEventListener('click', () => {
            exportOrientation = 'landscape';
            updateOrientationButtons();
        });
        document.getElementById('ov-orient-portrait').addEventListener('click', () => {
            exportOrientation = 'portrait';
            updateOrientationButtons();
        });
        document.getElementById('ov-export-btn').addEventListener('click', () => {
            exportOverviewAsImage();
        });
        document.querySelectorAll('.ov-margin-btn').forEach(btn => {
            btn.addEventListener('click', () => setMargin(btn.dataset.margin));
        });
    }

    const content = document.getElementById('overview-modal-content');
    content.innerHTML = `<div class="ov-wrap">
        ${buildYearColumn('junior')}
        ${buildYearColumn('classics')}
        ${buildYearColumn('senior')}
    </div>`;
    modal.classList.remove('hidden');

    requestAnimationFrame(() => updateOverviewZoom());

    if (!resizeHandler) {
        resizeHandler = () => updateOverviewZoom();
        window.addEventListener('resize', resizeHandler);
    }
}

export function closeOverviewModal() {
    const modal = document.getElementById('overview-modal');
    if (modal) modal.classList.add('hidden');
    if (resizeHandler) {
        window.removeEventListener('resize', resizeHandler);
        resizeHandler = null;
    }
}

export function setupOverviewCallbacks() {
    window.closeOverviewModal = closeOverviewModal;
}
