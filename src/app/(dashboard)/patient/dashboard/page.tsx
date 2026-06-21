import { InvoiceStatus } from "@prisma/client";
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  Calendar, FileText, Pill, FlaskConical, CreditCard,
  Clock, ArrowRight, AlertCircle, CheckCircle2, User,
  Activity, Heart,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge, PageHeader } from "@/components/shared";
import { formatDate, formatTime, formatCurrency } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "My Dashboard — MedFlow" };

async function getPatientDashboardData(userId: string) {
  const patient = await prisma.patient.findUnique({
    where: { userId },
    include: {
      appointments: {
        where: {
          scheduledDate: { gte: new Date() },
          status: { notIn: ["CANCELLED", "COMPLETED"] },
        },
        include: { doctor: true },
        orderBy: { scheduledDate: "asc" },
        take: 5,
      },
      prescriptions: {
        where: { status: "ACTIVE" },
        include: { doctor: true, medications: true },
        orderBy: { createdAt: "desc" },
        take: 3,
      },
      invoices: {
        where: { status: { in: ["PENDING", "PARTIAL", "OVERDUE", "SENT"] as any } },
        orderBy: { createdAt: "desc" },
        take: 3,
      },
      labRequests: {
        where: { status: "COMPLETED" },
        orderBy: { createdAt: "desc" },
        take: 3,
      },
    },
  });

  if (!patient) return null;

  const [totalAppointments, completedAppointments, totalInvoices] =
    await Promise.all([
      prisma.appointment.count({ where: { patientId: patient.id } }),
      prisma.appointment.count({ where: { patientId: patient.id, status: "COMPLETED" } }),
      prisma.invoice.aggregate({
        where: { patientId: patient.id, status: "PAID" },
        _sum: { total: true },
      }),
    ]);

  return { patient, totalAppointments, completedAppointments, totalInvoices };
}

export default async function PatientDashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const data = await getPatientDashboardData(session.user.id);
  if (!data) redirect("/login");

  const { patient, totalAppointments, completedAppointments, totalInvoices } = data;

  const statCards = [
    {
      title: "Upcoming Appointments",
      value: patient.appointments.length,
      icon: Calendar,
      color: "bg-blue-50 text-blue-600 dark:bg-blue-950/50",
      href: "/patient/appointments",
    },
    {
      title: "Active Prescriptions",
      value: patient.prescriptions.length,
      icon: Pill,
      color: "bg-green-50 text-green-600 dark:bg-green-950/50",
      href: "/patient/prescriptions",
    },
    {
      title: "Lab Results Ready",
      value: patient.labRequests.length,
      icon: FlaskConical,
      color: "bg-purple-50 text-purple-600 dark:bg-purple-950/50",
      href: "/patient/lab-results",
    },
    {
      title: "Pending Payments",
      value: patient.invoices.length,
      icon: CreditCard,
      color: "bg-orange-50 text-orange-600 dark:bg-orange-950/50",
      href: "/patient/payments",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title={`Welcome back, ${patient.firstName}! 👋`}
        description="Here's an overview of your health journey."
        actions={
          <Link href="/book-appointment">
            <Button leftIcon={<Calendar className="h-4 w-4" />}>
              Book Appointment
            </Button>
          </Link>
        }
      />

      {/* Health summary banner */}
      {patient.bloodGroup !== "UNKNOWN" && (
        <div className="flex flex-wrap items-center gap-4 rounded-xl border bg-gradient-to-r from-brand-50 to-teal-50 dark:from-brand-950/30 dark:to-teal-950/30 p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <Heart className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold">Health Profile</div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
              <span className="text-xs text-muted-foreground">
                Blood Group: <strong className="text-foreground">{patient.bloodGroup.replace("_", " ").replace("POSITIVE", "+").replace("NEGATIVE", "-")}</strong>
              </span>
              {patient.height && (
                <span className="text-xs text-muted-foreground">
                  Height: <strong className="text-foreground">{patient.height} cm</strong>
                </span>
              )}
              {patient.weight && (
                <span className="text-xs text-muted-foreground">
                  Weight: <strong className="text-foreground">{patient.weight} kg</strong>
                </span>
              )}
            </div>
          </div>
          <Link href="/patient/profile">
            <Button variant="outline" size="sm">Update Profile</Button>
          </Link>
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Link key={stat.title} href={stat.href} className="group">
            <div className="stat-card h-full hover:border-primary/30 transition-colors">
              <div className={cn("stat-card-icon", stat.color)}>
                <stat.icon className="h-6 w-6" />
              </div>
              <p className="stat-value text-2xl">{stat.value}</p>
              <p className="stat-label text-xs">{stat.title}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Upcoming Appointments */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base">Upcoming Appointments</CardTitle>
              <Link href="/patient/appointments">
                <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="h-3.5 w-3.5" />}>
                  View All
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              {patient.appointments.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-12 text-center">
                  <Calendar className="h-10 w-10 text-muted-foreground/40" />
                  <p className="text-sm font-medium">No upcoming appointments</p>
                  <p className="text-xs text-muted-foreground">Book an appointment with one of our doctors</p>
                  <Link href="/book-appointment" className="mt-2">
                    <Button size="sm">Book Now</Button>
                  </Link>
                </div>
              ) : (
                <div className="divide-y">
                  {patient.appointments.map((appt) => (
                    <div key={appt.id} className="flex items-start gap-4 p-4 hover:bg-muted/30 transition-colors">
                      <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <span className="text-xs font-bold leading-none">
                          {formatDate(appt.scheduledDate, "dd")}
                        </span>
                        <span className="text-[10px] font-medium leading-none mt-0.5">
                          {formatDate(appt.scheduledDate, "MMM")}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-semibold truncate">
                            Dr. {appt.doctor.firstName} {appt.doctor.lastName}
                          </span>
                          <StatusBadge status={appt.status} />
                        </div>
                        <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatTime(appt.scheduledTime)}
                          </span>
                          <span>{appt.type.replace(/_/g, " ")}</span>
                          {appt.reason && <span className="truncate">• {appt.reason}</span>}
                        </div>
                      </div>
                      <Link href={`/patient/appointments/${appt.id}`}>
                        <Button variant="ghost" size="icon-sm">
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2 pt-0">
              {[
                { icon: Calendar, label: "Book Appt", href: "/book-appointment", color: "text-blue-600 bg-blue-50" },
                { icon: FileText, label: "My Records", href: "/patient/medical-history", color: "text-teal-600 bg-teal-50" },
                { icon: Pill, label: "Medications", href: "/patient/prescriptions", color: "text-green-600 bg-green-50" },
                { icon: FlaskConical, label: "Lab Results", href: "/patient/lab-results", color: "text-purple-600 bg-purple-50" },
              ].map((action) => (
                <Link key={action.label} href={action.href}>
                  <div className="flex flex-col items-center gap-2 rounded-xl border bg-card p-3 text-center hover:border-primary/30 hover:bg-muted/30 transition-all cursor-pointer">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${action.color}`}>
                      <action.icon className="h-4.5 w-4.5" style={{ height: "18px", width: "18px" }} />
                    </div>
                    <span className="text-xs font-medium">{action.label}</span>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>

          {/* Active Prescriptions */}
          {patient.prescriptions.length > 0 && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-base">Active Medications</CardTitle>
                <Link href="/patient/prescriptions">
                  <Button variant="ghost" size="sm" className="text-xs">View All</Button>
                </Link>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                {patient.prescriptions.slice(0, 2).map((rx) => (
                  <div key={rx.id} className="rounded-xl border bg-muted/30 p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Pill className="h-3.5 w-3.5 text-primary" />
                      <span className="text-xs font-semibold truncate">
                        Rx #{rx.prescriptionNumber}
                      </span>
                    </div>
                    <div className="space-y-1">
                      {rx.medications.slice(0, 2).map((med) => (
                        <div key={med.id} className="text-xs text-muted-foreground truncate">
                          • {med.name} — {med.dosage} {med.frequency}
                        </div>
                      ))}
                      {rx.medications.length > 2 && (
                        <div className="text-xs text-muted-foreground">
                          +{rx.medications.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Outstanding Payments */}
          {patient.invoices.length > 0 && (
            <Card className="border-orange-200 bg-orange-50/50 dark:border-orange-800/50 dark:bg-orange-950/20">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base text-orange-700 dark:text-orange-400">
                  <AlertCircle className="h-4 w-4" />
                  Outstanding Payments
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                {patient.invoices.slice(0, 2).map((inv) => (
                  <div key={inv.id} className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold">{inv.invoiceNumber}</div>
                      <div className="text-xs text-muted-foreground">Due {inv.dueDate ? formatDate(inv.dueDate) : "Soon"}</div>
                    </div>
                    <span className="text-sm font-bold text-orange-700">
                      EGP {inv.total.toFixed(0)}
                    </span>
                  </div>
                ))}
                <Link href="/patient/payments">
                  <Button size="sm" className="w-full mt-2" variant="soft-warning">
                    Pay Now
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Health stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Total Visits", value: totalAppointments, icon: "🏥" },
          { label: "Completed", value: completedAppointments, icon: "✅" },
          { label: "Doctors Seen", value: "6", icon: "👨‍⚕️" },
          { label: "Total Paid", value: `EGP ${(totalInvoices._sum.total ?? 0).toFixed(0)}`, icon: "💳" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border bg-card p-4 text-center shadow-card">
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className="text-xl font-bold">{s.value}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}
