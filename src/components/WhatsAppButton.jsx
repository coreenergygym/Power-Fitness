import { waLink } from '@/utils/format'
import WhatsAppIcon from '@/components/WhatsAppIcon'

export default function WhatsAppButton({
  phone = '+91 99296 56539',
  message = 'Hi, I’m interested in a membership at Power Fitness Health Club Gym.',
  children = 'WhatsApp',
  className = '',
}) {
  return (
    <a href={waLink(phone, message)} target="_blank" rel="noreferrer" className={`btn-primary ${className}`}>
      <WhatsAppIcon size={18} />
      {children}
    </a>
  )
}
