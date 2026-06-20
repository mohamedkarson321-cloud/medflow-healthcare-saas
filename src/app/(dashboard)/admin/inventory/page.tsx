import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Package, Plus, AlertTriangle, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader, EmptyState, ProgressBar } from "@/components/shared";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Inventory — MedFlow" };
export default async function AdminInventoryPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const clinic = await prisma.clinic.findFirst();
  const items = await prisma.inventoryItem.findMany({ where: clinic?{clinicId:clinic.id}:{}, orderBy:{name:"asc"} });
  const lowStock = items.filter(i=>i.quantity<=i.minQuantity);
  const outOfStock = items.filter(i=>i.quantity===0);
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Inventory Management" description={`${items.length} items tracked`} actions={<Button leftIcon={<Plus className="h-4 w-4" />}>Add Item</Button>} />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label:"Total Items", value:items.length, color:"" },
          { label:"Low Stock", value:lowStock.length, color:"text-orange-700", bg:"bg-orange-50 dark:bg-orange-950/30" },
          { label:"Out of Stock", value:outOfStock.length, color:"text-red-700", bg:"bg-red-50 dark:bg-red-950/30" },
          { label:"Categories", value:[...new Set(items.map(i=>i.category))].length, color:"text-blue-700", bg:"bg-blue-50 dark:bg-blue-950/30" },
        ].map(s=>(
          <div key={s.label} className={`rounded-xl border p-4 text-center ${s.bg||"bg-muted/40"}`}><div className={`text-2xl font-bold ${s.color}`}>{s.value}</div><div className="text-xs text-muted-foreground">{s.label}</div></div>
        ))}
      </div>
      {lowStock.length > 0 && (
        <div className="flex items-start gap-3 rounded-xl border border-orange-200 bg-orange-50 dark:border-orange-800/50 dark:bg-orange-950/20 p-4">
          <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5 shrink-0" />
          <div><p className="text-sm font-medium text-orange-800 dark:text-orange-300">Low Stock Alert</p><p className="text-xs text-orange-700 dark:text-orange-400 mt-0.5">{lowStock.map(i=>i.name).join(", ")} need restocking.</p></div>
        </div>
      )}
      {items.length === 0 ? (
        <EmptyState icon={<Package className="h-7 w-7" />} title="No inventory items" description="Add items to track your clinic's inventory." action={{ label:"Add Item" }} />
      ) : (
        <div className="overflow-hidden rounded-xl border">
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-muted/40"><th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Item</th><th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Category</th><th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Stock Level</th><th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Unit</th><th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Location</th><th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Expiry</th><th className="px-4 py-3"></th></tr></thead>
            <tbody>
              {items.map(item=>{
                const isLow = item.quantity <= item.minQuantity;
                const pct = item.maxQuantity ? Math.min(100,(item.quantity/item.maxQuantity)*100) : (item.quantity>0 ? 60 : 0);
                return (
                  <tr key={item.id} className={`border-b last:border-0 hover:bg-muted/20 transition-colors ${isLow?"bg-orange-50/40 dark:bg-orange-950/10":""}`}>
                    <td className="px-4 py-3"><div className="font-medium flex items-center gap-2">{item.name}{isLow&&<AlertTriangle className="h-3.5 w-3.5 text-orange-500" />}</div>{item.genericName&&<div className="text-xs text-muted-foreground">{item.genericName}</div>}</td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{item.category}</td>
                    <td className="px-4 py-3 w-40"><ProgressBar value={pct} showPercent={false} color={isLow?"danger":"success"} size="sm" /><span className="text-xs text-muted-foreground">{item.quantity} / {item.maxQuantity??"∞"}</span></td>
                    <td className="px-4 py-3 text-muted-foreground">{item.unit}</td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{item.location??"—"}</td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{item.expiryDate ? item.expiryDate.toLocaleDateString() : "—"}</td>
                    <td className="px-4 py-3"><Button variant="ghost" size="icon-sm"><Edit className="h-3.5 w-3.5" /></Button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
