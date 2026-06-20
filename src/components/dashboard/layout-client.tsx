"use client";

import { useState } from "react";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import type { UserRole } from "@prisma/client";

interface DashboardLayoutClientProps {
  children: React.ReactNode;
  user: { name?: string | null; email?: string | null; role: UserRole };
  notificationCount?: number;
}

export function DashboardLayoutClient({ children, user, notificationCount }: DashboardLayoutClientProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <DashboardSidebar
        role={user.role}
        user={user}
        collapsed={collapsed}
        onCollapsedChange={setCollapsed}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <DashboardTopbar
          user={user}
          onMobileMenuOpen={() => setMobileOpen(true)}
          notificationCount={notificationCount}
        />
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
