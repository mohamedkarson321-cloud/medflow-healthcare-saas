import Link from "next/link";
import { CheckCircle2, XCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { verifyEmail } from "@/actions/auth/password";

// التعديل الأساسي هنا: searchParams بقت Promise
export default async function VerifyEmailPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ token?: string; email?: string }>; 
}) {
  // بنعمل await عشان نفك الـ Promise قبل ما نستخدمهم
  const params = await searchParams;
  const { token, email } = params;

  if (!token && email) return (
    <div className="space-y-5 text-center animate-fade-in">
      <div className="flex justify-center"><div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 dark:bg-blue-900/40"><Mail className="h-8 w-8 text-blue-600" /></div></div>
      <div><h1 className="text-2xl font-bold">Check your email</h1><p className="mt-2 text-sm text-muted-foreground">We sent a verification link to <strong>{email}</strong>. Click the link to verify your account.</p></div>
      <div className="rounded-xl border bg-muted/30 p-4 text-sm text-muted-foreground">Didn't receive it? Check spam or <Link href="/register" className="text-primary hover:underline">try again</Link>.</div>
    </div>
  );

  if (!token) return <div className="text-center text-sm text-destructive">Invalid verification link. <Link href="/register" className="text-primary hover:underline">Register again</Link>.</div>;

  const result = await verifyEmail(token);

  if (!result.success) return (
    <div>
      <h1 className="text-2xl font-bold text-destructive">Verification failed</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {(result as any).error || (result as any).message || "Verification failed"}
      </p>
    </div>
  );

  return (
    <div className="space-y-5 text-center animate-fade-in">
      <div className="flex justify-center"><div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 dark:bg-green-900/40"><CheckCircle2 className="h-8 w-8 text-green-600" /></div></div>
      <div><h1 className="text-2xl font-bold">Email verified! 🎉</h1><p className="mt-2 text-sm text-muted-foreground">Your account is now active. Sign in to get started.</p></div>
      <Link href="/login"><Button className="w-full" size="lg">Sign In to MedFlow</Button></Link>
    </div>
  );
}