# To-Do

## 1. RSS feed
- [ ] Verificare la prima esecuzione dell'Action dopo il merge (deve creare il primo `assets/data/feed.json` reale)

## 2. Asset
- [ ] Sostituire l'avatar Pinterest (`i.pinimg.com/.../cddf0179...jpg`) in `index.html` e `feed.html` con un asset locale

## 3. Accessibilità e qualità
- [ ] Verificare contrasto colori in entrambi i temi (axe DevTools)
- [ ] Aggiungere skip-link "salta al contenuto" nel layout
- [ ] Lingua coerente: `_config.yml` ha `lang: en` ma il contenuto homepage è in italiano — decidere `it` o usare `lang` per-page
- [ ] Verificare focus visibile su tutti gli elementi interattivi
- [ ] Validare HTML (`https://validator.w3.org`)

## 4. Pagine pianificate (opzionale)
La sidebar attuale ha solo Home/Gallery/Feed. Se si vogliono creare altre pagine:
- [ ] About, Projects, Contact, Resume — aggiungerle a `_data/nav.yml` quando esistono

## 5. Tooling opzionale
- [ ] `.editorconfig` per indentazione consistente
- [ ] GitHub Action di lint (HTMLProofer per link rotti) su PR
- [ ] Prettier config

## 6. Performance
- [ ] Aggiungere `loading="lazy"` alle immagini below-the-fold rimaste
- [ ] Considerare `<link rel="preconnect">` per `cdn.jsdelivr.net`, `fonts.googleapis.com`
- [ ] Self-host font JetBrains Mono se la latenza Google Fonts è un problema

## 7. Verifiche post-deploy
- [ ] Dopo il push, verificare che `https://1nkblade.github.io/sitemap.xml` esista
- [ ] Verificare che `https://1nkblade.github.io/robots.txt` punti correttamente al sitemap
- [ ] Verificare i tag `<meta og:*>` con il debugger Facebook/LinkedIn
