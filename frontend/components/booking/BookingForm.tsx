'use client';

import { useState } from 'react';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';
import { EVENT_TYPES } from '@/lib/constants';
import { submitBookingInquiry } from '@/lib/strapi';
import type { BookingInquiry } from '@/lib/types';

export default function BookingForm() {
  const [form, setForm] = useState<BookingInquiry>({
    name: '',
    email: '',
    phone: '',
    eventType: 'wedding',
    eventDate: '',
    guestCount: undefined,
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    const result = await submitBookingInquiry({
      ...form,
      guestCount: form.guestCount ? Number(form.guestCount) : undefined,
    });

    if (result) {
      setStatus('success');
      setForm({ name: '', email: '', phone: '', eventType: 'wedding', eventDate: '', guestCount: undefined, message: '' });
    } else {
      setStatus('error');
    }
  };

  const update = (field: keyof BookingInquiry, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (status !== 'idle') setStatus('idle');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-charcoal mb-2">Full Name *</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold bg-white"
            placeholder="Your name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-charcoal mb-2">Email *</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold bg-white"
            placeholder="your@email.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-charcoal mb-2">Phone *</label>
          <input
            type="tel"
            required
            value={form.phone}
            onChange={(e) => update('phone', e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold bg-white"
            placeholder="+91 XXXXX XXXXX"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-charcoal mb-2">Event Type *</label>
          <select
            required
            value={form.eventType}
            onChange={(e) => update('eventType', e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold bg-white"
          >
            {EVENT_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-charcoal mb-2">Event Date</label>
          <input
            type="date"
            value={form.eventDate}
            onChange={(e) => update('eventDate', e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold bg-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-charcoal mb-2">Expected Guests</label>
          <input
            type="number"
            min="1"
            value={form.guestCount ?? ''}
            onChange={(e) => update('guestCount', e.target.value ? parseInt(e.target.value) : '')}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold bg-white"
            placeholder="Number of guests"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-charcoal mb-2">Message</label>
        <textarea
          rows={4}
          value={form.message}
          onChange={(e) => update('message', e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold bg-white resize-none"
          placeholder="Tell us about your event requirements..."
        />
      </div>

      {status === 'success' && (
        <div className="flex items-center gap-2 text-green-700 bg-green-50 p-4 rounded-lg">
          <CheckCircle size={20} />
          <p>Thank you! Your inquiry has been submitted. We&apos;ll contact you soon.</p>
        </div>
      )}
      {status === 'error' && (
        <div className="flex items-start gap-2 text-red-700 bg-red-50 p-4 rounded-lg">
          <AlertCircle size={20} className="shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Could not submit your inquiry.</p>
            <p className="text-sm mt-1">Make sure the backend is running (<code className="text-xs">cd backend && npm run develop</code>), then try again — or call us directly.</p>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="btn-primary w-full md:w-auto disabled:opacity-50"
      >
        {status === 'loading' ? 'Submitting...' : 'Submit Inquiry'}
        <Send size={18} />
      </button>
    </form>
  );
}
