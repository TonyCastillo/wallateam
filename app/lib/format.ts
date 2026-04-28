export function fmtGs(n: number): string {
  return `₲ ${Math.abs(Math.round(n)).toLocaleString('es-PY')}`;
}

export function fmtGsSigned(n: number): string {
  if (n < 0) return `− ${fmtGs(n)}`;
  if (n > 0) return `+ ${fmtGs(n)}`;
  return fmtGs(0);
}

export function fmtGsCompact(n: number): string {
  const abs = Math.abs(n);
  const sign = n < 0 ? '−' : '';
  if (abs >= 1_000_000) {
    return `${sign}₲ ${(abs / 1_000_000).toLocaleString('es-PY', { maximumFractionDigits: 1 })}M`;
  }
  if (abs >= 1_000) {
    return `${sign}₲ ${(abs / 1_000).toLocaleString('es-PY', { maximumFractionDigits: 0 })}k`;
  }
  return `${sign}${fmtGs(abs)}`;
}
