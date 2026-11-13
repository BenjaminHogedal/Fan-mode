# Aktivering og vedvarende statusbar

Figma-frame: `41:10115`, swipe-komponent: `100:20903`, i filen `OhrxqSyK9D1DtvUuulESvV`.

## Implementering

Femte skærm (`activation`) er implementeret i `components/screens/Activation.jsx` med de originale power-/billet-SVG'er, Archivo Black Regular og Bebas Neue. Referenceformatet er 390 × 844. Aktivér-overskriftens slots er y=56/109, power-slotten er (123,213), 144 × 144, og swipe-slotten er (31,754,575), 328 × 60. De skrå regeltekster og billetikonet bruger Figma-matricerne. Produktnavnet forbliver FanModus i stedet for Figma-framens ældre FanMode-navn.

De seks swipe-/aktiveringsassets er hentet lokalt via curl fra Figma MCP. SVG-filerne beholder deres oprindelige rodmål. Loading-filen er en original animeret GIF; dens filendelse er rettet til .gif uden ændring af billedindholdet. Archivo Black kommer fra Google Fonts med OFL-licens vedlagt. Eksisterende øvrige skærme bruger fortsat deres tidligere fonte.

Lokationsdialogen åbnes efter ét sekund, som Figma-framens prototype angiver, hvis tilladelsen er ukendt. Power-symbolet kan også åbne den. Tilladelsen er fortsat simuleret; ingen GPS er nødvendig. Den eksisterende tilbageknap bevares som navigation ved siden af designets indhold.

## Swipe

MCP's `get_motion_context` returnerede ingen keyframe-animationer. Variantreaktionerne fra read-only `use_figma` er derfor brugt som grundlag:

1. **Initiate:** håndtag 40 × 40 ved x=8, y=10. Off-white originalskive og original chevron-mask. Kort swipe springer tilbage.
2. **Trigger:** efter mindst 82 % af den reelle bevægelsesafstand trækkes håndtaget helt til højre, pilen vendes. Smart-animation: 300 ms ease-out, derefter 200 ms ophold.
3. **Loading:** original GIF med tre prikker, 300 ms transition og 500 ms ophold.
4. **Completed:** gul baggrund, shine-transition og originalt sort flueben. 300 ms transition, 1 sekund ophold, derefter eksisterende aktiveringsflow.

`playSwipeSequence` styrer timingen. Callback aktiverer kun én gang, og en fejl/nulleret validering nulstiller kontrollen. AbortController rydder ventetider ved navigation eller unmount, også mens AnimatePresence holder den udgående skærm monteret. Motion-koordinater normaliseres efter både desktop- og canvasskalering. Enter/Space er tastaturalternativ. Reduced motion springer bevægelsestransitions over og erstatter GIF'en med statiske prikker.

## Statusbar

Én fælles iOS-statusbar i `AppContent` er fastgjort øverst i mobilrammen og ligger uden for AnimatePresence. Den er synlig på alle skærme, under loading, ved scrolling og over overlays. Introen har ikke længere en separat statusbar. Tid er 9:41, og de originale Wi-Fi-/batteriassets genbruges. Gul kampheader får sorte indikatorer; øvrige skærme og overlays får hvide. Dialogernes indhold får plads under statusbaren.

## Verifikation

Der er målrettede tests af swipe-sekvensens rækkefølge, prototype-tider, reduced motion, afbrydelse og valideringsfejl. Desuden køres de eksisterende sessions-/viewport-tests, lint og build. Browser-skillen fejler stadig før åbning med manglende `sandboxPolicy`, så faktisk finger-/musetræk, animation og visuel sammenligning er ikke browser-verificeret her.
