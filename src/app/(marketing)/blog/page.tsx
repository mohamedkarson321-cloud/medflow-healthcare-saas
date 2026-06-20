import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Blog — MedFlow" };
const posts = [
  { title:"5 Ways to Reduce Patient No-Shows", excerpt:"Practical strategies clinics use to cut no-show rates by up to 40%.", date:"Jun 12, 2026", category:"Clinic Management", readTime:"5 min" },
  { title:"The Complete Guide to EMR Migration", excerpt:"Everything you need to know about moving from paper or legacy systems.", date:"Jun 5, 2026", category:"Technology", readTime:"8 min" },
  { title:"HIPAA Compliance Checklist for 2026", excerpt:"Stay compliant with this comprehensive security checklist for clinics.", date:"May 28, 2026", category:"Security", readTime:"6 min" },
  { title:"How Telemedicine is Changing Patient Care", excerpt:"The latest trends in remote consultations and virtual care.", date:"May 20, 2026", category:"Trends", readTime:"4 min" },
  { title:"Optimizing Your Clinic's Billing Workflow", excerpt:"Tips for faster, more accurate medical billing and invoicing.", date:"May 14, 2026", category:"Finance", readTime:"7 min" },
  { title:"Building Patient Trust Through Technology", excerpt:"How digital tools improve the patient experience.", date:"May 8, 2026", category:"Patient Care", readTime:"5 min" },
];
export default function BlogPage() {
  return (
    <div className="pt-24 pb-20">
      <div className="page-container">
        <div className="mx-auto max-w-2xl text-center mb-14">
          <span className="section-eyebrow">Insights</span>
          <h1 className="mt-4 text-5xl font-bold tracking-tight">MedFlow Blog</h1>
          <p className="mt-4 text-lg text-muted-foreground">Tips, trends, and best practices for modern clinic management.</p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map(p=>(
            <Link key={p.title} href="/blog" className="group rounded-2xl border bg-card overflow-hidden transition-all hover:shadow-card-md hover:-translate-y-0.5">
              <div className="h-40 bg-gradient-to-br from-brand-100 to-teal-100 dark:from-brand-950 dark:to-teal-950 flex items-center justify-center"><span className="text-4xl">📰</span></div>
              <div className="p-5">
                <span className="text-xs font-medium text-primary">{p.category}</span>
                <h3 className="mt-2 font-bold group-hover:text-primary transition-colors">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{p.excerpt}</p>
                <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground"><span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{p.date}</span><span>{p.readTime} read</span></div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
