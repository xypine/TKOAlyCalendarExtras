import { error, text } from '@sveltejs/kit';
import { convertToICS, type TKOÄlyEvent } from './ics';

export async function ICSEndpoint(url: URL) {
	let includeRegistrationEnds;
	let eventLength;
	try {
		includeRegistrationEnds = JSON.parse(url.searchParams.get('includeDeadlines') ?? 'true');
		eventLength = parseInt(url.searchParams.get('eventLength') ?? '0');
		if (eventLength === 0) {
			eventLength = null;
		}
	} catch (e) {
		console.error(e);
		throw error(400, 'Invalid parameters');
	}

	let response;
	try {
		response = await fetch('https://event-api.tko-aly.fi/api/events');
		if (!response.ok) {
			throw error(response.status, 'Failed to fetch events');
		}
	} catch (e) {
		console.error(e);
		throw error(500, 'Failed to fetch events');
	}

	try {
		const events = await response.json();
		if (!events) {
			throw error(500, 'Failed to parse events (null)');
		}
		if (!Array.isArray(events)) {
			throw error(500, 'Failed to parse events (not an array)');
		}
		console.log(events.length, 'events fetched');
		const ics = convertToICS(events as TKOÄlyEvent[], includeRegistrationEnds, eventLength);
		return text(ics, { headers: { 'Content-Type': 'text/calendar' } });
	} catch (e) {
		console.error(e);
		throw error(500, 'Failed to parse events');
	}
}
