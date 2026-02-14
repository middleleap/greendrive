export function formatNumber(n) {
  if (n == null) return '—';
  return n.toLocaleString('en-US');
}

export function formatKm(km) {
  if (km == null) return '—';
  return `${km.toLocaleString('en-US')} km`;
}

export function formatPercent(n) {
  if (n == null) return '—';
  return `${n}%`;
}

export function formatTemp(c) {
  if (c == null) return '—';
  return `${c.toFixed(1)}°C`;
}

export function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatTimeAgo(iso) {
  if (!iso) return '';
  const diff = Date.now() - new Date(iso).getTime();
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return formatDate(iso);
}

export function formatAed(amount) {
  if (amount == null) return '—';
  return `AED ${amount.toLocaleString('en-US')}`;
}

export function formatRateReduction(pct) {
  return `${pct.toFixed(2)}%`;
}
