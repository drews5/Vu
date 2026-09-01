import { loadSupabase } from './loadSupabase';

export interface AuditionSlotRecord {
  id: string;
  time: string;
  day: string;
  status: 'Available' | 'Booked' | 'Break';
  name?: string;
}

type RequestOptions = {
  attempts: number;
  timeoutMs: number;
};

type SupabaseFailure = {
  code?: string;
  message?: string;
  details?: string;
  hint?: string;
};

const READ_OPTIONS: RequestOptions = { attempts: 3, timeoutMs: 8000 };
const WRITE_OPTIONS: RequestOptions = { attempts: 3, timeoutMs: 12000 };
let rpcAvailability: 'unknown' | 'available' | 'missing' = 'unknown';

export class AuditionApiError extends Error {
  code: string;
  retryable: boolean;

  constructor(message: string, code = 'UNKNOWN', retryable = false) {
    super(message);
    this.name = 'AuditionApiError';
    this.code = code;
    this.retryable = retryable;
  }
}

const wait = (durationMs: number) => new Promise<void>((resolve) => {
  window.setTimeout(resolve, durationMs);
});

function toRequestError(error: unknown): AuditionApiError {
  if (error instanceof AuditionApiError) return error;

  if (error instanceof DOMException && error.name === 'AbortError') {
    return new AuditionApiError('The request timed out.', 'TIMEOUT', true);
  }

  if (error instanceof TypeError) {
    return new AuditionApiError('The network request failed.', 'NETWORK', true);
  }

  if (error && typeof error === 'object') {
    const failure = error as SupabaseFailure;
    const message = failure.message || failure.details || 'The signup service returned an error.';
    if (/abort|timed out/i.test(message)) {
      return new AuditionApiError('The request timed out.', 'TIMEOUT', true);
    }
    if (/failed to fetch|network request|networkerror/i.test(message)) {
      return new AuditionApiError('The network request failed.', 'NETWORK', true);
    }
    const code = failure.code || 'SUPABASE';
    const retryable = !code.startsWith('PGRST') && code !== '42501' && code !== 'P0001';
    return new AuditionApiError(message, code, retryable);
  }

  return new AuditionApiError('The signup service returned an unexpected error.');
}

async function runRequest<T>(
  operation: (signal: AbortSignal) => Promise<T>,
  options: RequestOptions,
): Promise<T> {
  let lastError = new AuditionApiError('The request could not be completed.');

  for (let attempt = 0; attempt < options.attempts; attempt += 1) {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      throw new AuditionApiError('This device is offline.', 'OFFLINE', false);
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), options.timeoutMs);

    try {
      return await operation(controller.signal);
    } catch (error) {
      lastError = toRequestError(error);
      if (!lastError.retryable || attempt === options.attempts - 1) throw lastError;
      await wait(700 * (attempt + 1));
    } finally {
      window.clearTimeout(timeoutId);
    }
  }

  throw lastError;
}

function normalizeSlot(row: any): AuditionSlotRecord {
  const isBreak = row.status === 'Break';
  const isBooked = !isBreak && (row.status === 'Booked' || Boolean(row.name));

  return {
    id: row.id,
    day: row.day,
    time: row.time,
    status: isBreak ? 'Break' : isBooked ? 'Booked' : 'Available',
    name: row.name || undefined,
  };
}

function throwForResponse(error: SupabaseFailure | null, status?: number) {
  if (!error) return;
  const requestError = toRequestError(error);
  if (status && status >= 500) requestError.retryable = true;
  throw requestError;
}

export async function fetchAuditionSlots(): Promise<AuditionSlotRecord[]> {
  return runRequest(async (signal) => {
    const supabase = await loadSupabase();
    const response = await supabase
      .from('auditions')
      .select('id, day, time, status, name')
      .order('time', { ascending: true })
      .abortSignal(signal);

    throwForResponse(response.error, response.status);
    return (response.data || []).map(normalizeSlot);
  }, READ_OPTIONS);
}

async function bookWithRpc(
  id: string,
  name: string,
  email: string,
): Promise<AuditionSlotRecord> {
  return runRequest(async (signal) => {
    const supabase = await loadSupabase();
    const response = await supabase
      .rpc('book_audition_slot', {
        p_slot_id: id,
        p_name: name,
        p_email: email,
      })
      .abortSignal(signal);

    throwForResponse(response.error, response.status);
    rpcAvailability = 'available';
    return normalizeSlot(response.data);
  }, WRITE_OPTIONS);
}

async function bookWithCurrentPolicy(
  id: string,
  name: string,
  email: string,
): Promise<AuditionSlotRecord> {
  return runRequest(async (signal) => {
    const supabase = await loadSupabase();
    const response = await supabase
      .from('auditions')
      .update({ name, email })
      .eq('id', id)
      .eq('status', 'Available')
      .is('name', null)
      .select('id, day, time, status, name')
      .abortSignal(signal);

    throwForResponse(response.error, response.status);
    if (response.data?.[0]) return normalizeSlot(response.data[0]);

    const verification = await supabase
      .from('auditions')
      .select('id, day, time, status, name, email')
      .eq('id', id)
      .abortSignal(signal)
      .maybeSingle();

    throwForResponse(verification.error, verification.status);
    const current = verification.data;
    if (current?.name === name && current?.email?.toLowerCase() === email.toLowerCase()) {
      return normalizeSlot(current);
    }

    throw new AuditionApiError('That spot was just reserved by someone else.', 'SPOT_TAKEN');
  }, WRITE_OPTIONS);
}

export async function bookAuditionSlot(
  id: string,
  name: string,
  email: string,
): Promise<AuditionSlotRecord> {
  if (rpcAvailability !== 'missing') {
    try {
      return await bookWithRpc(id, name, email);
    } catch (error) {
      const requestError = toRequestError(error);
      if (requestError.code !== 'PGRST202') throw requestError;
      rpcAvailability = 'missing';
    }
  }

  return bookWithCurrentPolicy(id, name, email);
}

async function cancelWithRpc(id: string, email: string): Promise<AuditionSlotRecord> {
  return runRequest(async (signal) => {
    const supabase = await loadSupabase();
    const response = await supabase
      .rpc('cancel_audition_slot', {
        p_slot_id: id,
        p_email: email,
      })
      .abortSignal(signal);

    throwForResponse(response.error, response.status);
    rpcAvailability = 'available';
    return normalizeSlot(response.data);
  }, WRITE_OPTIONS);
}

async function cancelWithCurrentPolicy(id: string, email: string): Promise<AuditionSlotRecord> {
  return runRequest(async (signal) => {
    const supabase = await loadSupabase();
    const response = await supabase
      .from('auditions')
      .update({ name: null, email: null, status: 'Available' })
      .eq('id', id)
      .eq('status', 'Available')
      .eq('email', email)
      .select('id, day, time, status, name')
      .abortSignal(signal);

    throwForResponse(response.error, response.status);
    if (response.data?.[0]) return normalizeSlot(response.data[0]);

    const verification = await supabase
      .from('auditions')
      .select('id, day, time, status, name')
      .eq('id', id)
      .abortSignal(signal)
      .maybeSingle();

    throwForResponse(verification.error, verification.status);
    if (verification.data?.status === 'Available' && !verification.data?.name) {
      return normalizeSlot(verification.data);
    }

    throw new AuditionApiError(
      'This reservation could not be cancelled with that email. Please ask a Vocal U member for help.',
      'EMAIL_MISMATCH',
    );
  }, WRITE_OPTIONS);
}

export async function cancelAuditionSlot(id: string, email: string): Promise<AuditionSlotRecord> {
  if (rpcAvailability !== 'missing') {
    try {
      return await cancelWithRpc(id, email);
    } catch (error) {
      const requestError = toRequestError(error);
      if (requestError.code !== 'PGRST202') throw requestError;
      rpcAvailability = 'missing';
    }
  }

  return cancelWithCurrentPolicy(id, email);
}

export function getAuditionFailureMessage(error: unknown, action: 'book' | 'cancel') {
  const requestError = toRequestError(error);
  if (requestError.code === 'OFFLINE') {
    return `You are offline. Reconnect and tap ${action === 'book' ? 'the green check' : '“Cancel audition”'} again.`;
  }
  if (requestError.code === 'TIMEOUT' || requestError.code === 'NETWORK') {
    return `We could not confirm the ${action === 'book' ? 'reservation' : 'cancellation'} over this connection. Your information is still here—check your signal and try again.`;
  }
  if (requestError.code === 'SPOT_TAKEN' || /just reserved|unavailable/i.test(requestError.message)) {
    return 'That spot was just reserved by someone else. Please choose another open spot.';
  }
  if (requestError.code === 'EMAIL_MISMATCH' || /email/i.test(requestError.message)) {
    return action === 'cancel'
      ? 'That UMN email does not match this reservation.'
      : requestError.message;
  }
  return `We could not complete the ${action === 'book' ? 'reservation' : 'cancellation'}. Your information is still here, so it is safe to try again.`;
}
