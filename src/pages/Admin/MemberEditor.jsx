import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { requireSupabase } from '@/lib/supabase'
import MemberForm from '@/components/admin/MemberForm'
export default function MemberEditor(){
 const {id}=useParams();const [member,setMember]=useState(null);const [loading,setLoading]=useState(Boolean(id));const [error,setError]=useState('')
 useEffect(()=>{if(!id)return;requireSupabase().from('members').select('*').eq('id',id).single().then(({data,error:e})=>{if(e)setError(e.message);else setMember(data);setLoading(false)})},[id])
 if(loading)return <div className="p-10 text-white/40">Loading…</div>
 return <div className="mx-auto max-w-4xl"><Link to="/admin/members" className="text-xs uppercase tracking-[.15em] text-white/35 hover:text-white">← Members</Link><h1 className="mt-4 font-display text-3xl font-bold">{id?'Edit member':'Add member'}</h1>{error?<div className="mt-8 text-red-300">{error}</div>:<div className="premium-card mt-8 p-6 sm:p-8"><MemberForm member={member}/></div>}</div>
}