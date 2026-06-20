import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ListOrdered, Clock, CheckCircle2, Bell } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader, EmptyState } from "@/components/shared";
import { formatTime } from "@/lib/utils";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Queue Management — MedFlow" };
export default async function ReceptionQueuePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const today = new Date(); today.setHours(0,0,0,0);
  const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate()+1);
  const queue = await prisma.appointment.findMany({
    where: { status: { in: ["CHECKED_IN","WAITING","IN_PROGRESS"] }, scheduledDate: { gte:today, lt:tomorrow } },
    include: { patient:true, doctor:true, room:true },
    orderBy: [{ status:"asc" }, { scheduledTime:"asc" }],
  });
  const statusOrder: Record<string, number> = { IN_PROGRESS:0, CHECKED_IN:1, WAITING:2 };
  const sorted = [...queue].sort((a,b) => (statusOrder[a.status]??99) - (statusOrder[b.status]??99));
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Queue Management" description={`${sorted.length} patients currently in queue`} />
      <div className="grid grid-cols-3 gap-4">
        {[
          { label:"In Progress", value:sorted.filter(a=>a.status==="IN_PROGRESS").length, color:"text-blue-700", bg:"bg-blue-50 dark:bg-blue-950/30" },
          { label:"Checked In", value:sorted.filter(a=>a.status==="CHECKED_IN").length, color:"text-purple-700", bg:"bg-purple-50 dark:bg-purple-950/30" },
          { label:"Waiting", value:sorted.filter(a=>a.status==="WAITING").length, color:"text-orange-700", bg:"bg-orange-50 dark:bg-orange-950/30" },
        ].map(s=>(
          <div key={s.label} className={`rounded-xl border p-4 text-center ${s.bg}`}><div className={`text-2xl font-bold ${s.color}`}>{s.value}</div><div className="text-xs text-muted-foreground">{s.label}</div></div>
        ))}
      </div>
      {sorted.length === 0 ? (
        <EmptyState icon={<ListOrdered className="h-7 w-7" />} title="Queue is empty" description="No patients are currently waiting or in progress." />
      ) : (
        <div className="space-y-3">
          {sorted.map((a, idx) => (
            <Card key={a.id} className={`${a.status==="IN_PROGRESS" ? "border-blue-300 bg-blue-50/50 dark:border-blue-700 dark:bg-blue-950/20" : a.status==="CHECKED_IN" ? "border-purple-200 dark:border-purple-800/50" : ""}`}>
              <CardContent className="flex items-center gap-4 p-4">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-bold text-lg ${a.status==="IN_PROGRESS" ? "bg-blue-100 text-blue-700" : "bg-muted text-muted-foreground"}`}>#{idx+1}</div>
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-brand-600 text-xs font-bold text-white">{a.patient.firstName[0]}{a.patient.lastName[0]}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm">{a.patient.firstName} {a.patient.lastName}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-2">
                    <Clock className="h-3 w-3" />{formatTime(a.scheduledTime)}
                    <span>· Dr. {a.doctor.firstName} {a.doctor.lastName}</span>
                    {a.room && <span>· Room {a.room.number ?? a.room.name}</span>}
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  {a.status==="WAITING" && <Button size="sm" variant="outline">Check In</Button>}
                  {a.status==="CHECKED_IN" && <Button size="sm">Start Consultation</Button>}
                  {a.status==="IN_PROGRESS" && <Button size="sm" variant="soft-success" leftIcon={<CheckCircle2 className="h-3.5 w-3.5" />}>Complete</Button>}
                  <Button size="icon-sm" variant="outline"><Bell className="h-3.5 w-3.5" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
