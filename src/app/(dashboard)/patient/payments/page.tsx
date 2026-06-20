import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CreditCard, Download, AlertCircle, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge, PageHeader, EmptyState } from "@/components/shared";
import { formatDate, formatCurrency } from "@/lib/utils";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Payments — MedFlow" };
export default async function PatientPaymentsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const patient = await prisma.patient.findUnique({ where: { userId: session.user.id } });
  if (!patient) redirect("/login");
  const invoices = await prisma.invoice.findMany({
    where: { patientId: patient.id },
    include: { items: true, payments: true },
    orderBy: { createdAt: "desc" },
  });
  const totalPaid = invoices.filter((i) => i.status === "PAID").reduce((sum, i) => sum + i.total, 0);
  const totalPending = invoices.filter((i) => ["SENT","PARTIAL","OVERDUE"].includes(i.status)).reduce((sum, i) => sum + i.balanceDue, 0);
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Payments & Invoices" description="Track all your payments and outstanding balances." />
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Paid", value: formatCurrency(totalPaid, "EGP"), color: "text-green-700", bg: "bg-green-50 dark:bg-green-950/30" },
          { label: "Outstanding", value: formatCurrency(totalPending, "EGP"), color: "text-orange-700", bg: "bg-orange-50 dark:bg-orange-950/30" },
          { label: "Total Invoices", value: invoices.length, color: "", bg: "bg-muted/40" },
        ].map((s) => (
          <div key={s.label} className={`rounded-xl border p-4 text-center ${s.bg}`}><div className={`text-xl font-bold ${s.color}`}>{s.value}</div><div className="text-xs text-muted-foreground mt-0.5">{s.label}</div></div>
        ))}
      </div>
      {invoices.filter((i) => ["SENT","PARTIAL","OVERDUE"].includes(i.status)).length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Outstanding Invoices</h2>
          <div className="space-y-3">
            {invoices.filter((i) => ["SENT","PARTIAL","OVERDUE"].includes(i.status)).map((inv) => (
              <Card key={inv.id} className={inv.status === "OVERDUE" ? "border-red-200 dark:border-red-800/50" : "border-orange-200 dark:border-orange-800/50"}>
                <CardContent className="flex items-center gap-4 p-5">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${inv.status === "OVERDUE" ? "bg-red-100 text-red-600 dark:bg-red-950" : "bg-orange-100 text-orange-600 dark:bg-orange-950"}`}>
                    <AlertCircle className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2"><span className="text-sm font-semibold">{inv.invoiceNumber}</span><StatusBadge status={inv.status} /></div>
                    <div className="text-xs text-muted-foreground mt-0.5">{inv.items.length} item{inv.items.length !== 1 ? "s" : ""} · Issued {formatDate(inv.issuedAt)}{inv.dueDate && ` · Due ${formatDate(inv.dueDate)}`}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-base font-bold">{formatCurrency(inv.balanceDue, "EGP")}</div>
                    <div className="text-xs text-muted-foreground">Balance due</div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Button size="sm">Pay Now</Button>
                    <Button variant="ghost" size="sm" leftIcon={<Download className="h-3.5 w-3.5" />}>PDF</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Payment History</h2>
        {invoices.length === 0 ? (
          <EmptyState icon={<CreditCard className="h-7 w-7" />} title="No invoices yet" description="Your billing history will appear here." />
        ) : (
          <div className="overflow-hidden rounded-xl border">
            <table className="w-full text-sm">
              <thead><tr className="border-b bg-muted/40"><th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Invoice</th><th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Date</th><th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Amount</th><th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Status</th><th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground"></th></tr></thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv.id} className="border-b last:border-0 hover:bg-muted/20">
                    <td className="px-4 py-3 font-medium">{inv.invoiceNumber}</td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDate(inv.issuedAt)}</td>
                    <td className="px-4 py-3 font-semibold">{formatCurrency(inv.total, "EGP")}</td>
                    <td className="px-4 py-3"><StatusBadge status={inv.status} /></td>
                    <td className="px-4 py-3"><Button variant="ghost" size="icon-sm" leftIcon={<Download className="h-3.5 w-3.5" />}>{""}</Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
