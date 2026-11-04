import { fetchWithTimeout } from './network';

export async function submitMerchInterest(endpoint: string, payload: Record<string, FormDataEntryValue>): Promise<void> {
  if (!/^https:\/\/submit-form\.com\/[a-zA-Z0-9]+$/.test(endpoint)) {
    throw new Error('Merch submissions aren’t open yet. Please try again shortly.');
  }
  const response = await fetchWithTimeout(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ form: 'Vocal U merch interest', ...payload }),
  }, 30000);
  if (!response.ok) {
    throw new Error('We couldn’t send your form. Please try again. Your choices are still here.');
  }
}
