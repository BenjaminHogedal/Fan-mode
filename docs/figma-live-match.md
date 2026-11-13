# Live match screens

References in Figma file `OhrxqSyK9D1DtvUuulESvV`:

- First half: `153:66`
- Half-time: `44:10136`
- Second half: `44:10137`

All three screens use the existing 390 × 844 responsive canvas and persistent iOS status bar. `MatchChrome` shares the original crests and yellow gradient with kickoff. Digital Numbers is served locally.

The active screens display the existing accumulated phone-free time; halftime displays the remaining break time, with an unpadded minute matching the reference. The session reducer, automatic phase transitions, entry calculation and demo controls are unchanged. Tapping an active screen opens the existing lock preview.

Figma's chevrons are a video fill that design context does not expose as a video download. The isolated background layer was exported via MCP as a 390 × 708 PNG. For seamless movement, the chevron motif is reproduced as a repeating SVG tile with a 94.4px vertical period. CSS moves the background by exactly one tile every 10 seconds, so the loop endpoints are identical. Reduced-motion support is retained; this is not the source video's exact playback. The halftime photo reuses the identical original crowd asset with the frame's different crop and placement.

Verification: lint, 22 existing tests, production build and whitespace checks. Browser verification could not run because the browser tool fails during initialization with `missing field sandboxPolicy`.
