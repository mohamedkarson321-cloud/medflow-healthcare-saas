import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DoorOpen, Plus, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge, PageHeader, EmptyState } from "@/components/shared";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Rooms — MedFlow" };
export default async function AdminRoomsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const clinic = await prisma.clinic.findFirst();
  const rooms = await prisma.room.findMany({ where:clinic?{clinicId:clinic.id}:{}, include:{department:true}, orderBy:{name:"asc"} });
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Rooms Management" description={`${rooms.length} rooms configured`} actions={<Button leftIcon={<Plus className="h-4 w-4" />}>Add Room</Button>} />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label:"Available", value:rooms.filter(r=>r.status==="AVAILABLE").length, color:"text-green-700", bg:"bg-green-50 dark:bg-green-950/30" },
          { label:"Occupied", value:rooms.filter(r=>r.status==="OCCUPIED").length, color:"text-blue-700", bg:"bg-blue-50 dark:bg-blue-950/30" },
          { label:"Maintenance", value:rooms.filter(r=>r.status==="MAINTENANCE").length, color:"text-orange-700", bg:"bg-orange-50 dark:bg-orange-950/30" },
          { label:"Total", value:rooms.length, color:"", bg:"bg-muted/40" },
        ].map(s=>(
          <div key={s.label} className={`rounded-xl border p-4 text-center ${s.bg}`}><div className={`text-2xl font-bold ${s.color}`}>{s.value}</div><div className="text-xs text-muted-foreground">{s.label}</div></div>
        ))}
      </div>
      {rooms.length === 0 ? (
        <EmptyState icon={<DoorOpen className="h-7 w-7" />} title="No rooms configured" description="Add consultation and treatment rooms." action={{ label:"Add Room" }} />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rooms.map(r=>(
            <div key={r.id} className={`rounded-2xl border bg-card p-5 hover:border-primary/30 transition-colors ${r.status==="OCCUPIED"?"border-blue-200 bg-blue-50/30 dark:border-blue-800/40 dark:bg-blue-950/10":r.status==="MAINTENANCE"?"border-orange-200 bg-orange-50/30 dark:border-orange-800/40 dark:bg-orange-950/10":""}`}>
              <div className="flex items-start justify-between mb-3">
                <div><div className="font-semibold">{r.name}</div>{r.number&&<div className="text-xs text-muted-foreground">Room #{r.number}</div>}</div>
                <StatusBadge status={r.status} />
              </div>
              <div className="space-y-1.5 text-xs text-muted-foreground">
                <div>Type: <span className="font-medium text-foreground">{r.type.replace(/_/g," ")}</span></div>
                {r.department&&<div>Department: <span className="font-medium text-foreground">{r.department.name}</span></div>}
                {r.floor&&<div>Floor: <span className="font-medium text-foreground">{r.floor}</span></div>}
                <div>Capacity: <span className="font-medium text-foreground">{r.capacity}</span></div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" className="flex-1" leftIcon={<Edit className="h-3.5 w-3.5" />}>Edit</Button>
                <Button variant={r.status==="AVAILABLE"?"soft":"outline"} size="sm" className="flex-1">{r.status==="AVAILABLE"?"Mark Occupied":"Mark Available"}</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
