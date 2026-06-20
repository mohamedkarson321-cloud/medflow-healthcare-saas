import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Pill, Plus, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge, PageHeader, EmptyState } from "@/components/shared";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Prescriptions — MedFlow" };
export default async function DoctorPrescriptionsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const doctor = await prisma.doctor.findUnique({ where: { userId: session.user.id } });
  if (!doctor) redirect("/login");
  const prescriptions = await prisma.prescription.findMany({
    where: { doctorId: doctor.id },
    include: { patient: true, medications: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Prescriptions" description="Manage prescriptions you've written." actions={<Button leftIcon={<Plus className="h-4 w-4" />}>New Prescription</Button>} />
      {prescriptions.length === 0 ? (
        <EmptyState icon={<Pill className="h-7 w-7" />} title="No prescriptions yet" description="Prescriptions you write will appear here." action={{ label: "Write Prescription" }} />
      ) : (
        <div className="overflow-hidden rounded-xl border">
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-muted/40"><th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Rx #</th><th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Patient</th><th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Medications</th><th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Date</th><th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Status</th><th className="px-4 py-3"></th></tr></thead>
            <tbody>
              {prescriptions.map(rx => (
                <tr key={rx.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs font-medium">{rx.prescriptionNumber}</td>
                  <td className="px-4 py-3 font-medium">{rx.patient.firstName} {rx.patient.lastName}</td>
                  <td className="px-4 py-3 text-muted-foreground">{rx.medications.length} medication{rx.medications.length !== 1 ? "s" : ""}<div className="text-xs truncate max-w-[200px]">{rx.medications.slice(0,2).map(m => m.name).join(", ")}{rx.medications.length > 2 ? ` +${rx.medications.length-2}` : ""}</div></td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(rx.issuedAt)}</td>
                  <td className="px-4 py-3"><StatusBadge status={rx.status} /></td>
                  <td className="px-4 py-3"><Button variant="ghost" size="icon-sm" leftIcon={<Download className="h-3.5 w-3.5" />}>{""}</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
