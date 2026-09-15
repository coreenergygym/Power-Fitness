import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { requireSupabase } from '@/lib/supabase'
import { useSupabaseUpload } from '@/hooks/useSupabaseUpload'
import { money, paymentStatus, dueAmount } from '@/utils/format'

const empty={photo_url:'',full_name:'',phone:'',email:'',gender:'',address:'',membership_plan_id:'',start_date:new Date().toISOString().slice(0,10),expiry_date:'',payment_status:'unpaid',amount_paid:0,notes:''}
export default function MemberForm({member=null}){
 const [form,setForm]=useState({...empty,...member,amount_paid:Number(member?.amount_paid||0)})
 const [plans,setPlans]=useState([]); const [saving,setSaving]=useState(false); const [message,setMessage]=useState(''); const nav=useNavigate()
 const {uploadFile,isUploading}=useSupabaseUpload('member-photos')
 useEffect(()=>{requireSupabase().from('membership_plans').select('*').order('price',{ascending:true}).then(({data})=>setPlans(data||[])).catch(()=>{})},[])
 const selected=useMemo(()=>plans.find(p=>p.id===form.membership_plan_id),[plans,form.membership_plan_id])
 const calculatedStatus=paymentStatus(selected?.price,form.amount_paid)
 const calculatedDue=dueAmount(selected?.price,form.amount_paid)
 useEffect(()=>{if(selected && !member){const d=new Date(form.start_date||Date.now());d.setMonth(d.getMonth()+Number(selected.duration_months));setForm(f=>({...f,expiry_date:d.toISOString().slice(0,10)}))}},[selected])
 const set=(k,v)=>setForm(f=>({...f,[k]:v}))
 const photo=async e=>{const file=e.target.files?.[0];if(!file)return;const r=await uploadFile(file,'members');set('photo_url',r.publicUrl)}
 const submit=async e=>{e.preventDefault();setSaving(true);setMessage('');try{const sb=requireSupabase();const payload={...form,amount_paid:Number(form.amount_paid||0),payment_status:calculatedStatus,due_amount:calculatedDue,email:form.email||null,gender:form.gender||null,address:form.address||null,membership_plan_id:form.membership_plan_id||null};let q=member?sb.from('members').update(payload).eq('id',member.id):sb.from('members').insert(payload).select().single();const {data:saved,error}=await q;if(error)throw error;
 if(!member && saved){
   const {error:historyError}=await sb.from('membership_history').insert({member_id:saved.id,membership_plan_id:saved.membership_plan_id,start_date:saved.start_date,expiry_date:saved.expiry_date,amount:Number(selected?.price||0),amount_paid:Number(saved.amount_paid||0),payment_status:calculatedStatus});
   if(historyError) console.warn('Membership history could not be saved:', historyError.message)
   if(Number(saved.amount_paid||0)>0){
     const {error:paymentError}=await sb.from('payments').insert({member_id:saved.id,amount:Number(saved.amount_paid),payment_status:calculatedStatus,method:'Manual',notes:'Initial membership payment'});
     if(paymentError) console.warn('Payment history could not be saved:', paymentError.message)
   }
 }
 nav('/admin/members')}catch(err){setMessage(err.message)}finally{setSaving(false)}}
 return <form onSubmit={submit} className="space-y-7">
  {message&&<div className="border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-200">{message}</div>}
  <div className="grid gap-5 sm:grid-cols-2">
   <label className="sm:col-span-2"><span className="label">Photo</span><input type="file" accept="image/*" onChange={photo} className="field file:mr-4 file:border-0 file:bg-white/10 file:px-3 file:py-2 file:text-white/70"/>{form.photo_url&&<img src={form.photo_url} alt="" className="mt-3 h-20 w-20 object-cover border border-white/10"/>}</label>
   <label><span className="label">Full name *</span><input className="field" required value={form.full_name} onChange={e=>set('full_name',e.target.value)}/></label>
   <label><span className="label">Phone *</span><input className="field" required value={form.phone} onChange={e=>set('phone',e.target.value)}/></label>
   <label><span className="label">Email</span><input className="field" type="email" value={form.email||''} onChange={e=>set('email',e.target.value)}/></label>
   <label><span className="label">Gender</span><select className="field" value={form.gender||''} onChange={e=>set('gender',e.target.value)}><option value="">Select</option><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option></select></label>
   <label className="sm:col-span-2"><span className="label">Address</span><input className="field" value={form.address||''} onChange={e=>set('address',e.target.value)}/></label>
   <label><span className="label">Membership plan</span><select className="field" value={form.membership_plan_id||''} onChange={e=>set('membership_plan_id',e.target.value)}><option value="">No plan</option>{plans.map(p=><option key={p.id} value={p.id}>{p.name} · {money(p.price)}</option>)}</select></label>
   <label><span className="label">Amount paid</span><input className="field" type="number" min="0" value={form.amount_paid} onChange={e=>set('amount_paid',e.target.value)}/></label>
   <label><span className="label">Start date *</span><input className="field" type="date" required value={form.start_date} onChange={e=>set('start_date',e.target.value)}/></label>
   <label><span className="label">Expiry date *</span><input className="field" type="date" required value={form.expiry_date} onChange={e=>set('expiry_date',e.target.value)}/></label>
   <div><span className="label">Payment status</span><div className="field flex items-center justify-between"><span className={calculatedStatus==='paid'?'text-emerald-300':calculatedStatus==='partial'?'text-amber-300':'text-red-300'}>{calculatedStatus.toUpperCase()}</span><span className="text-xs text-white/35">Due {money(calculatedDue)}</span></div></div>
   <label className="sm:col-span-2"><span className="label">Notes</span><textarea className="field min-h-28" value={form.notes||''} onChange={e=>set('notes',e.target.value)}/></label>
  </div>
  <button disabled={saving||isUploading} className="btn-primary w-full">{isUploading?'Uploading photo…':saving?'Saving…':member?'Update member':'Add member'}</button>
 </form>
}