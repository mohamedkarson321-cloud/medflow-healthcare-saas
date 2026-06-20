import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Calendar, Clock, Plus, Video, MapPin, RefreshCw, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge, PageHeader, EmptyState } from "@/components/shared";
import { formatDate, formatTime } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "My Appointments — MedFlow" };

async function getPatientAppointments(userId: string) {
  const patient = await prisma.patient.findUnique({ where: { userId } });
  if (!patient) return null;
  const appointments = await prisma.appointment.findMany({
    where: { patientId: patient.id },
    include: { doctor: { include: { department: true } }, room: true },
    orderBy: [{ scheduledDate: "desc" }, { scheduledTime: "desc" }],
  });
  return { patient, appointments };
}

export default async function PatientAppointmentsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const data = await getPatientAppointments(session.user.id);
  if (!data) redirect("/login");
  const { appointments } = data;

  const upcoming = appointments.filter((a) =>
    ["SCHEDULED", "CONFIRMED", "CHECKED_IN", "WAITING"].includes(a.status)
  );
  const past = appointments.filter((a) =>
    ["COMPLETED", "CANCELLED", "NO_SHOW"].includes(a.status)
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="My Appointments"
        description="Manage and track all your medical appointments."
        actions={
          <Link href="/book-appointment">
            <Button leftIcon={<Plus className="h-4 w-4" />}>Book Appointment</Button>
          </Link>
        }
      />
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Upcoming", value: upcoming.length, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950/40" },
          { label: "Completed", value: past.filter((a) => a.status === "COMPLETED").length, color: "text-green-600", bg: "bg-green-50 dark:bg-green-950/40" },
          { label: "Cancelled", value: past.filter((a) => a.status === "CANCELLED").length, color: "text-red-600", bg: "bg-red-50 dark:bg-red-950/40" },
        ].map((s) => (
          <div key={s.label} className={`rounded-xl border p-4 text-center ${s.bg}`}>
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Upcoming ({upcoming.length})</h2>
        {upcoming.length === 0 ? (
          <EmptyState icon={<Calendar className="h-7 w-7" />} title="No upcoming appointments" description="Book an appointment with one of our specialist doctors." action={{ label: "Book Now" }} />
        ) : (
          <div className="space-y-3">
            {upcoming.map((appt) => (
              <Card key={appt.id} className="hover:border-primary/30 transition-colors">
                <CardContent className="flex items-start gap-4 p-5">
                  <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <span className="text-base font-bold leading-none">{formatDate(appt.scheduledDate, "dd")}</span>
                    <span className="text-xs font-medium">{formatDate(appt.scheduledDate, "MMM")}</span>
                    <span className="text-[10px] text-muted-foreground">{formatDate(appt.scheduledDate, "EEE")}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start flex-wrap gap-2">
                      <span className="text-sm font-semibold">Dr. {appt.doctor.firstName} {appt.doctor.lastName}</span>
                      <StatusBadge status={appt.status} />
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">{appt.doctor.specialization}{appt.doctor.department && ` · ${appt.doctor.department.name}`}</div>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {formatTime(appt.scheduledTime)} · {appt.duration} min</span>
                      <span>{appt.type.replace(/_/g, " ")}</span>
                      {appt.room && <span>Room {appt.room.number ?? appt.room.name}</span>}
                    </div>
                    {appt.chiefComplaint && <div className="mt-1.5 text-xs text-muted-foreground">Reason: {appt.chiefComplaint}</div>}
                  </div>
                  <div className="flex shrink-0 flex-col gap-2">
                    {appt.type === "TELEMEDICINE" && <Button size="sm" leftIcon={<Video className="h-3.5 w-3.5" />}>Join Call</Button>}
                    <Button variant="outline" size="sm">Reschedule</Button>
                    <Button variant="soft-destructive" size="sm">Cancel</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
      {past.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Past Appointments ({past.length})</h2>
          <div className="space-y-2">
            {past.map((appt) => (
              <div key={appt.id} className="flex items-center gap-4 rounded-xl border bg-card p-4 hover:bg-muted/20 transition-colors">
                <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-lg bg-muted">
                  <span className="text-xs font-bold leading-none">{formatDate(appt.scheduledDate, "dd")}</span>
                  <span className="text-[10px] text-muted-foreground">{formatDate(appt.scheduledDate, "MMM")}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Dr. {appt.doctor.firstName} {appt.doctor.lastName}</span>
                    <StatusBadge status={appt.status} />
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">{formatTime(appt.scheduledTime)} · {appt.doctor.specialization}</div>
                </div>
                {appt.status === "COMPLETED" && <Link href="/patient/medical-history"><Button variant="outline" size="sm">View Record</Button></Link>}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
