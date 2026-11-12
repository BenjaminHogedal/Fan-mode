# Implementeringsrapport

## Leveret

Hele prototypen er implementeret i det eksisterende JavaScript/App Router-projekt med engelske UI-tekster. Flow: BVB-menu → introduktion → How it works → præmier → lokation → swipe → aktivering → bekræftelse → kickoff → første halvleg → halvleg → anden halvleg → full time → optælling → resultat → tak → delingsvisning → præmieafsløring → menu.

Derudover: loading, forbindelsesfejl, aktiveringsfejl, afvist lokation, retry, matchstatistik og låseskærmsmockup. Demo-panelet giver adgang til alle tidsfaser og fejl. Præmier og data er illustrative. Ingen GPS, login, backend, lyd eller device-overvågning er nødvendig.

## Arkitektur og valg

- `lib/fanmodus.js`: central flowmodel, ren reducer, fasegrænser, tidsstempelberegninger og valideret sessiongendannelse.
- `context/FanModusContext.jsx`: hydration, localStorage og oprydning af interval/visibility-listener. Lodder er afledt af tiden, så dobbeltlagret state ikke divergerer.
- `components/screens`: før, under og efter kampen. UI, animationer og overlays ligger i separate mapper.
- `lib/assets.js`: ét sted at indsætte lokale originale assetstier. Asset-komponenten bruger Next Image, når en fil tilføjes.
- `lib/motion.js`: A/B/C og automatisk deling (`AUTO_SHARE`).
- `lib/share.js`: lokal Canvas-rendering til en 1080 × 1350 PNG. Eksporten har samme data og visuelle tema som previewkortet; det er ikke et pixelidentisk DOM-screenshot. Ingen eksportdependency er nødvendig.
- Skrifttyperne Bebas Neue, Space Grotesk og Barlow Condensed er hentet fra Google Fonts med OFL-licenser og selvhostet via next/font/local. Første build med next/font/google kunne ikke hente dem i sandboxen. Lokale filer gør senere builds og demo uafhængige af fontnetværk. Regenerering: `python3 scripts/download-fonts.py`.
- Den oprindelige Tailwind/Turbopack CSS-loader er fjernet fra next.config.mjs. Prototypen bruger almindelig CSS; den ubrugte loader krævede en portbaseret hjælpeproces, som miljøet blokerede. Øvrig Next-konfiguration og eksisterende dependencies er bevaret.
- Halvlege varer 45 minutter, pausen 15 minutter og kickoff starter ved 34:20. Demo-spring bruger sammenhængende presets. Full-time-preset og knappen til 86:32 giver præcis 86 lodder og fryser resultatet.
- Sessioner i en afbrudt aktiveringsanimation gendannes til aktiveringsskærmen. En ny aktivering nulstiller billetafsløringen.

## Tilgængelighed og layout

Mobile-first, 100dvh, safe areas, fleksibel bredde op til 430 px og scrollbar ved kort viewport. Synlige fokusmarkeringer, semantiske knapper, tastaturalternativ til swipe, modal focus trap/Escape/returfokus og tekstfeedback. Reduced motion understøttes i Motion og CSS. Store timere er ikke i aria-live, så skærmlæsere ikke afbrydes hvert sekund.

## Verificeret i miljøet

- `npm run lint`: bestået.
- `npm test`: 8 tests bestået. Dækker lokationskrav, timestamps, halvlegspause, fuld baggrundsindhentning, persistens, ugyldig session, 86:32/86-resultat og billet/reset.
- `npm run build`: bestået; `/` prerenderes statisk.
- Eksisterende Next dev-server på `http://localhost:3000/?demo=1`: HTTP 200. Den eksisterende server blev bevaret.

## Ikke verificeret visuelt

Browserkontrollen kunne ikke initialiseres: værktøjets sandbox-metadata mangler `sandboxPolicy`. Derfor er hele klikflowet, faktisk finger-swipe, billeddownload, Web Share, skærmlæser og screenshots ved 375 × 812, 390 × 844 og 430 × 932 **ikke browser-verificeret**. Implementering og modeltests erstatter ikke denne kontrol. Der er ikke lavet screenshots eller påstået pixelmatch med Figma, da der ikke er leveret Figma-frames eller originale assets.

## Manuel gennemgang før eksamen

1. Åbn `/?demo=1&variant=b`, vælg Reset flow og gennemgå onboarding.
2. Afvis lokation, prøv igen, godkend den simulerede lokation.
3. Test både kort swipe, fuldt swipe og Enter på håndtaget.
4. Spring til kickoff; vent lidt; genindlæs og bekræft timerens fortsættelse.
5. Spring til halvleg; bekræft at lodderne ikke vokser; gå til anden halvleg.
6. Vælg 86:32 / 86 entries, fortsæt til tak, luk den automatiske delingsvisning.
7. Åbn deling igen; gem PNG; prøv delingsmenu på en understøttet mobil.
8. Åbn præmiebilletten, flip, tryk igen og genindlæs; resultatet skal forblive afsløret.
9. Test alle fejl, retry, loading og låseskærm i panelet.
10. Gentag ved 375 × 812, 390 × 844 og 430 × 932, tastatur og reduced motion.
11. Sammenlign `variant=a`, `variant=b`, `variant=c`. Skjul panelet med `demo=0`.

## Originale assets der mangler

BVB- og modstanderlogo, stadionfoto/illustration, signeret trøje, kampbilletter og merchandise. Derudover kan penselstrøg, pile, tape, håndtegnede cirkler, krone og færdig delingsgrafik erstatte simple CSS-/Lucide-elementer efter behov. Der anvendes ingen tilfældige internetbilleder eller imitationer af officielle logoer.

## Desktop-ramme (opdatering)

Desktop med mus/trackpad (`hover: hover` og `pointer: fine`) bruger nu `DesktopViewport`: en 390 × 844-ramme skaleres med `min(1, availableWidth / 390, availableHeight / 844)` og centreres i 100dvh med 16 px luft. Wrapperen reserverer præcis den skalerede plads. ResizeObserver og visualViewport-resize genberegner størrelsen. Touch/mobile følger fortsat det naturlige layout uden transform.

Den transformerede ramme indeholder fixed overlays; demo-knappen er absolut positioneret i appen. Appens højde og viewportbaserede typografi bruger referencekoordinater på desktop. `PreviewFit` tilpasser fælles skærm-/dialogindhold, hvis en eksisterende skærm er højere end pladsen, så knapper ikke klippes eller kræver scrolling. Motion-animationerne har egne, uændrede transforms. Swipe normaliserer pointerkoordinater efter den faktisk renderede skala (inklusive indholdstilpasningen).

Geometrien testes ved 1440 × 900, 1440 × 740, 1280 × 720, 1024 × 600, 800 × 450, 600 × 500, 360 × 640 og 1920 × 1080. Dette er beregningstests, ikke browser-rendering. Browser-skillens forbindelse fejler fortsat med manglende `sandboxPolicy`, så faktisk visuel resize, klik/swipe og overlays er ikke browser-verificeret.

## Referencebaseret startflow

Menu, intro, How it works, præmier, aktivering og lokationsdialog er opdateret efter den vedlagte startflow-reference. Menuen bruger mørke felter og gul bundnavigation; onboarding bruger gule penselstrøg, lyse papirstrimler, cirklede trin og en papir-CTA. Aktivering har centralt power-symbol, 1 minut = 1 lod og en afrundet swipekontrol. FanModus-navnet og de engelske UI-tekster bevares.

`FanModusWordmark` er en enkel tekstplaceholder, ikke et officielt sponsorlogo. `stand-placeholder.svg` og `jersey-placeholder.svg` er originale, lokale vektorillustrationer, som udskiftes via `lib/assets.js` med de rigtige stadionfotos og produktassets. Lokationsdialogens systemblå farve er afgrænset til iOS-simuleringen. Dialogen siger udtrykkeligt, at den ikke anmoder om GPS; begge tillad-knapper godkender den samme lokale demosimulering, og afvisning åbner den eksisterende retry-tilstand.

De øvrige menufelter viser tydeligt afgrænsede placeholders; FanModus er det komplette flow. Præmieskærmens See all prizes åbner en oversigt og kan lukkes med tastatur. Browser-verifikation er fortsat begrænset af den tidligere dokumenterede værktøjsfejl.
