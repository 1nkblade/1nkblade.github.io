/**
 * Audio Click Handler and Sidebar Manager
 * Handles sound effects and sidebar toggle functionality
 */

class AudioManager {
    constructor() {
        this.audioCache = new Map();
        this.isAudioEnabled = true;
        this.volume = 0.5;
        
        this.init();
    }
    
    init() {
        try {
            this.setupAudioElements();
            console.log('Audio manager initialized successfully');
        } catch (error) {
            console.error('Failed to initialize audio manager:', error);
        }
    }
    
    setupAudioElements() {
        // Setup sound buttons
        const soundButtons = document.querySelectorAll(".sound-btn");
        soundButtons.forEach(button => {
            button.addEventListener("click", (e) => {
                e.preventDefault();
                const audioFile = button.getAttribute("data-sound");
                if (audioFile) {
                    this.playSound(audioFile);
                }
            });
        });
        
        // Setup sound image
        const soundImage = document.querySelector(".sound-img");
        if (soundImage) {
            soundImage.addEventListener("click", (e) => {
                e.preventDefault();
                const audioFile = soundImage.getAttribute("data-sound");
                if (audioFile) {
                    this.playSound(audioFile);
                }
            });
            
            // Add visual feedback
            soundImage.style.cursor = 'pointer';
            soundImage.addEventListener('mouseenter', () => {
                soundImage.style.opacity = '0.8';
            });
            soundImage.addEventListener('mouseleave', () => {
                soundImage.style.opacity = '1';
            });
        }
    }
    
    
    playSound(audioFile) {
        if (!this.isAudioEnabled || !audioFile) {
            return;
        }
        
        try {
            // Check if audio is cached
            let audio = this.audioCache.get(audioFile);
            
            if (!audio) {
                audio = new Audio(audioFile);
                audio.volume = this.volume;
                audio.preload = 'auto';
                
                // Cache the audio object
                this.audioCache.set(audioFile, audio);
                
                // Handle audio loading errors
                audio.addEventListener('error', (e) => {
                    console.warn(`Failed to load audio file: ${audioFile}`, e);
                    this.audioCache.delete(audioFile);
                });
            }
            
            // Reset audio to beginning and play
            audio.currentTime = 0;
            audio.play().catch(error => {
                console.warn('Audio playback failed:', error);
                // Disable audio if user interaction is required
                if (error.name === 'NotAllowedError') {
                    this.isAudioEnabled = false;
                    console.info('Audio disabled due to browser autoplay policy');
                }
            });
            
        } catch (error) {
            console.error('Error playing sound:', error);
        }
    }
    
    // Public methods for external control
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        this.audioCache.forEach(audio => {
            audio.volume = this.volume;
        });
    }
    
    enableAudio() {
        this.isAudioEnabled = true;
    }
    
    disableAudio() {
        this.isAudioEnabled = false;
    }
    
    // Cleanup method
    destroy() {
        this.audioCache.forEach(audio => {
            audio.pause();
            audio.src = '';
        });
        this.audioCache.clear();
    }
}

// Initialize audio manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.audioManager = new AudioManager();
});

// Fallback for older browsers
if (document.readyState === 'loading') {
    // DOM is still loading, DOMContentLoaded will handle it
} else {
    // DOM is already loaded
    window.audioManager = new AudioManager();
}

// Export for module systems if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AudioManager;
}