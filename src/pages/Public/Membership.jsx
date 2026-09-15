import { ArrowUpRight, Check } from 'lucide-react'
import SectionHeading from '@/components/SectionHeading'
import WhatsAppButton from '@/components/WhatsAppButton'
import { money } from '@/utils/format'
import { useTable } from '@/hooks/useGymData'
export default function Membership(){
 const {data,loading}=useTable('membership_plans','*',{order:'price',ascending:true})
 return <main className="section-shell py-20 sm:py-28"><SectionHeading eyebrow="Membership" title="Commit to the work." text="Choose a current plan and contact Power Fitness directly for joining details." align="center"/>
 <div className="mx-auto mt-14 grid max-w-5xl gap-5 md:grid-cols-3">
  {loading ? [1,2,3].map(x=><div key={x} className="h-80 animate-pulse border border-white/10 bg-white/[.03]"/>)
  : data.map((p,i)=><article key={p.id} className={`premium-card relative p-8 ${p.is_featured?'border-power-400/60 shadow-cyan':''}`}>{p.is_featured && <span className="absolute right-5 top-5 bg-power-400 px-2 py-1 text-[9px] font-bold uppercase tracking-[.15em] text-black">Featured</span>}<div className="text-xs uppercase tracking-[.2em] text-white/30">0{i+1}</div><h3 className="mt-10 font-display text-2xl font-semibold">{p.name}</h3><div className="mt-5 text-4xl font-bold text-power-300">{money(p.price)}</div><div className="mt-2 text-sm text-white/35">{p.duration_months} months</div><p className="mt-6 text-sm leading-6 text-white/45">{p.description || 'Membership plan at Power Fitness Health Club Gym.'}</p><div className="mt-7 space-y-3 border-t border-white/10 pt-6">{['Direct WhatsApp enquiry','Flexible joining conversation','Gym-managed membership details'].map(x=><div key={x} className="flex gap-2 text-xs text-white/50"><Check size={15} className="shrink-0 text-power-300"/>{x}</div>)}</div><WhatsAppButton message={`Hi, I’m interested in the ${p.name} membership at Power Fitness Health Club Gym. Please share the joining details.`} children="Enquire on WhatsApp"/></article>)}
 </div>
 {!loading && !data.length && <div className="mx-auto mt-12 max-w-xl border border-dashed border-white/15 p-10 text-center text-white/45">Membership plans are being updated. Please contact the gym on WhatsApp.</div>}
 </main>
}