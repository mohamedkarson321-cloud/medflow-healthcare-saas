"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import {
  Bell, Search, Moon, Sun, Menu, Settings, User, LogOut,
  HelpCircle, ChevronDown,
} from "lucide-react";
import { useTheme } from "next-themes";
import { cn, initials } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuLabel,
} from "@/components/ui/dropdown";
import type { UserRole } from "@prisma/client";

interface TopbarProps {
  user: { name?: string | null; email?: string | null; role: UserRole };
  onMobileMenuOpen: () => void;
  notificationCount?: number;
  title?: string;
}

export function DashboardTopbar({ user, onMobileMenuOpen, notificationCount = 0, title }: TopbarProps) {
  const { theme, setTheme } = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);
  const userInitials = initials(user.name ?? user.email ?? "U");

  const roleLabel: Record<UserRole, string> = {
    SUPER_ADMIN: "Super Admin",
    CLINIC_ADMIN: "Clinic Admin",
    DOCTOR: "Doctor",
    NURSE: "Nurse",
    RECEPTIONIST: "Receptionist",
    PATIENT: "Patient",
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-background/95 backdrop-blur-sm px-4 sm:px-6">
      {/* Mobile menu button */}
      <button
        onClick={onMobileMenuOpen}
        className="flex items-center justify-center rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground lg:hidden transition-colors"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Page title / breadcrumb */}
      {title && (
        <h2 className="hidden text-sm font-semibold text-foreground sm:block">{title}</h2>
      )}

      <div className="flex flex-1 items-center gap-2">
        {/* Search */}
        <div className="hidden flex-1 max-w-sm sm:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Search patients, appointments..."
              className="flex h-8 w-full rounded-lg border border-input bg-muted/50 pl-8 pr-3 text-sm placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        {/* Search mobile */}
        <button className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors sm:hidden">
          <Search className="h-4 w-4" />
        </button>

        {/* Theme toggle */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </button>

        {/* Notifications */}
        <Link
          href={user.role === "PATIENT" ? "/patient/notifications" : "/admin/dashboard"}
          className="relative flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <Bell className="h-4 w-4" />
          {notificationCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white">
              {notificationCount > 9 ? "9+" : notificationCount}
            </span>
          )}
        </Link>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-lg border bg-muted/30 pl-1 pr-2.5 py-1 text-sm hover:bg-muted transition-colors">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-xs font-bold text-white">
                {userInitials}
              </div>
              <div className="hidden text-left sm:block">
                <div className="text-xs font-medium leading-none truncate max-w-[100px]">{user.name?.split(" ")[0] ?? "User"}</div>
                <div className="text-[10px] text-muted-foreground leading-none mt-0.5">{roleLabel[user.role]}</div>
              </div>
              <ChevronDown className="h-3 w-3 text-muted-foreground hidden sm:block" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <div className="px-2 py-2 border-b mb-1">
              <div className="text-sm font-medium truncate">{user.name}</div>
              <div className="text-xs text-muted-foreground truncate">{user.email}</div>
            </div>
            <DropdownMenuItem asChild>
              <Link href={user.role === "PATIENT" ? "/patient/profile" : "/admin/settings"}>
                <User className="h-4 w-4" /> My Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={user.role === "PATIENT" ? "/patient/profile" : "/admin/settings"}>
                <Settings className="h-4 w-4" /> Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/faq">
                <HelpCircle className="h-4 w-4" /> Help & Support
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              destructive
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              <LogOut className="h-4 w-4" /> Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
