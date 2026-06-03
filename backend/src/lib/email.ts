import { Resend } from "resend";
import { config } from "../config/config";

const resend = new Resend(config.RESEND_API_KEY);

export async function sendOtpEmail(email: string, otp: string) {
  await resend.emails.send({
    from: "HireMind <onboarding@resend.dev>",
    to: [email],
    subject: "Your HireMind verification code",
    html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px">
          <h2 style="font-size:24px;font-weight:800;margin-bottom:8px">
            <span style="color:#0f172a">Hire</span><span style="color:#2563eb">Mind</span>
          </h2>
          <p style="color:#64748b;margin-bottom:24px">Verify your email address to get started.</p>
          <div style="background:#f8fafc;border:1px solid
  #e2e8f0;border-radius:12px;padding:24px;text-align:center;margin-bottom:24px">
            <p style="font-size:13px;color:#64748b;margin-bottom:8px;text-transform:uppercase;letter-spacing:1px">Your verification
  code</p>
            <p style="font-size:40px;font-weight:900;letter-spacing:12px;color:#2563eb;margin:0">${otp}</p>
          </div>
          <p style="color:#94a3b8;font-size:13px">Valid for 10 minutes. If you didn't request this, ignore this email.</p>
        </div>
      `,
  });
}
