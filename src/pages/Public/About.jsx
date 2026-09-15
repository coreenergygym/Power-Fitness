import SectionHeading from '@/components/SectionHeading'
import WhatsAppButton from '@/components/WhatsAppButton'
export default function About(){
 return <main className="section-shell py-20 sm:py-28">
  <SectionHeading eyebrow="About Power Fitness" title="Built for people who take training seriously." text="Power Fitness Health Club Gym is a local fitness destination in Adarsh Nagar, Ajmer, Rajasthan."/>
  <div className="mt-14 grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
   <div className="premium-card p-8 sm:p-10"><p className="text-lg leading-8 text-white/65">The gym’s public information is intentionally kept factual. The owner can update the About content, opening hours and other business information directly from the admin area as details evolve.</p><div className="mt-10 flex flex-wrap gap-3"><WhatsAppButton/><a className="btn-secondary" href="https://maps.app.goo.gl/vjHAwZynNLBQK3TRA?g_st=ac" target="_blank" rel="noreferrer">Get directions</a></div></div>
   <div className="border border-white/10 bg-white/[.025] p-8"><div className="eyebrow">At a glance</div><div className="mt-7 space-y-5">{[['Owner','Mukesh Kumar Jagrat'],['Location','Adarsh Nagar, Ajmer'],['Phone','+91 99296 56539'],['Instagram','@power_fitness_healthclub_gym']].map(([a,b])=><div key={a} className="border-b border-white/10 pb-5"><div className="text-[10px] uppercase tracking-[.18em] text-white/30">{a}</div><div className="mt-1 text-sm font-semibold text-white/75">{b}</div></div>)}</div></div>
  </div>
 </main>
}