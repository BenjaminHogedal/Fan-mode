# BVB FanModus

Interaktiv mobile-first eksamensprototype bygget med Next.js App Router, JavaScript, React og Motion for React.

## Start lokalt

```bash
npm install
npm run dev
```

Åbn [localhost:3000/?demo=1](http://localhost:3000/?demo=1).

Demo-panelet åbnes med **DEMO** nederst til højre. Spring gennem kampens faser eller vælg **Set 86:32 / 86 entries** for et færdigt resultat. Ingen GPS, login eller backend er nødvendig.

- `?demo=1`: vis demo-controls og automatisk deling fra takkesiden.
- `?demo=0`: skjul demo-controls.
- `?demo=1&variant=a`: minimal motion.
- `?demo=1&variant=b`: balanced (standard).
- `?demo=1&variant=c`: expressive.

Demo er som standard slået til under `npm run dev`. Produktionsvisning bruger `?demo=1` ved demonstration.

## Checks

```bash
npm run lint
npm test
npm run build
npm start
```

## Dokumentation

- [Implementering, status og begrænsninger](docs/implementation.md)
- [Dan Saffers microinteraction-model](docs/microinteractions.md)

Assets udskiftes centralt i `lib/assets.js`. Automatisk åbning af delingsvisningen styres af `AUTO_SHARE` i `lib/motion.js`.

Lokation, telefonfri registrering, kamp og præmieresultat er simulerede. Deling bruger Web Share API, hvis fil-deling understøttes; ellers downloades en PNG. Browseren poster ikke direkte på Instagram.
