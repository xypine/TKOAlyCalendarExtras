import ical from 'ical-generator';
import { isAfter, addMinutes } from 'date-fns';
import { getVtimezoneComponent } from '@touch4it/ical-timezones';

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
	pad_minutes: number = 15
): string {
	console.log('pad_minutes', pad_minutes);
	const filteredEvents = filterEvents(events);
	const calendar = ical({ name: 'TKO-äly calendar extras' });
	calendar.timezone({
		name: 'FOO',
		generator: getVtimezoneComponent
	});

	filteredEvents.forEach((event) => {
		// Registration Start Event
		if (event.registration_starts) {
			calendar.createEvent({
				id: `${event.id}-reg-start@tkoaly.fi`,
				start: new Date(event.registration_starts),
				end: new Date(new Date(event.registration_starts).getTime() + pad_minutes * 60 * 1000),
				summary: `Ilmo aukeaa: ${event.name}`,
				description: `Ilmo TKO-älyn tapahtumaan "${event.name}" aukeaa`,
				location: `https://members.tko-aly.fi/event/${event.id}`,
				url: `https://members.tko-aly.fi/event/${event.id}`,
				timezone: 'Europe/Helsinki'
			});
		}

		// Registration End Event
		if (include_registration_ends && event.registration_ends) {
			calendar.createEvent({
				id: `${event.id}-reg-end@tkoaly.fi`,
				start: new Date(event.registration_ends),
				end: new Date(new Date(event.registration_ends).getTime() + pad_minutes * 60 * 1000),
				summary: `Ilmo sulkeutuu: ${event.name}`,
				description: `Ilmo TKO-älyn tapahtumaan "${event.name}" sulkeutuu`,
				location: `https://members.tko-aly.fi/event/${event.id}`,
				url: `https://members.tko-aly.fi/event/${event.id}`,
				timezone: 'Europe/Helsinki'
			});
		}
	});

	return calendar.toString();
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
