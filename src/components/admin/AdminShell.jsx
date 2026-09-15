import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Users, CreditCard, Image, Dumbbell, Settings, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'
import Brand from '@/components/Brand'
import { useAuth } from '@/hooks/useAuth'

const nav = [
 ['/admin/dashboard','Dashboard',LayoutDashboard],
 ['/admin/members','Members',Users],
 ['/admin/plans','Plans',CreditCard],
 ['/admin/facilities','Facilities',Dumbbell],
 ['/admin/gallery','Gallery',Image],
 ['/admin/settings','Settings',Settings]
]
export default function AdminShell(){
 const [open,setOpen]=useState(false); const {logout}=useAuth(); const navigate=useNavigate()
 const signOut=async()=>{await logout();navigate('/admin/login')}
 return <div className="min-h-screen bg-[#030608]">
  <aside className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-white/10 bg-[#05090b] p-5 transition-transform lg:translate-x-0 ${open?'translate-x-0':'-translate-x-full'}`}>
   <div className="flex items-center justify-between"><NavLink to="/admin/dashboard"><Brand compact/></NavLink><button className="lg:hidden" onClick={()=>setOpen(false)}><X size={20}/></button></div>
   <div className="mt-10 space-y-1">{nav.map(([to,label,Icon])=><NavLink onClick={()=>setOpen(false)} key={to} to={to} className={({isActive})=>`flex items-center gap-3 px-3 py-3 text-sm font-semibold transition ${isActive?'bg-power-400/10 text-power-300':'text-white/45 hover:bg-white/5 hover:text-white'}`}><Icon size={17}/>{label}</NavLink>)}</div>
   <button onClick={signOut} className="absolute bottom-6 left-5 right-5 flex items-center gap-3 border border-white/10 px-3 py-3 text-sm font-semibold text-white/45 hover:text-white"><LogOut size={17}/> Sign out</button>
  </aside>
  {open&&<div className="fixed inset-0 z-40 bg-black/70 lg:hidden" onClick={()=>setOpen(false)}/>}
  <div className="lg:pl-64"><header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/10 bg-[#030608]/85 px-5 backdrop-blur-xl lg:px-8"><button className="lg:hidden" onClick={()=>setOpen(true)}><Menu/></button><div className="ml-auto text-xs uppercase tracking-[.16em] text-white/30">Admin workspace</div></header><main className="p-5 lg:p-8"><Outlet/></main></div>
 </div>
}