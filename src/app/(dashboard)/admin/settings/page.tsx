import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Settings, Building2, Clock, Bell, CreditCard, Shield, Palette } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, FormField } from "@/components/ui/input";
import { PageHeader } from "@/components/shared";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Settings — MedFlow" };
export default async function AdminSettingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const clinic = await prisma.clinic.findFirst({ include: { settings: true } });
  const sections = [
    { id:"clinic", title:"Clinic Information", icon:Building2, description:"Basic details about your clinic" },
    { id:"hours", title:"Working Hours", icon:Clock, description:"Set your clinic's operating schedule" },
    { id:"notifications", title:"Notifications", icon:Bell, description:"Configure email and SMS alerts" },
    { id:"billing", title:"Billing Settings", icon:CreditCard, description:"Tax rates, payment methods, deposit rules" },
    { id:"security", title:"Security & Access", icon:Shield, description:"Manage roles and permissions" },
    { id:"branding", title:"Branding", icon:Palette, description:"Logo, colors and clinic theme" },
  ];
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Settings" description="Configure your clinic's preferences and settings." />
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="space-y-2">
          {sections.map(s=>(
            <a key={s.id} href={`#${s.id}`} className="flex items-center gap-3 rounded-xl border bg-card p-3.5 hover:border-primary/30 hover:bg-muted/20 transition-all group">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"><s.icon className="h-4.5 w-4.5" style={{height:"18px",width:"18px"}} /></div>
              <div><div className="text-sm font-semibold group-hover:text-primary transition-colors">{s.title}</div><div className="text-xs text-muted-foreground">{s.description}</div></div>
            </a>
          ))}
        </div>
        <div className="lg:col-span-2 space-y-5">
          <Card id="clinic">
            <CardHeader><CardTitle className="flex items-center gap-2"><Building2 className="h-4 w-4 text-primary" />Clinic Information</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Clinic Name" htmlFor="cname"><Input id="cname" defaultValue={clinic?.name ?? ""} placeholder="My Clinic" /></FormField>
                <FormField label="Email" htmlFor="cemail"><Input id="cemail" type="email" defaultValue={clinic?.email ?? ""} placeholder="clinic@email.com" /></FormField>
                <FormField label="Phone" htmlFor="cphone"><Input id="cphone" defaultValue={clinic?.phone ?? ""} placeholder="+20 12 345 6789" /></FormField>
                <FormField label="Website" htmlFor="cweb"><Input id="cweb" defaultValue={clinic?.website ?? ""} placeholder="https://myclinic.com" /></FormField>
                <FormField label="Address" htmlFor="caddr" className="col-span-2"><Input id="caddr" defaultValue={clinic?.address ?? ""} placeholder="123 Healthcare Blvd" /></FormField>
                <FormField label="City" htmlFor="ccity"><Input id="ccity" defaultValue={clinic?.city ?? ""} placeholder="Cairo" /></FormField>
                <FormField label="Country" htmlFor="ccountry"><Input id="ccountry" defaultValue={clinic?.country ?? "Egypt"} placeholder="Egypt" /></FormField>
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>
          <Card id="billing">
            <CardHeader><CardTitle className="flex items-center gap-2"><CreditCard className="h-4 w-4 text-primary" />Billing Settings</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Currency" htmlFor="curr"><select id="curr" defaultValue={clinic?.currency ?? "EGP"} className="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><option value="EGP">EGP — Egyptian Pound</option><option value="USD">USD — US Dollar</option><option value="EUR">EUR — Euro</option><option value="SAR">SAR — Saudi Riyal</option></select></FormField>
                <FormField label="Tax Rate (%)" htmlFor="taxrate"><Input id="taxrate" type="number" defaultValue={clinic?.settings?.taxRate ?? 0} placeholder="14" /></FormField>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30">
                <input type="checkbox" id="deposit" defaultChecked={clinic?.settings?.requireDeposit ?? false} className="h-4 w-4 accent-primary" />
                <label htmlFor="deposit" className="text-sm font-medium cursor-pointer">Require deposit for appointments</label>
              </div>
              <Button>Save Billing Settings</Button>
            </CardContent>
          </Card>
          <Card id="notifications">
            <CardHeader><CardTitle className="flex items-center gap-2"><Bell className="h-4 w-4 text-primary" />Notification Settings</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {[
                { label:"Send email appointment reminders", id:"emailRemind", checked:clinic?.settings?.sendEmailReminders??true },
                { label:"Send SMS appointment reminders", id:"smsRemind", checked:clinic?.settings?.sendSmsReminders??true },
                { label:"Auto-confirm appointments", id:"autoConfirm", checked:clinic?.settings?.autoConfirmAppointments??true },
                { label:"Allow appointment cancellation", id:"allowCancel", checked:clinic?.settings?.allowCancellation??true },
              ].map(item=>(
                <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30">
                  <input type="checkbox" id={item.id} defaultChecked={item.checked} className="h-4 w-4 accent-primary" />
                  <label htmlFor={item.id} className="text-sm font-medium cursor-pointer">{item.label}</label>
                </div>
              ))}
              <Button className="mt-2">Save Notification Settings</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
