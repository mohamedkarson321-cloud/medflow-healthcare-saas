"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
const faqs = [
  { cat:"Getting Started", q:"How do I sign up for MedFlow?", a:"Simply click 'Start Free Trial' and follow the registration steps. You'll have full access within minutes." },
  { cat:"Getting Started", q:"Is there a free trial?", a:"Yes, all plans include a 14-day free trial with no credit card required." },
  { cat:"Billing", q:"What payment methods do you accept?", a:"We accept all major credit cards, bank transfers, and local payment methods." },
  { cat:"Billing", q:"Can I cancel anytime?", a:"Yes, you can cancel your subscription at any time with no cancellation fees." },
  { cat:"Security", q:"Is my patient data secure?", a:"Absolutely. We use AES-256 encryption, regular security audits, and are HIPAA-compliant." },
  { cat:"Security", q:"Where is data stored?", a:"Data is stored in secure, redundant cloud servers with daily automated backups." },
  { cat:"Support", q:"What support do you offer?", a:"Email support for all plans, with priority chat and 24/7 phone support for Professional and Enterprise plans." },
  { cat:"Support", q:"Do you offer training?", a:"Yes, we provide free onboarding training for all new clinics." },
];
export default function FaqPage() {
  const [open, setOpen] = useState<number|null>(0);
  return (
    <div className="pt-24 pb-20">
      <div className="page-container">
        <div className="mx-auto max-w-2xl text-center mb-14">
          <span className="section-eyebrow">Support</span>
          <h1 className="mt-4 text-5xl font-bold tracking-tight">Frequently asked questions</h1>
        </div>
        <div className="mx-auto max-w-3xl space-y-3">
          {faqs.map((f,i)=>(
            <div key={i} className="rounded-xl border bg-card overflow-hidden">
              <button onClick={()=>setOpen(open===i?null:i)} className="flex w-full items-center justify-between gap-4 p-5 text-left">
                <div><span className="text-xs font-medium text-primary">{f.cat}</span><div className="font-semibold mt-0.5">{f.q}</div></div>
                <ChevronDown className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform ${open===i?"rotate-180":""}`} />
              </button>
              {open===i && <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">{f.a}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
