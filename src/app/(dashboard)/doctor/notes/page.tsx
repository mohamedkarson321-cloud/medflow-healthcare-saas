import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { FileText, Plus, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader, EmptyState } from "@/components/shared";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Medical Notes — MedFlow" };
export default async function DoctorNotesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const doctor = await prisma.doctor.findUnique({ where: { userId: session.user.id } });
  if (!doctor) redirect("/login");
  const records = await prisma.medicalRecord.findMany({
    where: { doctorId: doctor.id },
    include: { patient: true, diagnoses: true },
    orderBy: { visitDate: "desc" },
    take: 30,
  });
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Medical Notes" description="All your clinical notes and records." actions={<Button leftIcon={<Plus className="h-4 w-4" />}>New Note</Button>} />
      {records.length === 0 ? (
        <EmptyState icon={<FileText className="h-7 w-7" />} title="No medical notes yet" description="Notes written during consultations will appear here." action={{ label: "Create Note" }} />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {records.map(r => (
            <Card key={r.id} className="hover:border-primary/30 transition-colors cursor-pointer group">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold">{r.patient.firstName} {r.patient.lastName}</CardTitle>
                  {r.isLocked && <Lock className="h-3.5 w-3.5 text-muted-foreground" />}
                </div>
                <p className="text-xs text-muted-foreground">{formatDate(r.visitDate)} · {r.visitType ?? "Consultation"}</p>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                {r.chiefComplaint && <p className="text-xs text-foreground"><span className="font-medium">CC:</span> {r.chiefComplaint}</p>}
                {r.diagnoses.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {r.diagnoses.slice(0,3).map(d => (
                      <span key={d.id} className="rounded-full bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 text-xs text-blue-700 dark:text-blue-300">{d.name}</span>
                    ))}
                  </div>
                )}
                {r.doctorNotes && <p className="text-xs text-muted-foreground line-clamp-2">{r.doctorNotes}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
