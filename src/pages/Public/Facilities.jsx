import SectionHeading from '@/components/SectionHeading'
import { useTable } from '@/hooks/useGymData'
export default function Facilities(){
 const {data,loading,error}=useTable('facilities','*',{order:'created_at',ascending:false})
 return <main className="section-shell py-20 sm:py-28"><SectionHeading eyebrow="Facilities" title="Your training space." text="Facilities shown here are controlled by the gym admin, keeping the public information editable and accurate."/>
 {error && <p className="mt-8 text-sm text-red-300">{error.message}</p>}
 <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
  {loading ? [1,2,3].map(x=><div key={x} className="h-72 animate-pulse border border-white/10 bg-white/[.03]"/>)
  : data.length ? data.map((f,i)=><article key={f.id} className="premium-card overflow-hidden"><div className="aspect-[4/3] bg-gradient-to-br from-white/10 to-power-400/[.05]">{f.image_url && <img src={f.image_url} alt={f.name} className="h-full w-full object-cover"/>}</div><div className="p-7"><div className="text-xs text-power-300">0{i+1}</div><h3 className="mt-5 font-display text-2xl font-semibold">{f.name}</h3><p className="mt-2 text-sm leading-6 text-white/40">{f.description || 'Facility information will be updated by the gym.'}</p></div></article>)
  : <div className="border border-dashed border-white/15 p-10 text-white/40 md:col-span-3">Facilities will be published here by the gym.</div>}
 </div></main>
}