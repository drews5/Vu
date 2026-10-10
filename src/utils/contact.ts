import { fetchWithTimeout } from './network';

export const contactEmail = 'vocalu@umn.edu';

export async function submitContactMessage(payload: {
  name: string;
  email: string;
  subject?: string;
  message: string;
}): Promise<void> {
  const response = await fetchWithTimeout('https://formspree.io/f/xanygerw', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }, 12000);

  if (!response.ok) {
    throw new Error(`Contact submission failed with status ${response.status}.`);
  }
}
