import { z } from "zod";

// ─── Patient ──────────────────────────────────────────────────────────────────
export const patientSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.enum(["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"]),
  phone: z.string().min(10, "Valid phone number required"),
  email: z.string().email().optional().or(z.literal("")),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  nationality: z.string().optional(),
  nationalId: z.string().optional(),
  bloodGroup: z
    .enum([
      "A_POSITIVE","A_NEGATIVE","B_POSITIVE","B_NEGATIVE",
      "O_POSITIVE","O_NEGATIVE","AB_POSITIVE","AB_NEGATIVE","UNKNOWN",
    ])
    .default("UNKNOWN"),
  height: z.coerce.number().positive().optional(),
  weight: z.coerce.number().positive().optional(),
  emergencyName: z.string().optional(),
  emergencyPhone: z.string().optional(),
  emergencyRelation: z.string().optional(),
  insuranceProvider: z.string().optional(),
  insuranceNumber: z.string().optional(),
  notes: z.string().optional(),
});

export const updatePatientSchema = patientSchema.partial();

// ─── Appointment ──────────────────────────────────────────────────────────────
export const appointmentSchema = z.object({
  patientId: z.string().min(1, "Patient is required"),
  doctorId: z.string().min(1, "Doctor is required"),
  scheduledDate: z.string().min(1, "Date is required"),
  scheduledTime: z.string().min(1, "Time is required"),
  type: z
    .enum([
      "IN_PERSON","TELEMEDICINE","FOLLOW_UP","EMERGENCY",
      "CONSULTATION","PROCEDURE","LAB_VISIT","VACCINATION",
    ])
    .default("IN_PERSON"),
  duration: z.coerce.number().default(30),
  roomId: z.string().optional(),
  reason: z.string().optional(),
  chiefComplaint: z.string().optional(),
  notes: z.string().optional(),
});

export const rescheduleSchema = z.object({
  scheduledDate: z.string().min(1, "Date is required"),
  scheduledTime: z.string().min(1, "Time is required"),
  reason: z.string().optional(),
});

export const cancelSchema = z.object({
  reason: z.string().min(1, "Cancellation reason is required"),
});

// ─── Medical Record ───────────────────────────────────────────────────────────
export const medicalRecordSchema = z.object({
  patientId: z.string().min(1),
  appointmentId: z.string().optional(),
  chiefComplaint: z.string().optional(),
  historyOfPresentIllness: z.string().optional(),
  reviewOfSystems: z.string().optional(),
  physicalExamination: z.string().optional(),
  diagnoses: z
    .array(
      z.object({
        icdCode: z.string().optional(),
        name: z.string().min(1, "Diagnosis name required"),
        type: z.enum(["primary", "secondary", "differential"]).default("primary"),
        severity: z.enum(["mild", "moderate", "severe"]).optional(),
        status: z.enum(["active", "resolved", "chronic"]).default("active"),
      })
    )
    .default([]),
  treatmentPlan: z.string().optional(),
  instructions: z.string().optional(),
  doctorNotes: z.string().optional(),
  followUpRequired: z.boolean().default(false),
  followUpInDays: z.coerce.number().optional(),
});

// ─── Prescription ─────────────────────────────────────────────────────────────
export const prescriptionSchema = z.object({
  patientId: z.string().min(1),
  medicalRecordId: z.string().optional(),
  diagnosis: z.string().optional(),
  validUntil: z.string().optional(),
  notes: z.string().optional(),
  medications: z
    .array(
      z.object({
        name: z.string().min(1, "Medication name required"),
        genericName: z.string().optional(),
        strength: z.string().optional(),
        form: z.string().optional(),
        dosage: z.string().min(1, "Dosage required"),
        frequency: z.string().min(1, "Frequency required"),
        route: z.string().optional(),
        duration: z.string().optional(),
        quantity: z.coerce.number().optional(),
        refills: z.coerce.number().default(0),
        instructions: z.string().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
      })
    )
    .min(1, "At least one medication is required"),
});

// ─── Lab Request ──────────────────────────────────────────────────────────────
export const labRequestSchema = z.object({
  patientId: z.string().min(1),
  priority: z.enum(["routine", "urgent", "stat"]).default("routine"),
  clinicalInfo: z.string().optional(),
  scheduledAt: z.string().optional(),
  testIds: z.array(z.string()).min(1, "At least one test is required"),
  notes: z.string().optional(),
});

// ─── Vital Signs ──────────────────────────────────────────────────────────────
export const vitalSignsSchema = z.object({
  temperature: z.coerce.number().min(30).max(45).optional(),
  bloodPressureSystolic: z.coerce.number().min(60).max(250).optional(),
  bloodPressureDiastolic: z.coerce.number().min(40).max(150).optional(),
  heartRate: z.coerce.number().min(30).max(250).optional(),
  respiratoryRate: z.coerce.number().min(5).max(60).optional(),
  oxygenSaturation: z.coerce.number().min(50).max(100).optional(),
  bloodGlucose: z.coerce.number().optional(),
  height: z.coerce.number().optional(),
  weight: z.coerce.number().optional(),
  notes: z.string().optional(),
});

// ─── Invoice ──────────────────────────────────────────────────────────────────
export const invoiceSchema = z.object({
  patientId: z.string().min(1),
  appointmentId: z.string().optional(),
  dueDate: z.string().optional(),
  discountType: z.enum(["percentage", "fixed"]).optional(),
  discountValue: z.coerce.number().default(0),
  taxRate: z.coerce.number().default(0),
  notes: z.string().optional(),
  items: z
    .array(
      z.object({
        serviceId: z.string().optional(),
        description: z.string().min(1, "Description required"),
        quantity: z.coerce.number().min(1).default(1),
        unitPrice: z.coerce.number().min(0),
        discount: z.coerce.number().default(0),
      })
    )
    .min(1, "At least one item is required"),
});

// ─── Payment ──────────────────────────────────────────────────────────────────
export const paymentSchema = z.object({
  invoiceId: z.string().min(1),
  amount: z.coerce.number().positive("Amount must be positive"),
  method: z.enum([
    "CASH","CREDIT_CARD","DEBIT_CARD","INSURANCE",
    "BANK_TRANSFER","ONLINE","CHEQUE","OTHER",
  ]),
  reference: z.string().optional(),
  notes: z.string().optional(),
});

// ─── Service ──────────────────────────────────────────────────────────────────
export const serviceSchema = z.object({
  name: z.string().min(2),
  departmentId: z.string().optional(),
  category: z.enum([
    "CONSULTATION","DIAGNOSTIC","THERAPEUTIC","SURGICAL",
    "PREVENTIVE","REHABILITATION","EMERGENCY","COSMETIC","OTHER",
  ]),
  description: z.string().optional(),
  price: z.coerce.number().min(0),
  insurancePrice: z.coerce.number().optional(),
  duration: z.coerce.number().default(30),
  requiresDoctor: z.boolean().default(true),
});

// ─── Doctor ───────────────────────────────────────────────────────────────────
export const doctorSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  gender: z.enum(["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"]),
  departmentId: z.string().optional(),
  specialization: z.string().min(2),
  subSpecialization: z.string().optional(),
  licenseNumber: z.string().optional(),
  experience: z.coerce.number().optional(),
  consultationFee: z.coerce.number().default(0),
  followUpFee: z.coerce.number().default(0),
  bio: z.string().optional(),
  languages: z.array(z.string()).default(["English"]),
  qualifications: z.array(z.string()).default([]),
});

// ─── Contact Form ─────────────────────────────────────────────────────────────
export const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().optional(),
  subject: z.string().min(2, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export type PatientInput = z.infer<typeof patientSchema>;
export type AppointmentInput = z.infer<typeof appointmentSchema>;
export type MedicalRecordInput = z.infer<typeof medicalRecordSchema>;
export type PrescriptionInput = z.infer<typeof prescriptionSchema>;
export type LabRequestInput = z.infer<typeof labRequestSchema>;
export type VitalSignsInput = z.infer<typeof vitalSignsSchema>;
export type InvoiceInput = z.infer<typeof invoiceSchema>;
export type PaymentInput = z.infer<typeof paymentSchema>;
export type ServiceInput = z.infer<typeof serviceSchema>;
export type DoctorInput = z.infer<typeof doctorSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
