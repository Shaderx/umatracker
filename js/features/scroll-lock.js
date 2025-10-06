/**
 * Body Scroll Lock
 * Manages body scroll locking for modals on mobile/tablet devices
 */

import { state } from '../core/state.js';

/**
 * Lock body scroll (for mobile/tablet modals)
 * @param {HTMLElement} targetElement - Element that should remain scrollable
 */
export function lockBodyScroll(targetElement) {
    // Only apply on mobile/tablet
    if (window.innerWidth > 900) return;
    
    state.lockCount++;
    if (state.lockCount === 1) {
        // First lock - save position and apply lock
        state.scrollPosition = window.pageYOffset;
        document.body.classList.add('modal-open-mobile');
        document.body.style.top = `-${state.scrollPosition}px`;
        
        // Mark the scroll target
        if (targetElement) {
            state.currentLockTarget = targetElement;
            targetElement.classList.add('scroll-lock-target');
        }
    }
}

/**
 * Unlock body scroll
 * @param {HTMLElement} targetElement - Element that was scrollable
 */
export function unlockBodyScroll(targetElement) {
    // Only apply on mobile/tablet
    if (window.innerWidth > 900) return;
    
    state.lockCount = Math.max(0, state.lockCount - 1);
    if (state.lockCount === 0) {
        // Last unlock - remove lock and restore position
        document.body.classList.remove('modal-open-mobile');
        document.body.style.top = '';
        window.scrollTo(0, state.scrollPosition);
        
        // Remove scroll target marker
        if (state.currentLockTarget) {
            state.currentLockTarget.classList.remove('scroll-lock-target');
            state.currentLockTarget = null;
        }
    }
    
    // Clean up specific target
    if (targetElement) {
        targetElement.classList.remove('scroll-lock-target');
    }
}
