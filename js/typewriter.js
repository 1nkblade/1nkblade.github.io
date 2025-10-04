/**
 * Typewriter Effect Script
 * Creates a typewriter effect for text elements
 */

class TypewriterEffect {
    constructor(element, text, options = {}) {
        this.element = element;
        this.text = text;
        this.options = {
            speed: options.speed || 100,           // Typing speed in milliseconds
            deleteSpeed: options.deleteSpeed || 50, // Deletion speed in milliseconds
            pauseTime: options.pauseTime || 2000,   // Pause at end before restart
            loop: options.loop || true,            // Whether to loop infinitely
            showCursor: options.showCursor !== false, // Whether to show blinking cursor
            ...options
        };
        
        this.currentIndex = 0;
        this.isDeleting = false;
        this.isPaused = false;
        this.displayedText = '';
        
        this.init();
    }
    
    init() {
        if (!this.element || !this.text) {
            console.error('TypewriterEffect: Missing element or text');
            return;
        }
        
        this.typeText();
    }
    
    typeText() {
        if (this.isPaused) return;
        
        if (!this.isDeleting) {
            // Typing forward
            this.displayedText = this.text.substring(0, this.currentIndex + 1);
            this.currentIndex++;
            
            if (this.currentIndex >= this.text.length) {
                // Finished typing, pause then start deleting
                setTimeout(() => {
                    this.isDeleting = true;
                    this.typeText();
                }, this.options.pauseTime);
            } else {
                setTimeout(() => this.typeText(), this.options.speed);
            }
        } else {
            // Deleting
            this.displayedText = this.text.substring(0, this.currentIndex - 1);
            this.currentIndex--;
            
            if (this.currentIndex <= 0) {
                // Finished deleting, start typing again if looping
                this.isDeleting = false;
                if (this.options.loop) {
                    setTimeout(() => this.typeText(), this.options.speed);
                }
            } else {
                setTimeout(() => this.typeText(), this.options.deleteSpeed);
            }
        }
        
        this.updateDisplay();
    }
    
    updateDisplay() {
        this.element.textContent = this.displayedText;
    }
    
    start() {
        this.isPaused = false;
        this.typeText();
    }
    
    pause() {
        this.isPaused = true;
    }
    
    reset() {
        this.currentIndex = 0;
        this.isDeleting = false;
        this.displayedText = '';
        this.updateDisplay();
    }
}

// Initialize typewriter effect when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const typedElement = document.getElementById('typed-text');
    const cursorElement = document.querySelector('.typing-cursor');
    
    if (typedElement && cursorElement) {
        // Create typewriter effect
        const typewriter = new TypewriterEffect(
            typedElement, 
            'Full-Stack Developer & Digital Creative',
            {
                speed: 120,        // Typing speed
                deleteSpeed: 80,   // Deletion speed  
                pauseTime: 2500,   // Pause at end
                loop: true         // Loop infinitely
            }
        );
        
        // Store reference globally for potential future use
        window.typewriterEffect = typewriter;
    }
});
