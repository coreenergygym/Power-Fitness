import { MapPin, Phone, Instagram, MessageCircle, ArrowUpRight } from 'lucide-react'
import SectionHeading from '@/components/SectionHeading'
import WhatsAppButton from '@/components/WhatsAppButton'
export default function Contact(){
 return <main className="section-shell py-20 sm:py-28"><SectionHeading eyebrow="Contact" title="Start with a conversation." text="For membership, timings or any gym enquiry, contact Power Fitness directly."/>
 <div className="mt-14 grid gap-5 lg:grid-cols-2">
  <div className="premium-card p-8 sm:p-10"><div className="space-y-7">{[
   [MapPin,'Address','Plot No. 67, Mukund Vihar Colony, Near Study Base Library, Adarsh Nagar, Ajmer, Rajasthan - 305003'],
   [Phone,'Phone / WhatsApp','+91 99296 56539'],[Instagram,'Instagram','@power_fitness_healthclub_gym']
  ].map(([Icon,label,value])=><div key={label} className="flex gap-4"><div className="flex h-10 w-10 shrink-0 items-center justify-center border border-white/10 bg-white/[.03] text-power-300"><Icon size={17}/></div><div><div className="text-[10px] uppercase tracking-[.18em] text-white/30">{label}</div><div className="mt-2 text-sm leading-6 text-white/65">{value}</div></div></div>)}</div><div className="mt-10 flex flex-wrap gap-3"><WhatsAppButton/><a className="btn-secondary" href="https://maps.app.goo.gl/vjHAwZynNLBQK3TRA?g_st=ac" target="_blank" rel="noreferrer">Get directions <ArrowUpRight size={15}/></a></div></div>
  <div className="min-h-[420px] border border-white/10 bg-[radial-gradient(circle_at_50%_40%,rgba(0,229,255,.12),transparent_35%),linear-gradient(135deg,#080d10,#020507)] p-8 sm:p-10"><div className="eyebrow">Find us</div><div className="mt-6 flex h-full min-h-[320px] items-end border border-white/10 bg-black/20 p-6"><div><MapPin className="text-power-300" size={28}/><p className="mt-3 max-w-sm text-sm leading-6 text-white/45">Adarsh Nagar, Ajmer, Rajasthan</p></div></div></div>
 </div></main>
}