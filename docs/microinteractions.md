# FanModus — microinteractions

Den implementerede adfærd kan beskrives med Dan Saffers model: **Trigger → Rules → Feedback → Loops & Modes**. Tabellen beskriver koden, ikke en dokumentation af officielle eksamenskrav.

| Interaktion | Trigger | Rules | Feedback | Loops & Modes |
| --- | --- | --- | --- | --- |
| Swipeaktivering | Træk eller Enter/Space | Simuleret lokation godkendt; mindst 82 % af bevægelsesafstanden; én aktivering ad gangen | Håndtag, fading label, loading, flueben og `activated.mp3` | Kort swipe springer tilbage; valideringsfejl giver nyt forsøg; navigation afbryder |
| Intro-CTA'er | Get started / fortsæt fra How it works | Navigation til næste onboarding-skærm | WhileTap og sekventiel slide fra højre mod venstre | `AnimatePresence mode="wait"`; mindre bevægelse ved reduced motion |
| Loading | Hydration, ventende serverdata eller demo-knap | Ubestemt indikator; ingen måling af netværksprocent | Stadionlys, prikker og tekst | Stadionets fire faser looper; demo-loading lukkes efter 6,5 sekunder eller manuelt |
| Aktivering | Swipe-sekvensen er gennemført | Iscenesat visning, ikke en backendtransaktion | Progress-GIF, success-GIF og publikumslyd | 4,04 s progress + 2,44 s success; derefter kickoff; demo-tid kan forkorte ventetiderne |
| Kickoff | Kickoff-skærmen åbnes | Ny deadline på 60 minutter, gemt i sessionen | Digital nedtælling | Automatisk første halvleg; direkte skærmtryk kan springe fasen over |
| Kampens timer | Aktiv halvleg | Tidsstempler bestemmer forløbet; kun halvlegene giver tid | Telefonfri tid og lodder af fuldførte minutter | 45 min pr. halvleg; indhenter baggrundstid ved tick |
| Halvleg | Første halvlegs slutning eller fasespring | Optjening stopper | Gemte lodder og 15-minutters nedtælling | Automatisk anden halvleg; skærmtryk går videre straks |
| Fulltime og collecting | Kampens afslutning | Tid og lodder fryses | Fulltime-GIF i 4,04 s, collecting-GIF i 3,8 s, derefter resultat | Automatisk navigation; reduced motion eller fejl i post-match-billedet giver kortere ventetid; ingen backend-lodoptælling |
| Takkesidens ringe | Takkesiden vises | Logoet står stille | Langsom rotation med uret | 40 s lineært loop; standser ved reduced motion |
| Deling | Takkesiden eller tryk på logoet | `AUTO_SHARE` styrer automatisk åbning efter 900 ms, også uden demo-panel | Kampbillet, eksportstatus og PNG | Web Share ved filunderstøttelse, ellers download; Escape/luk/baggrund lukker dialogen |
| Normalt billetflip | Tryk på præmiebilletten | Lås under animationen; afsløring gemmes lokalt | Løft, 3D-vending, lysstrejf, impact og kort fliplyd | Ca. 1,20 s; kan vendes begge veje; reduced motion skifter direkte |
| Vinder-demo | Play winning reveal på præmiesiden | Lokal demovinder, ingen databaseafgørelse | Ekstra spin, mørk præmieflade, signeret trøje, YOU WON., lys, konfetti og publikumslyd | Ca. 1,56 s flip med eftereffekter; kan genafspilles; vinderstate er lokal for skærmen |
| +1 min | Demo-knap på tidsstyrede sider | Hvert tryk tilføjer 60 s til demo-uret; hurtige tryk akkumuleres | Timere, faser og animationsventetider opdateres | Gemmes ved genindlæsning; reset nulstiller; skjult på øvrige sider og ved dialoger |
| Retry | Fejlvisningens knap | Første datafejl genindlæser siden; offline/lokation håndteres i appen | Ny indlæsning, fortsat fejl eller lokationsdialog | Fejltilstande kan også vises manuelt fra demo-panelet |

## Timing og implementering

- `lib/activation-design.js`: swipe har 300 ms transitions og ophold på 200/500/1000 ms. Samlet normal swipe-sekvens er 2,6 s; reduced motion fjerner bevægelsestransitions.
- `lib/swipe-sequence.js`: aborterbare ventetider og valideret afslutning.
- `lib/ticket-flip.js`: normal anticipation/turn/landing på 0,24/0,62/0,34 s; vinder på 0,32/0,86/0,38 s. Afsløring sker efter halvdelen af turn-varigheden, ikke via en måling af den præcise rotationsvinkel.
- `useSessionTimeout`: aktiverings- og post-match-ventetider reagerer på demo-uret.
- `MotionConfig reducedMotion="user"`, `useReducedMotion` og CSS-media queries reducerer eller fjerner bevægelse. Flip har direkte sideskift; dekorative vinderpartikler skjules.

De centrale sekvenser bruger primært transform/opacity. Kampens chevrons bruger et loop med `background-position-y`; GIF'er afspilles som billedassets. Det er forskellige teknikker med forskellige performanceegenskaber.

## Lyd

Alle filer ligger i `public/sounds/`:

| Fil | Tidspunkt | Afgrænsning |
| --- | --- | --- |
| `activated.mp3` | Når det godkendte swipe gennemføres og sekvensen starter | Filens almindelige afspilning |
| `ticket-flip.mp3` | Ved vendingen efter anticipation, i begge retninger | 0,95 s normalt / 1,2 s ved vinderflip med fade-out |
| `crowd-roar.mp3` | FanMode activated og vinderafsløring | Sekund 2–5 med kort fade-in/-out |

Lyd er aktuelt slået til uden mute/unmute-knap eller gemt lydpræference. `SoundProvider` forsøger at åbne lydsystemet ved pointer-/tastaturinteraktion. Controlleren forhindrer overlappende afspilning af samme cue, kan genstarte et cue og annullerer ventende cues ved stop. Den opgiver en cue efter 200 ms frem for at afspille den langt efter animationen. En skjult fane stopper lydene.

Se [README](../README.md#checks) for de aktuelle 46 model-/sekvenstests og [implementeringsrapporten](implementation.md) for simuleret funktionalitet og begrænsninger.
