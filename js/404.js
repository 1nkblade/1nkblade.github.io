document.addEventListener('DOMContentLoaded', function () {
    const countdownElement = document.getElementById('countdown');
    const progressBar = document.getElementById('progress-bar');
    if (!countdownElement) return;

    let countdown = 10;

    function updateCountdown() {
        countdown--;
        countdownElement.textContent = countdown;
        if (progressBar) {
            progressBar.style.width = ((countdown / 10) * 100) + '%';
        }
        if (countdown <= 0) {
            window.location.href = '/';
        } else {
            setTimeout(updateCountdown, 1000);
        }
    }

    updateCountdown();

    setInterval(() => {
        document.querySelectorAll('.glitch').forEach(element => {
            if (Math.random() < 0.1) {
                element.style.animation = 'none';
                setTimeout(() => { element.style.animation = ''; }, 100);
            }
        });
    }, 2000);
});
