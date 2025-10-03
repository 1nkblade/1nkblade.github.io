// RSS Feed functionality integration
document.addEventListener('DOMContentLoaded', function() {
    // Remove loading message once RSS feeds are loaded
    setTimeout(() => {
        const loadingMsg = document.getElementById('loading-message');
        if (loadingMsg) {
            loadingMsg.style.display = 'none';
        }
    }, 2000);

    // Filter functionality for RSS feeds
    const filterButtons = document.querySelectorAll('[data-filter]');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get filter type
            const filterType = this.getAttribute('data-filter');
            
            // Apply filter to RSS feed items
            setTimeout(() => {
                const feedItems = document.querySelectorAll('.feed-item');
                feedItems.forEach(item => {
                    if (filterType === 'all') {
                        item.style.display = 'block';
                    } else {
                        const itemType = item.getAttribute('data-type');
                        if (itemType === filterType) {
                            item.style.display = 'block';
                        } else {
                            item.style.display = 'none';
                        }
                    }
                });
            }, 100); // Small delay to ensure RSS content is loaded
        });
    });

    // Global refresh function for RSS feeds
    window.refreshRSSFeeds = function() {
        const refreshBtn = document.getElementById('refresh-feeds-btn');
        const originalContent = refreshBtn.innerHTML;
        
        refreshBtn.innerHTML = '<i class="bi bi-arrow-clockwise"></i> Refreshing...';
        refreshBtn.disabled = true;
        
        // Refresh the RSS feed data
        if (window.rssFeedReader) {
            window.rssFeedReader.refreshFeeds();
        }
        
        setTimeout(() => {
            refreshBtn.innerHTML = originalContent;
            refreshBtn.disabled = false;
        }, 2000);
    };
});
