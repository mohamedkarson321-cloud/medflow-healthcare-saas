import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Receipt, Plus, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge, PageHeader, EmptyState } from "@/components/shared";
import { formatDate, formatCurrency } from "@/lib/utils";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Invoices — MedFlow" };
export default async function ReceptionInvoicesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const clinic = await prisma.clinic.findFirst();
  const invoices = await prisma.invoice.findMany({
    where: clinic ? { clinicId: clinic.id } : {},
    include: { patient:true },
    orderBy: { createdAt:"desc" },
    take: 50,
  });
  const totalRevenue = invoices.filter(i=>i.status==="PAID").reduce((s,i)=>s+i.total,0);
  const totalPending = invoices.filter(i=>["SENT","PARTIAL","OVERDUE"].includes(i.status)).reduce((s,i)=>s+i.balanceDue,0);
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Invoices" description="Manage all clinic invoices and payments." actions={<Button leftIcon={<Plus className="h-4 w-4" />}>Create Invoice</Button>} />
      <div className="grid grid-cols-3 gap-4">
        {[
          { label:"Total Invoices", value:invoices.length, color:"", bg:"bg-muted/40" },
          { label:"Total Collected", value:formatCurrency(totalRevenue,"EGP"), color:"text-green-700", bg:"bg-green-50 dark:bg-green-950/30" },
          { label:"Pending Amount", value:formatCurrency(totalPending,"EGP"), color:"text-orange-700", bg:"bg-orange-50 dark:bg-orange-950/30" },
        ].map(s=>(
          <div key={s.label} className={`rounded-xl border p-4 text-center ${s.bg}`}><div className={`text-xl font-bold ${s.color}`}>{s.value}</div><div className="text-xs text-muted-foreground mt-0.5">{s.label}</div></div>
        ))}
      </div>
      {invoices.length === 0 ? (
        <EmptyState icon={<Receipt className="h-7 w-7" />} title="No invoices yet" description="Create an invoice for a patient visit." action={{ label:"Create Invoice" }} />
      ) : (
        <div className="overflow-hidden rounded-xl border">
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-muted/40"><th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Invoice #</th><th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Patient</th><th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Date</th><th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Total</th><th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Paid</th><th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Balance</th><th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Status</th><th className="px-4 py-3"></th></tr></thead>
            <tbody>
              {invoices.map(inv=>(
                <tr key={inv.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs font-medium">{inv.invoiceNumber}</td>
                  <td className="px-4 py-3 font-medium">{inv.patient.firstName} {inv.patient.lastName}</td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(inv.issuedAt)}</td>
                  <td className="px-4 py-3 font-semibold">{formatCurrency(inv.total,"EGP")}</td>
                  <td className="px-4 py-3 text-green-700">{formatCurrency(inv.paidAmount,"EGP")}</td>
                  <td className={`px-4 py-3 font-semibold ${inv.balanceDue>0?"text-red-600":""}`}>{formatCurrency(inv.balanceDue,"EGP")}</td>
                  <td className="px-4 py-3"><StatusBadge status={inv.status} /></td>
                  <td className="px-4 py-3"><div className="flex gap-1"><Button variant="outline" size="sm">Pay</Button><Button variant="ghost" size="icon-sm"><Download className="h-3.5 w-3.5" /></Button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
