import { error, text } from '@sveltejs/kit';
import { convertToICS, type TKOÄlyEvent } from '$lib/ics';

export async function GET({ url }) {
	let includeRegistrationEnds;
	try {
		includeRegistrationEnds = JSON.parse(url.searchParams.get('includeDeadlines') ?? 'true');
	} catch (e) {
		console.error(e);
		throw error(400, 'Invalid includeDeadlines parameter');
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
		const ics = convertToICS(events as TKOÄlyEvent[], includeRegistrationEnds);
		return text(ics, { headers: { 'Content-Type': 'text/calendar' } });
	} catch (e) {
		console.error(e);
		throw error(500, 'Failed to parse events');
	}
}
