/**
 * Anima un elemento numérico desde 0 hasta el valor objetivo.
 * @param element - El elemento DOM cuyo textContent se actualiza
 * @param target - Valor numérico final
 * @param duration - Duración en ms (default: 800)
 * @param formatter - Función opcional para formatear el número (ej: moneda)
 */
export function animateCount(
  element: HTMLElement,
  target: number,
  duration = 800,
  formatter: (n: number) => string = n => Math.round(n).toLocaleString("es-CL")
): void {
  const start = performance.now();
  const initial = 0;

  function step(timestamp: number) {
    const elapsed = timestamp - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = initial + (target - initial) * eased;
    element.textContent = formatter(current);

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      element.textContent = formatter(target);
    }
  }

  requestAnimationFrame(step);
}
