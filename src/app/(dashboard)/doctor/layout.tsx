import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardLayoutClient } from "@/components/dashboard/layout-client";
export default async function DoctorLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (!["DOCTOR","SUPER_ADMIN"].includes(session.user.role)) redirect("/patient/dashboard");
  const count = await prisma.notification.count({ where: { userId: session.user.id, isRead: false } });
  return <DashboardLayoutClient user={session.user} notificationCount={count}>{children}</DashboardLayoutClient>;
}
