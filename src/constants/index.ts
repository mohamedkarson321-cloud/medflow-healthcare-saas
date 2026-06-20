export const APP_NAME = "MedFlow";
export const APP_TAGLINE = "The Future of Healthcare Management";
export const APP_DESCRIPTION =
  "World-class clinic management platform trusted by leading healthcare providers.";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

// ─── Navigation ───────────────────────────────────────────────────────────────
export const MARKETING_NAV = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Doctors", href: "/doctors" },
  { label: "Departments", href: "/departments" },
  { label: "Pricing", href: "/pricing" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
] as const;

export const PATIENT_NAV = [
  { label: "Dashboard", href: "/patient/dashboard", icon: "LayoutDashboard" },
  { label: "Appointments", href: "/patient/appointments", icon: "Calendar" },
  { label: "Medical Records", href: "/patient/medical-history", icon: "FileText" },
  { label: "Prescriptions", href: "/patient/prescriptions", icon: "Pill" },
  { label: "Lab Results", href: "/patient/lab-results", icon: "FlaskConical" },
  { label: "Payments", href: "/patient/payments", icon: "CreditCard" },
  { label: "Documents", href: "/patient/documents", icon: "FolderOpen" },
  { label: "Messages", href: "/patient/messages", icon: "MessageSquare" },
  { label: "Notifications", href: "/patient/notifications", icon: "Bell" },
  { label: "Profile", href: "/patient/profile", icon: "User" },
] as const;

export const DOCTOR_NAV = [
  { label: "Dashboard", href: "/doctor/dashboard", icon: "LayoutDashboard" },
  { label: "Schedule", href: "/doctor/schedule", icon: "Clock" },
  { label: "Appointments", href: "/doctor/appointments", icon: "Calendar" },
  { label: "Patients", href: "/doctor/patients", icon: "Users" },
  { label: "Prescriptions", href: "/doctor/prescriptions", icon: "Pill" },
  { label: "Medical Notes", href: "/doctor/notes", icon: "FileText" },
  { label: "Lab Requests", href: "/doctor/lab-requests", icon: "FlaskConical" },
  { label: "Calendar", href: "/doctor/calendar", icon: "CalendarDays" },
  { label: "Reports", href: "/doctor/reports", icon: "BarChart3" },
] as const;

export const RECEPTION_NAV = [
  { label: "Dashboard", href: "/reception/dashboard", icon: "LayoutDashboard" },
  { label: "Appointments", href: "/reception/appointments", icon: "Calendar" },
  { label: "Register Patient", href: "/reception/patients", icon: "UserPlus" },
  { label: "Check-In", href: "/reception/check-in", icon: "CheckSquare" },
  { label: "Queue", href: "/reception/queue", icon: "ListOrdered" },
  { label: "Invoices", href: "/reception/invoices", icon: "Receipt" },
  { label: "Payments", href: "/reception/payments", icon: "CreditCard" },
] as const;

export const ADMIN_NAV = [
  { label: "Dashboard", href: "/admin/dashboard", icon: "LayoutDashboard" },
  { label: "Analytics", href: "/admin/analytics", icon: "BarChart3" },
  { label: "Doctors", href: "/admin/doctors", icon: "Stethoscope" },
  { label: "Staff", href: "/admin/staff", icon: "Users" },
  { label: "Rooms", href: "/admin/rooms", icon: "DoorOpen" },
  { label: "Services", href: "/admin/services", icon: "Layers" },
  { label: "Inventory", href: "/admin/inventory", icon: "Package" },
  { label: "Reports", href: "/admin/reports", icon: "FileBarChart" },
  { label: "Settings", href: "/admin/settings", icon: "Settings" },
] as const;

// ─── Appointment ──────────────────────────────────────────────────────────────
export const APPOINTMENT_TYPES = [
  { value: "IN_PERSON", label: "In-Person Visit" },
  { value: "TELEMEDICINE", label: "Telemedicine" },
  { value: "FOLLOW_UP", label: "Follow-Up" },
  { value: "EMERGENCY", label: "Emergency" },
  { value: "CONSULTATION", label: "Consultation" },
  { value: "PROCEDURE", label: "Procedure" },
  { value: "LAB_VISIT", label: "Lab Visit" },
  { value: "VACCINATION", label: "Vaccination" },
] as const;

export const APPOINTMENT_STATUSES = [
  { value: "SCHEDULED", label: "Scheduled", color: "blue" },
  { value: "CONFIRMED", label: "Confirmed", color: "teal" },
  { value: "CHECKED_IN", label: "Checked In", color: "purple" },
  { value: "IN_PROGRESS", label: "In Progress", color: "orange" },
  { value: "COMPLETED", label: "Completed", color: "green" },
  { value: "CANCELLED", label: "Cancelled", color: "red" },
  { value: "NO_SHOW", label: "No Show", color: "gray" },
  { value: "RESCHEDULED", label: "Rescheduled", color: "yellow" },
  { value: "WAITING", label: "Waiting", color: "amber" },
] as const;

// ─── Blood groups ─────────────────────────────────────────────────────────────
export const BLOOD_GROUPS = [
  { value: "A_POSITIVE", label: "A+" },
  { value: "A_NEGATIVE", label: "A-" },
  { value: "B_POSITIVE", label: "B+" },
  { value: "B_NEGATIVE", label: "B-" },
  { value: "O_POSITIVE", label: "O+" },
  { value: "O_NEGATIVE", label: "O-" },
  { value: "AB_POSITIVE", label: "AB+" },
  { value: "AB_NEGATIVE", label: "AB-" },
  { value: "UNKNOWN", label: "Unknown" },
] as const;

// ─── Genders ──────────────────────────────────────────────────────────────────
export const GENDERS = [
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
  { value: "OTHER", label: "Other" },
  { value: "PREFER_NOT_TO_SAY", label: "Prefer not to say" },
] as const;

// ─── Departments (seed data) ──────────────────────────────────────────────────
export const DEFAULT_DEPARTMENTS = [
  { name: "General Medicine", icon: "Stethoscope", color: "#0369a1" },
  { name: "Cardiology", icon: "Heart", color: "#dc2626" },
  { name: "Orthopedics", icon: "Bone", color: "#7c3aed" },
  { name: "Dermatology", icon: "Scan", color: "#ea580c" },
  { name: "Neurology", icon: "Brain", color: "#0d9488" },
  { name: "Ophthalmology", icon: "Eye", color: "#2563eb" },
  { name: "Dentistry", icon: "Smile", color: "#16a34a" },
  { name: "Physiotherapy", icon: "Activity", color: "#ca8a04" },
  { name: "Pediatrics", icon: "Baby", color: "#e879f9" },
  { name: "Gynecology", icon: "Users", color: "#f43f5e" },
  { name: "ENT", icon: "Ear", color: "#6366f1" },
  { name: "Radiology", icon: "Scan", color: "#64748b" },
  { name: "Laboratory", icon: "FlaskConical", color: "#0891b2" },
  { name: "Emergency", icon: "Zap", color: "#ef4444" },
] as const;

// ─── Medication forms ─────────────────────────────────────────────────────────
export const MEDICATION_FORMS = [
  "Tablet","Capsule","Syrup","Suspension","Injection","Cream","Ointment",
  "Gel","Drops","Inhaler","Patch","Suppository","Solution","Powder","Other",
] as const;

export const MEDICATION_ROUTES = [
  "Oral","Intravenous (IV)","Intramuscular (IM)","Subcutaneous","Topical",
  "Inhalation","Sublingual","Rectal","Ophthalmic","Otic","Nasal","Other",
] as const;

export const MEDICATION_FREQUENCIES = [
  "Once daily","Twice daily (BID)","Three times daily (TID)",
  "Four times daily (QID)","Every 4 hours","Every 6 hours","Every 8 hours",
  "Every 12 hours","Every 24 hours","As needed (PRN)","At bedtime (QHS)",
  "With meals","Before meals","After meals","Weekly","Monthly",
] as const;

// ─── Countries ────────────────────────────────────────────────────────────────
export const COUNTRIES = [
  "Egypt","Saudi Arabia","UAE","Kuwait","Qatar","Bahrain","Oman","Jordan",
  "Lebanon","Syria","Iraq","Libya","Tunisia","Morocco","Algeria","Sudan",
  "United States","United Kingdom","Canada","Australia","Germany","France",
] as const;

// ─── Pagination ───────────────────────────────────────────────────────────────
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

// ─── Colors ───────────────────────────────────────────────────────────────────
export const STATUS_COLORS = {
  SCHEDULED: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", dot: "bg-blue-500" },
  CONFIRMED: { bg: "bg-teal-50", text: "text-teal-700", border: "border-teal-200", dot: "bg-teal-500" },
  CHECKED_IN: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200", dot: "bg-purple-500" },
  IN_PROGRESS: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200", dot: "bg-orange-500" },
  COMPLETED: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200", dot: "bg-green-500" },
  CANCELLED: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", dot: "bg-red-500" },
  NO_SHOW: { bg: "bg-gray-50", text: "text-gray-700", border: "border-gray-200", dot: "bg-gray-500" },
  RESCHEDULED: { bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-200", dot: "bg-yellow-500" },
  WAITING: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", dot: "bg-amber-500" },
  // Invoice
  DRAFT: { bg: "bg-gray-50", text: "text-gray-700", border: "border-gray-200", dot: "bg-gray-400" },
  SENT: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", dot: "bg-blue-500" },
  PAID: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200", dot: "bg-green-500" },
  PARTIAL: { bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-200", dot: "bg-yellow-500" },
  OVERDUE: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", dot: "bg-red-500" },
  REFUNDED: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200", dot: "bg-purple-500" },
  ACTIVE: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200", dot: "bg-green-500" },
  EXPIRED: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", dot: "bg-red-500" },
} as const;

// ─── Pricing Plans ────────────────────────────────────────────────────────────
export const PRICING_PLANS = [
  {
    id: "starter",
    name: "Starter",
    price: 299,
    currency: "EGP",
    period: "month",
    description: "Perfect for small clinics getting started",
    color: "blue",
    features: [
      "Up to 3 doctors",
      "Up to 500 patients",
      "Appointment scheduling",
      "Basic EMR",
      "Invoice generation",
      "Email notifications",
      "Patient portal",
      "Mobile responsive",
    ],
    limits: { doctors: 3, patients: 500, storage: "5GB" },
  },
  {
    id: "professional",
    name: "Professional",
    price: 799,
    currency: "EGP",
    period: "month",
    description: "Ideal for growing medical practices",
    color: "brand",
    popular: true,
    features: [
      "Up to 15 doctors",
      "Unlimited patients",
      "Advanced EMR & prescriptions",
      "Lab management",
      "Inventory control",
      "SMS notifications",
      "Analytics dashboard",
      "Multi-department",
      "Custom branding",
      "Priority support",
    ],
    limits: { doctors: 15, patients: -1, storage: "50GB" },
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 1999,
    currency: "EGP",
    period: "month",
    description: "For hospitals and large medical centers",
    color: "purple",
    features: [
      "Unlimited doctors",
      "Unlimited patients",
      "Full EMR suite",
      "Advanced analytics & BI",
      "Insurance management",
      "Multi-branch support",
      "API access",
      "Custom integrations",
      "Dedicated account manager",
      "SLA guarantee",
      "On-premise option",
    ],
    limits: { doctors: -1, patients: -1, storage: "Unlimited" },
  },
] as const;
