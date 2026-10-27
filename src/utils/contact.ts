import { fetchWithTimeout } from './network';

export const contactEmail = 'vocalu@umn.edu';

export async function submitContactMessage(payload: {
  name: string;
  email: string;
  subject?: string;
  message: string;
}): Promise<void> {
  const response = await fetchWithTimeout(`https://formsubmit.co/ajax/${contactEmail}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      name: payload.name.trim(),
      email: payload.email.trim(),
      message: payload.message.trim(),
      _subject: payload.subject?.trim() || 'New message from the Vocal U website',
      _replyto: payload.email.trim(),
      _template: 'table',
      _url: window.location.href,
    }),
  }, 20000);

  if (!response.ok) {
    throw new Error(`Contact submission failed with status ${response.status}.`);
  }

  const result: { success?: boolean | string } = await response.json();
  if (result?.success !== true && result?.success !== 'true') {
    throw new Error('The form service did not accept the submission.');
  }
}
