import { Briefcase, MapPin, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Careers — MedFlow" };
const jobs = [
  { title:"Senior Frontend Engineer", dept:"Engineering", location:"Cairo, Egypt (Hybrid)", type:"Full-time" },
  { title:"Product Designer", dept:"Design", location:"Remote", type:"Full-time" },
  { title:"Customer Success Manager", dept:"Support", location:"Cairo, Egypt", type:"Full-time" },
  { title:"Backend Engineer (Node.js)", dept:"Engineering", location:"Remote", type:"Full-time" },
  { title:"Sales Development Representative", dept:"Sales", location:"Cairo, Egypt", type:"Full-time" },
  { title:"Healthcare Implementation Specialist", dept:"Operations", location:"Hybrid", type:"Full-time" },
];
export default function CareersPage() {
  return (
    <div className="pt-24 pb-20">
      <div className="page-container">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <span className="section-eyebrow">Join Our Team</span>
          <h1 className="mt-4 text-5xl font-bold tracking-tight">Help us transform healthcare</h1>
          <p className="mt-4 text-lg text-muted-foreground">We're a remote-friendly team building tools that matter. Join us in our mission to modernize clinic management.</p>
        </div>
        <div className="space-y-3">
          {jobs.map(j=>(
            <div key={j.title} className="flex flex-col gap-3 rounded-2xl border bg-card p-6 sm:flex-row sm:items-center sm:justify-between hover:border-primary/30 transition-colors">
              <div>
                <h3 className="font-bold">{j.title}</h3>
                <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Briefcase className="h-3.5 w-3.5" />{j.dept}</span>
                  <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{j.location}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{j.type}</span>
                </div>
              </div>
              <Button variant="outline" rightIcon={<ArrowRight className="h-4 w-4" />}>Apply Now</Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
