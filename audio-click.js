// Function to Play Audio
function playSound(audioFile) {
    const sound = new Audio(`${audioFile}`);
    sound.play();
}

// Attach Event Listener to All Buttons
const buttons = document.querySelectorAll(".sound-btn");

buttons.forEach(button => {
    button.addEventListener("click", () => {
        const audioFile = button.getAttribute("data-sound");
        playSound(audioFile);
    });
});

// Attach Event Listener to Image
const image = document.querySelector(".sound-img");

image.addEventListener("click", () => {
    const audioFile = image.getAttribute("data-sound");
    playSound(audioFile);
});

document.getElementById('toggleSidebar').addEventListener('click', function() {
    const sidebar = document.getElementById('right-content');
    const expandText = this.querySelector('.expand-text');
    const collapseText = this.querySelector('.collapse-text');
    
    sidebar.classList.toggle('expanded');
    sidebar.classList.toggle('col-3');
    
    // Toggle button text
    expandText.classList.toggle('d-none');
    collapseText.classList.toggle('d-none');
});