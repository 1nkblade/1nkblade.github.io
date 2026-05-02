# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Static personal portfolio site hosted on GitHub Pages at `1nkblade.github.io`. Built with **Jekyll** (which GitHub Pages runs natively — no Actions or external build needed).

## Local development

GitHub Pages builds automatically on push to `main`. For local preview:

```bash
bundle install
bundle exec jekyll serve
```

Without Ruby/Jekyll installed you can still open the source HTML files directly, but Liquid tags (`{% %}`, `{{ }}`) won't be processed. To preview a fully-rendered site without Jekyll, push to a branch and let GitHub Pages build.

## Architecture

### Jekyll layout system
All pages share `_layouts/default.html`, which composes:

- `_includes/head.html` — meta tags, fonts, Bootstrap, main CSS, favicon, jekyll-seo-tag
- `_includes/header.html` — sticky navbar with clock, theme toggle, home button
- `_includes/sidebar.html` — right-side nav (auto-highlights current page from `page.url` or `page.nav_key`)
- `_includes/footer.html` — quick links, social, contact

Navigation links come from `_data/nav.yml` (single source of truth for both sidebar and footer).

### Page front-matter conventions
Each page declares its variations via front-matter:

```yaml
---
title: Gallery              # used for <title> and SEO
nav_key: gallery            # matches _data/nav.yml entry → marks active link
description: "..."          # SEO meta description
header_center: "📰 Title"   # optional text in middle of navbar
sidebar: false              # opt out of sidebar (404 uses this)
center_content: true        # adds justify-content-center to main row
scroll_progress: true       # adds the scroll-progress bar (homepage)
extra_head: '<link ...>'    # raw HTML injected into <head>
scripts:                    # extra page-specific scripts (deferred)
  - /js/foo.js
---
```

The default scripts loaded on every page are: `time.js`, `audio-click.js`, `gauntlet-cursor.js`, `theme.js`. Page-specific scripts go in the `scripts:` front-matter list.

### Theme system
`js/theme.js` (extracted from inline duplication) reads/writes `data-theme` on `<html>` and persists to `localStorage`. CSS in `css/rotating-image.css` keys off `[data-theme="light"]` / `[data-theme="dark"]` selectors. When adding theme-aware styles, define both variants.

### CSS
Split into modules; cascade order matters and matches the order they're loaded in `_includes/head.html`:

**Always loaded (every page):**
- `css/base.css` — `:root` variables (Solarized dark/light), theme toggle, theme-aware base styles
- `css/layout.css` — rotating image animation, background, main/sidebar grid, header/clock, social icons, content cards, carousel, responsive, accessibility, footer
- `css/gallery.css` — gallery + theme-aware component overrides
- `css/cursor.css` — Warcraft 3 gauntlet cursor system
- `css/extras.css` — print, typewriter, portfolio sections, content section, light mode visibility, mobile responsiveness, number trivia

**Page-specific (loaded via front-matter `stylesheets:` list):**
- `css/page-feed.css` — feed page styles (loaded only on `feed.html`)
- `css/page-404.css` — 404 error page styles + cursor overrides (loaded only on `404.html`)

When adding new styles, place them in the file matching their concern. Do **not** create a new monolithic file — the prior `css/rotating-image.css` was a 2478-line monolith that this split replaced.

### JavaScript modules
Scripts in `js/` are independent vanilla-JS files. Each is self-initializing on `DOMContentLoaded` and tied to specific DOM hooks; if hooks aren't present (e.g. `audio-click.js` on a page without `.sound-img`), the script no-ops.

Page-specific:
- `404.js` — countdown auto-redirect + glitch effect
- `gallery-more-cats.js` — infinite "More Cats!" button
- `feed-script.js` + `rss-feed-reader.js` — RSS aggregator on feed page
- `weather.js`, `number-trivia.js`, `typewriter.js`, `scroll-animations.js`, `parallax.js` — homepage widgets

Common to all pages:
- `time.js`, `theme.js`, `gauntlet-cursor.js`, `audio-click.js`

### RSS feed
`js/rss-feed-reader.js` reads `config/rss.txt` (currently HackTheBox blog) and proxies through a public CORS proxy. Brittle by design — see to-do.md for an alternative using a scheduled GitHub Action that pre-commits `data/feed.json`.

### Assets
- `assets/images/` — backgrounds, gallery photos, social icons (note: `linkedin-64.png` is the canonical name; `Likedin-64.png` retained as legacy)
- `assets/audio/` — UI sound effects
- `assets/gauntletCursor/` — custom cursor sprites

## Key files when changing the chrome

To modify the navbar, sidebar, or footer, edit the relevant `_includes/*.html`. **Do not** copy the chrome into individual pages — that's exactly what Jekyll was introduced to avoid. To add a new page, create an HTML file at the root with appropriate front-matter; the `default` layout is applied via `_config.yml`'s `defaults` rule.
