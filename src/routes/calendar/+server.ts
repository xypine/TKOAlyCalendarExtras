import { error, text } from '@sveltejs/kit';
import { convertToICS, type TKOÄlyEvent } from '$lib/ics';

export async function GET({ url }) {
	let includeRegistrationEnds;
	try {
		includeRegistrationEnds = JSON.parse(url.searchParams.get('includeDeadlines') ?? 'true');
	} catch (e) {
		throw error(400, 'Invalid includeDeadlines parameter');
	}

	let response;
	try {
		response = await fetch('https://event-api.tko-aly.fi/api/events');
		if (!response.ok) {
			throw error(response.status, 'Failed to fetch events');
		}
	} catch (e) {
		throw error(500, 'Failed to fetch events');
	}

	try {
		const events = await response.json();
		if (!events) {
			throw error(500, 'Failed to parse events');
		}
		if (!Array.isArray(events)) {
			throw error(500, 'Failed to parse events');
		}
		console.log(events.length, 'events fetched');
		const ics = convertToICS(events as TKOÄlyEvent[], includeRegistrationEnds);
		return text(ics, { headers: { 'Content-Type': 'text/calendar' } });
	} catch (e) {
		throw error(500, 'Failed to parse events');
	}
}
