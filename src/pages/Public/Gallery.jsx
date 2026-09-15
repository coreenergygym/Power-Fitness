import { useState } from 'react'
import { X } from 'lucide-react'
import SectionHeading from '@/components/SectionHeading'
import { useTable } from '@/hooks/useGymData'
export default function Gallery(){
 const {data,loading}=useTable('gallery_items','*',{order:'created_at',ascending:false})
 const [selected,setSelected]=useState(null)
 return <main className="section-shell py-20 sm:py-28"><SectionHeading eyebrow="Gallery" title="Inside Power Fitness." text="Only media uploaded by the gym admin is displayed here."/>
 <div className="mt-14 columns-1 gap-4 sm:columns-2 lg:columns-3">
  {loading ? [1,2,3,4,5,6].map(x=><div key={x} className="mb-4 h-64 animate-pulse break-inside-avoid bg-white/[.03]"/>)
  : data.length ? data.map(item=><button key={item.id} onClick={()=>setSelected(item)} className="group relative mb-4 block w-full overflow-hidden border border-white/10 bg-white/[.02] text-left">{item.type==='video' ? <video src={item.url} muted playsInline className="max-h-[600px] w-full object-cover"/> : <img src={item.url} alt={item.caption || 'Power Fitness gallery'} loading="lazy" className="w-full object-cover transition duration-500 group-hover:scale-[1.02]"/>}{item.caption&&<div className="absolute inset-x-0 bottom-0 bg-black/70 p-4 text-xs text-white/75 opacity-0 transition group-hover:opacity-100">{item.caption}</div>}</button>)
  : <div className="w-full border border-dashed border-white/15 p-12 text-center text-white/40 sm:col-span-2 lg:col-span-3">Gallery media will appear here after the gym uploads it.</div>}
 </div>
 {selected && <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/90 p-5" onClick={()=>setSelected(null)}><button className="absolute right-5 top-5 border border-white/10 p-3" aria-label="Close"><X/></button><div onClick={e=>e.stopPropagation()} className="max-h-[90vh] max-w-6xl">{selected.type==='video'?<video src={selected.url} controls autoPlay className="max-h-[85vh] max-w-full"/>:<img src={selected.url} alt={selected.caption||'Gallery'} className="max-h-[85vh] max-w-full object-contain"/>}</div></div>}
 </main>
}