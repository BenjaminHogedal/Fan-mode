# FanModus — microinteractions

Alle interaktioner følger Dan Saffers model: Trigger → Rules → Feedback → Loops & Modes.

| Interaktion | Trigger | Rules | Feedback | Loops & Modes |
| --- | --- | --- | --- | --- |
| Swipeaktivering | Træk håndtaget eller tryk Enter/Space | Simuleret lokation skal være godkendt; mindst 82 % af den målte bevægelsesafstand; kun én aktivering | Håndtag følger fingeren, label fader, aktivering starter | Kort swipe springer tilbage. Fejl tillader nyt forsøg |
| Loading | Hydration eller en ventende operation | Ubestemt indikator; ingen opdigtet netværksprocent | Stadionlys og prikker; langsom-forbindelse-tekst efter 5 sekunder | Demo lukkes efter 6,5 sekunder eller manuelt. Rigtige fejl har særskilt tilstand |
| Aktiveringsbekræftelse | Gennemført aktiveringsanimation | Iscenesat proces; adskilt fra reel loading | Ring, 0–100 %, derefter flueben og bekræftelse | Går til kickoff; kan fortsættes straks med knap |
| Kampens timer | Kickoff / anden halvleg | Tidsstempler bestemmer forløb; kun aktive halvlege giver tid | Samlet telefonfri tid og fuldførte minutters lodder | Gemmes lokalt; baggrundsfane indhentes ved næste tick |
| Halvleg | Første halvlegs tidsgrænse eller demo-spring | Optjening stopper; tidligere tid bevares | Særskilt stadionmotiv, gemte lodder og nedtælling | Starter automatisk anden halvleg; pausen giver ingen lodder |
| Full time | Kampens afslutning | Optjening fryses | Stor typografi, slutresultat og kort transition | Kan springes over; reduced motion mindsker bevægelsen |
| Lodoptælling | Efter full time | Resultatet er allerede beregnet: floor(seconds / 60) | Billetter og animeret tæller | Fortsætter automatisk eller via knap; ingen backendproces |
| Deling | Takkesiden / delingsknap | Automatisk åbning i demo styres af AUTO_SHARE; rigtige sessionstal | Matchkort, PNG-download, tekststatus | Luk med Escape/X/baggrund. Web Share ved filunderstøttelse, ellers download |
| Billetflip | Tryk på gul billet | Kun første tryk ændrer afsløringen; samme billetdimensioner | 600 ms rotateY i perspective; tekst opdateres | Afsløret billet gemmes; reduced motion skifter uden rotation |
| Retry | Fejltilstandens knap | Forbindelse kontrolleres igen; lokation kan simuleres på ny | Ny aktivering, lokationsdialog eller fortsat offlinebesked | Ingen blindgyde; kan altid lukke og vende tilbage |

## Motion

Animationerne følger de implementerede Figma-designs. Demo-panelet indeholder Previous screen, Next screen og Reset flow; der er ingen A/B/C-valg, og tidligere variant-queryparametre påvirker ikke appen.

Systemets reduced-motion-præference har forrang. CSS-tokens og fælles motion-defaults ligger i `app/globals.css` og `lib/motion.js`. Konkrete Figma-interaktioner bruger deres egne aflæste tider. Ingen lyd er implementeret.
