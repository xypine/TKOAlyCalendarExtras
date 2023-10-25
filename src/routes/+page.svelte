<script lang="ts">
	import SvelteSeo from 'svelte-seo';
	let includeDeadlines = true;

	let btntext: string | null = null;
	let btnclass = '';
	function copylink() {
		const link = `${window.location.origin}/calendar${
			includeDeadlines ? '' : '?includeDeadlines=false'
		}`;
		navigator.clipboard.writeText(link);
		btntext = 'copied!';
		btnclass = 'copied';
		setTimeout(() => {
			btntext = null;
			btnclass = '';
		}, 1000);
	}
</script>

<SvelteSeo
	title="Calendar extras"
	description="Additional calendar events from the TKO-äly calendar"
	openGraph={{
		title: 'TKO-äly calendar extras',
		description: 'Additional calendar events from the TKO-äly calendar',
		url: `https://tko-extras.ruta.fi/calendar`,
		site_name: 'ruta.fi'
	}}
	keywords="TKO-äly, calendar, events, registration, deadlines"
/>

<main>
	<div class="spacer" />
	<h1>TKO-äly calendar extras</h1>
	<label>
		Include events for when the registration opens
		<input type="checkbox" checked disabled />
	</label>
	<label>
		Include the deadlines for registration
		<input type="checkbox" bind:checked={includeDeadlines} />
	</label>
	<button
		class={btnclass}
		on:click={() => {
			copylink();
		}}
	>
		{btntext || 'copy calendar link'}
	</button>
	<div class="spacer" />
	<p>
		made by <a target="_blank" href="https://eliaseskelinen.fi">Elias Eskelinen</a>, contribute on
		<a target="_blank" href="https://github.com/xypine/TKOAlyCalendarExtras">GitHub</a>
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
	button {
		padding: 0.5em 1em;
		border: 1px solid #000;
		border-radius: 0.5em;
		background-color: #fff;
		font-size: 1em;
		font-weight: 600;
		cursor: pointer;
	}
	button:hover {
		background-color: #eee;
	}
	button:active {
		background-color: #ddd;
	}
	button.copied {
		background-color: #8de67f;
	}
	.spacer {
		flex-grow: 1;
	}
</style>
