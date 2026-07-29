// Format number as Indian currency
export const formatCurrency = (value = 0) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value));

// Format date in Indian format
export const formatDate = (value) =>
  value
    ? new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value))
    : '—';

// Get color tone for a status string
export const statusTone = (status = '') => {
  const s = status.toUpperCase();
  if (['APPROVED', 'ACTIVE', 'PAID', 'VERIFIED'].includes(s)) return 'success';
  if (['REJECTED', 'DEFAULTED', 'OVERDUE'].includes(s)) return 'danger';
  if (['PENDING', 'UNDER_REVIEW', 'UPCOMING'].includes(s)) return 'warning';
  return 'neutral';
};
