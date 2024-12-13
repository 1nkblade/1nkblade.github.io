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