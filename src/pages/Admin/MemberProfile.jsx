import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  CalendarDays,
  CreditCard,
  Pencil,
  UserRound,
  RefreshCw,
} from 'lucide-react'
import { requireSupabase } from '@/lib/supabase'
import {
  dateText,
  dueAmount,
  memberStatus,
  money,
  paymentStatus,
  waLink,
} from '@/utils/format'
import WhatsAppIcon from '@/components/WhatsAppIcon'

function ActionButton({ href, children, className = '' }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`inline-flex items-center justify-center gap-2 border px-4 py-2.5 text-xs font-bold uppercase tracking-[.1em] transition ${className}`}
    >
      {children}
    </a>
  )
}

export default function MemberProfile() {
  const { id } = useParams()

  const [member, setMember] = useState(null)
  const [payments, setPayments] = useState([])
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let alive = true

    const load = async () => {
      setLoading(true)
      setError('')

      try {
        const sb = requireSupabase()

        const [memberRes, paymentsRes, historyRes] = await Promise.all([
          sb
            .from('members')
            .select('*,membership_plans(name,price,duration_months)')
            .eq('id', id)
            .single(),

          sb
            .from('payments')
            .select('*')
            .eq('member_id', id)
            .order('paid_at', { ascending: false }),

          sb
            .from('membership_history')
            .select('*,membership_plans(name,price)')
            .eq('member_id', id)
            .order('created_at', { ascending: false }),
        ])

        if (!alive) return

        if (memberRes.error) {
          setError(memberRes.error.message)
          setLoading(false)
          return
        }

        setMember(memberRes.data)
        setPayments(paymentsRes.data || [])
        setHistory(historyRes.data || [])
        setLoading(false)
      } catch (err) {
        if (!alive) return
        setError(err?.message || 'Unable to load member profile.')
        setLoading(false)
      }
    }

    load()

    return () => {
      alive = false
    }
  }, [id])

  const membership = member?.membership_plans

  const status = member
    ? memberStatus(member.expiry_date)
    : 'active'

  const due = member
    ? dueAmount(membership?.price, member.amount_paid)
    : 0

  const payStatus = member
    ? paymentStatus(membership?.price, member.amount_paid)
    : 'unpaid'

  const messages = useMemo(() => {
    if (!member) return {}

    return {
      payment: `Hi ${member.full_name}, this is a payment confirmation from POWER FITNESS HEALTH CLUB GYM. Your payment of ${money(member.amount_paid)} has been recorded. Thank you.`,

      renewal: `Hi ${member.full_name}, your POWER FITNESS HEALTH CLUB GYM membership is due for renewal. Please contact us for renewal options.`,

      expiry: `Hi ${member.full_name}, your POWER FITNESS HEALTH CLUB GYM membership ${
        status === 'expired' ? 'expired' : 'is expiring'
      } on ${dateText(member.expiry_date)}. Please contact us for renewal.`,

      details: `Hi ${member.full_name}, your POWER FITNESS HEALTH CLUB GYM membership details: ${
        membership?.name || 'Membership'
      } | Start: ${dateText(member.start_date)} | Expiry: ${dateText(
        member.expiry_date
      )} | Paid: ${money(member.amount_paid)} | Due: ${money(due)}.`,
    }
  }, [member, membership, status, due])

  if (loading) {
    return (
      <div className="py-10 text-sm text-white/40">
        Loading member profile…
      </div>
    )
  }

  if (error || !member) {
    return (
      <div>
        <Link
          to="/admin/members"
          className="text-xs uppercase tracking-[.15em] text-white/40 hover:text-white"
        >
          ← Back to Members
        </Link>

        <div className="premium-card mt-8 p-8 text-red-200">
          {error || 'Member not found.'}
        </div>
      </div>
    )
  }

  const initials = member.full_name
    ?.split(/\s+/)
    .map((x) => x[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const personalInfo = [
    ['Phone', member.phone],
    ['Email', member.email || '—'],
    [
      'Gender',
      member.gender
        ? member.gender[0].toUpperCase() + member.gender.slice(1)
        : '—',
    ],
    ['Address', member.address || '—'],
    ['Joined', dateText(member.created_at?.slice(0, 10))],
    ['Notes', member.notes || '—'],
  ]

  const membershipInfo = [
    ['Plan', membership?.name || '—'],
    ['Start date', dateText(member.start_date)],
    ['Expiry date', dateText(member.expiry_date)],
    ['Membership status', status],
    ['Fee', money(membership?.price)],
    ['Amount paid', money(member.amount_paid)],
    ['Due', money(due)],
    ['Payment status', payStatus],
  ]

  const getMembershipClass = (label) => {
    if (label === 'Due' && due > 0) return 'text-amber-300'

    if (label === 'Payment status') {
      if (payStatus === 'paid') return 'text-emerald-300'
      if (payStatus === 'partial') return 'text-amber-300'
      return 'text-red-300'
    }

    if (label === 'Membership status') {
      if (status === 'active') return 'text-emerald-300'
      if (status === 'expiring') return 'text-amber-300'
      return 'text-red-300'
    }

    return 'text-white/70'
  }

  return (
    <div className="mx-auto max-w-6xl">
      <Link
        to="/admin/members"
        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[.15em] text-white/40 transition hover:text-white"
      >
        <ArrowLeft size={14} />
        Back to Members
      </Link>

      <div className="mt-5 flex flex-col gap-5 border-b border-white/10 pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-power-400/20 bg-power-400/10 text-lg font-bold text-power-300">
            {member.photo_url ? (
              <img
                src={member.photo_url}
                alt={member.full_name}
                className="h-full w-full object-cover"
              />
            ) : (
              initials || <UserRound size={24} />
            )}
          </div>

          <div>
            <div className="eyebrow">Member profile</div>

            <h1 className="mt-1 font-display text-3xl font-bold tracking-tight">
              {member.full_name}
            </h1>

            <p className="mt-1 text-sm text-white/40">
              {member.phone}
              {member.email ? ` · ${member.email}` : ''}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            to={`/admin/members/${member.id}/edit`}
            className="btn-secondary"
          >
            <Pencil size={15} />
            Edit info
          </Link>

          <Link
            to={`/admin/members/${member.id}/edit`}
            className="btn-primary"
          >
            <RefreshCw size={15} />
            Renew / Update
          </Link>
        </div>
      </div>

      <div className="mt-6">
        <div className="mb-3 text-[11px] font-bold uppercase tracking-[.18em] text-white/35">
          WhatsApp actions
        </div>

        <div className="flex flex-wrap gap-2">
          <ActionButton
            href={waLink(member.phone, messages.payment)}
            className="border-emerald-400/20 bg-emerald-400/10 text-emerald-300 hover:bg-emerald-400/20"
          >
            <WhatsAppIcon size={16} />
            Payment confirmation
          </ActionButton>

          <ActionButton
            href={waLink(member.phone, messages.renewal)}
            className="border-emerald-400/20 bg-emerald-400/10 text-emerald-300 hover:bg-emerald-400/20"
          >
            <WhatsAppIcon size={16} />
            Renewal message
          </ActionButton>

          <ActionButton
            href={waLink(member.phone, messages.expiry)}
            className="border-emerald-400/20 bg-emerald-400/10 text-emerald-300 hover:bg-emerald-400/20"
          >
            <WhatsAppIcon size={16} />
            Expiry reminder
          </ActionButton>

          <ActionButton
            href={waLink(member.phone, messages.details)}
            className="border-emerald-400/20 bg-emerald-400/10 text-emerald-300 hover:bg-emerald-400/20"
          >
            <WhatsAppIcon size={16} />
            Membership details
          </ActionButton>
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <section className="premium-card p-5 sm:p-6">
          <div className="flex items-center gap-2 text-sm font-bold">
            <UserRound size={17} className="text-power-300" />
            Personal information
          </div>

          <div className="mt-5 space-y-0 text-sm">
            {personalInfo.map(([label, value]) => (
              <div
                key={label}
                className="flex gap-4 border-t border-white/5 py-3 first:border-t-0"
              >
                <span className="w-28 shrink-0 text-xs uppercase tracking-[.1em] text-white/30">
                  {label}
                </span>

                <span className="min-w-0 text-white/70">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="premium-card p-5 sm:p-6">
          <div className="flex items-center gap-2 text-sm font-bold">
            <CalendarDays size={17} className="text-power-300" />
            Current membership
          </div>

          <div className="mt-5 space-y-0 text-sm">
            {membershipInfo.map(([label, value]) => (
              <div
                key={label}
                className="flex items-center gap-4 border-t border-white/5 py-3 first:border-t-0"
              >
                <span className="w-32 shrink-0 text-xs uppercase tracking-[.1em] text-white/30">
                  {label}
                </span>

                <span
                  className={`min-w-0 font-semibold ${getMembershipClass(
                    label
                  )}`}
                >
                  {['paid', 'partial', 'unpaid'].includes(value)
                    ? value.toUpperCase()
                    : value}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="premium-card mt-5 p-5 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm font-bold">
            <CreditCard size={17} className="text-power-300" />
            Payment history
          </div>

          <Link
            to={`/admin/members/${member.id}/edit`}
            className="btn-secondary"
          >
            + Add / update payment
          </Link>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[650px] text-left text-sm">
            <thead className="text-[10px] uppercase tracking-[.15em] text-white/30">
              <tr>
                <th className="border-b border-white/5 px-3 py-3">
                  Date
                </th>
                <th className="border-b border-white/5 px-3 py-3">
                  Amount
                </th>
                <th className="border-b border-white/5 px-3 py-3">
                  Method
                </th>
                <th className="border-b border-white/5 px-3 py-3">
                  Status
                </th>
                <th className="border-b border-white/5 px-3 py-3">
                  Notes
                </th>
              </tr>
            </thead>

            <tbody>
              {payments.length ? (
                payments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="border-b border-white/5 last:border-0"
                  >
                    <td className="px-3 py-3 text-white/60">
                      {dateText(payment.paid_at?.slice(0, 10))}
                    </td>

                    <td className="px-3 py-3 font-semibold">
                      {money(payment.amount)}
                    </td>

                    <td className="px-3 py-3 text-white/50">
                      {payment.method || '—'}
                    </td>

                    <td className="px-3 py-3 text-white/60">
                      {payment.payment_status || '—'}
                    </td>

                    <td className="px-3 py-3 text-white/40">
                      {payment.notes || '—'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-3 py-8 text-center text-white/30"
                  >
                    No payment records yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="premium-card mt-5 p-5 sm:p-6">
        <div className="text-sm font-bold">
          Membership history
        </div>

        <div className="mt-4 space-y-2">
          {history.length ? (
            history.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-2 border border-white/5 bg-white/[.02] p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <div className="font-semibold">
                    {item.membership_plans?.name || 'Membership'}
                  </div>

                  <div className="mt-1 text-xs text-white/35">
                    {dateText(item.start_date)} →{' '}
                    {dateText(item.expiry_date)}
                  </div>
                </div>

                <div className="text-sm text-white/60">
                  {money(item.amount_paid)} paid ·{' '}
                  {item.payment_status || '—'}
                </div>
              </div>
            ))
          ) : (
            <div className="py-6 text-sm text-white/30">
              No membership history yet.
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
