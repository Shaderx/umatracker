/**
 * Body Scroll Lock
 * Manages body scroll locking for modals on mobile/tablet devices
 */

export class ScrollLock {
    constructor() {
        this.scrollPosition = 0;
        this.lockCount = 0;
        this.currentLockTarget = null;
    }
    
    /**
     * Lock body scroll (for mobile/tablet modals)
     * @param {HTMLElement} targetElement - Element that should remain scrollable
     */
    lockBodyScroll(targetElement) {
        // Only apply on mobile/tablet
        if (window.innerWidth > 900) return;
        
        this.lockCount++;
        if (this.lockCount === 1) {
            // First lock - save position and apply lock
            this.scrollPosition = window.pageYOffset;
            document.body.classList.add('modal-open-mobile');
            document.body.style.top = `-${this.scrollPosition}px`;
            
            // Mark the scroll target
            if (targetElement) {
                this.currentLockTarget = targetElement;
                targetElement.classList.add('scroll-lock-target');
            }
        }
    }
    
    /**
     * Unlock body scroll
     * @param {HTMLElement} targetElement - Element that was scrollable
     */
    unlockBodyScroll(targetElement) {
        // Only apply on mobile/tablet
        if (window.innerWidth > 900) return;
        
        this.lockCount = Math.max(0, this.lockCount - 1);
        if (this.lockCount === 0) {
            // Last unlock - remove lock and restore position
            document.body.classList.remove('modal-open-mobile');
            document.body.style.top = '';
            window.scrollTo(0, this.scrollPosition);
            
            // Remove scroll target marker
            if (this.currentLockTarget) {
                this.currentLockTarget.classList.remove('scroll-lock-target');
                this.currentLockTarget = null;
            }
        }
        
        // Clean up specific target
        if (targetElement) {
            targetElement.classList.remove('scroll-lock-target');
        }
    }
}
