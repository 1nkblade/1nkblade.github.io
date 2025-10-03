/**
 * Real-time Clock Display
 * Updates time and date every second with proper error handling
 */

class ClockManager {
    constructor() {
        this.timeElement = document.getElementById('time');
        this.dateElement = document.getElementById('date');
        this.updateInterval = null;
        this.isInitialized = false;
        
        this.init();
    }
    
    init() {
        try {
            if (!this.timeElement || !this.dateElement) {
                console.warn('Clock elements not found. Clock will not be displayed.');
                return;
            }
            
            this.updateClock();
            this.startClock();
            this.isInitialized = true;
            
            console.log('Clock initialized successfully');
        } catch (error) {
            console.error('Failed to initialize clock:', error);
        }
    }
    
    updateClock() {
        try {
            const now = new Date();
            
            // Time formatting with error handling
            const time = now.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            });
            
            // Date formatting with error handling
            const date = now.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            // Update DOM elements safely
            if (this.timeElement) {
                this.timeElement.textContent = time;
            }
            if (this.dateElement) {
                this.dateElement.textContent = date;
            }
            
        } catch (error) {
            console.error('Error updating clock:', error);
            this.showClockError();
        }
    }
    
    startClock() {
        // Clear any existing interval
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        
        // Update every second
        this.updateInterval = setInterval(() => {
            this.updateClock();
        }, 1000);
    }
    
    stopClock() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }
    
    showClockError() {
        if (this.timeElement) {
            this.timeElement.textContent = 'Time unavailable';
        }
        if (this.dateElement) {
            this.dateElement.textContent = 'Date unavailable';
        }
    }
    
    // Public method to refresh clock manually
    refresh() {
        this.updateClock();
    }
    
    // Cleanup method
    destroy() {
        this.stopClock();
        this.timeElement = null;
        this.dateElement = null;
        this.isInitialized = false;
    }
}

// Initialize clock when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Create global clock instance
    window.clockManager = new ClockManager();
});

// Fallback for older browsers or if DOMContentLoaded already fired
if (document.readyState === 'loading') {
    // DOM is still loading, DOMContentLoaded will handle it
} else {
    // DOM is already loaded
    window.clockManager = new ClockManager();
}

// Export for module systems if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ClockManager;
}