/**
 * Scroll Animations for Portfolio
 * Adds smooth scroll animations to portfolio sections
 */

class ScrollAnimations {
    constructor() {
        this.animatedElements = [];
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupAnimations());
        } else {
            this.setupAnimations();
        }
    }

    setupAnimations() {
        // Add animation classes to elements
        this.addAnimationClasses();
        
        // Set up intersection observer
        this.setupIntersectionObserver();
        
        // Add scroll event listener for additional effects
        this.setupScrollEffects();
    }

    addAnimationClasses() {
        // About section - slide in from left
        const aboutCard = document.querySelector('.about-section .card');
        if (aboutCard) {
            aboutCard.classList.add('slide-in-left');
        }

        // Skills section cards - fade in
        const skillCards = document.querySelectorAll('.skills-section .card');
        skillCards.forEach((card, index) => {
            card.classList.add('fade-in');
            card.style.animationDelay = `${index * 0.2}s`;
        });

        // Projects section cards - fade in with stagger
        const projectCards = document.querySelectorAll('.projects-section .card');
        projectCards.forEach((card, index) => {
            card.classList.add('fade-in');
            card.style.animationDelay = `${index * 0.15}s`;
        });

        // Contact CTA - slide in from right
        const contactCard = document.querySelector('.contact-cta-section .card');
        if (contactCard) {
            contactCard.classList.add('slide-in-right');
        }

        // Collect all animated elements
        this.animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
    }

    setupIntersectionObserver() {
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        // Observe all animated elements
        this.animatedElements.forEach(element => {
            observer.observe(element);
        });
    }

    setupScrollEffects() {
        let ticking = false;

        const updateScrollEffects = () => {
            // Parallax effect for hero section
            this.updateParallax();
            
            // Scroll progress indicator
            this.updateScrollProgress();
            
            ticking = false;
        };

        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollEffects);
                ticking = true;
            }
        };

        window.addEventListener('scroll', requestTick);
    }

    updateParallax() {
        const scrolled = window.pageYOffset;
        const heroSection = document.querySelector('.hero-section');
        
        if (heroSection) {
            const rate = scrolled * -0.5;
            heroSection.style.transform = `translateY(${rate}px)`;
        }
    }

    updateScrollProgress() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        // Update scroll progress bar if it exists
        const progressBar = document.querySelector('.scroll-progress');
        if (progressBar) {
            progressBar.style.width = `${scrollPercent}%`;
        }
    }

    // Method to manually trigger animations (useful for testing)
    triggerAnimations() {
        this.animatedElements.forEach(element => {
            element.classList.add('visible');
        });
    }

    // Method to reset animations
    resetAnimations() {
        this.animatedElements.forEach(element => {
            element.classList.remove('visible');
        });
    }
}

// Initialize scroll animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.scrollAnimations = new ScrollAnimations();
});

// Expose class globally for debugging
window.ScrollAnimations = ScrollAnimations;
