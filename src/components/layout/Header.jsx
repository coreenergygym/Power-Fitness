import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, ArrowUpRight } from 'lucide-react'
import Brand from '@/components/Brand'

const links = [
  ['/', 'Home'], ['/about', 'About'], ['/facilities', 'Facilities'],
  ['/membership', 'Membership'], ['/gallery', 'Gallery'], ['/contact', 'Contact']
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#020507]/85 backdrop-blur-xl">
      <div className="section-shell">
        <div className="flex h-[74px] items-center justify-between gap-4">
          <Link to="/" onClick={() => setOpen(false)}><Brand compact /></Link>
          <nav className="hidden items-center gap-7 lg:flex">
            {links.map(([to, label]) => (
              <Link key={to} to={to} className={`text-[12px] font-semibold uppercase tracking-[.16em] transition ${location.pathname===to ? 'text-white' : 'text-white/45 hover:text-white'}`}>{label}</Link>
            ))}
          </nav>
          <div className="hidden items-center gap-3 lg:flex">
            <a href="https://www.instagram.com/power_fitness_healthclub_gym/" target="_blank" rel="noreferrer" className="text-white/45 transition hover:text-white" aria-label="Instagram"><ArrowUpRight size={17}/></a>
            <Link to="/admin/login" className="btn-secondary py-2.5"><span>Admin Login</span><ArrowUpRight size={15}/></Link>
          </div>
          <button className="border border-white/10 p-2.5 lg:hidden" onClick={() => setOpen(v=>!v)} aria-label="Toggle navigation" aria-expanded={open}>
            {open ? <X size={21}/> : <Menu size={21}/>}
          </button>
        </div>
        {open && (
          <div className="border-t border-white/10 py-4 lg:hidden">
            <div className="grid gap-1">
              {links.map(([to,label]) => <Link key={to} onClick={()=>setOpen(false)} to={to} className="px-3 py-3 text-sm font-semibold uppercase tracking-[.14em] text-white/70 hover:bg-white/5 hover:text-white">{label}</Link>)}
              <Link onClick={()=>setOpen(false)} to="/admin/login" className="mt-2 flex items-center justify-between border border-power-400/30 bg-power-400/10 px-3 py-3 text-sm font-bold uppercase tracking-[.12em] text-power-300">Admin Login <ArrowUpRight size={16}/></Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}