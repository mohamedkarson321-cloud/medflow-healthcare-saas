"use client";
import { useState } from "react";
import { Calendar, Clock, User, Stethoscope, CheckCircle2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, FormField } from "@/components/ui/input";
const doctors = [
  { id:"1", name:"Dr. Ahmed Hassan", specialty:"Cardiology", fee:500, avatar:"AH" },
  { id:"2", name:"Dr. Sarah El-Masry", specialty:"Dermatology", fee:400, avatar:"SE" },
  { id:"3", name:"Dr. Mohamed Khalil", specialty:"Orthopedics", fee:600, avatar:"MK" },
  { id:"4", name:"Dr. Nadia Youssef", specialty:"Pediatrics", fee:350, avatar:"NY" },
];
const timeSlots = ["09:00","09:30","10:00","10:30","11:00","11:30","14:00","14:30","15:00","15:30","16:00","16:30"];
export default function BookAppointmentPage() {
  const [step, setStep] = useState(1);
  const [selected, setSelected] = useState({ doctor:"", date:"", time:"", type:"IN_PERSON", reason:"", name:"", phone:"", email:"" });
  const selectedDoc = doctors.find(d=>d.id===selected.doctor);
  if (step === 4) return (
    <div className="min-h-screen pt-24 pb-20 flex items-center justify-center">
      <div className="w-full max-w-md text-center space-y-5 p-8">
        <div className="flex justify-center"><div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-green-100"><CheckCircle2 className="h-10 w-10 text-green-600" /></div></div>
        <h1 className="text-3xl font-bold">Appointment Booked! 🎉</h1>
        <p className="text-muted-foreground">Your appointment has been confirmed. You'll receive a confirmation email shortly.</p>
        <div className="rounded-xl border bg-card p-5 text-left space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Doctor</span><span className="font-medium">{selectedDoc?.name}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Date</span><span className="font-medium">{selected.date}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Time</span><span className="font-medium">{selected.time}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Type</span><span className="font-medium">{selected.type.replace(/_/g," ")}</span></div>
        </div>
        <Button className="w-full" size="lg" onClick={()=>{ setStep(1); setSelected({doctor:"",date:"",time:"",type:"IN_PERSON",reason:"",name:"",phone:"",email:""}); }}>Book Another Appointment</Button>
      </div>
    </div>
  );
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="page-container">
        <div className="mx-auto max-w-3xl">
          <div className="text-center mb-10">
            <span className="section-eyebrow">Online Booking</span>
            <h1 className="mt-4 text-4xl font-bold">Book an Appointment</h1>
            <p className="mt-3 text-muted-foreground">Schedule with one of our specialist doctors in minutes.</p>
          </div>
          {/* Steps */}
          <div className="flex items-center gap-2 mb-8 justify-center">
            {[{n:1,label:"Doctor"},{n:2,label:"Schedule"},{n:3,label:"Details"}].map((s,i,arr)=>(
              <div key={s.n} className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-all ${step>=s.n?"bg-primary text-white":"bg-muted text-muted-foreground"}`}>{s.n}</div>
                  <span className={`text-sm hidden sm:block ${step>=s.n?"font-semibold text-foreground":"text-muted-foreground"}`}>{s.label}</span>
                </div>
                {i<arr.length-1 && <div className={`h-0.5 w-12 transition-all ${step>s.n?"bg-primary":"bg-border"}`} />}
              </div>
            ))}
          </div>
          <div className="rounded-2xl border bg-card p-8 shadow-card">
            {step===1 && (
              <div>
                <h2 className="text-lg font-bold mb-5 flex items-center gap-2"><Stethoscope className="h-5 w-5 text-primary" />Choose a Doctor</h2>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {doctors.map(doc=>(
                    <button key={doc.id} onClick={()=>setSelected(p=>({...p,doctor:doc.id}))} className={`flex items-center gap-4 rounded-xl border p-4 text-left transition-all hover:border-primary/40 ${selected.doctor===doc.id?"border-primary bg-primary/5 ring-2 ring-primary/20":""}`}>
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-base font-bold text-white">{doc.avatar}</div>
                      <div><div className="font-semibold text-sm">{doc.name}</div><div className="text-xs text-muted-foreground">{doc.specialty}</div><div className="text-xs font-medium text-primary mt-1">EGP {doc.fee}</div></div>
                    </button>
                  ))}
                </div>
                <Button className="w-full mt-6" disabled={!selected.doctor} onClick={()=>setStep(2)} rightIcon={<ChevronRight className="h-4 w-4" />}>Continue</Button>
              </div>
            )}
            {step===2 && (
              <div>
                <h2 className="text-lg font-bold mb-5 flex items-center gap-2"><Calendar className="h-5 w-5 text-primary" />Choose Date & Time</h2>
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Appointment Date" required htmlFor="date"><input id="date" type="date" min={new Date().toISOString().split("T")[0]} value={selected.date} onChange={e=>setSelected(p=>({...p,date:e.target.value}))} className="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" /></FormField>
                    <FormField label="Type" htmlFor="type"><select id="type" value={selected.type} onChange={e=>setSelected(p=>({...p,type:e.target.value}))} className="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><option value="IN_PERSON">In-Person</option><option value="TELEMEDICINE">Telemedicine</option><option value="FOLLOW_UP">Follow-Up</option></select></FormField>
                  </div>
                  {selected.date && (
                    <div>
                      <label className="text-sm font-medium mb-3 block flex items-center gap-2"><Clock className="h-4 w-4 text-primary" />Available Time Slots</label>
                      <div className="grid grid-cols-4 gap-2">
                        {timeSlots.map(t=>(
                          <button key={t} onClick={()=>setSelected(p=>({...p,time:t}))} className={`rounded-lg border py-2 text-sm font-medium transition-all hover:border-primary/40 ${selected.time===t?"border-primary bg-primary text-white":"bg-background"}`}>{t}</button>
                        ))}
                      </div>
                    </div>
                  )}
                  <FormField label="Reason for Visit" htmlFor="reason"><Input id="reason" placeholder="Brief description of your symptoms or concern…" value={selected.reason} onChange={e=>setSelected(p=>({...p,reason:e.target.value}))} /></FormField>
                </div>
                <div className="flex gap-3 mt-6"><Button variant="outline" className="flex-1" onClick={()=>setStep(1)}>Back</Button><Button className="flex-1" disabled={!selected.date||!selected.time} onClick={()=>setStep(3)} rightIcon={<ChevronRight className="h-4 w-4" />}>Continue</Button></div>
              </div>
            )}
            {step===3 && (
              <div>
                <h2 className="text-lg font-bold mb-5 flex items-center gap-2"><User className="h-5 w-5 text-primary" />Your Information</h2>
                <div className="space-y-4">
                  <div className="rounded-xl border bg-muted/30 p-4 space-y-1.5 text-sm">
                    <div className="flex justify-between"><span className="text-muted-foreground">Doctor</span><span className="font-medium">{selectedDoc?.name}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Date & Time</span><span className="font-medium">{selected.date} at {selected.time}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Fee</span><span className="font-medium text-primary">EGP {selectedDoc?.fee}</span></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Full Name" required htmlFor="pname"><Input id="pname" placeholder="Ahmed Hassan" value={selected.name} onChange={e=>setSelected(p=>({...p,name:e.target.value}))} /></FormField>
                    <FormField label="Phone" required htmlFor="pphone"><Input id="pphone" type="tel" placeholder="+20 12 345 6789" value={selected.phone} onChange={e=>setSelected(p=>({...p,phone:e.target.value}))} /></FormField>
                    <FormField label="Email" htmlFor="pemail" className="col-span-2"><Input id="pemail" type="email" placeholder="you@email.com" value={selected.email} onChange={e=>setSelected(p=>({...p,email:e.target.value}))} /></FormField>
                  </div>
                </div>
                <div className="flex gap-3 mt-6"><Button variant="outline" className="flex-1" onClick={()=>setStep(2)}>Back</Button><Button className="flex-1" disabled={!selected.name||!selected.phone} onClick={()=>setStep(4)} leftIcon={<CheckCircle2 className="h-4 w-4" />}>Confirm Booking</Button></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
