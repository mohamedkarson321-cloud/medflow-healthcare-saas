import Link from "next/link";
import {
  ArrowRight, Star, Shield, Clock, Users, CheckCircle2, Zap,
  BarChart3, Calendar, FileText, Pill, FlaskConical, CreditCard,
  Stethoscope, Heart, Brain, Smile, Eye, Bone, Activity,
  Play, ChevronRight, TrendingUp, Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MedFlow — The Future of Healthcare Management",
  description: "World-class clinic management platform trusted by 500+ clinics.",
};

const stats = [
  { value: "500+", label: "Clinics Worldwide" },
  { value: "2M+", label: "Patients Managed" },
  { value: "99.9%", label: "Uptime SLA" },
  { value: "4.9/5", label: "Customer Rating" },
];

const features = [
  {
    icon: Calendar,
    title: "Smart Appointment Scheduling",
    description: "AI-powered scheduling with real-time availability, automated reminders, and intelligent conflict detection.",
    color: "bg-blue-500/10 text-blue-600",
  },
  {
    icon: FileText,
    title: "Electronic Medical Records",
    description: "Complete EMR with diagnoses, treatment plans, medical history, and secure cloud storage.",
    color: "bg-teal-500/10 text-teal-600",
  },
  {
    icon: Pill,
    title: "Digital Prescriptions",
    description: "Generate, manage, and print prescriptions digitally. Complete medication history tracking.",
    color: "bg-purple-500/10 text-purple-600",
  },
  {
    icon: FlaskConical,
    title: "Laboratory Management",
    description: "Request lab tests, track results, and give patients secure access to their reports.",
    color: "bg-orange-500/10 text-orange-600",
  },
  {
    icon: CreditCard,
    title: "Billing & Invoicing",
    description: "Automated invoicing, payment tracking, insurance claims, and comprehensive revenue reports.",
    color: "bg-green-500/10 text-green-600",
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Real-time KPIs, revenue dashboards, doctor performance metrics, and patient growth trends.",
    color: "bg-red-500/10 text-red-600",
  },
];

const departments = [
  { icon: Heart, name: "Cardiology", count: "24 Doctors" },
  { icon: Brain, name: "Neurology", count: "18 Doctors" },
  { icon: Bone, name: "Orthopedics", count: "20 Doctors" },
  { icon: Smile, name: "Dentistry", count: "32 Doctors" },
  { icon: Eye, name: "Ophthalmology", count: "15 Doctors" },
  { icon: Activity, name: "Physiotherapy", count: "28 Doctors" },
];

const testimonials = [
  {
    name: "Dr. Ahmed Hassan",
    title: "Medical Director, Cairo Medical Center",
    avatar: "AH",
    rating: 5,
    quote: "MedFlow transformed how we manage our 50-doctor clinic. Appointment no-shows dropped by 40% and our billing cycle is 3x faster.",
  },
  {
    name: "Dr. Sarah El-Masry",
    title: "Owner, Elite Dental Clinic",
    avatar: "SE",
    rating: 5,
    quote: "The patient portal is exceptional. Our patients love being able to book appointments and access their records online 24/7.",
  },
  {
    name: "Omar Farouk",
    title: "Admin Manager, Al-Shifa Hospital",
    avatar: "OF",
    rating: 5,
    quote: "We migrated from an outdated system in just 2 days. The analytics alone justified the entire investment in the first month.",
  },
];

const trustedBy = [
  "Cairo Medical Center", "Nile Cardiology", "Al-Shifa Hospital",
  "Elite Dental Group", "SkinCare Clinic", "PhysioPlus Centers",
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] overflow-hidden pt-24 pb-20 flex items-center">
        {/* Background */}
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-[600px] w-[600px] rounded-full bg-accent/5 blur-3xl" />

        <div className="page-container relative z-10">
          <div className="mx-auto max-w-4xl text-center">
            {/* Eyebrow */}
            <div className="mb-6 flex justify-center">
              <span className="section-eyebrow">
                <Zap className="h-3.5 w-3.5" />
                Trusted by 500+ Healthcare Providers
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-balance text-5xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              The Future of{" "}
              <span className="gradient-text">Healthcare</span>{" "}
              Management
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
              One platform for appointments, EMR, prescriptions, billing, and analytics.
              Built for clinics that refuse to compromise on quality.
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link href="/book-appointment">
                <Button size="xl" rightIcon={<ArrowRight />}>
                  Book an Appointment
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="xl" variant="outline">
                  View Pricing
                </Button>
              </Link>
            </div>

            {/* Social proof */}
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <div className="flex -space-x-2">
                {["Dr. A", "Dr. B", "Dr. C", "Dr. D", "Dr. E"].map((d, i) => (
                  <div
                    key={i}
                    className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-background bg-gradient-to-br from-brand-500 to-brand-700 text-xs font-bold text-white"
                  >
                    {d.split(" ")[1]}
                  </div>
                ))}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="ml-1 text-sm font-semibold">4.9/5</span>
                </div>
                <p className="text-xs text-muted-foreground">from 1,200+ verified reviews</p>
              </div>
            </div>
          </div>

          {/* Dashboard preview */}
          <div className="mt-20 mx-auto max-w-5xl">
            <div className="relative rounded-2xl border bg-card/80 backdrop-blur-sm shadow-card-xl overflow-hidden">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 border-b bg-muted/50 px-4 py-3">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                  <div className="h-3 w-3 rounded-full bg-yellow-400" />
                  <div className="h-3 w-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="rounded-md bg-background border px-4 py-1 text-xs text-muted-foreground font-mono">
                    app.medflow.health/admin/dashboard
                  </div>
                </div>
              </div>
              {/* Dashboard mockup */}
              <div className="bg-background p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <div className="h-5 w-40 skeleton" />
                    <div className="mt-1 h-3 w-28 skeleton" />
                  </div>
                  <div className="flex gap-2">
                    <div className="h-8 w-24 skeleton rounded-lg" />
                    <div className="h-8 w-24 skeleton rounded-lg" />
                  </div>
                </div>
                {/* Stat cards */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    { label: "Today's Appointments", value: "47", color: "bg-blue-50 dark:bg-blue-950", icon: "📅" },
                    { label: "Total Patients", value: "2,841", color: "bg-green-50 dark:bg-green-950", icon: "👥" },
                    { label: "Monthly Revenue", value: "EGP 184K", color: "bg-purple-50 dark:bg-purple-950", icon: "💰" },
                    { label: "Satisfaction Rate", value: "98.2%", color: "bg-orange-50 dark:bg-orange-950", icon: "⭐" },
                  ].map((stat) => (
                    <div key={stat.label} className={`rounded-xl p-4 ${stat.color}`}>
                      <div className="text-xl">{stat.icon}</div>
                      <div className="mt-2 text-xl font-bold text-foreground">{stat.value}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
                    </div>
                  ))}
                </div>
                {/* Table preview */}
                <div className="mt-4 rounded-xl border overflow-hidden">
                  <div className="bg-muted/40 px-4 py-2.5 border-b flex items-center gap-2">
                    <div className="h-3 w-32 skeleton" />
                  </div>
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-4 px-4 py-3 border-b last:border-0">
                      <div className="h-8 w-8 skeleton rounded-full" />
                      <div className="flex-1 space-y-1.5">
                        <div className="h-3 w-36 skeleton" />
                        <div className="h-2.5 w-24 skeleton" />
                      </div>
                      <div className="h-6 w-20 skeleton rounded-full" />
                      <div className="h-7 w-16 skeleton rounded-lg" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Live dashboard preview — actual UI for illustration
            </p>
          </div>
        </div>
      </section>

      {/* ── Trusted by ────────────────────────────────────────────────────── */}
      <section className="border-y bg-muted/30 py-12">
        <div className="page-container">
          <p className="mb-8 text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Trusted by leading healthcare providers
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {trustedBy.map((name) => (
              <span key={name} className="text-sm font-semibold text-muted-foreground/60 hover:text-muted-foreground transition-colors">
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="page-container">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl font-bold tracking-tight gradient-text">{stat.value}</div>
                <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────────────────── */}
      <section className="bg-muted/30 py-24">
        <div className="page-container">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <span className="section-eyebrow">Everything you need</span>
            <h2 className="mt-4 text-4xl font-bold tracking-tight">
              A complete platform for modern clinics
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              From booking to billing, MedFlow covers every aspect of clinic management in one seamless platform.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="feature-card">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${feature.color}`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-base font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
                <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn more <ChevronRight className="h-4 w-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Departments ───────────────────────────────────────────────────── */}
      <section className="py-24">
        <div className="page-container">
          <div className="flex flex-col items-center justify-between gap-4 mb-12 sm:flex-row">
            <div>
              <span className="section-eyebrow">Medical Specialties</span>
              <h2 className="mt-3 text-3xl font-bold tracking-tight">
                All departments, one platform
              </h2>
            </div>
            <Link href="/departments">
              <Button variant="outline" rightIcon={<ArrowRight className="h-4 w-4" />}>
                View All
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {departments.map((dept) => (
              <Link
                key={dept.name}
                href="/departments"
                className="group flex flex-col items-center gap-3 rounded-2xl border bg-card p-6 text-center transition-all hover:border-primary/30 hover:shadow-card-md hover:-translate-y-0.5"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all">
                  <dept.icon className="h-7 w-7" />
                </div>
                <div>
                  <div className="text-sm font-semibold">{dept.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{dept.count}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why MedFlow ───────────────────────────────────────────────────── */}
      <section className="bg-muted/30 py-24">
        <div className="page-container">
          <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
            <div>
              <span className="section-eyebrow">Why MedFlow</span>
              <h2 className="mt-4 text-4xl font-bold tracking-tight">
                Built for healthcare, not adapted for it
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Unlike generic software forced into healthcare roles, MedFlow was designed
                from day one by healthcare professionals and technology experts together.
              </p>
              <ul className="mt-8 space-y-4">
                {[
                  { icon: Shield, text: "HIPAA-compliant with end-to-end encryption and audit logs" },
                  { icon: Zap, text: "Set up in under 48 hours — no expensive consultants needed" },
                  { icon: TrendingUp, text: "Reduces administrative overhead by up to 60%" },
                  { icon: Award, text: "Dedicated support with < 2 hour response time" },
                  { icon: Users, text: "Role-based access: Admin, Doctor, Nurse, Receptionist, Patient" },
                  { icon: Clock, text: "24/7 system availability with 99.9% uptime SLA" },
                ].map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-start gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 mt-0.5">
                      <Icon className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span className="text-sm leading-relaxed text-muted-foreground">{text}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-10 flex gap-3">
                <Link href="/pricing">
                  <Button rightIcon={<ArrowRight />}>Get Started</Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline">Talk to Sales</Button>
                </Link>
              </div>
            </div>

            {/* Metrics panel */}
            <div className="relative">
              <div className="rounded-2xl border bg-card p-6 shadow-card-lg">
                <h3 className="mb-5 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Clinic Performance After MedFlow
                </h3>
                <div className="space-y-4">
                  {[
                    { label: "Patient Satisfaction", before: 71, after: 97, color: "bg-green-500" },
                    { label: "Appointment No-Shows", before: 28, after: 8, color: "bg-red-500", inverted: true },
                    { label: "Revenue Growth", before: 100, after: 165, color: "bg-blue-500" },
                    { label: "Admin Time Saved", before: 0, after: 60, color: "bg-purple-500" },
                    { label: "Billing Accuracy", before: 82, after: 99, color: "bg-teal-500" },
                  ].map((metric) => (
                    <div key={metric.label}>
                      <div className="mb-1.5 flex items-center justify-between">
                        <span className="text-sm font-medium">{metric.label}</span>
                        <span className={`text-sm font-bold ${metric.inverted ? "text-red-600" : "text-green-600"}`}>
                          {metric.inverted ? `↓ ${metric.before - metric.after}%` : `↑ ${metric.after - metric.before}%`}
                        </span>
                      </div>
                      <div className="flex h-2 w-full overflow-hidden rounded-full bg-secondary">
                        <div
                          className={`h-full rounded-full transition-all ${metric.color}`}
                          style={{ width: `${Math.min(metric.after, 100)}%` }}
                        />
                      </div>
                      <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                        <span>Before: {metric.before}{metric.label.includes("Growth") ? "%" : "%"}</span>
                        <span className="font-medium text-foreground">After: {metric.after}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────────────────────── */}
      <section className="py-24">
        <div className="page-container">
          <div className="mx-auto max-w-2xl text-center mb-14">
            <span className="section-eyebrow">Testimonials</span>
            <h2 className="mt-4 text-4xl font-bold tracking-tight">
              Loved by healthcare professionals
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.name} className="rounded-2xl border bg-card p-6 shadow-card hover:shadow-card-md transition-shadow">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">"{t.quote}"</p>
                <div className="mt-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-sm font-bold text-white">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.title}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/testimonials">
              <Button variant="outline" rightIcon={<ArrowRight />}>
                Read More Reviews
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="py-24">
        <div className="page-container">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 via-brand-600 to-accent px-8 py-20 text-center text-white shadow-card-xl">
            <div className="absolute inset-0 bg-grid opacity-10" />
            <div className="absolute -left-20 -top-20 h-60 w-60 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -right-20 -bottom-20 h-60 w-60 rounded-full bg-white/10 blur-3xl" />
            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest">
                <Stethoscope className="h-3.5 w-3.5" />
                Start Today — No Credit Card Required
              </span>
              <h2 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
                Ready to transform your clinic?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-white/80">
                Join 500+ clinics already using MedFlow. Set up in 48 hours, 
                see results in your first week.
              </p>
              <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <Link href="/register">
                  <Button size="xl" className="bg-white text-brand-700 hover:bg-white/90">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="xl" variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20">
                    Schedule a Demo
                  </Button>
                </Link>
              </div>
              <p className="mt-6 text-sm text-white/60">
                14-day free trial · No setup fees · Cancel anytime
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
