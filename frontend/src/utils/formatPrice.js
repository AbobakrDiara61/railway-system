export function formatPrice(amount, currency = 'EGP') {
  if (amount === null || amount === undefined) return '—';
  const num = Number(amount);
  if (isNaN(num)) return '—';
  return `${num.toLocaleString('en-EG')} ${currency}`;
}

export function formatPriceShort(amount) {
  if (!amount) return '0 EGP';
  const num = Number(amount);
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K EGP`;
  return `${num} EGP`;
}
