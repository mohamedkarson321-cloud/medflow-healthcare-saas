import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BarChart3, TrendingUp, Users, CheckCircle2, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader, ProgressBar } from "@/components/shared";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Reports — MedFlow" };
export default async function DoctorReportsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const doctor = await prisma.doctor.findUnique({ where: { userId: session.user.id } });
  if (!doctor) redirect("/login");
  const now = new Date(); const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const [totalAppts, completedAppts, monthAppts, patientIds] = await Promise.all([
    prisma.appointment.count({ where: { doctorId: doctor.id } }),
    prisma.appointment.count({ where: { doctorId: doctor.id, status: "COMPLETED" } }),
    prisma.appointment.count({ where: { doctorId: doctor.id, scheduledDate: { gte: monthStart } } }),
    prisma.appointment.groupBy({ by: ["patientId"], where: { doctorId: doctor.id } }),
  ]);
  const completionRate = totalAppts > 0 ? Math.round((completedAppts/totalAppts)*100) : 0;
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="My Reports" description="Performance metrics and statistics." />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "Total Appointments", value: totalAppts, icon: BarChart3, color: "bg-blue-50 text-blue-600 dark:bg-blue-950/40" },
          { label: "Completed", value: completedAppts, icon: CheckCircle2, color: "bg-green-50 text-green-600 dark:bg-green-950/40" },
          { label: "This Month", value: monthAppts, icon: TrendingUp, color: "bg-purple-50 text-purple-600 dark:bg-purple-950/40" },
          { label: "Total Patients", value: patientIds.length, icon: Users, color: "bg-orange-50 text-orange-600 dark:bg-orange-950/40" },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="pt-5 pb-4">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.color} mb-3`}><s.icon className="h-5 w-5" /></div>
              <div className="text-2xl font-bold">{s.value}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Performance Overview</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <ProgressBar value={completionRate} label="Appointment Completion Rate" color="success" />
            <ProgressBar value={doctor.rating > 0 ? (doctor.rating/5)*100 : 0} label={`Patient Rating (${doctor.rating > 0 ? doctor.rating.toFixed(1) : "N/A"}/5.0)`} color="primary" />
            <ProgressBar value={75} label="Prescription Accuracy" color="primary" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Doctor Profile Stats</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: "Specialization", value: doctor.specialization },
              { label: "Experience", value: doctor.experience ? `${doctor.experience} years` : "—" },
              { label: "Rating", value: doctor.rating > 0 ? `⭐ ${doctor.rating.toFixed(1)} (${doctor.totalRatings} reviews)` : "No reviews yet" },
              { label: "Consultation Fee", value: `EGP ${doctor.consultationFee}` },
              { label: "Languages", value: doctor.languages.join(", ") },
              { label: "Status", value: doctor.isAcceptingNew ? "✅ Accepting new patients" : "❌ Not accepting" },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between text-sm py-1.5 border-b last:border-0">
                <span className="text-muted-foreground">{item.label}</span>
                <span className="font-medium text-right">{item.value}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
