"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard, Calendar, Users, User, FileText, Pill, FlaskConical,
  CreditCard, Bell, MessageSquare, FolderOpen, Clock, Stethoscope,
  BarChart3, Settings, LogOut, ChevronLeft, ChevronRight, UserPlus,
  CheckSquare, ListOrdered, Receipt, Package, DoorOpen, Layers,
  FileBarChart, Activity, UserCog, X, Menu, Brain, Heart,
} from "lucide-react";
import { cn, initials } from "@/lib/utils";
import type { UserRole } from "@prisma/client";

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard, Calendar, Users, User, FileText, Pill, FlaskConical,
  CreditCard, Bell, MessageSquare, FolderOpen, Clock, Stethoscope,
  BarChart3, Settings, UserPlus, CheckSquare, ListOrdered, Receipt,
  Package, DoorOpen, Layers, FileBarChart, Activity, UserCog,
};

interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: number;
}

const navByRole: Record<UserRole, NavItem[]> = {
  PATIENT: [
    { label: "Dashboard", href: "/patient/dashboard", icon: "LayoutDashboard" },
    { label: "Appointments", href: "/patient/appointments", icon: "Calendar" },
    { label: "Medical Records", href: "/patient/medical-history", icon: "FileText" },
    { label: "Prescriptions", href: "/patient/prescriptions", icon: "Pill" },
    { label: "Lab Results", href: "/patient/lab-results", icon: "FlaskConical" },
    { label: "Payments", href: "/patient/payments", icon: "CreditCard" },
    { label: "Documents", href: "/patient/documents", icon: "FolderOpen" },
    { label: "Messages", href: "/patient/messages", icon: "MessageSquare" },
    { label: "Notifications", href: "/patient/notifications", icon: "Bell" },
    { label: "My Profile", href: "/patient/profile", icon: "User" },
  ],
  DOCTOR: [
    { label: "Dashboard", href: "/doctor/dashboard", icon: "LayoutDashboard" },
    { label: "My Schedule", href: "/doctor/schedule", icon: "Clock" },
    { label: "Appointments", href: "/doctor/appointments", icon: "Calendar" },
    { label: "Patients", href: "/doctor/patients", icon: "Users" },
    { label: "Prescriptions", href: "/doctor/prescriptions", icon: "Pill" },
    { label: "Medical Notes", href: "/doctor/notes", icon: "FileText" },
    { label: "Lab Requests", href: "/doctor/lab-requests", icon: "FlaskConical" },
    { label: "Calendar", href: "/doctor/calendar", icon: "Calendar" },
    { label: "Reports", href: "/doctor/reports", icon: "BarChart3" },
  ],
  RECEPTIONIST: [
    { label: "Dashboard", href: "/reception/dashboard", icon: "LayoutDashboard" },
    { label: "Appointments", href: "/reception/appointments", icon: "Calendar" },
    { label: "Register Patient", href: "/reception/patients", icon: "UserPlus" },
    { label: "Check-In", href: "/reception/check-in", icon: "CheckSquare" },
    { label: "Queue", href: "/reception/queue", icon: "ListOrdered" },
    { label: "Invoices", href: "/reception/invoices", icon: "Receipt" },
    { label: "Payments", href: "/reception/payments", icon: "CreditCard" },
  ],
  NURSE: [
    { label: "Dashboard", href: "/reception/dashboard", icon: "LayoutDashboard" },
    { label: "Appointments", href: "/reception/appointments", icon: "Calendar" },
    { label: "Queue", href: "/reception/queue", icon: "ListOrdered" },
    { label: "Patients", href: "/doctor/patients", icon: "Users" },
  ],
  CLINIC_ADMIN: [
    { label: "Dashboard", href: "/admin/dashboard", icon: "LayoutDashboard" },
    { label: "Analytics", href: "/admin/analytics", icon: "BarChart3" },
    { label: "Doctors", href: "/admin/doctors", icon: "Stethoscope" },
    { label: "Staff", href: "/admin/staff", icon: "Users" },
    { label: "Rooms", href: "/admin/rooms", icon: "DoorOpen" },
    { label: "Services", href: "/admin/services", icon: "Layers" },
    { label: "Inventory", href: "/admin/inventory", icon: "Package" },
    { label: "Reports", href: "/admin/reports", icon: "FileBarChart" },
    { label: "Settings", href: "/admin/settings", icon: "Settings" },
  ],
  SUPER_ADMIN: [
    { label: "Dashboard", href: "/admin/dashboard", icon: "LayoutDashboard" },
    { label: "Analytics", href: "/admin/analytics", icon: "BarChart3" },
    { label: "Doctors", href: "/admin/doctors", icon: "Stethoscope" },
    { label: "Staff", href: "/admin/staff", icon: "Users" },
    { label: "Rooms", href: "/admin/rooms", icon: "DoorOpen" },
    { label: "Services", href: "/admin/services", icon: "Layers" },
    { label: "Inventory", href: "/admin/inventory", icon: "Package" },
    { label: "Reports", href: "/admin/reports", icon: "FileBarChart" },
    { label: "Settings", href: "/admin/settings", icon: "Settings" },
  ],
};

interface DashboardSidebarProps {
  role: UserRole;
  user: { name?: string | null; email?: string | null; image?: string | null };
  collapsed?: boolean;
  onCollapsedChange?: (v: boolean) => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function DashboardSidebar({
  role, user, collapsed = false, onCollapsedChange,
  mobileOpen = false, onMobileClose,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const navItems = navByRole[role] ?? [];
  const userInitials = initials(user.name ?? user.email ?? "U");

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + "/");
  }

  const SidebarContent = () => (
    <div className="flex h-full flex-col" style={{ background: "hsl(var(--sidebar-background))" }}>
      {/* Logo */}
      <div className={cn(
        "flex h-16 items-center border-b px-4 shrink-0",
        "border-[hsl(var(--sidebar-border))]"
      )}>
        <Link href="/" className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-white">
            <Stethoscope className="h-4 w-4" />
          </div>
          {!collapsed && (
            <span className="text-base font-bold text-white truncate">
              Med<span className="text-primary">Flow</span>
            </span>
          )}
        </Link>
        {!collapsed && onCollapsedChange && (
          <button
            onClick={() => onCollapsedChange(true)}
            className="ml-auto text-[hsl(var(--sidebar-foreground))] hover:text-white transition-colors p-1 rounded"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}
        {collapsed && onCollapsedChange && (
          <button
            onClick={() => onCollapsedChange(false)}
            className="ml-auto text-[hsl(var(--sidebar-foreground))] hover:text-white transition-colors p-1 rounded"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
        {onMobileClose && (
          <button onClick={onMobileClose} className="ml-auto text-[hsl(var(--sidebar-foreground))] hover:text-white p-1 rounded lg:hidden">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
        {navItems.map((item) => {
          const Icon = iconMap[item.icon] ?? LayoutDashboard;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onMobileClose}
              className={cn(
                "sidebar-nav-item",
                active && "active",
                collapsed && "justify-center px-2"
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon className={cn("h-4.5 w-4.5 shrink-0", active ? "text-[hsl(var(--sidebar-primary))]" : "")} style={{ height: "18px", width: "18px" }} />
              {!collapsed && (
                <span className="flex-1 truncate">{item.label}</span>
              )}
              {!collapsed && item.badge ? (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-bold text-white">
                  {item.badge}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className={cn("shrink-0 border-t p-3", "border-[hsl(var(--sidebar-border))]")}>
        <Link
          href={role === "PATIENT" ? "/patient/profile" : "/admin/settings"}
          className={cn(
            "flex items-center rounded-lg p-2 transition-colors hover:bg-[hsl(var(--sidebar-accent))]",
            collapsed ? "justify-center" : "gap-3"
          )}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-xs font-bold text-white">
            {userInitials}
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium text-white">{user.name ?? "User"}</div>
              <div className="truncate text-xs text-[hsl(var(--sidebar-foreground))]">{user.email}</div>
            </div>
          )}
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className={cn(
            "mt-1 flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm transition-colors",
            "text-[hsl(var(--sidebar-foreground))] hover:bg-red-900/30 hover:text-red-400",
            collapsed && "justify-center"
          )}
          title={collapsed ? "Sign Out" : undefined}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col shrink-0 h-screen sticky top-0 transition-all duration-300",
          collapsed ? "w-16" : "w-64"
        )}
      >
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={onMobileClose}
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-72 lg:hidden">
            <SidebarContent />
          </aside>
        </>
      )}
    </>
  );
}
