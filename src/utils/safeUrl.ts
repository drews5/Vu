export function getSafeExternalUrl(value: unknown) {
  if (typeof value !== 'string' || value.trim() === '') return undefined;

  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}
