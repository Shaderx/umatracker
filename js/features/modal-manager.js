// js/features/modal-manager.js
// Modal dialog management for save, load, share, and naming dialogs

import { state } from '../core/state.js';
import { showToast } from '../core/utils.js';
import { lockBodyScroll, unlockBodyScroll } from './scroll-lock.js';
import { buildShareURL, serializeState } from '../storage/url-sharing.js';
import { renderSaveSlotsUI, renderLoadSlotsUI } from '../storage/storage-manager.js';
import { loadHiddenFactors } from '../data/hidden-factors.js';

/**
 * Open save dialog
 * @param {Function} onRename - Callback when rename button clicked
 */
export function openSaveDialog(onRename) {
    const modal = document.getElementById('save-modal');
    if (!modal) return;
    renderSaveSlotsUI(document.getElementById('save-slots-grid'), onRename, () => showToast('Saved'));
    modal.classList.remove('hidden');
    lockBodyScroll(modal);
}

/**
 * Close save dialog
 */
export function closeSaveDialog() {
    const modal = document.getElementById('save-modal');
    if (!modal) return;
    modal.classList.add('hidden');
    unlockBodyScroll(modal);
}

/**
 * Open load dialog
 * @param {Function} onLoaded - Callback when a slot is loaded with the deserialized object
 */
export function openLoadDialog(onLoaded) {
    const modal = document.getElementById('load-modal');
    if (!modal) return;
    renderLoadSlotsUI(document.getElementById('load-slots-grid'), onLoaded);
    modal.classList.remove('hidden');
    lockBodyScroll(modal);
}

/**
 * Close load dialog
 */
export function closeLoadDialog() {
    const modal = document.getElementById('load-modal');
    if (!modal) return;
    modal.classList.add('hidden');
    unlockBodyScroll(modal);
}

/**
 * Open share dialog with stats
 */
export function openShareDialog() {
    const modal = document.getElementById('share-modal');
    if (!modal) return;
    
    const url = buildShareURL();
    const input = document.getElementById('share-url-input');
    if (input) input.value = url;
    
    // Calculate stats
    const races = state.selectedRaces.size;
    const wins = state.wonRaces.size;
    const hiddenFactors = loadHiddenFactors();
    const factors = hiddenFactors.filter(factor => factor.check().completed).length;
    
    // Update stats display
    const rEl = document.getElementById('share-stat-races');
    const wEl = document.getElementById('share-stat-wins');
    const fEl = document.getElementById('share-stat-factors');
    if (rEl) rEl.textContent = String(races);
    if (wEl) wEl.textContent = String(wins);
    if (fEl) fEl.textContent = String(factors);
    
    modal.classList.remove('hidden');
    lockBodyScroll(modal);
}

/**
 * Close share dialog
 */
export function closeShareDialog() {
    const modal = document.getElementById('share-modal');
    if (!modal) return;
    modal.classList.add('hidden');
    unlockBodyScroll(modal);
}

/**
 * Copy share URL to clipboard
 */
export function copyShareURL() {
    const input = document.getElementById('share-url-input');
    if (!input) return;
    input.select();
    input.setSelectionRange(0, 99999);
    try {
        document.execCommand('copy');
        showToast('Share URL copied to clipboard');
    } catch {
        showToast('Failed to copy URL', 'error');
    }
}

/**
 * Open naming dialog for save slot
 * @param {number} slot - Slot number
 * @returns {number} The slot number
 */
export function openNameDialog(slot) {
    const modal = document.getElementById('name-modal');
    const input = document.getElementById('name-input');
    if (modal && input) {
        input.value = '';
        modal.classList.remove('hidden');
        lockBodyScroll(modal);
        setTimeout(() => { input.focus(); }, 0);
    }
    return slot;
}

/**
 * Close naming dialog
 */
export function closeNameDialog() {
    const modal = document.getElementById('name-modal');
    if (!modal) return;
    modal.classList.add('hidden');
    unlockBodyScroll(modal);
}

/**
 * Confirm save with name
 * @param {number} slot - Slot number
 * @param {Function} onComplete - Callback after save completes
 */
export function confirmSaveName(slot, onComplete) {
    const input = document.getElementById('name-input');
    const name = (input && typeof input.value === 'string') ? input.value.trim() : '';
    if (!slot) {
        closeNameDialog();
        return;
    }
    
    const key = `umatracker_slot_${slot}`;
    const payload = serializeState();
    if (name) payload.name = name;
    localStorage.setItem(key, JSON.stringify(payload));
    
    closeNameDialog();
    showToast('Saved');
    
    if (onComplete) onComplete();
}

