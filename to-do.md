# To-Do: miglioramenti strutturali

## ✅ Completato (migrazione Jekyll)

- [x] **Setup Jekyll**: `_config.yml`, `Gemfile`, `.gitignore` per `_site/` etc.
- [x] **Layout condiviso**: `_layouts/default.html` + `_includes/{head,header,sidebar,footer}.html`
- [x] **Nav data centralizzata**: `_data/nav.yml` alimenta sidebar + footer
- [x] **ThemeManager estratto**: ora in `js/theme.js`, non più inline in ogni pagina
- [x] **Pagine convertite**: `index.html`, `gallery.html`, `feed.html`, `404.html` usano front-matter + layout
- [x] **Script inline estratti**: `js/404.js`, `js/gallery-more-cats.js`
- [x] **Stili 404 estratti**: `css/404.css` (caricato via `extra_head`)
- [x] **`template.html` rimosso**: rimpiazzato da `_layouts/default.html`
- [x] **README spostato in root**, cartella `docs/` eliminata
- [x] **Sidebar links**: erano già puliti nelle pagine pubblicate (3 link); il problema era solo in `template.html`, ora rimosso
- [x] **SEO**: `jekyll-seo-tag` + `jekyll-sitemap` plugins, `robots.txt`, favicon
- [x] **`linkedin-64.png`**: aggiunto con nome corretto (vecchio `Likedin-64.png` mantenuto per compatibilità)
- [x] **`loading="lazy"`** aggiunto alle immagini gallery
- [x] **`rel="noopener"`** aggiunto ai link `target="_blank"` nel footer

## 🔧 Da fare

### 1. ~~Spezzare `css/rotating-image.css`~~ ✅ FATTO
Diviso in 7 file modulari:
- [x] `css/base.css` (194 righe) — variabili tema, theme toggle, base
- [x] `css/layout.css` (453 righe) — rotating image, layout, header, footer, ecc.
- [x] `css/gallery.css` (191 righe) — gallery + theme-aware
- [x] `css/cursor.css` (359 righe) — gauntlet cursor
- [x] `css/extras.css` (577 righe) — print, typewriter, portfolio, mobile, number trivia
- [x] `css/page-feed.css` (405 righe) — caricato solo su feed.html
- [x] `css/page-404.css` (302 righe) — caricato solo su 404.html (merge inline + main CSS)
- [x] Meccanismo `stylesheets:` in front-matter per CSS page-specific
- [x] Monolite `rotating-image.css` eliminato

### 2. RSS feed reader robusto
Dipende da un proxy CORS pubblico (vedere `js/rss-feed-reader.js`).
- [ ] Documentare in CLAUDE.md quale proxy è usato
- [ ] Alternativa: GitHub Action schedulata che fetcha il feed e committa `_data/feed.json` — il client lo legge senza CORS, niente proxy esterni
- [ ] Aggiungere fallback graceful se il fetch fallisce

### 3. Pulizia asset
- [x] Eliminato il vecchio `assets/images/Likedin-64.png`
- [x] `assets/gauntletCursor/` → `assets/cursors/`
- [x] `config/rss.txt` → `_data/rss.yml` (Jekyll-native), cartella `config/` rimossa
- [ ] Rinominare `cat1.jpg`, `cat2.jpg`, `cat3.jpg` con nomi descrittivi (se ancora usati)
- [ ] Verificare che nessuna immagine sia >500KB; eventualmente convertire in WebP
- [ ] Considerare di sostituire le immagini hard-coded (Pinterest URL nell'avatar) con asset locali
- [ ] Aggiornare `js/rss-feed-reader.js` per leggere da `_data/rss.yml` (via JSON renderizzato da Jekyll) invece dell'array hardcoded

### 4. Accessibilità e qualità
- [ ] Verificare contrasto colori in entrambi i temi (axe DevTools)
- [ ] Aggiungere skip-link "salta al contenuto" nel layout
- [ ] Lingua coerente: `_config.yml` ha `lang: en` ma il contenuto homepage è in italiano — decidere `it` o usare `lang` per-page
- [ ] Verificare focus visibile su tutti gli elementi interattivi
- [ ] Validare HTML (`https://validator.w3.org`)

### 5. Pagine pianificate (opzionale)
La sidebar attuale ha solo Home/Gallery/Feed. Se si vogliono creare altre pagine:
- [ ] About, Projects, Contact, Resume — aggiungerle a `_data/nav.yml` quando esistono
- [ ] Per ora il codice non ha link rotti

### 6. Tooling opzionale
- [ ] `.editorconfig` per indentazione consistente
- [ ] GitHub Action di lint (HTMLProofer per link rotti) su PR
- [ ] Prettier config

### 7. Performance
- [ ] Aggiungere `loading="lazy"` alle immagini below-the-fold rimaste
- [ ] Considerare `<link rel="preconnect">` per `cdn.jsdelivr.net`, `fonts.googleapis.com`
- [ ] Self-host font JetBrains Mono se la latenza Google Fonts è un problema

### 8. Verifiche post-deploy
- [ ] Dopo il push, verificare che `https://1nkblade.github.io/sitemap.xml` esista
- [ ] Verificare che `https://1nkblade.github.io/robots.txt` punti correttamente al sitemap
- [ ] Verificare i tag `<meta og:*>` con il debugger Facebook/LinkedIn
