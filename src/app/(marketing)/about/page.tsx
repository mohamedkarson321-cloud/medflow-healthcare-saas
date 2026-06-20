import { Shield, Target, Heart, Users, Award, Zap } from "lucide-react";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "About Us — MedFlow" };
const values = [
  { icon: Heart, title: "Patient-Centered", desc: "Every feature we build starts with the question: does this improve patient care?" },
  { icon: Shield, title: "Security First", desc: "Bank-level encryption and HIPAA-compliant infrastructure protect every record." },
  { icon: Zap, title: "Relentless Speed", desc: "Clinics deserve software that's as fast as the care they provide." },
  { icon: Users, title: "Built With Clinicians", desc: "Every workflow is co-designed with doctors, nurses, and admin staff." },
];
export default function AboutPage() {
  return (
    <div className="pt-24 pb-20">
      <div className="page-container">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <span className="section-eyebrow">Our Story</span>
          <h1 className="mt-4 text-5xl font-bold tracking-tight">Built by healthcare people, for healthcare people</h1>
          <p className="mt-5 text-lg text-muted-foreground">MedFlow started in 2021 when a group of doctors and engineers got tired of clunky, outdated clinic software. Today we power over 500 clinics across the region.</p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-20">
          {[{v:"2021",l:"Founded"},{v:"500+",l:"Clinics"},{v:"2M+",l:"Patients"},{v:"45",l:"Team Members"}].map(s=>(
            <div key={s.l} className="text-center"><div className="text-4xl font-bold gradient-text">{s.v}</div><div className="text-sm text-muted-foreground mt-1">{s.l}</div></div>
          ))}
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mb-20">
          {values.map(v=>(
            <div key={v.title} className="feature-card">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary"><v.icon className="h-6 w-6" /></div>
              <h3 className="mt-4 font-semibold">{v.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{v.desc}</p>
            </div>
          ))}
        </div>
        <div className="rounded-3xl bg-muted/30 p-10 text-center">
          <Target className="mx-auto h-10 w-10 text-primary mb-4" />
          <h2 className="text-2xl font-bold mb-3">Our Mission</h2>
          <p className="max-w-2xl mx-auto text-muted-foreground">To give every clinic — regardless of size — access to enterprise-grade technology that lets them focus on what matters: patient care.</p>
        </div>
      </div>
    </div>
  );
}
