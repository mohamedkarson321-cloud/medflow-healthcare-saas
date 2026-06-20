import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { FlaskConical, Download, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge, PageHeader, EmptyState } from "@/components/shared";
import { formatDate, formatDateTime } from "@/lib/utils";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Lab Results — MedFlow" };
export default async function PatientLabResultsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const patient = await prisma.patient.findUnique({ where: { userId: session.user.id } });
  if (!patient) redirect("/login");
  const labRequests = await prisma.labRequest.findMany({
    where: { patientId: patient.id },
    include: { doctor: true, items: { include: { labTest: true } }, results: true },
    orderBy: { createdAt: "desc" },
  });
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Lab Results" description="View all your laboratory test requests and results." />
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Completed", value: labRequests.filter((l) => l.status === "COMPLETED").length, color: "text-green-700", bg: "bg-green-50 dark:bg-green-950/30" },
          { label: "In Progress", value: labRequests.filter((l) => ["REQUESTED","SAMPLE_COLLECTED","IN_PROGRESS"].includes(l.status)).length, color: "text-blue-700", bg: "bg-blue-50 dark:bg-blue-950/30" },
          { label: "Total", value: labRequests.length, color: "", bg: "bg-muted/40" },
        ].map((s) => (
          <div key={s.label} className={`rounded-xl border p-4 text-center ${s.bg}`}><div className={`text-2xl font-bold ${s.color}`}>{s.value}</div><div className="text-xs text-muted-foreground">{s.label}</div></div>
        ))}
      </div>
      {labRequests.length === 0 ? (
        <EmptyState icon={<FlaskConical className="h-7 w-7" />} title="No lab results yet" description="Lab results will appear here once your doctor requests tests." />
      ) : (
        <div className="space-y-4">
          {labRequests.map((req) => (
            <Card key={req.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between flex-wrap gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <CardTitle className="text-base">{req.requestNumber}</CardTitle>
                      <StatusBadge status={req.status} />
                      {req.priority !== "routine" && (
                        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${req.priority === "stat" ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700"}`}>{req.priority.toUpperCase()}</span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">Requested by Dr. {req.doctor.firstName} {req.doctor.lastName} · {formatDate(req.requestedAt)}</p>
                  </div>
                  {req.status === "COMPLETED" && (
                    <Button variant="soft" size="sm" leftIcon={<Download className="h-3.5 w-3.5" />}>Download Report</Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {req.clinicalInfo && <div className="mb-3 rounded-lg bg-muted/40 p-3 text-xs text-muted-foreground">Clinical Info: {req.clinicalInfo}</div>}
                <div className="space-y-2">
                  {req.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 rounded-lg border bg-card p-3">
                      <FlaskConical className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <span className="flex-1 text-sm font-medium">{item.labTest.name}</span>
                      {item.labTest.category && <span className="text-xs text-muted-foreground">{item.labTest.category}</span>}
                      <StatusBadge status={item.status} />
                    </div>
                  ))}
                </div>
                {req.results.length > 0 && (
                  <div className="mt-4">
                    <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Results</h4>
                    <div className="overflow-hidden rounded-xl border">
                      <table className="w-full text-sm">
                        <thead><tr className="border-b bg-muted/40"><th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Test</th><th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Result</th><th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Normal Range</th><th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Status</th></tr></thead>
                        <tbody>
                          {req.results.map((result) => (
                            <tr key={result.id} className={`border-b last:border-0 ${result.isAbnormal ? "bg-red-50/50 dark:bg-red-950/20" : ""}`}>
                              <td className="px-4 py-2.5 font-medium">{result.testName}</td>
                              <td className={`px-4 py-2.5 font-semibold ${result.isAbnormal ? "text-red-600" : "text-green-600"}`}>{result.value} {result.unit}</td>
                              <td className="px-4 py-2.5 text-muted-foreground">{result.normalRange ?? "—"}</td>
                              <td className="px-4 py-2.5">{result.isAbnormal ? <span className="flex items-center gap-1 text-xs text-red-600"><AlertCircle className="h-3.5 w-3.5" />Abnormal</span> : <span className="flex items-center gap-1 text-xs text-green-600"><CheckCircle2 className="h-3.5 w-3.5" />Normal</span>}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
