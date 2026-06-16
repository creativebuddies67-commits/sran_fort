import { NextRequest, NextResponse } from 'next/server';
import type { BookingInquiry } from '@/lib/types';
import { sendInquiryEmail } from '@/lib/send-inquiry-email';
import { sendInquiryWhatsApp } from '@/lib/send-inquiry-whatsapp';

const STRAPI_URL =
  process.env.STRAPI_URL ||
  process.env.NEXT_PUBLIC_STRAPI_URL ||
  'http://localhost:1337';

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as BookingInquiry;

    const res = await fetch(`${STRAPI_URL}/api/booking-inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: body }),
      cache: 'no-store',
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Strapi booking error:', res.status, errorText);
      return NextResponse.json(
        { error: 'Failed to submit inquiry' },
        { status: res.status }
      );
    }

    const data = await res.json();

    const [emailResult, whatsappResult] = await Promise.all([
      sendInquiryEmail(body),
      sendInquiryWhatsApp(body),
    ]);

    if (!emailResult.sent) {
      console.error(
        'Inquiry saved but email notification failed:',
        emailResult.error ?? 'unknown error'
      );
    }
    if (!whatsappResult.sent) {
      console.error(
        'Inquiry saved but WhatsApp notification failed:',
        whatsappResult.error ?? 'unknown error'
      );
    }

    return NextResponse.json({
      ...data,
      meta: {
        ...(data.meta ?? {}),
        emailSent: emailResult.sent,
        emailMethod: emailResult.method,
        whatsappSent: whatsappResult.sent,
        whatsappMethod: whatsappResult.method,
      },
    });
  } catch (error) {
    console.error('Booking proxy error — is Strapi running?', error);
    return NextResponse.json(
      { error: 'Backend unavailable. Please ensure Strapi is running on port 1337.' },
      { status: 503 }
    );
  }
}
