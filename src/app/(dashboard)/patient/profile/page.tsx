import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { User, Phone, Mail, MapPin, Heart, Shield, Edit } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared";
import { formatDate, formatAge, formatBloodGroup } from "@/lib/utils";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "My Profile — MedFlow" };
export default async function PatientProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const patient = await prisma.patient.findUnique({
    where: { userId: session.user.id },
    include: { allergies: true, chronicConditions: true, vaccinations: true },
  });
  if (!patient) redirect("/login");
  const sections = [
    {
      title: "Personal Information", icon: User,
      fields: [
        { label: "Full Name", value: `${patient.firstName} ${patient.lastName}` },
        { label: "Patient ID", value: patient.patientNumber },
        { label: "Date of Birth", value: `${formatDate(patient.dateOfBirth)} (${formatAge(patient.dateOfBirth)})` },
        { label: "Gender", value: patient.gender.replace(/_/g, " ") },
        { label: "Nationality", value: patient.nationality ?? "—" },
        { label: "National ID", value: patient.nationalId ?? "—" },
      ],
    },
    {
      title: "Contact Information", icon: Phone,
      fields: [
        { label: "Phone", value: patient.phone },
        { label: "Email", value: patient.email ?? "—" },
        { label: "Address", value: patient.address ?? "—" },
        { label: "City", value: patient.city ?? "—" },
        { label: "Country", value: patient.country ?? "—" },
      ],
    },
    {
      title: "Medical Information", icon: Heart,
      fields: [
        { label: "Blood Group", value: formatBloodGroup(patient.bloodGroup) },
        { label: "Height", value: patient.height ? `${patient.height} cm` : "—" },
        { label: "Weight", value: patient.weight ? `${patient.weight} kg` : "—" },
        { label: "BMI", value: patient.bmi ? patient.bmi.toFixed(1) : "—" },
      ],
    },
    {
      title: "Emergency Contact", icon: Shield,
      fields: [
        { label: "Name", value: patient.emergencyName ?? "—" },
        { label: "Phone", value: patient.emergencyPhone ?? "—" },
        { label: "Relationship", value: patient.emergencyRelation ?? "—" },
      ],
    },
    {
      title: "Insurance", icon: Shield,
      fields: [
        { label: "Provider", value: patient.insuranceProvider ?? "—" },
        { label: "Policy Number", value: patient.insuranceNumber ?? "—" },
        { label: "Expiry", value: patient.insuranceExpiry ? formatDate(patient.insuranceExpiry) : "—" },
      ],
    },
  ];
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="My Profile"
        description="Manage your personal and medical information."
        actions={<Button leftIcon={<Edit className="h-4 w-4" />} variant="outline">Edit Profile</Button>}
      />
      <div className="flex items-center gap-4 rounded-2xl border bg-gradient-to-r from-brand-50 to-teal-50 dark:from-brand-950/30 dark:to-teal-950/30 p-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-2xl font-bold text-white shadow-lg">
          {patient.firstName[0]}{patient.lastName[0]}
        </div>
        <div>
          <h2 className="text-xl font-bold">{patient.firstName} {patient.lastName}</h2>
          <p className="text-sm text-muted-foreground">{patient.patientNumber} · {patient.gender.replace(/_/g, " ")} · {formatAge(patient.dateOfBirth)}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {patient.bloodGroup !== "UNKNOWN" && <span className="rounded-full border border-red-200 bg-red-50 px-3 py-0.5 text-xs font-semibold text-red-700 dark:bg-red-950 dark:text-red-400">🩸 {formatBloodGroup(patient.bloodGroup)}</span>}
            {patient.allergies.length > 0 && <span className="rounded-full border border-orange-200 bg-orange-50 px-3 py-0.5 text-xs font-semibold text-orange-700 dark:bg-orange-950 dark:text-orange-400">⚠ {patient.allergies.length} Allerg{patient.allergies.length !== 1 ? "ies" : "y"}</span>}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {sections.map((section) => (
          <Card key={section.title}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <section.icon className="h-4 w-4 text-primary" />
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <dl className="space-y-3">
                {section.fields.map((f) => (
                  <div key={f.label} className="flex justify-between gap-4 text-sm">
                    <dt className="text-muted-foreground shrink-0">{f.label}</dt>
                    <dd className="font-medium text-right truncate">{f.value}</dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>
        ))}
        {patient.allergies.length > 0 && (
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-sm">⚠ Allergies</CardTitle></CardHeader>
            <CardContent className="pt-0 flex flex-wrap gap-2">
              {patient.allergies.map((a) => (
                <span key={a.id} className="rounded-full border border-orange-200 bg-orange-50 dark:bg-orange-950/40 px-3 py-1 text-xs font-medium text-orange-800 dark:text-orange-300">
                  {a.allergen}{a.severity && ` (${a.severity})`}
                </span>
              ))}
            </CardContent>
          </Card>
        )}
        {patient.chronicConditions.length > 0 && (
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-sm">Chronic Conditions</CardTitle></CardHeader>
            <CardContent className="pt-0 space-y-2">
              {patient.chronicConditions.map((c) => (
                <div key={c.id} className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2 text-sm">
                  <span className="font-medium">{c.condition}</span>
                  {c.status && <span className="text-xs text-muted-foreground">{c.status}</span>}
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
