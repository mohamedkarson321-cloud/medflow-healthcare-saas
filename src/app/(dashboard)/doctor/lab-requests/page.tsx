import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { FlaskConical, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge, PageHeader, EmptyState } from "@/components/shared";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Lab Requests — MedFlow" };
export default async function DoctorLabRequestsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const doctor = await prisma.doctor.findUnique({ where: { userId: session.user.id } });
  if (!doctor) redirect("/login");
  const requests = await prisma.labRequest.findMany({
    where: { doctorId: doctor.id },
    include: { patient: true, items: { include: { labTest: true } }, results: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Lab Requests" description="Track all your laboratory test requests." actions={<Button leftIcon={<Plus className="h-4 w-4" />}>New Request</Button>} />
      {requests.length === 0 ? (
        <EmptyState icon={<FlaskConical className="h-7 w-7" />} title="No lab requests" description="Lab requests you create will appear here." action={{ label: "Create Request" }} />
      ) : (
        <div className="overflow-hidden rounded-xl border">
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-muted/40"><th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Request #</th><th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Patient</th><th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Tests</th><th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Priority</th><th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Date</th><th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Status</th><th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Results</th></tr></thead>
            <tbody>
              {requests.map(r => (
                <tr key={r.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs font-medium">{r.requestNumber}</td>
                  <td className="px-4 py-3 font-medium">{r.patient.firstName} {r.patient.lastName}</td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{r.items.map(i => i.labTest.name).join(", ")}</td>
                  <td className="px-4 py-3"><span className={`rounded-full px-2 py-0.5 text-xs font-medium ${r.priority==="stat" ? "bg-red-100 text-red-700" : r.priority==="urgent" ? "bg-orange-100 text-orange-700" : "bg-gray-100 text-gray-700"}`}>{r.priority.toUpperCase()}</span></td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(r.requestedAt)}</td>
                  <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                  <td className="px-4 py-3">{r.results.length > 0 ? <span className="text-xs text-green-600 font-medium">✓ {r.results.length} ready</span> : <span className="text-xs text-muted-foreground">Pending</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
