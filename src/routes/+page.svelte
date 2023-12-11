<script lang="ts">
	import SvelteSeo from 'svelte-seo';
	import type { PageServerData } from './$types';
	import { slide } from 'svelte/transition';
	import { formatDateToICS } from '$lib/ics';
	let includeDeadlines = true;
	let eventLength = 45;

	let btntext: string | null = null;
	let btnclass = false;

	function getCalendarURL(serverSide: boolean, webcal = false) {
		const params = new URLSearchParams();
		if (!includeDeadlines) {
			params.set('includeDeadlines', 'false');
		}
		if (eventLength !== 45) {
			params.set('eventLength', eventLength.toString());
		}
		let origin = 'https://tko-extras.ruta.fi';
		if (!serverSide) {
			origin = window.location.origin;
		}
		const link = new URL(`${origin}/tko_extras.ics`);
		link.search = params.toString();
		if (webcal) {
			link.protocol = 'webcal:';
		}
		return link.toString();
	}

	function copylink() {
		const link = getCalendarURL(false, false);
		navigator.clipboard.writeText(link);
		btntext = 'copied!';
		btnclass = true;
		setTimeout(() => {
			btntext = null;
			btnclass = false;
		}, 1000);
	}

	export let data: PageServerData;
</script>

<SvelteSeo
	title="Calendar extras"
	description="Additional calendar events from the TKO-äly calendar"
	openGraph={{
		title: 'TKO-äly calendar extras',
		description: 'Additional calendar events from the TKO-äly calendar',
		url: `https://tko-extras.ruta.fi/`,
		site_name: 'ruta.fi'
	}}
	keywords="TKO-äly, calendar, events, registration, deadlines"
/>

<main>
	<div class="spacer" />
	<h1>TKO-äly calendar extras</h1>
	<div class="panels">
		<form>
			<h2>Subscribe</h2>
			<label>
				<p>Include registration reminders</p>
				<input type="checkbox" checked disabled />
			</label>
			<label>
				<p>Include registration deadlines</p>
				<input type="checkbox" bind:checked={includeDeadlines} />
			</label>
			<label>
				<p>Event length in minutes</p>
				<input type="number" min="0" max="720" bind:value={eventLength} />
				<button
					class="info"
					title="longer events may be easier to see on your calendar"
					on:click={(e) => {
						if (e.target && 'title' in e.target && e.target.title) {
							// alert the title of the button
							alert(e.target.title);
						}
					}}
				>
					?
				</button>
			</label>

			<button
				class="copylink"
				class:copied={btnclass}
				on:click={() => {
					copylink();
				}}
			>
				{btntext || 'copy calendar link'}
			</button>
		</form>
		<div class="preview">
			<h2>Preview</h2>
			{#await data.streamed.events}
				<div class="events">
					<p class="event">Loading...</p>
				</div>
			{:then events}
				{@const withreg = events.filter((e) => e.registration_starts)}
				{@const spliced = withreg.toSpliced(2)}
				{@const generated_events = spliced.flatMap((e) => {
					const e_start = {
						type: 'Ilmo aukeaa',
						text: e.name.split('//').at(0),
						id: e.id,
						date: e.registration_starts
					};
					const e_end = {
						type: 'Ilmo sulkeutuu',
						text: e.name.split('//').at(0),
						id: e.id,
						date: e.registration_ends
					};
					return includeDeadlines ? [e_start, e_end] : [e_start];
				})}
				<p>
					{generated_events.length} of {withreg.length * (includeDeadlines ? 2 : 1)} upcoming events:
				</p>
				<div class="events">
					{#each generated_events as event, index (event.date)}
						{#if event.date}
							<a
								data-includes-deadlines={includeDeadlines}
								data-type={event.type}
								class="event"
								href={`https://members.tko-aly.fi/calendar_events/view/${event.id}`}
								target="_blank"
								title={formatDateToICS(event.date)}
								transition:slide|global={{ delay: index * 100, duration: 250 }}
							>
								<p><small>{event.type}</small></p>
								<b><small>{event.text}</small></b>
								<p><code>{new Date(event.date).toLocaleString()}</code></p>
							</a>
						{/if}
					{/each}
				</div>
			{/await}
		</div>
	</div>
	<div class="spacer" />
	<p>
		made by <a target="_blank" href="https://eliaseskelinen.fi">elias eskelinen</a>, you can
		contribute on
		<a target="_blank" href="https://github.com/xypine/TKOAlyCalendarExtras">github</a>
	</p>
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		min-height: 100vh;
		min-height: 100svh;
		gap: 1em;
		padding: 1em;

		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
	}
	.panels {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: center;
		gap: 1em;
	}
	.preview {
		padding: 1em;
		text-align: right;
	}
	.events {
		width: 300px;
		display: flex;
		flex-direction: column;
		gap: 0.5em;
		padding-top: 0.25em;
	}
	.event {
		max-width: 300px;
		color: inherit;
		text-decoration: none;
		padding: 0.5em;
		border-right: 0.1em solid transparent;
		transition: transform 0.2s, background-color 0.5s ease-in-out, border-color 0.5s ease-in-out;
	}
	.event[data-type='Ilmo aukeaa'] {
		border-color: #1f11;
		background-color: #1f11;
	}
	.event[data-type='Ilmo sulkeutuu'] {
		border-color: #f111;
		background-color: #f111;
	}
	.event[data-includes-deadlines='false'] {
		border-color: #fff1;
		background-color: #fff1;
	}
	.event:hover {
		transform: scale(1.05) translateX(0.5em);
	}
	form {
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 0.5em;
		padding: 1em;
	}
	label {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 1em;
	}
	label input,
	label p {
		flex: 1;
	}
	label input {
		text-align: center;
	}
	label button {
		border: 1px solid;
		border-radius: 9999999999px;
		width: 1.5em;
		height: 1.5em;
		display: flex;
		justify-content: center;
		align-items: center;
		font-weight: bold;
		background-color: transparent;
		cursor: pointer;
		color: inherit;
	}
	.copylink {
		padding: 0.5em 1em;
		border: 1px solid #000;
		border-radius: 0.5em;
		background-color: #fff;
		font-size: 1em;
		font-weight: 600;
		cursor: pointer;
		color: #000;
		text-decoration: none;
		font-weight: inherit;
		font-size: 0.95rem;
		font-family: inherit;
	}
	.copylink:hover {
		background-color: #eee;
	}
	.copylink:active {
		background-color: #ddd;
	}
	.copylink.copied {
		background-color: #f8f800;
	}
	.spacer {
		flex-grow: 1;
	}

	@media (max-width: 700px) {
		main {
			justify-content: flex-start;
		}
		.spacer:nth-of-type(1) {
			flex-grow: 0;
		}
		.preview {
			text-align: center;
		}
		.events {
			text-align: left;
		}
	}
</style>
