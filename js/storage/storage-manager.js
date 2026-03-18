// js/storage/storage-manager.js
import { serializeState } from './url-sharing.js';
import { getCurrentDb } from '../data/race-data.js';

function slotKey(n) {
    return `umatracker_slot_${getCurrentDb()}_${n}`;
}

/**
 * Migrate old DB-agnostic saves (umatracker_slot_1..6) to JP-prefixed keys.
 * Runs once; safe to call multiple times.
 */
export function migrateLegacySaves() {
    for (let n = 1; n <= 6; n++) {
        const oldKey = `umatracker_slot_${n}`;
        const data = localStorage.getItem(oldKey);
        if (!data) continue;
        const jpKey = `umatracker_slot_jp_${n}`;
        if (!localStorage.getItem(jpKey)) {
            try {
                const obj = JSON.parse(data);
                obj.db = 'jp';
                localStorage.setItem(jpKey, JSON.stringify(obj));
            } catch {
                localStorage.setItem(jpKey, data);
            }
        }
        localStorage.removeItem(oldKey);
    }
}

export function renderSaveSlotsUI(grid, onRename, onSaved) {
    if (!grid) return;
    const slots = Array.from({ length: 6 }, (_, i) => i + 1);
    grid.innerHTML = slots.map(n => {
        const key = slotKey(n);
        const data = localStorage.getItem(key);
        let name = '';
        if (data) { try { const obj = JSON.parse(data); name = obj.name || ''; } catch {} }
        return `<div class="save-slot-card ${data ? 'filled' : 'empty'}" data-slot="${n}">
            <div class="slot-header"><div class="slot-number">Slot ${n}</div><div class="slot-actions"><button class="btn-rename-slot" data-slot="${n}">✏️</button><button class="btn-delete-slot" data-slot="${n}">🗑️</button></div></div>
            <div class="slot-body">${data ? `<div class=\"slot-info\"><div class=\"slot-name\">${name || 'Unnamed'}</div></div>` : '<div class="empty-slot"><div class="plus-icon">＋</div><div class="jp-text">空きスロット</div></div>'}</div>
        </div>`;
    }).join('');
    grid.onclick = (e) => {
        const card = e.target.closest('.save-slot-card');
        const del = e.target.closest('.btn-delete-slot');
        const rename = e.target.closest('.btn-rename-slot');
        if (!card && !del && !rename) return;
        const slot = Number((card || del || rename).dataset.slot);
        const key = slotKey(slot);
        if (del) {
            localStorage.removeItem(key);
            renderSaveSlotsUI(grid, onRename, onSaved);
            return;
        }
        if (rename) { onRename?.(slot); return; }
        const payload = serializeState();
        try {
            const existing = localStorage.getItem(key);
            if (existing) { const obj = JSON.parse(existing); if (obj.name) payload.name = obj.name; }
        } catch {}
        localStorage.setItem(key, JSON.stringify(payload));
        renderSaveSlotsUI(grid, onRename, onSaved);
        onSaved?.();
    };
}

export function renderLoadSlotsUI(grid, onLoaded) {
    if (!grid) return;
    const slots = Array.from({ length: 6 }, (_, i) => i + 1);
    grid.innerHTML = slots.map(n => {
        const key = slotKey(n);
        const data = localStorage.getItem(key);
        let name = '';
        if (data) { try { const obj = JSON.parse(data); name = obj.name || ''; } catch {} }
        return `<div class="save-slot-card ${data ? 'filled' : 'empty'}" data-slot="${n}">
            <div class="slot-header"><div class="slot-number">Slot ${n}</div></div>
            <div class="slot-body">${data ? `<div class=\"slot-info\"><div class=\"slot-name\">${name || 'Unnamed'}</div></div>` : '<div class="empty-slot"><div class="plus-icon">－</div><div class="jp-text">空きスロット</div></div>'}</div>
        </div>`;
    }).join('');
    grid.onclick = (e) => {
        const card = e.target.closest('.save-slot-card');
        if (!card) return;
        const slot = Number(card.dataset.slot);
        onLoaded?.(slot);
    };
}
