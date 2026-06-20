"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations/auth";
import { sendEmail, verifyEmailTemplate } from "@/lib/email/sender";
import { generatePatientNumber } from "@/lib/utils";
import type { ActionResult } from "@/types";
import crypto from "crypto";

export async function registerUser(
  raw: unknown
): Promise<ActionResult<{ email: string }>> {
  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message };
  }

  const { firstName, lastName, email, phone, password } = parsed.data;

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return { success: false, error: "An account with this email already exists." };
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // Find default clinic (first clinic, for demo)
    let defaultClinic = await prisma.clinic.findFirst();
    if (!defaultClinic) {
      defaultClinic = await prisma.clinic.create({
        data: {
          name: "MedFlow Demo Clinic",
          slug: "medflow-demo",
          email: "demo@medflow.health",
          phone: "+20123456789",
          address: "123 Healthcare Blvd",
          city: "Cairo",
          state: "Cairo",
          country: "Egypt",
        },
      });
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        name: `${firstName} ${lastName}`,
        email,
        password: hashedPassword,
        role: "PATIENT",
        isActive: true,
      },
    });

    // Create patient profile
    await prisma.patient.create({
      data: {
        userId: user.id,
        clinicId: defaultClinic.id,
        patientNumber: generatePatientNumber(),
        firstName,
        lastName,
        phone,
        email,
        dateOfBirth: new Date("1990-01-01"),
        gender: "PREFER_NOT_TO_SAY",
      },
    });

    // Create email verification token
    const token = crypto.randomBytes(32).toString("hex");
    await prisma.emailVerification.create({
      data: {
        userId: user.id,
        token,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      },
    });

    // Send verification email
    const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;
    await sendEmail({
      to: email,
      subject: "Verify your MedFlow account",
      html: verifyEmailTemplate(`${firstName} ${lastName}`, verifyUrl),
    });

    return { success: true, data: { email } };
  } catch (error) {
    console.error("Registration error:", error);
    return { success: false, error: "Failed to create account. Please try again." };
  }
}
