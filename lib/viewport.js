export const DESKTOP_PREVIEW_QUERY = '(hover: hover) and (pointer: fine)';
export const MOBILE_FRAME = { width: 390, height: 844 };

export function getFrameScale(availableWidth, availableHeight) {
  return Math.max(0, Math.min(1, availableWidth / MOBILE_FRAME.width, availableHeight / MOBILE_FRAME.height));
}
