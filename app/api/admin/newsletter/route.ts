import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Subscriber, Post } from "@/lib/models"; // <-- Make sure Post is imported
import { ADMIN_PASSWORD } from "@/lib/types";
import nodemailer from "nodemailer";

function authorized(req: Request) {
  return (req.headers.get("x-admin-password") ?? "") === ADMIN_PASSWORD;
}

export async function POST(req: Request) {
  if (!authorized(req))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { subject, html, mediaUrl } = await req.json(); // <-- Add mediaUrl
    if (!subject || !html)
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    await connectDB();

    // 1. Save to the Blog (Post Collection) FIRST
    const newPost = await Post.create({
      title: subject,
      content: html,
      mediaUrl: mediaUrl || "",
    });

    // 2. Fetch subscribers to email them
    const subs = await Subscriber.find().select("email");
    const emails = subs.map((s) => s.email);

    if (emails.length === 0) {
      return NextResponse.json({
        ok: true,
        message: "Saved to blog, but no subscribers to email.",
      });
    }

    const { SMTP_HOST, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env;

    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
      return NextResponse.json({
        ok: true,
        sent: false,
        recipients: emails.length,
        note: "Saved to blog. SMTP not configured, no emails sent.",
      });
    }

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: 465,
      secure: true,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });

    const from = SMTP_FROM ?? "portfolio@ahmadidris.dev";

    // Optional: Inject the image into the email HTML if a mediaUrl exists
    const emailHtml = mediaUrl
      ? `<div style="margin-bottom: 20px;"><img src="${mediaUrl}" style="max-width:100%; border-radius:8px;" /></div>\n${html}`
      : html;

    await transporter.sendMail({
      from,
      to: from,
      bcc: emails,
      subject,
      html: emailHtml,
    });

    return NextResponse.json({
      ok: true,
      sent: true,
      recipients: emails.length,
      note: "Saved to blog and emails dispatched.",
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to process newsletter/blog post" },
      { status: 500 },
    );
  }
}
