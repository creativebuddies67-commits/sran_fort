import nodemailer from 'nodemailer';
import type { BookingInquiry } from './types';

export const INQUIRY_NOTIFY_EMAIL =
  process.env.INQUIRY_NOTIFY_EMAIL || 'beant.singh36@gmail.com';

const EVENT_LABELS: Record<string, string> = {
  wedding: 'Wedding',
  reception: 'Reception',
  engagement: 'Engagement',
  birthday: 'Birthday',
  corporate: 'Corporate Event',
  other: 'Other',
};

export interface EmailSendResult {
  sent: boolean;
  method?: 'smtp' | 'formsubmit';
  error?: string;
}

function customerFromAddress(inquiry: BookingInquiry): string {
  const safeName = inquiry.name.replace(/"/g, "'");
  return `"${safeName}" <${inquiry.email}>`;
}

function buildInquiryEmailHtml(inquiry: BookingInquiry): string {
  const eventLabel = EVENT_LABELS[inquiry.eventType] || inquiry.eventType;
  return `
    <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
      <div style="background: #7b1e3a; color: #fff; padding: 24px; text-align: center;">
        <h1 style="margin: 0; font-size: 22px;">Sran Fort Marriage Palace</h1>
        <p style="margin: 8px 0 0; color: #c9a227; font-size: 14px;">New Booking Inquiry</p>
      </div>
      <div style="padding: 24px; background: #faf7f2;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; font-weight: bold; width: 140px;">Name</td><td>${inquiry.name}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold;">Email</td><td><a href="mailto:${inquiry.email}">${inquiry.email}</a></td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold;">Phone</td><td><a href="tel:${inquiry.phone}">${inquiry.phone}</a></td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold;">Event Type</td><td>${eventLabel}</td></tr>
          ${inquiry.eventDate ? `<tr><td style="padding: 8px 0; font-weight: bold;">Event Date</td><td>${inquiry.eventDate}</td></tr>` : ''}
          ${inquiry.guestCount ? `<tr><td style="padding: 8px 0; font-weight: bold;">Guests</td><td>${inquiry.guestCount}</td></tr>` : ''}
        </table>
        ${inquiry.message ? `<p style="margin-top: 16px;"><strong>Message:</strong></p><p style="background: #fff; padding: 12px; border-radius: 4px;">${inquiry.message}</p>` : ''}
        <p style="margin-top: 24px; font-size: 12px; color: #666;">Submitted via sranfort.com booking form</p>
      </div>
    </div>
  `;
}

function buildPlainText(inquiry: BookingInquiry): string {
  const eventLabel = EVENT_LABELS[inquiry.eventType] || inquiry.eventType;
  return [
    `New booking inquiry from ${inquiry.name}`,
    `From: ${inquiry.email}`,
    `Phone: ${inquiry.phone}`,
    `Event: ${eventLabel}`,
    inquiry.eventDate ? `Date: ${inquiry.eventDate}` : '',
    inquiry.guestCount ? `Guests: ${inquiry.guestCount}` : '',
    inquiry.message ? `Message: ${inquiry.message}` : '',
  ]
    .filter(Boolean)
    .join('\n');
}

async function sendViaSmtp(inquiry: BookingInquiry): Promise<void> {
  const smtpUser = process.env.SMTP_USER!;
  const smtpPass = process.env.SMTP_PASS!;
  const eventLabel = EVENT_LABELS[inquiry.eventType] || inquiry.eventType;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: { user: smtpUser, pass: smtpPass },
  });

  await transporter.sendMail({
    from: customerFromAddress(inquiry),
    to: INQUIRY_NOTIFY_EMAIL,
    replyTo: customerFromAddress(inquiry),
    subject: `Booking Inquiry from ${inquiry.email} — ${inquiry.name} (${eventLabel})`,
    html: buildInquiryEmailHtml(inquiry),
    text: buildPlainText(inquiry),
  });
}

async function sendViaFormSubmit(inquiry: BookingInquiry): Promise<void> {
  const eventLabel = EVENT_LABELS[inquiry.eventType] || inquiry.eventType;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sranfort.com';

  const res = await fetch(`https://formsubmit.co/ajax/${INQUIRY_NOTIFY_EMAIL}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Origin: siteUrl,
      Referer: `${siteUrl}/booking`,
    },
    body: JSON.stringify({
      _subject: `Booking Inquiry from ${inquiry.email} — ${inquiry.name} (${eventLabel})`,
      _replyto: inquiry.email,
      _template: 'table',
      _captcha: 'false',
      name: inquiry.name,
      email: inquiry.email,
      phone: inquiry.phone,
      eventType: eventLabel,
      eventDate: inquiry.eventDate || 'Not specified',
      guestCount: inquiry.guestCount?.toString() || 'Not specified',
      message: inquiry.message || '—',
    }),
  });

  const body = (await res.json().catch(() => null)) as
    | { success?: string | boolean; message?: string }
    | null;

  if (!res.ok) {
    throw new Error(`FormSubmit returned ${res.status}`);
  }

  const failed = body?.success === 'false' || body?.success === false;
  if (failed) {
    const message = body?.message || 'FormSubmit rejected the request';
    if (message.toLowerCase().includes('activation')) {
      throw new Error(
        `FormSubmit needs one-time activation. Check ${INQUIRY_NOTIFY_EMAIL} for an "Activate Form" email and click the link.`
      );
    }
    throw new Error(message);
  }
}

export async function sendInquiryEmail(inquiry: BookingInquiry): Promise<EmailSendResult> {
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (smtpUser && smtpPass) {
    try {
      await sendViaSmtp(inquiry);
      console.log(
        `[Email] Inquiry from ${inquiry.email} sent via SMTP to ${INQUIRY_NOTIFY_EMAIL}`
      );
      return { sent: true, method: 'smtp' };
    } catch (smtpError) {
      console.error('[Email] SMTP failed, trying FormSubmit fallback:', smtpError);
    }
  } else {
    console.warn(
      '[Email] SMTP not configured — using FormSubmit to deliver inquiry emails.'
    );
  }

  try {
    await sendViaFormSubmit(inquiry);
    console.log(
      `[Email] Inquiry from ${inquiry.email} sent via FormSubmit to ${INQUIRY_NOTIFY_EMAIL}`
    );
    return { sent: true, method: 'formsubmit' };
  } catch (formError) {
    const message = formError instanceof Error ? formError.message : String(formError);
    console.error('[Email] Failed to send inquiry notification:', message);
    return { sent: false, error: message };
  }
}
