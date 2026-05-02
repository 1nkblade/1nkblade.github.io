// Fetches each RSS source listed in _data/rss.yml, parses items, and writes
// a flattened, sorted aggregate to assets/data/feed.json. Run by the
// `refresh-rss` GitHub Action; the committed JSON is what the browser fetches.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import yaml from 'js-yaml';
import { XMLParser } from 'fast-xml-parser';

const ROOT = resolve(import.meta.dirname, '..');
const CONFIG_PATH = resolve(ROOT, '_data/rss.yml');
const OUT_PATH = resolve(ROOT, 'assets/data/feed.json');
const ITEMS_PER_SOURCE = 10;
const TOTAL_LIMIT = 60;
const FETCH_TIMEOUT_MS = 15000;

// processEntities: false bypasses fast-xml-parser's entity-expansion limit
// (some real-world feeds like dev.to exceed it). We decode common entities
// manually in stripHtml below.
const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    textNodeName: '#text',
    processEntities: false,
});

const ENTITY_MAP = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };

function decodeEntities(s) {
    return String(s ?? '')
        .replace(/&(amp|lt|gt|quot|apos|nbsp);/g, (_, name) => ENTITY_MAP[name] ?? '')
        .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(parseInt(n, 10)))
        .replace(/&#x([0-9a-fA-F]+);/g, (_, n) => String.fromCodePoint(parseInt(n, 16)));
}

function stripHtml(s) {
    return decodeEntities(String(s ?? '').replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();
}

function pickText(node) {
    if (node == null) return '';
    if (typeof node === 'string') return node;
    if (typeof node === 'object') return node['#text'] ?? node['_'] ?? '';
    return String(node);
}

function pickLink(item) {
    const link = item.link;
    if (typeof link === 'string') return link;
    if (Array.isArray(link)) {
        const alt = link.find(l => l?.['@_rel'] === 'alternate' || !l?.['@_rel']);
        return alt?.['@_href'] ?? alt?.['#text'] ?? '';
    }
    if (link && typeof link === 'object') return link['@_href'] ?? link['#text'] ?? '';
    return item.guid?.['#text'] ?? item.guid ?? '';
}

function parseDate(raw) {
    if (!raw) return new Date();
    const d = new Date(raw);
    return isNaN(d.getTime()) ? new Date() : d;
}

async function fetchWithTimeout(url) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    try {
        return await fetch(url, {
            signal: controller.signal,
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; 1nkblade.github.io/1.0; +https://1nkblade.github.io)',
                'Accept': 'application/rss+xml, application/atom+xml, application/xml, text/xml',
            },
        });
    } finally {
        clearTimeout(timer);
    }
}

async function fetchSource(source) {
    const res = await fetchWithTimeout(source.url);
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
    const xml = await res.text();
    const parsed = parser.parse(xml);

    const rssItems = parsed?.rss?.channel?.item;
    const atomEntries = parsed?.feed?.entry;
    const raw = rssItems ?? atomEntries ?? [];
    const items = Array.isArray(raw) ? raw : [raw];

    return items.slice(0, ITEMS_PER_SOURCE).map(item => ({
        title: pickText(item.title),
        link: pickLink(item),
        pubDate: parseDate(item.pubDate ?? item.published ?? item.updated).toISOString(),
        description: stripHtml(pickText(item.description ?? item.summary ?? item.content)).slice(0, 300),
        source: source.name,
        category: source.category,
    }));
}

const config = yaml.load(readFileSync(CONFIG_PATH, 'utf8'));
const sources = config?.sources ?? [];

const results = await Promise.allSettled(sources.map(fetchSource));

const aggregated = [];
const errors = [];
results.forEach((r, i) => {
    const name = sources[i].name;
    if (r.status === 'fulfilled') {
        aggregated.push(...r.value);
        console.log(`✓ ${name}: ${r.value.length} items`);
    } else {
        errors.push({ source: name, error: r.reason.message });
        console.error(`✗ ${name}: ${r.reason.message}`);
    }
});

aggregated.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
const trimmed = aggregated.slice(0, TOTAL_LIMIT);

mkdirSync(dirname(OUT_PATH), { recursive: true });
writeFileSync(OUT_PATH, JSON.stringify({
    generatedAt: new Date().toISOString(),
    sourceCount: sources.length,
    successCount: results.filter(r => r.status === 'fulfilled').length,
    errors,
    items: trimmed,
}, null, 2) + '\n');

console.log(`\nWrote ${trimmed.length} items to ${OUT_PATH}`);
if (errors.length === sources.length) {
    console.error('All sources failed.');
    process.exit(1);
}
