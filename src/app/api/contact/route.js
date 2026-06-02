import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const { firstName, lastName, email, address, message } = await req.json();

    if (!firstName || !email || !message) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"SwiftCargo Contact Form" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `New Contact Form Message from ${firstName} ${lastName}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 24px; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 10px;">
          <h2 style="color: #1e40af; margin-bottom: 20px;">New Contact Form Submission</h2>
          <table style="width:100%; border-collapse: collapse; font-size: 14px;">
            <tr><td style="padding: 8px 0; color: #64748b; font-weight: 600; width: 140px;">Name</td><td style="padding: 8px 0; color: #0f172a;">${firstName} ${lastName}</td></tr>
            <tr><td style="padding: 8px 0; color: #64748b; font-weight: 600;">Email</td><td style="padding: 8px 0; color: #0f172a;"><a href="mailto:${email}" style="color: #1e40af;">${email}</a></td></tr>
            <tr><td style="padding: 8px 0; color: #64748b; font-weight: 600;">Address / State</td><td style="padding: 8px 0; color: #0f172a;">${address || "—"}</td></tr>
          </table>
          <div style="margin-top: 20px; padding: 16px; background: #f8fafc; border-radius: 8px; border-left: 4px solid #1e40af;">
            <p style="color: #64748b; font-weight: 600; margin: 0 0 8px;">Message</p>
            <p style="color: #0f172a; line-height: 1.7; margin: 0;">${message}</p>
          </div>
          <p style="margin-top: 20px; font-size: 12px; color: #94a3b8;">Sent via SwiftCargo contact form · Reply directly to this email to respond to ${firstName}.</p>
        </div>
      `,
    });

    return NextResponse.json({ message: "Message sent successfully" }, { status: 200 });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json({ message: "Failed to send message" }, { status: 500 });
  }
}
