/**
 * Number Trivia API Integration
 * Manages the Numbers API for number facts
 */

class NumberTrivia {
    constructor() {
        this.init();
    }

    init() {
        // Load initial content when page loads
        this.loadInitialContent();
    }

    async loadInitialContent() {
        try {
            // Load only Number Trivia on page load
            await this.fetchRandomNumberFact();
        } catch (error) {
            console.log('Error loading initial fun content:', error);
        }
    }


    // Numbers API - Number Trivia
    async fetchNumberFact(number = null) {
        const factElement = document.getElementById('number-fact');
        if (!factElement) return;

        try {
            factElement.innerHTML = '<i class="bi bi-hourglass-split"></i> Loading number fact...';
            
            const numberToFetch = number || Math.floor(Math.random() * 9999) + 1;
            const response = await fetch(`http://numbersapi.com/${numberToFetch}?json`);
            const data = await response.json();
            
            if (data.text) {
                factElement.innerHTML = `
                    <div class="number-content">
                        <p class="mb-0"><strong>${numberToFetch}:</strong> ${data.text}</p>
                    </div>
                `;
            } else {
                throw new Error('No number fact received');
            }
        } catch (error) {
            console.log('Numbers API error:', error);
            const randomNumber = Math.floor(Math.random() * 100) + 1;
            factElement.innerHTML = `
                <div class="number-content">
                    <p class="mb-0"><strong>${randomNumber}:</strong> This is a random number between 1 and 100! 🎲</p>
                </div>
            `;
        }
    }

}

// Global functions for button clicks

function fetchNumberFact() {
    const numberInput = document.getElementById('number-input');
    const number = numberInput.value ? parseInt(numberInput.value) : null;
    window.numberTrivia.fetchNumberFact(number);
}

function fetchRandomNumberFact() {
    window.numberTrivia.fetchNumberFact();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.numberTrivia = new NumberTrivia();
});

// Expose class globally for debugging
window.NumberTrivia = NumberTrivia;
