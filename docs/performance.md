# Performancegennemgang — 17. november 2026

Formålet er mindre overførsel og færre unødvendige renders med samme Figma-layout, fonte, grafik, skærmflow, animationstiming og lyd. Ingen afhængigheder er tilføjet til appen, og ingen Supabase-forespørgsler eller datamodeller er ændret.

## Implementeret

### Tabsfri billeder

15 PNG-filer har fået WebP-varianter med samme dimensioner og alfa. Appens referencer peger på varianterne. Originalerne er bevaret som designkilder og for at undgå at bryde eventuelle eksterne referencer til offentlige URL'er.

| Assetgruppe | Nye filer |
| --- | --- |
| Intro | `bvb.webp`, `get-started-paper.webp` |
| Kickoff | `crowd.webp` |
| Onboarding | `signed-jersey.webp`, `stadium.webp` |
| Post-match | `bvb.webp` |
| Præmie | `paper.webp`, `stadium.webp` |
| Resultat | `background.webp`, `paper.webp` |
| Fejltilstande | `paper.webp`, `seated-fan.webp`, `standing-fan.webp`, `ticket.webp` |
| Tak | `background.webp` |

De valgte originaler fylder 27.029.393 bytes; varianterne fylder 15.174.400 bytes, en reduktion på 11.854.993 bytes (43,9 %). Det er sammenlignelige kildefiler, ikke en påstand om, at browseren tidligere overførte 27 MB. Mange billeder bliver allerede resized og komprimeret af `next/image`; besparelsen er mere direkte for almindelige `<img>` og Canvas-eksport. Fordi originalerne bevares, bliver hele `public/` større på disk.

Konvertering: eksisterende Sharp, `keepMetadata().webp({lossless: true, effort: 6})`. Sammenligning af dekodede billeder bekræftede identiske alfaværdier og identiske RGB-værdier i alle pixels med synlig alfa. Fuldt gennemsigtige pixels kan have andre usynlige RGB-værdier. Ingen resampling, nye crops eller ændrede `sizes`, dimensioner, lazy-loading- eller priority-indstillinger.

### Samme fonte som WOFF2

14 eksisterende TTF-fonte har fået WOFF2-varianter. Alle `next/font/local`-referencer bruger nu WOFF2. Familienavne, vægte, variable akser, font-display og preload-strategi er bevaret.

Kilder: 2.061.788 bytes → WOFF2: 850.024 bytes (58,8 % mindre). HTTP-komprimerede TTF-filer var allerede mindre på netværket end deres kildefiler; se de faktiske browsermålinger nedenfor.

FontTools 4.60.2 og Brotli 1.2.1 blev kun anvendt i et midlertidigt Python-miljø uden for projektet. Ingen ændring af `package.json` eller lockfil. Reproduktion med de bevarede kilder:

```python
from pathlib import Path
from fontTools.ttLib.woff2 import compress

for source in Path('public/fonts').glob('*.ttf'):
    compress(source, source.with_suffix('.woff2'), transform_tables=set())
```

WOFF2's valgfrie glyftransformationer er slået fra. Alle fonttabeller er sammenlignet efter dekomprimering: de er identiske bortset fra containerens checksum, komprimeringsflag og den bortfaldne TTF-containersignatur. Browserkontrol sammenlignede tekstpixels og målte tekstbredder mellem original og WOFF2 i alle 14 fonte ved vægtene 300, 400, 500, 600, 700 og 900. Ingen forskelle for den testede tekst. Denne test er ikke en kontrol af alle tænkelige tegn eller browsere.

### Rendering og JavaScript

`FanModusContext.jsx` udstiller nu en memoiseret session-Context og en særskilt clock-Context. Kampuret kører stadig hvert 500 ms og bruger samme reducer, timestamps, elapsed-beregning og localStorage. `useFanModusClock` bruges af kickoff, live match, halftime, resultat og delingsvisning. Appens navigation og øvrige Context-forbrugere skal dermed ikke opdateres alene på grund af klokkeslættet. Faseskift og demoændringer opdaterer stadig sessionen normalt.

`ShareSheet.jsx` indlæser Canvas-eksportøren med `import()` inde i den eksisterende async-handler, når brugeren vælger gem/del. Eksisterende busy-, success- og fejlfeedback er bevaret. Turbopack deler også fælles kode i chunks, så den målte reduktion af initial JavaScript er beskeden.

## Lokal før/efter-måling

Produktionsbuild via `npm run build` og `npm start -- --port 3100`, samme maskine og Chrome. Mobilviewport 390 × 844, DPR 1, CPU 4×, netværk 200.000 bytes/s download, 150 ms latency. Cache deaktiveret, service worker omgået. Én opvarmningskørsel og derefter tre målinger pr. version på `?demo=0`.

Målevinduet sluttede 1,5 sekunder efter, at menuen og FanModus-feltet fandtes, og `document.fonts.status` var `loaded`. Alle billeddownloads var ikke nødvendigvis færdige ved vinduets afslutning. LCP og CLS nedenfor er derfor observerede værdier i dette vindue, ikke en afsluttet Lighthouse-navigation. Rigtig Supabase blev brugt, og svar- og downloadrækkefølge kan variere.

| Måling, median af tre | Før | Efter |
| --- | ---: | ---: |
| Overførsel registreret i målevinduet | 2.455.695 bytes | 2.072.763 bytes |
| Fontoverførsel | 2.093.284 bytes | 1.708.448 bytes |
| JavaScriptoverførsel | 217.105 bytes | 216.764 bytes |
| FCP | 1.352 ms | 1.352 ms |
| Observeret LCP | 14.732 ms | 12.648 ms |
| Observeret CLS | 0,000296 | 0,000040 |

Overførslen i vinduet faldt 15,6 %, fontoverførslen 18,4 %. LCP varierede: før 14.208 / 14.732 / 16.488 ms; efter 13.008 / 6.716 / 12.648 ms. Det lille udvalg, streaming, eksterne kampdata og målevinduet betyder, at LCP- og CLS-forskellene ikke kan tilskrives optimeringerne alene. Der blev ikke målt Lighthouse-score eller rigtig Lighthouse-TBT. Der var ingen registrerede long tasks over 50 ms i de seks målte vinduer.

Disse tal kan ikke sammenlignes direkte med de oplyste Vercel Lighthouse-scorer 74, 75 og 74. En ny Lighthouse-test skal udføres på en tilsvarende deploy med samme URL, enhed, throttling og cacheforhold, helst flere gentagelser. Der er ikke deployet noget i denne opgave.

## Bevidst undladt

- **Bred dynamisk indlæsning af skærme/Motion:** Kan give tomme frames, fallback-font eller forsinkelse ved hurtige demo-hop og gendannede sessioner. Alle skærmovergange er bevaret.
- **Ændrede font-preloads:** Fontene til senere skærme preloades fortsat. Det koster initial båndbredde, men at fjerne det uden en gennemtestet prewarm-strategi kan give fontskift ved navigation. Første skærms preload er bevaret.
- **GIF → video eller anden animation:** De oprindelige frames og tidsforløb er bevaret.
- **Lossy komprimering, nedskalering og AVIF-omkodning:** Fravalgt her for at undgå ændringer i korn, papirkant, tekstur og transparente lag. Tabsfri WebP af `intro/fans.png` og `prize/texture.png` blev større og blev forkastet.
- **SVG-rekomprimering:** Undersøgelsen af indlejrede PNG-data gav ingen mindre tabsfri varianter. SVG'ernes præcise mål og lag er bevaret. Menuens mange små SVG-anmodninger kan undersøges særskilt.
- **Udskudt lydpreload:** Kan flytte lyd i forhold til swipe/flip, især på langsomme forbindelser. Alle tre lydfiler og controlleren er uændrede.
- **Supabase-cache, ændrede logo-URL'er eller nye remotePatterns:** Kan ændre friskhed, fejlhåndtering eller hvilke databasebilleder der virker. Ingen ændringer.
- **Fjernelse af dependencies eller stor refaktorering:** Ingen dokumenteret gevinst, der begrunder risikoen i denne opgave.

## Ændrede filer

- `app/layout.js`: fontkilder.
- `context/FanModusContext.jsx`: adskilt clock/session og memoiserede værdier.
- `components/overlays/ShareSheet.jsx`: clock-hook og behovsstyret eksportør.
- `components/screens/Kickoff.jsx`, `LiveMatch.jsx`, `MatchResult.jsx`: clock-hook, font- og billedkilder.
- `components/screens/Activation.jsx`, `ActivationAnimation.jsx`, `Intro.jsx`: fontkilder.
- `components/screens/PrizeReveal.jsx`: font- og billedkilder; animationslogik uændret.
- `components/ui/FigmaScreen.jsx`, `LoadingState.jsx`: fontkilder.
- `components/ui/MatchTicket.jsx`: font- og billedkilder.
- `components/ui/ErrorState.jsx`: tabsfri billedvarianter.
- `lib/assets.js`, `intro-design.js`, `onboarding-design.js`, `share.js`: billedstier.
- `public/fonts/*.woff2`: 14 nye fontvarianter.
- `public/images/`: 15 nye WebP-varianter, specificeret ovenfor.
- `README.md`, `docs/implementation.md`, `docs/performance.md`: dokumentation.

Ingen eksisterende filer er slettet.

## Verificering

- `npm run lint`: bestået.
- `npm test`: 53/53 bestået; ingen nye testfiler eller ændret testantal.
- `npm run build`: bestået med den eksisterende App Router/streaming-løsning.
- `git diff --check`: bestået.
- Alle 15 nye WebP-filer er sammenlignet med deres originaler efter dekodning; dimensioner, alfa og synlige pixels er bevaret.
- Alle 29 nye billed-/font-URL'er returnerede succes i browseren. WebP-billederne kunne dekodes, og de 14 fonte bestod de beskrevne pixel-/breddesammenligninger.
- Isoleret Chrome på produktionsbuilden gennemførte menu → intro → instruktion → præmier → lokationsdialog → rigtig pointer-swipe → aktivering → 60-minutters kickoff → begge halvlege/halvleg → fulltime → collecting → resultat → tak → automatisk delingsdialog → PNG-eksport → præmiebillet. Alle tre lydcues startede, og browseren rapporterede ingen JavaScript-undtagelser.
- PNG-eksporten producerede en PNG-blob på 237.662 bytes. Den native delingsmenu blev ikke gennemtestet; en desktop-download blev blokeret af testharnessen efter blobgenerering for at undgå at gemme i brugerens Downloads-mappe.
- Ti hurtige minuttryk gav +600.000 ms i både nedtælling og optælling; skift over halftime og collecting blev også kontrolleret.
- Mute/unmute, lydløs flip, refresh af lydvalget, Enter/Space, synligt fokus, stop af igangværende lyd, ingen genafspilning ved unmute og normal navigation bestod. Placering/44-px-klikområde blev kontrolleret på 15 skærme samt mobil og kompakte desktop-previews.
- Normal flip, vinder-demo, genafspilning, returflip og reduced-motion-udgaven blev kontrolleret på desktop og mobil uden JavaScript-undtagelser. Animationssekvenser, CSS, GIF'er og lydfiler er uændrede.
- Chrome Debugger målte seks clock-commits over cirka tre sekunder uden et eneste kald til `AppContent`. React-fiberflags alene blev ikke brugt som renderbevis, da de kan hænge ved en genbrugt fiber.

Browserkontrollerne er midlertidige CDP-scripts uden for projektet, ikke en ny indchecket testsuite. Safari, fysisk telefon, alle tegn i fontene og native Web Share mangler fortsat manuel kontrol. Next-buildens advarsel om en overordnet lockfil og Node-testenes eksisterende advarsel om module-type er bevaret; de forhindrede ikke checks i at bestå.
