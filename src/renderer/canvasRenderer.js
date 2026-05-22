export function createCanvasRenderStats(uiElements = [], viewport = { x: 0, y: 0, width: 0, height: 0 }) {
  const visible = uiElements.filter((element) => {
    const x = Number(element.x || 0);
    const y = Number(element.y || 0);
    const width = Number(element.width || 0);
    const height = Number(element.height || 0);
    return x + width >= viewport.x
      && y + height >= viewport.y
      && x <= viewport.x + viewport.width
      && y <= viewport.y + viewport.height;
  });

  return {
    mode: "canvas-ready",
    total: uiElements.length,
    visible: visible.length,
    culled: Math.max(0, uiElements.length - visible.length)
  };
}
