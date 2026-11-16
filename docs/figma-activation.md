# Aktivering, swipe og statusbar

Figma-reference: frame `41:10115`, swipe-komponent `100:20903` / `100:21113`, fil `OhrxqSyK9D1DtvUuulESvV`.

## Implementering

`components/screens/Activation.jsx` bruger de lokale power-/billet-SVG'er, Archivo Black og Bebas Neue. Referenceformatet er 390 × 844. Overskrifterne har y=56/109, power-symbolet står ved (123,213), 144 × 144, og swipe-slotten ved (31,754.574707), 328 × 60. De skrå regeltekster og billetikonet bruger Figma-matricer. Assetstier og swipe-konstanter ligger i `lib/activation-design.js`.

Lokationsdialogen åbner efter ét sekund, hvis tilladelsen er ukendt. Power-symbolet åbner også dialogen. Godkendelse ændrer lokal sessionstate; der kaldes ikke GPS. Begge tillad-knapper giver samme simulerede godkendelse. Afvisning viser lokationsfejlen med retry.

## Swipe og aktivering

| Tilstand | Adfærd |
| --- | --- |
| Initiate | 40 × 40-håndtag ved x=8/y=10; chevron-mask og tekst. Kort swipe springer tilbage |
| Trigger | Mindst 82 % af den målte bevægelsesafstand; håndtaget går helt til højre; 300 ms transition + 200 ms ophold |
| Loading | Lokal loading-GIF; 300 ms transition + 500 ms ophold |
| Completed | Gul baggrund, shine og sort flueben; 300 ms transition + 1 s ophold; derefter aktiveringsskærm |

`SwipeToActivate` bruger MotionValue til håndtagets placering og labelens opacity. `playSwipeSequence` styrer forløbet og kontrollerer validering ved afslutningen. Ref-lås forhindrer dobbeltaktivering, og AbortController afbryder ventetider ved navigation/unmount. Pointerkoordinater normaliseres efter desktop- og canvasskalering. Enter og Space er tastaturalternativer.

`activated.mp3` starter ved gennemført, godkendt swipe. `ActivationAnimation` viser derefter den lokale progress-GIF i 4,04 s og success-GIF i 2,44 s. Ved success afspilles sekund 2–5 af `crowd-roar.mp3` én gang. Det er en iscenesat aktivering, ikke en Supabase-skrivning. `useSessionTimeout` lader demoens +1 min-knap påvirke animationsventetiderne.

Reduced motion fjerner swipe-bevægelsens transitions og erstatter swipe-GIF'en med statiske prikker. De efterfølgende aktiveringsskærme bruger tekst og kortere ventetid.

## Fælles statusbar

`StatusBar` renderes i `AppContent` uden for skærmenes AnimatePresence. Tidspunktet 9:41 og signal-/Wi-Fi-/batterivisningen er dekorativ prototype-chrome, ikke en måling af enhedens status. Kampvisninger kan få mørke indikatorer; andre skærme bruger lyse. Statusbaren skjules, når delingsdialogen er åben. Introen har ikke sin egen separate statusbar.

## Kontrol

Swipe-testene dækker rækkefølge, timing, reduced motion, afbrydelse og valideringsfejl. De faktiske koordinater, crop og gestures skal fortsat kontrolleres i browseren. Se [README](../README.md#checks) for det samlede testsetup og [microinteractions](microinteractions.md) for lyd og timing.
