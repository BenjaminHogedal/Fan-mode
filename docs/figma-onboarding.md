# Onboarding — How it works og Win prizes

Figma-referencer: `41:10113` og `41:10114` i `OhrxqSyK9D1DtvUuulESvV`.

## Design og komponenter

`HowItWorks.jsx` og `Prizes.jsx` bruger de lokale SVG'er og fotos i `public/images/onboarding`, `public/icons/onboarding` og `public/illustrations/onboarding`. Fælles Vodafone- og papirassets genbruges.

`lib/onboarding-design.js` samler placeringer, størrelser, Figma-nodehenvisninger og transformationsmatricer. `FigmaLayer` anvender disse på lagene, og `FigmaScreen` skalerer referenceformatet 390 × 844 efter containerens bredde. Styling ligger i `Onboarding.module.css`, uden Tailwind-utilities.

Stadionfoto, signeret trøje, cirkler, papirstrimler, underline, pile, kategoriikoner og kronens SVG-lag er tilføjet. Skrifttyper indlæses lokalt: Bebas Neue til overskrifter/labels og variabel Space Grotesk til brødtekst/wordmark.

## Aktuelle handlinger

- Introens `Get started` går til `how` med slide fra højre mod venstre.
- How it works-papirknappen går til `prizes` med samme overgang.
- `See all prizes` er **deaktiveret** og åbner ingen modal.
- `Get match ready` og pilen går til `activation`.
- CTA'er har trykfeedback og synligt tastaturfokus. Reduced motion reducerer skærmbevægelsen.

Appens fælles statusbar er uden for disse skærmes canvasindhold. Desktop-preview vælges med `(hover: hover) and (pointer: fine)`; denne media query angiver inputtype og er ikke i sig selv en hover-animation.

## Kontrol

Figma-nodehenvisninger og referencekoordinater er bevaret som designsporbarhed. Automatiske checks og det aktuelle testantal står i [README](../README.md#checks). Pixelmatch, font-rasterisering og tekstforstørrelse kræver manuel browserkontrol.
