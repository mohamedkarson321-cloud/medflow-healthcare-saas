import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Users, Search, Eye, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader, EmptyState } from "@/components/shared";
import { formatDate, formatAge, formatBloodGroup } from "@/lib/utils";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "My Patients — MedFlow" };
export default async function DoctorPatientsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const doctor = await prisma.doctor.findUnique({ where: { userId: session.user.id } });
  if (!doctor) redirect("/login");
  const patientIds = await prisma.appointment.groupBy({ by: ["patientId"], where: { doctorId: doctor.id } });
  const patients = await prisma.patient.findMany({
    where: { id: { in: patientIds.map(p => p.patientId) } },
    include: { _count: { select: { appointments: { where: { doctorId: doctor.id } } } } },
    orderBy: { createdAt: "desc" },
  });
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="My Patients" description={`${patients.length} patients in your care`} />
      <div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><input placeholder="Search patients by name or ID…" className="flex h-9 w-full max-w-sm rounded-lg border border-input bg-background pl-9 pr-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" /></div>
      {patients.length === 0 ? (
        <EmptyState icon={<Users className="h-7 w-7" />} title="No patients yet" description="Patients will appear here after their first appointment with you." />
      ) : (
        <div className="overflow-hidden rounded-xl border">
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-muted/40"><th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Patient</th><th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">ID</th><th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Age / Gender</th><th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Blood</th><th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Visits</th><th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Phone</th><th className="px-4 py-3"></th></tr></thead>
            <tbody>
              {patients.map(p => (
                <tr key={p.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-xs font-bold text-white">{p.firstName[0]}{p.lastName[0]}</div>
                      <span className="font-medium">{p.firstName} {p.lastName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{p.patientNumber}</td>
                  <td className="px-4 py-3 text-muted-foreground">{formatAge(p.dateOfBirth)} · {p.gender === "MALE" ? "M" : p.gender === "FEMALE" ? "F" : "—"}</td>
                  <td className="px-4 py-3"><span className="rounded-full bg-red-50 dark:bg-red-950/40 px-2 py-0.5 text-xs font-semibold text-red-700 dark:text-red-400">{formatBloodGroup(p.bloodGroup)}</span></td>
                  <td className="px-4 py-3 text-muted-foreground">{p._count.appointments}</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.phone}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">
                      <Link href={`/doctor/patients/${p.id}`}><Button variant="ghost" size="icon-sm"><Eye className="h-3.5 w-3.5" /></Button></Link>
                      <Link href={`/reception/appointments/new?patientId=${p.id}&doctorId=${session.user.id}`}><Button variant="ghost" size="icon-sm"><Calendar className="h-3.5 w-3.5" /></Button></Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
