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
		}

		:global(a) {
			color: #94d8b0;
		}
	}
</style>
