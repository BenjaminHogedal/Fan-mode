# Implementering og begrænsninger

## Nuværende funktionalitet

BVB FanModus er en interaktiv eksamensprototype med én App Router-side og et internt React-skærmflow:

BVB-menu → intro → How it works → præmier → aktivering/lokation/swipe → aktiveringsanimation → bekræftelse → kickoff → første halvleg → halvleg → anden halvleg → fulltime → collecting entries → resultat → tak/deling → præmiebillet → menu.

Kun FanModus er aktiv på menuen. De øvrige felter og bundnavigationen er deaktiveret. `See all prizes` er også deaktiveret. Der er ingen låseskærmsfunktion i det aktive flow.

## Arkitektur

| Fil/område | Ansvar |
| --- | --- |
| `app/page.js` | Asynkron læsning af Supabase-kampdata, `connection()`, `Suspense` og fejl ved manglende data |
| `app/layout.js` | Metadata, dokumentets sprog, viewport og lokale fonte |
| `components/FanModusApp.jsx` | Providers, skærmvalg, navigation, overlays, fokus og demo-panel |
| `lib/fanmodus.js` | Sessionmodel, reducer, tidsstempler, faseskift og sessiongendannelse |
| `context/FanModusContext.jsx` | Hydration, localStorage, fælles ur og afledte lodder |
| `components/animations/useSessionTimeout.js` | Ventetider, som følger demo-urets tidsforskydning |
| `lib/swipe-sequence.js` | Swipe-sekvens og afbrydelige ventetider |
| `lib/ticket-flip.js` | Testbar rækkefølge og timing for normal- og vinderflip |
| `context/SoundContext.jsx`, `lib/sounds.js` | Fælles Web Audio-controller, preload, unlock og afspilning |
| `components/ui/` | Fælles dialoger, referencecanvas, headers, kampbillet og layout |
| `lib/share.js` | Canvas-rendering og PNG-download |
| `lib/*-design.js` | Assetstier, Figma-nodehenvisninger og referencekoordinater |

Browserafhængig kode ligger i klientkomponenter og deres effects/event handlers. `DesktopViewport` kan modtage serverrenderet indhold som children. `connection()` afgrænser den request-baserede kampforespørgsel; med Cache Components kan loading-fallbacken prerenderes som shell. Hele siden beskrives derfor ikke som en statisk eksport.

Navigation foregår via `session.currentScreen` og lokal historik, ikke separate URL'er for hver skærm. Beregningsfunktioner og sekvensfunktioner testes uden browseren. Reduceren bruger et indsendt tidspunkt i tests og ellers `Date.now()`.

## Reel datakilde og simulerede funktioner

`lib/supabase.js` opretter en klient ud fra `NEXT_PUBLIC_SUPABASE_URL` og `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. Miljøfiler ignoreres af Git. En publishable key er ikke en hemmelig servernøgle; tabellens adgang skal styres i Supabase. Der er ingen database-migrations eller RLS-policies i repositoryet.

`MatchData` læser én kamp fra `matches`, sorteret efter kickoff og filtreret til kickoff nu eller senere. Der hentes id, modstanderoplysninger, logo, kickoff, stadion og målscore. **Supabase og en tilgængelig kommende kamp kræves også til eksamensdemoen.** Ingen match giver en særskilt besked; konfigurations-/netværksfejl viser en generel fejl med genindlæsning som retry.

Følgende er lokale simuleringer:

- Lokationsgodkendelse. Dialogen kalder ikke GPS.
- Telefonfri tid. Appen registrerer ikke faktisk telefonbrug eller låsning.
- Kampforløb, lodder og statistik. Statistikdialogen indeholder illustrative tal.
- Præmieafgørelse. Normalbilletten viser taberresultatet. Vinderknappen styrer en lokal demovisning, som ikke gemmes som præmieafgørelse.

Der skrives ikke brugere, sessioner, lodder eller præmieresultater til Supabase. Sessionen ligger i localStorage og kan ændres af brugeren; den er ikke en autoritativ registrering til en reel lodtrækning.

## Tid og demo

En ny kickoff-nedtælling starter på **60:00**, når kickoff-skærmen åbnes. Den følger sessionens deadline, ikke databasekampens kickoff. Første og anden halvleg varer 45 minutter; pausen varer 15 minutter. Kun aktive halvlege optjener tid. Lodder er `Math.floor(seconds / 60)`.

Tidsstempler gør det muligt at indhente forløbet efter en inaktiv fane. Et interval på 500 ms opdaterer visningen, og `visibilitychange` udløser også et tick. Interval og listener ryddes op. Ny aktivering nulstiller optjening og billetafsløring; Reset flow nulstiller også demo-tidsforskydningen. En afbrudt aktivering gendannes til aktiveringsskærmen.

`?demo=1` viser kontrollerne; `?demo=0` skjuler dem. Udviklingsvisningen har som standard demo slået til. Panelet indeholder tidligere/næste skærm og reset samt direkte fejl-/loadingvisninger.

- **+1 min** findes kun på de tidsstyrede aktiverings-, kickoff-, kamp-, halvlegs-, fulltime- og collecting-skærme uden åbne dialoger. Klik akkumuleres i sessionens `demoTimeOffsetMs` og påvirker timere og animationsventetider. Kampresultatet optjener ikke ekstra tid efter fulltime.
- **Play winning reveal** findes kun på præmiesiden. Den starter eller genafspiller vindersekvensen, også når billetten allerede er vendt.
- Direkte tryk på kickoff-/kampskærmene udfører `ADVANCE_MATCH`. Denne genvej er bevaret og er også aktiv med `demo=0`.
- Fulltime-preset via demo-navigation giver 86:32 og 86 lodder. Et fuldt normalt simuleret kampforløb giver 90 minutter og 90 lodder.
- `DEMO_TIME`-preset og ignorering af ældre `variant`-data er bevaret, fordi sessionstestene bruger dem.

## Animation, lyd og deling

Swipe har fire tilstande og tastaturalternativ. Aktivering og fulltime bruger lokale GIF'er. Collecting entries viser en GIF i 3,8 sekunder før resultatet; resultatet er allerede beregnet fra sessionen, og der køres ikke en backend-lodoptælling.

Normalflip har cirka 1,20 sekunders bevægelse. Vinderflip har cirka 1,56 sekunder samt efterfølgende lys og konfetti. Vinderbillettens mørke præmieflade, signerede trøje og `YOU WON.`-overskrift er en særskilt visning. Klik låses under flip; navigation/unmount afbryder sekvensen. Reduced motion viser direkte sideskift og skjuler de dekorative effekter.

`activated.mp3` afspilles ved gennemført swipe; et tresekunders uddrag fra sekund 2–5 af `crowd-roar.mp3` bruges ved aktiveringsbekræftelse og vinderafsløring. `ticket-flip.mp3` starter ved vendingen og afgrænses til 0,95 sekunder normalt / 1,2 sekunder ved sejr. Lyd er som standard til. En diskret mute/unmute-knap på FanModus-skærmene gemmer valget i localStorage. Mute stopper både igangværende og ventende cues; unmute genafspiller ikke tidligere lyd. Knappen er skjult på BVB-menuen og ved åbne dialoger. Browserens lydsystem åbnes ved brugerinteraktion, og fejl håndteres uden at blokere UI'et.

`AUTO_SHARE` er aktuelt `true` og åbner kampbilletten 900 ms efter takkesiden; dette er ikke begrænset til demo-mode. Kampbilletten kan også åbnes via Dortmund-logoet. Deling eksporterer en **1170 × 1950 PNG** med lokale billetassets og aktuelle sessionstal. Canvas-eksporten er en særskilt rendering, ikke et DOM-screenshot. Web Share bruges ved filunderstøttelse; ellers downloades billedet. Appen poster ikke direkte til Instagram.

## Design, assets og tilgængelighed

BVB-logo, stadion-/publikumsfotos, signeret trøje, billetgrafik, teksturer, papir, penselstrøg og andre grafiske lag er tilføjet lokalt under `public/`. Modstanderlogoet kommer fra kampdata. Assetstier findes både i designmoduler og direkte i komponenter. Generiske fallback-definitioner i `lib/assets.js` er ikke en liste over manglende hovedassets.

Fonte indlæses med `next/font/local` fra tabsfrit komprimerede WOFF2-filer. De oprindelige TTF-filer er bevaret som kilder. `scripts/download-fonts.py` er bevaret som et manuelt hjælpeværktøj til de oprindelige globale fonte; det regenererer hverken alle de senere tilføjede fonte eller WOFF2-varianterne og køres ikke ved build.

Skærmene bruger overvejende et 390 × 844 referencecanvas med absolutte koordinater. `FigmaScreen` skalerer efter bredde; intro og aktivering har tilsvarende egne wrappers. Menuen bruger fast 390 × 800 indhold under statusbaren. Desktop med mus/trackpad bruger en centreret 390 × 844-ramme, skaleret efter tilgængelig plads. `PreviewFit` tilpasser højden af indhold og dialoger; swipe normaliserer pointerkoordinater efter den renderede skala.

Semantiske knapper, fokusmarkeringer, Enter/Space til swipe, dialogernes fokusfælde/Escape/returfokus, tekstfeedback og reduced motion er implementeret. Takkesidens ringe roterer med uret i et 40-sekunders loop og står stille ved reduced motion. Timere har `role="timer"` uden løbende live-oplæsning hvert sekund. Dette er ikke en erklæring om fuld tilgængelighedsgodkendelse.

## Tests og verificering

Se [README](../README.md#checks) for det aktuelle testsetup: **53 tests** fordelt på session, swipe, billetflip, lyd og viewportgeometri. Lyd- og animationstestene bruger simuleringer; geometritestene aflæser ikke browserens DOM. Lint og produktionsbuild er separate checks.

Tidligere udviklingskontroller har omfattet isolerede Chrome-forløb for billetflip, vinder-demo, reduced motion og demo-uret. Der findes ikke en indchecket browser-testsuite. De automatiserede checks beviser ikke Safari-, skærmlæser-, Web Share-, database- eller pixelidentisk Figma-adfærd.

## Bevarede begrænsninger

Denne oprydning ændrer ikke appens adfærd:

- Kampforespørgslen kan efter kickoff vælge en anden kamp eller ingen kamp. Sessionen er ikke bundet til et match-id.
- Der er ingen offline-fallback for kampdata. Demo-panelet vises ikke i den indledende fejlgren uden match.
- Skjulte faseskiftknapper er stadig aktive uden synligt demo-panel.
- Klokkeslæt og afledte tidsværdier udstilles i en særskilt Context. Kun komponenter, som bruger `useFanModusClock`, abonnerer på klokkeopdateringer; sessionens faseskift opdaterer fortsat navigationen.
- Sessiongendannelsen validerer ikke alle felters typer og tilladte værdier.
- Smalle skærme, tekstforstørrelse og klikområder kræver manuel kontrol; faste koordinater og clipping er bevaret.
- Eksterne logoer kan kræve CORS-håndtering for at kunne eksporteres fra Canvas. Web Share skal kontrolleres på de konkrete browsere.
- Lydpreload har ingen automatisk retry efter fejl, og en cue kan opgives efter 200 ms.

## Manuel kontrol før aflevering

1. Kontrollér miljøkonfiguration, læseadgang og en kommende Supabase-kamp.
2. Gennemgå onboarding og deaktiverede menu-/præmieknapper.
3. Afvis/godkend simuleret lokation; test kort swipe, fuldt swipe og Enter/Space.
4. Kontrollér kickoff fra 60:00, fortsat nedtælling og genindlæsning.
5. Klik hurtigt ti gange på +1 min; kontrollér ti minutters forskydning, faseskift og uændret optjening i pausen.
6. Gennemgå fulltime, collecting entries og resultat/takkeside. Kontrollér ringrotation og lyde.
7. Test PNG-download og Web Share med det faktiske modstanderlogo.
8. Test taberflip, flip tilbage, vinder-demo, genafspilning og navigation ud af præmiesiden.
9. Test fejl/loading/retry, keyboard og reduced motion.
10. Kontrollér mobilbredder, kort viewport og desktop-preview. Sammenhold referenceformatet med Figma.
