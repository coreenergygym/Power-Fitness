import { MapPin, MessageCircle, Instagram } from 'lucide-react'
import Brand from '@/components/Brand'
export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#010304]">
      <div className="section-shell py-12">
        <div className="grid gap-10 md:grid-cols-3">
          <div><Brand/><p className="mt-5 max-w-sm text-sm leading-7 text-white/40">Strength, discipline and performance — built around consistency.</p></div>
          <div><div className="eyebrow">Visit</div><p className="mt-4 text-sm leading-6 text-white/60">Plot No. 67, Mukund Vihar Colony, Near Study Base Library, Adarsh Nagar, Ajmer, Rajasthan - 305003</p></div>
          <div><div className="eyebrow">Connect</div><div className="mt-4 flex flex-wrap gap-3"><a className="btn-secondary" href="https://wa.me/919929656539" target="_blank" rel="noreferrer"><MessageCircle size={16}/> WhatsApp</a><a className="btn-secondary" href="https://www.instagram.com/power_fitness_healthclub_gym/" target="_blank" rel="noreferrer"><Instagram size={16}/> Instagram</a></div></div>
        </div>
        <div className="mt-12 flex flex-col gap-2 border-t border-white/10 pt-5 text-[11px] uppercase tracking-[.15em] text-white/25 sm:flex-row sm:justify-between"><span>© {new Date().getFullYear()} Power Fitness Health Club Gym</span><span>Ajmer · Rajasthan</span></div>
      </div>
    </footer>
  )
}