import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { FileBarChart, Download, Calendar, CreditCard, Users, Stethoscope } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader, ProgressBar } from "@/components/shared";
import { formatCurrency } from "@/lib/utils";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Reports — MedFlow" };
const reportTypes = [
  { title:"Financial Report", desc:"Revenue, payments, invoices summary", icon:CreditCard, color:"bg-green-50 text-green-600 dark:bg-green-950/40" },
  { title:"Appointment Report", desc:"Schedules, completion rates, no-shows", icon:Calendar, color:"bg-blue-50 text-blue-600 dark:bg-blue-950/40" },
  { title:"Patient Report", desc:"New patients, demographics, retention", icon:Users, color:"bg-purple-50 text-purple-600 dark:bg-purple-950/40" },
  { title:"Doctor Performance", desc:"Appointments per doctor, ratings", icon:Stethoscope, color:"bg-orange-50 text-orange-600 dark:bg-orange-950/40" },
];
export default async function AdminReportsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const clinic = await prisma.clinic.findFirst();
  const now = new Date(); const mStart = new Date(now.getFullYear(),now.getMonth(),1);
  const [monthRevenue, monthAppts, monthPatients] = await Promise.all([
    prisma.payment.aggregate({ where:{paidAt:{gte:mStart}}, _sum:{amount:true} }),
    prisma.appointment.count({ where:{...(clinic?{clinicId:clinic.id}:{}),scheduledDate:{gte:mStart}} }),
    prisma.patient.count({ where:{...(clinic?{clinicId:clinic.id}:{}),createdAt:{gte:mStart}} }),
  ]);
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Reports" description="Generate and download clinic reports." />
      <div className="grid grid-cols-3 gap-4">
        {[
          { label:"Monthly Revenue", value:formatCurrency(monthRevenue._sum.amount??0,"EGP"), icon:"💰" },
          { label:"Monthly Appointments", value:monthAppts, icon:"📅" },
          { label:"New Patients", value:monthPatients, icon:"👥" },
        ].map(s=>(
          <div key={s.label} className="rounded-xl border bg-card p-5 text-center shadow-card"><div className="text-2xl mb-1">{s.icon}</div><div className="text-xl font-bold">{s.value}</div><div className="text-xs text-muted-foreground">{s.label} (this month)</div></div>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {reportTypes.map(r=>(
          <Card key={r.title} className="hover:border-primary/30 transition-colors group">
            <CardContent className="flex items-start gap-4 p-5">
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${r.color}`}><r.icon className="h-6 w-6" /></div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm">{r.title}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{r.desc}</div>
              </div>
              <Button variant="outline" size="sm" leftIcon={<Download className="h-3.5 w-3.5" />}>Export</Button>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader><CardTitle>Custom Date Range Report</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex flex-col gap-1.5"><label className="text-xs font-medium text-muted-foreground">From Date</label><input type="date" className="h-9 rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" /></div>
            <div className="flex flex-col gap-1.5"><label className="text-xs font-medium text-muted-foreground">To Date</label><input type="date" className="h-9 rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" /></div>
            <div className="flex flex-col gap-1.5"><label className="text-xs font-medium text-muted-foreground">Report Type</label><select className="h-9 rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><option>All Reports</option><option>Financial</option><option>Appointments</option><option>Patients</option></select></div>
            <Button leftIcon={<Download className="h-4 w-4" />}>Generate Report</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
