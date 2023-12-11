import { ICSEndpoint } from '$lib/calendar_endpoint';

export async function GET({ url }) {
	return ICSEndpoint(url);
}
