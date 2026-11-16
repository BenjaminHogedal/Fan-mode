# Kickoff — nedtælling fra 60 minutter

Figma-reference: frame `43:10124`, 390 × 844, fil `OhrxqSyK9D1DtvUuulESvV`.

`components/screens/Kickoff.jsx` bruger det lokale publikumsfoto, fælles `MatchChrome`, mørke statusindikatorer og lokale Digital Numbers-/Inter-fonte. Dortmund-logoet er lokalt; modstanderlogo og navn kommer fra den valgte Supabase-kamp. Modstanderen er ikke hardkodet til Freiburg.

## Timer og handlinger

Når en ny kickoff-skærm åbnes, opretter `navigate` i `lib/fanmodus.js` en deadline **60 minutter** fra sessionens aktuelle tidspunkt. Timeren viser `60:00` ved start og tæller ned. Genindlæsning gendanner den eksisterende deadline frem for at starte en ny time.

Nedtællingen er en lokal simulering og følger ikke direkte databasekampens kickoff. Ved nul skifter sessionen automatisk til første halvleg. Direkte tryk på skærmen går også til første halvleg via `ADVANCE_MATCH`; det åbner ikke en låseskærm. Denne genvej er bevaret, også når demo-panelet er skjult.

Demoens +1 min-knap reducerer den resterende tid med et minut pr. klik, kan krydse kickoff og håndterer hurtige gentagne tryk. Tidsforskydningen gemmes i sessionen. Demo-panelet kan desuden navigere til tidligere/næste skærm og nulstille flowet.

## Layout og kontrol

Skærmen bruger `FigmaScreen` og det fælles desktop-preview. Designets faste koordinater, gradient og typografi er bevaret. Timerværdien har `role="timer"` og en beskrivende label.

Sessionstestene dækker 60-minutters deadline, genindlæsning, automatisk faseskift og demo-minutter. Se [README](../README.md#checks) for aktuelle checks. Viewportberegninger er ikke en erstatning for manuel browserkontrol.
