/**
 * RSS Feed Reader System
 * Reads RSS feeds from rss.txt and displays them in an elegant feed format
 * Compatible with GitHub Pages and client-side limitations
 */

class RSSFeedReader {
    constructor() {
        this.rssFeeds = [];
        this.feedCache = new Map();
        this.cacheExpiry = 15 * 60 * 1000; // 15 minutes
        this.init();
    }

    async init() {
        await this.loadRSSFeeds();
        this.setupCORSProxy();
        this.renderFeed();
        this.setupAutoRefresh();
    }

    async loadRSSFeeds() {
        try {
            // For GitHub Pages, we'll simulate loading feeds
            // In a real deployment, you'd use a CORS proxy or backend service
            
            this.rssFeeds = [
                {
                    name: "Hack The Box Security Blog",
                    url: "https://www.hackthebox.com/rss/blog/security-101",
                    description: "Latest cybersecurity insights and hacking tutorials",
                    category: "Security",
                    icon: "🛡️",
                    color: "danger"
                },
                {
                    name: "Dev.to Feed",
                    url: "https://dev.to/rss",
                    description: "Developer community articles and insights",
                    category: "Development",
                    icon: "💻",
                    color: "info"
                },
                {
                    name: "Hacker News",
                    url: "https://hnrss.org/frontpage",
                    description: "Latest tech and startup news",
                    category: "Tech News",
                    icon: "📰",
                    color: "warning"
                },
                {
                    name: "CSS Tricks",
                    url: "https://css-tricks.com/feed/rss/",
                    description: "CSS tutorials and frontend techniques",
                    category: "Frontend",
                    icon: "🎨",
                    color: "primary"
                }
            ];

            return this.rssFeeds;
        } catch (error) {
            console.error('Error loading RSS feeds:', error);
            return [];
        }
    }

    setupCORSProxy() {
        // Since GitHub Pages can't directly fetch RSS feeds due to CORS,
        // we'll create a mock data system for demonstration
        this.createMockFeedData();
    }

    createMockFeedData() {
        // Mock RSS feed data for demonstration
        const mockFeedItems = [
            {
                title: "Advanced Penetration Testing Techniques",
                description: "Dive deep into the latest methodologies for ethical hacking and security testing. Learn about new tools and techniques used by professional penetration testers.",
                link: "https://www.hackthebox.com/blog/advanced-pentest-techniques",
                pubDate: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
                category: "Security",
                source: "Hack The Box",
                icon: "🛡️",
                tags: ["Penetration Testing", "Security", "Ethical Hacking"]
            },
            {
                title: "Modern JavaScript Development Patterns",
                description: "Explore the latest patterns and best practices in JavaScript development. From ES2023 features to architectural patterns that scale.",
                link: "https://dev.to/modern-js-patterns",
                pubDate: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
                category: "Development",
                source: "DEV Community",
                icon: "💻",
                tags: ["JavaScript", "Web Development", "Patterns"]
            },
            {
                title: "CSS Grid vs Flexbox: When to Use What",
                description: "A comprehensive guide to choosing the right CSS layout method for your projects. Real-world examples and performance comparisons.",
                link: "https://css-tricks.com/grid-vs-flexbox/",
                pubDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
                category: "Frontend",
                source: "CSS Tricks",
                icon: "🎨",
                tags: ["CSS", "Layout", "Frontend"]
            },
            {
                title: "The Future of Web Development",
                description: "Understanding where web development is heading. From AI integration to WebAssembly, explore the technologies shaping our future.",
                link: "https://news.ycombinator.com/item?id=future-web-dev",
                pubDate: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
                category: "Tech News",
                source: "Hacker News",
                icon: "📰",
                tags: ["Web Development", "Technology", "Future"]
            },
            {
                title: "API Security Best Practices",
                description: "Learn how to secure your REST APIs and GraphQL endpoints. Common vulnerabilities and how to protect against them.",
                link: "https://www.hackthebox.com/blog/api-security",
                pubDate: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
                category: "Security",
                source: "Hack The Box",
                icon: "🛡️",
                tags: ["API Security", "Web Security", "Developer"]
            },
            {
                title: "Building Scalable React Applications",
                description: "Architecture patterns and performance optimization techniques for large-scale React applications.",
                link: "https://dev.to/scalable-react",
                pubDate: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
                category: "Development",
                source: "DEV Community",
                icon: "💻",
                tags: ["React", "Performance", "Architecture"]
            }
        ];

        this.feedCache.set('rss-feed-data', {
            data: mockFeedItems,
            timestamp: Date.now()
        });
    }

    async fetchRSSFeed(feedUrl) {
        // In a real implementation, you'd use a CORS proxy or backend service
        // For now, we'll return our mock data
        const cachedData = this.feedCache.get('rss-feed-data');
        
        if (cachedData && (Date.now() - cachedData.timestamp) < this.cacheExpiry) {
            return cachedData.data;
        }

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        return this.createMockFeedData();
    }

    async renderFeed() {
        const feedContainer = document.getElementById('feed-items');
        if (!feedContainer) return;

        try {
            feedContainer.innerHTML = '<div class="text-center"><div class="loading-spinner"></div><p class="text-light-50 mt-2">Loading RSS feeds...</p></div>';

            const feedData = await this.fetchRSSFeed();
            
            if (feedData && feedData.length > 0) {
                this.displayFeedItems(feedData);
            } else {
                this.displayNoFeedMessage();
            }
        } catch (error) {
            console.error('Error rendering feed:', error);
            this.displayErrorMessage('Failed to load RSS feeds. Please check your connection.');
        }
    }

    displayFeedItems(feedItems) {
        const feedContainer = document.getElementById('feed-items');
        if (!feedContainer) return;

        feedItems.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

        feedContainer.innerHTML = feedItems.map((item, index) => {
            const timeAgo = this.getTimeAgo(item.pubDate);
            const feedSource = this.rssFeeds.find(feed => feed.source === item.source);
            const sourceIcon = feedSource ? feedSource.icon : '📄';
            const sourceColor = feedSource ? feedSource.color : 'secondary';
            
            return `
                <article class="feed-item card mb-4" data-type="${item.category.toLowerCase()}" data-source="${item.source}">
                    <div class="card-header bg-gradient bg-${sourceColor} d-flex justify-content-between align-items-center">
                        <div class="d-flex align-items-center">
                            <img src="https://github.com/identicons/rss.png" class="avatar me-3" alt="RSS Avatar">
                            <div>
                                <h6 class="mb-0 text-light">${item.source}</h6>
                                <small class="text-light-50">${timeAgo}</small>
                            </div>
                        </div>
                        <span class="badge bg-${sourceColor}">
                            <i class="bi bi-rss"></i> RSS
                        </span>
                    </div>
                    <div class="card-body">
                        <div class="d-flex align-items-start mb-2">
                            <h5 class="card-title text-light mb-0 me-2">${sourceIcon}</h5>
                            <h5 class="card-title text-light mb-0">
                                <a href="${item.link}" target="_blank" rel="noopener noreferrer" class="text-light text-decoration-none">
                                    ${item.title}
                                </a>
                            </h5>
                        </div>
                        
                        <p class="card-text text-light-50">
                            ${item.description}
                        </p>
                        
                        <div class="article-tags mb-3">
                            ${item.tags.map(tag => `<span class="tag tag-sm tag-${sourceColor}">${tag}</span>`).join('')}
                        </div>

                        <div class="rss-source-info bg-dark rounded p-2 mb-3">
                            <div class="d-flex align-items-center justify-content-between">
                                <div class="d-flex align-items-center">
                                    <span class="badge bg-${sourceColor} me-2">${sourceIcon}</span>
                                    <span class="text-light">${item.category}</span>
                                </div>
                                <small class="text-light-50">
                                    <i class="bi bi-calendar-date"></i> ${this.formatDate(item.pubDate)}
                                </small>
                            </div>
                        </div>

                        <div class="feed-actions">
                            <a href="${item.link}" target="_blank" class="btn btn-sm btn-outline-light me-2">
                                <i class="bi bi-box-arrow-up-right"></i> Read Article
                            </a>
                            <button class="btn btn-sm btn-outline-light me-2" onclick="this.parentElement.querySelector('.article-summary').style.display = this.parentElement.querySelector('.article-summary').style.display === 'none' ? 'block' : 'none'">
                                <i class="bi bi-info-circle"></i> Summary
                            </button>
                            <button class="btn btn-sm btn-outline-light me-2 like-btn" data-count="0">
                                <i class="bi bi-hand-thumbs-up"></i> Like (0)
                            </button>
                            <button class="btn btn-sm btn-outline-light" onclick="window.open('${item.link}', '_blank')">
                                <i class="bi bi-bookmark"></i> Save
                            </button>
                        </div>

                        <div class="article-summary mt-3 p-3 bg-dark rounded" style="display: none;">
                            <h6 class="text-light">📋 Article Summary</h6>
                            <p class="text-light-50 mb-0">
                                This article from <strong>${item.source}</strong> covers <strong>${item.category.toLowerCase()}</strong> 
                                topics including ${item.tags.slice(0, 3).join(', ')}. 
                                Published ${timeAgo.toLowerCase()}.
                            </p>
                        </div>
                    </div>
                </article>
            `;
        }).join('');

        this.setupFeedInteractions();
        this.setupLazyLoading();
    }

    setupFeedInteractions() {
        // Like functionality
        document.querySelectorAll('.like-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const currentCount = parseInt(this.dataset.count) || 0;
                const newCount = currentCount + 1;
                this.dataset.count = newCount;
                this.innerHTML = `<i class="bi bi-hand-thumbs-up"></i> Like (${newCount})`;
                
                // Visual feedback
                this.classList.add('btn-success');
                setTimeout(() => {
                    this.classList.remove('btn-success');
                    this.classList.add('btn-outline-light');
                }, 1000);
            });
        });

        // External link tracking
        document.querySelectorAll('a[target="_blank"]').forEach(link => {
            link.addEventListener('click', function() {
                // You could add analytics tracking here
                console.log('External link clicked:', this.href);
            });
        });
    }

    setupLazyLoading() {
        // Intersection Observer for lazy loading images
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('loading');
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    displayNoFeedMessage() {
        const feedContainer = document.getElementById('feed-items');
        if (!feedContainer) return;

        feedContainer.innerHTML = `
            <div class="text-center py-5">
                <i class="bi bi-rss text-primary" style="font-size: 3rem;"></i>
                <h4 class="text-light mt-3">No RSS Feeds Available</h4>
                <p class="text-light-50">
                    RSS feeds are currently unavailable. Please check your connection or try again later.
                </p>
                <button class="btn btn-outline-light" onclick="location.reload()">
                    <i class="bi bi-arrow-clockwise"></i> Retry
                </button>
            </div>
        `;
    }

    displayErrorMessage(message) {
        const feedContainer = document.getElementById('feed-items');
        if (!feedContainer) return;

        feedContainer.innerHTML = `
            <div class="text-center py-5">
                <i class="bi bi-exclamation-triangle text-warning" style="font-size: 3rem;"></i>
                <h4 class="text-light mt-3">Error Loading Feeds</h4>
                <p class="text-light-50">${message}</p>
                <button class="btn btn-outline-light" onclick="location.reload()">
                    <i class="bi bi-arrow-clockwise"></i> Retry
                </button>
            </div>
        `;
    }

    getTimeAgo(date) {
        const now = new Date();
        const diffMs = now - new Date(date);
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        
        return this.formatDate(date);
    }

    formatDate(date) {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    setupAutoRefresh() {
        // Refresh feeds every 10 minutes
        setInterval(() => {
            this.renderFeed();
        }, 10 * 60 * 1000);

        // Update timestamps every minute
        setInterval(() => {
            this.updateTimestampDisplays();
        }, 60000);
    }

    updateTimestampDisplays() {
        document.querySelectorAll('.feed-item').forEach(item => {
            const timestampElement = item.querySelector('.text-light-50 small');
            if (timestampElement && timestampElement.textContent.includes('ago')) {
                // Timestamp will be managed by the display method on refresh
            }
        });
    }

    // Method to manually refresh feeds
    refreshFeeds() {
        this.renderFeed();
    }

    // Method to add new RSS feed (for future expansion)
    addRSSFeed(feedConfig) {
        this.rssFeeds.push(feedConfig);
        this.renderFeed();
    }
}

// Initialize RSS feed reader when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.rssFeedReader = new RSSFeedReader();
    
    // Make refresh function globally available
    window.refreshRSSFeeds = () => window.rssFeedReader.refreshFeeds();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RSSFeedReader;
}
