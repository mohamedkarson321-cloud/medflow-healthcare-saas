import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Calendar, Users, CheckSquare, ListOrdered, CreditCard, ArrowRight, Clock, UserPlus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatCard, StatusBadge, PageHeader } from "@/components/shared";
import { formatTime } from "@/lib/utils";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Reception Dashboard — MedFlow" };
export default async function ReceptionDashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const clinic = await prisma.clinic.findFirst();
  const today = new Date(); today.setHours(0,0,0,0);
  const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate()+1);
  const [todayAppts, checkedIn, waiting, pendingInvoices] = await Promise.all([
    prisma.appointment.findMany({
      where: { ...(clinic ? {clinicId:clinic.id} : {}), scheduledDate: { gte:today, lt:tomorrow } },
      include: { patient:true, doctor:true },
      orderBy: { scheduledTime:"asc" },
    }),
    prisma.appointment.count({ where: { ...(clinic?{clinicId:clinic.id}:{}), status:"CHECKED_IN", scheduledDate:{gte:today,lt:tomorrow} } }),
    prisma.appointment.count({ where: { ...(clinic?{clinicId:clinic.id}:{}), status:"WAITING", scheduledDate:{gte:today,lt:tomorrow} } }),
    prisma.invoice.count({ where: { ...(clinic?{clinicId:clinic.id}:{}), status:{in:["SENT","PARTIAL","OVERDUE"]} } }),
  ]);
  const stats = [
    { title:"Today's Appointments", value:todayAppts.length, icon:<Calendar className="h-6 w-6 text-blue-600" />, iconBg:"bg-blue-100 dark:bg-blue-950/50" },
    { title:"Checked In", value:checkedIn, icon:<CheckSquare className="h-6 w-6 text-green-600" />, iconBg:"bg-green-100 dark:bg-green-950/50" },
    { title:"In Waiting", value:waiting, icon:<ListOrdered className="h-6 w-6 text-orange-600" />, iconBg:"bg-orange-100 dark:bg-orange-950/50" },
    { title:"Pending Payments", value:pendingInvoices, icon:<CreditCard className="h-6 w-6 text-red-600" />, iconBg:"bg-red-100 dark:bg-red-950/50" },
  ];
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Reception Dashboard" description="Today's overview and quick actions."
        actions={<div className="flex gap-2"><Link href="/reception/patients"><Button leftIcon={<UserPlus className="h-4 w-4" />} variant="outline">New Patient</Button></Link><Link href="/reception/appointments"><Button leftIcon={<Calendar className="h-4 w-4" />}>New Appointment</Button></Link></div>}
      />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map(s => <StatCard key={s.title} title={s.title} value={s.value} icon={s.icon} iconBg={s.iconBg} />)}
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle>Today's Appointments</CardTitle>
              <Link href="/reception/appointments"><Button variant="ghost" size="sm" rightIcon={<ArrowRight className="h-3.5 w-3.5" />}>View All</Button></Link>
            </CardHeader>
            <CardContent className="p-0">
              {todayAppts.length === 0 ? (
                <div className="py-12 text-center text-sm text-muted-foreground">No appointments scheduled today.</div>
              ) : (
                <div className="divide-y">
                  {todayAppts.map(a => (
                    <div key={a.id} className="flex items-center gap-4 px-5 py-3 hover:bg-muted/20 transition-colors">
                      <div className="w-14 shrink-0 text-center"><div className="text-sm font-bold">{formatTime(a.scheduledTime)}</div></div>
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-brand-600 text-xs font-bold text-white">{a.patient.firstName[0]}{a.patient.lastName[0]}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2"><span className="text-sm font-semibold">{a.patient.firstName} {a.patient.lastName}</span><StatusBadge status={a.status} size="sm" /></div>
                        <div className="text-xs text-muted-foreground">Dr. {a.doctor.firstName} {a.doctor.lastName} · {a.type.replace(/_/g," ")}</div>
                      </div>
                      <div className="flex gap-1.5 shrink-0">
                        {a.status === "SCHEDULED" && <Button size="sm" variant="outline">Check In</Button>}
                        {a.status === "CHECKED_IN" && <Button size="sm" variant="soft-success">✓ In</Button>}
                        {a.status === "WAITING" && <Button size="sm" variant="soft-warning">Waiting</Button>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Quick Actions</CardTitle></CardHeader>
            <CardContent className="pt-0 space-y-2">
              {[
                { label:"Register New Patient", href:"/reception/patients", icon:UserPlus, color:"text-blue-600 bg-blue-50 dark:bg-blue-950/40" },
                { label:"Book Appointment", href:"/reception/appointments", icon:Calendar, color:"text-green-600 bg-green-50 dark:bg-green-950/40" },
                { label:"Check-In Patient", href:"/reception/check-in", icon:CheckSquare, color:"text-purple-600 bg-purple-50 dark:bg-purple-950/40" },
                { label:"Create Invoice", href:"/reception/invoices", icon:CreditCard, color:"text-orange-600 bg-orange-50 dark:bg-orange-950/40" },
                { label:"Manage Queue", href:"/reception/queue", icon:ListOrdered, color:"text-teal-600 bg-teal-50 dark:bg-teal-950/40" },
              ].map(a => (
                <Link key={a.label} href={a.href}>
                  <div className="flex items-center gap-3 rounded-xl border p-3 hover:border-primary/30 hover:bg-muted/20 transition-all cursor-pointer">
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${a.color}`}><a.icon className="h-4 w-4" /></div>
                    <span className="text-sm font-medium">{a.label}</span>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
