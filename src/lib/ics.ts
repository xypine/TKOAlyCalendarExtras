import { isAfter, addMinutes } from 'date-fns';

export type TKOÄlyEvent = {
	id: number;
	name: string;
	user_id: number | null;
	price: string;
	created: string | null;
	starts: string;
	registration_starts: string | null;
	registration_ends: string | null;
	cancellation_starts: string | null;
	cancellation_ends: string | null;
	organizer: Organizer | null;
	location: string;
	category: null | string;
	description: string;
	deleted: number;
};
type Organizer = string;

export function convertToICS(
	events: TKOÄlyEvent[],
	include_registration_ends: boolean = true,
	pad_minutes: number | null = 15
): string {
	const filteredEvents = filterEvents(events);
	let icsFile = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//TKOÄly Events Calendar//EN
NAME:TKO-äly calendar extras
X-WR-CALNAME:TKO-äly calendar extras
CALSCALE:GREGORIAN
METHOD:PUBLISH
`;

	filteredEvents.forEach((event) => {
		// Registration Start Event
		if (event.registration_starts) {
			icsFile += `BEGIN:VEVENT\n`;
			icsFile += `UID:${event.id}-reg-start@tkoaly.fi\n`;
			icsFile += `DTSTART:${formatDateToICS(event.registration_starts)}\n`;
			if (pad_minutes != null) {
				icsFile += `DTEND:${formatDateToICS(
					new Date(new Date(event.registration_starts).getTime() + pad_minutes * 60 * 1000)
				)}\n`;
			}
			icsFile += `DTSTAMP:${formatDateToICS(new Date())}\n`;
			icsFile += `SUMMARY:Ilmo aukeaa: ${event.name}\n`;
			icsFile += `LOCATION:https://members.tko-aly.fi/event/${event.id}\n`;
			icsFile += `DESCRIPTION:Ilmo TKO-älyn tapahtumaan "${event.name}" aukeaa\n`;
			icsFile += `END:VEVENT\n`;
		}

		// Registration End Event
		if (include_registration_ends && event.registration_ends) {
			icsFile += `BEGIN:VEVENT\n`;
			icsFile += `UID:${event.id}-reg-end@tkoaly.fi\n`;
			icsFile += `DTSTART:${formatDateToICS(event.registration_ends)}\n`;
			if (pad_minutes != null) {
				icsFile += `DTEND:${formatDateToICS(
					new Date(new Date(event.registration_ends).getTime() + pad_minutes * 60 * 1000)
				)}\n`;
			}
			icsFile += `DTSTAMP:${formatDateToICS(new Date())}\n`;
			icsFile += `SUMMARY:Ilmo sulkeutuu: ${event.name}\n`;
			icsFile += `LOCATION:https://members.tko-aly.fi/event/${event.id}\n`;
			icsFile += `DESCRIPTION:Ilmo TKO-älyn tapahtumaan "${event.name}" sulkeutuu\n`;
			icsFile += `END:VEVENT\n`;
		}
	});

	icsFile += `END:VCALENDAR`;

	return icsFile;
}

export function filterEvents(events: TKOÄlyEvent[]): TKOÄlyEvent[] {
	return events.filter(
		({ deleted, name, starts }) =>
			!deleted &&
			!name.includes('TEMPLATE') &&
			isAfter(new Date(starts), addMinutes(new Date(), -15))
	);
}

export function formatDateToICS(date: Date | string): string {
	const pad = (num: number) => num.toString().padStart(2, '0');

	const actual_date = new Date(date);
	const year = actual_date.getUTCFullYear();
	const month = pad(actual_date.getUTCMonth() + 1); // getUTCMonth() returns 0-11
	const day = pad(actual_date.getUTCDate());
	const hours = pad(actual_date.getUTCHours());
	const minutes = pad(actual_date.getUTCMinutes());
	const seconds = pad(actual_date.getUTCSeconds());

	return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
}
