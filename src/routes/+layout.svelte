<slot />

<style>
	:global(*) {
		box-sizing: border-box;
		margin: 0;
		padding: 0;
	}

	@media (prefers-color-scheme: dark) {
		:global(body) {
			background-color: #000;
			color: #ddd;
			color-scheme: dark;
		}

		:global(a) {
			color: #f8f800;
		}
	}
</style>
