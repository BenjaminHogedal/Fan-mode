# Kampvisninger

Figma-referencer i `OhrxqSyK9D1DtvUuulESvV`:

- Første halvleg: `153:66`.
- Halvleg: `44:10136`.
- Anden halvleg: `44:10137`.

## Implementering

`components/screens/LiveMatch.jsx` indeholder `ActiveHalf` og `HalfTime`. Begge bruger `FigmaScreen`, lokal Digital Numbers-font, fælles `MatchChrome` og statusbar. Modstanderens navn og logo kommer fra Supabase-kampdata.

De aktive halvlege viser samlet telefonfri tid beregnet fra sessionens tidsstempler. Første og anden halvleg varer 45 minutter; halvlegen varer 15 minutter og giver ingen ekstra lodder. Pausen viser resterende tid med upolstret minut, f.eks. 9:48. Ét fuldt telefonfrit minut giver ét lod. Der måles ikke faktisk telefonbrug.

Direkte tryk på skærmene går til næste fase via `ADVANCE_MATCH`; der åbnes ikke en låseskærm. Genvejen findes også med skjult demo-panel. Den særskilte +1 min-knap flytter demo-uret 60 sekunder ad gangen, også ved hurtige gentagne klik. Den kan krydse fasegrænser og gemmer forskydningen lokalt.

## Grafiske lag og animation

Baggrunden i de aktive halvlege bruger `/images/match/chevron-tile.svg` som gentaget motiv med en periode på 94,4 px. CSS flytter baggrundspositionen én periode på 10 sekunder i et lineært loop. Det er en lokal gengivelse af motivet, ikke afspilning af en original Figma-video. Reduced motion stopper bevægelsen.

Halvleg bruger det lokale publikumsfoto med sin egen beskæring og placering. Kampheaderens gule gradient og logoer deles med kickoff. Referenceformatet er 390 × 844 med proportional canvasskalering og desktop-preview.

## Kontrol

Sessionstestene dækker tidsstempler, indhentning efter inaktiv fane, pause uden optjening, automatisk anden halvleg/fulltime og demo-tidsforskydning. Viewporttestene er beregningstests og beviser ikke den renderede geometri. Se [README](../README.md#checks) og den [manuelle kontrol](implementation.md#manuel-kontrol-før-aflevering).
