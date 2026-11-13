// Figma frames 41:10113 and 41:10114. All matrices are local to 390 × 844.
const rotate = [.996330380, -.085590817, .085590817, .996330380];
const tagRotate = [.994521916, -.104528464, .104528464, .994521916];
const layer = (width, height, x, y, rotation = [1, 0, 0, 1]) => ({ width, height, matrix: [...rotation, x, y] });
export const onboardingAssets = {
  paper: '/images/intro/get-started-paper.png',
  stadium: '/images/onboarding/stadium.png',
  jersey: '/images/onboarding/signed-jersey.png',
  nextArrow: '/illustrations/onboarding/next-arrow.svg',
  circle: '/illustrations/onboarding/step-circle.svg',
  activateStrip: '/illustrations/onboarding/activate-strip.svg',
  stadiumStrip: '/illustrations/onboarding/stadium-strip.svg',
  keepStrip: '/illustrations/onboarding/keep-strip.svg',
  collectStrip: '/illustrations/onboarding/collect-strip.svg',
  underline: '/illustrations/onboarding/how-underline.svg',
  matchArrow: '/illustrations/onboarding/match-ready-arrow.svg',
  ticket: '/icons/onboarding/ticket.svg',
  basket: '/icons/onboarding/basket.svg',
  more: '/icons/onboarding/more.svg',
  signedStrip: '/illustrations/onboarding/signed-strip.svg',
  jerseyStrip: '/illustrations/onboarding/jersey-strip.svg',
  divider: '/illustrations/onboarding/category-divider.svg',
  crown: [1, 2, 3, 4, 5].map(n => `/illustrations/onboarding/crown-${n}.svg`),
};
export const howDesign = {
  photo: layer(555.785522, 312.629364, -151.805176, 599, [.998113334, .061398, -.061398, .998113334]),
  title: layer(182.089966, 130, 28, 133.592041, [.996327162, -.085627966, .085627966, .996327162]),
  underline: layer(243.871, 34.5, 25, 247.733),
  paper: layer(294, 84, 44.944641, 717.728516, rotate),
  arrow: layer(147.002, 56.3509, 123.102417, 719.642090, [.999578774, .029021632, -.029021632, .999578774]),
  steps: [
    { number: 1, circle: layer(72.4236, 64.5246, 23.7097, 299.606634), digit: layer(17, 50, 54, 309.356934), strips: [['activateStrip', layer(111.75, 36.75, 115.890686, 299.648682, rotate)], ['stadiumStrip', layer(183, 36.75, 119.036133, 336.263916, rotate)]], title: layer(152, 76, 123.491516, 300.501343, rotate), lines: ['Activate', 'at the stadium'], description: layer(190, 36, 125, 382.713989), text: 'Turn on FanModus when you are at Westfalenstadion' },
    { number: 2, circle: layer(72.4236, 64.5246, 23.7097, 433.406072), digit: layer(17, 50, 54, 443.156372), strips: [['keepStrip', layer(166.178, 36.75, 119.036133, 451.009399, rotate)]], title: layer(129, 38, 123.491516, 452.246826, rotate), lines: ['Keep it away'], description: layer(190, 36, 125, 496.598755), text: 'Leave your phone in your pocket.' },
    { number: 3, circle: layer(72.4236, 64.5246, 23.7097, 548.831487), digit: layer(17, 50, 54, 558.581787), strips: [['collectStrip', layer(202.277, 36.75, 119.036133, 567.975342, rotate)]], title: layer(165, 38, 123.491516, 569.212769, rotate), lines: ['Collect entries'], description: layer(190, 36, 125, 613.564819), text: 'Earn entries for every phone-free minute.' },
  ],
};
export const prizeDesign = {
  title: layer(382.360046, 92.538071, 0, 197.535400, [.997012138, -.077245161, .094905578, .995486259]),
  description: layer(271, 40, 59.5, 289.655762),
  jersey: layer(252, 173, 69, 384.655762),
  signedStrip: layer(94.1218, 35.2718, 189.760498, 529.573242, tagRotate),
  jerseyStrip: layer(89.1249, 35.2718, 191.641479, 554.947388, tagRotate),
  signed: layer(52, 29, 209.749634, 529.747437, tagRotate),
  jerseyLabel: layer(52, 29, 212.749634, 554.747437, tagRotate),
  ticket: layer(24, 24, 39, 611.244873),
  basket: layer(19.5, 20.5, 185.25, 613.494873),
  more: layer(24, 24, 327, 620.244873),
  ticketText: layer(48, 36, 27, 640.244873),
  basketText: layer(48, 36, 171, 640.244873),
  moreText: layer(66, 18, 306, 649.244873),
  dividers: [123.5, 267.5].map(x => layer(65, 1, x, 611.244873, [0, 1, -1, 0])),
  allPrizes: layer(141.750015, 27.750004, 121.025024, 689.469849),
  ready: layer(228.850021, 42.550003, 60.450012, 760.444824),
  readyArrow: layer(80.73, 39.33, 289.300049, 763.664917),
  // The 74 px source crown is transformed as a group, without altering its SVGs.
  crown: layer(74, 74, 226.797363, 115, [.996189654, .087213367, -.087213367, .996189654].map(v => v * 82.0870285 / 74)),
  crownParts: [
    { left: 21.833210, top: 29.849836 },
    { left: 4.858307, top: 7.324667 },
    { left: 11.025060, top: 60.358135 },
    { left: 5.724902, top: 8.807667 },
    { left: 10.966585, top: 58.603869 },
  ],
};
