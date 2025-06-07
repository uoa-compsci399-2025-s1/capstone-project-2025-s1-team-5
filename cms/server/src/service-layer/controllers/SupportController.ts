import { Body, Controller, Post, Route, SuccessResponse, Tags } from "tsoa";
import nodemailer from "nodemailer";
import { SupportRequest } from "../response-models/SupportRequest";

@Route("support")
@Tags("Support")
export class SupportController extends Controller {
  @SuccessResponse(204, "Support enquiry sent")
  @Post()
  public async sendSupportEmail(
    @Body() requestBody: SupportRequest,
  ): Promise<void> {
    const host = process.env.SMTP_HOST!;
    const port = Number(process.env.SMTP_PORT);
    const user = process.env.SMTP_USER!;
    const pass = process.env.SMTP_PASS!;
    const toEmail = process.env.TO_EMAIL!;

    const {
      first_name,
      last_name,
      preferred_email,
      contact_number,
      enquiry_message,
      title,
    } = requestBody;
    if (!first_name || !last_name || !preferred_email || !enquiry_message) {
      this.setStatus(400);
      throw new Error("Missing required fields");
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user,
        pass,
      },
    });

    const mailOptions = {
      from: `"Support Bot" <${user}>`,
      to: toEmail,
      subject: `${title}`,
      replyTo: preferred_email,
      text: `Name: ${first_name} ${last_name}
Email: ${preferred_email}
Contact number: ${contact_number || "Did not provide"}
${enquiry_message}`.trim(),
    };

    try {
      await transporter.sendMail(mailOptions);
      this.setStatus(204);
      return;
    } catch (err) {
      console.error("Send email failed:", err);
      this.setStatus(500);
      throw new Error("Failed to send support email");
    }
  }
}
