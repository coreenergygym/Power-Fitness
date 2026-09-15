export const money = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`
export const dateText = (value) => value ? new Date(`${value}T00:00:00`).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }) : '—'
export const waNumber = (phone = '') => String(phone).replace(/\D/g, '')
export const waLink = (phone, message = '') => `https://wa.me/${waNumber(phone)}?text=${encodeURIComponent(message)}`
export const daysUntil = (date) => Math.ceil((new Date(`${date}T23:59:59`) - new Date()) / 86400000)
export const memberStatus = (expiry) => {
  const d = daysUntil(expiry)
  if (d < 0) return 'expired'
  if (d <= 7) return 'expiring'
  return 'active'
}
export function dueAmount(planPrice, amountPaid) {
  const price = Number(planPrice || 0)
  const paid = Number(amountPaid || 0)
  return Math.max(0, price - paid)
}

export function paymentStatus(planPrice, amountPaid) {
  const price = Number(planPrice || 0)
  const paid = Number(amountPaid || 0)

  if (price <= 0 || paid <= 0) return 'unpaid'
  if (paid >= price) return 'paid'
  return 'partial'
}
