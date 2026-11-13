# Intro — Figma 41:10112

Kilde: https://www.figma.com/design/OhrxqSyK9D1DtvUuulESvV/Dortmund-fanmodus---Eksamen-3.-Sem?node-id=41-10112

## Omfang

Kun introen er ændret. `Intro.jsx` og dens CSS Module erstatter den tidligere intro i `BeforeMatch.jsx`. Skærmen bruger fortsat den centrale session/navigation, de eksisterende skærmtransitions og desktop-wrapperen. Get started går til `how`. BVB-logoet er en tastatur- og touchbetjenelig tilbageknap. Andre skærmes statusbar, fonte og assets er bevaret.

Figma-data er læst via MCP `get_design_context` for framen og headline-, foto- og CTA-noderne. Supplerende read-only `use_figma`-læsninger gav de præcise transformationsmatricer, billedopacitet og tekstvægte. Ingen ændringer blev skrevet til Figma.

## Design og assets

- Reference: 390 × 844, sort baggrund, hvid brødtekst, gule SVG-penselstrøg og rød #E60000 i FanModus-wordmark.
- Bebas Neue Regular: 57,6 px / 69 px i overskriften; 42 px / 50 px på knappen.
- Space Grotesk: Regular 400, 24 px / 31 px i wordmark; Medium 500, 18 px / 23 px i brødteksten.
- Introen har sin egen variable Space Grotesk-fil, da den eksisterende globale fontfil er en statisk 700-vægt. Filen er fra Google Fonts, under projektets eksisterende OFL-licens. Globale fontvalg er ikke ændret.
- Statusbaren følger Figma: 54 px høj, 17 px fed systemtid, 19 × 11 signal, 16 × 11,619 Wi-Fi og 27 × 14 batteri. SF Pro Display bruges, hvor den findes; ellers Apples systemfont eller browserens fallback. SF Pro-fontfilen leveres ikke af Figma.
- Alle 11 assets er hentet uændret med curl fra de download-URL'er, Figma MCP returnerede, og ligger lokalt under `public/images/intro`, `public/icons/intro` og `public/illustrations/intro`. Ingen midlertidige URL'er bruges i appen. SVG'ernes originale dimensioner er bevaret; framen som helhed tilpasses proportionalt til skærmbredden.
- `lib/intro-design.js` samler assetstier, node-id'er og Figma-matricer. Absolutte positioner anvendes til denne statiske collage, hvor rotationer og overlap er en del af designet. Containeren måler bredden med ResizeObserver, så designet er proportionalt ved andre mobilbredder.

## Kontrollerede koordinater ved 390 × 844

| Lag | Renderet bounding box, x / y / bredde / højde |
| --- | --- |
| Stadionfoto, opacity 25 % | −155,130 / −35,000 / 629,959 / 452,468 |
| Øverste penselstrøg | 24,153 / 254,000 / 337,374 / 107,477 |
| Midterste penselstrøg | 54,753 / 339,500 / 281,145 / 89,564 |
| Nederste penselstrøg | 34,053 / 409,700 / 323,316 / 102,999 |
| Understregning | 86,639 / 480,738 / 279,207 / 59,738 |
| Brødtekst | 76 / 561,476 / 238 / 69 |
| Pil | 310 / 619 / 72,670 / 89,486 |
| CTA | 44,945 / 693,476 / 300,111 / 108,855 |

Bounding boxes er kontrolleret ved at anvende de implementerede matricer på lagets fire hjørner. Alle lokale assetfiler er kontrolleret som ikke-tomme, og samtlige SVG'ers rodmål matcher de implementerede slots. Dette er en strukturel kontrol, ikke en browsermåling.

## Verifikation og begrænsning

Lint, eksisterende session-/viewport-tests og produktionsbuild køres efter ændringen. Browser-skillens forbindelse fejler før siden åbnes med manglende `sandboxPolicy`. Derfor kan faktisk rendering, billedcrop, font-rasterisering og klikflow ikke bekræftes med browser-screenshot i dette miljø. Brug Figma-framen som reference ved den afsluttende visuelle kontrol ved 390 × 844 og test også 375 × 812 og 430 × 932.
