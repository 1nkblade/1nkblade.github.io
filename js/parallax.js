/**
 * Enhanced Parallax Scrolling Effect
 * Provides smooth parallax effects for hero backgrounds
 */

class ParallaxManager {
    constructor() {
        this.elements = [];
        this.isScrolling = false;
        this.ticking = false;
        this.options = {
            throttleDelay: 16, // ~60fps
            parallaxFactor: 0.5,
            enableOnMobile: false
        };
        
        this.init();
    }
    
    init() {
        // Check if user prefers reduced motion
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (prefersReducedMotion) {
            console.log('Parallax disabled: User prefers reduced motion');
            return;
        }
        
        // Check if device supports parallax (disable on touch devices for performance)
        if (this.isTouchDevice() && !this.options.enableOnMobile) {
            console.log('Parallax disabled: Touch device detected');
            return;
        }
        
        this.findParallaxElements();
        this.bindEvents();
    }
    
    findParallaxElements() {
        // Find all elements with parallex-hero class
        this.elements = Array.from(document.querySelectorAll('.parallax-hero')).map(el => ({
            element: el,
            pseudoElement: el.querySelector('::before'),
            speed: parseFloat(el.dataset.parallaxSpeed) || this.options.parallaxFactor,
            offset: 0
        }));
        
        // Find geometric shapes for special parallax handling
        this.geometricShapes = Array.from(document.querySelectorAll('.geometric-shape')).map(shape => ({
            element: shape,
            speed: parseFloat(shape.dataset.speed) || this.getShapeSpeed(shape),
            direction: shape.dataset.direction || 'normal'
        }));
        
        console.log(`Found ${this.elements.length} paralleax elements and ${this.geometricShapes.length} geometric shapes`);
    }
    
    getShapeSpeed(shape) {
        // Assign different speeds based on shape class
        const classSpeedMap = {
            'shape1': 0.8,
            'shape2': 0.6,
            'shape3': 1.2,
            'shape4': 0.4,
            'shape5': 1.0
        };
        
        for (const [className, speed] of Object.entries(classSpeedMap)) {
            if (shape.classList.contains(className)) {
                return speed;
            }
        }
        return 0.5; // default speed
    }
    
    bindEvents() {
        // Throttled scroll event
        window.addEventListener('scroll', this.handleScroll.bind(this), { passive: true });
        
        // Handle window resize
        window.addEventListener('resize', this.handleResize.bind(this), { passive: true });
        
        // Handle orientation change
        window.addEventListener('orientationchange', this.handleResize.bind(this), { passive: true });
    }
    
    handleScroll() {
        if (!this.ticking) {
            requestAnimationFrame(this.updateParallax.bind(this));
            this.ticking = true;
        }
    }
    
    updateParallax() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        
        this.elements.forEach(({ element, speed, offset }) => {
            const rect = element.getBoundingClientRect();
            const elementTop = rect.top + scrollTop;
            const elementHeight = rect.height;
            const elementHeightHalf = elementHeight / 2;
            
            // Calculate if element is in viewport
            const viewportTop = scrollTop;
            const viewportBottom = scrollTop + windowHeight;
            const elementBottomMargin = elementTop + elementHeight;
            
            // Only animate if element is visible or near viewport
            if (elementBottomMargin > viewportTop && elementTop < viewportBottom) {
                // Calculate parallax offset
                const yPos = -(scrollTop * speed);
                
                // Apply transform to pseudo-element
                const style = window.getComputedStyle(element, '::before');
                element.style.setProperty('--parallax-y', `${yPos}px`);
                
                // Add subtle transform to content for depth effect
                const contentTransform = `translateY(${scrollTop * speed * 0.2}px)`;
                element.style.setProperty('--content-transform', contentTransform);
            }
        });
        
        // Update geometric shapes parallax
        this.geometricShapes.forEach(({ element, speed }) => {
            const yPos = -(scrollTop * speed);
            const rotateValue = scrollTop * speed * 0.5;
            
            // Apply dynamic transform based on scroll
            element.style.transform = `translateY(${yPos * 0.3}px) rotate(${rotateValue}deg) scale(${1 + Math.sin(scrollTop * 0.01) * 0.1})`;
            element.style.opacity = `${0.1 + Math.sin(scrollTop * 0.005) * 0.05}`;
        });
        
        this.ticking = false;
    }
    
    handleResize() {
        // Reset transforms on resize
        this.elements.forEach(({ element }) => {
            element.style.removeProperty('--parallax-y');
            element.style.removeProperty('--content-transform');
        });
        
        // Reset geometric shapes
        this.geometricShapes.forEach(({ element }) => {
            element.style.transform = '';
            element.style.opacity = '';
        });
        
        // Recalculate after resize
        setTimeout(this.updateParallax.bind(this), 100);
    }
    
    isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }
    
    enable() {
        this.bindEvents();
    }
    
    disable() {
        window.removeEventListener('scroll', this.handleScroll.bind(this));
        window.removeEventListener('resize', this.handleResize.bind(this));
        window.removeEventListener('orientationchange', this.handleResize.bind(this));
        
        // Reset all transforms
        this.elements.forEach(({ element }) => {
            element.style.removeProperty('--parallax-y');
            element.style.removeProperty('--content-transform');
        });
    }
    
    addElement(element, options = {}) {
        const parallaxElement = {
            element: element,
            speed: parseFloat(element.dataset.parallaxSpeed) || options.speed || this.options.parallaxFactor,
            offset: 0
        };
        
        this.elements.push(parallaxElement);
        element.classList.add('parallax-hero');
    }
    
    removeElement(element) {
        this.elements = this.elements.filter(el => el.element !== element);
        element.classList.remove('parallax-hero');
    }
    
    updateParallaxSpeed(element, speed) {
        const parallaxElement = this.elements.find(el => el.element === element);
        if (parallaxElement) {
            parallaxElement.speed = speed;
        }
    }
}

// CSS Custom Properties Bridge
function initCSSParallaxBridge() {
    // Add CSS variables to :root for parallax transforms
    const style = document.createElement('style');
    style.textContent = `
        .parallax-hero::before {
            transform: translateY(var(--parallax-y, 0)) !important;
        }
        
        .parallax-content {
            transform: translateZ(0) var(--content-transform, translateY(0)) !important;
        }
    `;
    document.head.appendChild(style);
}

// Initialize Parallax Manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize CSS bridge for transforms
    initCSSParallaxBridge();
    
    // Initialize parallax manager
    window.parallaxManager = new ParallaxManager();
    
    // Expose methods globally for advanced usage
    window.ParallaxManager = ParallaxManager;
});

// Performance monitoring
if ('performance' in window && 'getEntriesByType' in performance) {
    setTimeout(() => {
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.entryType === 'measure' && entry.name.includes('parallax')) {
                    console.log(`Parallax performance: ${entry.name} took ${entry.duration.toFixed(2)}ms`);
                }
            }
        });
        
        observer.observe({ entryTypes: ['measure'] });
    }, 2000);
}
