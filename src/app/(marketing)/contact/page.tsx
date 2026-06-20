"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Textarea, FormField } from "@/components/ui/input";

const contactMethods = [
  { icon: Phone, title: "Call Us", detail: "+20 12 345 6789", sub: "Mon-Fri, 8am-8pm", href: "tel:+201234567890", color: "bg-blue-50 text-blue-600 dark:bg-blue-950" },
  { icon: Mail, title: "Email", detail: "hello@medflow.health", sub: "We reply within 2 hours", href: "mailto:hello@medflow.health", color: "bg-green-50 text-green-600 dark:bg-green-950" },
  { icon: MessageSquare, title: "Live Chat", detail: "Chat with support", sub: "Available 24/7", href: "#", color: "bg-purple-50 text-purple-600 dark:bg-purple-950" },
  { icon: MapPin, title: "Visit Us", detail: "123 Healthcare Blvd", sub: "Cairo, Egypt 12345", href: "#", color: "bg-orange-50 text-orange-600 dark:bg-orange-950" },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
  }

  return (
    <div className="pt-24 pb-20">
      <div className="page-container">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center mb-14">
          <span className="section-eyebrow">Contact Us</span>
          <h1 className="mt-4 text-5xl font-bold tracking-tight">Get in touch</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Have a question about MedFlow? We'd love to hear from you. 
            Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        {/* Contact methods */}
        <div className="mb-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {contactMethods.map((m) => (
            <a
              key={m.title}
              href={m.href}
              className="group flex flex-col items-center gap-3 rounded-2xl border bg-card p-6 text-center shadow-card transition-all hover:shadow-card-md hover:-translate-y-0.5"
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${m.color}`}>
                <m.icon className="h-6 w-6" />
              </div>
              <div>
                <div className="font-semibold text-sm">{m.title}</div>
                <div className="mt-1 text-sm text-foreground">{m.detail}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{m.sub}</div>
              </div>
            </a>
          ))}
        </div>

        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2">
          {/* Form */}
          <div className="rounded-2xl border bg-card p-8 shadow-card">
            {submitted ? (
              <div className="flex flex-col items-center gap-4 py-12 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold">Message sent!</h3>
                <p className="text-muted-foreground">
                  Thank you for reaching out. Our team will get back to you within 2 hours.
                </p>
                <Button onClick={() => setSubmitted(false)} variant="outline" className="mt-2">
                  Send another message
                </Button>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-bold mb-6">Send us a message</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Full Name" required htmlFor="name">
                      <Input id="name" placeholder="Dr. Ahmed Hassan" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                    </FormField>
                    <FormField label="Email" required htmlFor="email">
                      <Input id="email" type="email" placeholder="ahmed@clinic.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                    </FormField>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Phone" htmlFor="phone">
                      <Input id="phone" type="tel" placeholder="+20 12 345 6789" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                    </FormField>
                    <FormField label="Subject" required htmlFor="subject">
                      <select
                        id="subject"
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        required
                        className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <option value="">Select topic</option>
                        <option>Pricing & Plans</option>
                        <option>Technical Support</option>
                        <option>Feature Request</option>
                        <option>Partnership</option>
                        <option>Demo Request</option>
                        <option>Other</option>
                      </select>
                    </FormField>
                  </div>
                  <FormField label="Message" required htmlFor="message">
                    <Textarea
                      id="message"
                      rows={5}
                      placeholder="Tell us about your clinic and how we can help..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      required
                    />
                  </FormField>
                  <Button type="submit" loading={loading} className="w-full" size="lg" rightIcon={<Send className="h-4 w-4" />}>
                    Send Message
                  </Button>
                </form>
              </>
            )}
          </div>

          {/* Map + Info */}
          <div className="space-y-6">
            {/* Map placeholder */}
            <div className="h-[300px] overflow-hidden rounded-2xl border bg-muted flex items-center justify-center">
              <div className="text-center">
                <MapPin className="mx-auto h-12 w-12 text-muted-foreground/40 mb-3" />
                <p className="text-sm text-muted-foreground">123 Healthcare Blvd, Cairo, Egypt</p>
                <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-sm text-primary hover:underline">
                  Open in Google Maps →
                </a>
              </div>
            </div>

            {/* Working hours */}
            <div className="rounded-2xl border bg-card p-6 shadow-card">
              <div className="flex items-center gap-2.5 mb-4">
                <Clock className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Working Hours</h3>
              </div>
              <div className="space-y-2.5">
                {[
                  { days: "Monday – Thursday", hours: "8:00 AM – 9:00 PM" },
                  { days: "Friday", hours: "8:00 AM – 2:00 PM" },
                  { days: "Saturday", hours: "9:00 AM – 7:00 PM" },
                  { days: "Sunday", hours: "Closed" },
                ].map(({ days, hours }) => (
                  <div key={days} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{days}</span>
                    <span className={`font-medium ${hours === "Closed" ? "text-red-500" : "text-foreground"}`}>{hours}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-xl bg-green-50 dark:bg-green-950/50 p-3">
                <p className="text-xs font-medium text-green-700 dark:text-green-400">
                  🟢 Emergency line available 24/7: +20 11 999 8877
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
