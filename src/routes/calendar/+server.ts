import { error, text } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { convertToICS, type TKOÄlyEvent } from '$lib/ics';
export const GET: RequestHandler = async ({ fetch, url }) => {
	const includeRegistrationEnds = JSON.parse(url.searchParams.get('includeDeadlines') ?? 'true');

	const response = await fetch('https://event-api.tko-aly.fi/api/events');
	if (!response.ok) {
		return error(response.status, 'Failed to fetch events');
	}
	const data = await response.json();
	if (!data) {
		return error(500, 'Failed to parse events');
	}
	if (!Array.isArray(data)) {
		return error(500, 'Failed to parse events');
	}
	console.log(data.length, 'events fetched');
	const ics = convertToICS(data as TKOÄlyEvent[], includeRegistrationEnds);
	return text(ics, { headers: { 'Content-Type': 'text/calendar' } });
};
