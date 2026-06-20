import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");
  const hashedPassword = await bcrypt.hash("Demo1234", 12);

  const clinic = await prisma.clinic.upsert({
    where: { slug: "medflow-demo" },
    update: {},
    create: {
      name: "MedFlow Demo Clinic", slug: "medflow-demo",
      email: "demo@medflow.health", phone: "+201234567890",
      address: "123 Healthcare Blvd", city: "Cairo", state: "Cairo", country: "Egypt",
      currency: "EGP", settings: { create: {} },
    },
  });

  const dept = await prisma.department.upsert({
    where: { clinicId_name: { clinicId: clinic.id, name: "General Medicine" } },
    update: {}, create: { clinicId: clinic.id, name: "General Medicine", icon: "Stethoscope", color: "#0369a1" },
  });

  // Super Admin
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@medflow.com" }, update: {},
    create: { email: "admin@medflow.com", name: "Admin User", password: hashedPassword, role: "SUPER_ADMIN", emailVerified: new Date() },
  });

  // Doctor
  const doctorUser = await prisma.user.upsert({
    where: { email: "doctor@medflow.com" }, update: {},
    create: { email: "doctor@medflow.com", name: "Dr. Ahmed Hassan", password: hashedPassword, role: "DOCTOR", emailVerified: new Date() },
  });
  await prisma.doctor.upsert({
    where: { userId: doctorUser.id }, update: {},
    create: {
      userId: doctorUser.id, clinicId: clinic.id, departmentId: dept.id,
      employeeNumber: "D-100001", firstName: "Ahmed", lastName: "Hassan",
      gender: "MALE", specialization: "Cardiology", consultationFee: 500,
      experience: 18, languages: ["Arabic", "English"], qualifications: ["MD", "FRCP"],
    },
  });

  // Receptionist
  const recUser = await prisma.user.upsert({
    where: { email: "reception@medflow.com" }, update: {},
    create: { email: "reception@medflow.com", name: "Mona Receptionist", password: hashedPassword, role: "RECEPTIONIST", emailVerified: new Date() },
  });
  await prisma.staff.upsert({
    where: { userId: recUser.id }, update: {},
    create: { userId: recUser.id, clinicId: clinic.id, employeeNumber: "S-100001", firstName: "Mona", lastName: "Ali", gender: "FEMALE", role: "RECEPTIONIST" },
  });

  // Patient
  const patientUser = await prisma.user.upsert({
    where: { email: "patient@medflow.com" }, update: {},
    create: { email: "patient@medflow.com", name: "Sara Mostafa", password: hashedPassword, role: "PATIENT", emailVerified: new Date() },
  });
  await prisma.patient.upsert({
    where: { userId: patientUser.id }, update: {},
    create: {
      userId: patientUser.id, clinicId: clinic.id, patientNumber: "P-100001",
      firstName: "Sara", lastName: "Mostafa", dateOfBirth: new Date("1995-04-12"),
      gender: "FEMALE", phone: "+201111111111", email: "patient@medflow.com", bloodGroup: "O_POSITIVE",
    },
  });

  console.log("✅ Seed completed!");
  console.log("Demo accounts (password: Demo1234):");
  console.log("  Admin: admin@medflow.com");
  console.log("  Doctor: doctor@medflow.com");
  console.log("  Receptionist: reception@medflow.com");
  console.log("  Patient: patient@medflow.com");
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });
