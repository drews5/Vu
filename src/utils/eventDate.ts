const timePattern = /(\d{1,2})(?::(\d{2}))?\s*(AM|PM)/i;

export function parseEventDate(rawDate: string, displayTime?: string | null) {
  const dateParts = rawDate.match(/^(\d{4})-(\d{2})-(\d{2})/);
  const timeParts = displayTime?.match(timePattern);

  if (!dateParts) {
    return new Date(rawDate);
  }

  const [, year, month, day] = dateParts;
  let hours = 12;
  let minutes = 0;

  if (timeParts) {
    hours = Number(timeParts[1]);
    minutes = Number(timeParts[2] || '0');
    const meridiem = timeParts[3].toUpperCase();

    if (meridiem === 'PM' && hours < 12) hours += 12;
    if (meridiem === 'AM' && hours === 12) hours = 0;
  }

  return new Date(Number(year), Number(month) - 1, Number(day), hours, minutes);
}

export function isEventUpcoming(date: Date, now = new Date()) {
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  return endOfDay >= now;
}

export function toCalendarTimestamp(date: Date) {
  return date.toISOString().replace(/-|:|\.\d{3}/g, '');
}

export function getGoogleCalendarUrl({
  title,
  start,
  description,
  location,
  durationHours = 2,
}: {
  title: string;
  start: Date;
  description: string;
  location: string;
  durationHours?: number;
}) {
  const end = new Date(start.getTime() + durationHours * 60 * 60 * 1000);
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${toCalendarTimestamp(start)}/${toCalendarTimestamp(end)}`,
    details: description,
    location,
  });

  return `https://www.google.com/calendar/render?${params.toString()}`;
}
