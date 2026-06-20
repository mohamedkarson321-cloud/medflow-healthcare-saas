"use client";
import { useState } from "react";
import { Search, CheckSquare, Clock, User, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared";
export default function CheckInPage() {
  const [query, setQuery] = useState("");
  const [checked, setChecked] = useState<string[]>([]);
  const mockAppointments = [
    { id:"1", patient:"Ahmed Hassan", time:"09:00", doctor:"Dr. Sarah", type:"Consultation", status:"SCHEDULED" },
    { id:"2", patient:"Nadia Youssef", time:"09:30", doctor:"Dr. Ahmed", type:"Follow-Up", status:"SCHEDULED" },
    { id:"3", patient:"Omar Farouk", time:"10:00", doctor:"Dr. Mohamed", type:"Procedure", status:"CONFIRMED" },
    { id:"4", patient:"Layla Ibrahim", time:"10:30", doctor:"Dr. Sarah", type:"Consultation", status:"CHECKED_IN" },
  ];
  const filtered = mockAppointments.filter(a => a.patient.toLowerCase().includes(query.toLowerCase()) || a.time.includes(query));
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Patient Check-In" description="Search for today's appointments and check in patients." />
      <div className="rounded-2xl border bg-card p-6 shadow-card">
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search by patient name, appointment ID, or time…" className="flex h-12 w-full rounded-xl border-2 border-input bg-background pl-12 pr-4 text-base placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:border-primary transition-colors" />
        </div>
        <div className="space-y-2">
          {filtered.map(a => (
            <div key={a.id} className={`flex items-center gap-4 rounded-xl border p-4 transition-all ${checked.includes(a.id) || a.status==="CHECKED_IN" ? "border-green-200 bg-green-50 dark:border-green-800/50 dark:bg-green-950/20" : "bg-card hover:border-primary/20"}`}>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-brand-600 text-sm font-bold text-white">{a.patient.split(" ").map(n=>n[0]).join("")}</div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm">{a.patient}</div>
                <div className="text-xs text-muted-foreground flex items-center gap-2"><Clock className="h-3 w-3" />{a.time} · {a.doctor} · {a.type}</div>
              </div>
              <div className="shrink-0">
                {checked.includes(a.id) || a.status==="CHECKED_IN" ? (
                  <span className="flex items-center gap-1.5 text-sm font-semibold text-green-600"><CheckCircle2 className="h-4 w-4" />Checked In</span>
                ) : (
                  <Button size="sm" onClick={()=>setChecked(p=>[...p,a.id])} leftIcon={<CheckSquare className="h-3.5 w-3.5" />}>Check In</Button>
                )}
              </div>
            </div>
          ))}
          {filtered.length === 0 && <div className="py-10 text-center text-sm text-muted-foreground">No appointments found matching "{query}"</div>}
        </div>
      </div>
    </div>
  );
}
