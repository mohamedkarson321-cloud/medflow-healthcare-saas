import Link from "next/link";
import { Stethoscope } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Left panel — branding */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-brand-900 via-brand-800 to-accent/80 p-12 lg:flex lg:w-[480px]">
        <div className="absolute inset-0 bg-grid opacity-10" />
        <div className="absolute -bottom-32 -left-32 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -top-32 -right-32 h-64 w-64 rounded-full bg-white/5 blur-3xl" />

        {/* Logo */}
        <Link href="/" className="relative flex items-center gap-2.5 w-fit">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 text-white backdrop-blur-sm">
            <Stethoscope className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">MedFlow</span>
        </Link>

        {/* Tagline */}
        <div className="relative space-y-6">
          <h2 className="text-3xl font-bold leading-tight text-white">
            Healthcare management that actually works
          </h2>
          <p className="text-base text-white/70 leading-relaxed">
            Join 500+ clinics using MedFlow to manage appointments, records, 
            billing, and more — all in one beautiful platform.
          </p>

          {/* Testimonial */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
            <div className="flex gap-0.5 mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className="text-yellow-400">★</span>
              ))}
            </div>
            <p className="text-sm text-white/80 italic leading-relaxed">
              "MedFlow cut our admin time by 60% in the first month. 
              Best investment we've made for the clinic."
            </p>
            <div className="mt-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-xs font-bold text-white">
                AH
              </div>
              <div>
                <div className="text-xs font-semibold text-white">Dr. Ahmed Hassan</div>
                <div className="text-xs text-white/60">Cairo Medical Center</div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { value: "500+", label: "Clinics" },
              { value: "2M+", label: "Patients" },
              { value: "99.9%", label: "Uptime" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-bold text-white">{s.value}</div>
                <div className="text-xs text-white/60">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex flex-1 flex-col">
        {/* Mobile header */}
        <div className="flex items-center justify-between p-4 lg:hidden border-b">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-white">
              <Stethoscope className="h-3.5 w-3.5" />
            </div>
            <span className="font-bold text-sm">MedFlow</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center p-6 sm:p-12">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  );
}
