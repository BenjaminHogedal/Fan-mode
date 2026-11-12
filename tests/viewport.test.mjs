import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getFrameScale, MOBILE_FRAME } from '../lib/viewport.js';

// Browser viewport sizes, after browser chrome; the stage reserves a 16 px inset.
for (const [width, height] of [[1440, 900], [1440, 740], [1280, 720], [1024, 600], [800, 450], [600, 500], [360, 640], [1920, 1080]]) {
  test(`390 × 844 frame fits and stays centred in ${width} × ${height}`, () => {
    const availableWidth = width - 32;
    const availableHeight = height - 32;
    const scale = getFrameScale(availableWidth, availableHeight);
    const frameWidth = MOBILE_FRAME.width * scale;
    const frameHeight = MOBILE_FRAME.height * scale;
    const left = (width - frameWidth) / 2;
    const top = (height - frameHeight) / 2;
    assert.ok(scale > 0 && scale <= 1);
    assert.ok(left >= 16 - 1e-9 && top >= 16 - 1e-9);
    assert.ok(left + frameWidth <= width - 16 + 1e-9);
    assert.ok(top + frameHeight <= height - 16 + 1e-9);
    assert.ok(Math.abs(frameWidth / frameHeight - 390 / 844) < 1e-9);
  });
}
test('a wide and tall desktop never enlarges the reference frame', () => {
  assert.equal(getFrameScale(3000, 2000), 1);
});
