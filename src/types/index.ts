import type {
  User, Patient, Doctor, Staff, Clinic, Appointment,
  MedicalRecord, Prescription, LabRequest, Invoice,
  Payment, Notification, Department, Service, Room,
  Diagnosis, PrescriptionMedication, LabResult,
} from "@prisma/client";

// ─── Re-exports with relations ────────────────────────────────────────────────
export type PatientWithUser = Patient & { user?: User | null };

export type DoctorWithDetails = Doctor & {
  user: User;
  department?: Department | null;
  clinic?: Clinic;
};

export type AppointmentWithDetails = Appointment & {
  patient: Patient;
  doctor: DoctorWithDetails;
  room?: Room | null;
};

export type MedicalRecordWithDetails = MedicalRecord & {
  patient: Patient;
  doctor: DoctorWithDetails;
  diagnoses: Diagnosis[];
  prescriptions: Prescription[];
};

export type PrescriptionWithDetails = Prescription & {
  patient: Patient;
  doctor: DoctorWithDetails;
  medications: PrescriptionMedication[];
};

export type InvoiceWithDetails = Invoice & {
  patient: Patient;
  appointment?: Appointment | null;
  items: Array<{ id: string; description: string; quantity: number; unitPrice: number; total: number }>;
  payments: Payment[];
};

export type LabRequestWithDetails = LabRequest & {
  patient: Patient;
  doctor: DoctorWithDetails;
  results: LabResult[];
};

// ─── Dashboard Stats ──────────────────────────────────────────────────────────
export interface DashboardStats {
  todayAppointments: number;
  totalPatients: number;
  monthlyRevenue: number;
  pendingInvoices: number;
  appointmentChange: number;
  patientChange: number;
  revenueChange: number;
  completionRate: number;
}

export interface AdminStats extends DashboardStats {
  totalDoctors: number;
  totalStaff: number;
  activeRooms: number;
  lowStockItems: number;
}

export interface DoctorStats {
  todayAppointments: number;
  totalPatients: number;
  completedToday: number;
  pendingToday: number;
  avgRating: number;
  totalReviews: number;
}

export interface ReceptionStats {
  checkedInToday: number;
  waitingCount: number;
  scheduledToday: number;
  noShowToday: number;
  pendingPayments: number;
}

// ─── Chart data types ─────────────────────────────────────────────────────────
export interface RevenueChartData {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}

export interface AppointmentChartData {
  date: string;
  total: number;
  completed: number;
  cancelled: number;
  noShow: number;
}

export interface PatientGrowthData {
  month: string;
  newPatients: number;
  returning: number;
}

export interface DepartmentData {
  name: string;
  appointments: number;
  revenue: number;
  color: string;
}

// ─── Action results ───────────────────────────────────────────────────────────
export type ActionResult<T = null> =
  | { success: true; data: T; message?: string }
  | { success: false; error: string };

// ─── Pagination ───────────────────────────────────────────────────────────────
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ─── Filter types ─────────────────────────────────────────────────────────────
export interface AppointmentFilters {
  status?: string;
  doctorId?: string;
  date?: string;
  type?: string;
}

export interface PatientFilters {
  bloodGroup?: string;
  gender?: string;
  isActive?: boolean;
}

export interface InvoiceFilters {
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}

// ─── Notification types ───────────────────────────────────────────────────────
export type NotificationWithMeta = Notification & {
  meta?: {
    appointmentId?: string;
    patientId?: string;
    invoiceId?: string;
  };
};

// ─── Calendar types ───────────────────────────────────────────────────────────
export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: string;
  status: string;
  patientName?: string;
  doctorName?: string;
  color?: string;
}

// ─── Working hours ────────────────────────────────────────────────────────────
export interface WorkingHourSlot {
  dayOfWeek: number;
  dayName: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
  breakStart?: string;
  breakEnd?: string;
}

export const DAY_NAMES = [
  "Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday",
] as const;

// ─── Role permissions ─────────────────────────────────────────────────────────
export type Permission =
  | "patients:read" | "patients:write" | "patients:delete"
  | "appointments:read" | "appointments:write" | "appointments:delete"
  | "medical_records:read" | "medical_records:write"
  | "prescriptions:read" | "prescriptions:write"
  | "lab:read" | "lab:write"
  | "billing:read" | "billing:write"
  | "inventory:read" | "inventory:write"
  | "staff:read" | "staff:write"
  | "reports:read"
  | "settings:read" | "settings:write"
  | "analytics:read";

export const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  SUPER_ADMIN: [
    "patients:read","patients:write","patients:delete",
    "appointments:read","appointments:write","appointments:delete",
    "medical_records:read","medical_records:write",
    "prescriptions:read","prescriptions:write",
    "lab:read","lab:write",
    "billing:read","billing:write",
    "inventory:read","inventory:write",
    "staff:read","staff:write",
    "reports:read","settings:read","settings:write","analytics:read",
  ],
  CLINIC_ADMIN: [
    "patients:read","patients:write",
    "appointments:read","appointments:write",
    "medical_records:read",
    "billing:read","billing:write",
    "inventory:read","inventory:write",
    "staff:read","staff:write",
    "reports:read","settings:read","settings:write","analytics:read",
  ],
  DOCTOR: [
    "patients:read","appointments:read","appointments:write",
    "medical_records:read","medical_records:write",
    "prescriptions:read","prescriptions:write",
    "lab:read","lab:write","reports:read",
  ],
  NURSE: [
    "patients:read","appointments:read",
    "medical_records:read","lab:read","lab:write",
  ],
  RECEPTIONIST: [
    "patients:read","patients:write",
    "appointments:read","appointments:write","appointments:delete",
    "billing:read","billing:write",
  ],
  PATIENT: [],
};
