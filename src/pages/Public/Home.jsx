import { ArrowDownRight, ArrowUpRight, Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import SectionHeading from '@/components/SectionHeading'
import WhatsAppButton from '@/components/WhatsAppButton'
import { money } from '@/utils/format'
import { useTable } from '@/hooks/useGymData'

export default function Home() {
  const { data: plans } = useTable('membership_plans','*',{order:'price',ascending:true})
  const { data: facilities } = useTable('facilities','*',{order:'created_at',ascending:false})
  const { data: gallery } = useTable('gallery_items','*',{order:'created_at',ascending:false})
  return <main>
    <section className="relative min-h-[calc(100vh-74px)] overflow-hidden bg-[#020507]">
      <div className="absolute inset-0 hero-grid opacity-50"/>
      <div className="absolute inset-0 hero-vignette"/>
      <div className="absolute -right-40 top-1/4 h-[500px] w-[500px] rounded-full bg-power-400/10 blur-[130px]"/>
      <div className="section-shell relative flex min-h-[calc(100vh-74px)] items-center py-20">
        <div className="max-w-4xl reveal">
          <div className="eyebrow flex items-center gap-3"><span className="h-px w-8 bg-power-400"/> AJMER · RAJASTHAN</div>
          <h1 className="mt-6 max-w-5xl font-display text-5xl font-bold leading-[.92] tracking-[-.045em] sm:text-7xl lg:text-[7.5rem]">TRAIN WITH<br/><span className="text-power-400">PURPOSE.</span></h1>
          <p className="mt-7 max-w-xl text-base leading-7 text-white/55 sm:text-lg">Discipline. Strength. Performance. A focused training environment for people who choose consistency over excuses.</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row"><WhatsAppButton/><Link to="/membership" className="btn-secondary"><span>Explore Membership</span><ArrowUpRight size={16}/></Link></div>
          <div className="mt-14 grid max-w-xl grid-cols-3 border-y border-white/10 py-5">
            {['Strength','Discipline','Performance'].map((x,i)=><div key={x} className={i ? 'border-l border-white/10 pl-4' : ''}><div className="text-[10px] uppercase tracking-[.18em] text-white/30">01 · 0{i+1}</div><div className="mt-2 text-sm font-semibold">{x}</div></div>)}
          </div>
        </div>
      </div>
      <div className="absolute bottom-8 right-6 hidden items-center gap-2 text-[10px] uppercase tracking-[.2em] text-white/25 sm:flex">Scroll to explore <ArrowDownRight size={15}/></div>
    </section>

    <section className="section-shell py-24 sm:py-32">
      <SectionHeading eyebrow="The standard" title="A gym built around the work." text="Power Fitness Health Club Gym is for people who want a serious place to train, build strength and stay consistent."/>
      <div className="mt-14 grid gap-4 md:grid-cols-3">
        {[
          ['01','Focused environment','A clean, performance-first atmosphere where your training gets the attention it deserves.'],
          ['02','Membership that fits','Choose a plan that matches your commitment, then keep showing up.'],
          ['03','Direct connection','Need details or want to enquire? Reach the gym directly on WhatsApp.']
        ].map(([n,t,d])=><div key={n} className="premium-card p-7 transition hover:-translate-y-1 hover:border-white/20"><div className="text-xs font-bold text-power-300">{n}</div><h3 className="mt-10 font-display text-2xl font-semibold">{t}</h3><p className="mt-3 text-sm leading-6 text-white/40">{d}</p></div>)}
      </div>
    </section>

    <section className="border-y border-white/10 bg-white/[.015] py-24">
      <div className="section-shell">
        <SectionHeading eyebrow="Facilities" title="Train with intention." text="Facility details can be managed from the admin dashboard so the public site stays accurate."/>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {(facilities.length ? facilities.slice(0,6) : ['Strength training','Conditioning','Performance space']).map((f,i)=>{
            const name = typeof f === 'string' ? f : f.name
            const desc = typeof f === 'string' ? 'A space designed to support consistent training.' : f.description
            return <div key={typeof f==='string'?f:f.id} className="group overflow-hidden border border-white/10 bg-[#070b0d]">
              <div className="flex aspect-[4/3] items-end bg-gradient-to-br from-white/10 via-white/[.02] to-power-400/[.06] p-5"><span className="text-xs uppercase tracking-[.18em] text-white/25">0{i+1}</span></div>
              <div className="p-6"><h3 className="font-display text-xl font-semibold">{name}</h3><p className="mt-2 text-sm leading-6 text-white/40">{desc}</p></div>
            </div>
          })}
        </div>
        <Link to="/facilities" className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-power-300 hover:text-power-200">View all facilities <ArrowUpRight size={15}/></Link>
      </div>
    </section>

    
<section className="section-shell py-24 sm:py-32">
  <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
    <SectionHeading
      eyebrow="Gallery"
      title="Inside Power Fitness."
      text="A look at the training environment and facilities."
    />
    <Link
      to="/gallery"
      className="btn-secondary self-start md:self-auto"
    >
      View full gallery <ArrowUpRight size={16} />
    </Link>
  </div>

  <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {gallery.slice(0, 6).map((item) => (
      <Link
        key={item.id}
        to="/gallery"
        className="group relative aspect-[4/3] overflow-hidden border border-white/10 bg-white/[.02]"
      >
        {item.type === 'video' ? (
          <video
            src={item.url}
            muted
            playsInline
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <img
            src={item.url}
            alt={item.caption || 'Power Fitness gallery'}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />

        {item.caption && (
          <div className="absolute bottom-0 left-0 right-0 p-4 text-sm text-white opacity-0 transition group-hover:opacity-100">
            {item.caption}
          </div>
        )}
      </Link>
    ))}

    {!gallery.length && (
      <div className="border border-dashed border-white/15 p-10 text-center text-white/40 sm:col-span-2 lg:col-span-3">
        Gallery media will appear here after the gym uploads it.
      </div>
    )}
  </div>
</section>

<section className="section-shell py-24 sm:py-32">
      <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end"><SectionHeading eyebrow="Membership" title="Choose your commitment." text="Current membership plans are managed by the gym through the admin dashboard."/><Link to="/membership" className="btn-secondary self-start md:self-auto">All plans <ArrowUpRight size={16}/></Link></div>
      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {(plans.length ? plans : [
          {id:'y',name:'Yearly',duration_months:12,price:8999,description:'Best value for long-term consistency.'},
          {id:'h',name:'6 Months',duration_months:6,price:5999,description:'A focused half-year commitment.'},
          {id:'q',name:'3 Months',duration_months:3,price:3499,description:'Start strong and build momentum.'}
        ]).map((p,i)=><div key={p.id} className={`premium-card relative p-7 ${p.is_featured ? 'border-power-400/50 shadow-cyan' : ''}`}><div className="text-xs uppercase tracking-[.2em] text-white/30">{String(i+1).padStart(2,'0')}</div><div className="mt-8 flex items-end justify-between gap-4"><h3 className="font-display text-2xl font-semibold">{p.name}</h3><div className="text-2xl font-bold text-power-300">{money(p.price)}</div></div><p className="mt-3 text-sm leading-6 text-white/40">{p.description || `${p.duration_months} month membership.`}</p><div className="mt-7 border-t border-white/10 pt-5 text-xs text-white/35">{p.duration_months} months · Enquire on WhatsApp</div></div>)}
      </div>
    </section>

    <section className="border-t border-white/10 bg-power-400 py-20 text-black">
      <div className="section-shell flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
        <div><div className="text-xs font-bold uppercase tracking-[.24em]">Ready?</div><h2 className="mt-2 font-display text-4xl font-bold tracking-tight sm:text-5xl">Make the next session count.</h2></div>
        <WhatsAppButton message="Hi, I’m interested in joining Power Fitness Health Club Gym. Please share the membership details." children="Start a conversation"/>
      </div>
    </section>
  </main>
}