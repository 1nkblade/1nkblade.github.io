/**
 * RSS Feed Reader
 * Reads /assets/data/feed.json (produced by scripts/fetch-rss.mjs via the
 * refresh-rss GitHub Action) and renders it. Falls back to a small set of
 * mock items if the JSON cannot be loaded.
 */

const FEED_URL = '/assets/data/feed.json';
const REFRESH_MS = 10 * 60 * 1000;

const SOURCE_META = {
    'Hack The Box Security Blog': { icon: '🛡️', color: 'danger' },
    'Dev.to Feed':                { icon: '💻', color: 'info' },
    'Hacker News':                { icon: '📰', color: 'warning' },
    'CSS Tricks':                 { icon: '🎨', color: 'primary' },
};

const FALLBACK_ITEMS = [
    {
        title: 'Feed temporarily unavailable',
        description: 'The aggregated feed has not been generated yet, or the latest fetch failed. The site will refresh automatically when new items are available.',
        link: 'https://github.com/1nkblade/1nkblade.github.io/actions',
        pubDate: new Date().toISOString(),
        category: 'Tech News',
        source: 'System',
    },
];

class RSSFeedReader {
    constructor() {
        this.items = [];
        this.init();
    }

    async init() {
        await this.loadFeed();
        this.render();
        this.setupAutoRefresh();
    }

    async loadFeed() {
        try {
            const res = await fetch(FEED_URL, { cache: 'no-cache' });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            this.items = Array.isArray(data?.items) && data.items.length > 0
                ? data.items
                : FALLBACK_ITEMS;
        } catch (err) {
            console.warn('RSS feed fetch failed, using fallback:', err);
            this.items = FALLBACK_ITEMS;
        }
    }

    render() {
        const container = document.getElementById('feed-items');
        if (!container) return;

        if (!this.items.length) {
            this.renderEmpty(container);
            return;
        }

        container.innerHTML = this.items.map(item => this.renderItem(item)).join('');
        this.attachLikeHandlers();
    }

    renderItem(item) {
        const meta = SOURCE_META[item.source] ?? { icon: '📄', color: 'secondary' };
        const timeAgo = this.timeAgo(item.pubDate);
        const safeTitle = this.escape(item.title);
        const safeDescription = this.escape(item.description ?? '');
        const safeSource = this.escape(item.source ?? '');
        const safeCategory = this.escape(item.category ?? '');
        const safeLink = this.escapeAttr(item.link ?? '#');

        return `
            <article class="feed-item card mb-4" data-type="${safeCategory.toLowerCase()}" data-source="${safeSource}">
                <div class="card-header bg-${meta.color} d-flex justify-content-between align-items-center">
                    <div class="d-flex align-items-center">
                        <span class="avatar me-3" aria-hidden="true">${meta.icon}</span>
                        <div>
                            <h6 class="mb-0 text-light">${safeSource}</h6>
                            <small class="text-light-50">${timeAgo}</small>
                        </div>
                    </div>
                    <span class="badge bg-${meta.color}"><i class="bi bi-rss"></i> ${safeCategory}</span>
                </div>
                <div class="card-body">
                    <h5 class="card-title text-light">
                        <a href="${safeLink}" target="_blank" rel="noopener noreferrer" class="text-light text-decoration-none">
                            ${safeTitle}
                        </a>
                    </h5>
                    <p class="card-text text-light-50">${safeDescription}</p>
                    <div class="feed-actions">
                        <a href="${safeLink}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-outline-light me-2">
                            <i class="bi bi-box-arrow-up-right"></i> Read
                        </a>
                        <button class="btn btn-sm btn-outline-light like-btn" data-count="0">
                            <i class="bi bi-hand-thumbs-up"></i> Like (0)
                        </button>
                    </div>
                </div>
            </article>
        `;
    }

    renderEmpty(container) {
        container.innerHTML = `
            <div class="text-center py-5">
                <i class="bi bi-rss text-primary" style="font-size: 3rem;"></i>
                <h4 class="text-light mt-3">No items yet</h4>
                <p class="text-light-50">The aggregated feed is empty. Check back later.</p>
            </div>
        `;
    }

    attachLikeHandlers() {
        document.querySelectorAll('.like-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                const next = (parseInt(this.dataset.count, 10) || 0) + 1;
                this.dataset.count = next;
                this.innerHTML = `<i class="bi bi-hand-thumbs-up"></i> Like (${next})`;
            });
        });
    }

    setupAutoRefresh() {
        setInterval(() => this.refresh(), REFRESH_MS);
    }

    async refresh() {
        await this.loadFeed();
        this.render();
    }

    timeAgo(iso) {
        const diff = Date.now() - new Date(iso).getTime();
        const m = Math.floor(diff / 60000);
        const h = Math.floor(diff / 3600000);
        const d = Math.floor(diff / 86400000);
        if (m < 1) return 'Just now';
        if (m < 60) return `${m}m ago`;
        if (h < 24) return `${h}h ago`;
        if (d < 7) return `${d}d ago`;
        return new Date(iso).toLocaleDateString();
    }

    escape(s) {
        return String(s ?? '')
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    escapeAttr(s) {
        return this.escape(s);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.rssFeedReader = new RSSFeedReader();
});
