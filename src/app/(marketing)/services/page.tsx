import { Calendar, FileText, Pill, FlaskConical, CreditCard, BarChart3, Bell, Users, Shield } from "lucide-react";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Services — MedFlow" };
const services = [
  { icon: Calendar, title: "Appointment Scheduling", desc: "Smart calendar with automated reminders, waitlists, and conflict detection." },
  { icon: FileText, title: "Electronic Medical Records", desc: "Comprehensive EMR with diagnoses, treatment plans, and full medical history." },
  { icon: Pill, title: "Digital Prescriptions", desc: "Generate, print, and track prescriptions with full medication history." },
  { icon: FlaskConical, title: "Laboratory Management", desc: "Request tests, track samples, and deliver results securely to patients." },
  { icon: CreditCard, title: "Billing & Invoicing", desc: "Automated invoicing, payment tracking, and insurance claim management." },
  { icon: BarChart3, title: "Analytics & Reporting", desc: "Real-time dashboards for revenue, appointments, and clinic performance." },
  { icon: Bell, title: "Multi-Channel Notifications", desc: "Email, SMS, and in-app alerts keep patients and staff informed." },
  { icon: Users, title: "Patient Portal", desc: "Self-service portal for booking, records, prescriptions, and payments." },
  { icon: Shield, title: "Role-Based Security", desc: "Granular permissions for admins, doctors, nurses, and receptionists." },
];
export default function ServicesPage() {
  return (
    <div className="pt-24 pb-20">
      <div className="page-container">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <span className="section-eyebrow">What We Offer</span>
          <h1 className="mt-4 text-5xl font-bold tracking-tight">Complete clinic services</h1>
          <p className="mt-4 text-lg text-muted-foreground">Every module your clinic needs, fully integrated into one seamless platform.</p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map(s=>(
            <div key={s.title} className="feature-card">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary"><s.icon className="h-6 w-6" /></div>
              <h3 className="mt-4 font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
