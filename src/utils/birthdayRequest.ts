export type BirthdayRequest = {
  package: 'video' | 'live';
  song: string;
  recipient: string;
  date: string;
  plans: string;
  notes: string;
};

export function birthdayRequestText(request: BirthdayRequest) {
  const live = request.package === 'live';
  return [
    'Hi Vocal U!',
    '',
    `I'd like to request ${live ? 'an in-person birthday song ($50)' : 'a birthday video ($5)'}.`,
    '',
    `Birthday person's name: ${request.recipient.trim()}`,
    `${live ? 'Day' : 'Video needed by'}: ${request.date}`,
    `Song: ${live ? request.song : 'Happy Birthday'}`,
    ...(live && request.plans.trim() ? [`Where and about what time: ${request.plans.trim()}`] : []),
    ...(request.notes.trim() ? ['', request.notes.trim()] : []),
  ].join('\n');
}

export function birthdayRequestSubject(request: BirthdayRequest) {
  return request.recipient.trim() ? `Birthday song for ${request.recipient.trim()}` : 'Birthday song request';
}
