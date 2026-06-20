import Link from "next/link";
import { Star, Clock, Award, ArrowRight, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Our Doctors — MedFlow" };

const doctors = [
  { id: "1", name: "Dr. Ahmed Hassan", title: "Chief of Cardiology", specialty: "Cardiology", experience: 18, rating: 4.9, reviews: 234, avatar: "AH", available: true, fee: 500, languages: ["Arabic", "English"], qualifications: ["MD", "FRCP", "PhD Cardiology"] },
  { id: "2", name: "Dr. Sarah El-Masry", title: "Senior Dermatologist", specialty: "Dermatology", experience: 12, rating: 4.8, reviews: 189, avatar: "SE", available: true, fee: 400, languages: ["Arabic", "English", "French"], qualifications: ["MD", "MRCP"] },
  { id: "3", name: "Dr. Mohamed Khalil", title: "Orthopedic Surgeon", specialty: "Orthopedics", experience: 22, rating: 4.9, reviews: 312, avatar: "MK", available: false, fee: 600, languages: ["Arabic", "English"], qualifications: ["MD", "FRCS", "Fellowship"] },
  { id: "4", name: "Dr. Nadia Youssef", title: "Pediatric Specialist", specialty: "Pediatrics", experience: 9, rating: 4.7, reviews: 156, avatar: "NY", available: true, fee: 350, languages: ["Arabic", "English"], qualifications: ["MD", "DCH"] },
  { id: "5", name: "Dr. Omar Farouk", title: "Neurologist", specialty: "Neurology", experience: 15, rating: 4.8, reviews: 201, avatar: "OF", available: true, fee: 550, languages: ["Arabic", "English", "German"], qualifications: ["MD", "PhD Neuroscience"] },
  { id: "6", name: "Dr. Aya Ibrahim", title: "Dental Surgeon", specialty: "Dentistry", experience: 8, rating: 4.9, reviews: 178, avatar: "AI", available: true, fee: 300, languages: ["Arabic", "English"], qualifications: ["BDS", "MSc Implantology"] },
  { id: "7", name: "Dr. Kareem Mansour", title: "Ophthalmologist", specialty: "Ophthalmology", experience: 14, rating: 4.7, reviews: 143, avatar: "KM", available: true, fee: 450, languages: ["Arabic", "English"], qualifications: ["MD", "FRCOphth"] },
  { id: "8", name: "Dr. Layla Mostafa", title: "Physiotherapist", specialty: "Physiotherapy", experience: 10, rating: 4.8, reviews: 167, avatar: "LM", available: false, fee: 280, languages: ["Arabic", "English"], qualifications: ["BPT", "MPT", "MCSP"] },
];

const specialties = ["All", "Cardiology", "Dermatology", "Orthopedics", "Pediatrics", "Neurology", "Dentistry", "Ophthalmology", "Physiotherapy"];

export default function DoctorsPage() {
  return (
    <div className="pt-24 pb-20">
      <div className="page-container">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center mb-12">
          <span className="section-eyebrow">Our Medical Team</span>
          <h1 className="mt-4 text-5xl font-bold tracking-tight">
            Meet our expert doctors
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Board-certified specialists with decades of combined experience, 
            dedicated to delivering exceptional patient care.
          </p>
        </div>

        {/* Search & filter */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search doctors by name or specialty..."
              className="flex h-10 w-full rounded-xl border border-input bg-background pl-9 pr-4 text-sm placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <Button variant="outline" leftIcon={<Filter />}>Filter</Button>
        </div>

        {/* Specialty pills */}
        <div className="mb-8 flex flex-wrap gap-2">
          {specialties.map((s) => (
            <button
              key={s}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all ${
                s === "All"
                  ? "border-primary bg-primary text-white"
                  : "border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Doctor grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {doctors.map((doc) => (
            <div key={doc.id} className="group relative flex flex-col overflow-hidden rounded-2xl border bg-card shadow-card transition-all hover:shadow-card-md hover:-translate-y-0.5">
              {/* Availability badge */}
              <div className="absolute right-4 top-4 z-10">
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                  doc.available
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-gray-50 text-gray-500 border border-gray-200"
                }`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${doc.available ? "bg-green-500" : "bg-gray-400"}`} />
                  {doc.available ? "Available" : "Busy"}
                </span>
              </div>

              {/* Avatar section */}
              <div className="flex flex-col items-center bg-gradient-to-br from-brand-50 to-brand-100 dark:from-brand-950 dark:to-brand-900 p-8 pb-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-2xl font-bold text-white shadow-lg">
                  {doc.avatar}
                </div>
                <h3 className="mt-4 text-center text-base font-bold">{doc.name}</h3>
                <p className="mt-1 text-center text-xs text-muted-foreground">{doc.title}</p>
                {/* Rating */}
                <div className="mt-2 flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-semibold">{doc.rating}</span>
                  <span className="text-xs text-muted-foreground">({doc.reviews})</span>
                </div>
              </div>

              {/* Details */}
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {doc.experience} yrs exp
                  </div>
                  <div className="flex items-center gap-1">
                    <Award className="h-3.5 w-3.5" />
                    {doc.qualifications[0]}
                  </div>
                </div>

                {/* Qualifications */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {doc.qualifications.map((q) => (
                    <span key={q} className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">{q}</span>
                  ))}
                </div>

                {/* Languages */}
                <div className="mb-4 text-xs text-muted-foreground">
                  🌐 {doc.languages.join(", ")}
                </div>

                {/* Fee */}
                <div className="mb-4 flex items-center justify-between border-t pt-4">
                  <span className="text-xs text-muted-foreground">Consultation fee</span>
                  <span className="font-bold text-foreground">EGP {doc.fee}</span>
                </div>

                <Link href={`/book-appointment?doctor=${doc.id}`} className="mt-auto">
                  <Button className="w-full" size="sm" disabled={!doc.available}>
                    {doc.available ? "Book Appointment" : "Not Available"}
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Load more */}
        <div className="mt-12 flex justify-center">
          <Button variant="outline" size="lg" rightIcon={<ArrowRight />}>
            Load More Doctors
          </Button>
        </div>
      </div>
    </div>
  );
}
