import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Calendar, Users, CheckCircle2, Clock, Star, ArrowRight, Stethoscope, FileText, Pill } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatCard, StatusBadge, PageHeader } from "@/components/shared";
import { formatDate, formatTime } from "@/lib/utils";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Doctor Dashboard — MedFlow" };
export default async function DoctorDashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const doctor = await prisma.doctor.findUnique({ where: { userId: session.user.id } });
  if (!doctor) redirect("/login");
  const today = new Date();
  today.setHours(0,0,0,0);
  const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate()+1);
  const [todayAppts, pendingAppts, totalPatients, recentPatients] = await Promise.all([
    prisma.appointment.findMany({ where: { doctorId: doctor.id, scheduledDate: { gte: today, lt: tomorrow } }, include: { patient: true }, orderBy: { scheduledTime: "asc" } }),
    prisma.appointment.count({ where: { doctorId: doctor.id, status: { in: ["SCHEDULED","CONFIRMED","CHECKED_IN","WAITING"] }, scheduledDate: { gte: today } } }),
    prisma.appointment.groupBy({ by: ["patientId"], where: { doctorId: doctor.id } }).then(r => r.length),
    prisma.appointment.findMany({ where: { doctorId: doctor.id, status: "COMPLETED" }, include: { patient: true }, orderBy: { updatedAt: "desc" }, take: 5, distinct: ["patientId"] }),
  ]);
  const completed = todayAppts.filter(a => a.status === "COMPLETED").length;
  const stats = [
    { title: "Today's Appointments", value: todayAppts.length, icon: <Calendar className="h-6 w-6 text-blue-600" />, iconBg: "bg-blue-100 dark:bg-blue-950/50" },
    { title: "Completed Today", value: completed, icon: <CheckCircle2 className="h-6 w-6 text-green-600" />, iconBg: "bg-green-100 dark:bg-green-950/50" },
    { title: "Total Patients", value: totalPatients, icon: <Users className="h-6 w-6 text-purple-600" />, iconBg: "bg-purple-100 dark:bg-purple-950/50" },
    { title: "My Rating", value: doctor.rating > 0 ? doctor.rating.toFixed(1) : "N/A", icon: <Star className="h-6 w-6 text-yellow-600" />, iconBg: "bg-yellow-100 dark:bg-yellow-950/50" },
  ];
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title={`Good morning, Dr. ${doctor.firstName}! 👋`}
        description={`${doctor.specialization} · ${todayAppts.length} appointments today`}
        actions={<Link href="/doctor/appointments"><Button leftIcon={<Calendar className="h-4 w-4" />}>View Schedule</Button></Link>}
      />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map(s => <StatCard key={s.title} title={s.title} value={s.value} icon={s.icon} iconBg={s.iconBg} />)}
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle>Today's Schedule</CardTitle>
              <Link href="/doctor/schedule"><Button variant="ghost" size="sm" rightIcon={<ArrowRight className="h-3.5 w-3.5" />}>Full Schedule</Button></Link>
            </CardHeader>
            <CardContent className="p-0">
              {todayAppts.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-12 text-center"><Calendar className="h-10 w-10 text-muted-foreground/40" /><p className="text-sm font-medium">No appointments today</p></div>
              ) : (
                <div className="divide-y">
                  {todayAppts.map((appt, i) => (
                    <div key={appt.id} className="flex items-center gap-4 p-4 hover:bg-muted/20 transition-colors">
                      <div className="w-12 text-center shrink-0"><div className="text-sm font-bold">{formatTime(appt.scheduledTime)}</div><div className="text-xs text-muted-foreground">{appt.duration}m</div></div>
                      <div className="h-8 w-0.5 rounded-full bg-border shrink-0" />
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-xs font-bold text-white">
                        {appt.patient.firstName[0]}{appt.patient.lastName[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2"><span className="text-sm font-semibold">{appt.patient.firstName} {appt.patient.lastName}</span><StatusBadge status={appt.status} /></div>
                        <div className="text-xs text-muted-foreground">{appt.type.replace(/_/g," ")}{appt.chiefComplaint && ` · ${appt.chiefComplaint}`}</div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <Link href={`/doctor/appointments/${appt.id}`}><Button size="sm" variant={appt.status === "CHECKED_IN" ? "default" : "outline"}>{appt.status === "CHECKED_IN" ? "Start" : "View"}</Button></Link>
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
            <CardContent className="pt-0 grid grid-cols-2 gap-2">
              {[
                { icon: FileText, label: "New Record", href: "/doctor/notes", color: "text-blue-600 bg-blue-50 dark:bg-blue-950/40" },
                { icon: Pill, label: "Prescribe", href: "/doctor/prescriptions", color: "text-green-600 bg-green-50 dark:bg-green-950/40" },
                { icon: Users, label: "Patients", href: "/doctor/patients", color: "text-purple-600 bg-purple-50 dark:bg-purple-950/40" },
                { icon: Stethoscope, label: "Lab Request", href: "/doctor/lab-requests", color: "text-orange-600 bg-orange-50 dark:bg-orange-950/40" },
              ].map(a => (
                <Link key={a.label} href={a.href}>
                  <div className="flex flex-col items-center gap-2 rounded-xl border p-3 text-center hover:border-primary/30 hover:bg-muted/20 transition-all cursor-pointer">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${a.color}`}><a.icon className="h-4.5 w-4.5" style={{height:"18px",width:"18px"}} /></div>
                    <span className="text-xs font-medium">{a.label}</span>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Recent Patients</CardTitle></CardHeader>
            <CardContent className="pt-0 space-y-2">
              {recentPatients.map(a => (
                <Link key={a.id} href={`/doctor/patients/${a.patient.id}`} className="flex items-center gap-3 rounded-lg p-2 hover:bg-muted/20 transition-colors">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-brand-600 text-xs font-bold text-white">{a.patient.firstName[0]}{a.patient.lastName[0]}</div>
                  <div className="flex-1 min-w-0"><div className="text-sm font-medium truncate">{a.patient.firstName} {a.patient.lastName}</div><div className="text-xs text-muted-foreground">{a.patient.patientNumber}</div></div>
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
