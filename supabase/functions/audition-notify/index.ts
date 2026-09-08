type AuditionEvent = 'signup' | 'cancel';

type AuditionPayload = {
  event?: AuditionEvent;
  occurred_at?: string;
  slot?: {
    id?: string;
    day?: string;
    time?: string;
    name?: string;
    email?: string;
  };
};

const jsonHeaders = { 'Content-Type': 'application/json' };

function env(name: string, fallback = '') {
  return Deno.env.get(name) || fallback;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatEvent(event: AuditionEvent) {
  return event === 'signup' ? 'New audition signup' : 'Audition cancellation';
}

function buildEmail(payload: Required<Pick<AuditionPayload, 'event' | 'slot'>>) {
  const event = payload.event;
  const slot = payload.slot || {};
  const action = formatEvent(event);
  const name = slot.name || 'Unknown singer';
  const email = slot.email || 'No email captured';
  const day = slot.day || 'Unknown day';
  const time = slot.time || 'Unknown time';
  const subject = `Vocal U: ${action} - ${name} at ${day} ${time}`;
  const lines = [
    action,
    '',
    `Name: ${name}`,
    `Email: ${email}`,
    `Slot: ${day}, ${time}`,
  ];

  return {
    subject,
    text: lines.join('\n'),
    html: `
      <div style="font-family: Inter, Arial, sans-serif; line-height: 1.55; color: #1f2937;">
        <h2 style="margin: 0 0 16px; color: #2B4C6F;">${escapeHtml(action)}</h2>
        <table style="border-collapse: collapse; width: 100%; max-width: 520px;">
          <tr>
            <td style="padding: 8px 0; color: #6b7280;">Name</td>
            <td style="padding: 8px 0; font-weight: 700;">${escapeHtml(name)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280;">Email</td>
            <td style="padding: 8px 0;"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280;">Slot</td>
            <td style="padding: 8px 0;">${escapeHtml(day)}, ${escapeHtml(time)}</td>
          </tr>
        </table>
      </div>
    `,
  };
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: jsonHeaders,
    });
  }

  const expectedSecret = env('AUDITION_WEBHOOK_SECRET');
  const providedSecret = req.headers.get('x-audition-webhook-secret') || '';
  if (!expectedSecret || providedSecret !== expectedSecret) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: jsonHeaders,
    });
  }

  const resendApiKey = env('RESEND_API_KEY');
  const notifyTo = env('AUDITION_NOTIFY_TO');
  const notifyFrom = env('AUDITION_NOTIFY_FROM', 'Vocal U Auditions <onboarding@resend.dev>');
  if (!resendApiKey || !notifyTo) {
    return new Response(JSON.stringify({ error: 'Notification email is not configured' }), {
      status: 500,
      headers: jsonHeaders,
    });
  }

  const payload = await req.json().catch(() => null) as AuditionPayload | null;
  if (!payload?.event || !['signup', 'cancel'].includes(payload.event) || !payload.slot?.id) {
    return new Response(JSON.stringify({ error: 'Invalid audition notification payload' }), {
      status: 400,
      headers: jsonHeaders,
    });
  }

  const email = buildEmail({ event: payload.event, slot: payload.slot });
  const resendResponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: notifyFrom,
      to: [notifyTo],
      reply_to: payload.slot.email || undefined,
      subject: email.subject,
      html: email.html,
      text: email.text,
    }),
  });

  const resendResult = await resendResponse.json().catch(() => ({}));
  if (!resendResponse.ok) {
    console.error('Resend audition notification failed', resendResult);
    return new Response(JSON.stringify({ error: 'Email send failed' }), {
      status: 502,
      headers: jsonHeaders,
    });
  }

  return new Response(JSON.stringify({ ok: true, event: payload.event, email_id: resendResult.id }), {
    status: 200,
    headers: jsonHeaders,
  });
});
