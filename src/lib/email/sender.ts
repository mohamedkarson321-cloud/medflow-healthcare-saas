import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export async function sendEmail({ to, subject, html, from }: EmailOptions) {
  try {
    await transporter.sendMail({
      from: from ?? process.env.EMAIL_FROM ?? "MedFlow <noreply@medflow.health>",
      to,
      subject,
      html,
    });
    return { success: true };
  } catch (error) {
    console.error("Email send error:", error);
    return { success: false, error };
  }
}

// ─── Email Templates ──────────────────────────────────────────────────────────

const baseStyle = `
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  max-width: 600px; margin: 0 auto; background: #ffffff;
`;

const brandColor = "#0369a1";

function emailWrapper(content: string): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="background: #f8fafc; padding: 40px 20px; margin: 0;">
  <div style="${baseStyle}">
    <div style="background: ${brandColor}; padding: 24px 32px; border-radius: 12px 12px 0 0;">
      <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">
        🏥 MedFlow
      </h1>
      <p style="color: rgba(255,255,255,0.8); margin: 4px 0 0; font-size: 14px;">
        Healthcare Management Platform
      </p>
    </div>
    <div style="padding: 32px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px;">
      ${content}
    </div>
    <div style="padding: 24px; text-align: center; color: #94a3b8; font-size: 12px;">
      <p style="margin: 0;">© ${new Date().getFullYear()} MedFlow Healthcare. All rights reserved.</p>
      <p style="margin: 8px 0 0;">This is an automated email, please do not reply.</p>
    </div>
  </div>
</body>
</html>`;
}

export function verifyEmailTemplate(name: string, verifyUrl: string): string {
  return emailWrapper(`
    <h2 style="color: #0f172a; font-size: 22px; margin: 0 0 8px;">Verify your email address</h2>
    <p style="color: #64748b; font-size: 15px; margin: 0 0 24px;">Hi ${name}, welcome to MedFlow! Please verify your email to get started.</p>
    <a href="${verifyUrl}" style="display: inline-block; background: ${brandColor}; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px;">
      Verify Email Address
    </a>
    <p style="color: #94a3b8; font-size: 13px; margin: 24px 0 0;">This link expires in 24 hours. If you didn't create an account, please ignore this email.</p>
  `);
}

export function resetPasswordTemplate(name: string, resetUrl: string): string {
  return emailWrapper(`
    <h2 style="color: #0f172a; font-size: 22px; margin: 0 0 8px;">Reset your password</h2>
    <p style="color: #64748b; font-size: 15px; margin: 0 0 24px;">Hi ${name}, we received a request to reset your MedFlow password.</p>
    <a href="${resetUrl}" style="display: inline-block; background: ${brandColor}; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px;">
      Reset Password
    </a>
    <p style="color: #94a3b8; font-size: 13px; margin: 24px 0 0;">This link expires in 1 hour. If you didn't request a password reset, you can safely ignore this email.</p>
  `);
}

export function appointmentConfirmationTemplate(data: {
  patientName: string;
  doctorName: string;
  date: string;
  time: string;
  type: string;
  appointmentNumber: string;
}): string {
  return emailWrapper(`
    <h2 style="color: #0f172a; font-size: 22px; margin: 0 0 8px;">Appointment Confirmed ✓</h2>
    <p style="color: #64748b; font-size: 15px; margin: 0 0 24px;">Hi ${data.patientName}, your appointment has been confirmed.</p>
    <div style="background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; padding: 20px; margin: 0 0 24px;">
      <div style="display: grid; gap: 8px;">
        <div><span style="color: #64748b; font-size: 13px;">Appointment #</span><br><strong style="color: #0f172a;">${data.appointmentNumber}</strong></div>
        <div><span style="color: #64748b; font-size: 13px;">Doctor</span><br><strong style="color: #0f172a;">${data.doctorName}</strong></div>
        <div><span style="color: #64748b; font-size: 13px;">Date & Time</span><br><strong style="color: #0f172a;">${data.date} at ${data.time}</strong></div>
        <div><span style="color: #64748b; font-size: 13px;">Type</span><br><strong style="color: #0f172a;">${data.type}</strong></div>
      </div>
    </div>
    <p style="color: #64748b; font-size: 14px;">Please arrive 15 minutes early for check-in. If you need to reschedule, please contact us at least 24 hours in advance.</p>
  `);
}

export function appointmentReminderTemplate(data: {
  patientName: string;
  doctorName: string;
  date: string;
  time: string;
  hoursUntil: number;
}): string {
  return emailWrapper(`
    <h2 style="color: #0f172a; font-size: 22px; margin: 0 0 8px;">Appointment Reminder 🔔</h2>
    <p style="color: #64748b; font-size: 15px; margin: 0 0 24px;">Hi ${data.patientName}, this is a reminder about your upcoming appointment in ${data.hoursUntil} hours.</p>
    <div style="background: #fef9c3; border: 1px solid #fde68a; border-radius: 8px; padding: 20px; margin: 0 0 24px;">
      <p style="margin: 0; color: #92400e;"><strong>Doctor:</strong> ${data.doctorName}</p>
      <p style="margin: 8px 0 0; color: #92400e;"><strong>Date & Time:</strong> ${data.date} at ${data.time}</p>
    </div>
  `);
}

export function labResultsReadyTemplate(patientName: string, portalUrl: string): string {
  return emailWrapper(`
    <h2 style="color: #0f172a; font-size: 22px; margin: 0 0 8px;">Lab Results Ready 🧪</h2>
    <p style="color: #64748b; font-size: 15px; margin: 0 0 24px;">Hi ${patientName}, your laboratory results are now available in your patient portal.</p>
    <a href="${portalUrl}" style="display: inline-block; background: ${brandColor}; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px;">
      View Results
    </a>
  `);
}

export function invoiceTemplate(data: {
  patientName: string;
  invoiceNumber: string;
  total: number;
  currency: string;
  dueDate: string;
  portalUrl: string;
}): string {
  return emailWrapper(`
    <h2 style="color: #0f172a; font-size: 22px; margin: 0 0 8px;">Invoice ${data.invoiceNumber}</h2>
    <p style="color: #64748b; font-size: 15px; margin: 0 0 24px;">Hi ${data.patientName}, please find your invoice details below.</p>
    <div style="background: #f8fafc; border-radius: 8px; padding: 20px; margin: 0 0 24px;">
      <p style="margin: 0; color: #0f172a; font-size: 28px; font-weight: 700;">${data.currency} ${data.total.toFixed(2)}</p>
      <p style="margin: 4px 0 0; color: #64748b; font-size: 14px;">Due by ${data.dueDate}</p>
    </div>
    <a href="${data.portalUrl}" style="display: inline-block; background: ${brandColor}; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px;">
      Pay Now
    </a>
  `);
}
