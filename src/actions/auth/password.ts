"use server";

import crypto from "crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { forgotPasswordSchema, resetPasswordSchema } from "@/lib/validations/auth";
import { sendEmail, resetPasswordTemplate } from "@/lib/email/sender";
import type { ActionResult } from "@/types";

export async function requestPasswordReset(raw: unknown): Promise<ActionResult<null>> {
  const parsed = forgotPasswordSchema.safeParse(raw);
  if (!parsed.success) return { success: false, error: "Invalid email address" };

  const { email } = parsed.data;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    // Always return success to prevent email enumeration
    if (!user) return { success: true, data: null };

    // Invalidate old tokens
    await prisma.passwordReset.updateMany({
      where: { userId: user.id, used: false },
      data: { used: true },
    });

    const token = crypto.randomBytes(32).toString("hex");
    await prisma.passwordReset.create({
      data: {
        userId: user.id,
        token,
        expires: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      },
    });

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;
    await sendEmail({
      to: email,
      subject: "Reset your MedFlow password",
      html: resetPasswordTemplate(user.name ?? "User", resetUrl),
    });

    return { success: true, data: null };
  } catch (error) {
    console.error("Password reset request error:", error);
    return { success: false, error: "Failed to send reset email. Try again." };
  }
}

export async function resetPassword(
  token: string,
  raw: unknown
): Promise<ActionResult<null>> {
  const parsed = resetPasswordSchema.safeParse(raw);
  if (!parsed.success) return { success: false, error: parsed.error.errors[0].message };

  const { password } = parsed.data;

  try {
    const resetRecord = await prisma.passwordReset.findUnique({ where: { token } });

    if (!resetRecord || resetRecord.used || resetRecord.expires < new Date()) {
      return { success: false, error: "Invalid or expired reset link. Please request a new one." };
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetRecord.userId },
        data: { password: hashedPassword },
      }),
      prisma.passwordReset.update({
        where: { id: resetRecord.id },
        data: { used: true },
      }),
    ]);

    return { success: true, data: null };
  } catch (error) {
    console.error("Password reset error:", error);
    return { success: false, error: "Failed to reset password. Please try again." };
  }
}

export async function verifyEmail(token: string): Promise<ActionResult<null>> {
  try {
    const record = await prisma.emailVerification.findUnique({ where: { token } });

    if (!record || record.used || record.expires < new Date()) {
      return { success: false, error: "Invalid or expired verification link." };
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: record.userId },
        data: { emailVerified: new Date() },
      }),
      prisma.emailVerification.update({
        where: { id: record.id },
        data: { used: true },
      }),
    ]);

    return { success: true, data: null };
  } catch (error) {
    console.error("Email verification error:", error);
    return { success: false, error: "Verification failed. Please try again." };
  }
}
