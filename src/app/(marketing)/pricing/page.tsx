import Link from "next/link";
import { Check, X, ArrowRight, Zap, Shield, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PRICING_PLANS } from "@/constants";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Pricing — MedFlow" };

const comparisonRows = [
  { feature: "Doctors", starter: "Up to 3", professional: "Up to 15", enterprise: "Unlimited" },
  { feature: "Patients", starter: "Up to 500", professional: "Unlimited", enterprise: "Unlimited" },
  { feature: "Storage", starter: "5 GB", professional: "50 GB", enterprise: "Unlimited" },
  { feature: "Appointment Scheduling", starter: true, professional: true, enterprise: true },
  { feature: "Patient Portal", starter: true, professional: true, enterprise: true },
  { feature: "Basic EMR", starter: true, professional: true, enterprise: true },
  { feature: "Digital Prescriptions", starter: true, professional: true, enterprise: true },
  { feature: "Invoice Generation", starter: true, professional: true, enterprise: true },
  { feature: "Email Notifications", starter: true, professional: true, enterprise: true },
  { feature: "SMS Notifications", starter: false, professional: true, enterprise: true },
  { feature: "Lab Management", starter: false, professional: true, enterprise: true },
  { feature: "Inventory Control", starter: false, professional: true, enterprise: true },
  { feature: "Advanced Analytics", starter: false, professional: true, enterprise: true },
  { feature: "Multi-Department", starter: false, professional: true, enterprise: true },
  { feature: "Custom Branding", starter: false, professional: true, enterprise: true },
  { feature: "Insurance Management", starter: false, professional: false, enterprise: true },
  { feature: "Multi-Branch Support", starter: false, professional: false, enterprise: true },
  { feature: "API Access", starter: false, professional: false, enterprise: true },
  { feature: "Custom Integrations", starter: false, professional: false, enterprise: true },
  { feature: "Dedicated Account Manager", starter: false, professional: false, enterprise: true },
  { feature: "SLA Guarantee", starter: false, professional: false, enterprise: true },
  { feature: "Support", starter: "Email", professional: "Priority Email + Chat", enterprise: "24/7 Phone + Email" },
];

const faqs = [
  { q: "Is there a free trial?", a: "Yes! All plans come with a 14-day free trial. No credit card required. You can explore all features before committing." },
  { q: "Can I change plans later?", a: "Absolutely. You can upgrade or downgrade your plan at any time. Changes take effect immediately and billing is prorated." },
  { q: "How long does setup take?", a: "Most clinics are fully set up within 48 hours. Our onboarding team will guide you through every step." },
  { q: "Is patient data secure?", a: "Yes. We use bank-level encryption (AES-256), full audit logs, and are HIPAA-compliant. Your data is always yours." },
  { q: "Do you offer annual discounts?", a: "Yes! Annual billing saves you 20% compared to monthly billing. Contact sales for multi-year deals." },
  { q: "Can I migrate from another system?", a: "Yes. Our team provides free data migration assistance for all plans. We support most major clinic software formats." },
];

function PlanBadge({ plan }: { plan: string }) {
  const colors: Record<string, string> = {
    blue: "bg-blue-100 text-blue-800",
    brand: "bg-primary/10 text-primary",
    purple: "bg-purple-100 text-purple-800",
  };
  return null;
}

export default function PricingPage() {
  return (
    <div className="pt-24 pb-20">
      {/* Header */}
      <div className="page-container">
        <div className="mx-auto max-w-3xl text-center">
          <span className="section-eyebrow">
            <Zap className="h-3.5 w-3.5" />
            Simple, Transparent Pricing
          </span>
          <h1 className="mt-4 text-5xl font-bold tracking-tight">
            Invest in your clinic's growth
          </h1>
          <p className="mt-5 text-xl text-muted-foreground">
            All plans include a 14-day free trial. No contracts, no hidden fees.
            Cancel anytime.
          </p>
        </div>

        {/* Plans */}
        <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {PRICING_PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative flex flex-col rounded-2xl border bg-card p-8 shadow-card transition-all hover:shadow-card-md ${
                plan.popular
                  ? "border-primary ring-2 ring-primary ring-offset-2 scale-[1.02]"
                  : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-primary px-4 py-1 text-xs font-semibold text-white shadow-sm">
                    Most Popular
                  </span>
                </div>
              )}

              <div>
                <h3 className="text-lg font-bold">{plan.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
                <div className="mt-5 flex items-end gap-1">
                  <span className="text-4xl font-bold tracking-tight">{plan.currency} {plan.price.toLocaleString()}</span>
                  <span className="mb-1 text-sm text-muted-foreground">/{plan.period}</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">Billed monthly · Save 20% annually</p>
              </div>

              <ul className="my-8 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link href={`/register?plan=${plan.id}`}>
                <Button
                  className="w-full"
                  variant={plan.popular ? "default" : "outline"}
                  size="lg"
                  rightIcon={<ArrowRight />}
                >
                  Start Free Trial
                </Button>
              </Link>
              <p className="mt-3 text-center text-xs text-muted-foreground">
                14-day trial · No credit card
              </p>
            </div>
          ))}
        </div>

        {/* Enterprise CTA */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-2xl border bg-muted/30 px-8 py-6 sm:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="font-semibold">Need a custom plan?</div>
              <div className="text-sm text-muted-foreground">We offer custom pricing for large hospital networks and multi-branch clinics.</div>
            </div>
          </div>
          <Link href="/contact">
            <Button variant="outline" rightIcon={<Phone className="h-4 w-4" />}>
              Talk to Sales
            </Button>
          </Link>
        </div>

        {/* Comparison Table */}
        <div className="mt-24">
          <h2 className="mb-8 text-center text-3xl font-bold tracking-tight">
            Detailed feature comparison
          </h2>
          <div className="overflow-hidden rounded-2xl border">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/40">
                    <th className="w-1/2 px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Feature
                    </th>
                    {PRICING_PLANS.map((p) => (
                      <th key={p.id} className="px-6 py-4 text-center">
                        <span className="text-sm font-bold">{p.name}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row, i) => (
                    <tr key={row.feature} className={`border-b last:border-0 ${i % 2 === 0 ? "" : "bg-muted/20"}`}>
                      <td className="px-6 py-3.5 font-medium text-foreground">{row.feature}</td>
                      {(["starter", "professional", "enterprise"] as const).map((plan) => (
                        <td key={plan} className="px-6 py-3.5 text-center">
                          {typeof row[plan] === "boolean" ? (
                            row[plan] ? (
                              <Check className="mx-auto h-4 w-4 text-green-600" />
                            ) : (
                              <X className="mx-auto h-4 w-4 text-muted-foreground/40" />
                            )
                          ) : (
                            <span className="text-muted-foreground">{row[plan] as string}</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="mt-24">
          <h2 className="mb-10 text-center text-3xl font-bold tracking-tight">
            Frequently asked questions
          </h2>
          <div className="mx-auto max-w-3xl grid grid-cols-1 gap-4 sm:grid-cols-2">
            {faqs.map((faq) => (
              <div key={faq.q} className="rounded-xl border bg-card p-5">
                <h3 className="font-semibold text-sm">{faq.q}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
