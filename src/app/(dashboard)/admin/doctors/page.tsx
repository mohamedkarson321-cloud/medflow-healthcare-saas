import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Stethoscope, Plus, Star, Phone, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/card";
import { PageHeader, EmptyState, SearchInput } from "@/components/shared";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Doctors Management — MedFlow" };
export default async function AdminDoctorsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const clinic = await prisma.clinic.findFirst();
  const doctors = await prisma.doctor.findMany({
    where: clinic ? { clinicId: clinic.id } : {},
    include: { department: true, _count: { select: { appointments: true } } },
    orderBy: { createdAt: "desc" },
  });
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Doctors Management" description={`${doctors.length} doctors registered`} actions={<Button leftIcon={<Plus className="h-4 w-4" />}>Add Doctor</Button>} />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label:"Total", value:doctors.length, color:"" },
          { label:"Active", value:doctors.filter(d=>d.status==="ACTIVE").length, color:"text-green-700" },
          { label:"On Leave", value:doctors.filter(d=>d.status==="ON_LEAVE").length, color:"text-orange-700" },
          { label:"Avg Rating", value:doctors.length > 0 ? (doctors.reduce((s,d)=>s+d.rating,0)/doctors.length).toFixed(1) : "—", color:"text-yellow-700" },
        ].map(s=>(
          <div key={s.label} className="rounded-xl border bg-card p-4 text-center"><div className={`text-2xl font-bold ${s.color}`}>{s.value}</div><div className="text-xs text-muted-foreground">{s.label}</div></div>
        ))}
      </div>
      {doctors.length === 0 ? (
        <EmptyState icon={<Stethoscope className="h-7 w-7" />} title="No doctors yet" description="Add your first doctor to get started." action={{ label:"Add Doctor" }} />
      ) : (
        <div className="overflow-hidden rounded-xl border">
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-muted/40"><th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Doctor</th><th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">ID</th><th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Specialization</th><th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Department</th><th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Fee</th><th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Rating</th><th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Appts</th><th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Status</th><th className="px-4 py-3"></th></tr></thead>
            <tbody>
              {doctors.map(d=>(
                <tr key={d.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3"><div className="flex items-center gap-3"><div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-xs font-bold text-white">{d.firstName[0]}{d.lastName[0]}</div><div><div className="font-medium">{d.title} {d.firstName} {d.lastName}</div><div className="text-xs text-muted-foreground">{d.experience ? `${d.experience}y exp` : ""}</div></div></div></td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{d.employeeNumber}</td>
                  <td className="px-4 py-3 text-muted-foreground">{d.specialization}</td>
                  <td className="px-4 py-3 text-muted-foreground">{d.department?.name ?? "—"}</td>
                  <td className="px-4 py-3 font-medium">EGP {d.consultationFee}</td>
                  <td className="px-4 py-3">{d.rating > 0 ? <span className="flex items-center gap-1 text-yellow-600"><Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />{d.rating.toFixed(1)}</span> : <span className="text-muted-foreground text-xs">No reviews</span>}</td>
                  <td className="px-4 py-3 text-muted-foreground">{d._count.appointments}</td>
                  <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${d.status==="ACTIVE" ? "bg-green-100 text-green-700" : d.status==="ON_LEAVE" ? "bg-orange-100 text-orange-700" : "bg-gray-100 text-gray-700"}`}>{d.status.replace(/_/g," ")}</span></td>
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
