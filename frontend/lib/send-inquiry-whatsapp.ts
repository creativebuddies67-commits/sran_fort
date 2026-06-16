import type { BookingInquiry } from './types';

export const INQUIRY_WHATSAPP_NUMBER =
  process.env.INQUIRY_WHATSAPP_NUMBER || '917734910001';

const EVENT_LABELS: Record<string, string> = {
  wedding: 'Wedding',
  reception: 'Reception',
  engagement: 'Engagement',
  birthday: 'Birthday',
  corporate: 'Corporate Event',
  other: 'Other',
};

export interface WhatsAppSendResult {
  sent: boolean;
  method?: 'callmebot';
  error?: string;
}

function buildWhatsAppMessage(inquiry: BookingInquiry): string {
  const eventLabel = EVENT_LABELS[inquiry.eventType] || inquiry.eventType;
  const lines = [
    '🏰 *New Booking Inquiry — Sran Fort Marriage Palace*',
    '',
    `👤 *Name:* ${inquiry.name}`,
    `📧 *Email:* ${inquiry.email}`,
    `📞 *Phone:* ${inquiry.phone}`,
    `🎉 *Event:* ${eventLabel}`,
  ];

  if (inquiry.eventDate) lines.push(`📅 *Date:* ${inquiry.eventDate}`);
  if (inquiry.guestCount) lines.push(`👥 *Guests:* ${inquiry.guestCount}`);
  if (inquiry.message) lines.push(`💬 *Message:* ${inquiry.message}`);

  lines.push('', '_Submitted via sranfort.com booking form_');
  return lines.join('\n');
}

async function sendViaCallMeBot(inquiry: BookingInquiry): Promise<void> {
  const apiKey = process.env.CALLMEBOT_API_KEY;
  if (!apiKey) {
    throw new Error('CALLMEBOT_API_KEY not configured');
  }

  const phone = INQUIRY_WHATSAPP_NUMBER.startsWith('+')
    ? INQUIRY_WHATSAPP_NUMBER
    : `+${INQUIRY_WHATSAPP_NUMBER}`;

  const url = new URL('https://api.callmebot.com/whatsapp.php');
  url.searchParams.set('phone', phone);
  url.searchParams.set('text', buildWhatsAppMessage(inquiry));
  url.searchParams.set('apikey', apiKey);

  const res = await fetch(url.toString(), { cache: 'no-store' });
  const body = (await res.text()).trim();

  if (!res.ok || body.toUpperCase().startsWith('ERROR')) {
    throw new Error(body || `CallMeBot returned ${res.status}`);
  }
}

export async function sendInquiryWhatsApp(
  inquiry: BookingInquiry
): Promise<WhatsAppSendResult> {
  if (!process.env.CALLMEBOT_API_KEY) {
    console.warn(
      '[WhatsApp] CALLMEBOT_API_KEY not set — inquiry saved but WhatsApp not sent. See SETUP.md for one-time setup.'
    );
    return { sent: false, error: 'CALLMEBOT_API_KEY not configured' };
  }

  try {
    await sendViaCallMeBot(inquiry);
    console.log(
      `[WhatsApp] Inquiry notification sent to ${INQUIRY_WHATSAPP_NUMBER}`
    );
    return { sent: true, method: 'callmebot' };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[WhatsApp] Failed to send inquiry notification:', message);
    return { sent: false, error: message };
  }
}
