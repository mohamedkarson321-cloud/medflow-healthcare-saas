import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Bell, Calendar, Pill, FlaskConical, CreditCard, MessageSquare, Info, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader, EmptyState } from "@/components/shared";
import { formatRelativeTime } from "@/lib/utils";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Notifications — MedFlow" };
const notifIcon: Record<string, React.ReactNode> = {
  APPOINTMENT_REMINDER: <Calendar className="h-4 w-4 text-blue-600" />,
  APPOINTMENT_CONFIRMATION: <Calendar className="h-4 w-4 text-green-600" />,
  APPOINTMENT_CANCELLATION: <Calendar className="h-4 w-4 text-red-600" />,
  LAB_RESULT_READY: <FlaskConical className="h-4 w-4 text-purple-600" />,
  PRESCRIPTION_READY: <Pill className="h-4 w-4 text-green-600" />,
  PAYMENT_DUE: <CreditCard className="h-4 w-4 text-orange-600" />,
  PAYMENT_RECEIVED: <CreditCard className="h-4 w-4 text-green-600" />,
  MESSAGE_RECEIVED: <MessageSquare className="h-4 w-4 text-teal-600" />,
  GENERAL: <Info className="h-4 w-4 text-gray-500" />,
};
export default async function PatientNotificationsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const notifications = await prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  const unread = notifications.filter((n) => !n.isRead);
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Notifications"
        description={`You have ${unread.length} unread notification${unread.length !== 1 ? "s" : ""}.`}
        actions={unread.length > 0 ? <Button variant="outline" size="sm" leftIcon={<CheckCheck className="h-4 w-4" />}>Mark All Read</Button> : undefined}
      />
      {notifications.length === 0 ? (
        <EmptyState icon={<Bell className="h-7 w-7" />} title="No notifications" description="You're all caught up! Notifications about your appointments, results, and more will appear here." />
      ) : (
        <div className="space-y-1">
          {notifications.map((notif) => (
            <div key={notif.id} className={`flex items-start gap-4 rounded-xl border p-4 transition-colors hover:bg-muted/20 ${!notif.isRead ? "bg-primary/5 border-primary/20" : "bg-card"}`}>
              <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${!notif.isRead ? "bg-primary/10" : "bg-muted"}`}>
                {notifIcon[notif.type] ?? <Bell className="h-4 w-4 text-muted-foreground" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <span className={`text-sm ${!notif.isRead ? "font-semibold" : "font-medium"}`}>{notif.title}</span>
                  {!notif.isRead && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />}
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">{notif.body}</p>
                <p className="mt-1.5 text-xs text-muted-foreground/60">{formatRelativeTime(notif.createdAt)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
