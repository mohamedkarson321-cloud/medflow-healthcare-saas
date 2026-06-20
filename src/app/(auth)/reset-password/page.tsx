"use client";
import { useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, FormField } from "@/components/ui/input";
import { resetPasswordSchema, type ResetPasswordInput } from "@/lib/validations/auth";
import { resetPassword } from "@/actions/auth/password";
export default function ResetPasswordPage() {
  const router = useRouter();
  const token = useSearchParams().get("token") ?? "";
  const [showPw, setShowPw] = useState(false);
  const [showCpw, setShowCpw] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ResetPasswordInput>({ resolver: zodResolver(resetPasswordSchema) });
  async function onSubmit(data: ResetPasswordInput) {
    setError(null);
    const result = await resetPassword(token, data);
    if (!result.success) { setError(result.error); return; }
    setDone(true);
    setTimeout(() => router.push("/login"), 2500);
  }
  if (!token) return <div className="text-center"><p className="text-sm text-destructive">Invalid reset link.</p><Link href="/forgot-password" className="mt-4 inline-block text-sm text-primary hover:underline">Request a new link</Link></div>;
  if (done) return (
    <div className="space-y-4 text-center animate-fade-in">
      <div className="flex justify-center"><div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100"><CheckCircle2 className="h-8 w-8 text-green-600" /></div></div>
      <h1 className="text-2xl font-bold">Password reset!</h1>
      <p className="text-sm text-muted-foreground">Your password has been updated. Redirecting to sign in…</p>
    </div>
  );
  return (
    <div className="space-y-6 animate-fade-in">
      <div><h1 className="text-2xl font-bold">Set new password</h1><p className="mt-1.5 text-sm text-muted-foreground">Choose a strong password for your account.</p></div>
      {error && <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive"><AlertCircle className="h-4 w-4 shrink-0" />{error}</div>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField label="New Password" error={errors.password?.message} required htmlFor="password">
          <Input id="password" type={showPw ? "text" : "password"} placeholder="Min. 8 characters" {...register("password")} error={!!errors.password} rightIcon={<button type="button" onClick={() => setShowPw(!showPw)} tabIndex={-1}>{showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>} />
        </FormField>
        <FormField label="Confirm Password" error={errors.confirmPassword?.message} required htmlFor="confirm">
          <Input id="confirm" type={showCpw ? "text" : "password"} placeholder="Repeat password" {...register("confirmPassword")} error={!!errors.confirmPassword} rightIcon={<button type="button" onClick={() => setShowCpw(!showCpw)} tabIndex={-1}>{showCpw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>} />
        </FormField>
        <Button type="submit" loading={isSubmitting} className="w-full" size="lg">Reset Password</Button>
      </form>
    </div>
  );
}
