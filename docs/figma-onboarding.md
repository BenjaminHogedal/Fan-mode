# Figma — side 3 og 4

Kilder: frame `41:10113` (How it works) og `41:10114` (Win prizes), fil `OhrxqSyK9D1DtvUuulESvV`.

Begge frames er læst med Figma MCP get_design_context inklusive screenshots. Read-only use_figma-læsninger gav de præcise placeringer fra de levende komponentinstanser, tekststørrelser, matricer og SVG-slots. De oprindelige SVG'er og fotos er hentet uændret med curl til `public/images/onboarding`, `public/icons/onboarding` og `public/illustrations/onboarding`. Eksisterende identiske Vodafone- og papirassets genbruges.

`HowItWorks.jsx` og `Prizes.jsx` erstatter de tidligere placeholder-implementeringer. Placeringer ligger i `lib/onboarding-design.js`; almindelige CSS Modules bruges uden Tailwind. FigmaScreen tilpasser det fælles referenceformat 390 × 844 proportionalt til mobilbredden og desktop-rammen. Det fotograferede stadion, den signerede trøje, cirkler, papirstrimler, underline, pile, kategoriikoner og kronens fem originale SVG-lag er bevaret. SVG-rodmål ændres ikke; kronens kildekomponent skaleres som en samlet gruppe.

Bebas Neue Regular bruges til overskrifter/labels; den eksisterende korrekte variable Space Grotesk bruges i vægt 400 til brødtekst og wordmark. Produktnavnet FanModus bevares i instruktionsteksten, og mellemrummet i Figma-tekstens “thehigher” er rettet. Den faste iOS-statusbar er fortsat fælles for hele appen. Flowet er menu → intro → How it works → prizes → activation. Papirpilen går til prizes, See all prizes åbner den eksisterende modal, og Get match ready samt dens pil går til activation.

Alle CSS `:hover`-regler er fjernet, og der findes ingen whileHover/onMouseEnter/onMouseLeave-handlere i appens komponenter. Medieforespørgslen `(hover: hover) and (pointer: fine)` bevares udelukkende til at identificere desktop-preview; den tilføjer ingen hover-effekt. Touchfeedback og synligt tastaturfokus er bevaret.

Lokale assets er kontrolleret som ikke-tomme. Direkte SVG-slots er kontrolleret mod filernes originale rodmål. Eksisterende 22 tests består, og lint/build køres efter ændringerne. Browser-skillens forbindelse fejler fortsat før åbning med manglende sandboxPolicy, så rendering og faktisk klikforløb kan ikke bekræftes via browser-screenshot her.
