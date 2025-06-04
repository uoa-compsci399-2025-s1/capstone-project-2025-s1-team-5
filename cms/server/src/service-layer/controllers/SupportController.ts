import { Controller, Post, Route, Tags, Body } from "tsoa";
import nodemailer from "nodemailer";

interface SupportRequest {
  first_name: string;
  last_name: string;
  preferred_email: string;
  contact_number: string;
  enquiry_message?: string;
}

interface BasicRequest {
  first_name: string;
  last_name: string;
  preferred_email: string;
  contact_number: string;
}

@Route("support")
@Tags("Support")
export class SupportController extends Controller {
  /** Send email for support form */
  @Post()
  public async sendSupport(@Body() body: SupportRequest): Promise<{ success: boolean }> {
    await sendMail("Support Request", body);
    return { success: true };
  }

  /** Send email for forgot password form */
  @Post("/forgot-password")
  public async forgotPassword(@Body() body: BasicRequest): Promise<{ success: boolean }> {
    await sendMail("Forgot Password Request", body);
    return { success: true };
  }
}

async function sendMail(subject: string, body: any) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const message = Object.entries(body)
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n");

  await transporter.sendMail({
    from: process.env.SUPPORT_FROM,
    to: process.env.CLIENT_EMAIL,
    subject,
    text: message,
  });
}
