import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Users, Calendar, CreditCard, Stethoscope, TrendingUp, Package, BarChart3, ArrowRight, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatCard, StatusBadge, PageHeader, ProgressBar } from "@/components/shared";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Admin Dashboard — MedFlow" };
export default async function AdminDashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const clinic = await prisma.clinic.findFirst();
  const today = new Date(); today.setHours(0,0,0,0);
  const tomorrow = new Date(today); tomorrow.setDate(today.getDate()+1);
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const [todayAppts, totalPatients, totalDoctors, monthRevenue, lowStock, recentAppts, pendingInvoices] = await Promise.all([
    prisma.appointment.count({ where: { ...(clinic?{clinicId:clinic.id}:{}), scheduledDate:{gte:today,lt:tomorrow} } }),
    prisma.patient.count({ where: clinic?{clinicId:clinic.id}:{} }),
    prisma.doctor.count({ where: clinic?{clinicId:clinic.id}:{} }),
    prisma.payment.aggregate({ where: { ...(clinic?{}:{}), paidAt:{gte:monthStart} }, _sum:{amount:true} }),
    prisma.inventoryItem.count({ where: { ...(clinic?{clinicId:clinic.id}:{}), quantity:{lte:prisma.inventoryItem.fields.minQuantity} } }).catch(()=>0),
    prisma.appointment.findMany({ where: clinic?{clinicId:clinic.id}:{}, include:{patient:true,doctor:true}, orderBy:{createdAt:"desc"}, take:8 }),
    prisma.invoice.count({ where: { ...(clinic?{clinicId:clinic.id}:{}), status:{in:["SENT","PARTIAL","OVERDUE"]} } }),
  ]);
  const stats = [
    { title:"Today's Appointments", value:todayAppts, icon:<Calendar className="h-6 w-6 text-blue-600" />, iconBg:"bg-blue-100 dark:bg-blue-950/50", change:12 },
    { title:"Total Patients", value:totalPatients, icon:<Users className="h-6 w-6 text-teal-600" />, iconBg:"bg-teal-100 dark:bg-teal-950/50", change:8 },
    { title:"Monthly Revenue", value:formatCurrency(monthRevenue._sum.amount??0,"EGP"), icon:<CreditCard className="h-6 w-6 text-green-600" />, iconBg:"bg-green-100 dark:bg-green-950/50", change:15 },
    { title:"Active Doctors", value:totalDoctors, icon:<Stethoscope className="h-6 w-6 text-purple-600" />, iconBg:"bg-purple-100 dark:bg-purple-950/50" },
  ];
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Admin Dashboard" description={`Welcome back! ${clinic?.name ?? "MedFlow Clinic"} overview.`}
        actions={<Link href="/admin/analytics"><Button leftIcon={<BarChart3 className="h-4 w-4" />}>Analytics</Button></Link>}
      />
      {pendingInvoices > 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-orange-200 bg-orange-50 dark:border-orange-800/50 dark:bg-orange-950/20 p-4">
          <AlertTriangle className="h-5 w-5 text-orange-600 shrink-0" />
          <p className="text-sm text-orange-800 dark:text-orange-300"><strong>{pendingInvoices}</strong> pending invoices require attention. <Link href="/reception/invoices" className="underline font-medium">View now</Link></p>
        </div>
      )}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map(s=><StatCard key={s.title} title={s.title} value={s.value} icon={s.icon} iconBg={s.iconBg} change={s.change} />)}
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle>Recent Appointments</CardTitle>
              <Link href="/reception/appointments"><Button variant="ghost" size="sm" rightIcon={<ArrowRight className="h-3.5 w-3.5" />}>View All</Button></Link>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {recentAppts.map(a=>(
                  <div key={a.id} className="flex items-center gap-4 px-5 py-3 hover:bg-muted/20 transition-colors">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-brand-600 text-xs font-bold text-white">{a.patient.firstName[0]}{a.patient.lastName[0]}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2"><span className="text-sm font-medium">{a.patient.firstName} {a.patient.lastName}</span><StatusBadge status={a.status} size="sm" /></div>
                      <div className="text-xs text-muted-foreground">Dr. {a.doctor.firstName} · {formatDate(a.scheduledDate)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Clinic Performance</CardTitle></CardHeader>
            <CardContent className="pt-0 space-y-4">
              <ProgressBar value={87} label="Appointment Completion Rate" color="success" />
              <ProgressBar value={92} label="Patient Satisfaction" color="primary" />
              <ProgressBar value={68} label="Bed/Room Occupancy" color="warning" />
              <ProgressBar value={44} label="Low Stock Items" color="danger" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Quick Navigation</CardTitle></CardHeader>
            <CardContent className="pt-0 space-y-1.5">
              {[
                { label:"Manage Doctors", href:"/admin/doctors" },
                { label:"Manage Staff", href:"/admin/staff" },
                { label:"Manage Rooms", href:"/admin/rooms" },
                { label:"Services & Pricing", href:"/admin/services" },
                { label:"Inventory", href:"/admin/inventory" },
                { label:"Reports", href:"/admin/reports" },
                { label:"Settings", href:"/admin/settings" },
              ].map(item=>(
                <Link key={item.href} href={item.href} className="flex items-center justify-between rounded-lg px-3 py-2 text-sm hover:bg-muted/40 transition-colors group">
                  <span className="text-muted-foreground group-hover:text-foreground">{item.label}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/50 group-hover:text-primary" />
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
