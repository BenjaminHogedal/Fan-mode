// Erstat null med en lokal filsti. Alle visuelle placeholders går gennem Asset.
export const assets = {
  bvb: { src: null, label: 'BVB' },
  stand: { src: '/illustrations/stand-placeholder.svg', label: 'Stadium atmosphere illustration placeholder' },
  jersey: { src: '/illustrations/jersey-placeholder.svg', label: 'Signed BVB jersey placeholder' },
  tickets: { src: null, label: 'Match tickets placeholder' },
  merch: { src: null, label: 'BVB merchandise placeholder' },
};

// Combine the fixed BVB crest with opponent details supplied by the selected match.
export function getMatchdayHeaderAssets(match) {
  return { bvb: '/images/intro/bvb.webp', opponent: match.opponent_logo };
}

export function getOpponentAsset(match) {
  return { src: match.opponent_logo, label: match.opponent_short || match.opponent_name };
}
