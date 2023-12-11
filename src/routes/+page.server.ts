import { filterEvents, type TKOÄlyEvent } from '$lib/ics';
import type { PageServerLoad } from './$types';

export const load = (async ({ fetch }) => {
	const events = fetch('https://event-api.tko-aly.fi/api/events')
		.then((response) => response.json())
		.then((data) => data as TKOÄlyEvent[])
		.then((data) => filterEvents(data));

	return {
		streamed: {
			events
		}
	};
}) satisfies PageServerLoad;
