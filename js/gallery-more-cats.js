let gridCounter = 0;

const catNameTemplates = [
    'Whiskers', 'Fluffy', 'Shadow', 'Sunny', 'Midnight', 'Snowball', 'Ginger', 'Luna',
    'Tiger', 'Princess', 'Smokey', 'Patches', 'Cuddles', 'Ninja', 'Mittens', 'Boots',
    'Felix', 'Garfield', 'Simba', 'Nala', 'Salem', 'Binx', 'Cheshire', 'Mittens Jr',
    'Shadow Jr', 'Snowball Jr', 'Fluffy Jr', 'Whiskers Jr', 'Tiger Jr', 'Luna Jr'
];

const catDescTemplates = [
    'Elegant mustache', 'Soft and cuddly', 'Mysterious presence', 'Bright personality',
    'Dark beauty', 'Pure white fur', 'Orange delight', 'Moonlit grace', 'Striped hunter',
    'Royal attitude', 'Gray elegance', 'Colorful patterns', 'Love seeker', 'Stealth master',
    'Warm paws', 'Adventure ready', 'Classic charm', 'Lazy luxury', 'Majestic roar',
    'Graceful dance', 'Witchy vibes', 'Magical mischief', 'Grinning mystery', 'Tiny paws',
    'Dark explorer', 'Snowy adventurer', 'Soft explorer', 'Young whiskers', 'Little hunter', 'Moonlight grace'
];

document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('more-cats-btn');
    if (!btn) return;

    btn.addEventListener('click', function () {
        const container = document.getElementById('additional-cats-container');
        const originalText = this.innerHTML;
        this.innerHTML = '<i class="bi bi-arrow-clockwise me-2"></i>Loading...';
        this.disabled = true;

        if (window.gauntletCursorSystem) {
            window.gauntletCursorSystem.addLoadingState(this);
        }

        const gridId = `cats-grid-${++gridCounter}`;
        const newGrid = document.createElement('div');
        newGrid.className = 'gallery-grid container py-4';
        newGrid.id = gridId;
        newGrid.style.opacity = '0';
        newGrid.style.transform = 'translateY(30px)';

        const row = document.createElement('div');
        row.className = 'row g-4';

        for (let i = 0; i < 15; i++) {
            const randomNum = Math.floor(Math.random() * 100000) + 1000;
            const nameIndex = (gridCounter * 15 + i) % catNameTemplates.length;
            const descIndex = (gridCounter * 15 + i) % catDescTemplates.length;

            const colDiv = document.createElement('div');
            colDiv.className = 'col-md-4';
            colDiv.innerHTML = `
                <div class="gallery-item" style="--item-index: ${i}">
                    <img src="https://cataas.com/cat?width=400&height=400&random=${randomNum}"
                         class="img-fluid rounded gallery-img"
                         alt="${catNameTemplates[nameIndex]} cat"
                         loading="lazy">
                    <div class="gallery-overlay">
                        <div class="gallery-info">
                            <h5>${catNameTemplates[nameIndex]} ${gridCounter > 1 ? `#${gridCounter}` : ''}</h5>
                            <p>${catDescTemplates[descIndex]}</p>
                        </div>
                    </div>
                </div>
            `;
            row.appendChild(colDiv);
        }

        newGrid.appendChild(row);
        container.appendChild(newGrid);

        setTimeout(() => {
            newGrid.style.transition = 'all 0.6s ease';
            newGrid.style.opacity = '1';
            newGrid.style.transform = 'translateY(0)';
        }, 100);

        setTimeout(() => {
            this.innerHTML = originalText;
            this.disabled = false;
            if (window.gauntletCursorSystem) {
                window.gauntletCursorSystem.removeLoadingState(this);
            }
        }, 800);
    });
});
