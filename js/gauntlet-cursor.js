/**
 * Simple Gauntlet Cursor System
 * Basic cursor functionality without trail effects
 */

class GauntletCursorSystem {
    constructor() {
        // Simple constructor - no effects needed
    }

    init() {
        // No initialization needed for simple cursor
    }

    // Removed all dynamic cursor effects - cursors handled by CSS only

    // Simple loading state methods (no visual effects)
    addLoadingState(element) {
        if (element) {
            element.classList.add('loading-cursor');
        }
    }

    removeLoadingState(element) {
        if (element) {
            element.classList.remove('loading-cursor');
        }
    }
}

// Initialize simple cursor system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.gauntletCursorSystem = new GauntletCursorSystem();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GauntletCursorSystem;
}
