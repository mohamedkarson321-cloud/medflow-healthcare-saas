import { Star } from "lucide-react";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Testimonials — MedFlow" };
const testimonials = [
  { name:"Dr. Ahmed Hassan", role:"Medical Director, Cairo Medical Center", rating:5, quote:"MedFlow transformed how we manage our 50-doctor clinic. No-shows dropped 40% and billing is 3x faster.", avatar:"AH" },
  { name:"Dr. Sarah El-Masry", role:"Owner, Elite Dental Clinic", rating:5, quote:"The patient portal is exceptional. Our patients love booking online and accessing records 24/7.", avatar:"SE" },
  { name:"Omar Farouk", role:"Admin Manager, Al-Shifa Hospital", rating:5, quote:"We migrated in 2 days. The analytics justified the investment within the first month.", avatar:"OF" },
  { name:"Dr. Mohamed Khalil", role:"Orthopedic Surgeon", rating:5, quote:"Scheduling used to be chaos. Now it's seamless across our entire team.", avatar:"MK" },
  { name:"Layla Ibrahim", role:"Practice Manager", rating:4, quote:"Excellent support team and constantly improving features. Highly recommend.", avatar:"LI" },
  { name:"Dr. Nadia Youssef", role:"Pediatrician", rating:5, quote:"The EMR system saves me at least an hour every day. Patients notice the difference too.", avatar:"NY" },
];
export default function TestimonialsPage() {
  return (
    <div className="pt-24 pb-20">
      <div className="page-container">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <span className="section-eyebrow">Customer Stories</span>
          <h1 className="mt-4 text-5xl font-bold tracking-tight">Loved by 500+ clinics</h1>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map(t=>(
            <div key={t.name} className="rounded-2xl border bg-card p-6 shadow-card">
              <div className="flex gap-0.5 mb-4">{Array.from({length:t.rating}).map((_,i)=><Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)}</div>
              <p className="text-sm text-muted-foreground leading-relaxed">"{t.quote}"</p>
              <div className="mt-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-sm font-bold text-white">{t.avatar}</div>
                <div><div className="text-sm font-semibold">{t.name}</div><div className="text-xs text-muted-foreground">{t.role}</div></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
