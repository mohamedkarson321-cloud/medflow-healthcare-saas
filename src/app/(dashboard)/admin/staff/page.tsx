import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Users, Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader, EmptyState } from "@/components/shared";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Staff Management — MedFlow" };
export default async function AdminStaffPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const clinic = await prisma.clinic.findFirst();
  const staff = await prisma.staff.findMany({ where:clinic?{clinicId:clinic.id}:{}, include:{user:true}, orderBy:{createdAt:"desc"} });
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Staff Management" description={`${staff.length} staff members`} actions={<Button leftIcon={<Plus className="h-4 w-4" />}>Add Staff</Button>} />
      {staff.length === 0 ? (
        <EmptyState icon={<Users className="h-7 w-7" />} title="No staff members" description="Add your first staff member to get started." action={{ label:"Add Staff Member" }} />
      ) : (
        <div className="overflow-hidden rounded-xl border">
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-muted/40"><th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Name</th><th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">ID</th><th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Role</th><th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Department</th><th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Joined</th><th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Status</th><th className="px-4 py-3"></th></tr></thead>
            <tbody>
              {staff.map(s=>(
                <tr key={s.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3"><div className="flex items-center gap-3"><div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-400 to-teal-600 text-xs font-bold text-white">{s.firstName[0]}{s.lastName[0]}</div><span className="font-medium">{s.firstName} {s.lastName}</span></div></td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{s.employeeNumber}</td>
                  <td className="px-4 py-3"><span className="rounded-full bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-300">{s.role.replace(/_/g," ")}</span></td>
                  <td className="px-4 py-3 text-muted-foreground">{s.department??'—'}</td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(s.joinDate)}</td>
                  <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${s.status==="ACTIVE"?"bg-green-100 text-green-700":"bg-gray-100 text-gray-700"}`}>{s.status}</span></td>
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
