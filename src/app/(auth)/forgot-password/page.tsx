"use client";
import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, FormField } from "@/components/ui/input";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/lib/validations/auth";
import { requestPasswordReset } from "@/actions/auth/password";
export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotPasswordInput>({ resolver: zodResolver(forgotPasswordSchema) });
  async function onSubmit(data: ForgotPasswordInput) {
    await requestPasswordReset(data);
    setEmail(data.email);
    setSent(true);
  }
  if (sent) return (
    <div className="space-y-6 text-center animate-fade-in">
      <div className="flex justify-center"><div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 dark:bg-green-900/40"><CheckCircle2 className="h-8 w-8 text-green-600" /></div></div>
      <div><h1 className="text-2xl font-bold">Check your email</h1><p className="mt-2 text-sm text-muted-foreground">We sent a password reset link to <strong>{email}</strong>. Check your inbox and spam folder.</p></div>
      <div className="rounded-xl border bg-muted/30 p-4 text-sm text-muted-foreground">Link expires in <strong>1 hour</strong>. Didn't receive it? <button onClick={() => setSent(false)} className="text-primary hover:underline">Try again</button></div>
      <Link href="/login"><Button variant="outline" className="w-full" leftIcon={<ArrowLeft className="h-4 w-4" />}>Back to Sign In</Button></Link>
    </div>
  );
  return (
    <div className="space-y-6 animate-fade-in">
      <div><h1 className="text-2xl font-bold">Forgot your password?</h1><p className="mt-1.5 text-sm text-muted-foreground">Enter your email and we'll send you a reset link.</p></div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField label="Email address" error={errors.email?.message} required htmlFor="email">
          <Input id="email" type="email" placeholder="you@clinic.com" leftIcon={<Mail className="h-4 w-4" />} {...register("email")} error={!!errors.email} />
        </FormField>
        <Button type="submit" loading={isSubmitting} className="w-full" size="lg">Send Reset Link</Button>
      </form>
      <Link href="/login"><Button variant="ghost" className="w-full" leftIcon={<ArrowLeft className="h-4 w-4" />}>Back to Sign In</Button></Link>
    </div>
  );
}
