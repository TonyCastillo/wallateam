export function fmtGs(n: number): string {
  return `₲ ${Math.abs(Math.round(n)).toLocaleString('es-PY')}`;
}

export function fmtGsSigned(n: number): string {
  if (n < 0) return `− ${fmtGs(n)}`;
  if (n > 0) return `+ ${fmtGs(n)}`;
  return fmtGs(0);
}

/**
 * Formato relativo de fecha de un gasto:
 *   - Hoy mismo  → "Hoy · 14:30"
 *   - Ayer       → "Ayer · 21:05"
 *   - Más viejo  → "17 abr 2026"
 */
export function formatExpenseDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  if (sameDay) {
    return `Hoy · ${d.toLocaleTimeString('es-PY', { hour: '2-digit', minute: '2-digit' })}`;
  }
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) {
    return `Ayer · ${d.toLocaleTimeString('es-PY', { hour: '2-digit', minute: '2-digit' })}`;
  }
  return d.toLocaleDateString('es-PY', { day: 'numeric', month: 'short', year: 'numeric' });
}
