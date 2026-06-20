import { Heart, Brain, Bone, Smile, Eye, Activity, Baby, Users, Ear, Scan, FlaskConical, Zap } from "lucide-react";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Departments — MedFlow" };
const departments = [
  { icon: Heart, name: "Cardiology", desc: "Heart health diagnostics and treatment", doctors: 24 },
  { icon: Brain, name: "Neurology", desc: "Brain and nervous system care", doctors: 18 },
  { icon: Bone, name: "Orthopedics", desc: "Bone, joint, and muscle treatment", doctors: 20 },
  { icon: Smile, name: "Dentistry", desc: "Complete dental care services", doctors: 32 },
  { icon: Eye, name: "Ophthalmology", desc: "Eye care and vision health", doctors: 15 },
  { icon: Activity, name: "Physiotherapy", desc: "Rehabilitation and physical therapy", doctors: 28 },
  { icon: Baby, name: "Pediatrics", desc: "Child healthcare specialists", doctors: 22 },
  { icon: Users, name: "Gynecology", desc: "Women's health services", doctors: 19 },
  { icon: Ear, name: "ENT", desc: "Ear, nose & throat treatment", doctors: 14 },
  { icon: Scan, name: "Dermatology", desc: "Skin health and treatment", doctors: 16 },
  { icon: FlaskConical, name: "Laboratory", desc: "Diagnostic testing services", doctors: 12 },
  { icon: Zap, name: "Emergency", desc: "24/7 urgent care", doctors: 30 },
];
export default function DepartmentsPage() {
  return (
    <div className="pt-24 pb-20">
      <div className="page-container">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <span className="section-eyebrow">Medical Specialties</span>
          <h1 className="mt-4 text-5xl font-bold tracking-tight">All departments, one platform</h1>
          <p className="mt-4 text-lg text-muted-foreground">From general medicine to specialized surgery, find the right department for your needs.</p>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {departments.map(d=>(
            <div key={d.name} className="group rounded-2xl border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-card-md hover:-translate-y-0.5">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all"><d.icon className="h-7 w-7" /></div>
              <h3 className="mt-4 text-lg font-bold">{d.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{d.desc}</p>
              <p className="mt-3 text-xs font-medium text-primary">{d.doctors} Doctors Available</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
