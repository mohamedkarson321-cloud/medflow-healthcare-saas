"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, FormField } from "@/components/ui/input";
import { registerSchema, type RegisterInput } from "@/lib/validations/auth";
import { registerUser } from "@/actions/auth/register";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });

  const password = watch("password", "");

  const passwordStrength = {
    hasLength: password.length >= 8,
    hasUpper: /[A-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[^a-zA-Z0-9]/.test(password),
  };
  const strengthScore = Object.values(passwordStrength).filter(Boolean).length;

  async function onSubmit(data: RegisterInput) {
    setAuthError(null);
    try {
      const result = await registerUser(data);
      if (!result.success) {
        setAuthError(result.error);
        return;
      }
      toast.success("Account created! Please check your email to verify your account.");
      router.push("/verify-email?email=" + encodeURIComponent(data.email));
    } catch {
      setAuthError("An unexpected error occurred. Please try again.");
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Start your 14-day free trial. No credit card required.
        </p>
      </div>

      {authError && (
        <div className="flex items-center gap-2.5 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {authError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <FormField label="First Name" error={errors.firstName?.message} required htmlFor="firstName">
            <Input id="firstName" placeholder="Ahmed" {...register("firstName")} error={!!errors.firstName} />
          </FormField>
          <FormField label="Last Name" error={errors.lastName?.message} required htmlFor="lastName">
            <Input id="lastName" placeholder="Hassan" {...register("lastName")} error={!!errors.lastName} />
          </FormField>
        </div>

        <FormField label="Email address" error={errors.email?.message} required htmlFor="email">
          <Input id="email" type="email" placeholder="you@clinic.com" autoComplete="email" {...register("email")} error={!!errors.email} />
        </FormField>

        <FormField label="Phone number" error={errors.phone?.message} required htmlFor="phone">
          <Input id="phone" type="tel" placeholder="+20 12 345 6789" {...register("phone")} error={!!errors.phone} />
        </FormField>

        <FormField label="Password" error={errors.password?.message} required htmlFor="password">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Min. 8 characters"
            autoComplete="new-password"
            {...register("password")}
            error={!!errors.password}
            rightIcon={
              <button type="button" onClick={() => setShowPassword(!showPassword)} tabIndex={-1} className="text-muted-foreground hover:text-foreground">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
          />
          {/* Strength meter */}
          {password.length > 0 && (
            <div className="mt-2 space-y-1.5">
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-colors ${
                      i <= strengthScore
                        ? strengthScore <= 1 ? "bg-red-500"
                          : strengthScore <= 2 ? "bg-yellow-500"
                          : strengthScore <= 3 ? "bg-blue-500"
                          : "bg-green-500"
                        : "bg-muted"
                    }`}
                  />
                ))}
              </div>
              <div className="flex flex-wrap gap-x-3 gap-y-1">
                {Object.entries(passwordStrength).map(([key, ok]) => (
                  <span key={key} className={`flex items-center gap-1 text-xs ${ok ? "text-green-600" : "text-muted-foreground"}`}>
                    <CheckCircle2 className="h-3 w-3" />
                    {key === "hasLength" ? "8+ chars" : key === "hasUpper" ? "Uppercase" : key === "hasNumber" ? "Number" : "Special char"}
                  </span>
                ))}
              </div>
            </div>
          )}
        </FormField>

        <FormField label="Confirm Password" error={errors.confirmPassword?.message} required htmlFor="confirmPassword">
          <Input
            id="confirmPassword"
            type={showConfirm ? "text" : "password"}
            placeholder="Repeat your password"
            autoComplete="new-password"
            {...register("confirmPassword")}
            error={!!errors.confirmPassword}
            rightIcon={
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} tabIndex={-1} className="text-muted-foreground hover:text-foreground">
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
          />
        </FormField>

        <label className="flex cursor-pointer items-start gap-2.5">
          <input type="checkbox" {...register("agreeToTerms")} className="mt-0.5 h-4 w-4 rounded border-input accent-primary" />
          <span className="text-sm text-muted-foreground leading-relaxed">
            I agree to the{" "}
            <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>
            {" "}and{" "}
            <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
          </span>
        </label>
        {errors.agreeToTerms && (
          <p className="text-xs text-destructive">{errors.agreeToTerms.message}</p>
        )}

        <Button type="submit" loading={isSubmitting} className="w-full" size="lg">
          Create Account
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary hover:text-primary/80 transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
}
