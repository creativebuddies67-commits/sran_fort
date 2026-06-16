const NOTIFY_EMAIL = process.env.INQUIRY_NOTIFY_EMAIL || 'beant.singh36@gmail.com';

const EVENT_LABELS: Record<string, string> = {
  wedding: 'Wedding',
  reception: 'Reception',
  engagement: 'Engagement',
  birthday: 'Birthday',
  corporate: 'Corporate Event',
  other: 'Other',
};

interface InquiryResult {
  name: string;
  email: string;
  phone: string;
  eventType: string;
  eventDate?: string;
  guestCount?: number;
  message?: string;
}

export default {
  async afterCreate(event: { result: InquiryResult }) {
    const { result } = event;

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      strapi.log.warn(
        '[Email] SMTP not configured in backend .env — inquiry saved but email not sent.'
      );
      return;
    }

    const eventLabel = EVENT_LABELS[result.eventType] || result.eventType;

    try {
      await strapi.plugin('email').service('email').send({
        from: `"${result.name.replace(/"/g, "'")}" <${result.email}>`,
        to: NOTIFY_EMAIL,
        replyTo: result.email,
        subject: `Booking Inquiry from ${result.email} — ${result.name} (${eventLabel})`,
        html: `
          <h2>New Booking Inquiry — Sran Fort Marriage Palace</h2>
          <p><strong>Name:</strong> ${result.name}</p>
          <p><strong>Email:</strong> ${result.email}</p>
          <p><strong>Phone:</strong> ${result.phone}</p>
          <p><strong>Event Type:</strong> ${eventLabel}</p>
          ${result.eventDate ? `<p><strong>Event Date:</strong> ${result.eventDate}</p>` : ''}
          ${result.guestCount ? `<p><strong>Guests:</strong> ${result.guestCount}</p>` : ''}
          ${result.message ? `<p><strong>Message:</strong> ${result.message}</p>` : ''}
        `,
        text: [
          `New booking inquiry from ${result.name}`,
          `Email: ${result.email}`,
          `Phone: ${result.phone}`,
          `Event: ${eventLabel}`,
          result.eventDate ? `Date: ${result.eventDate}` : '',
          result.guestCount ? `Guests: ${result.guestCount}` : '',
          result.message ? `Message: ${result.message}` : '',
        ]
          .filter(Boolean)
          .join('\n'),
      });
      strapi.log.info(`Inquiry notification email sent to ${NOTIFY_EMAIL}`);
    } catch (err) {
      strapi.log.error('Failed to send inquiry notification email:', err);
    }
  },
};
