export function formatNum(val, decimals = 2) {
  if (val === null || val === undefined || isNaN(val)) return '—';
  if (typeof val === 'string') return val;
  return Number(val).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals
  });
}

export function formatPct(val, decimals = 1) {
  if (val === null || val === undefined || isNaN(val)) return '—';
  return `${Number(val).toFixed(decimals)}%`;
}

export function truncateText(str, maxLength = 24) {
  if (!str) return '';
  return str.length > maxLength ? `${str.substring(0, maxLength)}...` : str;
}
