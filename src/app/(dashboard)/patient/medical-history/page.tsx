import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { FileText, Stethoscope, Calendar, ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/card";
import { PageHeader, EmptyState } from "@/components/shared";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Medical History — MedFlow" };
export default async function PatientMedicalHistoryPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const patient = await prisma.patient.findUnique({ where: { userId: session.user.id } });
  if (!patient) redirect("/login");
  const records = await prisma.medicalRecord.findMany({
    where: { patientId: patient.id },
    include: {
      doctor: true,
      diagnoses: true,
      prescriptions: { include: { medications: true } },
    },
    orderBy: { visitDate: "desc" },
  });
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Medical History" description="A complete timeline of your medical visits and records." />
      {records.length === 0 ? (
        <EmptyState icon={<FileText className="h-7 w-7" />} title="No medical records yet" description="Your medical history will appear here after your first consultation." />
      ) : (
        <div className="relative space-y-4 before:absolute before:left-6 before:top-4 before:h-[calc(100%-2rem)] before:w-0.5 before:bg-border">
          {records.map((rec) => (
            <div key={rec.id} className="relative pl-16">
              <div className="absolute left-3.5 top-4 flex h-5 w-5 items-center justify-center rounded-full border-2 border-primary bg-background">
                <div className="h-2 w-2 rounded-full bg-primary" />
              </div>
              <Card className="hover:border-primary/20 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between flex-wrap gap-2">
                    <div>
                      <CardTitle className="text-base">{rec.visitType ?? "General Consultation"}</CardTitle>
                      <p className="mt-1 text-xs text-muted-foreground flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        {formatDate(rec.visitDate, "dd MMM yyyy, EEEE")}
                        <span>·</span>
                        <Stethoscope className="h-3 w-3" />
                        Dr. {rec.doctor.firstName} {rec.doctor.lastName} — {rec.doctor.specialization}
                      </p>
                    </div>
                    {rec.isLocked && <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">🔒 Locked</span>}
                  </div>
                </CardHeader>
                <CardContent className="pt-0 space-y-3">
                  {rec.chiefComplaint && (
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Chief Complaint</h4>
                      <p className="text-sm">{rec.chiefComplaint}</p>
                    </div>
                  )}
                  {rec.diagnoses.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Diagnoses</h4>
                      <div className="flex flex-wrap gap-2">
                        {rec.diagnoses.map((d) => (
                          <span key={d.id} className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                            d.type === "primary" ? "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300" : "border-gray-200 bg-gray-50 text-gray-700 dark:border-gray-700 dark:bg-gray-900/40 dark:text-gray-300"
                          }`}>
                            {d.icdCode && <span className="font-mono">{d.icdCode}</span>}
                            {d.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {rec.treatmentPlan && (
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Treatment Plan</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{rec.treatmentPlan}</p>
                    </div>
                  )}
                  {rec.instructions && (
                    <div className="rounded-xl bg-blue-50 dark:bg-blue-950/30 p-3">
                      <h4 className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-1">Patient Instructions</h4>
                      <p className="text-xs text-blue-800 dark:text-blue-200 leading-relaxed">{rec.instructions}</p>
                    </div>
                  )}
                  {rec.followUpRequired && (
                    <div className="flex items-center gap-2 rounded-xl bg-amber-50 dark:bg-amber-950/30 px-3 py-2 text-xs text-amber-700 dark:text-amber-300">
                      <Calendar className="h-3.5 w-3.5" />
                      Follow-up required{rec.followUpInDays && ` in ${rec.followUpInDays} days`}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
