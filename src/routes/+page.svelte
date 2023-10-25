<script lang="ts">
	import SvelteSeo from 'svelte-seo';
	let includeDeadlines = true;
	let eventLength = 45;

	let btntext: string | null = null;
	let btnclass = false;
	function copylink() {
		const params = new URLSearchParams();
		if (!includeDeadlines) {
			params.set('includeDeadlines', 'false');
		}
		if (eventLength !== 45) {
			params.set('eventLength', eventLength.toString());
		}
		const link = new URL(`${window.location.origin}/calendar`);
		link.search = params.toString();
		navigator.clipboard.writeText(link.toString());
		btntext = 'copied!';
		btnclass = true;
		setTimeout(() => {
			btntext = null;
			btnclass = false;
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
	<form>
		<label>
			<p>Include events for when the registration opens</p>
			<input type="checkbox" checked disabled />
		</label>
		<label>
			<p>Include the deadlines for registration</p>
			<input type="checkbox" bind:checked={includeDeadlines} />
		</label>
		<label>
			<p>Event length in minutes</p>
			<input type="number" min="0" max="720" bind:value={eventLength} />
			<button
				title="longer events are easier to see on your calendar"
				on:click={(e) => {
					if (e.target && 'title' in e.target && e.target.title) {
						// alert the title of the button
						alert(e.target.title);
					}
				}}
			>
				🛈
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
	form {
		display: flex;
		flex-direction: column;
		gap: 0.5em;
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
		border: none;
		background-color: transparent;
		cursor: pointer;
		color: inherit;
	}
	button.copylink {
		padding: 0.5em 1em;
		border: 1px solid #000;
		border-radius: 0.5em;
		background-color: #fff;
		font-size: 1em;
		font-weight: 600;
		cursor: pointer;
		color: #000;
	}
	button.copylink:hover {
		background-color: #eee;
	}
	button.copylink:active {
		background-color: #ddd;
	}
	button.copylink.copied {
		background-color: #f8f800;
	}
	.spacer {
		flex-grow: 1;
	}
</style>
