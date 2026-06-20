import Link from "next/link";
import { Stethoscope, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";

const footerLinks = {
  platform: {
    title: "Platform",
    links: [
      { label: "Features", href: "/services" },
      { label: "Pricing", href: "/pricing" },
      { label: "Security", href: "/about#security" },
      { label: "Integrations", href: "/about#integrations" },
      { label: "Changelog", href: "/blog" },
    ],
  },
  clinic: {
    title: "For Clinics",
    links: [
      { label: "Appointment Booking", href: "/services" },
      { label: "EMR System", href: "/services" },
      { label: "Billing & Invoicing", href: "/services" },
      { label: "Patient Portal", href: "/services" },
      { label: "Analytics", href: "/services" },
    ],
  },
  company: {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Our Doctors", href: "/doctors" },
      { label: "Departments", href: "/departments" },
      { label: "Careers", href: "/careers" },
      { label: "Blog", href: "/blog" },
    ],
  },
  support: {
    title: "Support",
    links: [
      { label: "Help Center", href: "/faq" },
      { label: "Contact Us", href: "/contact" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" },
    ],
  },
};

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Youtube, href: "#", label: "YouTube" },
];

export function MarketingFooter() {
  return (
    <footer className="border-t bg-card">
      {/* Main footer */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-6">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 group w-fit">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white">
                <Stethoscope className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-tight">
                Med<span className="text-primary">Flow</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              World-class healthcare management platform trusted by 500+ clinics 
              and medical centers across the region.
            </p>
            {/* Contact info */}
            <div className="mt-6 space-y-2.5">
              <a href="tel:+201234567890" className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Phone className="h-4 w-4 shrink-0 text-primary" />
                +20 12 345 6789
              </a>
              <a href="mailto:hello@medflow.health" className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Mail className="h-4 w-4 shrink-0 text-primary" />
                hello@medflow.health
              </a>
              <div className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                123 Healthcare Blvd, Cairo, Egypt 12345
              </div>
            </div>
            {/* Social */}
            <div className="mt-6 flex items-center gap-2">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border bg-background text-muted-foreground transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([key, section]) => (
            <div key={key}>
              <h3 className="mb-4 text-sm font-semibold text-foreground">{section.title}</h3>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 sm:flex-row sm:px-6 lg:px-8">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} MedFlow Healthcare. All rights reserved.
          </p>
          <div className="flex items-center gap-1">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-medium text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-400">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
