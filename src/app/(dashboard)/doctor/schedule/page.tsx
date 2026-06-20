import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Clock, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge, PageHeader } from "@/components/shared";
import { formatTime } from "@/lib/utils";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "My Schedule — MedFlow" };
const DAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
export default async function DoctorSchedulePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const doctor = await prisma.doctor.findUnique({ where: { userId: session.user.id } });
  if (!doctor) redirect("/login");
  const today = new Date(); today.setHours(0,0,0,0);
  const next7 = new Date(today); next7.setDate(next7.getDate()+7);
  const [workingHours, upcomingAppts] = await Promise.all([
    prisma.workingHours.findMany({ where: { doctorId: doctor.id }, orderBy: { dayOfWeek: "asc" } }),
    prisma.appointment.findMany({
      where: { doctorId: doctor.id, scheduledDate: { gte: today, lt: next7 }, status: { notIn: ["CANCELLED"] } },
      include: { patient: true },
      orderBy: [{ scheduledDate: "asc" }, { scheduledTime: "asc" }],
    }),
  ]);
  const apptsByDay: Record<string, typeof upcomingAppts> = {};
  upcomingAppts.forEach(a => {
    const d = a.scheduledDate.toISOString().split("T")[0];
    if (!apptsByDay[d]) apptsByDay[d] = [];
    apptsByDay[d].push(a);
  });
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="My Schedule" description="Your availability and upcoming appointments for the next 7 days." actions={<Button variant="outline" leftIcon={<Settings className="h-4 w-4" />}>Manage Availability</Button>} />
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-3">
          {Array.from({length:7}, (_,i) => { const d = new Date(today); d.setDate(d.getDate()+i); const key = d.toISOString().split("T")[0]; const dayAppts = apptsByDay[key] ?? []; const isToday = i===0;
            return (
              <Card key={key} className={isToday ? "border-primary/40 bg-primary/5" : ""}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">{isToday ? "Today — " : ""}{DAYS[d.getDay()]}, {d.toLocaleDateString("en",{month:"short",day:"numeric"})}</CardTitle>
                    <span className="text-xs text-muted-foreground">{dayAppts.length} appointment{dayAppts.length!==1?"s":""}</span>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  {dayAppts.length === 0 ? (
                    <p className="text-xs text-muted-foreground py-1">No appointments scheduled</p>
                  ) : (
                    <div className="space-y-2">
                      {dayAppts.map(a => (
                        <div key={a.id} className="flex items-center gap-3 rounded-lg border bg-card p-2.5">
                          <div className="w-14 text-center shrink-0"><div className="text-xs font-bold">{formatTime(a.scheduledTime)}</div><div className="text-[10px] text-muted-foreground">{a.duration}m</div></div>
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-brand-600 text-[10px] font-bold text-white">{a.patient.firstName[0]}{a.patient.lastName[0]}</div>
                          <div className="flex-1 min-w-0"><div className="text-xs font-semibold truncate">{a.patient.firstName} {a.patient.lastName}</div><div className="text-[10px] text-muted-foreground">{a.type.replace(/_/g," ")}</div></div>
                          <StatusBadge status={a.status} size="sm" />
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
        <div>
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-sm">Working Hours</CardTitle></CardHeader>
            <CardContent className="pt-0 space-y-2">
              {workingHours.length === 0 ? (
                <p className="text-xs text-muted-foreground">No hours set. Configure your availability.</p>
              ) : (
                workingHours.map(wh => (
                  <div key={wh.id} className="flex items-center justify-between text-xs">
                    <span className={wh.isOpen ? "font-medium" : "text-muted-foreground"}>{DAYS[wh.dayOfWeek]}</span>
                    {wh.isOpen ? (
                      <span className="text-muted-foreground">{formatTime(wh.openTime)} – {formatTime(wh.closeTime)}</span>
                    ) : (
                      <span className="text-red-500">Closed</span>
                    )}
                  </div>
                ))
              )}
              <Button variant="outline" size="sm" className="w-full mt-3" leftIcon={<Settings className="h-3.5 w-3.5" />}>Edit Hours</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
