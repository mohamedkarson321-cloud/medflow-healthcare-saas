import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Layers, Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader, EmptyState } from "@/components/shared";
import { formatCurrency } from "@/lib/utils";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Services — MedFlow" };
export default async function AdminServicesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const clinic = await prisma.clinic.findFirst();
  const services = await prisma.service.findMany({ where:clinic?{clinicId:clinic.id}:{}, include:{department:true}, orderBy:[{category:"asc"},{name:"asc"}] });
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Services & Pricing" description={`${services.length} services configured`} actions={<Button leftIcon={<Plus className="h-4 w-4" />}>Add Service</Button>} />
      {services.length === 0 ? (
        <EmptyState icon={<Layers className="h-7 w-7" />} title="No services yet" description="Add the services your clinic offers." action={{ label:"Add Service" }} />
      ) : (
        <div className="overflow-hidden rounded-xl border">
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-muted/40"><th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Service</th><th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Category</th><th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Department</th><th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Duration</th><th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Price</th><th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Status</th><th className="px-4 py-3"></th></tr></thead>
            <tbody>
              {services.map(s=>(
                <tr key={s.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3"><div className="font-medium">{s.name}</div>{s.description&&<div className="text-xs text-muted-foreground truncate max-w-[200px]">{s.description}</div>}</td>
                  <td className="px-4 py-3"><span className="rounded-full bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 text-xs text-blue-700 dark:text-blue-300">{s.category.replace(/_/g," ")}</span></td>
                  <td className="px-4 py-3 text-muted-foreground">{s.department?.name??'—'}</td>
                  <td className="px-4 py-3 text-muted-foreground">{s.duration} min</td>
                  <td className="px-4 py-3 font-semibold">{formatCurrency(s.price,"EGP")}</td>
                  <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${s.isActive?"bg-green-100 text-green-700":"bg-gray-100 text-gray-600"}`}>{s.isActive?"Active":"Inactive"}</span></td>
                  <td className="px-4 py-3"><div className="flex gap-1"><Button variant="ghost" size="icon-sm"><Edit className="h-3.5 w-3.5" /></Button><Button variant="ghost" size="icon-sm"><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
