# Intro — Figma 41:10112

Kilde: https://www.figma.com/design/OhrxqSyK9D1DtvUuulESvV/Dortmund-fanmodus---Eksamen-3.-Sem?node-id=41-10112

## Implementering

`components/screens/Intro.jsx` og `Intro.module.css` implementerer introen. `Get started` kalder parentens `onContinue` og går til `how` med en overgang fra højre mod venstre. BVB-logoet fungerer som en tastatur-/touchbetjenelig tilbageknap. Navigation og session ligger fortsat i den fælles app; statusbaren renderes separat i `AppContent`.

`lib/intro-design.js` samler lokale assetstier, node-id'er, dimensioner og Figma-matricer. Fotos, penselstrøg, pile, papir og sponsor-/klubgrafik ligger i `public/`. Der er ingen midlertidige download-URL'er i denne skærms assets.

## Referenceformat og fonte

- Referencecanvas: 390 × 844, sort baggrund, hvid brødtekst, gule penselstrøg og rød `#E60000` i FanModus-wordmark.
- Bebas Neue bruges til den store overskrift og CTA-tekst.
- Variabel Space Grotesk indlæses lokalt til wordmark og brødtekst.
- Absolutte placeringer og matricer bevarer collage, rotationer og overlap. ResizeObserver måler containerbredden og angiver `--intro-scale`.

## Referencekoordinater

Disse design-bounding boxes ved 390 × 844 følger de bevarede referenceplaceringer; de er ikke en aktuel browsermåling.

| Lag | x / y / bredde / højde |
| --- | --- |
| Stadionfoto | −155,130 / −35,000 / 629,959 / 452,468 |
| Øverste penselstrøg | 24,153 / 254,000 / 337,374 / 107,477 |
| Midterste penselstrøg | 54,753 / 339,500 / 281,145 / 89,564 |
| Nederste penselstrøg | 34,053 / 409,700 / 323,316 / 102,999 |
| Understregning | 86,639 / 480,738 / 279,207 / 59,738 |
| Brødtekst | 76 / 561,476 / 238 / 69 |
| Pil | 310 / 619 / 72,670 / 89,486 |
| CTA | 44,945 / 693,476 / 300,111 / 108,855 |

## Kontrol

Se [README](../README.md#checks) for lint, modeltests og build. Faktisk crop, fonte, CTA-overgang og klikflow skal sammenholdes med Figma i browseren. De bevarede koordinater er ikke en garanti for pixelidentisk rendering på alle platforme.
