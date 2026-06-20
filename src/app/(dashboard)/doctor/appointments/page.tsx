import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Calendar, Clock, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge, PageHeader, EmptyState } from "@/components/shared";
import { formatDate, formatTime } from "@/lib/utils";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Appointments — MedFlow" };
export default async function DoctorAppointmentsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const doctor = await prisma.doctor.findUnique({ where: { userId: session.user.id } });
  if (!doctor) redirect("/login");
  const appointments = await prisma.appointment.findMany({
    where: { doctorId: doctor.id },
    include: { patient: true, room: true },
    orderBy: [{ scheduledDate: "desc" }, { scheduledTime: "asc" }],
    take: 50,
  });
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="All Appointments" description="View and manage your appointments." actions={<Button variant="outline" leftIcon={<Filter className="h-4 w-4" />}>Filter</Button>} />
      {appointments.length === 0 ? (
        <EmptyState icon={<Calendar className="h-7 w-7" />} title="No appointments" description="Your appointments will appear here." />
      ) : (
        <div className="overflow-hidden rounded-xl border">
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-muted/40"><th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Date & Time</th><th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Patient</th><th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Type</th><th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Reason</th><th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Status</th><th className="px-4 py-3"></th></tr></thead>
            <tbody>
              {appointments.map(a => (
                <tr key={a.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3"><div className="font-medium">{formatDate(a.scheduledDate)}</div><div className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />{formatTime(a.scheduledTime)}</div></td>
                  <td className="px-4 py-3"><div className="flex items-center gap-2"><div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-brand-600 text-[10px] font-bold text-white">{a.patient.firstName[0]}{a.patient.lastName[0]}</div><span className="font-medium">{a.patient.firstName} {a.patient.lastName}</span></div></td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{a.type.replace(/_/g," ")}</td>
                  <td className="px-4 py-3 text-muted-foreground text-xs max-w-[150px] truncate">{a.chiefComplaint ?? "—"}</td>
                  <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                  <td className="px-4 py-3"><Button variant="outline" size="sm">Open</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
