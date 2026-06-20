import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Pill, Download, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/card";
import { StatusBadge, PageHeader, EmptyState } from "@/components/shared";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "My Prescriptions — MedFlow" };
export default async function PatientPrescriptionsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const patient = await prisma.patient.findUnique({ where: { userId: session.user.id } });
  if (!patient) redirect("/login");
  const prescriptions = await prisma.prescription.findMany({
    where: { patientId: patient.id },
    include: { doctor: true, medications: { orderBy: { sortOrder: "asc" } } },
    orderBy: { createdAt: "desc" },
  });
  const active = prescriptions.filter((p) => p.status === "ACTIVE");
  const others = prescriptions.filter((p) => p.status !== "ACTIVE");
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="My Prescriptions" description="View and download all your digital prescriptions." />
      <div className="grid grid-cols-3 gap-4">
        {[{ label: "Active", value: active.length, color: "text-green-700", bg: "bg-green-50 dark:bg-green-950/30" }, { label: "Completed", value: others.filter((p) => p.status === "COMPLETED").length, color: "", bg: "bg-muted/40" }, { label: "Total", value: prescriptions.length, color: "text-blue-700", bg: "bg-blue-50 dark:bg-blue-950/30" }].map((s) => (
          <div key={s.label} className={`rounded-xl border p-4 text-center ${s.bg}`}><div className={`text-2xl font-bold ${s.color}`}>{s.value}</div><div className="text-xs text-muted-foreground">{s.label}</div></div>
        ))}
      </div>
      {active.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Active Prescriptions</h2>
          <div className="space-y-4">
            {active.map((rx) => (
              <Card key={rx.id} className="border-green-200 dark:border-green-800/50">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between flex-wrap gap-3">
                    <div>
                      <div className="flex items-center gap-2"><CardTitle className="text-base">{rx.prescriptionNumber}</CardTitle><StatusBadge status={rx.status} /></div>
                      <p className="mt-1 text-xs text-muted-foreground">Dr. {rx.doctor.firstName} {rx.doctor.lastName} · {formatDate(rx.issuedAt)}</p>
                      {rx.validUntil && <p className="text-xs text-muted-foreground">Valid until: {formatDate(rx.validUntil)}</p>}
                    </div>
                    <div className="flex gap-2"><Button variant="outline" size="sm" leftIcon={<Eye className="h-3.5 w-3.5" />}>View</Button><Button variant="soft" size="sm" leftIcon={<Download className="h-3.5 w-3.5" />}>PDF</Button></div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  {rx.diagnosis && <div className="mb-3 rounded-lg bg-muted/40 px-3 py-2 text-xs text-muted-foreground">Diagnosis: <span className="font-medium text-foreground">{rx.diagnosis}</span></div>}
                  <div className="space-y-2">
                    {rx.medications.map((med, i) => (
                      <div key={med.id} className="flex items-start gap-3 rounded-xl border bg-card p-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/40 text-green-700 text-xs font-bold">{i + 1}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap"><span className="text-sm font-semibold">{med.name}</span>{med.strength && <Badge variant="outline" className="text-xs">{med.strength}</Badge>}{med.form && <Badge variant="secondary" className="text-xs">{med.form}</Badge>}</div>
                          <div className="mt-1 text-xs text-muted-foreground"><span className="font-medium text-foreground">{med.dosage}</span> · {med.frequency}{med.duration && ` · ${med.duration}`}</div>
                          {med.instructions && <div className="mt-1 text-xs text-amber-700 dark:text-amber-400">⚠ {med.instructions}</div>}
                        </div>
                        {med.quantity && <div className="shrink-0 text-right"><div className="text-xs font-semibold">{med.quantity}</div><div className="text-[10px] text-muted-foreground">units</div></div>}
                      </div>
                    ))}
                  </div>
                  {rx.notes && <div className="mt-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 p-3 text-xs text-blue-800 dark:text-blue-300">📝 {rx.notes}</div>}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}
      {others.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Past Prescriptions</h2>
          <div className="space-y-2">
            {others.map((rx) => (
              <div key={rx.id} className="flex items-center gap-4 rounded-xl border bg-card p-4 hover:bg-muted/20 transition-colors">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted"><Pill className="h-4 w-4 text-muted-foreground" /></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2"><span className="text-sm font-medium">{rx.prescriptionNumber}</span><StatusBadge status={rx.status} /></div>
                  <div className="text-xs text-muted-foreground mt-0.5">Dr. {rx.doctor.firstName} {rx.doctor.lastName} · {formatDate(rx.issuedAt)} · {rx.medications.length} medication{rx.medications.length !== 1 ? "s" : ""}</div>
                </div>
                <Button variant="ghost" size="sm" leftIcon={<Download className="h-3.5 w-3.5" />}>PDF</Button>
              </div>
            ))}
          </div>
        </section>
      )}
      {prescriptions.length === 0 && <EmptyState icon={<Pill className="h-7 w-7" />} title="No prescriptions yet" description="Your doctor's prescriptions will appear here after your consultation." />}
    </div>
  );
}
