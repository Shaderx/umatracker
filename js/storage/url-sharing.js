// js/storage/url-sharing.js
import { state } from '../core/state.js';
import { showToast } from '../core/utils.js';
import { getCurrentDb, switchDatabase } from '../data/race-data.js';

export function serializeState() {
    return {
        db: getCurrentDb(),
        selected: Array.from(state.selectedRaces),
        won: Array.from(state.wonRaces),
        lost: Array.from(state.lostRaces),
        planner: state.plannerData,
        year: state.plannerYear,
        tracked: state.trackedFactorId
    };
}

export function deserializeState(obj) {
    try {
        state.selectedRaces = new Set(obj.selected || []);
        state.wonRaces = new Set(obj.won || []);
        state.lostRaces = new Set(obj.lost || []);
        if (obj.planner) state.plannerData = obj.planner;
        if (obj.year) state.plannerYear = obj.year;
        state.trackedFactorId = obj.tracked || null;
    } catch {}
}

/**
 * Switch to the database stored in a save payload and update the toggle UI.
 * Call this BEFORE deserializeState so race data matches the IDs in the save.
 */
export function applySavedDb(obj) {
    const db = obj?.db;
    if (db && (db === 'jp' || db === 'en') && db !== getCurrentDb()) {
        switchDatabase(db);
        document.querySelectorAll('.db-toggle-btn').forEach(b => b.classList.remove('active'));
        const target = document.querySelector(`.db-toggle-btn[data-db="${db}"]`);
        if (target) target.classList.add('active');
    }
}

export function buildShareURL() {
    const base = window.location.origin + window.location.pathname;
    const raw = JSON.stringify(serializeState());
    const compressed = (window.LZString && window.LZString.compressToEncodedURIComponent) ? window.LZString.compressToEncodedURIComponent(raw) : encodeURIComponent(raw);
    return `${base}?s=${compressed}`;
}

export function tryImportFromURL() {
    const params = new URLSearchParams(window.location.search);
    const s = params.get('s');
    if (!s) return false;

    console.log('🔍 [URL IMPORT] Compressed string length:', s.length);

    try {
        const json = (window.LZString && window.LZString.decompressFromEncodedURIComponent) ? window.LZString.decompressFromEncodedURIComponent(s) : decodeURIComponent(s);
        console.log('🔍 [URL IMPORT] Decompressed JSON length:', json ? json.length : 0);

        if (!json || json === 'null') {
            console.error('❌ [URL IMPORT] Decompression returned null - URL may be truncated or corrupted');
            showToast('❌ Invalid or incomplete share URL', 'error');
            return false;
        }

        const obj = JSON.parse(json);
        console.log('✅ [URL IMPORT] Successfully parsed shared state');
        applySavedDb(obj);
        deserializeState(obj);
        return true;
    } catch (e) {
        console.error('❌ [URL IMPORT] Failed to decode shared state:', e);
        console.error('❌ [URL IMPORT] This usually means the URL was truncated. Make sure you copy the ENTIRE URL!');
        showToast('❌ Invalid share URL - URL may be incomplete', 'error');
        return false;
    }
}


