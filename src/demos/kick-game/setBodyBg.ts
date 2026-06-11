// Updates the document body/theme color so the iOS PWA safe-area at the
// bottom blends with whatever scene is on screen.
export function setBodyBg(color: string) {
  if (typeof document === 'undefined') return;
  document.body.style.backgroundColor = color;
  document.documentElement.style.backgroundColor = color;
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  if (themeMeta) themeMeta.setAttribute('content', color);
}
