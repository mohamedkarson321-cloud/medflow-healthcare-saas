import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow, isToday, isYesterday } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─── ID Generators ────────────────────────────────────────────────────────────
export function generatePatientNumber(): string {
  const num = Math.floor(100000 + Math.random() * 900000);
  return `P-${num}`;
}

export function generateAppointmentNumber(): string {
  const num = Math.floor(100000 + Math.random() * 900000);
  return `A-${num}`;
}

export function generateInvoiceNumber(): string {
  const num = Math.floor(100000 + Math.random() * 900000);
  return `INV-${num}`;
}

export function generatePrescriptionNumber(): string {
  const num = Math.floor(100000 + Math.random() * 900000);
  return `RX-${num}`;
}

export function generateLabRequestNumber(): string {
  const num = Math.floor(100000 + Math.random() * 900000);
  return `LR-${num}`;
}

export function generatePaymentNumber(): string {
  const num = Math.floor(100000 + Math.random() * 900000);
  return `PAY-${num}`;
}

export function generateEmployeeNumber(prefix: "D" | "S"): string {
  const num = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}-${num}`;
}

// ─── Formatters ───────────────────────────────────────────────────────────────
export function formatCurrency(
  amount: number,
  currency = "EGP",
  locale = "ar-EG"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(date: Date | string, fmt = "dd MMM yyyy"): string {
  return format(new Date(date), fmt);
}

export function formatTime(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, "0")} ${period}`;
}

export function formatDateTime(date: Date | string): string {
  const d = new Date(date);
  if (isToday(d)) return `Today at ${format(d, "h:mm a")}`;
  if (isYesterday(d)) return `Yesterday at ${format(d, "h:mm a")}`;
  return format(d, "dd MMM yyyy, h:mm a");
}

export function formatRelativeTime(date: Date | string): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function formatAge(dateOfBirth: Date | string): string {
  const dob = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
  return `${age} yrs`;
}

export function formatBloodGroup(bg: string): string {
  return bg
    .replace("_POSITIVE", "+")
    .replace("_NEGATIVE", "-")
    .replace("UNKNOWN", "Unknown");
}

export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 11) {
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
  }
  return phone;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

// ─── String utils ─────────────────────────────────────────────────────────────
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return `${str.slice(0, length)}...`;
}

export function initials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function titleCase(str: string): string {
  return str.replace(/\b\w/g, (c) => c.toUpperCase());
}

// ─── Validation helpers ───────────────────────────────────────────────────────
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPhone(phone: string): boolean {
  return /^(\+?20|0)?1[0125][0-9]{8}$/.test(phone.replace(/\s/g, ""));
}

// ─── BMI Calculator ───────────────────────────────────────────────────────────
export function calculateBMI(
  weightKg: number,
  heightCm: number
): { bmi: number; category: string } {
  const heightM = heightCm / 100;
  const bmi = parseFloat((weightKg / (heightM * heightM)).toFixed(1));
  let category = "Normal";
  if (bmi < 18.5) category = "Underweight";
  else if (bmi < 25) category = "Normal";
  else if (bmi < 30) category = "Overweight";
  else category = "Obese";
  return { bmi, category };
}

// ─── Color utilities ──────────────────────────────────────────────────────────
export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    // Appointment
    SCHEDULED: "blue",
    CONFIRMED: "teal",
    CHECKED_IN: "purple",
    IN_PROGRESS: "orange",
    COMPLETED: "green",
    CANCELLED: "red",
    NO_SHOW: "gray",
    RESCHEDULED: "yellow",
    WAITING: "amber",
    // Invoice
    DRAFT: "gray",
    SENT: "blue",
    PAID: "green",
    PARTIAL: "yellow",
    OVERDUE: "red",
    REFUNDED: "purple",
    // Lab
    REQUESTED: "blue",
    SAMPLE_COLLECTED: "purple",
    IN_PROGRESS: "orange",
    // Prescription
    ACTIVE: "green",
    EXPIRED: "red",
    ON_HOLD: "yellow",
  };
  return map[status] ?? "gray";
}

export function getRoleColor(role: string): string {
  const map: Record<string, string> = {
    SUPER_ADMIN: "red",
    CLINIC_ADMIN: "purple",
    DOCTOR: "blue",
    NURSE: "teal",
    RECEPTIONIST: "green",
    PATIENT: "gray",
  };
  return map[role] ?? "gray";
}

// ─── Array utils ──────────────────────────────────────────────────────────────
export function groupBy<T>(arr: T[], key: keyof T): Record<string, T[]> {
  return arr.reduce(
    (acc, item) => {
      const group = String(item[key]);
      if (!acc[group]) acc[group] = [];
      acc[group].push(item);
      return acc;
    },
    {} as Record<string, T[]>
  );
}

export function sortBy<T>(arr: T[], key: keyof T, order: "asc" | "desc" = "asc"): T[] {
  return [...arr].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    if (aVal < bVal) return order === "asc" ? -1 : 1;
    if (aVal > bVal) return order === "asc" ? 1 : -1;
    return 0;
  });
}

// ─── Time slot generator ──────────────────────────────────────────────────────
export function generateTimeSlots(
  startTime: string,
  endTime: string,
  intervalMinutes: number,
  breakStart?: string,
  breakEnd?: string
): string[] {
  const slots: string[] = [];
  const [startH, startM] = startTime.split(":").map(Number);
  const [endH, endM] = endTime.split(":").map(Number);

  let current = startH * 60 + startM;
  const end = endH * 60 + endM;

  const breakStartMin = breakStart
    ? Number(breakStart.split(":")[0]) * 60 + Number(breakStart.split(":")[1])
    : null;
  const breakEndMin = breakEnd
    ? Number(breakEnd.split(":")[0]) * 60 + Number(breakEnd.split(":")[1])
    : null;

  while (current + intervalMinutes <= end) {
    const inBreak =
      breakStartMin !== null &&
      breakEndMin !== null &&
      current >= breakStartMin &&
      current < breakEndMin;

    if (!inBreak) {
      const h = Math.floor(current / 60);
      const m = current % 60;
      slots.push(`${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`);
    }
    current += intervalMinutes;
  }

  return slots;
}

// ─── Error handler ────────────────────────────────────────────────────────────
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "An unexpected error occurred";
}

// ─── Debounce ─────────────────────────────────────────────────────────────────
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  ms: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), ms);
  };
}
