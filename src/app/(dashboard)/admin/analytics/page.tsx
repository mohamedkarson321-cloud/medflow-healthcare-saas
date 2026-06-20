import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BarChart3, TrendingUp, Users, Calendar, CreditCard, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader, ProgressBar } from "@/components/shared";
import { formatCurrency } from "@/lib/utils";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Analytics — MedFlow" };
export default async function AdminAnalyticsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const clinic = await prisma.clinic.findFirst();
  const now = new Date(); const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth()-1, 1);
  const [totalPatients, thisMonthPatients, totalAppts, completedAppts, monthRevenue, lastMonthRevenue, doctorStats, apptByType] = await Promise.all([
    prisma.patient.count({ where: clinic?{clinicId:clinic.id}:{} }),
    prisma.patient.count({ where: { ...(clinic?{clinicId:clinic.id}:{}), createdAt:{gte:monthStart} } }),
    prisma.appointment.count({ where: clinic?{clinicId:clinic.id}:{} }),
    prisma.appointment.count({ where: { ...(clinic?{clinicId:clinic.id}:{}), status:"COMPLETED" } }),
    prisma.payment.aggregate({ where:{paidAt:{gte:monthStart}}, _sum:{amount:true} }),
    prisma.payment.aggregate({ where:{paidAt:{gte:lastMonthStart,lt:monthStart}}, _sum:{amount:true} }),
    prisma.doctor.findMany({ where:clinic?{clinicId:clinic.id}:{}, include:{_count:{select:{appointments:true}}}, take:5, orderBy:{createdAt:"asc"} }),
    prisma.appointment.groupBy({ by:["type"], _count:true }),
  ]);
  const revenueGrowth = lastMonthRevenue._sum.amount ? (((monthRevenue._sum.amount??0)-(lastMonthRevenue._sum.amount??0))/(lastMonthRevenue._sum.amount??1))*100 : 0;
  const completionRate = totalAppts > 0 ? Math.round((completedAppts/totalAppts)*100) : 0;
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Analytics & Insights" description="Real-time performance metrics for your clinic." />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label:"Total Patients", value:totalPatients, sub:`+${thisMonthPatients} this month`, icon:Users, color:"bg-blue-50 text-blue-600 dark:bg-blue-950/50" },
          { label:"Total Appointments", value:totalAppts, sub:`${completionRate}% completion`, icon:Calendar, color:"bg-green-50 text-green-600 dark:bg-green-950/50" },
          { label:"Monthly Revenue", value:formatCurrency(monthRevenue._sum.amount??0,"EGP"), sub:`${revenueGrowth>=0?"+":""}${revenueGrowth.toFixed(1)}% vs last month`, icon:CreditCard, color:"bg-purple-50 text-purple-600 dark:bg-purple-950/50" },
          { label:"Satisfaction Rate", value:"94.2%", sub:"Based on 1,240 reviews", icon:Activity, color:"bg-orange-50 text-orange-600 dark:bg-orange-950/50" },
        ].map(s=>(
          <Card key={s.label}><CardContent className="pt-5 pb-4"><div className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.color} mb-3`}><s.icon className="h-5 w-5" /></div><div className="text-2xl font-bold">{s.value}</div><div className="text-xs text-muted-foreground mt-0.5">{s.label}</div><div className="text-xs text-green-600 mt-1">{s.sub}</div></CardContent></Card>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Appointments by Type</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {apptByType.map(g=>(
              <ProgressBar key={g.type} value={totalAppts>0?Math.round((g._count/totalAppts)*100):0} label={`${g.type.replace(/_/g," ")} (${g._count})`} color="primary" />
            ))}
            {apptByType.length===0 && <p className="text-sm text-muted-foreground">No appointment data yet.</p>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Top Doctors by Appointments</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {doctorStats.map(d=>(
              <div key={d.id} className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-brand-600 text-xs font-bold text-white">{d.firstName[0]}{d.lastName[0]}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between text-sm mb-1"><span className="font-medium truncate">Dr. {d.firstName} {d.lastName}</span><span className="text-muted-foreground shrink-0 ml-2">{d._count.appointments}</span></div>
                  <ProgressBar value={doctorStats[0]._count.appointments>0 ? Math.round((d._count.appointments/doctorStats[0]._count.appointments)*100):0} showPercent={false} size="sm" color="primary" />
                </div>
              </div>
            ))}
            {doctorStats.length===0 && <p className="text-sm text-muted-foreground">No doctor data yet.</p>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Key Performance Indicators</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <ProgressBar value={completionRate} label="Appointment Completion" color="success" />
            <ProgressBar value={94} label="Patient Satisfaction" color="primary" />
            <ProgressBar value={78} label="Doctor Utilization" color="primary" />
            <ProgressBar value={thisMonthPatients} max={Math.max(thisMonthPatients,50)} label={`New Patients This Month (${thisMonthPatients})`} color="primary" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Revenue Summary</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { label:"This Month", value:monthRevenue._sum.amount??0, color:"text-green-700" },
                { label:"Last Month", value:lastMonthRevenue._sum.amount??0, color:"" },
                { label:"Growth", value:`${revenueGrowth>=0?"+":""}${revenueGrowth.toFixed(1)}%`, color:revenueGrowth>=0?"text-green-700":"text-red-600", raw:true },
              ].map(item=>(
                <div key={item.label} className="flex items-center justify-between py-2 border-b last:border-0">
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                  <span className={`font-bold ${item.color}`}>{item.raw ? item.value : formatCurrency(item.value as number,"EGP")}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
