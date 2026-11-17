# BVB FanModus

Interaktiv eksamensprototype i Next.js App Router, JavaScript, React og Motion for React. Appen kombinerer Supabase-kampdata med et lokalt simuleret kampforløb og en Figma-baseret brugergrænseflade.

## Start lokalt

```bash
npm install
```

Opret `.env.local` i projektets rod og angiv projektets Supabase URL og **publishable key**:

```makefile
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

Miljøfiler ignoreres af Git. Brug ikke en service-role-nøgle i disse variabler.

Appen læser fra tabellen `matches` med felterne `id`, `opponent_name`, `opponent_short`, `opponent_logo`, `kickoff`, `stadium`, `home_score` og `away_score`. Forespørgslen skal have læseadgang og kunne finde en kamp med kickoff nu eller senere. Modstanderlogoet skal være en gyldig billedsti eller URL, og navn/stadion bruges i UI'et som strenge. Databaseopsætning, RLS-policies og migrations er ikke inkluderet i projektet.

```bash
npm run dev
```

Åbn [localhost:3000/?demo=1](http://localhost:3000/?demo=1). **Også demoen kræver Supabase-kampdata.** Manglende konfiguration, netværksfejl eller ingen kommende kamp giver en fejlvisning med retry.

## Hvad er reelt, og hvad er simuleret?

| Reel funktionalitet | Simuleret/lokal funktionalitet |
| --- | --- |
| Serverbaseret læsning af kampdata fra Supabase | Lokationsdialog og stadiongodkendelse uden GPS |
| Navigation, swipe, animationer og lydeffekter | Telefonfri registrering og kampens fremdrift |
| Session og demo-tidsforskydning i localStorage | Lodoptjening baseret på den lokale timer |
| PNG-eksport og Web Share ved filunderstøttelse | Kampstatistik og præmieafgørelse |
| Loading- og fejlfeedback | Vinderafsløring, som kan afspilles fra demo-panelet |

Der gemmes ikke sessioner, lodder eller præmieafgørelser i Supabase. Der er ingen login-, GPS- eller device-overvågning. Deling bruger browserens delingsmenu eller PNG-download; appen poster ikke direkte på Instagram.

## Flow og demo

Flowet går fra BVB-menu gennem intro, instruktion, præmier og aktivering til kickoff, første halvleg, halvleg, anden halvleg, fulltime, collecting entries, resultat, tak/deling og præmieafsløring.

- Kun FanModus-feltet er aktivt på forsiden. De øvrige felter og bundnavigationen er deaktiveret. Forsiden har ingen tilbagepil og viser en studieprojektmarkering.
- CTA'erne på intro og How it works har en overgang fra højre mod venstre. `See all prizes` er deaktiveret; `Get match ready` fortsætter til aktivering.
- En ny kickoff-nedtælling starter på **60 minutter**, uafhængigt af databasekampens kickoff. Halvlegene varer 45 minutter, pausen 15 minutter. Kun aktive halvlege giver telefonfri tid; ét fuldt minut giver ét lod.
- Tryk på kickoff-/kampskærmene går direkte til næste fase. Denne genvej findes også, når demo-panelet er skjult.
- `?demo=1` viser demo-panelet. `?demo=0` skjuler det. Under udvikling vises det som standard, medmindre `demo=0` bruges.
- **DEMO** åbner `Previous screen`, `Next screen` og `Reset flow`. De øvrige knapper viser fejl-/loadingtilstande.
- **+1 min** vises kun ved aktivering, kickoff, aktive halvlege, halvleg, fulltime og collecting entries, når ingen dialog er åben. Hurtige gentagne tryk akkumuleres; tidsforskydningen gemmes lokalt.
- **★ Play winning reveal** vises kun på præmiebillettens side. Den kan genafspille en lokal vinderudgave med signeret trøje, lys, konfetti og lyd. Vinderudgaven gemmes ikke som et reelt præmieresultat.
- Automatisk åbning af delingsvisningen på takkesiden styres af `AUTO_SHARE` i `lib/motion.js`. Den er aktuelt slået til, også når demo-panelet er skjult.

Lyd er som udgangspunkt slået til. Et diskret højttalerikon øverst til højre på FanModus-skærmene skifter mute/unmute; valget gemmes i localStorage. Mute stopper igangværende og ventende lyd, og unmute genafspiller ikke tidligere cues. Knappen skjules på BVB-menuen og under åbne dialoger. Browserens lydsystem åbnes ved brugerinteraktion; mislykket afspilning må ikke blokere flowet. Systemets reduced-motion-præference understøttes.

## Checks

```bash
npm run lint
npm test
npm run build
npm start
```

Det aktuelle testsetup bruger Node.js' indbyggede test runner og **53 tests**:

| Fil | Antal | Omfang |
| --- | ---: | --- |
| `tests/session.test.mjs` | 17 | Faser, timers, lokation, persistens og demo-tid |
| `tests/swipe-sequence.test.mjs` | 5 | Swipe-rækkefølge, timing, afbrydelse og reduced motion |
| `tests/ticket-flip.test.mjs` | 5 | Normal-/vindersekvens, lydtidspunkt og afbrydelse |
| `tests/sounds.test.mjs` | 17 | Preload, unlock, overlap, klipning/fade, mute og gemt lydvalg |
| `tests/viewport.test.mjs` | 9 | Referencegeometri ved forskellige desktopstørrelser |

Tests bruger rene modeller og simuleret lyd-/animationsadfærd. De erstatter ikke browser-, touch-, skærmlæser-, Supabase- eller Web Share-tests. Node kan vise en `MODULE_TYPELESS_PACKAGE_JSON`-advarsel; den stopper ikke de eksisterende tests.

## Arkitektur og dokumentation

`app/page.js` henter kampdata ved request-time efter `connection()`, inden for en `Suspense`-grænse. Med projektets Cache Components-konfiguration kan fallbacken indgå i en statisk shell; kampdata er ikke en ubetinget statisk eksport. De øvrige skærme styres lokalt gennem React Context og reduceren i `lib/fanmodus.js`.

- [Implementering og kendte begrænsninger](docs/implementation.md)
- [Microinteractions, timing og lyd](docs/microinteractions.md)
- [Intro](docs/figma-intro.md), [onboarding](docs/figma-onboarding.md), [aktivering](docs/figma-activation.md), [kickoff](docs/figma-kickoff.md) og [kampvisninger](docs/figma-live-match.md)

Figma-assets ligger lokalt i `public/`. Designfiler i `lib/` indeholder assetstier og referencekoordinater; komponenter refererer også direkte til lokale assets. `lib/assets.js` indeholder enkelte fælles logo-/fallback-definitioner, ikke alle projektets grafiske assets. Fonte selvhostes via `next/font/local`.

## Performance

Se [performancegennemgangen](docs/performance.md) for tabsfri assetkomprimering, Context-opdeling, lokal før/efter-måling og bevarede begrænsninger.
